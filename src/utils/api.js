import config from '@/config'

/**
 * 获取笔记索引
 */
export async function getNotesIndex() {
  try {
    const url = `${config.notesBaseUrl}/${config.notesIndexPath}`
    const response = await fetch(url)
    
    if (!response.ok) {
      // 如果文件不存在（404），返回空结构
      if (response.status === 404) {
        console.warn('索引文件不存在，返回空列表')
        return { files: [] }
      }
      throw new Error(`获取索引失败: ${response.status}`)
    }
    
    // 检查响应内容类型
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      // 如果返回的不是 JSON（可能是 HTML 404 页面），返回空结构
      console.warn('响应不是 JSON 格式，可能是文件不存在')
      return { files: [] }
    }
    
    const text = await response.text()
    
    // 如果响应为空，返回空结构
    if (!text || text.trim().length === 0) {
      console.warn('索引文件为空')
      return { files: [] }
    }
    
    // 尝试解析 JSON，并修复常见格式错误
    try {
      // 先尝试直接解析
      return JSON.parse(text)
    } catch (parseError) {
      console.warn('JSON 解析失败，尝试修复格式错误...', parseError)
      
      // 尝试修复常见的 JSON 格式错误
      let fixedText = text.trim()
      
      // 1. 移除数组和对象末尾的逗号（包括跨行的情况）
      // 匹配：逗号 + 任意空白字符（包括换行）+ ] 或 }
      fixedText = fixedText.replace(/,(\s*[}\]])/g, '$1')
      // 额外处理：行末逗号后跟换行和 ] 或 }
      fixedText = fixedText.replace(/,\s*\n\s*([}\]])/g, '\n$1')
      
      // 2. 确保 JSON 结构完整（如果被截断，尝试修复）
      if (!fixedText.endsWith('}') && !fixedText.endsWith(']')) {
        // 如果以逗号结尾，移除它
        fixedText = fixedText.replace(/,\s*$/, '')
        // 尝试补全结构
        const openBraces = (fixedText.match(/\{/g) || []).length
        const closeBraces = (fixedText.match(/\}/g) || []).length
        const openBrackets = (fixedText.match(/\[/g) || []).length
        const closeBrackets = (fixedText.match(/\]/g) || []).length
        
        // 补全缺失的闭合括号
        if (openBrackets > closeBrackets) {
          fixedText += ']'.repeat(openBrackets - closeBrackets)
        }
        if (openBraces > closeBraces) {
          fixedText += '}'.repeat(openBraces - closeBraces)
        }
      }
      
      // 再次尝试解析
      try {
        const parsed = JSON.parse(fixedText)
        console.log('JSON 格式已修复，解析成功')
        return parsed
      } catch (secondError) {
        console.error('JSON 解析失败（已尝试修复）:', secondError)
        console.error('原始内容（前500字符）:', text.substring(0, 500))
        console.error('修复后内容（前500字符）:', fixedText.substring(0, 500))
        return { files: [] }
      }
    }
  } catch (error) {
    console.error('获取笔记索引失败:', error)
    // 如果索引文件不存在，返回空结构
    return { files: [] }
  }
}

/**
 * 获取笔记内容
 */
export async function getNoteContent(path) {
  try {
    // 确保路径以 / 开头
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const url = `${config.notesBaseUrl}${normalizedPath}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`获取笔记失败: ${response.status}`)
    }
    
    return await response.text()
  } catch (error) {
    console.error('获取笔记内容失败:', error)
    throw error
  }
}

/**
 * 构建目录树结构
 */
export function buildDirectoryTree(files) {
  const tree = {}
  
  if (!files || !Array.isArray(files)) {
    console.warn('buildDirectoryTree: files 不是数组', files)
    return tree
  }
  
  files.forEach(file => {
    if (!file || !file.path) {
      console.warn('buildDirectoryTree: 文件项缺少 path 属性', file)
      return
    }
    
    const parts = file.path.split('/').filter(p => p)
    if (parts.length === 0) {
      return
    }
    
    let current = tree
    
    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1
      const isMarkdownFile = file.path.endsWith('.md')
      
      if (isLast && isMarkdownFile) {
        // 文件：添加到当前层级的 files 数组
        if (!current.files) {
          current.files = []
        }
        current.files.push({
          name: part,
          path: file.path,
          type: 'file'
        })
      } else {
        // 目录：创建或获取目录节点
        if (!current[part]) {
          current[part] = {
            name: part,
            type: 'dir',
            children: {}
          }
        }
        // 移动到子目录
        current = current[part].children
      }
    })
  })
  
  console.log('buildDirectoryTree 构建结果:', tree)
  return tree
}

