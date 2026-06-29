import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { AppPackage } from '../types';

interface AndroidSimulatorProps {
  appPackages: AppPackage[];
  onToggleHide: (id: string) => void;
  onToggleUsageTracking: (id: string) => void;
  onAddLog: (text: string, type: 'info' | 'success' | 'warning' | 'error' | 'command') => void;
  appName: string;
}

export const AndroidSimulator: React.FC<AndroidSimulatorProps> = ({
  appPackages,
  onToggleHide,
  onToggleUsageTracking,
  onAddLog,
  appName
}) => {
  const [currentTime, setCurrentTime] = useState<string>('12:00');
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [activeMode, setActiveMode] = useState<'launcher' | 'appShield'>('launcher');
  const [notification, setNotification] = useState<string | null>(null);
  const [activeShieldTab, setActiveShieldTab] = useState<'apps' | 'stats' | 'security'>('apps');
  const [appSearch, setAppSearch] = useState<string>('');

  // Clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAppLaunchAttempt = (app: AppPackage) => {
    if (app.isHidden && activeMode === 'launcher') {
      triggerNotification(`Xatolik: "${app.name}" ilovasi yashirilgan!`);
      onAddLog(`Simulyator: "${app.name}" ilovasini ishga tushirib bo'lmadi (chunki u yashirilgan).`, 'warning');
      return;
    }
    
    // Simulate launching app
    triggerNotification(`"${app.name}" ishga tushmoqda...`);
    onAddLog(`Simulyator: "${app.name}" ilovasi muvaffaqiyatli ochildi.`, 'info');
    
    if (app.isUsageTrackingDisabled) {
      onAddLog(`Screentime: "${app.name}" ishlatilmoqda, lekin foydalanish vaqti qayd etilmayapti (Muzlatilgan ❄️).`, 'success');
    } else {
      onAddLog(`Screentime: "${app.name}" ishlatilishi boshlandi va Screen Time ro'yxatida yozib borilmoqda.`, 'info');
    }
  };

  const filteredApps = appPackages.filter(app => 
    app.name.toLowerCase().includes(appSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Phone Case Frame */}
      <div className="relative w-[345px] h-[690px] bg-neutral-950 rounded-[54px] shadow-2xl border-4 border-neutral-800 overflow-hidden flex flex-col ring-1 ring-white/10">
        
        {/* Notch & Camera */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-neutral-900 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-neutral-800 rounded-full mb-1"></div>
          <div className="w-2.5 h-2.5 bg-neutral-850 rounded-full ml-3 mb-1 ring-1 ring-white/5"></div>
        </div>

        {/* Status Bar */}
        <div className="pt-7 px-6 pb-2 bg-neutral-900 text-white flex justify-between items-center text-[11px] font-medium select-none z-40">
          <span>{currentTime}</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[9px] bg-red-500 text-white font-bold px-1 rounded">REDMI</span>
            <Icons.Wifi className="w-3.5 h-3.5" />
            <Icons.Signal className="w-3.5 h-3.5" />
            <span className="flex items-center gap-0.5">
              {batteryLevel}%
              <Icons.Battery className="w-4 h-3.5" />
            </span>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="absolute top-16 left-4 right-4 z-50 bg-neutral-900/95 border border-white/10 text-white px-4 py-2.5 rounded-2xl text-[11px] text-center shadow-2xl backdrop-blur-md animate-bounce flex items-center justify-center gap-2">
            <Icons.ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">{notification}</span>
          </div>
        )}

        {/* Dynamic Screen Viewport */}
        <div className="flex-1 overflow-y-auto flex flex-col relative bg-neutral-950 text-neutral-100 font-sans">
          
          {activeMode === 'launcher' ? (
            /* ================= MIUI Launcher (Home Screen) ================= */
            <div className="flex-1 flex flex-col p-4 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
              
              {/* Launcher Clock Widget */}
              <div className="text-center py-6 space-y-1">
                <h1 className="text-4xl font-light tracking-wide">{currentTime}</h1>
                <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">Yakshanba, 28-Iyun</p>
                <div className="flex justify-center items-center gap-1 text-[10px] text-neutral-500">
                  <Icons.MapPin className="w-3 h-3" /> Toshkent shahar • 28°C
                </div>
              </div>

              {/* Launcher Search Bar */}
              <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 mb-6 flex items-center gap-2">
                <Icons.Search className="w-3.5 h-3.5 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Ilovalarni qidirish..." 
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-neutral-200"
                />
              </div>

              {/* Application Grid Desktop */}
              <div className="flex-1">
                <div className="grid grid-cols-4 gap-x-2 gap-y-5">
                  
                  {/* Real Launcher App Icons */}
                  {filteredApps.map((app) => {
                    if (app.isHidden) return null; // App is hidden from main menu!

                    return (
                      <button
                        key={app.id}
                        id={`launcher-app-${app.id}`}
                        onClick={() => handleAppLaunchAttempt(app)}
                        className="flex flex-col items-center text-center space-y-1 bg-transparent border-none outline-none cursor-pointer group active:scale-90 transition-transform"
                      >
                        <div className="w-11 h-11 rounded-2xl bg-neutral-800 border border-white/5 flex items-center justify-center text-xl shadow-lg relative group-hover:bg-neutral-700 transition-colors">
                          <span>{app.icon}</span>
                          {app.isUsageTrackingDisabled && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full flex items-center justify-center" title="Usage block active">
                              <Icons.Zap className="w-2 h-2 text-white" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-300 font-medium truncate w-full px-0.5">{app.name}</span>
                      </button>
                    );
                  })}

                  {/* REDMI APPSHIELD CONTROL APP (Always Visible) */}
                  <button
                    id="launcher-app-shield-control"
                    onClick={() => {
                      setActiveMode('appShield');
                      onAddLog(`Simulyator: "${appName}" nazorat tizimi ochildi.`, 'info');
                    }}
                    className="flex flex-col items-center text-center space-y-1 bg-transparent border-none outline-none cursor-pointer active:scale-90 transition-transform"
                  >
                    <div className="w-11 h-11 rounded-2xl overflow-hidden bg-neutral-800 border border-white/10 flex items-center justify-center shadow-lg relative active:scale-95 transition-all">
                      <img 
                        src="https://lh5.ggpht.com/XJIPVm71Icy7mlESQeMie6XY2PEG7p2YE3hERXBu2ZLI78cGjWSjsUp-q0aUiQ4QrUg=w300" 
                        alt={appName} 
                        className="w-full h-full object-cover rounded-2xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] text-neutral-300 font-medium truncate w-full px-0.5">{appName}</span>
                  </button>

                </div>

                {/* Simulated Hidden Swipe gesture hint */}
                <div className="mt-8 text-center p-3 rounded-xl border border-white/5 bg-white/5 text-[9px] text-neutral-400 leading-relaxed">
                  💡 <strong>Redmi maxfiy imo-ishorasi:</strong> Ekran bo'ylab barmoqlaringizni kengaytiring (pinch out) — yashirin ilovalar oynasi ochiladi!
                </div>
              </div>

            </div>
          ) : (
            /* ================= AppShield Control Interface ================= */
            <div className="flex-1 flex flex-col bg-neutral-900">
              
              {/* AppShield Custom Header */}
              <div className="bg-neutral-950 p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <Icons.ShieldAlert className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xs">{appName}</h2>
                    <p className="text-[8px] text-emerald-400 font-mono tracking-wider flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
                      MIUI SHIELD FAOL
                    </p>
                  </div>
                </div>

                {/* Back to Launcher button */}
                <button
                  id="btn-back-to-launcher"
                  onClick={() => setActiveMode('launcher')}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[10px] text-neutral-300 flex items-center gap-1"
                >
                  <Icons.Home className="w-3 h-3" />
                  Uyga qaytish
                </button>
              </div>

              {/* Internal Tabs navigation */}
              <div className="bg-neutral-950/80 px-2 py-1 border-b border-white/5 flex justify-around">
                <button
                  id="shield-tab-apps"
                  onClick={() => setActiveShieldTab('apps')}
                  className={`py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${activeShieldTab === 'apps' ? 'bg-indigo-600/20 text-indigo-400' : 'text-neutral-400 hover:text-neutral-300'}`}
                >
                  <Icons.AppWindow className="w-3 h-3" />
                  Yashirish & Bloklash
                </button>
                <button
                  id="shield-tab-stats"
                  onClick={() => setActiveShieldTab('stats')}
                  className={`py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${activeShieldTab === 'stats' ? 'bg-indigo-600/20 text-indigo-400' : 'text-neutral-400 hover:text-neutral-300'}`}
                >
                  <Icons.Clock className="w-3 h-3" />
                  Usage Time Muzlatish
                </button>
              </div>

              {/* Tab 1: Hide apps panel */}
              {activeShieldTab === 'apps' && (
                <div className="p-3 flex-1 flex flex-col space-y-3">
                  
                  {/* Status Banner */}
                  <div className="bg-indigo-950/30 border border-indigo-500/20 p-3 rounded-xl flex items-center gap-3">
                    <Icons.EyeOff className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-[10px] text-indigo-200">Menyudan mutlaqo g'oyib qilish</h4>
                      <p className="text-[8px] text-neutral-400">Yashirilgan ilovalar Redmi Launcher ishchi stolidan butunlay o'chiriladi.</p>
                    </div>
                  </div>

                  {/* App Packages list with toggles */}
                  <div className="space-y-2 flex-1">
                    <h5 className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">O'rnatilgan ilovalar ro'yxati ({appPackages.length} ta)</h5>
                    
                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                      {appPackages.map(app => (
                        <div 
                          key={app.id} 
                          className="bg-neutral-950/40 border border-white/5 rounded-xl p-2.5 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl shrink-0">{app.icon}</span>
                            <div className="min-w-0">
                              <h6 className="text-xs font-semibold truncate text-white">{app.name}</h6>
                              <p className="text-[8px] text-neutral-500 font-mono truncate">{app.packageName}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Hide Switch */}
                            <button
                              id={`toggle-hide-${app.id}`}
                              onClick={() => {
                                onToggleHide(app.id);
                                triggerNotification(app.isHidden ? `"${app.name}" menyuga qaytarildi` : `"${app.name}" menyudan yashirildi!`);
                              }}
                              className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all ${
                                app.isHidden 
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                              }`}
                            >
                              {app.isHidden ? '👁️ Yashirin' : '👁️‍🗨️ Yashirish'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              )}

              {/* Tab 2: Screen Time freezes and stats */}
              {activeShieldTab === 'stats' && (
                <div className="p-3 flex-1 flex flex-col space-y-3">
                  
                  {/* Intro Banner */}
                  <div className="bg-cyan-950/30 border border-cyan-500/20 p-3 rounded-xl flex items-center gap-3">
                    <Icons.ZapOff className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-[10px] text-cyan-200">Screen Time vaqtini cheklash</h4>
                      <p className="text-[8px] text-neutral-400">Tanlangan ilovalardan foydalanish vaqti Digital Wellbeing tizimida ko'rinmaydi.</p>
                    </div>
                  </div>

                  {/* App usage list with lock options */}
                  <div className="space-y-2 flex-1">
                    <h5 className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Muzlatish boshqaruvi</h5>

                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                      {appPackages.map(app => (
                        <div 
                          key={app.id} 
                          className="bg-neutral-950/40 border border-white/5 rounded-xl p-2.5 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl shrink-0">{app.icon}</span>
                            <div className="min-w-0">
                              <h6 className="text-xs font-semibold truncate text-white">{app.name}</h6>
                              <p className="text-[8px] text-neutral-400 font-mono">
                                Ishlatilgan: <span className={app.isUsageTrackingDisabled ? "text-cyan-400 font-bold line-through" : "text-neutral-300 font-bold"}>{app.usageTimeMinutes} daqiqa</span>
                              </p>
                            </div>
                          </div>

                          {/* Tracking Toggle Button */}
                          <button
                            id={`toggle-tracking-${app.id}`}
                            onClick={() => {
                              onToggleUsageTracking(app.id);
                              triggerNotification(app.isUsageTrackingDisabled ? `"${app.name}" vaqt yozish tiklandi` : `"${app.name}" vaqt yozish to'xtatildi!`);
                            }}
                            className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all ${
                              app.isUsageTrackingDisabled 
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse' 
                                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                            }`}
                          >
                            {app.isUsageTrackingDisabled ? '❄️ Muzlatilgan' : '⏳ Muzlatish'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* Bottom simulated device navigation softkeys */}
          <div className="sticky bottom-0 mt-auto z-40 bg-neutral-950/90 border-t border-white/5 px-6 py-2.5 flex justify-between items-center text-neutral-400">
            {/* Recent Apps softkey */}
            <button 
              id="device-softkey-recents"
              onClick={() => {
                triggerNotification("Redmi Multi-Tasking faollashtirildi");
                onAddLog(`Simulyator: Tizim softkey 'Recents' (Oxirgi ilovalar) bosildi.`, 'info');
              }}
              className="hover:text-white px-2 py-1 transition-colors"
            >
              <Icons.Menu className="w-4 h-4" />
            </button>
            {/* Home softkey */}
            <button 
              id="device-softkey-home"
              onClick={() => {
                setActiveMode('launcher');
                onAddLog(`Simulyator: Bosh ekranga qaytildi.`, 'info');
              }}
              className="hover:text-indigo-400 px-4 py-1 transition-colors bg-white/5 rounded-full"
            >
              <Icons.Circle className="w-3.5 h-3.5" />
            </button>
            {/* Back softkey */}
            <button 
              id="device-softkey-back"
              onClick={() => {
                if (activeMode === 'appShield') {
                  setActiveMode('launcher');
                } else {
                  triggerNotification("Tizim orqaga qaytish");
                }
                onAddLog(`Simulyator: Orqaga qaytish softkey 'Back' bosildi.`, 'info');
              }}
              className="hover:text-white px-2 py-1 transition-colors"
            >
              <Icons.ChevronLeft className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom Speaker grill / lightning jack look */}
        <div className="h-4 bg-neutral-900 flex justify-center items-center pb-1 select-none">
          <div className="w-24 h-1 bg-neutral-800 rounded-full"></div>
        </div>

      </div>
    </div>
  );
};
