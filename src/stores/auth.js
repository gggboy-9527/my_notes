import { defineStore } from 'pinia'
import { ref } from 'vue'
import { verifyPassword, setAuthToken, clearAuthToken, isAuthenticated } from '@/utils/auth'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(isAuthenticated())

  function login(password) {
    if (verifyPassword(password)) {
      setAuthToken()
      isLoggedIn.value = true
      return true
    }
    return false
  }

  function logout() {
    clearAuthToken()
    isLoggedIn.value = false
  }

  function checkAuth() {
    isLoggedIn.value = isAuthenticated()
    return isLoggedIn.value
  }

  return {
    isLoggedIn,
    login,
    logout,
    checkAuth
  }
})

