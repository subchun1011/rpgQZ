import Boot from "./scenes/Boot.js";
import Title from "./scenes/Title.js";
import World from "./scenes/World.js";
import Battle from "./scenes/Battle.js";
import Upgrade from "./scenes/Upgrade.js";
import { gameManager } from "./utils/GameManager.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-root",
  // 16:9 골든 레이아웃 유지
  width: 960,
  height: 540,
  backgroundColor: "#101820",
  
  scale: {
    mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // 부모 요소의 크기에 맞춰 확장
    expandParent: true,
    // 🔥 풀스크린 모드 시 대상을 명확히 지정 (중요)
    fullscreenTarget: "game-root"
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false 
    }
  },

  // 모든 씬 등록
  scene: [Boot, Title, World, Battle, Upgrade],
};

window.addEventListener("load", () => {
  // 1. 게임 매니저 초기화
  gameManager.initialize();
  
  // 2. 전역 접근 설정 (디버깅용)
  window.gameManager = gameManager;
  
  // 3. Phaser 게임 인스턴스 생성
  window.phaserGame = new Phaser.Game(config);

  // 4. [모바일 보강] 브라우저 사이즈 변경 시 캔버스 즉시 갱신
  window.addEventListener('resize', () => {
    if (window.phaserGame) {
      window.phaserGame.scale.refresh();
    }
  });
});