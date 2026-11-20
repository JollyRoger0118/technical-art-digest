# Technical Art Digest

技术美术、图形学、AIGC 与游戏制作周报网站。网站只展示周报；日报继续保存在 Notion。

## 浏览

- 首页展示最新一期、本周推荐、往期封面。
- 搜索可命中单条资讯的标题、摘要与来源，并可按主题、年份、月份筛选。
- 单期页面保留原文链接、发布日期、图片来源与实践价值。

## 内容

`content/issues.json` 是网站的内容源。每期含 `number`、`start`、`end`、`recommendations`、`items`、`trend`、`practice`、`watch`。历史补档有 `backfill: true`，只收录可核实的条目；早期条数少于常规周报时保持实际条数。

第 8–10 期导入已有 Notion 周报，第 1–7 期按原文实际发布日期补档。原始图片保留来源链接，版权归作者所有。历史导入的第 10 期 ArtStation 政策条目暂无可核实配图，页面仍保留原有文字与原文链接。

## 本地预览

在仓库根目录运行任意静态 HTTP 服务，例如 `npx serve .`，再打开本地地址。页面使用原生 HTML、CSS 与 JavaScript，无构建依赖。

## 发布

推送 `main` 会触发 `.github/workflows/pages.yml`。在 GitHub 仓库 **Settings → Pages** 中把 **Build and deployment → Source** 设为 **GitHub Actions**。部署地址为 `https://jollyroger0118.github.io/technical-art-digest/`。
