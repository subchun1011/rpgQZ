import { gameManager } from "../utils/GameManager.js";

export default class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // 에셋 기준 경로 설정
    this.load.setPath("assets");

    // [데이터 로드] 초기 설정 및 문제 은행 샘플 로드
    // 프로젝트 폴더 구조상 data/는 assets/와 병렬이므로 '../' 사용
    this.load.json("gameConfig", "../data/gameConfig.json");
    this.load.json("questionBank", "../data/questionBank.sample.json");

    // [향후 추가] 로딩 바 등의 공용 UI 에셋 로딩 구간
  }

  create() {
    // 1. 레지스트리에 에셋 베이스 경로 저장 (사용자 요구사항 반영)
    this.registry.set("assetBasePath", "assets/");

    // 2. GameManager 초기 상태 확인 (디버깅용)
    console.log("Game Manager Initialized:", gameManager.getState());

    // 3. 타이틀 씬으로 전환
    this.scene.start("Title");
  }
}