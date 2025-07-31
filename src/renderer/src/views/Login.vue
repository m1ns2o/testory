<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { googleLogin } from "@renderer/utils/auth";
import supabase from "@renderer/utils/supabase";
import router from "@renderer/router";

// 상태 정의
const supabaseCode = ref<string>("");
// const session = ref<any>(null);
// const sessionError = ref<any>(null);

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
      // await getSession();
      console.log("Session successfully obtained, redirecting to home...");
      router.replace("/home"); // 로그인 성공 시 /home으로 리다이렉트
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

// 세션 가져오기 함수
// const getSession = async (): Promise<void> => {
//   try {
//     const {
//       data: { session: currentSession },
//       error,
//     } = await supabase.auth.getSession();

//     if (error) {
//       console.error("세션을 가져오는 중 오류 발생:", error);
//       sessionError.value = error;
//     } else {
//       console.log("현재 세션:", currentSession);
//       session.value = currentSession;
//     }
//   } catch (err) {
//     console.error("세션 조회 중 예외 발생:", err);
//     sessionError.value = err;
//   }
// };

// 라이프사이클 훅
onMounted(async () => {
  if (window.electronAPI) {
    removeListener = window.electronAPI.onSupabaseCode(handleSupabaseCode);
  }
  // await getSession();
});

onUnmounted(() => {
  // 리스너 정리
  removeListener?.();
});
</script>

<template>
  <div>
    <UButton color="neutral" variant="outline" @click="onClcik">Login</UButton>
    <!-- <UColorPicker default-value="#00BCD4" /> -->
    <UChatPrompt variant="soft">
      <UChatPromptSubmit />
    </UChatPrompt>
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>
