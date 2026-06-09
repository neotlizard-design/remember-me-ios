const storeKey = "remember-me-ios26-state";

const defaultCategories = [
  "שיחות עבודה",
  "משימות",
  "אישי",
  "כסף",
  "רעיונות",
  "דחוף",
];

const categoryRules = {
  "שיחות עבודה": ["שיחה", "לקוח", "עבודה", "פגישה", "הצעה", "מחיר", "סיכום", "מייל"],
  "משימות": ["לעשות", "לקנות", "לשלוח", "להתקשר", "לסיים", "לבדוק", "לתקן"],
  "אישי": ["בית", "משפחה", "חבר", "רופא", "אמא", "אבא", "אישי"],
  "כסף": ["כסף", "תשלום", "חשבונית", "בנק", "חיוב", "העברה", "תקציב"],
  "רעיונות": ["רעיון", "אפליקציה", "לבנות", "ליצור", "לפתח", "מיזם"],
  "דחוף": ["דחוף", "היום", "מחר", "חשוב", "מיד", "לא לשכוח"],
};

const state = loadState();
let activeFilter = "הכל";

const els = {
  memoryInput: document.querySelector("#memoryInput"),
  categorySelect: document.querySelector("#categorySelect"),
  prioritySelect: document.querySelector("#prioritySelect"),
  saveButton: document.querySelector("#saveButton"),
  smartButton: document.querySelector("#smartButton"),
  statusLine: document.querySelector("#statusLine"),
  searchInput: document.querySelector("#searchInput"),
  filterTabs: document.querySelector("#filterTabs"),
  memoryList: document.querySelector("#memoryList"),
  emptyState: document.querySelector("#emptyState"),
  totalCount: document.querySelector("#totalCount"),
  workCount: document.querySelector("#workCount"),
  todayCount: document.querySelector("#todayCount"),
  settingsButton: document.querySelector("#settingsButton"),
  settingsModal: document.querySelector("#settingsModal"),
  apiKeyInput: document.querySelector("#apiKeyInput"),
  saveSettingsButton: document.querySelector("#saveSettingsButton"),
  newCategoryInput: document.querySelector("#newCategoryInput"),
  addCategoryButton: document.querySelector("#addCategoryButton"),
  categoryManager: document.querySelector("#categoryManager"),
  clearDoneButton: document.querySelector("#clearDoneButton"),
  exportButton: document.querySelector("#exportButton"),
  voiceHintButton: document.querySelector("#voiceHintButton"),
};

init();

function init() {
  els.apiKeyInput.value = state.apiKey || "";
  renderCategories();
  renderFilters();
  renderMemories();
  bindEvents();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
}

function bindEvents() {
  els.saveButton.addEventListener("click", saveMemory);
  els.smartButton.addEventListener("click", classifyDraft);
  els.searchInput.addEventListener("input", renderMemories);
  els.settingsButton.addEventListener("click", () => els.settingsModal.showModal());
  els.saveSettingsButton.addEventListener("click", saveSettings);
  els.addCategoryButton.addEventListener("click", addCategory);
  els.clearDoneButton.addEventListener("click", clearDone);
  els.exportButton.addEventListener("click", exportBackup);
  els.voiceHintButton.addEventListener("click", fillExample);

  document.querySelectorAll("[data-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".bottom-nav button").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      els.memoryInput.focus();
    });
  });

  document.querySelectorAll("[data-filter-shortcut]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filterShortcut;
      renderFilters();
      renderMemories();
    });
  });
}

function loadState() {
  const saved = localStorage.getItem(storeKey);
  if (!saved) {
    return {
      apiKey: "",
      categories: defaultCategories,
      memories: seedMemories(),
    };
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      apiKey: parsed.apiKey || "",
      categories: parsed.categories?.length ? parsed.categories : defaultCategories,
      memories: parsed.memories || [],
    };
  } catch {
    return { apiKey: "", categories: defaultCategories, memories: [] };
  }
}

function seedMemories() {
  return [
    {
      id: crypto.randomUUID(),
      text: "לדבר עם יוסי על הצעת המחיר ולשלוח לו סיכום אחרי השיחה.",
      category: "שיחות עבודה",
      priority: "high",
      done: false,
      createdAt: new Date().toISOString(),
    },
  ];
}

function persist() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}

