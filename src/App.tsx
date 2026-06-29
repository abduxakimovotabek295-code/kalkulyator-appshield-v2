import { useState } from 'react';
import * as Icons from 'lucide-react';
import { AppConfig, AppPackage, BuildLog } from './types';
import { AndroidSimulator } from './components/AndroidSimulator';
import { ConfigPanel } from './components/ConfigPanel';
import { TerminalBuild } from './components/TerminalBuild';
import { GuideSection } from './components/GuideSection';

// Custom preset lists of packages for immediate use
const PRESETS: Record<string, AppPackage[]> = {
  social: [
    { id: 'app_tg', name: 'Telegram', packageName: 'org.telegram.messenger', icon: '💬', usageTimeMinutes: 145, isHidden: false, isUsageTrackingDisabled: false, category: 'Ijtimoiy', sizeMb: 68 },
    { id: 'app_ig', name: 'Instagram', packageName: 'com.instagram.android', icon: '📸', usageTimeMinutes: 190, isHidden: false, isUsageTrackingDisabled: false, category: 'Ijtimoiy', sizeMb: 72 },
    { id: 'app_tt', name: 'TikTok', packageName: 'com.zhiliaoapp.musically', icon: '🎵', usageTimeMinutes: 240, isHidden: false, isUsageTrackingDisabled: false, category: 'Ijtimoiy', sizeMb: 85 },
    { id: 'app_yt', name: 'YouTube', packageName: 'com.google.android.youtube', icon: '📺', usageTimeMinutes: 110, isHidden: false, isUsageTrackingDisabled: false, category: 'Ijtimoiy', sizeMb: 45 }
  ],
  games: [
    { id: 'app_pubg', name: 'PUBG Mobile', packageName: 'com.tencent.ig', icon: '🎮', usageTimeMinutes: 180, isHidden: false, isUsageTrackingDisabled: false, category: 'O\'yinlar', sizeMb: 1240 },
    { id: 'app_subway', name: 'Subway Surfers', packageName: 'com.kiloo.subwaysurf', icon: '🏃', usageTimeMinutes: 45, isHidden: false, isUsageTrackingDisabled: false, category: 'O\'yinlar', sizeMb: 140 },
    { id: 'app_clash', name: 'Clash of Clans', packageName: 'com.supercell.clashofclans', icon: '🏰', usageTimeMinutes: 75, isHidden: false, isUsageTrackingDisabled: false, category: 'O\'yinlar', sizeMb: 280 }
  ],
  finance: [
    { id: 'app_click', name: 'Click Up', packageName: 'uz.click.clickup', icon: '💳', usageTimeMinutes: 15, isHidden: false, isUsageTrackingDisabled: false, category: 'Moliya', sizeMb: 35 },
    { id: 'app_payme', name: 'Payme', packageName: 'uz.sarbon.payme', icon: '💸', usageTimeMinutes: 20, isHidden: false, isUsageTrackingDisabled: false, category: 'Moliya', sizeMb: 32 },
    { id: 'app_binance', name: 'Binance', packageName: 'com.binance.dev', icon: '🪙', usageTimeMinutes: 60, isHidden: false, isUsageTrackingDisabled: false, category: 'Moliya', sizeMb: 95 }
  ],
  system: [
    { id: 'app_browser', name: 'Mi Browser', packageName: 'com.mi.globalbrowser', icon: '🌐', usageTimeMinutes: 50, isHidden: false, isUsageTrackingDisabled: false, category: 'Tizim', sizeMb: 40 },
    { id: 'app_gallery', name: 'Galereya', packageName: 'com.miui.gallery', icon: '🖼️', usageTimeMinutes: 30, isHidden: false, isUsageTrackingDisabled: false, category: 'Tizim', sizeMb: 22 },
    { id: 'app_settings', name: 'Sozlamalar', packageName: 'com.android.settings', icon: '⚙️', usageTimeMinutes: 12, isHidden: false, isUsageTrackingDisabled: false, category: 'Tizim', sizeMb: 15 }
  ]
};

