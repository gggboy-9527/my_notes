<template>
  <Layout>
    <template #sidebar>
      <n-spin :show="notesStore.loading">
        <!-- 关键：根据 store 的状态显示不同内容 -->
        <template v-if="notesStore.error">
          <div class="error-message">
            <n-alert type="error" :title="notesStore.error" />
            <n-button
              type="primary"
              style="margin-top: 16px"
              @click="notesStore.loadNotes"
            >
              重试
            </n-button>
          </div>
        </template>
        
        <template v-else-if="!notesStore.loading && Object.keys(notesStore.notesTree).length === 0">
          <div class="empty-state">
            <n-empty description="未找到笔记索引">
              <template #description>
                <div>
                  <p>未找到笔记索引文件 (index.json)</p>
                  <p style="font-size: 12px; color: #999; margin-top: 8px;">
                    请在笔记仓库根目录创建 index.json 文件
                  </p>
                </div>
              </template>
              <template #extra>
                <n-button size="small" @click="notesStore.loadNotes">
                  刷新
                </n-button>
              </template>
            </n-empty>
          </div>
        </template>
        
        <template v-else-if="!notesStore.loading">
          <NoteTree :tree="notesStore.notesTree" />
        </template>
      </n-spin>
    </template>
    
    <div class="welcome-content">
      <n-result
        status="info"
        title="欢迎使用笔记系统"
        description="请从左侧选择笔记查看"
      >
        <template #icon>
          <n-icon size="100" color="#18a058">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </n-icon>
        </template>
      </n-result>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes'
import Layout from '@/components/Layout.vue'
import NoteTree from '@/components/NoteTree.vue'
import { NSpin, NAlert, NButton, NEmpty, NResult, NIcon } from 'naive-ui'

const notesStore = useNotesStore()

onMounted(() => {
  console.log('NoteList 组件挂载，开始加载笔记')
  notesStore.loadNotes()
})
</script>

<style scoped>
.welcome-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.error-message {
  padding: 16px;
}

.empty-state {
  padding: 32px;
  text-align: center;
}
</style>