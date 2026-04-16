import Boot from "./scenes/Boot.js";
import Title from "./scenes/Title.js";
import World from "./scenes/World.js";
import Battle from "./scenes/Battle.js";
import Upgrade from "./scenes/Upgrade.js";
import { gameManager } from "./utils/GameManager.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-root",
  // 모바일과 PC 모두 적합한 16:9 해상도
  width: 960,
  height: 540,
  backgroundColor: "#101820",
  
  // 모바일 대응 스케일 설정
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // 모바일 브라우저 주소창 등에 대응하여 크기를 자동으로 계산
    expandParent: true
  },

  // 물리 엔진 설정 (World 씬의 캐릭터 이동/충돌에 필수)
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // 탑다운 RPG이므로 중력은 0
      debug: false      // 충돌 영역 확인이 필요하면 true로 변경
    }
  },

  // 등록된 씬 목록
  scene: [Boot, Title, World, Battle, Upgrade],
};

window.addEventListener("load", () => {
  // 전역 상태 관리자 초기화
  gameManager.initialize();
  
  // 디버깅 편의를 위해 전역 윈도우 객체에 등록
  window.gameManager = gameManager;
  window.phaserGame = new Phaser.Game(config);
});