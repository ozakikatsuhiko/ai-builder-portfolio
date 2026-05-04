# Katsu Ozaki — AI Builder Portfolio

Claude Code と各種 AI エージェントで作った実績を公開するポートフォリオサイト。

## 🚀 公開URL

GitHub Pages デプロイ後にURLが入ります（例: `https://<username>.github.io/<repo>/`）。

## 🛠 構成

```
portfolio/
├── index.html              # メインページ
├── 404.html                # 404 ページ
├── .nojekyll               # GitHub Pages の Jekyll 無効化
├── README.md
└── assets/
    ├── css/styles.css      # スタイル一式
    ├── js/main.js          # モーダル / ナビ / Reveal
    ├── favicon.svg
    └── images/
        ├── 01_workflow.png
        ├── 02_voice_diary.png
        └── 03_neon_tetris.png
```

## ✏️ 編集方法

1. 実績を追加 → `index.html` の `<article class="card">` を複製
2. 画像を追加 → `assets/images/` に配置し `data-img` を更新
3. デザイン変更 → `assets/css/styles.css` の `:root` の CSS 変数を編集

## 🌐 ローカル確認

```bash
cd portfolio
python3 -m http.server 8000
# http://localhost:8000 を開く
```

## 📦 デプロイ（GitHub Pages）

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create <repo-name> --public --source=. --remote=origin --push
gh api -X PATCH /repos/<owner>/<repo>/pages -f source[branch]=main -f source[path]=/
```

または GitHub Web UI から Settings > Pages で `main` / `/` を選択。

---

© 2026 Katsu Ozaki · built with Claude Code