export default function App() {
  const [config, setConfig] = useState<AppConfig>({
    appName: "Kalkulyator",
    packageId: "com.redmi.appshield",
    version: "1.0.0",
    developerName: "Otabek",
    theme: "indigo",
    iconEmoji: "🧮",
    customPrompt: "Faqat maktab o'quvchilari yashiradigan PUBG Mobile, Telegram va TikTok ilovasi o'rnatilgan bo'lsin."
  });

  const [appPackages, setAppPackages] = useState<AppPackage[]>([
    ...PRESETS.social,
    ...PRESETS.games
  ]);

  const [logs, setLogs] = useState<BuildLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'workspace' | 'guide'>('workspace');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddLog = (text: string, type: 'info' | 'success' | 'warning' | 'error' | 'command') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { text, type, time }]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleToggleHide = (id: string) => {
    setAppPackages(prev => 
      prev.map(app => {
        if (app.id === id) {
          const nextHidden = !app.isHidden;
          handleAddLog(
            `Kengaytirish: "${app.name}" (${app.packageName}) ilovasi menyudan ${nextHidden ? "G'OYIB QILINDI 👁️‍🗨️" : "TIKLINDI 👁️"}`, 
            nextHidden ? 'warning' : 'success'
          );
          return { ...app, isHidden: nextHidden };
        }
        return app;
      })
    );
  };

  const handleToggleUsageTracking = (id: string) => {
    setAppPackages(prev => 
      prev.map(app => {
        if (app.id === id) {
          const nextDisabled = !app.isUsageTrackingDisabled;
          handleAddLog(
            `Screentime: "${app.name}" (${app.packageName}) Screen Time kuzatuvi ${nextDisabled ? "MUZLATILDI ❄️ (Ko'rinmas)" : "TIKLANDI ⏳"}`, 
            nextDisabled ? 'success' : 'info'
          );
          return { ...app, isUsageTrackingDisabled: nextDisabled };
        }
        return app;
      })
    );
  };

  const handleSelectPreset = (presetType: string) => {
    const preset = PRESETS[presetType];
    if (preset) {
      setAppPackages(preset);
      handleAddLog(`Tizim: "${presetType.toUpperCase()}" andozasidagi ilovalar simulyatorda tiklandi.`, 'success');
    }
  };

  const handleGenerateAppWithAI = async () => {
    if (!config.customPrompt.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    handleAddLog(`AI: "${config.customPrompt}" asosida telefondagi yangi ilovalar ro'yxatini tuzish boshlandi...`, 'info');

    try {
      const response = await fetch('/api/generate-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: config.customPrompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || "AI xatoligi");
      }

      const generatedList: AppPackage[] = await response.json();
      if (Array.isArray(generatedList) && generatedList.length > 0) {
        setAppPackages(generatedList);
        handleAddLog(`AI: Muvaffaqiyatli loyihalandi! Telefon ichidagi barcha ilovalar paketi yangilandi.`, 'success');
      } else {
        throw new Error("AI noto'g'ri JSON format qaytardi.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Tizimda xatolik yuz berdi.");
      handleAddLog(`AI Xatoligi: AI orqali paketlarni yangilab bo'lmadi. Fallback (andozalar) yordamida ishlashingiz mumkin.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Alert bar */}
      {errorMsg && (
        <div className="bg-rose-500 text-white text-xs px-6 py-3.5 flex items-center justify-between gap-4 font-medium animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Icons.AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg} (Secrets bo'limida <strong>GEMINI_API_KEY</strong> mavjudligini tekshiring. Ammo andozalar orqali barchasini bepul ishlatishingiz mumkin!)</span>
          </div>
          <button 
            id="btn-close-error"
            onClick={() => setErrorMsg(null)} 
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg cursor-pointer"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header / Navigation */}
      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-850 px-6 py-4 sticky top-0 z-40 shadow-sm shadow-black/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/10">
              <Icons.ShieldAlert className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5">
                Redmi AppShield Studio
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  HyperOS
                </span>
              </h1>
              <p className="text-xs text-neutral-400">Redmi ilovalarini yashirish va foydalanish vaqtini muzlatish simulyatori</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-xl self-start sm:self-auto">
            <button
              id="tab-workspace"
              onClick={() => setActiveTab('workspace')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'workspace'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
              }`}
            >
              <Icons.Cpu className="w-4 h-4" />
              Ishchi Oyna (Simulyator)
            </button>
            <button
              id="tab-guide"
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
              }`}
            >
              <Icons.BookOpen className="w-4 h-4" />
              Android Kotlin Dasturlash Qo'llanmasi
            </button>
          </div>

        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        
        {activeTab === 'workspace' ? (
          
          /* Bento Grid Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left side: Config & Terminal */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Info alert bubble */}
              <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/60 dark:border-indigo-950/40 p-4 rounded-2xl flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Icons.HelpCircle className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-indigo-900 dark:text-indigo-300">Yashirilgan ilovadan foydalanish vaqti qanday ko'rinmaydi?</h4>
                  <p className="text-xs text-indigo-900/70 dark:text-indigo-300/60 leading-relaxed">
                    Ushbu simulyatorda biron-bir ilovaning <strong>"Muzlatish" (Freeze)</strong> tugmasini bossangiz, u ilovadan foydalanilgan vaqt (screentime) butunlay o'chiriladi va Digital Wellbeing kabi dasturlarda ilova ishlatilgani qayd etilmaydi!
                  </p>
                </div>
              </div>

              {/* Configurations Form */}
              <ConfigPanel
                config={config}
                onChange={(updates) => setConfig(prev => ({ ...prev, ...updates }))}
                onGenerate={handleGenerateAppWithAI}
                isLoading={isLoading}
                onSelectPreset={handleSelectPreset}
              />

              {/* Simulated Terminal Compiler */}
              <TerminalBuild
                config={config}
                logs={logs}
                onAddLog={handleAddLog}
                onClearLogs={handleClearLogs}
              />

            </div>

            {/* Right side: Real-time Android phone simulator */}
            <div className="lg:col-span-5 sticky top-24 flex flex-col items-center">
              
              {/* Android Simulator Shell */}
              <div className="w-full flex flex-col items-center">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center justify-center gap-1.5">
                    <Icons.Smartphone className="w-4 h-4 text-emerald-500 animate-pulse" />
                    Xiaomi HyperOS / MIUI Simulator
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">Siz yaratgan yordamchi ilovani oching va amallarni bajaring</p>
                </div>

                <AndroidSimulator 
                  appPackages={appPackages}
                  onToggleHide={handleToggleHide}
                  onToggleUsageTracking={handleToggleUsageTracking}
                  onAddLog={handleAddLog}
                  appName={config.appName}
                />
              </div>

            </div>

          </div>

        ) : (
          
          /* Detailed Guides and FAQ Tab */
          <div className="max-w-4xl mx-auto">
            <GuideSection />
          </div>

        )}

      </main>

      {/* Footer copyright */}
      <footer className="bg-white dark:bg-neutral-900/60 border-t border-neutral-200 dark:border-neutral-850 px-6 py-6 mt-12 text-center text-xs text-neutral-400">
        <p>© {new Date().getFullYear()} Redmi AppShield Studio. Maxfiylik va xavfsizlik simulyatsiyalari uchun maxsus.</p>
        <p className="mt-1 text-[10px] text-neutral-500 font-mono">Barcha huquqlar himoyalangan. HyperOS Utility.</p>
      </footer>

    </div>
  );
}
