# Project Architecture

## 목적

Phaser.js 기반의 RPG 학습 게임 프로젝트 구조를 정의하고, 이후 기능 구현 작업의 기준 문서로 사용합니다.

## 현재 디렉토리 구조

```text
/
|-- assets/
|   |-- audio/
|   |-- fonts/
|   |-- images/
|   `-- sprites/
|-- data/
|-- src/
|   |-- components/
|   |-- scenes/
|   `-- utils/
|-- index.html
|-- style.css
`-- Project_Architecture.md
```

## 씬 구성

- `Boot`: 공용 초기화, 에셋 베이스 경로 설정
- `Title`: 타이틀 화면
- `World`: 필드 탐험 화면
- `Battle`: 문제 풀이 기반 전투 화면
- `Upgrade`: 성장 및 강화 화면

## 전역 상태 관리

- `src/utils/GameManager.js`
- 관리 대상: 골드, 경험치, 레벨, 현재 과목, 해금 과목, 과목별 난이도 설정

## 데이터 파일

- `data/gameConfig.json`: 게임 기본 설정
- `data/questionBank.sample.json`: 문제 은행 샘플

## 에셋 로딩 규칙

- Phaser 로더는 `assets/`를 기준 경로로 사용
- 예: `this.load.setPath("assets")`
- 실에셋 추가 전까지는 각 하위 폴더의 `placeholder.txt`를 기준으로 경로 정책을 유지

## 다음 작업 제안

- `Boot` 씬에서 실제 JSON 설정과 공용 UI 리소스 preload
- `Title` 씬 메뉴 및 저장 데이터 연동
- `World` 씬 타일맵 및 플레이어 이동 구현
- `Battle` 씬 문제 출제, 정답 판정, 보상 시스템 연결
- `Upgrade` 씬 스탯/스킬/과목 성장 시스템 정의

# 🗺️ RPG Math Adventure: Project Architecture

## 1. Directory Structure (Current)
*이 섹션은 코덱스가 생성한 실제 경로를 바탕으로 업데이트됩니다.*
- `/src/scenes`: 각 게임 화면 로직 (Boot, Title, World, Battle, UI)
- `/assets/images`: 유닛, 배경, 아이템 스프라이트 경로
- `/src/utils/GameManager.js`: 플레이어 데이터 및 학습 레벨 관리 중심점

## 2. Global State & Extension (Data Framework)
- **Subject Expansion:** `learningConfig.subject` (math, english, proverb)
- **Leveling:** `playerData.level`에 따른 문제 난이도 동적 생성 로직
- **World Scaling:** Tilemap 레이어 추가를 통한 맵 확장 구조

## 3. Work History & Task Roadmap

- [x] **Phase 0:** 프로젝트 골격 생성 (코덱스 완료)
- [x] **Phase 1: 인프라 및 데이터 로딩 (현재 진행 중)**
    - `src/utils/GameManager.js` 기초 싱글톤 구조 구현
    - `src/scenes/Boot.js`에서 `gameConfig.json` 로드 및 전역 데이터 주입
- [x] **Phase 2: 타이틀 및 씬 전환**
    - 배경 이미지 및 시작 버튼 UI
    - GameManager 연동을 통한 플레이어 정보(Level, Gold) 표시
    - `Title.js` 메뉴 구성 및 `GameManager` 데이터 연동
- [>] **Phase 3: 월드 시스템 (이동 및 채집)**
    - [x] `World.js` 캐릭터 컨트롤러 (WASD/화살표 이동) 구현
    - [x] `GameManager` 연동 자원 채집 시스템 설계
    - [x] 간단한 상단 UI 바 (골드, 나무 개수 실시간 표시) 추가
- [>] **Phase 4: 학습/전투 엔진**
    - [x] `Battle.js` 레이아웃 및 문제 출력 로직
    - [x] 정답 판정 및 GameManager 연동 보상 (Gold/Exp) 지급
- [x] Phase 5: 강화 및 성장 시스템 (Upgrade Scene) 구현 완료
    - [x] 골드 소모를 통한 도끼 레벨업 시스템 (데이터 연동)
    - [x] 학습 과목 실시간 변경 UI 연동
- [>] **Phase 6: 보상 및 통계 (Result Scene) & 폴리싱 - 다음 작업 예정**
    - [x] GameManager 통계 데이터(정답률 등) 기록 로직 추가
    - [x] 정답률 기반 칭찬 멘트 및 결과 리포트 UI 구현

## 4. Key Assets Path Reference
- Character: `assets/images/sprites/hero.png`
- Tree/Resource: `assets/images/props/tree.png`
- UI/Frame: `assets/images/ui/panel.png`
