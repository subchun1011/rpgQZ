import Boot from "./scenes/Boot.js";
import Title from "./scenes/Title.js";
import World from "./scenes/World.js";
import Battle from "./scenes/Battle.js";
import Upgrade from "./scenes/Upgrade.js";
import { gameManager } from "./utils/GameManager.js";

// [핵심] 뷰포트 및 레이아웃 관리 로직
const getViewportRect = () => {
  const viewport = window.visualViewport;
  return {
    width: Math.round(viewport?.width ?? window.innerWidth),
    height: Math.round(viewport?.height ?? window.innerHeight),
    top: Math.round(viewport?.offsetTop ?? 0),
    left: Math.round(viewport?.offsetLeft ?? 0),
  };
};

const updateViewportRectVars = () => {
  const { width, height, top, left } = getViewportRect();

  document.documentElement.style.setProperty("--app-width", `${width}px`);
  document.documentElement.style.setProperty("--app-height", `${height}px`);
  document.documentElement.style.setProperty("--app-top", `${top}px`);
  document.documentElement.style.setProperty("--app-left", `${left}px`);
};

const isTouchDevice = () =>
  window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
  navigator.maxTouchPoints > 1;

const updateDeviceLayoutState = () => {
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const mobileLikeDevice = isTouchDevice();

  document.body.classList.toggle("is-touch-device", mobileLikeDevice);
  document.body.classList.toggle("is-mobile-landscape", mobileLikeDevice && !isPortrait);
  document.body.classList.toggle("is-mobile-portrait", mobileLikeDevice && isPortrait);
};

const updateOrientationNotice = () => {
  const isPortraitMobile = isTouchDevice() &&
    window.matchMedia("(orientation: portrait)").matches;
  const notice = document.getElementById("orientation-notice");

  document.body.classList.toggle("is-portrait", isPortraitMobile);

  if (notice) {
    notice.setAttribute("aria-hidden", String(!isPortraitMobile));
  }
};

const refreshLayout = () => {
  const { width, height } = getViewportRect();

  updateViewportRectVars();
  updateDeviceLayoutState();
  updateOrientationNotice();

  if (window.phaserGame?.scale) {
    if (typeof window.phaserGame.scale.resize === "function") {
      window.phaserGame.scale.resize(width, height);
    }
    window.phaserGame.scale.refresh();
  }
};

const scheduleRefreshBurst = () => {
  const refreshDelays = [0, 80, 180, 320, 500, 900];

  refreshDelays.forEach((delay) => {
    window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        refreshLayout();
      });
    }, delay);
  });
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
    mode: Phaser.Scale.RESIZE,
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
  updateViewportRectVars();
  updateDeviceLayoutState();
  updateOrientationNotice();

  gameManager.initialize();
  window.gameManager = gameManager;
  window.phaserGame = new Phaser.Game(config);

  const handleResize = () => refreshLayout();

  window.addEventListener("resize", handleResize, { passive: true });
  window.addEventListener("orientationchange", handleResize, { passive: true });
  window.visualViewport?.addEventListener("resize", handleResize, { passive: true });
  window.visualViewport?.addEventListener("scroll", handleResize, { passive: true });
  window.addEventListener("pageshow", () => {
    scheduleRefreshBurst();
  }, { passive: true });
  
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) scheduleRefreshBurst();
  });

  refreshLayout();
  scheduleRefreshBurst();
  await tryLockLandscape();

  // iOS Safari 주소창 숨기기 트리거
  setTimeout(() => {
    window.scrollTo(0, 0);
    scheduleRefreshBurst();
  }, 100);
});
