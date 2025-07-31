<template>
  <div>
    <UButton color="neutral" variant="outline" @click="logout">logout</UButton>
  </div>
</template>

<script setup>
import router from "@renderer/router";
import supabase from "@renderer/utils/supabase";
const logout = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("로그아웃 중 오류 발생:", error);
        router.push("/");
        // 로그아웃 실패 시 에러 처리
      } else {
        // 로그인 페이지나 홈으로 리디렉션
        console.log("성공적으로 로그아웃되었습니다.");
        router.push("/login"); // 로그인 페이지로 리다이렉트
      }
    } else {
      console.log("활성 세션이 없습니다. 이미 로그아웃된 상태입니다.");
      router.push("/");
      // 세션이 없는 경우 처리 (예: 리디렉션)
    }
  } catch (error) {
    console.error("로그아웃 중 예기치 않은 오류 발생:", error);
    router.push("/");
  }
};
</script>

<style scoped></style>
