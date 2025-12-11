import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getNotesIndex, buildDirectoryTree } from '@/utils/api'

export const useNotesStore = defineStore('notes', () => {
  const notesTree = ref({})
  const loading = ref(false)
  const error = ref(null)

  async function loadNotes() {
    loading.value = true
    error.value = null
    
    try {
      const index = await getNotesIndex()
      console.log('获取到的索引数据:', index)
      
      // 如果有索引文件，使用索引构建树
      if (index.files && index.files.length > 0) {
        console.log('文件数量:', index.files.length)
        notesTree.value = buildDirectoryTree(index.files)
        console.log('构建的目录树:', notesTree.value)
      } else {
        console.warn('索引文件为空或格式不正确')
        // 如果没有索引文件，尝试从根目录读取
        // 这里可以扩展为使用 GitHub API 获取目录结构
        notesTree.value = {}
      }
    } catch (err) {
      error.value = err.message
      console.error('加载笔记失败:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    notesTree,
    loading,
    error,
    loadNotes
  }
})

