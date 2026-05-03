const SPOONACULAR_KEY = "ead2c99004624a56a481d4249ca981cb";
// Scroll progress + navbar pill effect
const wrapper = document.getElementById("wrapper");
const progressBar = document.getElementById("scroll-progress");
const nav = document.querySelector(".custom-navbar");

window.addEventListener("scroll", function () {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (scrolled / total) * 100 : 0;

  if (progressBar) progressBar.style.width = pct + "%";

  if (scrolled > 80) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// Scroll reveal, same idea as home page
const revealEls = document.querySelectorAll(".scroll-reveal");

if (wrapper && revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { root: wrapper, threshold: 0.15 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

// window.addEventListener("load", function () {
//   const loader = document.getElementById("page-loader");
//   const page = document.querySelector(".recipe-page-enter");

//   setTimeout(() => {
//     loader.classList.add("fade-out");

//     if (page) {
//       page.classList.add("loaded");
//     }
//   }, 900);
// });
window.addEventListener("load", function () {
  const loadBar = document.getElementById("page-load-bar");
  const page = document.querySelector(".recipe-page");

  if (!loadBar || !page) return;

  let progress = 0;

  const interval = setInterval(() => {
    if (progress < 80) {
      progress += Math.random() * 18;
      loadBar.style.width = progress + "%";
    }
  }, 80);

  setTimeout(() => {
    clearInterval(interval);
    loadBar.style.width = "100%";

    page.classList.add("page-ready");

    setTimeout(() => {
      loadBar.classList.add("done");
    }, 250);
  }, 700);
});

// 3 side buttons

const favoritesBtn = document.getElementById("favoritesBtn");
const shoppingBtn = document.getElementById("shoppingBtn");
const plannerBtn = document.getElementById("plannerBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidePanel = document.getElementById("sidePanel");
const sidePanelTitle = document.getElementById("sidePanelTitle");
const sidePanelContent = document.getElementById("sidePanelContent");
const closePanelBtn = document.getElementById("closePanelBtn");
//console.log(favoritesBtn, shoppingBtn, plannerBtn, sidebarOverlay, closePanelBtn); //If one of them is null, that's the problem
if (
  favoritesBtn &&
  shoppingBtn &&
  plannerBtn &&
  sidebarOverlay &&
  sidePanel &&
  sidePanelTitle &&
  sidePanelContent &&
  closePanelBtn
) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
  let mealPlans = JSON.parse(localStorage.getItem("mealPlans")) || [];

  function savePanels() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    localStorage.setItem("mealPlans", JSON.stringify(mealPlans));
  }

  function openPanel(title, html) {
    sidePanelTitle.textContent = title;
    sidePanelContent.innerHTML = html;
    sidePanel.classList.add("active");
    sidebarOverlay.classList.add("active");
  }

  function closePanel() {
    sidePanel.classList.remove("active");
    sidebarOverlay.classList.remove("active");
  }

  closePanelBtn.addEventListener("click", closePanel);
  sidebarOverlay.addEventListener("click", closePanel);

  favoritesBtn.addEventListener("click", () => {
  renderFavoritesPanel();
});

function renderFavoritesPanel() {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];

  const html = favs.length ? `
    <div class="panel-list">
      ${favs.map((item, index) => `
        <div class="panel-item d-flex gap-2 align-items-center">
          <img
            src="${item.image}"
            alt="${item.title}"
            style="width:54px;height:54px;object-fit:cover;border-radius:12px;flex-shrink:0;"
          />
          <div style="flex:1;min-width:0;">
            <p style="margin:0;font-size:13px;font-weight:600;line-height:1.3;">${item.title}</p>
            <p style="margin:0;font-size:11px;color:var(--color-muted,#6f6258);">⏱ ${item.readyInMinutes} min · 🍽 ${item.servings} servings</p>
          </div>
          <button
            onclick="removeFavorite(${index})"
            style="border:none;background:transparent;color:#c0392b;font-size:1.1rem;cursor:pointer;flex-shrink:0;"
            title="Remove"
          >🗑</button>
        </div>
      `).join("")}
    </div>
  ` : `<div class="panel-empty">No favorites yet. Save a recipe to see it here.</div>`;

  openPanel("Favorites", html);
}

function removeFavorite(index) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  favs.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favs));
  renderFavoritesPanel();
}

  shoppingBtn.addEventListener("click", () => {
    renderShoppingPanel();
  });

  function renderShoppingPanel() {
    let list = JSON.parse(localStorage.getItem("shoppingList")) || [];

    const itemsHtml = list.length ? `
      <div class="panel-list" id="shoppingPanelList">
        ${list.map((item, index) => `
          <div class="panel-item d-flex align-items-center gap-2">
            <span style="flex:1;font-size:13px;">${item}</span>
            <button
              onclick="removeShoppingItem(${index})"
              style="border:none;background:transparent;color:#c0392b;font-size:1.1rem;cursor:pointer;flex-shrink:0;"
              title="Remove"
            >🗑</button>
          </div>
        `).join("")}
      </div>
      <div class="d-flex gap-2 mt-3">
        <button
          onclick="printShoppingList()"
          class="btn btn-main btn-sm"
          style="flex:1;"
        >🖨 Print List</button>
        <button
          onclick="clearShoppingList()"
          style="flex:1;border:1px solid rgba(160,82,45,0.25);border-radius:18px;background:transparent;color:var(--color-accent);font-size:0.85rem;font-weight:600;padding:0.45rem 0.75rem;cursor:pointer;"
        >✕ Clear All</button>
      </div>
    ` : `<div class="panel-empty">Your shopping list is empty.<br><span style="font-size:12px;color:var(--color-muted,#6f6258);">Open a recipe modal and click 🛒 to add missing ingredients.</span></div>`;

    openPanel("Shopping List", itemsHtml);
  }

  function removeShoppingItem(index) {
    let list = JSON.parse(localStorage.getItem("shoppingList")) || [];
    list.splice(index, 1);
    localStorage.setItem("shoppingList", JSON.stringify(list));
    renderShoppingPanel();
  }

  function clearShoppingList() {
    localStorage.setItem("shoppingList", JSON.stringify([]));
    renderShoppingPanel();
  }

  function printShoppingList() {
    let list = JSON.parse(localStorage.getItem("shoppingList")) || [];

    if (list.length === 0) return;

    const printWindow = window.open("", "_blank", "width=480,height=600");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shopping List — Jenna's Recipedia</title>
          <style>
            body {
              font-family: Georgia, serif;
              padding: 2rem;
              max-width: 420px;
              margin: 0 auto;
              color: #2a211c;
            }
            h2 {
              font-size: 1.4rem;
              margin-bottom: 0.25rem;
            }
            p.sub {
              font-size: 0.8rem;
              color: #6f6258;
              margin-bottom: 1.5rem;
            }
            ul {
              list-style: none;
              padding: 0;
            }
            li {
              padding: 0.5rem 0;
              border-bottom: 1px solid #e8e0d8;
              display: flex;
              align-items: center;
              gap: 0.75rem;
              font-size: 0.95rem;
            }
            .check {
              width: 16px;
              height: 16px;
              border: 1.5px solid #a0522d;
              border-radius: 4px;
              flex-shrink: 0;
            }
            footer {
              margin-top: 2rem;
              font-size: 0.75rem;
              color: #6f6258;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h2>Shopping List</h2>
          <p class="sub">From Jenna's Recipedia · ${new Date().toLocaleDateString()}</p>
          <ul>
            ${list.map(item => `
              <li>
                <div class="check"></div>
                ${item}
              </li>
            `).join("")}
          </ul>
          <footer>jennasrecipedia.com</footer>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  plannerBtn.addEventListener("click", () => {
    const plansHtml = mealPlans.length
      ? `<div class="panel-list">${mealPlans.map(item => `<div class="panel-item"><strong>${item.date}</strong><br>${item.recipe}</div>`).join("")}</div>`
      : `<div class="panel-empty">No meals planned yet.</div>`;

    const formHtml = `
      ${plansHtml}
      <form class="plan-form" id="mealPlanForm">
        <input type="text" id="mealRecipeInput" class="form-control" placeholder="Recipe name" />
        <input type="date" id="mealDateInput" class="form-control" />
        <button type="submit">Add Plan</button>
      </form>
    `;

    openPanel("Meal Planner", formHtml);

    document.getElementById("mealPlanForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const recipe = document.getElementById("mealRecipeInput").value.trim();
      const date = document.getElementById("mealDateInput").value;

      if (!recipe || !date) return;

      mealPlans.push({ recipe, date });
      savePanels();
      plannerBtn.click();
    });
  });
}

