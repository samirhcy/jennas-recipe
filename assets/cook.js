const COOK_API_KEY = "";

//State
let currentRecipe = null;
let currentSteps  = [];
let currentStep   = 0;
const gallerySection   = document.getElementById("cm-gallery");
const dashboardSection = document.getElementById("cm-dashboard");
const galleryGrid      = document.getElementById("cmGalleryGrid");
const emptyState       = document.getElementById("cmEmptyState");
const backBtn          = document.getElementById("cmBackBtn");

//  State 1 -Load favorites from localStorage 
function showGallery() {
  dashboardSection.style.display = "none";
  gallerySection.style.display   = "block";

  const favorites = JSON.parse(localStorage.getItem("jenna_favorites") || "[]");

  if (favorites.length === 0) {
    galleryGrid.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  galleryGrid.innerHTML = favorites.map((recipe, index) => `
    <div class="col-lg-3 col-md-6">
      <div class="cm-gallery-card">
        <img src="${recipe.image}" alt="${recipe.title}" class="img-fluid" />
        <div class="p-3">
          <h5>${recipe.title}</h5>
          <p class="text-muted" style="font-size:13px;">⏱ ${recipe.readyInMinutes} min · 🍽 ${recipe.servings} servings</p>
          <button class="btn link w-100 mt-2" onclick="startCook(${index})">Let's Cook</button>
        </div>
      </div>
    </div>
  `).join("");
}

// State 2: Show dashboard for selected recipe
function startCook(index) {
  const favorites = JSON.parse(localStorage.getItem("jenna_favorites") || "[]");
  currentRecipe = favorites[index];

  gallerySection.style.display   = "none";
  dashboardSection.style.display = "block";

  // Populate header immediately from localStorage data
  document.getElementById("cmDashTitle").textContent = currentRecipe.title;
  document.getElementById("cmDashMeta").textContent  =
    `⏱ ${currentRecipe.readyInMinutes} min  ·  🍽 ${currentRecipe.servings} servings`;

  // Fire the full API call for ingredients + steps
  fetchRecipeInfo(currentRecipe.id);
}

// Back button
backBtn.addEventListener("click", () => {
  currentRecipe = null;
  currentSteps  = [];
  currentStep   = 0;
  showGallery();
});

// API call 
async function fetchRecipeInfo(id) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${COOK_API_KEY}&includeNutrition=false`
    );
    const recipe = await response.json();
    console.log("Cook Mode full data:", recipe);

    populateIngredients(recipe.extendedIngredients || []);
    populateSteps(recipe.analyzedInstructions || []);

  } catch (err) {
    console.error("Failed to fetch recipe info:", err);
    document.getElementById("cmStepText").textContent = "Could not load recipe steps.";
  }
}

// Ingredients checklist
function populateIngredients(ingredients) {
  const list = document.getElementById("cmIngredientList");

  if (ingredients.length === 0) {
    list.innerHTML = "<li class='text-muted'>No ingredients found.</li>";
    return;
  }

  list.innerHTML = ingredients.map((ing, i) => `
    <li class="cm-ingredient-item" id="ing-${i}">
      <label>
        <input type="checkbox" onchange="toggleIngredient(${i})" />
        <span>${ing.original}</span>
      </label>
    </li>
  `).join("");
}

function toggleIngredient(index) {
  const item = document.getElementById(`ing-${index}`);
  item.classList.toggle("checked");
}

// Step navigator
function populateSteps(instructions) {
  const stepTextEl  = document.getElementById("cmStepText");
  const stepCountEl = document.getElementById("cmStepCount");

  if (!instructions.length || !instructions[0].steps.length) {
    stepTextEl.textContent = "No steps available for this recipe.";
    document.getElementById("cmStepCount").textContent = "";
    return;
  }

  currentSteps = instructions[0].steps;
  currentStep  = 0;
  renderStep();
}

function renderStep() {
  const stepTextEl  = document.getElementById("cmStepText");
  const stepCountEl = document.getElementById("cmStepCount");
  const progressBar = document.getElementById("cmProgressBar");

  const step = currentSteps[currentStep];
  stepTextEl.textContent  = step.step;
  stepCountEl.textContent = `Step ${currentStep + 1} of ${currentSteps.length}`;

  const pct = ((currentStep + 1) / currentSteps.length) * 100;
  progressBar.style.width = pct + "%";

  // Disable prev/next at boundaries
  document.getElementById("cmPrevBtn").disabled = currentStep === 0;
  document.getElementById("cmNextBtn").disabled = currentStep === currentSteps.length - 1;
}

document.getElementById("cmPrevBtn").addEventListener("click", () => {
  if (currentStep > 0) { currentStep--; renderStep(); }
});

document.getElementById("cmNextBtn").addEventListener("click", () => {
  if (currentStep < currentSteps.length - 1) { currentStep++; renderStep(); }
});


//timer
let timerInterval = null;
let timerSeconds  = 0;
let timerRunning  = false;

const timerInput   = document.getElementById("cmTimerInput");
const timerDisplay = document.getElementById("cmTimerDisplay");

function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timerSeconds);
}

// When user changes the input, reset display to match
timerInput.addEventListener("input", () => {
  if (timerRunning) return; // don't allow change mid-run
  const mins = parseInt(timerInput.value) || 1;
  timerSeconds = mins * 60;
  updateTimerDisplay();
});

// Set initial display to match default input value
timerSeconds = parseInt(timerInput.value) * 60;
updateTimerDisplay();

document.getElementById("cmTimerStart").addEventListener("click", () => {
  if (timerRunning) return;
  if (timerSeconds <= 0) {
    timerSeconds = (parseInt(timerInput.value) || 1) * 60;
  }
  timerRunning = true;
  timerInput.disabled = true; // lock input while running

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerInput.disabled = false;
      timerDisplay.textContent = "Done!";
    }
  }, 1000);
});

document.getElementById("cmTimerPause").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerRunning = false;
  timerInput.disabled = false;
});

document.getElementById("cmTimerReset").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerRunning    = false;
  timerInput.disabled = false;
  timerSeconds    = (parseInt(timerInput.value) || 1) * 60;
  updateTimerDisplay();
});

document.getElementById("cmPrintBtn").addEventListener("click", () => window.print());

// Init 
showGallery();