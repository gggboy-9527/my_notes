<template>
  <div class="note-tree-container">
    <n-tree
      v-if="treeData && treeData.length > 0"
      :data="treeData"
      :default-expand-all="false"
      :selectable="true"
      :block-line="true"
      @update:selected-keys="handleSelect"
    />
    <div v-else class="empty-tree">
      <n-empty description="目录树为空" size="small" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NTree } from 'naive-ui'

const props = defineProps({
  tree: {
    type: Object,
    default: () => ({})
  }
})

const router = useRouter()

// 将树结构转换为 naive-ui 的 tree 数据格式
const treeData = computed(() => {
  console.log('=== NoteTree computed 执行 ===')
  console.log('NoteTree 接收到的 tree:', props.tree)
  console.log('tree 类型:', typeof props.tree)
  console.log('tree 是否为对象:', typeof props.tree === 'object')
  
  if (!props.tree || typeof props.tree !== 'object') {
    console.warn('tree 无效，返回空数组')
    return []
  }
  
  const result = convertTreeToNaiveFormat(props.tree)
  console.log('转换后的 treeData:', result)
  console.log('treeData 长度:', result.length)
  return result
})

function convertTreeToNaiveFormat(tree) {
  console.log('=== convertTreeToNaiveFormat 开始 ===')
  console.log('输入 tree:', tree)
  console.log('tree 类型:', typeof tree)
  console.log('tree 是否为 Proxy:', tree && typeof tree === 'object' && '__v_raw' in tree)
  
  const result = []
  
  try {
    // 如果是 Proxy，获取原始值
    const rawTree = tree && tree.__v_raw ? tree.__v_raw : tree
    console.log('原始 tree:', rawTree)
    
    if (!rawTree || typeof rawTree !== 'object') {
      console.warn('tree 无效')
      return result
    }
    
    // 尝试直接使用 for...in
    for (const key in rawTree) {
      console.log(`处理键: ${key}`)
      const item = rawTree[key]
      console.log(`值:`, item)
      
      if (item && item.type === 'dir') {
        console.log(`发现目录: ${key}`)
        const children = []
        
        // 处理文件
        if (item.children && item.children.files) {
          item.children.files.forEach(file => {
            children.push({
              key: file.path,
              label: file.name,
              isLeaf: true
            })
          })
        }
        
        result.push({
          key: `dir-${key}`,
          label: item.name || key,
          children: children,
          isLeaf: false
        })
      }
    }
  } catch (err) {
    console.error('转换失败:', err)
  }
  
  console.log('=== convertTreeToNaiveFormat 结束 ===')
  console.log('返回结果:', result)
  return result
}

function handleSelect(keys) {
  if (keys.length > 0) {
    const key = keys[0]
    // 只处理文件，不处理目录
    if (key && !key.startsWith('dir-')) {
      router.push(`/notes/${encodeURIComponent(key)}`)
    }
  }
}

// 监听 props.tree 的变化
watch(() => props.tree, (newTree) => {
  console.log('NoteTree: tree prop 变化了', newTree)
}, { immediate: true, deep: true })

onMounted(() => {
  console.log('NoteTree 组件已挂载')
  console.log('初始 tree prop:', props.tree)
  console.log('初始 treeData:', treeData.value)
})
</script>

<style scoped>
.note-tree-container {
  width: 100%;
  min-height: 200px;
}

:deep(.n-tree-node-content) {
  cursor: pointer;
}

.empty-tree {
  padding: 20px;
  text-align: center;
}
</style>

