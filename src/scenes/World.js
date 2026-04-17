import { gameManager } from "../utils/GameManager.js";

export default class World extends Phaser.Scene {
  constructor() {
    super("World");
  }

  create() {
    const { width, height } = this.scale;

    // 1. 배경 설정 (필드 느낌의 딥 그린)
    this.background = this.add
      .rectangle(0, 0, width, height, 0x284b3f)
      .setOrigin(0);
    this.cameras.main.setBackgroundColor("#284b3f");

    // 2. 물리 그룹 설정 (나무들)
    this.trees = this.physics.add.staticGroup();
    
    // 샘플 나무 배치 (도형: 초록색 사각형)
    for (let i = 0; i < 5; i++) {
        const x = Phaser.Math.Between(100, width - 100);
        const y = Phaser.Math.Between(100, height - 100);
        const tree = this.add.rectangle(x, y, 40, 40, 0x2ed573);
        this.trees.add(tree);
    }

    // 3. 플레이어 생성 (도형: 노란색 원)
    this.player = this.add.circle(width / 2, height / 2, 20, 0xf1c40f);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // 4. 입력 설정
    this.cursors = this.input.keyboard.createCursorKeys();
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // 5. 상단 UI (자원 표시)
    this.uiText = this.add.text(20, 20, this.getInventoryString(), {
        fontSize: '18px',
        fill: '#ffffff',
        backgroundColor: '#00000055',
        padding: { x: 10, y: 5 }
    });

    // 가이드 텍스트
    this.guideText = this.add.text(width / 2, height - 30, "방향키: 이동 | E: 나무 베기 | B: 전투 테스트", {
        fontSize: "14px",
        color: "#cce3d5"
    }).setOrigin(0.5);

    // 6. 충돌 및 상호작용 설정
    this.physics.add.collider(this.player, this.trees);
    
    // 전투 씬 테스트용 키 (B)
    this.input.keyboard.on('keydown-B', () => {
        this.scene.start('Battle');
    });

    this.handleResize = (gameSize) => {
      this.layout(gameSize.width, gameSize.height);
    };

    this.scale.on("resize", this.handleResize);
    this.events.once("shutdown", () => {
      this.scale.off("resize", this.handleResize);
    });

    this.layout(width, height);
  }

  update() {
    const speed = 200;
    this.player.body.setVelocity(0);

    // 8방향 이동 로직
    if (this.cursors.left.isDown) this.player.body.setVelocityX(-speed);
    else if (this.cursors.right.isDown) this.player.body.setVelocityX(speed);

    if (this.cursors.up.isDown) this.player.body.setVelocityY(-speed);
    else if (this.cursors.down.isDown) this.player.body.setVelocityY(speed);

    // 나무 채집 체크 (E키)
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        this.checkHarvest();
    }else{
        // 터치한 지점과 플레이어 사이의 각도를 계산하여 이동
        this.physics.moveToObject(this.player, this.input.activePointer, speed);
        
        // 나무 근처라면 자동으로 채집 시도 (모바일은 'E'키가 없으므로)
        this.checkHarvest();
    }
  }

  checkHarvest() {
    // 플레이어 주변의 나무 찾기 (반경 50px)
    const tree = this.trees.getChildren().find(t => 
        Phaser.Math.Distance.Between(this.player.x, this.player.y, t.x, t.y) < 60
    );

    if (tree) {
        // 나무 제거 (채집 효과)
        tree.destroy();
        // GameManager 데이터 업데이트
        gameManager.updateResource('wood', 1);
        this.uiText.setText(this.getInventoryString());
        
        // 간단한 흔들림 효과 (피드백)
        this.cameras.main.shake(100, 0.005);
        console.log("나무 획득! 현재 나무:", gameManager.getState().resources.wood);
    }
  }

  getInventoryString() {
    const state = gameManager.getState();
    return `🌲 나무: ${state.resources.wood} | 💰 골드: ${state.gold}`;
  }

  layout(width, height) {
    if (this.background) {
      this.background.setPosition(0, 0);
      this.background.setSize(width, height);
    }

    if (this.player?.body) {
      this.physics.world.setBounds(0, 0, width, height);
      this.player.body.setCollideWorldBounds(true);

      this.player.x = Phaser.Math.Clamp(this.player.x, 20, width - 20);
      this.player.y = Phaser.Math.Clamp(this.player.y, 20, height - 20);
    }

    if (this.uiText) {
      this.uiText.setPosition(20, 20);
    }

    if (this.guideText) {
      this.guideText.setPosition(width / 2, height - 30);
    }
  }
}
