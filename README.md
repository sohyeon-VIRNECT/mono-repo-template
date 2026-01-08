# TypeScript, ESLint 공통 설정 가이드

## 공통 설정 (Shared Configurations)

이 템플릿은 일관된 코드 품질과 효율적인 협업을 위해 공유 설정을 제공합니다. 모노레포 환경에서 공통 설정을 도입해야 하는 이유는 다음과 같습니다.

### 왜 공유 설정을 사용해야 하나요?

- **개발 과정의 일관성 유지**: 여러 개의 서비스가 포함된 모노레포에서 각기 다른 규칙을 사용하면 코드 품질의 파편화가 발생합니다. 공유 설정을 통해 프로젝트 전체에 동일한 기준을 적용하여 안정적인 코드를 작성할 수 있습니다.
- **생산성 극대화**: 새로운 애플리케이션이나 패키지를 추가할 때마다 복잡한 설정을 반복할 필요가 없습니다. 이미 검증된 설정을 확장(extend)하여 즉시 개발에 집중할 수 있는 환경을 제공합니다.
- **중앙 집중식 유지보수**: 글로벌 코딩 규칙이 변경되거나 새로운 정책이 도입될 때, 수십 개의 프로젝트를 일일이 수정하는 대신 공유 패키지 한 곳만 업데이트하여 전체 워크스페이스에 즉시 반영할 수 있습니다.

### 1. `@packages/ts-config`

프로젝트 전반에서 사용할 수 있는 TypeScript 설정을 제공합니다.

- `./app`: 브라우저 환경에서 실행되는 애플리케이션을 위한 설정 (`app.json`)
- `./node`: Node.js 환경에서 실행되는 프로젝트를 위한 설정 (`node.json`)

### 2. `@packages/eslint-config`

Airbnb 스타일 가이드를 기반으로 한 공통 ESLint 설정을 제공합니다. TypeScript 및 Prettier 설정이 포함되어 있습니다.

## 앱 레벨 사용 가이드 (Usage Guide)

새로운 애플리케이션을 `apps/` 디렉토리에 추가할 때 공통 설정을 적용하는 방법은 다음과 같습니다.

### 1. 의존성 추가

해당 앱의 `package.json`에 공통 설정 패키지를 의존성으로 추가합니다.

```json
{
  "devDependencies": {
    "@packages/eslint-config": "workspace:*",
    "@packages/ts-config": "workspace:*"
  }
}
```

### 2. TypeScript 설정 적용

`tsconfig.json` 또는 환경별 tsconfig 파일에서 공통 설정을 확장(extend)하여 사용합니다.

```json
// apps/my-app/tsconfig.app.json
{
  "extends": "@packages/ts-config/app"
}
```

### 3. ESLint 설정 적용

`.eslintrc.cjs` 파일에서 공통 설정을 확장합니다. 필요에 따라 프로젝트별 설정을 추가할 수 있습니다.

```javascript
// apps/my-app/.eslintrc.cjs
module.exports = {
  extends: ['@packages/eslint-config'],
  settings: {
    'import/resolver': {
      typescript: {
        project: ['apps/my-app/tsconfig.app.json'],
      },
    },
  },
}
```
