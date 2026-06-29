import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kalkulyator.app',
  appName: 'Kalkulyator',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
