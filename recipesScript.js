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

    const imageFile = document.getElementById("recipeImage").files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const imageUrl = e.target.result; // base64 image data

        // Create the new recipe column and content structure
        const column = document.createElement("div");
        column.className = "column";

        const content = document.createElement("div");
        content.className = "content";
        content.dataset.category = tags.join(" ");
        content.onclick = () => showPopup(`popup${name.replace(/\s+/g, '')}`);
        
        content.innerHTML = `
            <img src="${imageUrl}" alt="${name}" style="width:100%">
            <h3>${name}</h3>
            <p>${ingredients}</p>
        `;

        column.appendChild(content);
        document.querySelector(".row").prepend(column);

        const popup = document.createElement("div");
        popup.id = `popup${name.replace(/\s+/g, '')}`;
        popup.className = "popup";
        popup.innerHTML = `
            <div class="popup-content">
                <span class="close" onclick="hidePopup('${popup.id}')">&times;</span>
                <h2>${name}</h2>
                <img src="${imageUrl}" alt="${name}" style="width:100%">
                <h3>Ingredients:</h3>
                <p>${ingredients}</p>
                <h3>Instructions:</h3>
                <p>${instructions}</p>
            </div>
        `;

        document.body.appendChild(popup);
        hideRecipeForm();
        document.getElementById("recipeForm").reset();
    };

    if (imageFile) {
        reader.readAsDataURL(imageFile);
    }
}