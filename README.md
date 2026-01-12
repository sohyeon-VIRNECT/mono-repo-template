# React 용 Biome, TypeScript 설정 템플릿

이 템플릿은 React 애플리케이션 개발을 위한 TypeScript 및 Biome 설정 구성을 제공합니다.
템플릿에서 사용한 React 앱(`apps/react-app`)은 **Vite**를 기반으로 생성되었습니다.

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

### 2. React Biome 설정 (@packages/biome-config)

Biome 설정 패키지는 일반적인 환경을 위한 기본 설정과 React 프로젝트를 위한 전용 설정을 각각 제공합니다.

#### 2.1 구성 및 상세 내용

- `packages/biome-config/react-biome.json`: React 권장 규칙(`recommended`)을 활성화하고, 기본 설정을 확장합니다.<br/>자세한 규칙 내용은 [Biome React 공식 문서](https://biomejs.dev/linter/domains/#react)를 참고하세요.

  ```json
  // packages/biome-config/react-biome.json
  {
    "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
    "linter": {
      "domains": {
        "react": "recommended"
      }
    }
  }
  ```

- `packages/biome-config/package.json`: 외부 프로젝트에서 `./react` 경로로 React 전용 설정을 불러올 수 있도록 노출합니다.

  ```json
  // packages/biome-config/package.json
  {
    "exports": {
      ".": "./biome.json",
      "./react": "./react-biome.json"
    }
  }
  ```

#### 2.2 적용 방법

`react-app`앱의 `biome.json`에서 사용할 biome 설정을 모두 확장하여 사용합니다.

```json
// apps/react-app/biome.json
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "extends": ["@packages/biome-config","@packages/biome-config/react"]
}
```

### 💡 참고
- 모노레포 환경에서 설정 파일끼리 중첩 상속(`extends`의 `extends`)을 할 경우 실제 앱에서 베이스 설정의 경로를 찾지 못하는 오류가 발생할 수 있습니다. 따라서, 베이스가 되는 설정(`biome-config`)과 React 설정(`biome-config/react`)을 모두 명시하여 Biome 엔진이 모든 규칙을 누락 하지 않도록 합니다. 

  ❌ 권장하지 않음 
  ```json
  // biome-config/react-biome.json
  {
    "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
    "extends": ["./biome.json"], // 중첩 상속 유발
    "linter": {
      "domains": {
        "react": "recommended"
      }
    }
  }

  // apps/react-app/biome.json
  {
    "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
    "extends": ["@packages/biome-config/react"] // 상속이 있는 설정 파일을 상속
  }
  ```

#### 2.3 커스터마이징 가이드

특정 규칙이 프로젝트 성격에 맞지 않는다면 `biome.json`에서 해당 규칙을 재정의할 수 있습니다.

```json
// apps/react-app/biome.json
{
  // ...
  "linter": {
    "rules": {
      "correctness": {
        "useJsxKeyInIterable": "off" // 예: 반복문 내 JSX key 검사 비활성화
      },
      "complexity": {
        "noUselessFragments": "warn" // 예: 불필요한 Fragment 사용을 에러가 아닌 경고로 표시
      }
    }
  }
}
```

