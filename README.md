# Technical Art Digest

技术美术、图形学、AIGC 与游戏制作的每周精选网站。

## 功能

- 首页展示最新一期与往期封面。
- 支持检索单条资讯，并按主题、年份和月份筛选。
- 单期页面展示摘要、实践价值、图片及原文链接。

## 本地运行

使用任意静态 HTTP 服务打开仓库根目录。页面由原生 HTML、CSS 和 JavaScript 构成，无构建依赖。

`content/issues.json` 提供周报数据；更新后推送 `main` 分支即可触发部署。

## 部署

`.github/workflows/pages.yml` 将静态文件发布到 GitHub Pages。仓库需在 **Settings → Pages** 中选择 **GitHub Actions** 作为来源。
