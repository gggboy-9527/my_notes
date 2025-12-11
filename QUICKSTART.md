# 快速开始指南

## 第一步：准备笔记仓库

1. 在 GitHub 创建一个新的**公开仓库**（例如：`my-notes-content`）

2. 在仓库中添加你的笔记文件，按分类组织：
   ```
   my-notes-content/
   ├── 前端/
   │   └── vue基础.md
   ├── 后端/
   │   └── nodejs.md
   └── 算法/
       └── 数据结构.md
   ```

3. 启用 GitHub Pages：
   - 进入仓库 Settings → Pages
   - Source 选择 `main` 分支
   - Folder 选择 `/ (root)`
   - 保存

4. 等待 GitHub Pages 部署完成（通常几分钟）

5. 验证部署：访问 `https://your-username.github.io/my-notes-content/` 应该能看到文件列表

6. （可选）创建索引文件 `index.json`：
   ```json
   {
     "files": [
       { "path": "前端/vue基础.md" },
       { "path": "后端/nodejs.md" },
       { "path": "算法/数据结构.md" }
     ]
   }
   ```

## 第二步：配置代码仓库

1. 安装依赖：
   ```bash
   npm install
   ```

2. 创建 `.env` 文件：
   ```bash
   cp env.example .env
   ```

3. 编辑 `.env` 文件，填入你的配置：
   ```env
   VITE_NOTES_BASE_URL=https://your-username.github.io/my-notes-content
   VITE_LOGIN_PASSWORD=your-secure-password
   ```

## 第三步：本地开发

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 打开浏览器访问显示的地址（通常是 `http://localhost:5173`）

3. 输入密码登录

4. 测试笔记加载和显示

## 第四步：部署代码仓库

1. 构建项目：
   ```bash
   npm run build
   ```

2. 将 `dist` 目录内容推送到 GitHub Pages：
   - 创建新的 GitHub 仓库（例如：`my-notes-viewer`）
   - 启用 GitHub Pages
   - 将 `dist` 目录内容推送到仓库

3. 或者使用 GitHub Actions 自动部署（推荐）

## 常见问题

### Q: 笔记列表显示为空？
A: 检查以下几点：
- 笔记仓库是否已启用 GitHub Pages
- `VITE_NOTES_BASE_URL` 配置是否正确
- 是否创建了 `index.json` 文件
- 浏览器控制台是否有错误信息

### Q: 无法加载笔记内容？
A: 检查：
- 笔记文件路径是否正确
- GitHub Pages 是否已部署完成
- 文件路径中是否包含特殊字符（需要 URL 编码）

### Q: 登录后无法访问笔记？
A: 检查：
- 路由配置是否正确
- 浏览器控制台是否有错误
- 认证状态是否正常保存

## 下一步

- 自定义 UI 样式
- 添加搜索功能
- 添加笔记分类筛选
- 优化加载性能

