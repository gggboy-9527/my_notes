import config from '@/config'

const AUTH_KEY = 'notes_auth_token'

/**
 * 验证密码
 */
export function verifyPassword(password) {
  return password === config.loginPassword
}

/**
 * 设置登录状态
 */
export function setAuthToken() {
  localStorage.setItem(AUTH_KEY, 'authenticated')
}

/**
 * 清除登录状态
 */
export function clearAuthToken() {
  localStorage.removeItem(AUTH_KEY)
}

/**
 * 检查是否已登录
 */
export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'authenticated'
}

