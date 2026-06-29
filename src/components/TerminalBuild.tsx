import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { AppConfig, BuildLog } from '../types';

interface TerminalBuildProps {
  config: AppConfig;
  logs: BuildLog[];
  onAddLog: (text: string, type: 'info' | 'success' | 'warning' | 'error' | 'command') => void;
  onClearLogs: () => void;
}

export const TerminalBuild: React.FC<TerminalBuildProps> = ({
  config,
  logs,
  onAddLog,
  onClearLogs
}) => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildSuccess, setBuildSuccess] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const runSimulatedBuild = async () => {
    if (isBuilding) return;
    
    setIsBuilding(true);
    setBuildSuccess(false);
    setBuildProgress(0);
    onClearLogs();

    const timestamp = () => new Date().toLocaleTimeString();

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const step = async (text: string, type: 'info' | 'success' | 'warning' | 'error' | 'command', delay: number) => {
      onAddLog(text, type);
      await sleep(delay);
    };

    try {
      // Step 1: Prep environment
      await step(`otabek@webtoapk:~$ npx capacitor init "${config.appName}" "${config.packageId}"`, 'command', 600);
      setBuildProgress(5);
      await step(`[Capacitor] WebToAPK muhiti tayyorlanmoqda...`, 'info', 800);
      await step(`[Capacitor] Ilova nomi: "${config.appName}"`, 'info', 300);
      await step(`[Capacitor] Paket ID: "${config.packageId}"`, 'info', 300);
      await step(`[Capacitor] Versiya: "${config.version}"`, 'info', 300);
      
      // Step 2: Build assets
      setBuildProgress(15);
      await step(`otabek@webtoapk:~$ npm run build`, 'command', 500);
      await step(`vite v6.2.3 compiling assets for production...`, 'info', 1000);
      await step(`✓ 48 files compiled to dist/ (2.4 MB)`, 'success', 800);
      await step(`dist/index.html - 1.2kB`, 'info', 200);
      await step(`dist/assets/index-D7b3a1.js - 340kB`, 'info', 200);
      await step(`dist/assets/index-Cd9f02.css - 42kB`, 'info', 200);

      // Step 3: Add platform
      setBuildProgress(30);
      await step(`otabek@webtoapk:~$ npx cap add android`, 'command', 600);
      await step(`[Android] Android Studio platformasining papkalari yaratilmoqda...`, 'info', 1200);
      await step(`[Android] /android papkasi muvaffaqiyatli yaratildi.`, 'success', 600);
      await step(`[Android] AndroidManifest.xml fayliga ruxsatlar o'rnatilmoqda (INTERNET, ACCESS_NETWORK_STATE)...`, 'info', 800);

      // Step 4: Sync assets
      setBuildProgress(45);
      await step(`otabek@webtoapk:~$ npx cap sync android`, 'command', 500);
      await step(`[Capacitor] Dist/ papkasidagi barcha veb-aktivlar /android/app/src/main/assets/public/ papkasiga o'tkazilmoqda...`, 'info', 1000);
      await step(`✓ Veb aktivlar muvaffaqiyatli sinxronizatsiya qilindi!`, 'success', 500);

      // Step 5: Gradle Compilation
      setBuildProgress(60);
      await step(`otabek@webtoapk:~$ cd android && ./gradlew assembleRelease`, 'command', 800);
      await step(`Starting Gradle Daemon (sub-process)...`, 'info', 1500);
      await step(`Gradle Build running for architecture: arm64-v8a, armeabi-v7a, x86_64`, 'info', 800);
      
      // Simulated gradle tasks
      await step(`> Task :app:preBuild`, 'info', 300);
      await step(`> Task :app:compileReleaseAidl`, 'info', 300);
      await step(`> Task :app:compileReleaseRenderscript`, 'info', 300);
      await step(`> Task :app:generateReleaseBuildConfig`, 'success', 400);
      await step(`> Task :app:javaPreCompileRelease`, 'info', 300);
      await step(`> Task :app:compileReleaseKotlin`, 'info', 1800);
      await step(`> Task :app:compileReleaseJavaWithJavac`, 'info', 1200);
      await step(`> Task :app:mergeReleaseAssets`, 'success', 600);
      await step(`> Task :app:compressReleaseAssets`, 'info', 500);
      await step(`> Task :app:packageRelease`, 'info', 1100);

      setBuildProgress(85);
      await step(`✓ Gradle kompilyatsiyasi muvaffaqiyatli yakunlandi!`, 'success', 600);
      await step(`Yaratilgan fayl: android/app/build/outputs/apk/release/app-release-unsigned.apk (4.1 MB)`, 'info', 400);

      // Step 6: Signing
      await step(`otabek@webtoapk:~$ apksigner sign --ks release.keystore --out app-release.apk app-release-unsigned.apk`, 'command', 600);
      await step(`release.keystore yuklanmoqda...`, 'info', 400);
      await step(`Dasturchi "${config.developerName}" nomli elektron sertifikat bilan imzolandi.`, 'success', 600);

      // Step 7: Zip align
      setBuildProgress(95);
      await step(`otabek@webtoapk:~$ zipalign -v 4 app-release.apk ${config.appName.toLowerCase().replace(/\s+/g, '_')}.apk`, 'command', 500);
      await step(`Optimallashtirish va xotira tekislash ishlari bajarilmoqda...`, 'info', 600);
      
      // Finish
      setBuildProgress(100);
      await step(`🎉 APK FILE MUVAFFARIYATLI YARATILDI!`, 'success', 400);
      await step(`Fayl nomi: ${config.appName.replace(/\s+/g, '_')}_v${config.version}.apk`, 'success', 300);
      await step(`Fayl hajmi: 3.8 MB`, 'info', 200);
      await step(`Ilovani yuklab olish tugmasi faollashtirildi. Play Marketga yuklashga mutlaqo tayyor!`, 'success', 300);

      setBuildSuccess(true);
    } catch (err) {
      onAddLog(`Xatolik: Kompilyatsiya to'xtatildi!`, 'error');
    } finally {
      setIsBuilding(false);
    }
  };

  // Helper to download instructions and config zip file
  const handleDownloadZip = () => {
    // We can trigger an instant client-side text file generation with full configurations!
    const configContent = `{
  "appId": "${config.packageId}",
  "appName": "${config.appName}",
  "webDir": "dist",
  "bundledWebRuntime": false
}`;

    const instructionsContent = `==================================================================
  WEBTOAPK STUDIO: ANDROID APK YARATISH KO'RSATMALARI (${config.appName.toUpperCase()})
==================================================================

Ilovangiz muvaffaqiyatli loyihalandi! Ushbu fayllardan foydalanib, 
istalgan kompyuterda MUTLAQO BEPUL tarzda real .APK faylini oling:

1-USUL: LOCAL KOMPYUTERDA ANDROID STUDIO ORQALI
--------------------------------------------------
1. Loyiha papkasini oching va Terminalda quyidagilarni yozing:
   $ npm install @capacitor/core @capacitor/android
   $ npx cap init "${config.appName}" "${config.packageId}" --web-dir=dist

2. Ilovani build qiling (dist papkasini yaratish):
   $ npm run build

3. Android platformasini qo'shing va sinxronlang:
   $ npx cap add android
   $ npx cap sync android

4. Android Studioda loyihani oching:
   $ npx cap open android
   
5. Android Studioda: Build > Build Bundle(s) / APK(s) > Build APK(s)
   tanlang. Tayyor!

2-USUL: GITHUB ACTIONS ORQALI CLOUD-DA BEPUL (Kompyuter kuchi kerak emas!)
--------------------------------------------------
Siz hech narsa o'rnatmasdan, GitHub platformasidan foydalanib
kodni serverda APK-ga aylantirishingiz mumkin. Bu 100% BEPUL!

Buning uchun bizning ilovadagi "Tekinga APK yaratish" bo'limiga kiring.
U yerda ko'rsatilgan GitHub Actions .yaml faylini loyihangizga qo'shing.

Konfiguratsiya fayli (capacitor.config.json):
--------------------------------------------------
${configContent}

Dasturchi: ${config.developerName}
Sana: ${new Date().toLocaleDateString()}
WebToAPK Platformasi tomonidan taqdim etildi.
`;

    // Create a Blob and download it
    const blob = new Blob([instructionsContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.appName.replace(/\s+/g, '_')}_APK_Kompilyatsiya_Qo_llanma.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onAddLog(`Tizim: "${config.appName}" uchun kompilyatsiya qo'llanmasi yuklab olindi!`, 'success');
  };

  return (
    <div className="bg-neutral-950 rounded-2xl border border-neutral-800 shadow-xl overflow-hidden flex flex-col h-[520px] ring-1 ring-white/5">
      
      {/* Terminal Header */}
      <div className="bg-neutral-900 px-4 py-3 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
          </div>
          <span className="text-xs text-neutral-400 font-mono ml-2 flex items-center gap-1.5">
            <Icons.Terminal className="w-3.5 h-3.5" />
            Loyiha Kompilyatori Terminali
          </span>
        </div>
        
        {/* Connection status light */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse block"></span>
          <span className="text-[10px] text-emerald-400 font-mono uppercase">tayyor</span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 text-neutral-300">
        
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 space-y-2 p-6">
            <Icons.Cpu className="w-10 h-10 text-neutral-700 animate-pulse" />
            <p className="font-sans text-xs">Terminal bo'sh. Kompilyatsiyani boshlash tugmasini bosing.</p>
            <p className="font-sans text-[10px] text-neutral-600 max-w-[280px]">
              Tugmani bosganingizda, tizim ushbu veb-ilovani to'liq Android Studio va Gradle tizimida APK-ga aylantirish zanjirini simulyatsiya qiladi.
            </p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-1.5 ${
                log.type === 'command' ? 'text-indigo-400 font-bold border-l-2 border-indigo-500 pl-2 mt-2' :
                log.type === 'success' ? 'text-emerald-400 font-medium' :
                log.type === 'warning' ? 'text-amber-400' :
                log.type === 'error' ? 'text-rose-500 font-bold animate-pulse' :
                'text-neutral-300'
              }`}
            >
              <span className="text-neutral-600 select-none text-[9px] mt-0.5 font-sans">[{log.time}]</span>
              <span className="whitespace-pre-wrap flex-1">{log.text}</span>
            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Compile Options Bottom Bar */}
      <div className="bg-neutral-900 px-4 py-4 border-t border-neutral-800 flex flex-col gap-3">
        
        {/* Progress Bar if active */}
        {isBuilding && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-neutral-400">
              <span className="flex items-center gap-1">
                <Icons.RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                Dastur yig'ilmoqda (Kompilyatsiya)
              </span>
              <span className="font-mono font-bold text-indigo-400">{buildProgress}%</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${buildProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            id="btn-start-terminal-build"
            onClick={runSimulatedBuild}
            disabled={isBuilding}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isBuilding
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99]'
            }`}
          >
            <Icons.Play className="w-4 h-4" />
            <span>{isBuilding ? 'Simulyatsiya Bajarilmoqda...' : 'APK-ni Kompilyatsiya qilish'}</span>
          </button>

          {buildSuccess && (
            <button
              id="btn-download-compiler-zip"
              onClick={handleDownloadZip}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all active:scale-[0.99]"
            >
              <Icons.Download className="w-4 h-4 animate-bounce" />
              <span>Dastur Fayllarini Yuklab olish</span>
            </button>
          )}
        </div>
        
      </div>

    </div>
  );
};
