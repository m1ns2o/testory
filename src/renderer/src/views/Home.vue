<template>
  <div>
    <Ubutton color="neutral" variant="outline" @click="logout">
      logout
    </Ubutton>
  </div>
</template>

<script setup lang="ts">
import supabase from "@renderer/utils/supabase";
import router from "@renderer/router";
const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("로그아웃 중 오류 발생:", error);
  } else {
    router.replace("/"); // 로그인 페이지로 리디렉션
    // 로그아웃 성공 후 리디렉션 또는 UI 업데이트
    console.log("성공적으로 로그아웃되었습니다.");
  }
};
</script>

<style scoped></style>