function renderCategories() {
  els.categorySelect.innerHTML = state.categories
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join("");

  els.categoryManager.innerHTML = state.categories
    .map(
      (category) => `
        <button type="button" data-remove-category="${escapeHtml(category)}">
          ${escapeHtml(category)} ×
        </button>
      `,
    )
    .join("");

  els.categoryManager.querySelectorAll("[data-remove-category]").forEach((button) => {
    button.addEventListener("click", () => removeCategory(button.dataset.removeCategory));
  });
}

function renderFilters() {
  const filters = ["הכל", ...state.categories];
  els.filterTabs.innerHTML = filters
    .map(
      (filter) => `
        <button type="button" class="${filter === activeFilter ? "is-active" : ""}" data-filter="${escapeHtml(filter)}">
          ${escapeHtml(filter)}
        </button>
      `,
    )
    .join("");

  els.filterTabs.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      renderFilters();
      renderMemories();
    });
  });
}

function renderMemories() {
  const search = els.searchInput.value.trim().toLowerCase();
  const visible = state.memories
    .filter((memory) => activeFilter === "הכל" || memory.category === activeFilter)
    .filter((memory) => memory.text.toLowerCase().includes(search) || memory.category.toLowerCase().includes(search))
    .sort((a, b) => Number(a.done) - Number(b.done) || new Date(b.createdAt) - new Date(a.createdAt));

  els.memoryList.innerHTML = visible.map(memoryTemplate).join("");
  els.emptyState.classList.toggle("is-visible", visible.length === 0);
  renderStats();

  els.memoryList.querySelectorAll("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => toggleDone(button.dataset.toggle));
  });

  els.memoryList.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteMemory(button.dataset.delete));
  });

  els.memoryList.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => copyMemory(button.dataset.copy));
  });
}

function memoryTemplate(memory) {
  const categoryClass = getCategoryClass(memory.category);
  const priorityLabel = memory.priority === "high" ? "גבוהה" : memory.priority === "low" ? "נמוכה" : "רגילה";
  const priorityClass = memory.priority === "high" ? "high" : "";

  return `
    <article class="memory-card ${memory.done ? "is-done" : ""}">
      <div class="memory-meta">
        <span class="pill ${categoryClass}">${escapeHtml(memory.category)}</span>
        <span class="pill ${priorityClass}">עדיפות ${priorityLabel}</span>
        <span class="time-label">${formatDate(memory.createdAt)}</span>
      </div>
      <p class="memory-text">${escapeHtml(memory.text)}</p>
      <div class="memory-actions">
        <button type="button" data-toggle="${memory.id}">${memory.done ? "החזר" : "בוצע"}</button>
        <button type="button" data-copy="${memory.id}">העתק</button>
        <button type="button" data-delete="${memory.id}">מחיקה</button>
      </div>
    </article>
  `;
}

function saveMemory() {
  const text = els.memoryInput.value.trim();
  if (!text) {
    setStatus("כתוב משהו קצר ואז אשמור אותו.", true);
    return;
  }

  const category = els.categorySelect.value || suggestCategory(text);
  const priority = els.prioritySelect.value || suggestPriority(text);
  state.memories.unshift({
    id: crypto.randomUUID(),
    text,
    category,
    priority,
    done: false,
    createdAt: new Date().toISOString(),
  });

  persist();
  els.memoryInput.value = "";
  els.prioritySelect.value = "normal";
  setStatus(`נשמר תחת "${category}".`);
  renderMemories();
}

async function classifyDraft() {
  const text = els.memoryInput.value.trim();
  if (!text) {
    setStatus("תן לי משפט קצר לסווג.", true);
    return;
  }

  els.smartButton.disabled = true;
  setStatus("מסווג...");

  try {
    const result = state.apiKey ? await classifyWithChatGPT(text) : classifyLocally(text);
    applyClassification(result);
    setStatus(`סיווגתי ל"${result.category}" עם עדיפות ${priorityHebrew(result.priority)}.`);
  } catch {
    const fallback = classifyLocally(text);
    applyClassification(fallback);
    setStatus("לא הצלחתי להתחבר ל-ChatGPT, אז סיווגתי מקומית.", true);
  } finally {
    els.smartButton.disabled = false;
  }
}

async function classifyWithChatGPT(text) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "Classify Hebrew reminder notes. Return only JSON with category and priority. Priority must be low, normal, or high.",
        },
        {
          role: "user",
          content: JSON.stringify({
            note: text,
            categories: state.categories,
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "memory_classification",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              category: { type: "string" },
              priority: { enum: ["low", "normal", "high"] },
            },
            required: ["category", "priority"],
          },
        },
      },
    }),
  });

  if (!response.ok) throw new Error("OpenAI request failed");
  const data = await response.json();
  const outputText =
    data.output_text ||
    data.output?.flatMap((item) => item.content || [])?.find((item) => item.type === "output_text")?.text;
  const parsed = JSON.parse(outputText || "{}");

  return {
    category: state.categories.includes(parsed.category) ? parsed.category : suggestCategory(text),
    priority: ["low", "normal", "high"].includes(parsed.priority) ? parsed.priority : suggestPriority(text),
  };
}

