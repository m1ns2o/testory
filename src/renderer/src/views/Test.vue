<script setup lang="ts">
  import {googleLogin} from "@renderer/utils/auth";
  const onClcik = async (): Promise<void> => {
    // console.log("Clcik");
    // alert("CLick");
    // try {
    //   const result = await window.electronAPI.openExternal('https://www.github.com');
    //   console.log('External URL opened successfully:', result);
    // } catch (error) {
    //   console.error('Failed to open external URL:', error);
    // }
    googleLogin()
  }
</script>

<template>
  <UButton color="neutral" variant="outline" @click="onClcik">Login</UButton>
</template>

<style scoped>

</style>