const recipeSearchForm = document.getElementById("recipeSearchForm");
const recipeGrid = document.getElementById("recipeGrid");
const resultsCount = document.getElementById("resultsCount");

const modalRecipeTitle = document.getElementById("modalRecipeTitle");
const modalMatchScore = document.getElementById("modalMatchScore");
const modalRecipeBody = document.getElementById("modalRecipeBody");

const ingredientInput = document.getElementById("ingredientInput");
const addIngredientBtn = document.getElementById("addIngredientBtn");
const ingredientTags = document.getElementById("ingredientTags");

let selectedIngredients = [];
let pantryItems = JSON.parse(localStorage.getItem("pantryItems")) || [];

function renderPantryGrid() {
  const pantryGrid = document.getElementById("pantryGrid");
  if (!pantryGrid) return;

  if (pantryItems.length === 0) {
    pantryGrid.innerHTML = `<p class="muted-text small-note">No pantry items yet.</p>`;
    return;
  }

  pantryGrid.innerHTML = pantryItems.map((item, index) => `
    <div class="pantry-item">
      <span>${item}</span>
      <button onclick="removePantryItem(${index})" title="Remove">✕</button>
    </div>
  `).join("");
}

function removePantryItem(index) {
  pantryItems.splice(index, 1);
  localStorage.setItem("pantryItems", JSON.stringify(pantryItems));
  renderPantryGrid();
}

