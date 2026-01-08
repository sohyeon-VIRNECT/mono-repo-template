# React 용 eslint, ts 설정 템플릿

이 템플릿은 React 애플리케이션 개발을 위한 TypeScript 및 ESLint 설정 구성을 제공합니다.
템플릿에서 사용한 React 앱(`apps/react-app`)은 **Vite**를 기반으로 합니다.

### 1. TypeScript 설정 (@packages/ts-config)

TypeScript 설정 패키지는 React 애플리케이션을 위한 전용 설정 파일인 `react-app.json`을 별도로 포함합니다.

#### 1.1 구성 및 상세 내용

- `packages/ts-config/react-app.json`: React 컴포넌트, JSX/TSX 처리 등 React 환경에 최적화된 컴파일러 옵션을 정의합니다.

  ```json
  // packages/ts-config/react-app.json
  {
    "extends": "./app.json",
    "compilerOptions": {
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "jsx": "react-jsx"
    }
  }
  ```

- `packages/ts-config/package.json`: `exports` 필드를 통해 외부에서 사용할 수 있도록 설정합니다.

  ```json
  // packages/ts-config/package.json
  {
    "exports": {
      "./react-app": "./react-app.json"
      // ...
    }
  }
  ```

#### 1.2 커스터마이징 가이드

앱의 특성에 맞게 설정을 변경하고 싶다면 `compilerOptions`를 덮어씌울 수 있습니다.

```json
// 예: 타겟 버전을 변경하거나 특정 검사 규칙을 완화하고 싶은 경우
{
  "extends": "@packages/ts-config/react-app",
  "compilerOptions": {
    "target": "ES2022", // 타겟 버전 변경
    "noImplicitAny": false // 특정 규칙 완화
  }
}
```

### 2. ESLint 설정 (@packages/eslint-config-react)

React 전용 린트 규칙은 `@packages/eslint-config-react`라는 별도의 패키지로 분리하여 제공합니다.

#### 2.1 구성 및 상세 내용

이 설정은 다음과 같은 규칙들을 조합하여 React 개발 환경을 제공합니다.

- **기반 규칙**: `@packages/eslint-config` (Airbnb Base + TypeScript + Prettier)
- **React 추가 규칙**:
  - `airbnb/hooks`: React Hooks 규칙 (exhaustive-deps 등)
  - `plugin:react/jsx-runtime`: React 17+ JSX 변환 대응
  - `plugin:react-refresh`: Vite Fast Refresh 관련 규칙 확인
- **주요 커스텀 룰**:
  - `react/jsx-filename-extension`: `.tsx` 파일에서도 JSX 사용 허용
  - `react/require-default-props`: `off` (TypeScript 사용 시 선택적 props 처리가 더 명확하므로 비활성화)
  - `react/jsx-props-no-spreading`: `warn` (과도한 props 전파 주의)

#### 2.2 왜 별도의 패키지로 만들었나요?

기본 `@packages/eslint-config`에 React 설정을 통합할 경우, React를 사용하지 않는 프로젝트(예: Node.js 서버, 유틸리티 라이브러리 등)에서도 React 관련 플러그인(`eslint-plugin-react` 등)에 대한 불필요한 종속성이 발생합니다.
이를 방지하고, 필요한 곳에서만 React 관련 종속성을 설치하도록 하기 위해 설정을 분리했습니다.

#### 2.3 커스터마이징 가이드

특정 규칙이 프로젝트 성격에 맞지 않는다면 `.eslintrc.cjs`의 `rules` 필드에서 재정의할 수 있습니다.

```javascript
// apps/react-app/.eslintrc.cjs
module.exports = {
  extends: ['@packages/eslint-config-react'],
  rules: {
    // 예: console 사용을 허용하고 싶은 경우
    'no-console': 'off',

    // 예: props spreading 경고를 끄고 싶은 경우
    'react/jsx-props-no-spreading': 'off',
  },
}
```

#### (참고) PeerDependencies 관련

기본적으로 편의를 위해 `dependencies`에 플러그인을 포함하고 있지만, 앱에서 직접 의존성을 관리하려면 `peerDependencies` 방식으로 전환할 수 있습니다. (상세 내용은 생략하지만 필요시 `package.json` 수정 및 앱 측 설치 필요)
