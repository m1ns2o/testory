import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: "pkce",
    detectSessionInUrl: false, // 중요: 자동 감지 비활성화 (딥링크로 처리)
    autoRefreshToken: true,
    storage: window.localStorage,
  },
});




export default supabase;