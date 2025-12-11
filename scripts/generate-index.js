/**
 * 生成笔记索引文件的脚本
 * 使用方法：在笔记仓库根目录运行 node scripts/generate-index.js
 * 
 * 注意：这个脚本需要在笔记仓库中运行，不是在代码仓库中
 */

import { readdir, stat, writeFile } from 'fs/promises'
import { join, extname } from 'path'

async function getAllMarkdownFiles(dir, basePath = '') {
  const files = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      // 递归读取子目录
      const subFiles = await getAllMarkdownFiles(fullPath, relativePath)
      files.push(...subFiles)
    } else if (entry.isFile() && extname(entry.name) === '.md') {
      // 只包含 .md 文件
      files.push({
        path: relativePath
      })
    }
  }

  return files
}

async function generateIndex() {
  try {
    const rootDir = process.cwd()
    console.log('正在扫描目录:', rootDir)
    
    const files = await getAllMarkdownFiles(rootDir)
    console.log(`找到 ${files.length} 个 Markdown 文件`)
    
    const index = {
      files: files.sort((a, b) => a.path.localeCompare(b.path))
    }
    
    const outputPath = join(rootDir, 'index.json')
    await writeFile(outputPath, JSON.stringify(index, null, 2), 'utf-8')
    
    console.log('索引文件已生成:', outputPath)
    console.log('文件列表:')
    files.forEach(file => {
      console.log(`  - ${file.path}`)
    })
  } catch (error) {
    console.error('生成索引失败:', error)
    process.exit(1)
  }
}

generateIndex()

