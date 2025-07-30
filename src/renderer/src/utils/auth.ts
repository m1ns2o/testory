import {supabase} from "@renderer/utils/supabase";

export const googleLogin = async (): Promise<{
  url?: string;
  error?: string;
}> => {
  try {
    const { data} = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        skipBrowserRedirect: true,
        // redirectTo: "https://comfy-travesseiro-bd4dde.netlify.app", // Netlify 리다이렉션 페이지
        redirectTo: "http://localhost:8080", // 로컬 개발용 리다이렉션 페이지
      },
    });


    if (data.url) {
      // 브라우저에서 OAuth 플로우 시작
      // window.open(data.url, '_blank')
      // await shell.openExternal(data.url);
      await window.electronAPI.openExternal(data.url);
      return { url: data.url };
    }

    return { error: "OAuth URL을 받지 못했습니다." };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
};
