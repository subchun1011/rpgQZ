/**
 * GameManager: 게임의 전역 상태 및 데이터 로직 관리
 * 학습 통계(정답률) 및 자원 관리 기능 포함
 */
class GameManager {
  constructor() {
    this.defaultState = {
      gold: 0,
      experience: 0,
      level: 1,
      currentSubject: "math",
      unlockedSubjects: ["math"],
      subjectSettings: {
        math: { label: "수학", difficulty: "normal" },
        english: { label: "영어", difficulty: "normal" },
        science: { label: "과학", difficulty: "normal" },
      },
      resources: { wood: 0, stone: 0 },
      equipment: { axeLevel: 1 },
      // [신규] 학습 결과 통계를 위한 데이터 필드
      statistics: {
        totalSolved: 0,
        correctAnswers: 0,
      },
    };

    this.state = structuredClone(this.defaultState);
  }

  initialize() {
    this.state = structuredClone(this.defaultState);
  }

  getState() {
    return structuredClone(this.state);
  }

  // [신규] 전투/학습 결과를 기록하는 메서드
  recordResult(isCorrect) {
    this.state.statistics.totalSolved++;
    if (isCorrect) {
      this.state.statistics.correctAnswers++;
    }
    return this.getState().statistics;
  }

  updateResource(type, amount) {
    if (this.state.resources.hasOwnProperty(type)) {
      this.state.resources[type] = Math.max(0, this.state.resources[type] + amount);
    }
    return this.state.resources[type];
  }

  updateGold(amount) {
    this.state.gold = Math.max(0, this.state.gold + amount);
    return this.state.gold;
  }

  updateExperience(amount) {
    this.state.experience = Math.max(0, this.state.experience + amount);
    // 레벨업 로직 확장 가능: 예) if(this.state.experience >= 100) { this.state.level++; ... }
    return this.state.experience;
  }

  setCurrentSubject(subjectKey) {
    if (this.state.subjectSettings[subjectKey]) {
      this.state.currentSubject = subjectKey;
    }
    return this.state.currentSubject;
  }

  unlockSubject(subjectKey) {
    if (
      this.state.subjectSettings[subjectKey] &&
      !this.state.unlockedSubjects.includes(subjectKey)
    ) {
      this.state.unlockedSubjects.push(subjectKey);
    }
    return [...this.state.unlockedSubjects];
  }

  setSubjectDifficulty(subjectKey, difficulty) {
    if (this.state.subjectSettings[subjectKey]) {
      this.state.subjectSettings[subjectKey].difficulty = difficulty;
    }
    return this.state.subjectSettings[subjectKey] ?? null;
  }

  reset() {
    this.initialize();
  }
}

// 싱글톤으로 인스턴스 생성 및 수출
export const gameManager = new GameManager();
export default GameManager;