const SPOONACULAR_KEY = "9b11bc4e20ba49f484a7d2740b8650c7";

// Wait for the page to fully load before running anything
$(document).ready(function () {   

  // OVERLAY MODAL (Surprise Me)

  let activeModal = null; // tracks which modal is currently open

  // When any trigger button is clicked
  $(".modal-trigger").on("click", function (e) {
    e.preventDefault();

    const targetId = $(this).data("target");
    activeModal = $("#" + targetId);

    activeModal.addClass("active");
    $("#modal-backdrop").addClass("active");

    // Showing the loading state, hide recipe content until API responds
    activeModal.find(".surprise-loading").show();
    activeModal.find(".surprise-content").hide();

    // Call the API to get a random recipe
    $.ajax({
      url: "https://api.spoonacular.com/recipes/random",
      method: "GET",
      data: {
        number: 1,
        apiKey: SPOONACULAR_KEY
      },
      success: function (data) {
        const recipe = data.recipes[0];

        // Fill in the modal fields with the recipe data
        $("#surprise-img").attr("src", recipe.image);
        $("#surprise-title").text(recipe.title);
        $("#surprise-time").text("⏱ " + recipe.readyInMinutes + " min");
        $("#surprise-servings").text("🍽 " + recipe.servings + " servings");
        $("#surprise-link").attr("href", recipe.sourceUrl);

        // The summary comes with HTML tags — strip them before displaying
        const cleanSummary = $("<div>").html(recipe.summary).text();
        $("#surprise-summary").text(cleanSummary.slice(0, 200) + "...");

        // Swap loading message for actual content
        activeModal.find(".surprise-loading").hide();
        activeModal.find(".surprise-content").show();
      },
      error: function () {
        activeModal.find(".surprise-loading").html("<p>Couldn't load a recipe. Try again!</p>");
      }
    });
  });

  // Close modal when X button is clicked
  $(".close-modal-btn").on("click", function () {
    closeModal();
  });

  // Close modal when the dark backdrop is clicked
  $("#modal-backdrop").on("click", function () {
    closeModal();
  });

  // Close modal when Escape key is pressed
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  function closeModal() {
    if (activeModal) {
      activeModal.removeClass("active");
      $("#modal-backdrop").removeClass("active");
      activeModal = null;
    }
  }

  // ── Bookmark prompt (2nd visit only, once ever) ─────
  const bookmarkEl = document.getElementById('bookmark-prompt');
  const visits = parseInt(localStorage.getItem('jenna_visits') || '0') + 1;
  localStorage.setItem('jenna_visits', visits);
  const bookmarkShown = localStorage.getItem('jenna_bookmark_shown');

  if (visits === 3 && !bookmarkShown) {
    setTimeout(() => bookmarkEl.classList.add('active'), 1500);
    localStorage.setItem('jenna_bookmark_shown', 'true');
  }

  document.getElementById('close-bookmark').addEventListener('click', () => bookmarkEl.classList.remove('active'));
  document.getElementById('bookmark-dismiss').addEventListener('click', () => bookmarkEl.classList.remove('active'));
  document.getElementById('bookmark-confirm').addEventListener('click', () => {
    alert('Press Ctrl+D (or Cmd+D on Mac) to bookmark this page!');
    bookmarkEl.classList.remove('active');
  });

  // Food Joke toast
let jokeTimer = null;

  function loadJoke() {
    let attempts = 0;

    // We try up to 5 times to find a short joke (under 180 chars)
    // Some jokes are paragraphs long : those don't fit the toast
    function tryFetch() {
      if (attempts >= 5) return; // give up after 5 tries
      attempts++;

      $.ajax({
        url: "https://api.spoonacular.com/food/jokes/random",
        method: "GET",
        data: { apiKey: SPOONACULAR_KEY },
        success: function (data) {
          console.log(data.text.length, data.text);
          if (data.text && data.text.length <= 280) {
            // Short enough — show it
            $("#joke-text").text(data.text);
            $("#joke-toast").addClass("active");
    
          } else {
            // Too long — try again
            tryFetch();
          }
        },
        error: function () {
          // Fail silently
        }
      });
    }

    tryFetch();
  }

  function scheduleJoke(delayMs) {
    clearTimeout(jokeTimer);
    jokeTimer = setTimeout(loadJoke, delayMs);
  }

  // First joke appears 3 seconds after page loads
  scheduleJoke(3000);

  // When user closes it, wait 10 seconds then show a new one
  $("#close-joke").on("click", function () {
    $("#joke-toast").removeClass("active");
    scheduleJoke(10000);
  });


//  Recipe of the Day (cached per day) 
  const today = new Date().toDateString(); // e.g. "Mon Apr 21 2026"
  const cachedRecipe = localStorage.getItem("jenna_rotd");
  const cachedDate   = localStorage.getItem("jenna_rotd_date");

  if (cachedRecipe && cachedDate === today) {
    // We already fetched today's recipe  just use the saved one
    fillROTDCard(JSON.parse(cachedRecipe));
  } else {
    // No cache or it's a new day ... fetch a fresh recipe
    $.ajax({
      url: "https://api.spoonacular.com/recipes/random",
      method: "GET",
      data: {
        number: 1,
        apiKey: SPOONACULAR_KEY
      },
      success: function (data) {
        const recipe = data.recipes[0];

        // Save to localStorage so we don't re-fetch on refresh
        localStorage.setItem("jenna_rotd", JSON.stringify(recipe));
        localStorage.setItem("jenna_rotd_date", today);

        fillROTDCard(recipe);
      },
      error: function () {
        // Placeholder content stays visible if API fails
      }
    });
  }

  function fillROTDCard(recipe) {
    $("#rotd-img").attr("src", recipe.image);
    $("#rotd-title").text(recipe.title);
    $("#rotd-back-title").text(recipe.title);
    $("#rotd-time").text("⏱ " + recipe.readyInMinutes + " min");
    $("#rotd-servings").text("🍽 " + recipe.servings + " servings");
    $("#rotd-link").attr("href", "recipe.html?id=" + recipe.id);

    // Strip HTML from summary, show first 180 characters
    const cleanSummary = $("<div>").html(recipe.summary).text();
    $("#rotd-summary").text(cleanSummary.slice(0, 180) + "...");

    // Build the ingredients list — cap at 8 items so it fits the card
    const $list = $("#rotd-ingredients").empty();
    recipe.extendedIngredients.slice(0, 8).forEach(function (ingredient) {
      $list.append("<li>" + ingredient.original + "</li>");
    });
  }

 const progressBar = document.getElementById('scroll-progress');

$(window).on('scroll', function () {
  const scrolled = $(window).scrollTop();
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  const pct      = (scrolled / total) * 100;
  progressBar.style.width = pct + '%';

  if (scrolled > 80) {
    $(".custom-navbar").addClass("scrolled");
  } else {
    $(".custom-navbar").removeClass("scrolled");
  }
});

  // Scroll Reveal
  const revealEls = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { root: null, threshold: 0.2 });

  revealEls.forEach(el => revealObserver.observe(el));

});
