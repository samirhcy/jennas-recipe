const ABOUT_API_KEY = "9b11bc4e20ba49f484a7d2740b8650c7";

//  Navbar scroll pill
const nav = document.querySelector(".custom-navbar");
window.addEventListener("scroll", function () {
  if (window.scrollY > 80) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// Scroll progress bar 
const progressBar = document.getElementById("scroll-progress");
window.addEventListener("scroll", function () {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (scrolled / total) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + "%";
});

// Scroll reveal 
const revealEls = document.querySelectorAll(".scroll-reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Featured Recipes — findByIngredients 
async function loadFeaturedRecipes() {
  const container = document.getElementById("recipeCards");
  if (!container) return;

  container.innerHTML = `<div class="col-12 text-center" style="color:var(--color-muted);padding:2rem;">Loading recipes...</div>`;

  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=chicken,garlic,tomato&number=3&ranking=1&apiKey=${ABOUT_API_KEY}`
    );
    const recipes = await res.json();
    if (!Array.isArray(recipes)) {
        console.warn("API response:", recipes);
        container.innerHTML = `<div class="col-12 text-center" style="color:var(--color-muted);padding:2rem;">Could not load recipes right now.</div>`;
        return;
    }


    if (!recipes || recipes.length === 0) {
      container.innerHTML = `<div class="col-12 text-center" style="color:var(--color-muted);">No recipes found.</div>`;
      return;
    }

    container.innerHTML = recipes.map(recipe => `
      <div class="col-md-4 scroll-reveal reveal-up">
        <div class="about-recipe-card">
          <img src="${recipe.image}" alt="${recipe.title}" />
          <div class="about-recipe-card-body">
            <h5>${recipe.title}</h5>
            <p>✓ ${recipe.usedIngredientCount} matched · ${recipe.missedIngredientCount} missing</p>
            <a href="recipe.html" class="btn-blog-read mt-2">Find Similar →</a>
          </div>
        </div>
      </div>
    `).join("");

    // Re-observe newly added elements
    container.querySelectorAll(".scroll-reveal").forEach(el => revealObserver.observe(el));

  } catch (err) {
    console.error("Recipe load error:", err);
    container.innerHTML = `<div class="col-12 text-center" style="color:var(--color-muted);">Could not load recipes.</div>`;
  }
}

loadFeaturedRecipes();

//  Blog Article Data — Jenna's voice 
const blogArticles = [
  {
    id: "habits",
    label: "Tips",
    title: "Simple Cooking Habits That Changed Everything",
    image: "./images/blog.jpg",
    excerpt: "Small shifts in how I approach the kitchen every day.",
    body: `
      <p>I used to think great cooking required talent. Turns out, it mostly requires a few small habits practiced consistently.</p>
      <p>The first thing I changed was mise en place — a French term that just means "everything in its place." Before I turn on a single burner, I have every ingredient measured, chopped, and ready to go. It sounds fussy but it removes the chaos. You stop burning garlic while frantically peeling onions.</p>
      <p>The second habit was tasting constantly. I used to follow recipes like instruction manuals and plate whatever came out. Now I taste at every stage. A pinch of salt mid-cook, a squeeze of lemon at the end — these small adjustments are what separate good food from food that makes people go quiet at the table.</p>
      <p>Third: clean as you go. This one is less romantic but it matters. A clean workspace keeps your head clear. Cooking in a cluttered kitchen is like trying to think in a noisy room.</p>
      <p>None of these habits cost anything. They just take a little intention. And once they're automatic, cooking stops feeling like a chore and starts feeling like yours.</p>
    `
  },
  {
    id: "seasonal",
    label: "Seasonal",
    title: "Why I Stopped Fighting the Season",
    image: "./images/news.jpg",
    excerpt: "Cooking with what's actually ripe changes everything about flavor.",
    body: `
      <p>There was a period where I tried to cook strawberry desserts in November and roasted squash in July. The results were technically fine. They were also hollow — missing that quality I couldn't name until I stopped doing it.</p>
      <p>Seasonal cooking isn't a trend. It's just the way food works. A tomato in August picked at peak ripeness has a sweetness that a January hothouse tomato, shipped across the country, simply cannot replicate. The water content is different. The sugar is different. The smell when you slice it is different.</p>
      <p>My rule now is simple: I walk through the farmers market or the produce section first and let what looks alive determine the menu. Not the other way around.</p>
      <p>Spring means asparagus, peas, and fresh herbs. Summer is tomatoes, zucchini, corn, and stone fruit. Fall brings squash, apples, sweet potatoes, and mushrooms. Winter is citrus, root vegetables, and hearty greens.</p>
      <p>When you cook with the season, you stop forcing flavor into food and start releasing what's already there. That's when cooking gets genuinely easy.</p>
    `
  },
  {
    id: "newmeals",
    label: "Recipes",
    title: "How I Find a New Recipe When I Have No Idea What to Cook",
    image: "./images/browse.gif",
    excerpt: "A practical method for breaking out of the same five dinners.",
    body: `
      <p>We all have a rotation. Mine used to be: pasta, stir fry, tacos, soup, repeat. For years. I wasn't unhappy exactly — but I wasn't excited either.</p>
      <p>The thing that broke me out of it wasn't a cookbook or a cooking class. It was a constraint. I started challenging myself to use whatever was already in my pantry and refrigerator before buying anything new.</p>
      <p>This forced creativity in a way that open-ended browsing never did. When you have half a can of coconut milk, leftover rotisserie chicken, a lime, and some rice noodles, you stop asking "what do I feel like" and start asking "what can I actually make." The answer is usually something you'd never have planned.</p>
      <p>The other method I rely on is what I call the anchor ingredient. Pick one thing — a protein, a vegetable, a sauce — and search everything around that. If I have a piece of salmon I need to use, I'm not looking for "dinner ideas." I'm looking for every interesting thing that's ever been done with salmon. That specificity produces better results than broad searching every time.</p>
      <p>Cooking new things regularly isn't about ambition. It's about staying curious. And curiosity, in the kitchen, is the best ingredient.</p>
    `
  },
  {
    id: "behind",
    label: "Kitchen Notes",
    title: "The Recipes That Didn't Come From the Internet",
    image: "./images/meet.jpg",
    excerpt: "Some recipes have history. These are the ones that matter most to me.",
    body: `
      <p>My grandmother never measured anything. She'd hold a handful of flour over the bowl, look at it for a second, then let it fall. I used to watch her and think she was being careless. I know now she was being precise in a way that no measuring cup can capture — decades of muscle memory, of feel, of knowing.</p>
      <p>She passed before I was old enough to cook seriously. I never asked her to write anything down. That's one of my great regrets.</p>
      <p>What I have instead are approximations. My mother's versions of her mother's recipes. My own versions of those. Each generation adjusts slightly — a little more garlic, a different fat, a change in technique because the equipment changed. The dish drifts. But something essential stays.</p>
      <p>This is why I started Jenna's Recipedia. Not to replace the handwritten card in a recipe box or the thing your aunt makes every Thanksgiving. But to give people a place to explore, to find the recipe that might become theirs over time.</p>
      <p>The best recipes aren't followed. They're eventually memorized, then ignored, then made from instinct. That's the goal. That's when a recipe becomes a meal that belongs to you.</p>
    `
  }
];

// Blog Modal Logic
const backdrop = document.getElementById("aboutModalBackdrop");
const modal = document.getElementById("aboutArticleModal");
const modalClose = document.getElementById("aboutModalClose");

function openBlogModal(id) {
  const article = blogArticles.find(a => a.id === id);
  if (!article) return;

  document.getElementById("aboutModalImg").src = article.image;
  document.getElementById("aboutModalLabel").textContent = article.label;
  document.getElementById("aboutModalTitle").textContent = article.title;
  document.getElementById("aboutModalBody").innerHTML = article.body;

  backdrop.classList.add("active");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeBlogModal() {
  backdrop.classList.remove("active");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

if (modalClose) modalClose.addEventListener("click", closeBlogModal);
if (backdrop) backdrop.addEventListener("click", closeBlogModal);
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeBlogModal();
});

//  Newsletter preference pills
document.querySelectorAll(".about-pref-pill").forEach(pill => {
  pill.addEventListener("click", function () {
    document.querySelectorAll(".about-pref-pill").forEach(p => p.classList.remove("selected"));
    this.classList.add("selected");
  });
});