const addPantryBtn = document.getElementById("addPantryBtn");
const pantryInput = document.getElementById("pantryInput");

if (addPantryBtn && pantryInput) {
  addPantryBtn.addEventListener("click", function () {
    const value = pantryInput.value.trim().toLowerCase();
    if (!value) return;
    if (pantryItems.includes(value)) {
      pantryInput.value = "";
      return;
    }
    pantryItems.push(value);
    localStorage.setItem("pantryItems", JSON.stringify(pantryItems));
    pantryInput.value = "";
    renderPantryGrid();
  });

  pantryInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addPantryBtn.click();
    }
  });
}

renderPantryGrid();


function showSkeletons() {
  recipeGrid.innerHTML = Array(4).fill(`
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line btn"></div>
      </div>
    </div>
  `).join("");
}


let currentRecipes = [];

// Default filter values — must match the HTML attributes exactly
const FILTER_DEFAULTS = {
  diet: "",
  cuisine: "",
  prepTime: "10",
  calories: "100"
};

function getFilterState() {
  return {
    diet: document.getElementById("dietFilter").value,
    cuisine: document.getElementById("cuisineFilter").value.trim(),
    prepTime: document.getElementById("prepTimeFilter").value,
    calories: document.getElementById("calorieFilter").value,
  };
}

function filtersAreTouched(f) {
  return (
    f.diet !== FILTER_DEFAULTS.diet ||
    f.cuisine !== FILTER_DEFAULTS.cuisine ||
    f.prepTime !== FILTER_DEFAULTS.prepTime ||
    f.calories !== FILTER_DEFAULTS.calories
  );
}

function updateResetBtn(touched) {
  const btn = document.getElementById("resetFiltersBtn");
  if (!btn) return;
  btn.classList.toggle("visible", touched);
}

// Show reset button whenever any filter changes
["dietFilter", "cuisineFilter", "prepTimeFilter", "calorieFilter"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("change", () => updateResetBtn(filtersAreTouched(getFilterState())));
  if (el) el.addEventListener("input", () => updateResetBtn(filtersAreTouched(getFilterState())));
});

// Reset all filters back to defaults
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener("click", function () {
    document.getElementById("dietFilter").value = FILTER_DEFAULTS.diet;
    document.getElementById("cuisineFilter").value = FILTER_DEFAULTS.cuisine;
    document.getElementById("prepTimeFilter").value = FILTER_DEFAULTS.prepTime;
    document.getElementById("calorieFilter").value = FILTER_DEFAULTS.calories;
    updateResetBtn(false);
  });
}


if (recipeSearchForm) {
  recipeSearchForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    await fetchRecipes();
  });
}

let currentOffset = 0;
const PAGE_SIZE = 8;

