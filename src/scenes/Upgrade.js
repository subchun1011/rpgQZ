import { gameManager } from "../utils/GameManager.js";

export default class Upgrade extends Phaser.Scene {
  constructor() {
    super("Upgrade");
  }

  create() {
    const { width, height } = this.scale;
    const state = gameManager.getState();

    // 1. 배경 (차분한 상점/연구소 느낌)
    this.add.rectangle(0, 0, width, height, 0x2c3e50).setOrigin(0);

    // 2. 상단 타이틀 및 현재 정보
    this.add.text(width / 2, 50, "강화 및 학습 설정", { fontSize: "32px", color: "#ecf0f1" }).setOrigin(0.5);
    this.goldDisplay = this.add.text(width / 2, 90, `보유 골드: ${state.gold}G`, { fontSize: "20px", color: "#f1c40f" }).setOrigin(0.5);

    // 3. 좌측: 장비 강화 영역 (도끼)
    this.createUpgradeSection(width * 0.25, height * 0.4);

    // 4. 우측: 학습 설정 영역 (과목 및 난이도)
    this.createLearningSection(width * 0.75, height * 0.4);

    // 5. 나가기 버튼
    const exitBtn = this.add.text(width / 2, height - 60, "월드로 돌아가기", {
      fontSize: "24px",
      backgroundColor: "#e74c3c",
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => this.scene.start("World"));
  }

  // 장비 강화 섹션
  createUpgradeSection(x, y) {
    const state = gameManager.getState();
    const upgradeCost = state.equipment.axeLevel * 50; // 레벨당 비용 증가

    this.add.text(x, y - 100, "🛠️ 장비 강화", { fontSize: "24px", color: "#3498db" }).setOrigin(0.5);
    
    const axeInfo = this.add.text(x, y, `현재 도끼 Lv.${state.equipment.axeLevel}\n(나무 채집량 +${state.equipment.axeLevel})`, { 
      fontSize: "18px", align: "center" 
    }).setOrigin(0.5);

    const upgradeBtn = this.add.text(x, y + 100, `강화하기\n(${upgradeCost}G)`, {
      fontSize: "20px", backgroundColor: "#2980b9", padding: 10, align: "center"
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => {
      if (gameManager.updateGold(-upgradeCost) >= 0) {
        state.equipment.axeLevel++;
        // 실제 데이터 반영 (GameManager 내부 state 직접 수정은 지양하되 여기선 편의상 흐름만 표시)
        gameManager.state.equipment.axeLevel = state.equipment.axeLevel; 
        this.refreshUI();
      } else {
        this.showPopup("골드가 부족합니다!");
      }
    });
  }

  // 학습 설정 섹션
  createLearningSection(x, y) {
    const state = gameManager.getState();
    this.add.text(x, y - 100, "📚 학습 설정", { fontSize: "24px", color: "#2ecc71" }).setOrigin(0.5);

    // 과목 변경 버튼들
    const subjects = Object.keys(state.subjectSettings);
    subjects.forEach((key, index) => {
      const isCurrent = state.currentSubject === key;
      const btn = this.add.text(x, y + (index * 50) - 20, `${state.subjectSettings[key].label} ${isCurrent ? "(진행중)" : ""}`, {
        fontSize: "18px",
        backgroundColor: isCurrent ? "#27ae60" : "#95a5a6",
        padding: 5
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        gameManager.setCurrentSubject(key);
        this.refreshUI();
      });
    });
  }

  refreshUI() {
    // 변경된 상태를 다시 로드하여 텍스트 갱신
    this.scene.restart();
  }

  showPopup(msg) {
    const txt = this.add.text(this.scale.width / 2, this.scale.height / 2, msg, {
      fontSize: "30px", backgroundColor: "#000", color: "#ff0000", padding: 20
    }).setOrigin(0.5);
    this.time.delayedCall(1000, () => txt.destroy());
  }
}