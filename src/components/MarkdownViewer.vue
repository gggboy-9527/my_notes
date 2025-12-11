<template>
  <div class="markdown-viewer" ref="containerRef"></div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const containerRef = ref(null)

// 初始化 marked
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false
})

// 使用 highlight.js 进行代码高亮
const highlightCode = () => {
  if (!containerRef.value) return
  
  // 查找所有代码块
  const codeBlocks = containerRef.value.querySelectorAll('pre code')
  
  codeBlocks.forEach((block) => {
    // 获取语言类型
    const lang = block.className.match(/language-(\w+)/)?.[1]
    
    try {
      if (lang && hljs.getLanguage(lang)) {
        // 手动高亮代码
        hljs.highlightElement(block)
      } else {
        // 自动检测语言
        hljs.highlightElement(block)
      }
    } catch (err) {
      console.warn('代码高亮失败:', err)
    }
  })
}

// 渲染 markdown
const renderMarkdown = async () => {
  if (!containerRef.value || !props.content) return
  
  try {
    // 使用 marked 解析 markdown
    const html = await marked.parse(props.content)
    containerRef.value.innerHTML = html
    
    // 等待 DOM 更新后执行代码高亮
    await nextTick()
    highlightCode()
    
  } catch (error) {
    console.error('Markdown 渲染失败:', error)
    containerRef.value.innerHTML = `<p class="error">内容渲染失败</p>`
  }
}

// 监听内容变化
watch(() => props.content, (newVal) => {
  if (newVal !== undefined) {
    renderMarkdown()
  }
})

onMounted(() => {
  if (props.content) {
    renderMarkdown()
  }
})
</script>

<style scoped>
.markdown-viewer {
  padding: 24px;
  line-height: 1.8;
  color: #333;
  min-height: 100px;
}

/* 移除 :deep()，因为我们直接操作 DOM */
.markdown-viewer :deep(h1) {
  font-size: 2em;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
  font-weight: bold;
  border-bottom: 2px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-viewer :deep(h2) {
  font-size: 1.5em;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
  font-weight: bold;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-viewer :deep(h3) {
  font-size: 1.25em;
  margin-top: 1em;
  margin-bottom: 1em;
  font-weight: bold;
}

.markdown-viewer :deep(p) {
  margin: 1em 0;
}

.markdown-viewer :deep(ul),
.markdown-viewer :deep(ol) {
  margin: 1em 0;
  padding-left: 2em;
}

.markdown-viewer :deep(li) {
  margin: 0.5em 0;
}

/* 行内代码样式 */
.markdown-viewer :deep(code:not(pre code)) {
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 3px;
  padding: 2px 6px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
  color: #e83e8c;
}

/* 代码块样式 - 直接应用，因为这是容器内的元素 */
.markdown-viewer pre {
  background-color: #282c34 !important;
  border-radius: 6px;
  padding: 16px !important;
  overflow-x: auto;
  margin: 1em 0 !important;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.markdown-viewer pre code {
  background-color: transparent !important;
  padding: 0 !important;
  font-size: 0.9em;
  color: #abb2bf;
  display: block;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
  line-height: 1.6;
}

/* 直接样式覆盖 highlight.js 生成的元素 */
.markdown-viewer :deep(.hljs) {
  background: #282c34 !important;
  color: #abb2bf;
}

.markdown-viewer :deep(.hljs-comment),
.markdown-viewer :deep(.hljs-quote) {
  color: #5c6370 !important;
  font-style: italic !important;
}

.markdown-viewer :deep(.hljs-keyword),
.markdown-viewer :deep(.hljs-selector-tag),
.markdown-viewer :deep(.hljs-type) {
  color: #c678dd !important;
}

.markdown-viewer :deep(.hljs-string),
.markdown-viewer :deep(.hljs-literal) {
  color: #98c379 !important;
}

.markdown-viewer :deep(.hljs-number) {
  color: #d19a66 !important;
}

.markdown-viewer :deep(.hljs-title),
.markdown-viewer :deep(.hljs-function) {
  color: #61afef !important;
}

.markdown-viewer :deep(.hljs-attribute),
.markdown-viewer :deep(.hljs-tag) {
  color: #e06c75 !important;
}

.markdown-viewer :deep(.hljs-meta) {
  color: #c678dd !important;
}

.markdown-viewer :deep(blockquote) {
  border-left: 4px solid #dfe2e5;
  padding-left: 16px;
  margin: 1em 0;
  color: #6a737d;
}

.markdown-viewer :deep(table) {
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
}

.markdown-viewer :deep(th),
.markdown-viewer :deep(td) {
  border: 1px solid #dfe2e5;
  padding: 8px 12px;
}

.markdown-viewer :deep(th) {
  background-color: #f6f8fa;
  font-weight: 600;
}

.markdown-viewer :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.markdown-viewer :deep(a:hover) {
  text-decoration: underline;
}

.markdown-viewer :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1em 0;
}

.markdown-viewer .error {
  color: #ff4d4f;
  padding: 20px;
  text-align: center;
}
</style>