async function fetchRecipes(append = false) {
  if (!append) currentOffset = 0;

  const diet = document.getElementById("dietFilter").value;
  const cuisine = document.getElementById("cuisineFilter").value.trim();
  const maxReadyTime = document.getElementById("prepTimeFilter").value;
  const maxCalories = document.getElementById("calorieFilter").value;

  const allIngredients = [...selectedIngredients, ...pantryItems];

  // Detect if any filter has been touched
  const currentFilters = getFilterState();
  const filtersActive = filtersAreTouched(currentFilters);

  // Block search if no ingredients and no filters
  if (allIngredients.length === 0 && !filtersActive) {
    recipeGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:2rem;">
        <p class="muted-text">Add at least one ingredient to search, or use the filters to browse.</p>
      </div>`;
    resultsCount.textContent = "";
    return;
  }

  if (!append) {
    showSkeletons();
    resultsCount.textContent = "Searching...";
  }

  try {
    let url = "";

    if (filtersActive) {
      const params = new URLSearchParams({
        apiKey: SPOONACULAR_KEY,
        number: PAGE_SIZE,
        offset: currentOffset,
        addRecipeInformation: true,
        fillIngredients: true,
      });

      if (allIngredients.length > 0)              params.append("includeIngredients", allIngredients.join(","));
      if (currentFilters.diet)                    params.append("diet", currentFilters.diet);
      if (currentFilters.cuisine)                 params.append("cuisine", currentFilters.cuisine);
      if (currentFilters.prepTime !== FILTER_DEFAULTS.prepTime) params.append("maxReadyTime", currentFilters.prepTime);
      if (currentFilters.calories !== FILTER_DEFAULTS.calories) params.append("maxCalories", currentFilters.calories);

      url = `https://api.spoonacular.com/recipes/complexSearch?${params}`;

    } else {
      // Ingredient search — findByIngredients gives match score + missed ingredients
      const params = new URLSearchParams({
        apiKey: SPOONACULAR_KEY,
        ingredients: allIngredients.join(","),
        number: PAGE_SIZE,
        offset: currentOffset,
        ranking: 1,
        ignorePantry: false,
      });

      url = `https://api.spoonacular.com/recipes/findByIngredients?${params}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    console.log("Search mode:", filtersActive ? "complexSearch" : "findByIngredients");
    console.log("Data:", data);

    // findByIngredients returns an array directly, complexSearch returns {results:[]}
    const results = Array.isArray(data) ? data : data.results;

    if (!results || results.length === 0) {
      if (!append) {
        recipeGrid.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:2rem;">
            <p class="muted-text">No recipes found. Try different ingredients or adjust your filters.</p>
          </div>`;
        resultsCount.textContent = "0 recipes found";
      }
      document.getElementById("loadMoreBtn").classList.add("d-none");
      return;
    }

    if (append) {
      currentRecipes = [...currentRecipes, ...results];
    } else {
      currentRecipes = results;
    }

    renderRecipes(results, append);

  } catch (error) {
    console.error("Fetch error:", error);
    recipeGrid.innerHTML = `<p class="muted-text">Something went wrong. Please try again.</p>`;
    resultsCount.textContent = "Search failed";
  }
}

const loadMoreBtn = document.getElementById("loadMoreBtn");
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", function () {
    currentOffset += PAGE_SIZE;
    fetchRecipes(true);
  });
}





