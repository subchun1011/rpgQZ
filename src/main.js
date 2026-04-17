import Boot from "./scenes/Boot.js";
import Title from "./scenes/Title.js";
import World from "./scenes/World.js";
import Battle from "./scenes/Battle.js";
import Upgrade from "./scenes/Upgrade.js";
import { gameManager } from "./utils/GameManager.js";

// [핵심] 뷰포트 및 레이아웃 관리 로직
const updateViewportHeight = () => {
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${viewportHeight}px`);
};

const updateOrientationNotice = () => {
  const isPortraitMobile = window.matchMedia(
    "(orientation: portrait) and (max-width: 1024px)"
  ).matches;
  const notice = document.getElementById("orientation-notice");

  document.body.classList.toggle("is-portrait", isPortraitMobile);

  if (notice) {
    notice.setAttribute("aria-hidden", String(!isPortraitMobile));
  }
};

const refreshLayout = () => {
  updateViewportHeight();
  updateOrientationNotice();

  if (window.phaserGame?.scale) {
    window.phaserGame.scale.refresh();
  }
};

const tryLockLandscape = async () => {
  const orientationApi = window.screen?.orientation;
  if (!orientationApi?.lock) return;
  try {
    await orientationApi.lock("landscape");
  } catch (error) {
    // iOS Safari 대응
  }
};

const config = {
  type: Phaser.AUTO,
  parent: "game-root",
  width: 960,
  height: 540,
  backgroundColor: "#101820",
  
  scale: {
    mode: Phaser.Scale.ENVELOP, // 화면을 꽉 채우는 모드
    autoCenter: Phaser.Scale.CENTER_BOTH,
    expandParent: true,
    fullscreenTarget: "game-root",
    forceOrientation: true,
    orientation: "landscape"
  },

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },

  scene: [Boot, Title, World, Battle, Upgrade],
};

window.addEventListener("load", async () => {
  updateViewportHeight();
  updateOrientationNotice();

  gameManager.initialize();
  window.gameManager = gameManager;
  window.phaserGame = new Phaser.Game(config);

  const handleResize = () => refreshLayout();

  window.addEventListener("resize", handleResize, { passive: true });
  window.addEventListener("orientationchange", handleResize, { passive: true });
  window.visualViewport?.addEventListener("resize", handleResize, { passive: true });
  
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshLayout();
  });

  refreshLayout();
  await tryLockLandscape();

  // iOS Safari 주소창 숨기기 트리거
  setTimeout(() => {
    window.scrollTo(0, 1);
    refreshLayout();
  }, 100);
});