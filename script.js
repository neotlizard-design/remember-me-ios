const locale = document.documentElement.lang === "ru" ? "ru" : "he";
const storeKey = `smart-plate-state-v2-${locale}`;

const copy = {
  he: {
    locale: "he-IL",
    outputLanguage: "Hebrew",
    photographedMeal: "ארוחה מצולמת",
    aiEstimate: "הערכת AI לפי התמונה.",
    foodItem: "פריט מזון",
    estimatedPortion: "מנה משוערת",
    confidence: "ביטחון",
    waiting: "ממתין לצילום",
    caloriesUnit: 'קק"ל',
    noResultTitle: "אין תוצאה עדיין",
    noResultText: "הוסף תמונה ולחץ על זיהוי. ההערכה תופיע כאן עם אפשרות לתקן את גודל המנה.",
    invalidImage: "בחר תמונת אוכל תקינה.",
    imageReady: "התמונה מוכנה לזיהוי.",
    imageError: "לא הצלחתי לקרוא את התמונה.",
    photoRequired: "קודם צלם או העלה תמונה של הארוחה.",
    apiRequired: "כדי לזהות תמונה אמיתית צריך להוסיף מפתח OpenAI בהגדרות.",
    analyzing: "מזהה את מה שבצלחת...",
    analysisReady: "הזיהוי מוכן. כדאי לבדוק את גודל המנה לפני שמירה.",
    analysisError: "הזיהוי נכשל. בדוק את מפתח ה-API או נסה תמונה ברורה יותר.",
    demoReady: "פתחנו דוגמה. אפשר לשנות אחוז מנה ולשמור ביומן.",
    saved: "הארוחה נשמרה ביומן.",
    currentCleared: "ניקיתי את הארוחה הנוכחית.",
    journalCleared: "היומן נוקה.",
    settingsWithApi: "ההגדרות נשמרו. אפשר לזהות תמונות אמיתיות.",
    settingsWithoutApi: "ההגדרות נשמרו ללא מפתח API.",
    checkingApi: "בודק חיבור ל-OpenAI...",
    apiConnected: "החיבור תקין. המפתח יכול לגשת למודל זיהוי התמונות.",
    apiKeyMissing: "הכנס מפתח API לפני בדיקת החיבור.",
    errorInvalidKey: "המפתח לא תקין או בוטל. צור מפתח חדש ב-platform.openai.com.",
    errorNoCredit: "אין יתרת API או שהחיוב אינו פעיל. מנוי ChatGPT אינו כולל שימוש ב-API.",
    errorPermission: "למפתח אין הרשאה למודל. בדוק את הרשאות הפרויקט או צור מפתח חדש.",
    errorRateLimit: "הגעת למגבלת השימוש. נסה שוב בעוד מספר דקות.",
    errorBadRequest: "OpenAI דחה את הבקשה. נסה תמונה אחרת או מפתח מפרויקט אחר.",
    errorNetwork: "לא ניתן להתחבר ל-OpenAI. בדוק אינטרנט ונסה שוב.",
    delete: "מחיקה",
    exportName: "smart-plate-hebrew-journal.json",
    demo: {
      title: "חזה עוף, אורז וסלט ירקות",
      calories: 620,
      confidence: 78,
      notes: "הערכה לפי צלחת בינונית. דיוק הכמויות תלוי בזווית הצילום.",
      macros: { protein: 48, carbs: 58, fat: 18 },
      foods: [
        { name: "חזה עוף צלוי", portion: "כ-160 גרם", calories: 265 },
        { name: "אורז לבן מבושל", portion: "כוס אחת", calories: 205 },
        { name: "סלט ירקות עם כפית שמן", portion: "קערית קטנה", calories: 90 },
        { name: "טחינה", portion: "כף אחת", calories: 60 },
      ],
    },
  },
  ru: {
    locale: "ru-RU",
    outputLanguage: "Russian",
    photographedMeal: "Блюдо на фото",
    aiEstimate: "Оценка AI по фотографии.",
    foodItem: "Продукт",
    estimatedPortion: "Примерная порция",
    confidence: "точность",
    waiting: "Ожидание фото",
    caloriesUnit: "ккал",
    noResultTitle: "Результата пока нет",
    noResultText: "Добавьте фото и запустите распознавание. Здесь появится оценка и настройка размера порции.",
    invalidImage: "Выберите подходящую фотографию еды.",
    imageReady: "Фотография готова к распознаванию.",
    imageError: "Не удалось прочитать фотографию.",
    photoRequired: "Сначала сфотографируйте блюдо или загрузите фото.",
    apiRequired: "Для анализа настоящего фото добавьте ключ OpenAI в настройках.",
    analyzing: "Распознаю содержимое тарелки...",
    analysisReady: "Результат готов. Проверьте размер порции перед сохранением.",
    analysisError: "Не удалось распознать блюдо. Проверьте API-ключ или попробуйте более чёткое фото.",
    demoReady: "Открыт пример. Можно изменить размер порции и сохранить его.",
    saved: "Блюдо сохранено в дневнике.",
    currentCleared: "Текущее блюдо очищено.",
    journalCleared: "Дневник очищен.",
    settingsWithApi: "Настройки сохранены. Можно анализировать настоящие фотографии.",
    settingsWithoutApi: "Настройки сохранены без API-ключа.",
    checkingApi: "Проверяю подключение к OpenAI...",
    apiConnected: "Подключение работает. Ключ имеет доступ к модели распознавания.",
    apiKeyMissing: "Введите API-ключ перед проверкой.",
    errorInvalidKey: "Ключ неверный или был отозван. Создайте новый ключ на platform.openai.com.",
    errorNoCredit: "Нет баланса API или не подключена оплата. Подписка ChatGPT не включает API.",
    errorPermission: "У ключа нет доступа к модели. Проверьте разрешения проекта или создайте новый ключ.",
    errorRateLimit: "Достигнут лимит запросов. Попробуйте снова через несколько минут.",
    errorBadRequest: "OpenAI отклонил запрос. Попробуйте другое фото или ключ другого проекта.",
    errorNetwork: "Не удалось подключиться к OpenAI. Проверьте интернет и повторите попытку.",
    delete: "Удалить",
    exportName: "smart-plate-russian-journal.json",
    demo: {
      title: "Куриная грудка, рис и овощной салат",
      calories: 620,
      confidence: 78,
      notes: "Оценка для тарелки среднего размера. Точность порций зависит от угла съёмки.",
      macros: { protein: 48, carbs: 58, fat: 18 },
      foods: [
        { name: "Куриная грудка на гриле", portion: "около 160 г", calories: 265 },
        { name: "Варёный белый рис", portion: "одна чашка", calories: 205 },
        { name: "Овощной салат с маслом", portion: "небольшая миска", calories: 90 },
        { name: "Тахини", portion: "одна столовая ложка", calories: 60 },
      ],
    },
  },
}[locale];

