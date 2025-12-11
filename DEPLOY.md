# 自动化部署说明

## GitHub Actions CI/CD 配置

项目已配置 GitHub Actions，实现自动构建和部署到 GitHub Pages。

## 设置步骤

### 1. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Pages**
3. 在 **Source** 部分，选择 **GitHub Actions**（不是分支）
4. 保存设置

### 2. 配置环境变量（可选）

如果需要使用敏感信息（如登录密码），可以配置 GitHub Secrets：

1. 进入仓库 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加以下 secrets（可选）：
   - `VITE_NOTES_BASE_URL`: 笔记仓库的 GitHub Pages URL
   - `VITE_LOGIN_PASSWORD`: 登录密码

如果不配置 secrets，工作流会使用默认值。

### 3. 推送代码

```bash
git add .
git commit -m "Add CI/CD workflow"
git push origin main
```

### 4. 查看部署状态

1. 进入仓库的 **Actions** 标签页
2. 查看工作流运行状态
3. 部署成功后，访问你的 GitHub Pages URL

## 工作流说明

### 触发条件

- **自动触发**：当代码推送到 `main` 分支时
- **手动触发**：在 Actions 页面可以手动运行工作流

### 工作流程

1. **Checkout**: 检出代码
2. **Setup Node.js**: 设置 Node.js 环境（版本 20）
3. **Install dependencies**: 安装项目依赖
4. **Build**: 构建项目（生成 `dist` 目录）
5. **Upload artifact**: 上传构建产物
6. **Deploy**: 部署到 GitHub Pages

### 部署地址

部署成功后，你的应用将可以通过以下地址访问：

```
https://[你的用户名].github.io/[仓库名]/
```

例如：`https://gggboy-9527.github.io/my_notes/`

## 注意事项

1. **首次部署**：需要在仓库 Settings → Pages 中启用 GitHub Actions 作为部署源
2. **构建时间**：首次构建可能需要几分钟，后续构建会更快
3. **环境变量**：敏感信息建议使用 GitHub Secrets，不要直接写在代码中
4. **分支名称**：如果主分支不是 `main`，需要修改 `.github/workflows/deploy.yml` 中的分支名称

## 故障排查

### 部署失败

1. 检查 Actions 标签页的错误信息
2. 确认 GitHub Pages 已启用 GitHub Actions 作为部署源
3. 检查环境变量配置是否正确

### 页面无法访问

1. 确认部署已成功完成
2. 检查 GitHub Pages URL 是否正确
3. 等待几分钟让 DNS 生效

