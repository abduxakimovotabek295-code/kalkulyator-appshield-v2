import React from 'react';
import { AppConfig } from '../types';
import * as Icons from 'lucide-react';

interface ConfigPanelProps {
  config: AppConfig;
  onChange: (updates: Partial<AppConfig>) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onSelectPreset: (presetType: string) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onChange,
  onGenerate,
  isLoading,
  onSelectPreset
}) => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6 shadow-sm shadow-black/5">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Icons.Sliders className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-100">Redmi AppShield Sozlamalari</h3>
          <p className="text-xs text-neutral-400">Paket parametrlari va APK konfiguratsiyasi</p>
        </div>
      </div>

      {/* Main Configurations */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* App Name */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Ilova Nomi (App Name)</label>
          <div className="relative">
            <Icons.AppWindow className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="input-app-name"
              type="text"
              value={config.appName}
              onChange={(e) => onChange({ appName: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-500 transition-colors"
              placeholder="Masalan: Redmi AppShield"
            />
          </div>
        </div>

        {/* Emoji Icon */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Logotip / Emoji (App Icon)</label>
          <div className="relative">
            <Icons.Smile className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="input-app-icon-emoji"
              type="text"
              value={config.iconEmoji}
              onChange={(e) => onChange({ iconEmoji: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-500 transition-colors"
              placeholder="Masalan: 🛡️"
            />
          </div>
        </div>

        {/* Package ID */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Paket Identifikatori (Package ID)</label>
          <div className="relative">
            <Icons.Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="input-app-package"
              type="text"
              value={config.packageId}
              onChange={(e) => onChange({ packageId: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-500 transition-colors"
              placeholder="com.redmi.appshield"
            />
          </div>
        </div>

        {/* Version */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Versiyasi (Version)</label>
          <div className="relative">
            <Icons.Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="input-app-version"
              type="text"
              value={config.version}
              onChange={(e) => onChange({ version: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-500 transition-colors"
              placeholder="1.0.0"
            />
          </div>
        </div>

        {/* App Theme Color Accent */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Ranglar Palitrasi (Theme Palette)</label>
          <div className="relative">
            <Icons.Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <select
              id="select-app-theme"
              value={config.theme}
              onChange={(e) => onChange({ theme: e.target.value as any })}
              className="w-full pl-9 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-500 transition-colors appearance-none"
            >
              <option value="indigo">Indigo (Siyohrang)</option>
              <option value="emerald">Emerald (Yashil)</option>
              <option value="rose">Rose (Pushti)</option>
              <option value="slate">Slate (Kulrang)</option>
              <option value="violet">Violet (Binafsha)</option>
              <option value="amber">Amber (Tillarang)</option>
              <option value="cyan">Cyan (Havorang)</option>
              <option value="fuchsia">Fuchsia (Yorqin pushti)</option>
            </select>
          </div>
        </div>

        {/* Developer Name */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Dasturchi (Developer)</label>
          <div className="relative">
            <Icons.User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="input-app-developer"
              type="text"
              value={config.developerName}
              onChange={(e) => onChange({ developerName: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-500 transition-colors"
              placeholder="Otabek"
            />
          </div>
        </div>

      </div>

      {/* Preset templates */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
          <Icons.Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Tezkor ilovalar paketini yuklash (Presets)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            id="preset-social"
            onClick={() => onSelectPreset('social')}
            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 dark:hover:border-indigo-400 bg-neutral-50/50 dark:bg-neutral-800/40 text-left transition-all hover:translate-y-[-1px] cursor-pointer"
          >
            <span className="text-base block mb-0.5">💬</span>
            <span className="font-bold text-[10px] text-neutral-700 dark:text-neutral-200 block">Ijtimoiy Tarmoqlar</span>
            <span className="text-[9px] text-neutral-400">Telegram, Instagram, TikTok</span>
          </button>
          
          <button
            id="preset-games"
            onClick={() => onSelectPreset('games')}
            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 dark:hover:border-indigo-400 bg-neutral-50/50 dark:bg-neutral-800/40 text-left transition-all hover:translate-y-[-1px] cursor-pointer"
          >
            <span className="text-base block mb-0.5">🎮</span>
            <span className="font-bold text-[10px] text-neutral-700 dark:text-neutral-200 block">Mashhur O'yinlar</span>
            <span className="text-[9px] text-neutral-400">PUBG Mobile, Subway, Clash</span>
          </button>

          <button
            id="preset-finance"
            onClick={() => onSelectPreset('finance')}
            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 dark:hover:border-indigo-400 bg-neutral-50/50 dark:bg-neutral-800/40 text-left transition-all hover:translate-y-[-1px] cursor-pointer"
          >
            <span className="text-base block mb-0.5">💳</span>
            <span className="font-bold text-[10px] text-neutral-700 dark:text-neutral-200 block">Hamyon & Banklar</span>
            <span className="text-[9px] text-neutral-400">Click, Payme, Binance</span>
          </button>

          <button
            id="preset-system"
            onClick={() => onSelectPreset('system')}
            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 dark:hover:border-indigo-400 bg-neutral-50/50 dark:bg-neutral-800/40 text-left transition-all hover:translate-y-[-1px] cursor-pointer"
          >
            <span className="text-base block mb-0.5">⚙️</span>
            <span className="font-bold text-[10px] text-neutral-700 dark:text-neutral-200 block">Standart Tizim</span>
            <span className="text-[9px] text-neutral-400">Brauzer, Galereya, Sozlamalar</span>
          </button>
        </div>
      </div>

      {/* AI App Design Area */}
      <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-4">
        <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
          <Icons.BrainCircuit className="w-4 h-4 text-indigo-500" />
          AI orqali ilovalarni to'g'irlash (Gemini 3.5 Flash)
        </label>
        <p className="text-[10px] text-neutral-400">
          Ushbu Redmi telefonida qanday maxsus ilovalar o'rnatilgan bo'lishini xohlaysiz? Yozib qoldiring (masalan: "faqat maktab o'quvchilari o'yinlari").
        </p>
        <textarea
          id="textarea-custom-prompt"
          rows={3}
          value={config.customPrompt}
          onChange={(e) => onChange({ customPrompt: e.target.value })}
          placeholder="Masalan: Faqat bolalar yashiradigan PUBG Mobile, Brawl Stars o'yinlari va TikTok ilovasi o'rnatilgan bo'lsin."
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs bg-transparent text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-500 transition-all font-sans leading-relaxed"
        />

        <button
          id="btn-generate-ai-app"
          onClick={onGenerate}
          disabled={isLoading || !config.customPrompt.trim()}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
            isLoading || !config.customPrompt.trim()
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <Icons.Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>AI telefondagi paketlarni o'zgartirmoqda...</span>
            </>
          ) : (
            <>
              <Icons.Wand2 className="w-4 h-4" />
              <span>Ilovalarni Simulyatorga yuklash</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