const state = loadState();
let selectedPhotoDataUrl = "";
let currentAnalysis = null;
let portionScale = 1;

const els = {
  settingsButton: document.querySelector("#settingsButton"),
  settingsModal: document.querySelector("#settingsModal"),
  apiKeyInput: document.querySelector("#apiKeyInput"),
  dailyGoalInput: document.querySelector("#dailyGoalInput"),
  saveSettingsButton: document.querySelector("#saveSettingsButton"),
  clearJournalButton: document.querySelector("#clearJournalButton"),
  testApiButton: document.querySelector("#testApiButton"),
  apiCheckStatus: document.querySelector("#apiCheckStatus"),
  mealPhotoInput: document.querySelector("#mealPhotoInput"),
  photoPreview: document.querySelector("#photoPreview"),
  photoPlaceholder: document.querySelector("#photoPlaceholder"),
  mealNotes: document.querySelector("#mealNotes"),
  analyzeButton: document.querySelector("#analyzeButton"),
  demoButton: document.querySelector("#demoButton"),
  statusLine: document.querySelector("#statusLine"),
  confidenceBadge: document.querySelector("#confidenceBadge"),
  calorieValue: document.querySelector("#calorieValue"),
  proteinValue: document.querySelector("#proteinValue"),
  carbsValue: document.querySelector("#carbsValue"),
  fatValue: document.querySelector("#fatValue"),
  foodList: document.querySelector("#foodList"),
  portionSlider: document.querySelector("#portionSlider"),
  portionValue: document.querySelector("#portionValue"),
  saveMealButton: document.querySelector("#saveMealButton"),
  clearButton: document.querySelector("#clearButton"),
  todayCalories: document.querySelector("#todayCalories"),
  mealCount: document.querySelector("#mealCount"),
  avgConfidence: document.querySelector("#avgConfidence"),
  journalList: document.querySelector("#journalList"),
  emptyState: document.querySelector("#emptyState"),
  exportButton: document.querySelector("#exportButton"),
};

