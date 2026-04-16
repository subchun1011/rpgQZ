import { gameManager } from "../utils/GameManager.js";

export default class Title extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    const { width, height } = this.scale;
    const state = gameManager.getState(); // 현재 플레이어 상태 가져오기

    // 1. 배경 설정 (코덱스의 딥 블루 톤 유지)
    this.add
      .rectangle(width / 2, height / 2, width, height, 0x1b365d)
      .setAlpha(0.95);

    // 2. 메인 타이틀
    this.add
      .text(width / 2, height / 2 - 80, "RPG 학습 게임", {
        fontFamily: "Arial",
        fontSize: "40px",
        color: "#f8f3e8",
      })
      .setOrigin(0.5);

    // 3. 플레이어 상태 정보 표시 (추가된 부분)
    // 아이가 본인의 성장을 확인할 수 있도록 레벨과 현재 과목을 표시합니다.
    const currentSubjectLabel = state.subjectSettings[state.currentSubject].label;
    this.add
      .text(width / 2, height / 2 - 10, `Lv.${state.level} | 학습 과목: ${currentSubjectLabel}`, {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#d8e4f0",
      })
      .setOrigin(0.5);

    // 4. 인터랙션 가이드
    this.add
      .text(width / 2, height / 2 + 60, "클릭하면 모험을 시작합니다", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffc16f",
      })
      .setOrigin(0.5);

    // 5. 씬 전환 이벤트 (한 번만 실행)
    this.input.once("pointerdown", () => {
      // 1. 풀스크린 시도 (데스크탑 및 안드로이드 크롬 대응)
      if (!this.scale.isFullscreen) {
          try {
              this.scale.startFullscreen();
          } catch (error) {
              console.warn("풀스크린 진입 실패 (브라우저 제한):", error);
          }
      }

      // 2. 씬 전환
      console.log("모험 시작!");
      this.scene.start("World");
    });
  }
}