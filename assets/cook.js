// Cook Mode — Step 1: Data Foundation
// Reads ?id= from URL, fetches recipe info, populates the hero

const SPOONACULAR_KEY = "ead2c99004624a56a481d4249ca981cb";

// Read the recipe ID from the URL
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

// Grab the DOM targets
const titleEl = document.getElementById("cook-recipe-title");
const metaEl  = document.getElementById("cook-recipe-meta");

// Mouse parallax effect (your original cook.js logic — keeping it)
const featuresEl = document.querySelector(".features");
const featureEls = document.querySelectorAll(".feature");

if (featuresEl) {
  featuresEl.addEventListener("pointermove", (ev) => {
    featureEls.forEach((featureEl) => {
      const rect = featureEl.getBoundingClientRect();
      featureEl.style.setProperty("--x", ev.clientX - rect.left);
      featureEl.style.setProperty("--y", ev.clientY - rect.top);
    });
  });
}

// Fetch and populate
async function loadRecipe() {
  if (!recipeId) {
    if (titleEl) titleEl.textContent = "No recipe selected";
    return;
  }

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_KEY}&includeNutrition=false`
    );

    const recipe = await response.json();

    // Log the full data so you can see exactly what's available
    console.log("Cook Mode recipe data:", recipe);

    // Populate hero
    if (titleEl) titleEl.textContent = recipe.title;
    if (metaEl)  metaEl.textContent  = `⏱ ${recipe.readyInMinutes} min  ·  🍽 ${recipe.servings} servings`;

  } catch (err) {
    console.error("Failed to load recipe:", err);
    if (titleEl) titleEl.textContent = "Could not load recipe";
  }
}

loadRecipe();
