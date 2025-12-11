# 我的笔记系统

基于 Vue3 + Vite + Naive UI 构建的笔记查看系统，支持从 GitHub Pages 读取笔记内容。

## 功能特性

- 🔐 登录认证保护
- 📁 笔记目录树展示
- 📝 Markdown 渲染支持
- 💻 代码高亮
- 📱 响应式设计
- 🚀 静态部署支持

## 项目结构

```
my_notes/
├── src/
│   ├── components/      # 组件
│   ├── views/          # 页面视图
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia 状态管理
│   ├── utils/          # 工具函数
│   └── config/         # 配置文件
├── public/             # 静态资源
└── dist/               # 构建输出
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `env.example` 为 `.env` 并修改配置：

```bash
cp env.example .env
```

编辑 `.env` 文件：

```env
# 笔记仓库的 GitHub Pages URL
VITE_NOTES_BASE_URL=https://your-username.github.io/your-notes-repo

# 登录密码
VITE_LOGIN_PASSWORD=your-password
```

**注意**：如果没有 `.env` 文件，系统会使用 `src/config/index.js` 中的默认值。

### 3. 开发运行

```bash
npm run dev
```

### 4. 构建部署

```bash
npm run build
```

构建后的文件在 `dist` 目录，可以部署到 GitHub Pages 或其他静态托管服务。

## 笔记仓库设置

### 1. 创建笔记仓库

1. 在 GitHub 创建一个新的公开仓库（如：`my-notes-content`）
2. 将笔记文件按分类放入不同文件夹：

```
my-notes-content/
├── index.json          # 笔记索引（可选）
├── 前端/
│   ├── vue基础.md
│   └── 组件设计.md
├── 后端/
│   ├── nodejs.md
│   └── 数据库设计.md
└── 算法/
    └── 数据结构.md
```

### 2. 启用 GitHub Pages

1. 进入仓库 Settings
2. 选择 Pages
3. Source 选择 `main` 分支
4. Folder 选择 `/ (root)`
5. 保存

### 3. 创建索引文件（可选但推荐）

在笔记仓库根目录创建 `index.json`，包含所有笔记文件的路径。

**手动创建**：

```json
{
  "files": [
    {
      "path": "前端/vue基础.md"
    },
    {
      "path": "前端/组件设计.md"
    },
    {
      "path": "后端/nodejs.md"
    }
  ]
}
```

**使用脚本生成**（推荐）：

在笔记仓库根目录运行索引生成脚本（需要 Node.js）：

```bash
# 将 scripts/generate-index.js 复制到笔记仓库
node scripts/generate-index.js
```

脚本会自动扫描所有 `.md` 文件并生成 `index.json`。

## 技术栈

- Vue 3 (Composition API)
- Vite
- Naive UI
- Vue Router
- Pinia
- Marked (Markdown 解析)
- DOMPurify (HTML 清理)
- Highlight.js (代码高亮)

## 使用流程

### 第一次使用

1. **创建笔记仓库**：
   - 在 GitHub 创建公开仓库（如：`my-notes-content`）
   - 按分类组织笔记文件
   - 启用 GitHub Pages

2. **配置代码仓库**：
   - 克隆或下载本代码仓库
   - 安装依赖：`npm install`
   - 配置 `.env` 文件，设置笔记仓库 URL 和登录密码
   - 开发测试：`npm run dev`

3. **部署代码仓库**：
   - **推荐**：使用 GitHub Actions 自动部署（已配置）
     - 推送代码到 GitHub：`git push origin main`
     - 在仓库 Settings → Pages 中启用 GitHub Actions 作为部署源
     - 详细说明请查看 [DEPLOY.md](DEPLOY.md)
   - **手动部署**：
     - 构建项目：`npm run build`
     - 将 `dist` 目录内容推送到 GitHub Pages

### 日常使用

1. **更新笔记**：
   - 在笔记仓库中添加或修改 `.md` 文件
   - 推送到 GitHub
   - 如果使用索引文件，记得更新 `index.json`

2. **访问笔记**：
   - 打开部署后的应用地址
   - 输入密码登录
   - 从左侧目录树选择笔记查看

## 注意事项

1. **安全性**：
   - 当前实现使用前端密码验证，适合个人使用
   - 密码存储在环境变量中，构建时注入
   - 如需更高安全性，建议使用后端服务

2. **笔记仓库设置**：
   - 笔记仓库必须设置为**公开**（Public）
   - 必须启用 GitHub Pages
   - GitHub Pages 免费版只支持公开仓库

3. **CORS**：
   - GitHub Pages 支持跨域访问
   - 可以直接通过 fetch API 读取文件
   - 无需配置 CORS 头

4. **索引文件**：
   - `index.json` 是可选的，但强烈推荐使用
   - 没有索引文件时，目录树可能无法正常显示
   - 每次添加新笔记后，记得更新索引文件

5. **文件路径**：
   - 笔记路径使用 `/` 作为分隔符
   - 路径会进行 URL 编码处理
   - 确保文件路径不包含特殊字符

## License

MIT

