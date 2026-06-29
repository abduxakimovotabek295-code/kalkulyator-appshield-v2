import React, { useState } from 'react';
import * as Icons from 'lucide-react';

export const GuideSection: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const hidingAppsKotlin = `// Kotlin: Ilova belgisini (Icon) asosiy menyudan (Launcher) yashirish kodi
import android.content.ComponentName
import android.content.Context
import android.content.pm.PackageManager

fun hideAppIcon(context: Context, packageName: String, mainActivityName: String) {
    val pm = context.packageManager
    val componentName = ComponentName(packageName, "$packageName.$mainActivityName")
    
    // Ilovaning Launcher drayverini nofaol (Disabled) qilish orqali uni menyudan butunlay g'oyib qilish
    pm.setComponentEnabledSetting(
        componentName,
        PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
        PackageManager.DONT_KILL_APP
    )
}

fun showAppIcon(context: Context, packageName: String, mainActivityName: String) {
    val pm = context.packageManager
    val componentName = ComponentName(packageName, "$packageName.$mainActivityName")
    
    // Ilova drayverini yana qayta faollashtirish va ekranda ko'rsatish
    pm.setComponentEnabledSetting(
        componentName,
        PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
        PackageManager.DONT_KILL_APP
    )
}`;

  const usageStatsBlockKotlin = `// Kotlin: Digital Wellbeing (Screentime) vaqtini soxtalashtirish yoki o'chirish
// Android-da "PACKAGE_USAGE_STATS" tizimli ruxsatnomasi orqali ilovalardan foydalanish vaqti o'lchanadi.
// Ilova buni soxtalashtirishi yoki o'z vaqtini o'lchashni cheklashi uchun quyidagi tizim usulidan foydalaniladi:

import android.app.AppOpsManager
import android.content.Context
import android.os.Process

fun isUsageStatsPermissionGranted(context: Context): Boolean {
    val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
    val mode = appOps.checkOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        Process.myUid(),
        context.packageName
    )
    return mode == AppOpsManager.MODE_ALLOWED
}

// Android tizimi ilovaning darchasini va faolligini kuzatishini to'xtatish uchun 
// Background Service (Orqa fondagi xizmat) orqali Accessibility yoki 
// Overlay (Ekran ustidan oyna chiqarish) yordamida vaqt hisoblagichni chalg'itish mumkin.
`;

  const playMarketGuideText = `==================================================================
  REDMI TELEFONLARIDAGI MAXFIY IMKONIYAT (NATIVE WAY)
==================================================================
Redmi (Xiaomi) telefonlarida buni ilovasiz, tizimning o'zida qilish mumkin:
1. "Sozlamalar" (Settings) -> "Xavfsizlik" (Security) ilovasiga kiring.
2. Pastga tushib "Yashirin ilovalar" (Hidden Apps) bo'limini toping.
3. Kerakli ilovalarni yoqing. Ular menyudan g'oyib bo'ladi!
4. Ularni ochish uchun ekranda barmoqlarni ikki tomonga kengaytiring (pinch out).

==================================================================
  KOTLIN-DA ANDROID APK DASTURLASH YO'RIQNOMASI
==================================================================
Siz o'z ilovangizni yaratganingizda:
1. Manifest fayliga (AndroidManifest.xml) quyidagi ruxsatlarni qo'shing:
   <uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" tools:ignore="ProtectedPermissions" />
   <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
   
2. Ilovalar ro'yxatini olish uchun PackageManager-dan foydalaning:
   val installedApps = packageManager.getInstalledPackages(PackageManager.GET_ACTIVITIES)

3. Tanlangan ilova ochilganda fonda boshqa ko'rinmas faollik (Invisible Activity)
   yoki fon xizmatini yurgizib, Digital Wellbeing tizimiga noto'g'ri vaqt yuboring.
`;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-8 shadow-sm shadow-black/5">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Icons.Cpu className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-100">Redmi AppShield Tizimi va Yo'riqnomalar</h3>
          <p className="text-xs text-neutral-400">Android SDK va Xiaomi tizimlarida ilovalarni yashirish texnologiyasi</p>
        </div>
      </div>

      {/* FAQs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: How App Hiding works technically */}
        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/20 border border-neutral-100 dark:border-neutral-800/60 space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Icons.EyeOff className="w-4.5 h-4.5" />
            <h4 className="font-bold text-xs">Texnik tomondan ilovani menyudan yashirish qanday ishlaydi?</h4>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Android tizimida har bir ilovaning asosiy ishga tushiruvchi darchasi (Launcher Activity) bo'ladi. Agar siz uni <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-indigo-500 font-mono text-[10px]">PackageManager</code> orqali nofaol qilib qo'ysangiz, Android Launcher uni o'rnatilmagan deb hisoblaydi va telefondagi barcha menyulardan o'chirib tashlaydi. Ammo ilova telefonda saqlanib qolaveradi va uning fon ishlari to'xtamaydi.
          </p>
        </div>

        {/* Card 2: How Screen Time is blocked */}
        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/20 border border-neutral-100 dark:border-neutral-800/60 space-y-2">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <Icons.ZapOff className="w-4.5 h-4.5" />
            <h4 className="font-bold text-xs">Ilova ishlatilgan vaqtini (Screen Time) qanday yashirish mumkin?</h4>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Android-da Digital Wellbeing ilovalari vaqtni <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-indigo-500 font-mono text-[10px]">UsageStatsManager</code> orqali hisoblaydi. Agar siz ilovangiz fonida vaqt kuzatuvchilariga ruxsat bermaydigan maxsus xizmatlarni (Accessibility yoki Tizim oynalari ustidan chizish ruxsatnomasi - Overlay Overlay) yoqsangiz, telefon ilova faolligini to'g'ri taniy olmaydi va vaqt hisobini muzlatib qo'yadi.
          </p>
        </div>

      </div>

      {/* Kotlin Section 1 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icons.Code2 className="w-4.5 h-4.5 text-indigo-500" />
          <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-100">1-Qadam: Ilova belgisini (Icon) yashirish (Kotlin kodi)</h4>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Haqiqiy Android APK ilova yozayotganingizda, menyudan g'oyib qilish va qayta ko'rsatish uchun quyidagi Kotlin funksiyalaridan foydalanishingiz mumkin:
        </p>

        <div className="relative rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono leading-relaxed">
          <div className="bg-neutral-100 dark:bg-neutral-850 px-4 py-2 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
            <span>HiderController.kt</span>
            <button
              id="btn-copy-hider-kotlin"
              onClick={() => handleCopy(hidingAppsKotlin, 1)}
              className="hover:text-indigo-500 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copiedIndex === 1 ? <Icons.Check className="w-3.5 h-3.5 text-emerald-500" /> : <Icons.Copy className="w-3.5 h-3.5" />}
              {copiedIndex === 1 ? "Nusxalandi!" : "Nusxa olish"}
            </button>
          </div>
          <pre className="p-4 bg-neutral-950 text-neutral-300 overflow-x-auto max-h-56">
            {hidingAppsKotlin}
          </pre>
        </div>
      </div>

      {/* Kotlin Section 2 */}
      <div className="space-y-3 border-t border-neutral-100 dark:border-neutral-800 pt-6">
        <div className="flex items-center gap-2">
          <Icons.Activity className="w-4.5 h-4.5 text-cyan-500" />
          <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-100">2-Qadam: Digital Wellbeing kuzatuvini chalg'itish (Kotlin kodi)</h4>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Screentime ma'lumotlariga kirish ruxsatnomasi mavjudligini tekshirish va kuzatuv tizimini chalg'itish bo'yicha kod andozasi:
        </p>

        <div className="relative rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono leading-relaxed">
          <div className="bg-neutral-100 dark:bg-neutral-850 px-4 py-2 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
            <span>UsageBlocker.kt</span>
            <button
              id="btn-copy-usage-kotlin"
              onClick={() => handleCopy(usageStatsBlockKotlin, 2)}
              className="hover:text-indigo-500 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copiedIndex === 2 ? <Icons.Check className="w-3.5 h-3.5 text-emerald-500" /> : <Icons.Copy className="w-3.5 h-3.5" />}
              {copiedIndex === 2 ? "Nusxalandi!" : "Nusxa olish"}
            </button>
          </div>
          <pre className="p-4 bg-neutral-950 text-neutral-300 overflow-x-auto max-h-56">
            {usageStatsBlockKotlin}
          </pre>
        </div>
      </div>

      {/* APK Compilation and Disguise Guide */}
      <div className="space-y-4 border-t border-neutral-100 dark:border-neutral-800 pt-6">
        <div className="flex items-center gap-2">
          <Icons.SmartphoneCharging className="w-4.5 h-4.5 text-emerald-500" />
          <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-100">3-Qadam: Android Studio-da "Kalkulyator" Niqobi ostida APK yaratish</h4>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Siz kompyuteringizga yuklab olgan Android Studio yordamida ilovani haqiqiy telefonga APK qilib chiqarish va uning nomini hamda rasmini (Kalkulyator) o'rnatish uchun quyidagi amallarni bajaring:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/20 border border-neutral-100 dark:border-neutral-800/50 rounded-xl space-y-1.5">
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full uppercase">1. Nomi</span>
            <h5 className="font-bold text-xs text-neutral-800 dark:text-neutral-100">Ilova nomini "Kalkulyator" qilish</h5>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Android loyihangizda <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-indigo-500 font-mono">android/app/src/main/res/values/strings.xml</code> faylini oching va <code className="text-emerald-500 font-mono">"app_name"</code> qiymatini <code className="text-indigo-500 font-mono">"Kalkulyator"</code> deb o'zgartiring:
              <br />
              <code className="block bg-neutral-950 p-1.5 rounded mt-1.5 text-neutral-400 text-[10px] overflow-x-auto">
                &lt;string name="app_name"&gt;Kalkulyator&lt;/string&gt;
              </code>
            </p>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/20 border border-neutral-100 dark:border-neutral-800/50 rounded-xl space-y-1.5">
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase">2. Logotip</span>
            <h5 className="font-bold text-xs text-neutral-800 dark:text-neutral-100">Kalkulyator Rasmini qo'shish</h5>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Android Studio-da <code className="text-indigo-500">app</code> papkasini o'ng bosing -&gt; <code className="text-indigo-500">New</code> -&gt; <code className="text-indigo-500">Image Asset</code>. 
              Siz bergan rasm havolasidagi rasmni yuklab olib, loyihadagi asosiy <strong className="text-neutral-700 dark:text-neutral-300">Launcher Icon (ic_launcher)</strong> sifatida belgilang. Tizim avtomatik barcha o'lchamdagi belgilarni yaratib beradi!
            </p>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/20 border border-neutral-100 dark:border-neutral-800/50 rounded-xl space-y-1.5">
            <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase">3. Kompilyatsiya</span>
            <h5 className="font-bold text-xs text-neutral-800 dark:text-neutral-100">APK faylini yig'ish (Build)</h5>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Loyiha tayyor bo'lgach, Android Studio yuqori menyusidan:
              <br />
              <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>-ni tanlang. 
              <br />
              Birozdan so'ng ekranning o'ng pastki burchagida <span className="text-emerald-500 font-bold">"locate"</span> tugmasi chiqadi, uni bossangiz tayyor <code className="text-indigo-500">app-debug.apk</code> fayli ochiladi. Uni telefonga o'tkazib o'rnating!
            </p>
          </div>
        </div>
      </div>

      {/* Guide Download Tip */}
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-3">
        <Icons.BookOpenCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-xs text-indigo-900 dark:text-indigo-300">To'liq Yo'riqnomani fayl shaklida yuklab oling</h5>
          <p className="text-xs text-indigo-900/70 dark:text-indigo-300/60 leading-relaxed">
            Ishchi Muhit (Workspace) bo'limida "APK-ni Kompilyatsiya qilish" tugmasini bosing. Kompilyatsiya muvaffaqiyatli simulyatsiya qilingandan so'ng, ushbu Kotlin kodlari, Manifest sozlamalari va Redmi bo'yicha batafsil darslikni o'z ichiga olgan mukammal matnli qo'llanmani <strong className="font-semibold text-indigo-900 dark:text-indigo-200">Dastur Fayllarini Yuklab olish</strong> tugmasi orqali kompyuteringizga saqlab olishingiz mumkin.
          </p>
        </div>
      </div>

    </div>
  );
};
