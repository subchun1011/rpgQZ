import { gameManager } from "../utils/GameManager.js";

export default class World extends Phaser.Scene {
  constructor() {
    super("World");
  }

  create() {
    const { width, height } = this.scale;

    // 1. 배경 설정
    this.background = this.add.rectangle(0, 0, width, height, 0x284b3f).setOrigin(0);
    this.cameras.main.setBackgroundColor("#284b3f");

    // 2. 애니메이션 등록 (기사 걷기 및 공격)
    this.createAnimations();

    // 3. 물리 그룹 설정 (나무들)
    this.trees = this.physics.add.staticGroup();
    for (let i = 0; i < 5; i++) {
        const x = Phaser.Math.Between(100, width - 100);
        const y = Phaser.Math.Between(100, height - 100);
        // 나중에 나무 이미지로 교체 가능하도록 설정
        const tree = this.add.rectangle(x, y, 40, 40, 0x2ed573);
        this.trees.add(tree);
    }

    // 4. 플레이어 기사 생성 (노란 원 대체)
    this.player = this.physics.add.sprite(width / 2, height / 2, 'knight_hero', 1);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(20, 20).setOffset(6, 12); // 충돌 박스 최적화
    this.lastDirection = 'down';
    this.isAttacking = false;

    // 5. 입력 설정
    this.cursors = this.input.keyboard.createCursorKeys();
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // 6. UI 설정 (상단 정보 및 가이드)
    this.uiText = this.add.text(20, 20, this.getInventoryString(), {
        fontSize: '18px', fill: '#ffffff', backgroundColor: '#00000055', padding: { x: 10, y: 5 }
    });

    this.guideText = this.add.text(width / 2, height - 30, "방향키: 이동 | E: 공격(채집) | B: 전투", {
        fontSize: "14px", color: "#cce3d5"
    }).setOrigin(0.5);

    // 7. 모바일용 액션 버튼 (공격/채집용)
    this.createMobileActionButton();

    // 8. 충돌 설정
    this.physics.add.collider(this.player, this.trees);
    
    this.input.keyboard.on('keydown-B', () => this.scene.start('Battle'));

    // 리사이즈 이벤트
    this.handleResize = (gameSize) => this.layout(gameSize.width, gameSize.height);
    this.scale.on("resize", this.handleResize);
    this.events.once("shutdown", () => this.scale.off("resize", this.handleResize));

    this.layout(width, height);
  }

  createAnimations() {
    // 걷기 애니메이션 (0-2: 하, 3-5: 좌, 6-8: 우, 9-11: 상)
    const directions = ['down', 'left', 'right', 'up'];
    directions.forEach((dir, i) => {
        this.anims.create({
            key: `walk-${dir}`,
            frames: this.anims.generateFrameNumbers('knight_hero', { start: i * 3, end: i * 3 + 2 }),
            frameRate: 10, repeat: -1
        });
        this.anims.create({
            key: `idle-${dir}`,
            frames: [{ key: 'knight_hero', frame: i * 3 + 1 }],
            frameRate: 10
        });
        // 공격 애니메이션 (동일한 행 구조 가정)
        this.anims.create({
            key: `attack-${dir}`,
            frames: this.anims.generateFrameNumbers('knight_hero_attack', { start: i * 3, end: i * 3 + 2 }),
            frameRate: 15, repeat: 0
        });
    });
  }

  createMobileActionButton() {
    const { width, height } = this.scale;
    this.actionButton = this.add.circle(0, 0, 40, 0xffffff, 0.2)
        .setInteractive()
        .setScrollFactor(0)
        .on('pointerdown', () => this.performAttack());

    this.actionBtnText = this.add.text(0, 0, "ACTION", { fontSize: '16px', color: '#fff' })
        .setOrigin(0.5).setScrollFactor(0);
  }

  update() {
    if (this.isAttacking) return; // 공격 중에는 이동 불가

    const speed = 200;
    this.player.body.setVelocity(0);
    let moving = false;

    // 1. 키보드 이동 로직
    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-speed);
        this.player.anims.play('walk-left', true);
        this.lastDirection = 'left';
        moving = true;
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(speed);
        this.player.anims.play('walk-right', true);
        this.lastDirection = 'right';
        moving = true;
    }

    if (this.cursors.up.isDown) {
        this.player.body.setVelocityY(-speed);
        if(!moving) this.player.anims.play('walk-up', true);
        this.lastDirection = 'up';
        moving = true;
    } else if (this.cursors.down.isDown) {
        this.player.body.setVelocityY(speed);
        if(!moving) this.player.anims.play('walk-down', true);
        this.lastDirection = 'down';
        moving = true;
    }

    // 2. 터치 이동 로직 (화면을 누르고 있을 때만)
    if (!moving && this.input.activePointer.isDown && this.input.activePointer.x < 800) {
        this.physics.moveToObject(this.player, this.input.activePointer, speed);
        // 각도에 따른 애니메이션 선택
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.input.activePointer.x, this.input.activePointer.y);
        const deg = Phaser.Math.RadToDeg(angle);
        
        if (deg > -45 && deg <= 45) { this.player.anims.play('walk-right', true); this.lastDirection = 'right'; }
        else if (deg > 45 && deg <= 135) { this.player.anims.play('walk-down', true); this.lastDirection = 'down'; }
        else if (deg > -135 && deg <= -45) { this.player.anims.play('walk-up', true); this.lastDirection = 'up'; }
        else { this.player.anims.play('walk-left', true); this.lastDirection = 'left'; }
        moving = true;
    }

    if (!moving) {
        this.player.anims.play(`idle-${this.lastDirection}`, true);
    }

    // 공격 실행 (E키)
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        this.performAttack();
    }
  }

  performAttack() {
    if (this.isAttacking) return;
    this.isAttacking = true;
    this.player.body.setVelocity(0);

    this.player.play(`attack-${this.lastDirection}`);
    
    // 공격 애니메이션 중간 혹은 끝에 채집 판정
    this.time.delayedCall(150, () => {
        this.checkHarvest();
    });

    this.player.once('animationcomplete', () => {
        this.isAttacking = false;
    });
  }

  checkHarvest() {
    const tree = this.trees.getChildren().find(t => 
        Phaser.Math.Distance.Between(this.player.x, this.player.y, t.x, t.y) < 70
    );

    if (tree) {
        tree.destroy();
        const axeLevel = gameManager.getState().equipment.axeLevel;
        gameManager.updateResource('wood', axeLevel);
        this.uiText.setText(this.getInventoryString());
        this.cameras.main.shake(100, 0.005);
    }
  }

  getInventoryString() {
    const state = gameManager.getState();
    return `🌲 나무: ${state.resources.wood} | 💰 골드: ${state.gold}`;
  }

  layout(width, height) {
    if (this.background) {
      this.background.setSize(width, height);
    }
    if (this.player?.body) {
      this.physics.world.setBounds(0, 0, width, height);
    }
    if (this.uiText) this.uiText.setPosition(20, 20);
    if (this.guideText) this.guideText.setPosition(width / 2, height - 30);
    
    // 모바일 액션 버튼 위치 조정 (우측 하단)
    if (this.actionButton) {
        this.actionButton.setPosition(width - 80, height - 80);
        this.actionBtnText.setPosition(width - 80, height - 80);
    }
  }
}