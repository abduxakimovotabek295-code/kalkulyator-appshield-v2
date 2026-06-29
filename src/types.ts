export interface AppPackage {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  usageTimeMinutes: number;
  isHidden: boolean;
  isUsageTrackingDisabled: boolean;
  category: string;
  sizeMb: number;
}

export interface AppConfig {
  appName: string;
  packageId: string;
  version: string;
  developerName: string;
  theme: 'slate' | 'emerald' | 'indigo' | 'rose' | 'violet' | 'amber' | 'cyan' | 'fuchsia';
  iconEmoji: string;
  customPrompt: string;
}

export interface BuildLog {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
  time: string;
}

