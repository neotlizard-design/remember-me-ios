const storeKey = "smart-plate-state-v1";

const demoAnalysis = {
  title: "חזה עוף, אורז וסלט ירקות",
  calories: 620,
  confidence: 78,
  notes: "הערכה לפי צלחת בינונית. דיוק הכמויות תלוי בזווית הצילום.",
  macros: {
    protein: 48,
    carbs: 58,
    fat: 18,
  },
  foods: [
    { name: "חזה עוף צלוי", portion: "כ-160 גרם", calories: 265 },
    { name: "אורז לבן מבושל", portion: "כוס אחת", calories: 205 },
    { name: "סלט ירקות עם כפית שמן", portion: "קערית קטנה", calories: 90 },
    { name: "טחינה", portion: "כף אחת", calories: 60 },
  ],
};

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
  const fallback = {
    apiKey: "",
    dailyGoal: 2200,
    meals: [],
  };
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
    setStatus("בחר תמונת אוכל תקינה.", true);
    return;
  }

  try {
    selectedPhotoDataUrl = await resizeImage(file, 1280, 0.86);
    els.photoPreview.src = selectedPhotoDataUrl;
    els.photoPreview.classList.add("is-visible");
    els.photoPlaceholder.classList.add("is-hidden");
    setStatus("התמונה מוכנה לניתוח.");
  } catch {
    setStatus("לא הצלחתי לקרוא את התמונה.", true);
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
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
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
    setStatus("קודם צלם או העלה תמונה של הארוחה.", true);
    return;
  }

  if (!state.apiKey) {
    setStatus("כדי לנתח תמונה אמיתית צריך להוסיף מפתח OpenAI בהגדרות.", true);
    return;
  }

  els.analyzeButton.disabled = true;
  setStatus("מנתח את הצלחת...");

  try {
    const analysis = await analyzeWithOpenAI(selectedPhotoDataUrl, els.mealNotes.value.trim());
    currentAnalysis = normalizeAnalysis(analysis);
    portionScale = 1;
    els.portionSlider.value = "100";
    renderAnalysis(currentAnalysis);
    setStatus("הניתוח מוכן. כדאי לבדוק את גודל המנה לפני שמירה.");
  } catch (error) {
    console.error(error);
    setStatus("הניתוח נכשל. בדוק את מפתח ה-API או נסה תמונה ברורה יותר.", true);
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
      model: "gpt-5.5",
      instructions:
        "You estimate nutrition from meal photos for a Hebrew mobile app. Return cautious estimates, not medical advice. If quantity is uncertain, lower confidence and explain briefly.",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Analyze this meal photo. User notes: ${notes || "none"}. Return Hebrew food names and realistic estimated portions.`,
            },
            {
              type: "input_image",
              image_url: imageDataUrl,
              detail: "high",
            },
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

  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
  const data = await response.json();
  const outputText =
    data.output_text ||
    data.output?.flatMap((item) => item.content || [])?.find((item) => item.type === "output_text")?.text;
  return JSON.parse(outputText || "{}");
}

function normalizeAnalysis(analysis) {
  return {
    title: String(analysis.title || "ארוחה מצולמת").slice(0, 80),
    calories: clampNumber(analysis.calories, 0, 5000),
    confidence: clampNumber(analysis.confidence, 0, 100),
    notes: String(analysis.notes || "הערכת AI לפי התמונה.").slice(0, 220),
    macros: {
      protein: clampNumber(analysis.macros?.protein, 0, 300),
      carbs: clampNumber(analysis.macros?.carbs, 0, 600),
      fat: clampNumber(analysis.macros?.fat, 0, 300),
    },
    foods: Array.isArray(analysis.foods)
      ? analysis.foods.slice(0, 8).map((food) => ({
          name: String(food.name || "פריט מזון").slice(0, 60),
          portion: String(food.portion || "מנה משוערת").slice(0, 60),
          calories: clampNumber(food.calories, 0, 2000),
        }))
      : [],
  };
}

function renderAnalysis(analysis) {
  const scaled = analysis ? scaleAnalysis(analysis, portionScale) : null;
  els.confidenceBadge.textContent = scaled ? `${Math.round(scaled.confidence)}% ביטחון` : "ממתין לצילום";
  els.calorieValue.textContent = scaled ? Math.round(scaled.calories).toLocaleString("he-IL") : "0";
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
          <h3>אין תוצאה עדיין</h3>
          <p>הוסף תמונה ולחץ על ניתוח ארוחה. ההערכה תופיע כאן עם אפשרות לתקן את גודל המנה.</p>
        </article>
      `;

  els.saveMealButton.disabled = !scaled;
  els.portionValue.textContent = `${Math.round(portionScale * 100)}%`;
}

function foodTemplate(food) {
  return `
    <article class="food-row">
      <div>
        <strong>${escapeHtml(food.name)}</strong>
        <p>${escapeHtml(food.portion)}</p>
      </div>
      <span>${Math.round(food.calories)} קק"ל</span>
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
  currentAnalysis = normalizeAnalysis(demoAnalysis);
  portionScale = 1;
  els.portionSlider.value = "100";
  renderAnalysis(currentAnalysis);
  setStatus("פתחנו דוגמה. אפשר לשנות אחוז מנה ולשמור ליומן.");
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
  setStatus("הארוחה נשמרה ביומן.");
}

function renderJournal() {
  const today = new Date().toDateString();
  const todaysMeals = state.meals.filter((meal) => new Date(meal.createdAt).toDateString() === today);
  const calories = todaysMeals.reduce((sum, meal) => sum + meal.analysis.calories, 0);
  const confidence =
    state.meals.length === 0
      ? 0
      : state.meals.reduce((sum, meal) => sum + meal.analysis.confidence, 0) / state.meals.length;

  els.todayCalories.textContent = Math.round(calories).toLocaleString("he-IL");
  els.mealCount.textContent = todaysMeals.length.toLocaleString("he-IL");
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
          <span class="pill">${Math.round(meal.analysis.calories)} קק"ל</span>
          <span class="time-label">${formatDate(meal.createdAt)}</span>
        </div>
        <h3>${escapeHtml(meal.analysis.title)}</h3>
        <p>${escapeHtml(meal.analysis.notes)}</p>
        <button type="button" data-delete-meal="${meal.id}">מחיקה</button>
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
  setStatus("ניקיתי את הארוחה הנוכחית.");
}

function clearJournal() {
  state.meals = [];
  persist();
  renderJournal();
  setStatus("היומן נוקה.");
}

function saveSettings() {
  state.apiKey = els.apiKeyInput.value.trim();
  state.dailyGoal = clampNumber(els.dailyGoalInput.value, 800, 6000);
  persist();
  setStatus(state.apiKey ? "ההגדרות נשמרו. אפשר לנתח תמונות אמיתיות." : "ההגדרות נשמרו ללא מפתח API.");
}

function exportJournal() {
  const payload = JSON.stringify({ ...state, apiKey: "" }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "smart-plate-journal.json";
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

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function formatDate(date) {
  return new Intl.DateTimeFormat("he-IL", {
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
