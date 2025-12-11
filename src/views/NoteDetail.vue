<template>
  <Layout>
    <template #sidebar>
      <n-spin :show="notesStore.loading">
        <!-- 同样添加这层包装 -->
        <template v-if="!notesStore.loading">
          <NoteTree :tree="notesStore.notesTree" />
        </template>
      </n-spin>
    </template>
    
    <!-- 右侧内容保持不变 -->
    <div class="note-detail">
      <n-spin :show="loading">
        <div v-if="error" class="error-container">
          <n-alert type="error" :title="error" />
          <n-button
            type="primary"
            style="margin-top: 16px"
            @click="loadNote"
          >
            重试
          </n-button>
        </div>
        <div v-else-if="content" class="note-content">
          <MarkdownViewer :content="content" />
        </div>
        <div v-else class="empty-content">
          <n-empty description="加载中..." />
        </div>
      </n-spin>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { getNoteContent } from '@/utils/api'
import Layout from '@/components/Layout.vue'
import NoteTree from '@/components/NoteTree.vue'
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import { NSpin, NAlert, NButton, NEmpty } from 'naive-ui'

const route = useRoute()
const notesStore = useNotesStore()

const content = ref('')
const loading = ref(false)
const error = ref('')

async function loadNote() {
  const notePath = route.params.pathMatch
  if (!notePath) {
    error.value = '笔记路径不存在'
    return
  }

  loading.value = true
  error.value = ''
  content.value = ''

  try {
    // 解码路径
    const decodedPath = decodeURIComponent(Array.isArray(notePath) ? notePath.join('/') : notePath)
    const noteContent = await getNoteContent(decodedPath)
    content.value = noteContent
  } catch (err) {
    error.value = err.message || '加载笔记失败'
    console.error('加载笔记失败:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNote()
  // 如果笔记列表未加载，先加载列表
  if (Object.keys(notesStore.notesTree).length === 0) {
    notesStore.loadNotes()
  }
})

// 监听路由变化
watch(() => route.params.pathMatch, () => {
  loadNote()
}, { deep: true })
</script>

<style scoped>
.note-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.note-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.error-container {
  padding: 24px;
  text-align: center;
}

.empty-content {
  padding: 48px;
  text-align: center;
}
</style>

