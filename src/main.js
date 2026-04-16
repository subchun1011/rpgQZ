import Boot from "./scenes/Boot.js";
import Title from "./scenes/Title.js";
import World from "./scenes/World.js";
import Battle from "./scenes/Battle.js";
import Upgrade from "./scenes/Upgrade.js";
import { gameManager } from "./utils/GameManager.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-root",
  width: 960,
  height: 540,
  backgroundColor: "#101820",
  
  scale: {
    // 🔥 ENVELOP: 화면의 빈 공간 없이 꽉 채우며 확대
    mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    expandParent: true,
    fullscreenTarget: "game-root",
    // 🔥 모바일 가로 모드 강제 및 방향 전환 대응
    forceOrientation: true,
    orientation: 'landscape'
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false 
    }
  },

  scene: [Boot, Title, World, Battle, Upgrade],
};

window.addEventListener("load", () => {
  gameManager.initialize();
  window.gameManager = gameManager;
  window.phaserGame = new Phaser.Game(config);

  // 사이즈 변경 시 즉시 갱신 (iOS 주소창 대응)
  window.addEventListener('resize', () => {
    if (window.phaserGame) {
      window.phaserGame.scale.refresh();
    }
  });

  // iOS Safari를 위한 상단 스크롤 숨김 트릭
  setTimeout(() => {
    window.scrollTo(0, 1);
  }, 100);
});