// 配置文件
export default {
  // 笔记仓库的 GitHub Pages URL
  // 优先使用环境变量，如果没有则使用默认值
  notesBaseUrl: import.meta.env.VITE_NOTES_BASE_URL || 'https://gggboy-9527.github.io/notes',
  
  // 登录密码（生产环境建议使用环境变量）
  loginPassword: import.meta.env.VITE_LOGIN_PASSWORD || 'admin123',
  
  // 笔记索引文件路径
  notesIndexPath: 'index.json'
}

