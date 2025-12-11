<template>
  <n-layout has-sider class="main-layout">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="300"
      :collapsed="collapsed"
      show-trigger
      class="sidebar-layout"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <div class="sidebar-header">
        <n-button
          quaternary
          circle
          @click="handleLogout"
          style="margin-left: auto"
        >
          <template #icon>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </n-icon>
          </template>
        </n-button>
      </div>
      <div class="sidebar-content">
        <slot name="sidebar"></slot>
      </div>
    </n-layout-sider>
    <n-layout class="content-layout">
      <n-layout-content class="content-area">
        <slot></slot>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { NLayout, NLayoutSider, NLayoutContent, NButton, NIcon } from 'naive-ui'

const router = useRouter()
const authStore = useAuthStore()
const collapsed = ref(false)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
  overflow: hidden;
}

.sidebar-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--n-border-color);
  flex-shrink: 0;
}

.sidebar-content {
  padding: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0; /* 配合 flex: 1 使用，确保正确计算高度 */
}

.content-layout {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;
  min-height: 0;
}
</style>

