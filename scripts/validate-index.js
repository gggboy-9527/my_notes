/**
 * 验证和修复 index.json 文件的脚本
 * 使用方法：node scripts/validate-index.js [index.json路径]
 */

import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

async function validateAndFixIndex(filePath) {
  try {
    console.log('正在读取文件:', filePath)
    const content = await readFile(filePath, 'utf-8')
    
    console.log('\n原始内容:')
    console.log(content)
    console.log('\n' + '='.repeat(50))
    
    // 尝试解析
    let json
    try {
      json = JSON.parse(content)
      console.log('✅ JSON 格式正确！')
      console.log('文件数量:', json.files?.length || 0)
      return json
    } catch (error) {
      console.log('❌ JSON 格式错误:', error.message)
      console.log('\n尝试修复...')
      
      // 修复常见错误
      let fixed = content.trim()
      
      // 1. 移除末尾逗号
      fixed = fixed.replace(/,(\s*[}\]])/g, '$1')
      
      // 2. 补全缺失的闭合括号
      const openBraces = (fixed.match(/\{/g) || []).length
      const closeBraces = (fixed.match(/\}/g) || []).length
      const openBrackets = (fixed.match(/\[/g) || []).length
      const closeBrackets = (fixed.match(/\]/g) || []).length
      
      if (openBrackets > closeBrackets) {
        fixed += '\n' + ']'.repeat(openBrackets - closeBrackets)
      }
      if (openBraces > closeBraces) {
        fixed += '\n' + '}'.repeat(openBraces - closeBraces)
      }
      
      console.log('\n修复后的内容:')
      console.log(fixed)
      console.log('\n' + '='.repeat(50))
      
      // 再次尝试解析
      try {
        json = JSON.parse(fixed)
        console.log('✅ 修复成功！')
        console.log('文件数量:', json.files?.length || 0)
        
        // 询问是否保存
        console.log('\n修复后的文件已保存为 index.json.fixed')
        await writeFile(filePath + '.fixed', JSON.stringify(json, null, 2), 'utf-8')
        console.log('你可以检查 index.json.fixed，如果正确，可以替换原文件')
        
        return json
      } catch (secondError) {
        console.log('❌ 修复失败:', secondError.message)
        throw secondError
      }
    }
  } catch (error) {
    console.error('错误:', error.message)
    process.exit(1)
  }
}

// 获取文件路径
const filePath = process.argv[2] || 'index.json'

validateAndFixIndex(filePath)
  .then(() => {
    console.log('\n✅ 验证完成')
  })
  .catch(error => {
    console.error('\n❌ 验证失败:', error)
    process.exit(1)
  })

