import { gameManager } from "../utils/GameManager.js";

export default class Title extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    const { width, height } = this.scale;
    const state = gameManager.getState(); // 현재 플레이어 상태 가져오기

    // 1. 배경 설정 (코덱스의 딥 블루 톤 유지)
    this.background = this.add
      .rectangle(0, 0, width, height, 0x1b365d)
      .setOrigin(0)
      .setAlpha(0.95);

    // 2. 메인 타이틀
    this.titleText = this.add
      .text(width / 2, height / 2 - 80, "RPG 학습 게임", {
        fontFamily: "Arial",
        fontSize: "40px",
        color: "#f8f3e8",
      })
      .setOrigin(0.5);

    // 3. 플레이어 상태 정보 표시 (추가된 부분)
    // 아이가 본인의 성장을 확인할 수 있도록 레벨과 현재 과목을 표시합니다.
    const currentSubjectLabel = state.subjectSettings[state.currentSubject].label;
    this.infoText = this.add
      .text(width / 2, height / 2 - 10, `Lv.${state.level} | 학습 과목: ${currentSubjectLabel}`, {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#d8e4f0",
      })
      .setOrigin(0.5);

    // 4. 인터랙션 가이드
    this.guideText = this.add
      .text(width / 2, height / 2 + 60, "클릭하면 모험을 시작합니다", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffc16f",
      })
      .setOrigin(0.5);

    this.handleResize = (gameSize) => {
      this.layout(gameSize.width, gameSize.height);
    };

    this.scale.on("resize", this.handleResize);
    this.events.once("shutdown", () => {
      this.scale.off("resize", this.handleResize);
    });

    this.layout(width, height);

    // 5. 씬 전환 이벤트 (한 번만 실행)
    this.input.once("pointerdown", () => {
      // [로그 1] 브라우저가 풀스크린 기능을 지원하는지 확인
      console.log("브라우저 풀스크린 지원 여부:", this.scale.fullscreen.available);
      
      // [로그 2] 현재 문서의 풀스크린 타겟 확인
      console.log("풀스크린 타겟 요소:", this.scale.fullscreenTarget);

      if (!this.scale.isFullscreen) {
          try {
              // [로그 3] 실제 실행 직전 상태
              console.log("요청 전 상태:", this.scale.fullscreen.active);
              
              this.scale.startFullscreen();
              
              // [로그 4] 실행 직후 (비동기라 바로 반영 안 될 수 있음)
              setTimeout(() => {
                  console.log("1초 후 풀스크린 상태:", this.scale.isFullscreen);
              }, 1000);

          } catch (error) {
              console.error("실행 중 에러 발생:", error);
          }
      }
      this.scene.start("World");
    }); 
  }

  layout(width, height) {
    this.background?.setPosition(0, 0).setSize(width, height);
    this.titleText?.setPosition(width / 2, height / 2 - 80);
    this.infoText?.setPosition(width / 2, height / 2 - 10);
    this.guideText?.setPosition(width / 2, height / 2 + 60);
  }
}
