<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { googleLogin } from "@renderer/utils/auth";
import supabase from "@renderer/utils/supabase";

// 상태 정의
const supabaseCode = ref<string>("");
const session = ref<any>(null);
const sessionError = ref<any>(null);

// 리스너 제거 함수
let removeListener: (() => void) | null = null;

// 버튼 클릭 핸들러
const onClcik = async (): Promise<void> => {
  googleLogin();
};

// Supabase 코드 처리 함수
const handleSupabaseCode = (code: string): void => {
  console.log("Received code from main process:", code);
  supabaseCode.value = code;
  processSupabaseCode(code);
};

const processSupabaseCode = async (code: string): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Error exchanging code for session:", error);
    } else {
      console.log("Session data:", data);
      // 세션 갱신
      await getSession();
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

// 세션 가져오기 함수
const getSession = async (): Promise<void> => {
  try {
    const { data: { session: currentSession }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("세션을 가져오는 중 오류 발생:", error);
      sessionError.value = error;
    } else {
      console.log("현재 세션:", currentSession);
      session.value = currentSession;
    }
  } catch (err) {
    console.error("세션 조회 중 예외 발생:", err);
    sessionError.value = err;
  }
};

// 라이프사이클 훅
onMounted(async () => {
  // IPC 리스너 등록
  if (window.electronAPI) {
    removeListener = window.electronAPI.onSupabaseCode(handleSupabaseCode);
  }
  
  // 초기 세션 확인
  await getSession();
});

onUnmounted(() => {
  // 리스너 정리
  removeListener?.();
});
</script>

<template>
  <div>
    <UButton color="neutral" variant="outline" @click="onClcik">Login</UButton>
    
    <div class="mt-4">
      <p v-if="supabaseCode">Received Supabase Code: {{ supabaseCode }}</p>
      
      <div v-if="session" class="session-info">
        <h3>세션 정보:</h3>
        <p>User ID: {{ session.user?.id }}</p>
        <p>Email: {{ session.user?.email }}</p>
        <p>Provider: {{ session.user?.app_metadata?.provider }}</p>
      </div>
      
      <div v-if="sessionError" class="error">
        <p>세션 오류: {{ sessionError.message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mt-4 {
  margin-top: 1rem;
}

.session-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
}

.session-info h3 {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.error {
  margin-top: 1rem;
  color: #ef4444;
}
</style>