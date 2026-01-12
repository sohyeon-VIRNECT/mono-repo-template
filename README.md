# 🛠 Biome 공통 설정 가이드 (`base-biome-config`)

이 템플릿은 코드 품질 유지와 일관된 포맷팅을 위해 [Biome](https://biomejs.dev/)을 사용합니다. 공통 설정 패키지인 `@packages/biome-config`를 사용하여 프로젝트 전체에 동일한 규칙을 적용할 수 있습니다.

## `@packages/biome-config`
`@packages/biome-config`는 모노레포 전체에서 공유되는 Biome 설정 파일입니다. Lint 규칙, 포맷팅 스타일이 정의되어 있어, 개별 프로젝트에서 매번 설정을 반복할 필요가 없습니다.

### 💡 참고
- **Lint**: `base-eslint-ts-config`에서는 Airbnb 룰을 기반으로 엄격하게 관리했으나, Biome 도입 시에는 프로젝트의 유연성과 생산성을 위해 **`recommended`** 설정을 채택했습니다.
  - **이유**: Airbnb 룰은 매우 정교한 기준을 제시하지만, 현대적인 프론트엔드 개발 환경에서는 과도하게 엄격한 제약이 오히려 개발 속도를 늦춘다는 비판이 많아지는 추세입니다.
  - **Biome의 선택**: Biome의 권장 규칙은 최신 JavaScript/TypeScript 에코시스템에 최적화되어 있습니다. 실질적인 오류 방지에 집중하면서도 개발 흐름을 방해하지 않는 실용적인 균형을 제공합니다.


- **Formatter**: 기존 Prettier와 동일한 스타일 설정을 유지하였습니다. 


## 🔧 적용 방법

새로운 앱이나 패키지에 Biome 설정을 적용하는 방법을 설명합니다.
- `apps/my-app`은 아래 가이드에 따라 설정이 완료된 예시 프로젝트입니다. 설정 과정에서 이해가 되지 않거나 실제 적용 사례를 직접 확인하고 싶다면 `apps/my-app`을 참고해 주세요.

### 1. 의존성 추가 (`package.json`)
설정을 적용할 앱의 `package.json`에 공통 설정 패키지와 `@biomejs/biome`를 추가합니다.

```json
{
  "devDependencies": {
    "@packages/biome-config": "workspace:*",
    "@biomejs/biome": "^2.3.11"
  }
}
```

### 2. 설정 파일 생성 (`biome.json`)
앱의 루트 폴더에 `biome.json` 파일을 생성하고 공통 설정을 확장합니다.

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "extends": ["@packages/biome-config"]
}
```

공통 규칙 외에 별도의 설정이 필요하거나 일부 규칙을 제외하고 싶다면, 규칙이나 설정을 덮어쓸 수 있습니다.

```json
{
  "extends": ["@packages/biome-config"],
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "off"
      }
    }
  }
}
```

### 3. 스크립트 등록 (`package.json`)
Biome을 간편하게 사용하기 위해 `package.json`의 `scripts` 영역에 다음 명령어를 등록합니다.

```json
// apps/my-app/package.json
{
  "scripts": {
    "lint": "biome lint --write",
    "format": "biome format --write",
    "check": "biome check --write"
  }
}

```

- **`lint`**: 코드 품질 검사 및 자동 수정을 수행합니다.
- **`format`**: 코드 스타일 포맷팅을 수행합니다.
- **`check`**: Lint와 Format을 동시에 수행하는 통합 명령어입니다.


### 4. 루트(Root)에서 한 번에 실행하기
각 앱이나 패키지에 일일이 들어가 실행하지 않고, 프로젝트 최상단(Root)에서 모든 프로젝트의 스크립트를 한 번에 호출할 수 있습니다. 

이를 위해 루트의 `package.json`에 다음과 같이 공통 스크립트가 등록되어 있습니다.

```json
// package.json (Root)
{
  "scripts": {
    "lint": "pnpm -r --if-present lint",
    "format": "pnpm -r --if-present format",
    "check": "pnpm -r --if-present check"
  }
}
```

- **실행 예시**:
```bash
# 전체 프로젝트의 Lint 검사 및 자동 수정
pnpm lint

# 전체 프로젝트의 스타일 포맷팅
pnpm format

# 전체 프로젝트 통합 체크
pnpm check
```



## 💻 VS Code 및 에디터 설정
파일 저장 시 Biome 규칙에 맞춰 자동으로 포맷팅을 적용하기 위한 설정입니다. 이 가이드는 VS Code뿐만 아니라 이를 기반으로 하는 **Cursor**, **Antigravity** 등의 에디터에서도 동일하게 적용됩니다.

### 1. Biome 익스텐션 설치
에디터에서 Biome을 정상적으로 사용하려면 마켓플레이스에서 **[Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)** 익스텐션을 설치해야 합니다.

### 2. 에디터 설정 (`.vscode/settings.json`)
프로젝트의 `.vscode/settings.json`에 아래 설정을 추가하여 Biome을 기본 포맷터로 지정하고 저장 시 자동 최적화 기능을 활성화합니다.

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

#### ⚠️ 프로젝트 최상단(Root)에 `biome.json` 추가
에디터의 자동 포맷팅 기능이 동작하려면 **프로젝트 최상단(Root)에 `biome.json`이 존재**해야 합니다. 에디터는 이 루트 설정을 기준으로 전체 워크스페이스의 포맷팅 규칙을 인식합니다.

### 루트 레벨의 Linter 비활성화
각 앱이나 패키지는 독립적인 린트 규칙을 가질 수 있습니다. 루트 레벨에서 `linter`를 활성화 할 경우 충돌이 발생할 수 있으므로, 루트 `biome.json`에서는 린트를 비활성화하고 **포맷팅 규칙만** 전역적으로 적용되도록 구성했습니다.

```json
// biome.json (Root)
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "extends": ["@packages/biome-config"],
  "linter": {
    "enabled": false
  }
}
```


