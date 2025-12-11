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
  const result = []
  
  if (!tree || typeof tree !== 'object') {
    console.warn('convertTreeToNaiveFormat: tree 无效', tree)
    return result
  }
  
  Object.keys(tree).forEach(key => {
    const item = tree[key]
    
    if (!item) {
      return
    }
    
    console.log(`处理项: ${key}`, item)
    
    if (item.type === 'file') {
      // 直接的文件项
      result.push({
        key: item.path,
        label: item.name,
        isLeaf: true
      })
    } else if (item.type === 'dir') {
      // 目录项，需要递归处理子节点
      const children = []
      
      // 处理目录下的文件列表（在 children 对象中）
      if (item.children && typeof item.children === 'object') {
        // 先处理 children 中的 files
        if (item.children.files && Array.isArray(item.children.files)) {
          console.log(`  找到 ${item.children.files.length} 个文件`)
          item.children.files.forEach(file => {
            children.push({
              key: file.path,
              label: file.name,
              isLeaf: true
            })
          })
        }
        
        // 再处理 children 中的子目录（排除 files 属性）
        Object.keys(item.children).forEach(childKey => {
          if (childKey !== 'files') {
            const childItem = item.children[childKey]
            if (childItem && childItem.type === 'dir') {
              const subChildren = convertTreeToNaiveFormat({ [childKey]: childItem })
              if (subChildren.length > 0) {
                children.push(...subChildren)
              }
            }
          }
        })
      }
      
      // 处理目录本身的 files（如果有）
      if (item.files && Array.isArray(item.files)) {
        console.log(`  目录本身有 ${item.files.length} 个文件`)
        item.files.forEach(file => {
          children.push({
            key: file.path,
            label: file.name,
            isLeaf: true
          })
        })
      }
      
      console.log(`  目录 ${key} 共有 ${children.length} 个子项`)
      
      result.push({
        key: `dir-${key}`,
        label: item.name || key,
        children: children.length > 0 ? children : [],
        isLeaf: false
      })
    } else if (item.files && Array.isArray(item.files)) {
      // 当前层级有文件列表（根目录的文件）
      item.files.forEach(file => {
        result.push({
          key: file.path,
          label: file.name,
          isLeaf: true
        })
      })
    } else if (typeof item === 'object') {
      // 可能是嵌套的目录结构，但没有明确的 type
      // 检查是否有 children 或 files
      if (item.children || item.files) {
        const children = convertTreeToNaiveFormat(item)
        if (children.length > 0) {
          result.push({
            key: `dir-${key}`,
            label: key,
            children: children,
            isLeaf: false
          })
        }
      }
    }
  })
  
  console.log('convertTreeToNaiveFormat 返回结果:', result)
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

