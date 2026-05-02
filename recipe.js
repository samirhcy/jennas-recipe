const SPOONACULAR_KEY = "ead2c99004624a56a481d4249ca981cb";
// Scroll progress + navbar pill effect
const wrapper = document.getElementById("wrapper");
const progressBar = document.getElementById("scroll-progress");
const nav = document.querySelector(".custom-navbar");

if (wrapper && progressBar) {
  wrapper.addEventListener("scroll", function () {
    const scrolled = wrapper.scrollTop;
    const total = wrapper.scrollHeight - wrapper.clientHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    progressBar.style.width = pct + "%";

    if (scrolled > 80) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
}

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
    const html = favorites.length
      ? `<div class="panel-list">${favorites.map(item => `<div class="panel-item">${item}</div>`).join("")}</div>`
      : `<div class="panel-empty">No favorites yet.</div>`;

    openPanel("Favorites", html);
  });

  shoppingBtn.addEventListener("click", () => {
    const html = shoppingList.length
      ? `<div class="panel-list">${shoppingList.map(item => `<div class="panel-item">${item}</div>`).join("")}</div>`
      : `<div class="panel-empty">Your shopping list is empty.</div>`;

    openPanel("Shopping List", html);
  });

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
let currentRecipes = [];


if (recipeSearchForm) {
  recipeSearchForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    await fetchRecipes();
  });
}


async function fetchRecipes() {

  const diet = document.getElementById("dietFilter").value;
  const cuisine = document.getElementById("cuisineFilter").value.trim();
  const maxReadyTime = document.getElementById("prepTimeFilter").value;
  const maxCalories = document.getElementById("calorieFilter").value;

  const allIngredients = [...selectedIngredients, ...pantryItems];
  const ingredientsQuery = allIngredients.join(",");

  recipeGrid.innerHTML = `<p>Loading recipes...</p>`;
  resultsCount.textContent = "Searching...";

  try {
    const response = await fetch(
  `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_KEY}&query=${encodeURIComponent(ingredientsQuery)}&number=8&addRecipeInformation=true&fillIngredients=true`
    );

    const data = await response.json();

    console.log("status:", response.status);
    console.log("data:", data);

    if (!data.results) {
      recipeGrid.innerHTML = `<p>Could not load recipes.</p>`;
      resultsCount.textContent = "Search failed";
      return;
    }

    currentRecipes = data.results;
    renderRecipes(currentRecipes);
  } catch (error) {
    console.error(error);
    recipeGrid.innerHTML = `<p>Something went wrong.</p>`;
    resultsCount.textContent = "Search failed";
  }
}

recipeSearchForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  await fetchRecipes();
});

function renderRecipes(recipes) {
  recipeGrid.innerHTML = "";

  if (recipes.length === 0) {
    recipeGrid.innerHTML = `<p>No recipes found.</p>`;
    resultsCount.textContent = "0 recipes found";
    return;
  }

  resultsCount.textContent = `${recipes.length} recipe(s) found`;

  recipes.forEach((recipe, index) => {
    const missingIngredients = recipe.missedIngredients
      ? recipe.missedIngredients.map(item => item.name).join(", ")
      : "None";

    recipeGrid.innerHTML += `
      <article class="recipe-card" style="animation-delay:${index * 0.08}s">
        <img src="${recipe.image}" alt="${recipe.title}">
        <div class="recipe-card-body">
          <h3>${recipe.title}</h3>
          <p class="match-score">Used Ingredients: ${recipe.usedIngredientCount ?? 0}</p>
          <p class="small-note">Missing: ${missingIngredients || "None"}</p>
          <button
            class="btn btn-main btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#recipeModal"
            onclick="openRecipeModal(${index})"
          >
            View Recipe
          </button>
        </div>
      </article>
    `;
  });
}

function openRecipeModal(index) {
  const recipe = currentRecipes[index];

  modalRecipeTitle.textContent = recipe.title;
  modalMatchScore.textContent = `Ready In: ${recipe.readyInMinutes || "--"} mins`;

  const ingredientsHtml = recipe.extendedIngredients
    ? recipe.extendedIngredients.map(item => `<li>${item.original}</li>`).join("")
    : "<li>No ingredients found.</li>";

  const instructionsHtml = recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0
    ? recipe.analyzedInstructions[0].steps.map(step => `<li>${step.step}</li>`).join("")
    : "<li>No instructions found.</li>";

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
      <ol>${instructionsHtml}</ol>
    </div>
  `;
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