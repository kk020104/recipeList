function filterRecipes(category) {
    const recipes = document.querySelectorAll('.content');
    recipes.forEach(recipe => {
        const recipeCategories = recipe.getAttribute('data-category');
        if (category === 'all' || recipeCategories.includes(category)) {
            recipe.parentElement.style.display = 'block'; // Show column
        } else {
            recipe.parentElement.style.display = 'none'; // Hide column
        }
    });

    // Update active tab button style
    document.querySelectorAll('.tabButton').forEach(button => button.classList.remove('active'));
    document.querySelector(`.tabButton[onclick="filterRecipes('${category}')"]`).classList.add('active');
}

function showPopup(id) {
    document.getElementById(id).style.display = "block";
}

function hidePopup(id) {
    document.getElementById(id).style.display = "none";
}

document.getElementById("searchButton").addEventListener("click", searchRecipes);

function searchRecipes() {
    const input = document.getElementById("itemInput").value.toLowerCase();
    const recipes = document.querySelectorAll(".column");

    recipes.forEach(recipe => {
        const title = recipe.querySelector("h3").innerText.toLowerCase();
        if (title.includes(input)) {
            recipe.style.display = "block";
        } else {
            recipe.style.display = "none";
        }
    });
}

function addToShoppingFromRecipe(name, amt, unit) {
    const savedList = localStorage.getItem("shoppingList");
    let shoppingList = savedList ? JSON.parse(savedList) : [];

    const existingItem = shoppingList.find(item => item.name.toLowerCase() === name.toLowerCase());
    if (existingItem) {
        existingItem.quantity += amt;
    } else {
        shoppingList.push({ name: name, quantity: amt, unit: unit });
    }

    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    window.location.href = "shopping.html";
}

document.getElementById("addButton").addEventListener("click", showRecipeForm);

function showRecipeForm() {
    document.getElementById("recipeFormPopup").style.display = "block";
}

function hideRecipeForm() {
    document.getElementById("recipeFormPopup").style.display = "none";
}

function addRecipe() {
    const name = document.getElementById("recipeName").value;
    const ingredients = document.getElementById("recipeIngredients").value;
    const instructions = document.getElementById("recipeInstructions").value;
    const tags = document.getElementById("recipeTags").value.split(',').map(tag => tag.trim());
    const imageUrl = document.getElementById("recipeImage").value || "food/default.jpg"; // Adjust path if needed

    // Create the new recipe column and content structure
    const column = document.createElement("div");
    column.className = "column"; // Use the same class as hardcoded recipes

    const content = document.createElement("div");
    content.className = "content";
    content.dataset.category = tags.join(" ");
    content.onclick = () => showPopup(`popup${name.replace(/\s+/g, '')}`);

    content.innerHTML = `
        <img src="${imageUrl}" alt="${name}" style="width:100%">
        <h3>${name}</h3>
        <p>${ingredients}</p>
    `;

    // Append the content to the column
    column.appendChild(content);

    // Insert the new column at the start of the recipe list (to appear at the top)
    document.querySelector(".row").prepend(column);

    // Create and add the popup for the new recipe
    const popup = document.createElement("div");
    popup.id = `popup${name.replace(/\s+/g, '')}`;
    popup.className = "popup";

    popup.innerHTML = `
        <div class="popup-content">
            <span class="close" onclick="hidePopup('${popup.id}')">&times;</span>
            <h2>${name}</h2>
            <h3>Ingredients:</h3>
            <p>${ingredients}</p>
            <h3>Instructions:</h3>
            <p>${instructions}</p>
        </div>
    `;

    document.body.appendChild(popup);

    // Hide the form and reset it
    hideRecipeForm();
    document.getElementById("recipeForm").reset();
}

function addRecipe() {
    const name = document.getElementById("recipeName").value;
    const ingredients = document.getElementById("recipeIngredients").value;
    const instructions = document.getElementById("recipeInstructions").value;
    const tags = document.getElementById("recipeTags").value.split(',').map(tag => tag.trim());

    const imageFile = document.getElementById("recipeImage").files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const imageUrl = e.target.result;

        const newRecipe = {
            name: name,
            ingredients: ingredients,
            instructions: instructions,
            tags: tags,
            imageUrl: imageUrl
        };

        // Save to localStorage
        let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
        recipes.push(newRecipe);
        localStorage.setItem("recipes", JSON.stringify(recipes));

        // Display the recipe in the UI
        displayRecipe(newRecipe);
        hideRecipeForm();
        document.getElementById("recipeForm").reset();
    };

    if (imageFile) {
        reader.readAsDataURL(imageFile);
    }
}

function addRecipe() {
    const name = document.getElementById("recipeName").value;
    const ingredients = document.getElementById("recipeIngredients").value;
    const instructions = document.getElementById("recipeInstructions").value;
    const tags = document.getElementById("recipeTags").value.split(',').map(tag => tag.trim());

    const imageFile = document.getElementById("recipeImage").files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const imageUrl = e.target.result;

        const newRecipe = {
            name: name,
            ingredients: ingredients,
            instructions: instructions,
            tags: tags,
            imageUrl: imageUrl
        };

        // Save to localStorage
        let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
        recipes.push(newRecipe);
        localStorage.setItem("recipes", JSON.stringify(recipes));

        // Display the recipe in the UI
        displayRecipe(newRecipe);
        hideRecipeForm();
        document.getElementById("recipeForm").reset();
    };

    if (imageFile) {
        reader.readAsDataURL(imageFile);
    }
}

// Helper function to display a recipe in the UI
function displayRecipe(recipe) {
    const column = document.createElement("div");
    column.className = "column";

    const content = document.createElement("div");
    content.className = "content";
    content.dataset.category = recipe.tags.join(" ");
    content.onclick = () => showPopup(`popup${recipe.name.replace(/\s+/g, '')}`);

    content.innerHTML = `
        <img src="${recipe.imageUrl}" alt="${recipe.name}" style="width:100%">
        <h3>${recipe.name}</h3>
        <p>${recipe.ingredients}</p>
    `;

    column.appendChild(content);
    document.querySelector(".row").prepend(column);

    const popup = document.createElement("div");
    popup.id = `popup${recipe.name.replace(/\s+/g, '')}`;
    popup.className = "popup";
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close" onclick="hidePopup('${popup.id}')">&times;</span>
            <h2>${recipe.name}</h2>
            <img src="${recipe.imageUrl}" alt="${recipe.name}" style="width:100%">
            <h3>Ingredients:</h3>
            <p>${recipe.ingredients}</p>
            <h3>Instructions:</h3>
            <p>${recipe.instructions}</p>
        </div>
    `;

    document.body.appendChild(popup);
}

function loadRecipes() {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes.forEach(recipe => displayRecipe(recipe));
}

window.onload = loadRecipes;


