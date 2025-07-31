<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import supabase from "@renderer/utils/supabase";

// 로딩 상태만 관리
// const isLoading = ref<boolean>(true);
const router = useRouter();

// 세션 확인 및 리다이렉트
const checkSessionAndRedirect = async (): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // 세션이 있으면 홈으로
      router.replace('/home');
    } else {
      // 세션이 없으면 로그인 화면으로
      router.replace('/login');
    }
  } catch (error) {
    console.error("세션 확인 중 오류:", error);
    // 에러 발생 시에도 로그인 화면으로
    router.replace('/login');
  }
};

onMounted(async () => {
  await checkSessionAndRedirect();
});
</script>

<template>
  <!-- 스플래시 스크린 - 세션 확인 중 -->
  <div class="splash-container">
    <div class="spinner"></div>
    <p>로딩 중...</p>
  </div>
</template>

<style scoped>
.splash-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: 9999;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.splash-container p {
  color: #666;
  font-size: 1rem;
}
</style>