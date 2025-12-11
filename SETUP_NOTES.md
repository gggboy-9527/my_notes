# 笔记仓库设置指南

## 笔记获取机制说明

系统通过以下方式获取笔记：

1. **读取索引文件**：从笔记仓库的 GitHub Pages URL 读取 `index.json` 文件，获取所有笔记文件的路径列表
2. **构建目录树**：根据索引文件中的路径，构建左侧的目录树结构
3. **获取笔记内容**：点击笔记时，通过 fetch API 直接从 GitHub Pages 读取对应的 `.md` 文件内容
4. **渲染显示**：使用 Marked 库将 Markdown 转换为 HTML 并显示

## 你现在需要做的事情

### 第一步：创建笔记仓库（如果还没有）

1. 在 GitHub 创建一个新的**公开仓库**（例如：`my-notes-content`）
2. 仓库必须设置为 **Public**（公开）

### 第二步：添加笔记文件

在笔记仓库中按分类组织你的笔记：

```
my-notes-content/
├── index.json          # 笔记索引文件（下一步创建）
├── 前端/
│   ├── vue基础.md
│   └── 组件设计.md
├── 后端/
│   ├── nodejs.md
│   └── 数据库设计.md
└── 算法/
    └── 数据结构.md
```

### 第三步：启用 GitHub Pages

1. 进入笔记仓库的 **Settings**
2. 左侧菜单选择 **Pages**
3. **Source** 选择：`main` 分支（或你的主分支名称）
4. **Folder** 选择：`/ (root)` - 从根目录部署
5. 点击 **Save**
6. 等待几分钟让 GitHub Pages 部署完成

### 第四步：创建索引文件（推荐）

在笔记仓库根目录创建 `index.json` 文件，包含所有笔记文件的路径：

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
    },
    {
      "path": "后端/数据库设计.md"
    },
    {
      "path": "算法/数据结构.md"
    }
  ]
}
```

**或者使用脚本生成**（在笔记仓库目录运行）：
```bash
node scripts/generate-index.js
```

### 第五步：获取 GitHub Pages URL

部署完成后，你的笔记仓库的 GitHub Pages URL 格式为：
```
https://[你的GitHub用户名].github.io/[仓库名]/
```

例如：
- 用户名：`zhangsan`
- 仓库名：`my-notes-content`
- GitHub Pages URL：`https://zhangsan.github.io/my-notes-content`

### 第六步：配置代码仓库

在代码仓库中配置笔记仓库地址：

1. 创建 `.env` 文件（如果还没有）：
   ```bash
   cp env.example .env
   ```

2. 编辑 `.env` 文件，填入你的配置：
   ```env
   # 笔记仓库的 GitHub Pages URL（替换为你的实际地址）
   VITE_NOTES_BASE_URL=https://zhangsan.github.io/my-notes-content
   
   # 登录密码（修改为你想要的密码）
   VITE_LOGIN_PASSWORD=your-secure-password
   ```

3. 重启开发服务器（如果正在运行）：
   ```bash
   # 停止当前服务器（Ctrl + C）
   npm run dev
   ```

## 验证设置

1. **验证 GitHub Pages 部署**：
   - 访问你的 GitHub Pages URL（例如：`https://zhangsan.github.io/my-notes-content`）
   - 应该能看到文件列表或直接访问到文件

2. **验证索引文件**：
   - 访问：`https://zhangsan.github.io/my-notes-content/index.json`
   - 应该能看到 JSON 格式的索引内容

3. **验证笔记文件**：
   - 访问：`https://zhangsan.github.io/my-notes-content/前端/vue基础.md`
   - 应该能看到 Markdown 文件的原始内容

4. **验证应用**：
   - 启动应用：`npm run dev`
   - 登录后，左侧应该能看到笔记目录树
   - 点击笔记应该能正常显示内容

## 常见问题

### Q: 如何知道我的 GitHub Pages URL？
A: 格式是 `https://[用户名].github.io/[仓库名]`，你可以在仓库的 Settings → Pages 页面看到。

### Q: 索引文件是必须的吗？
A: 不是必须的，但强烈推荐。没有索引文件时，目录树可能无法正常显示。

### Q: 笔记文件路径有要求吗？
A: 
- 使用 `/` 作为路径分隔符
- 路径相对于仓库根目录
- 建议使用中文文件夹名和文件名（会被 URL 编码）

### Q: 更新笔记后需要做什么？
A: 
- 推送到 GitHub
- 如果修改了文件结构，更新 `index.json`
- 应用会自动读取最新内容（无需重启）

## 示例配置

假设：
- GitHub 用户名：`zhangsan`
- 笔记仓库名：`my-notes-content`
- 登录密码：`mypassword123`

`.env` 文件内容：
```env
VITE_NOTES_BASE_URL=https://zhangsan.github.io/my-notes-content
VITE_LOGIN_PASSWORD=mypassword123
```

笔记仓库结构：
```
my-notes-content/
├── index.json
├── 前端/
│   └── vue基础.md
└── 后端/
    └── nodejs.md
```

`index.json` 内容：
```json
{
  "files": [
    { "path": "前端/vue基础.md" },
    { "path": "后端/nodejs.md" }
  ]
}
```