init();

function init() {
  els.apiKeyInput.value = state.apiKey || "";
  els.dailyGoalInput.value = state.dailyGoal;
  bindEvents();
  renderAnalysis(null);
  renderJournal();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
}

function bindEvents() {
  els.settingsButton.addEventListener("click", () => els.settingsModal.showModal());
  els.saveSettingsButton.addEventListener("click", saveSettings);
  els.clearJournalButton.addEventListener("click", clearJournal);
  els.testApiButton.addEventListener("click", testApiConnection);
  els.mealPhotoInput.addEventListener("change", handlePhotoChange);
  els.analyzeButton.addEventListener("click", analyzeMeal);
  els.demoButton.addEventListener("click", showDemo);
  els.portionSlider.addEventListener("input", updatePortion);
  els.saveMealButton.addEventListener("click", saveMeal);
  els.clearButton.addEventListener("click", clearCurrentMeal);
  els.exportButton.addEventListener("click", exportJournal);

  document.querySelectorAll("[data-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveNav(button);
      els.mealPhotoInput.click();
    });
  });

  document.querySelectorAll("[data-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveNav(button);
      document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function loadState() {
  const fallback = { apiKey: "", dailyGoal: 2200, meals: [] };
  const saved = localStorage.getItem(storeKey);
  if (!saved) return fallback;

  try {
    const parsed = JSON.parse(saved);
    return {
      apiKey: parsed.apiKey || "",
      dailyGoal: Number(parsed.dailyGoal) || fallback.dailyGoal,
      meals: Array.isArray(parsed.meals) ? parsed.meals : [],
    };
  } catch {
    return fallback;
  }
}

function persist() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}

async function handlePhotoChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setStatus(copy.invalidImage, true);
    return;
  }

  try {
    selectedPhotoDataUrl = await resizeImage(file, 1280, 0.86);
    els.photoPreview.src = selectedPhotoDataUrl;
    els.photoPreview.classList.add("is-visible");
    els.photoPlaceholder.classList.add("is-hidden");
    setStatus(copy.imageReady);
  } catch {
    setStatus(copy.imageError, true);
  }
}

