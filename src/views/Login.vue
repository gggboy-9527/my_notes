<template>
  <div class="login-container">
    <n-card class="login-card">
      <template #header>
        <h2>我的笔记</h2>
      </template>
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password-on="click"
            @keyup.enter="handleLogin"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button
          type="primary"
          block
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </n-button>
      </template>
      <n-alert v-if="error" type="error" style="margin-top: 16px">
        {{ error }}
      </n-alert>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { NCard, NForm, NFormItem, NInput, NButton, NAlert } from 'naive-ui'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref(null)
const formData = ref({
  password: ''
})
const loading = ref(false)
const error = ref('')

const rules = {
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

async function handleLogin() {
  error.value = ''
  
  try {
    await formRef.value?.validate()
    loading.value = true
    
    if (authStore.login(formData.value.password)) {
      router.push('/notes')
    } else {
      error.value = '密码错误，请重试'
    }
  } catch (e) {
    console.error('验证失败:', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-card h2 {
  text-align: center;
  margin: 0;
  color: #333;
}
</style>