function renderRecipes(recipes, append = false) {
  if (!append) recipeGrid.innerHTML = "";

  if (recipes.length === 0 && !append) {
    recipeGrid.innerHTML = `<p>No recipes found.</p>`;
    resultsCount.textContent = "0 recipes found";
    document.getElementById("loadMoreBtn").classList.add("d-none");
    return;
  }

  const startIndex = append ? recipeGrid.querySelectorAll(".recipe-card").length : 0;

  recipes.forEach((recipe, index) => {
    const missingIngredients = recipe.missedIngredients
      ? recipe.missedIngredients.map(item => item.name).join(", ")
      : "None";

    recipeGrid.innerHTML += `
      <article class="recipe-card" style="animation-delay:${index * 0.08}s">
        <img src="${recipe.image}" alt="${recipe.title}">
        <div class="recipe-card-body">
          <h3>${recipe.title}</h3>
          <p class="match-score">
            ${recipe.usedIngredientCount != null
              ? `✓ ${recipe.usedIngredientCount} matched · ${recipe.missedIngredientCount ?? 0} missing`
              : ""}
          </p>
          <button
            class="btn btn-main btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#recipeModal"
            onclick="openRecipeModal(${startIndex + index})"
          >
            View Recipe
          </button>
        </div>
      </article>
    `;
  });

  const total = append
    ? recipeGrid.querySelectorAll(".recipe-card").length
    : recipes.length;
  resultsCount.textContent = `${total} recipe(s) found`;

  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (recipes.length === PAGE_SIZE) {
    loadMoreBtn.classList.remove("d-none");
  } else {
    loadMoreBtn.classList.add("d-none");
  }
}
function openRecipeModal(index) {
  const recipe = currentRecipes[index];

  modalRecipeTitle.textContent = recipe.title;
  modalMatchScore.textContent = `Ready In: ${recipe.readyInMinutes || "--"} mins`;

  const ingredientsHtml = recipe.extendedIngredients
    ? recipe.extendedIngredients.map(item => `<li>${item.original}</li>`).join("")
    : "<li>No ingredients found.</li>";

  const hasInstructions = recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0;
  const allSteps = hasInstructions ? recipe.analyzedInstructions[0].steps : [];
  const previewSteps = allSteps.slice(0, 3);

  const instructionsHtml = previewSteps.length > 0
    ? previewSteps.map((step, i) => `<li>${step.step}</li>`).join("")
    : null;

  const missingIngredients = recipe.missedIngredients
    ? recipe.missedIngredients.map(item => item.name).join(", ")
    : "None";

  modalRecipeBody.innerHTML = `
    <img class="modal-hero-img" src="${recipe.image}" alt="${recipe.title}" />

    <div class="recipe-detail-grid mt-4">
      <div>
        <p><strong>Cook Time:</strong> ${recipe.readyInMinutes || "--"} mins</p>
        <p><strong>Servings:</strong> ${recipe.servings || "--"}</p>
      </div>

      <div>
        <p><strong>Used Ingredients:</strong> ${recipe.usedIngredientCount ?? 0}</p>
        <p><strong>Missing Ingredients:</strong> ${missingIngredients}</p>
      </div>
    </div>

    <div class="mt-4">
      <h4>Ingredients</h4>
      <ul>${ingredientsHtml}</ul>
    </div>

    <div class="mt-4">
      <h4>Instructions</h4>
      ${instructionsHtml
        ? `<ol>${instructionsHtml}</ol>
           ${allSteps.length > 3
             ? `<p class="small-note mt-2" style="font-style:italic;">
                  Showing 3 of ${allSteps.length} steps —
                  <a href="cook.html?id=${recipe.id}" style="color:var(--color-accent);font-weight:600;">
                    Open Cook Mode for the full guide →
                  </a>
                </p>`
             : ""
           }`
        : `<p class="small-note">No instructions available for this recipe.
             <a href="cook.html?id=${recipe.id}" style="color:var(--color-accent);font-weight:600;">
               Try Cook Mode →
             </a>
           </p>`
      }
    </div>

    <div class="modal-action-bar mt-4 d-flex gap-2 flex-wrap">
      <button class="btn btn-main btn-sm" onclick="addToFavorites(${recipe.id})">♥ Save</button>
      <button class="btn btn-main btn-sm" onclick="addToShoppingList(${recipe.id})">🛒 Shopping List</button>
      <a class="btn btn-main btn-sm" href="cook.html?id=${recipe.id}">🍳 Cook Mode</a>
    </div>
  `;
}

function addToFavorites(id) {
  const recipe = currentRecipes.find(r => r.id === id);
  if (!recipe) return;

  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  const exists = favs.some(f => f.id === id);

  if (exists) {
    alert(`"${recipe.title}" is already saved.`);
    return;
  }

  favs.push({
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    servings: recipe.servings
  });

  localStorage.setItem("favorites", JSON.stringify(favs));
  alert(`"${recipe.title}" saved to favorites!`);
}

function addToShoppingList(id) {
  const recipe = currentRecipes.find(r => r.id === id);
  if (!recipe) return;

  const missing = recipe.missedIngredients
    ? recipe.missedIngredients.map(i => i.name)
    : [];

  if (missing.length === 0) {
    alert("No missing ingredients to add.");
    return;
  }

  let list = JSON.parse(localStorage.getItem("shoppingList")) || [];
  missing.forEach(item => {
    if (!list.includes(item)) list.push(item);
  });

  localStorage.setItem("shoppingList", JSON.stringify(list));
  alert(`${missing.length} ingredient(s) added to your shopping list.`);
}

function renderIngredients() {
  ingredientTags.innerHTML = "";

  selectedIngredients.forEach((ingredient, index) => {
    ingredientTags.innerHTML += `
      <span class="ingredient-pill">
        ${ingredient}
        <button type="button" onclick="removeIngredient(${index})">&times;</button>
      </span>
    `;
  });
}

function removeIngredient(index) {
  selectedIngredients.splice(index, 1);
  renderIngredients();
}

addIngredientBtn.addEventListener("click", function () {
  const value = ingredientInput.value.trim().toLowerCase();

  if (value === "") return;
  if (selectedIngredients.includes(value)) {
    ingredientInput.value = "";
    return;
  }

  selectedIngredients.push(value);
  ingredientInput.value = "";
  renderIngredients();
});

ingredientInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addIngredientBtn.click();
  }
});