function resizeImage(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function analyzeMeal() {
  if (!selectedPhotoDataUrl) {
    setStatus(copy.photoRequired, true);
    return;
  }
  if (!state.apiKey) {
    setStatus(copy.apiRequired, true);
    return;
  }

  els.analyzeButton.disabled = true;
  setStatus(copy.analyzing);

  try {
    const analysis = await analyzeWithOpenAI(selectedPhotoDataUrl, els.mealNotes.value.trim());
    currentAnalysis = normalizeAnalysis(analysis);
    portionScale = 1;
    els.portionSlider.value = "100";
    renderAnalysis(currentAnalysis);
    setStatus(copy.analysisReady);
  } catch (error) {
    console.error(error);
    setStatus(error instanceof OpenAIRequestError ? getApiErrorMessage(error) : copy.analysisError, true);
  } finally {
    els.analyzeButton.disabled = false;
  }
}

async function analyzeWithOpenAI(imageDataUrl, notes) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      instructions: `Estimate nutrition from meal photos for a mobile app. Return all user-facing text in ${copy.outputLanguage}. Be cautious and lower confidence when portions are unclear.`,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Analyze this meal photo. User notes: ${notes || "none"}. Return realistic estimated portions and food names in ${copy.outputLanguage}.`,
            },
            { type: "input_image", image_url: imageDataUrl, detail: "high" },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "meal_nutrition_estimate",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              calories: { type: "number" },
              confidence: { type: "number" },
              notes: { type: "string" },
              macros: {
                type: "object",
                additionalProperties: false,
                properties: {
                  protein: { type: "number" },
                  carbs: { type: "number" },
                  fat: { type: "number" },
                },
                required: ["protein", "carbs", "fat"],
              },
              foods: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    name: { type: "string" },
                    portion: { type: "string" },
                    calories: { type: "number" },
                  },
                  required: ["name", "portion", "calories"],
                },
              },
            },
            required: ["title", "calories", "confidence", "notes", "macros", "foods"],
          },
        },
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new OpenAIRequestError(response.status, data.error?.code, data.error?.message);
  }
  const outputText =
    data.output_text ||
    data.output?.flatMap((item) => item.content || [])?.find((item) => item.type === "output_text")?.text;
  return JSON.parse(outputText || "{}");
}

function normalizeAnalysis(analysis) {
  return {
    title: String(analysis.title || copy.photographedMeal).slice(0, 80),
    calories: clampNumber(analysis.calories, 0, 5000),
    confidence: clampNumber(analysis.confidence, 0, 100),
    notes: String(analysis.notes || copy.aiEstimate).slice(0, 220),
    macros: {
      protein: clampNumber(analysis.macros?.protein, 0, 300),
      carbs: clampNumber(analysis.macros?.carbs, 0, 600),
      fat: clampNumber(analysis.macros?.fat, 0, 300),
    },
    foods: Array.isArray(analysis.foods)
      ? analysis.foods.slice(0, 8).map((food) => ({
          name: String(food.name || copy.foodItem).slice(0, 60),
          portion: String(food.portion || copy.estimatedPortion).slice(0, 60),
          calories: clampNumber(food.calories, 0, 2000),
        }))
      : [],
  };
}

function renderAnalysis(analysis) {
  const scaled = analysis ? scaleAnalysis(analysis, portionScale) : null;
  els.confidenceBadge.textContent = scaled ? `${Math.round(scaled.confidence)}% ${copy.confidence}` : copy.waiting;
  els.calorieValue.textContent = scaled ? Math.round(scaled.calories).toLocaleString(copy.locale) : "0";
  els.proteinValue.textContent = `${scaled ? Math.round(scaled.macros.protein) : 0}g`;
  els.carbsValue.textContent = `${scaled ? Math.round(scaled.macros.carbs) : 0}g`;
  els.fatValue.textContent = `${scaled ? Math.round(scaled.macros.fat) : 0}g`;

  els.foodList.innerHTML = scaled
    ? `
        <article class="analysis-summary">
          <h3>${escapeHtml(scaled.title)}</h3>
          <p>${escapeHtml(scaled.notes)}</p>
        </article>
        ${scaled.foods.map(foodTemplate).join("")}
      `
    : `
        <article class="analysis-summary">
          <h3>${copy.noResultTitle}</h3>
          <p>${copy.noResultText}</p>
        </article>
      `;

  els.saveMealButton.disabled = !scaled;
  els.portionValue.textContent = `${Math.round(portionScale * 100)}%`;
}

function foodTemplate(food) {
  return `
    <article class="food-row">
      <div><strong>${escapeHtml(food.name)}</strong><p>${escapeHtml(food.portion)}</p></div>
      <span>${Math.round(food.calories)} ${copy.caloriesUnit}</span>
    </article>
  `;
}

function scaleAnalysis(analysis, scale) {
  return {
    ...analysis,
    calories: analysis.calories * scale,
    macros: {
      protein: analysis.macros.protein * scale,
      carbs: analysis.macros.carbs * scale,
      fat: analysis.macros.fat * scale,
    },
    foods: analysis.foods.map((food) => ({ ...food, calories: food.calories * scale })),
  };
}

function updatePortion() {
  portionScale = Number(els.portionSlider.value) / 100;
  renderAnalysis(currentAnalysis);
}

function showDemo() {
  currentAnalysis = normalizeAnalysis(copy.demo);
  portionScale = 1;
  els.portionSlider.value = "100";
  renderAnalysis(currentAnalysis);
  setStatus(copy.demoReady);
}

function saveMeal() {
  if (!currentAnalysis) return;
  const scaled = scaleAnalysis(currentAnalysis, portionScale);
  state.meals.unshift({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    image: selectedPhotoDataUrl || "",
    analysis: scaled,
  });
  persist();
  renderJournal();
  setStatus(copy.saved);
}

function renderJournal() {
  const today = new Date().toDateString();
  const todaysMeals = state.meals.filter((meal) => new Date(meal.createdAt).toDateString() === today);
  const calories = todaysMeals.reduce((sum, meal) => sum + meal.analysis.calories, 0);
  const confidence =
    state.meals.length === 0
      ? 0
      : state.meals.reduce((sum, meal) => sum + meal.analysis.confidence, 0) / state.meals.length;

  els.todayCalories.textContent = Math.round(calories).toLocaleString(copy.locale);
  els.mealCount.textContent = todaysMeals.length.toLocaleString(copy.locale);
  els.avgConfidence.textContent = `${Math.round(confidence)}%`;
  els.journalList.innerHTML = state.meals.map(mealTemplate).join("");
  els.emptyState.classList.toggle("is-visible", state.meals.length === 0);

  els.journalList.querySelectorAll("[data-delete-meal]").forEach((button) => {
    button.addEventListener("click", () => deleteMeal(button.dataset.deleteMeal));
  });
}

function mealTemplate(meal) {
  return `
    <article class="journal-card">
      ${meal.image ? `<img src="${meal.image}" alt="" />` : ""}
      <div>
        <div class="memory-meta">
          <span class="pill">${Math.round(meal.analysis.calories)} ${copy.caloriesUnit}</span>
          <span class="time-label">${formatDate(meal.createdAt)}</span>
        </div>
        <h3>${escapeHtml(meal.analysis.title)}</h3>
        <p>${escapeHtml(meal.analysis.notes)}</p>
        <button type="button" data-delete-meal="${meal.id}">${copy.delete}</button>
      </div>
    </article>
  `;
}

function deleteMeal(id) {
  state.meals = state.meals.filter((meal) => meal.id !== id);
  persist();
  renderJournal();
}

function clearCurrentMeal() {
  selectedPhotoDataUrl = "";
  currentAnalysis = null;
  portionScale = 1;
  els.mealPhotoInput.value = "";
  els.mealNotes.value = "";
  els.portionSlider.value = "100";
  els.photoPreview.removeAttribute("src");
  els.photoPreview.classList.remove("is-visible");
  els.photoPlaceholder.classList.remove("is-hidden");
  renderAnalysis(null);
  setStatus(copy.currentCleared);
}

function clearJournal() {
  state.meals = [];
  persist();
  renderJournal();
  setStatus(copy.journalCleared);
}

function saveSettings() {
  state.apiKey = els.apiKeyInput.value.trim();
  state.dailyGoal = clampNumber(els.dailyGoalInput.value, 800, 6000);
  persist();
  setStatus(state.apiKey ? copy.settingsWithApi : copy.settingsWithoutApi);
}

async function testApiConnection() {
  const apiKey = els.apiKeyInput.value.trim();
  if (!apiKey) {
    setApiCheckStatus(copy.apiKeyMissing, true);
    return;
  }

  els.testApiButton.disabled = true;
  setApiCheckStatus(copy.checkingApi);

  try {
    const response = await fetch("https://api.openai.com/v1/models/gpt-4o-mini", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new OpenAIRequestError(response.status, data.error?.code, data.error?.message);
    }

    state.apiKey = apiKey;
    persist();
    setApiCheckStatus(copy.apiConnected);
  } catch (error) {
    console.error(error);
    setApiCheckStatus(error instanceof OpenAIRequestError ? getApiErrorMessage(error) : copy.errorNetwork, true);
  } finally {
    els.testApiButton.disabled = false;
  }
}

function exportJournal() {
  const payload = JSON.stringify({ ...state, apiKey: "" }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = copy.exportName;
  link.click();
  URL.revokeObjectURL(url);
}

function setActiveNav(activeButton) {
  document.querySelectorAll(".bottom-nav button").forEach((button) => button.classList.remove("is-active"));
  activeButton.classList.add("is-active");
}

function setStatus(message, isWarning = false) {
  els.statusLine.textContent = message;
  els.statusLine.style.color = isWarning ? "var(--coral)" : "var(--muted)";
}

function setApiCheckStatus(message, isWarning = false) {
  els.apiCheckStatus.textContent = message;
  els.apiCheckStatus.style.color = isWarning ? "var(--coral)" : "var(--leaf-dark)";
}

function getApiErrorMessage(error) {
  if (error.status === 401) return copy.errorInvalidKey;
  if (error.status === 403 || error.code === "model_not_found") return copy.errorPermission;
  if (error.status === 429 && ["insufficient_quota", "billing_hard_limit_reached"].includes(error.code)) {
    return copy.errorNoCredit;
  }
  if (error.status === 429) return copy.errorRateLimit;
  if (error.status === 400) return copy.errorBadRequest;
  return copy.errorNetwork;
}

class OpenAIRequestError extends Error {
  constructor(status, code, message) {
    super(message || `OpenAI request failed: ${status}`);
    this.name = "OpenAIRequestError";
    this.status = status;
    this.code = code || "";
  }
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function formatDate(date) {
  return new Intl.DateTimeFormat(copy.locale, {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
