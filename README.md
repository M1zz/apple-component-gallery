# ⌘ Apple Component Gallery

SwiftUI & UIKit 컴포넌트 갤러리 — 60개 Apple 플랫폼 UI 컴포넌트 레퍼런스

> Inspired by [component.gallery](https://component.gallery), rebuilt for Apple platforms.

## Features

- **60개 컴포넌트** — SwiftUI & UIKit 매핑
- **실시간 검색** — 이름, API명, 별칭으로 검색 (⌘K)
- **카테고리 필터** — Navigation, Forms, Data Display, Feedback, Actions, Layout
- **플랫폼 필터** — iOS, macOS, watchOS, tvOS
- **코드 예제** — Swift 구문 하이라이팅 + 원클릭 복사
- **반응형** — 모바일/태블릿/데스크탑 대응
- **다크 모드** — Apple 스타일 다크 테마

## 디렉토리 구조

```
apple-component-gallery/
├── index.html          # 메인 엔트리 포인트
├── css/
│   └── styles.css      # 전체 스타일시트
├── js/
│   ├── data.js         # 60개 컴포넌트 데이터
│   ├── highlight.js    # Swift 구문 하이라이터
│   └── app.js          # React 메인 앱 (JSX)
├── assets/             # 이미지/아이콘 (확장용)
├── .nojekyll           # GitHub Pages Jekyll 비활성화
└── README.md
```

## GitHub Pages 배포

### 방법 1: 직접 업로드
1. GitHub에 새 레포지토리 생성
2. 전체 폴더를 레포에 업로드
3. **Settings** → **Pages** → Source를 `main` 브랜치로 설정
4. `https://<username>.github.io/<repo-name>/` 에서 접속

### 방법 2: Git CLI
```bash
cd apple-component-gallery
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

### 방법 3: GitHub Actions
`.github/workflows/pages.yml` 파일 추가:

```yaml
name: Deploy to Pages
on:
  push:
    branches: ["main"]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 기술 스택

| 기술 | 용도 |
|------|------|
| React 18 | UI 라이브러리 (CDN) |
| Babel Standalone | 브라우저 JSX 변환 |
| DM Sans | 본문 폰트 |
| JetBrains Mono | 코드 폰트 |

빌드 도구 불필요 — 정적 파일만으로 동작합니다.

## 커스터마이징

### 컴포넌트 추가
`js/data.js`의 `COMPONENTS` 배열에 새 항목을 추가:

```js
{
  id: "mycomp",
  emoji: "🆕",
  name: "My Component",
  aliases: ["Alias1"],
  swiftUI: "MyView",
  uiKit: "UIMyView",
  desc: "설명",
  code: "// SwiftUI code",
  cat: "Navigation",    // 카테고리
  avail: "iOS 18+",
  plat: ["iOS", "macOS"]
}
```

### 스타일 수정
`css/styles.css`의 `:root` CSS 변수를 수정하여 테마를 변경할 수 있습니다.

## License

MIT
