<script setup lang="ts">
  const onClcik = async (): Promise<void> => {
    // console.log("Clcik");
    // alert("CLick");
    try {
      const result = await window.electronAPI.openExternal('https://www.github.com');
      console.log('External URL opened successfully:', result);
    } catch (error) {
      console.error('Failed to open external URL:', error);
    }
  }
</script>

<template>
  <UButton color="neutral" variant="outline" @click="onClcik">Button</UButton>
</template>

<style scoped>

</style>
