import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fountainpdl.bibleapp',
  appName: 'bible-app',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    buildOptions: {
      javaVersion: '17'
    }
  }
};

export default config;
