# Assets Guide

모든 에셋은 `assets/`를 기준으로 로드합니다.

예시 경로:

- `assets/images/ui/title-bg.png`
- `assets/audio/bgm/field-theme.mp3`
- `assets/sprites/player/hero-idle.png`
- `assets/fonts/Galmuri11.ttf`

Phaser 로더 예시:

```js
this.load.setPath("assets");
this.load.image("titleBg", "images/ui/title-bg.png");
this.load.audio("fieldBgm", "audio/bgm/field-theme.mp3");
this.load.spritesheet("hero", "sprites/player/hero-idle.png", {
  frameWidth: 32,
  frameHeight: 32,
});
```
