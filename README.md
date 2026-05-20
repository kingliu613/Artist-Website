# Artist Website Handoff

这是一个从静态 HTML 迁移到 Next.js 的中国艺术品交易/内容社区原型。当前重点是让所有看起来可点击的元素都有真实交互，并逐步往“小红书式”的内容、收藏、笔记和个人主页体验扩展。

## Run

```bash
npm install
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

本地入口：

- 首页：http://127.0.0.1:3000
- 作品详情：http://127.0.0.1:3000/artwork?work=spiral-jar
- 我的主页：http://127.0.0.1:3000/profile?user=me
- 发布页：http://127.0.0.1:3000/publish
- 新作专题：http://127.0.0.1:3000/drops?drop=limited-editions

## Structure

- `pages/`：Next.js Pages Router 页面。
  - `index.jsx`：市场首页、筛选、收藏、出价、新作、创作者笔记。
  - `artwork.jsx`：作品详情、购买、出价、评论。
  - `profile.jsx`：个人主页、作品/收藏夹/笔记 tab、关注、私信、认证说明。
  - `publish.jsx`：发布作品表单、上传、实时预览、保存草稿、提交审核。
  - `drops.jsx` / `drop.jsx`：新作专题页。
- `components/`：共享组件，包括 `SiteHeader`、`Modal`、`Toast`、`useLocalStorageState`。
- `data/siteData.js`：所有演示数据：作品、个人主页、新作专题、收藏夹、笔记。
- `public/assets/`：图片和头像资源。旧静态站的 `assets/` 已移到这里。
- `styles.css`：全站样式，仍沿用旧静态站视觉系统。

## Current Features

- 首页作品可搜索、筛选、选择、收藏、打开详情、参与出价。
- 首页三张新作卡分别跳转独立专题页：
  - `limited-editions`：苏河湾限量版画
  - `jingdezhen-objects`：景德镇小器物
  - `young-ink`：九五后水墨
- 创作者笔记现在跳到对应主页：
  - 陈墨：`/profile?user=chenmo`
  - 林悦：`/profile?user=artist`
  - 安岐：`/profile?user=anqi`
- 个人页头像已改为图片，认证项左侧是图标。
- `/profile?user=me` 默认打开收藏夹 tab；默认收藏夹可点开查看作品。
- 个人页增加小红书式笔记流，支持点赞、收藏、评论弹层、分享演示反馈。
- 发布页支持表单实时预览、上传文件、交易方式/凭证勾选、保存草稿、提交审核。
- 交互状态目前都存在 `localStorage`，没有后端。

## Important Notes

- 这是演示原型，不要接真实支付、真实上传或真实交易。
- 目前使用 Next.js Pages Router，不是 App Router。
- 头像资源有限，`chenmo` 和 `anqi` 暂时复用现有 SVG 头像；后续可以补真实头像图。
- `npm install` 后 npm 可能提示中等漏洞。没有使用 `npm audit fix --force`，因为它可能做破坏性版本升级。
- 旧静态 HTML/JS 文件仍在根目录作参考，但实际运行走 Next 页面。

## Good Next Tasks

- 给陈墨、安岐、林悦补真实头像和更明确的个人主页封面。
- 首页新增“发现”信息流，把作品、笔记、专题混排，而不是只有市场。
- 给收藏夹增加新建、重命名、移动作品功能。
- 给作品详情增加图片轮播、尺寸/证书/物流详情 tab。
- 给发布页增加真实多图预览、删除上传文件、草稿恢复。
- 如果要变成产品，可加后端：用户、作品、评论、收藏夹、订单/出价 API。
