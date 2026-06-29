import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client helper
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY topilshda xatolik. Iltimos, Secrets bo'limida API kalitni o'rnating.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API endpoint to generate customized app list packages based on user prompt
app.post("/api/generate-app", async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea) {
      return res.status(400).json({ error: "Fikr (idea) maydoni bo'sh bo'lishi mumkin emas." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Siz Android OS tahlilchisi va mobil dasturchisiz. Foydalanuvchining talabiga asosan, uning Redmi telefonida o'rnatilgan bo'lishi mumkin bo'lgan real ilovalar ro'yxatini generatsiya qiling (odatda 5 tadan 8 tagacha ilova).
Har bir ilova uchun chiroyli o'zbekcha nom, haqiqiy ko'rinishdagi paket nomi (packageName, masalan: com.tencent.ig), piktogramma emoji (icon), foydalanish vaqti (usageTimeMinutes - 5 dan 240 gacha tasodifiy son), o'lchami (sizeMb) va kategoriyasini taqdim eting.
Faqat va faqat JSON formatda javob bering.`;

    const prompt = `Foydalanuvchi so'rovi: "${idea}"

Quyidagi tuzilmaga ega to'liq JSON massiv qaytaring:
[
  {
    "id": "app_1",
    "name": "Ilova nomi (masalan: 'PUBG Mobile' yoki 'Telegram')",
    "packageName": "haqiqiy android paket nomi (masalan: 'com.tencent.ig' yoki 'org.telegram.messenger')",
    "icon": "bitta mos emoji (masalan: '🎮' yoki '💬')",
    "usageTimeMinutes": 120,
    "isHidden": false,
    "isUsageTrackingDisabled": false,
    "category": "O'yinlar" (yoki "Ijtimoiy", "Moliya", "Tizim"),
    "sizeMb": 180
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const responseText = response.text || "[]";
    const appData = JSON.parse(responseText.trim());
    res.json(appData);

  } catch (error: any) {
    console.error("Gemini xatoligi:", error);
    res.status(500).json({ 
      error: "AI orqali ilovalarni yangilashda xatolik yuz berdi.", 
      details: error.message 
    });
  }
});

// Setup development or production environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
