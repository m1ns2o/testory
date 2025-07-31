<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router"; // vue-router에서 useRouter를 가져옵니다.
import { googleLogin } from "@renderer/utils/auth";
import supabase from "@renderer/utils/supabase";

// --- 상태 정의 ---
// 초기 세션 확인 로딩 상태
const isLoading = ref<boolean>(true); 
// 로그인 버튼 클릭 후 로딩 상태
const isLoggingIn = ref<boolean>(false); 

const session = ref<any>(null);
const sessionError = ref<any>(null);

// vue-router 인스턴스
const router = useRouter();

// 리스너 제거 함수
let removeListener: (() => void) | null = null;


// --- 핸들러 및 함수 ---

// 로그인 버튼 클릭 핸들러
const onClcik = async (): Promise<void> => {
  isLoggingIn.value = true; // 버튼 로딩 시작
  try {
    await googleLogin();
  } catch (error) {
    console.error("Google login failed:", error);
    // 실제 프로덕션에서는 사용자에게 에러 알림을 보여주는 것이 좋습니다.
    isLoggingIn.value = false; // 에러 발생 시 로딩 상태 해제
  }
  // 성공 시에는 Supabase 코드 처리 후 리다이렉트 되므로 여기서 false로 바꿀 필요는 없습니다.
};

// Supabase 코드 처리 (OAuth 콜백)
const handleSupabaseCode = (code: string): void => {
  processSupabaseCode(code);
};

// 세션 교환 및 리다이렉트
const processSupabaseCode = async (code: string): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Error exchanging code for session:", error);
      isLoggingIn.value = false; // 세션 교환 실패 시 로딩 상태 해제
    } else if (data.session) {
      console.log("Session successfully obtained, redirecting to home...");
      session.value = data.session;
      router.replace('/home'); // 로그인 성공 시 /home으로 리다이렉트
    }
  } catch (err) {
    console.error("Unexpected error during session exchange:", err);
    isLoggingIn.value = false; // 예외 발생 시 로딩 상태 해제
  }
};

// 기존 세션 확인 함수
const checkSession = async (): Promise<void> => {
  try {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (currentSession) {
      console.log("Existing session found, redirecting to home...");
      session.value = currentSession;
      router.replace('/home'); // 세션이 있으면 /home으로 리다이렉트
    } else {
      // 세션이 없으면 로딩을 종료하고 로그인 화면을 보여줍니다.
      isLoading.value = false;
    }
  } catch (err) {
    console.error("세션 조회 중 예외 발생:", err);
    sessionError.value = err;
    isLoading.value = false; // 에러가 발생해도 로딩을 종료합니다.
  }
};


// --- 라이프사이클 훅 ---

onMounted(async () => {
  // Electron 메인 프로세스로부터 오는 콜백 리스너 설정
  if (window.electronAPI) {
    removeListener = window.electronAPI.onSupabaseCode(handleSupabaseCode);
  }
  // 컴포넌트가 마운트되면 세션 확인 시작
  await checkSession();
});

onUnmounted(() => {
  // 컴포넌트가 파괴될 때 리스너 정리
  removeListener?.();
});
</script>

<template>
  <!-- 1. 초기 세션 확인 중 전체 화면 로딩 인디케이터 -->
  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <p>세션 확인 중...</p>
  </div>
  
  <!-- 2. 세션이 없을 때 보여줄 로그인 화면 -->
  <div v-else class="login-container">
    <h1>로그인</h1>
    <p>서비스를 이용하려면 로그인이 필요합니다.</p>
    
    <!-- Nuxt UI의 UButton은 loading 속성을 지원합니다 -->
    <UButton 
      color="neutral" 
      variant="outline" 
      @click="onClcik"
      :loading="isLoggingIn" 
      :disabled="isLoggingIn"
      size="xl"
    >
      Google 계정으로 로그인
    </UButton>
    
    <!-- 에러 메시지 표시 (선택 사항) -->
    <div v-if="sessionError" class="error">
      <p>오류가 발생했습니다: {{ sessionError.message }}</p>
    </div>
  </div>
</template>

<style scoped>
/* 전체 화면 로딩 인디케이터 스타일 */
.loading-overlay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
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

/* 로그인 컨테이너 스타일 */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.login-container h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.login-container p {
  margin-bottom: 2rem;
  color: #666;
}

.error {
  margin-top: 1rem;
  color: #ef4444;
}
</style>