function classifyLocally(text) {
  return {
    category: suggestCategory(text),
    priority: suggestPriority(text),
  };
}

function suggestCategory(text) {
  const normalized = text.toLowerCase();
  let best = { category: state.categories[0] || "משימות", score: 0 };

  state.categories.forEach((category) => {
    const rules = categoryRules[category] || [category.toLowerCase()];
    const score = rules.reduce((sum, word) => sum + (normalized.includes(word) ? 1 : 0), 0);
    if (score > best.score) best = { category, score };
  });

  return best.score > 0 ? best.category : state.categories.includes("משימות") ? "משימות" : state.categories[0];
}

function suggestPriority(text) {
  const urgentWords = ["דחוף", "היום", "מיד", "חשוב", "לא לשכוח", "מחר"];
  const lowWords = ["מתישהו", "אולי", "רעיון", "בהמשך"];
  const normalized = text.toLowerCase();

  if (urgentWords.some((word) => normalized.includes(word))) return "high";
  if (lowWords.some((word) => normalized.includes(word))) return "low";
  return "normal";
}

function applyClassification(result) {
  if (!state.categories.includes(result.category)) {
    state.categories.push(result.category);
    persist();
    renderCategories();
    renderFilters();
  }

  els.categorySelect.value = result.category;
  els.prioritySelect.value = result.priority;
}

function saveSettings() {
  state.apiKey = els.apiKeyInput.value.trim();
  persist();
  setStatus(state.apiKey ? "ChatGPT מחובר לסיווג חכם." : "נשמר. כרגע הסיווג מקומי.");
}

function addCategory() {
  const category = els.newCategoryInput.value.trim();
  if (!category || state.categories.includes(category)) return;

  state.categories.push(category);
  els.newCategoryInput.value = "";
  persist();
  renderCategories();
  renderFilters();
  renderMemories();
}

function removeCategory(category) {
  if (state.categories.length <= 1) return;
  state.categories = state.categories.filter((item) => item !== category);
  state.memories = state.memories.map((memory) =>
    memory.category === category ? { ...memory, category: state.categories[0] } : memory,
  );
  persist();
  renderCategories();
  renderFilters();
  renderMemories();
}

function toggleDone(id) {
  state.memories = state.memories.map((memory) =>
    memory.id === id ? { ...memory, done: !memory.done } : memory,
  );
  persist();
  renderMemories();
}

function deleteMemory(id) {
  state.memories = state.memories.filter((memory) => memory.id !== id);
  persist();
  renderMemories();
}

function clearDone() {
  state.memories = state.memories.filter((memory) => !memory.done);
  persist();
  renderMemories();
}

async function copyMemory(id) {
  const memory = state.memories.find((item) => item.id === id);
  if (!memory) return;

  await navigator.clipboard.writeText(memory.text);
  setStatus("הזיכרון הועתק.");
}

function exportBackup() {
  const payload = JSON.stringify({ ...state, apiKey: "" }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "remember-me-backup.json";
  link.click();
  URL.revokeObjectURL(url);
}

function fillExample() {
  els.memoryInput.value = "ביום חמישי להתקשר למיכל אחרי שיחת העבודה ולשלוח לה הצעת מחיר מסודרת.";
  classifyDraft();
}

function renderStats() {
  const today = new Date().toDateString();
  els.totalCount.textContent = state.memories.length;
  els.workCount.textContent = state.memories.filter((memory) => memory.category === "שיחות עבודה").length;
  els.todayCount.textContent = state.memories.filter((memory) => new Date(memory.createdAt).toDateString() === today).length;
}

function setStatus(message, isWarning = false) {
  els.statusLine.textContent = message;
  els.statusLine.style.color = isWarning ? "var(--coral)" : "var(--muted)";
}

function getCategoryClass(category) {
  if (category === "שיחות עבודה") return "work";
  if (category === "אישי") return "personal";
  if (category === "כסף") return "money";
  if (category === "דחוף") return "urgent";
  return "";
}

function priorityHebrew(priority) {
  return priority === "high" ? "גבוהה" : priority === "low" ? "נמוכה" : "רגילה";
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
