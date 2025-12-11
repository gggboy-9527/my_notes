import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/notes'
  },
  {
    path: '/notes',
    name: 'NoteList',
    component: () => import('@/views/NoteList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notes/:pathMatch(.*)*',
    name: 'NoteDetail',
    component: () => import('@/views/NoteDetail.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth) {
    if (authStore.checkAuth()) {
      next()
    } else {
      next('/login')
    }
  } else {
    // 如果已登录，访问登录页时重定向到笔记列表
    if (to.path === '/login' && authStore.checkAuth()) {
      next('/notes')
    } else {
      next()
    }
  }
})

export default router

