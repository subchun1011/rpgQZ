import { gameManager } from "../utils/GameManager.js";

export default class Battle extends Phaser.Scene {
  constructor() {
    super("Battle");
  }

  init() {
    // 씬 시작 시 데이터 초기화
    this.state = gameManager.getState();
    this.currentProblem = null;
    this.isProcessing = false; // 중복 클릭 방지
  }

  create() {
    const { width, height } = this.scale;

    // 1. 배경 및 레이아웃 (어두운 전투 분위기)
    this.background = this.add.rectangle(0, 0, width, height, 0x1b1b1b).setOrigin(0);
    
    // 플레이어 영역 (파란색 사각형)
    this.playerSide = this.add.rectangle(width * 0.2, height * 0.5, 100, 150, 0x3498db);
    // 몬스터 영역 (빨간색 사각형)
    this.enemySide = this.add.rectangle(width * 0.8, height * 0.5, 120, 180, 0xe74c3c);

    // 2. 문제 카드 영역 (UI)
    this.problemCard = this.add.rectangle(width / 2, height * 0.25, 400, 150, 0xffffff, 0.1)
      .setStrokeStyle(2, 0xffffff);
    
    this.problemText = this.add.text(width / 2, height * 0.25, "", {
        fontSize: "48px",
        fontFamily: "Arial",
        color: "#ffffff"
    }).setOrigin(0.5);

    // 3. 답변 버튼 그룹 (Container)
    this.answerButtons = this.add.container(0, 0);
    
    // 4. 초기 문제 생성
    this.generateProblem();

    this.handleResize = (gameSize) => {
      this.layout(gameSize.width, gameSize.height);
    };

    this.scale.on("resize", this.handleResize);
    this.events.once("shutdown", () => {
      this.scale.off("resize", this.handleResize);
    });
  }

  generateProblem() {
    const config = this.state.subjectSettings[this.state.currentSubject];
    const level = this.state.level;

    // 간단한 수학 문제 생성기 (확장 포인트: 나중에 JSON 문제 은행과 연동)
    const num1 = Phaser.Math.Between(1, 10 * level);
    const num2 = Phaser.Math.Between(1, 10 * level);
    const answer = num1 + num2;
    
    this.currentProblem = {
        question: `${num1} + ${num2} = ?`,
        answer: answer,
        options: this.shuffleArray([answer, answer + 2, answer - 1, answer + 5])
    };

    this.updateBattleUI();
  }

  updateBattleUI() {
    const { width, height } = this.scale;
    this.problemText.setText(this.currentProblem.question);
    
    // 기존 버튼 제거
    this.answerButtons.removeAll(true);

    // 새로운 답변 버튼 생성
    this.currentProblem.options.forEach((opt, index) => {
        const x = width * (0.2 + (index * 0.2));
        const y = height * 0.75;
        
        const btn = this.add.rectangle(0, 0, 120, 60, 0x2c3e50).setInteractive({ useHandCursor: true });
        const txt = this.add.text(0, 0, opt.toString(), { fontSize: "24px" }).setOrigin(0.5);
        
        const container = this.add.container(x, y, [btn, txt]);
        
        btn.on('pointerdown', () => this.handleAnswer(opt, container));
        this.answerButtons.add(container);
    });

    this.layout(width, height);
  }

  handleAnswer(selected, container) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    if (selected === this.currentProblem.answer) {
        // 정답 피드백
        this.cameras.main.flash(500, 46, 204, 113); // 녹색 플래시
        this.enemySide.setAlpha(0.5); // 몬스터 데미지 효과
        
        // 보상 지급
        gameManager.updateGold(10);
        gameManager.updateExperience(20);
        
        this.add.text(container.x, container.y - 50, "+10G", { color: "#f1c40f" }).setOrigin(0.5);

        // 일정 시간 후 다음 문제 혹은 월드로 복귀
        this.time.delayedCall(1000, () => {
            this.scene.start('World'); // 일단 한 문제 풀면 월드로 복귀하게 설정
        });
    } else {
        // 오답 피드백
        this.cameras.main.shake(200, 0.01); // 화면 흔들림
        this.isProcessing = false;
        // 몬스터가 공격하는 애니메이션 등을 여기에 추가
    }
  }

  shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  layout(width, height) {
    this.background?.setPosition(0, 0).setSize(width, height);
    this.problemCard?.setPosition(width / 2, height * 0.25);
    this.problemText?.setPosition(width / 2, height * 0.25);
    this.playerSide?.setPosition(width * 0.2, height * 0.5);
    this.enemySide?.setPosition(width * 0.8, height * 0.5);

    if (this.answerButtons) {
      this.answerButtons.iterate((buttonContainer, index) => {
        if (!buttonContainer) {
          return;
        }

        buttonContainer.setPosition(width * (0.2 + index * 0.2), height * 0.75);
      });
    }
  }
}
