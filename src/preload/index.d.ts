import { ElectronAPI } from '@electron-toolkit/preload'

// 타입을 별도로 정의하여 재사용성 향상
export interface CustomElectronAPI {
  openExternal: (url: string) => Promise<void>;
}

export interface API {
  // 향후 커스텀 API 메서드들
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: API;
    electronAPI: CustomElectronAPI;
  }
}
