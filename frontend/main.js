// Define the API endpoint and initialize variables to hold recipe data and the ID of the recipe being edited
const API = 'http://127.0.0.1:8000/recipes';
let data = [];
let editingId = null;

// Open the form to add a new recipe
function openForm() {
  document.getElementById('form-card').style.display = 'block';
  document.getElementById('add-recipe-btn').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close the form and reset to default state
function closeForm() {
  document.getElementById('form-card').style.display = 'none';
  document.getElementById('add-recipe-btn').style.display = 'inline-block';
}

// Handle form submission for both adding and editing recipes
function submitRecipe() {
  const title = document.getElementById('title').value.trim();
  const ingredients = document.getElementById('ingredients').value.trim();
  const instructions = document.getElementById('instructions').value.trim();

  // Validate that all fields are filled
  if (!title || !ingredients || !instructions) {
    alert('Please fill in all fields before saving.');
    return;
  }

  // Prepare the data to be sent to the server
  const body = JSON.stringify({ title, ingredients, instructions });

  // If editingId is set, we are updating an existing recipe; otherwise, we are creating a new one
  if (editingId) {
    const xhr = new XMLHttpRequest();

    // When the server responds, update the local data and re-render the recipes
    xhr.onload = () => {
      if (xhr.status === 200) {
        const updated = JSON.parse(xhr.response);
        const recipe = data.find((x) => x.id == editingId);
        recipe.title = updated.title;
        recipe.ingredients = updated.ingredients;
        recipe.instructions = updated.instructions;
        editingId = null;
        clearForm();
        closeForm();
        renderRecipes();
      }
    };

    // Send a PUT request to update the existing recipe
    xhr.open('PUT', API + '/' + editingId, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(body);
  } else {
    const xhr = new XMLHttpRequest();

    // When the server responds, add the new recipe to the local data and re-render the recipes
    xhr.onload = () => {
      if (xhr.status === 201) {
        const newRecipe = JSON.parse(xhr.response);
        data.push(newRecipe);
        clearForm();
        closeForm();
        renderRecipes();
      }
    };

    // Send a POST request to create a new recipe
    xhr.open('POST', API, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(body);
  }
}

// Send a DELETE request to remove a recipe by its ID
function deleteRecipe(id) {
  const xhr = new XMLHttpRequest();

  // When the server responds, remove the recipe from the local data and re-render the recipes
  xhr.onload = () => {
    if (xhr.status === 200) {
      data = data.filter((x) => x.id != id);
      renderRecipes();
    }
  };

  // Send a DELETE request to the server to delete the recipe
  xhr.open('DELETE', API + '/' + id, true);
  xhr.send();
}

// Open the form to edit an existing recipe and populate it with the current recipe data
function startEdit(id) {
  const recipe = data.find((x) => x.id == id);
  editingId = id;
  document.getElementById('title').value = recipe.title;
  document.getElementById('ingredients').value = recipe.ingredients;
  document.getElementById('instructions').value = recipe.instructions;
  document.getElementById('form-title').textContent = 'Edit Recipe';
  openForm();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cancel the editing process, reset the form, and close it
function cancelEdit() {
  editingId = null;
  clearForm();
  closeForm();
}

// Clear the form fields and reset the form title to the default state
function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('ingredients').value = '';
  document.getElementById('instructions').value = '';
  document.getElementById('form-title').textContent = 'Add a New Recipe';
}

// Render the list of recipes on the page, showing a message if there are no recipes
function renderRecipes() {
  const list = document.getElementById('recipe-list');
  const empty = document.getElementById('no-recipes');
  list.innerHTML = '';

  // If there are no recipes, show the "No recipes found" message and return early
  if (data.length === 0) {
    empty.style.display = 'block';
    return;
  }

  // If there are recipes, hide the "No recipes found" message and render each recipe as a card
  empty.style.display = 'none';
  data.sort((a, b) => b.id - a.id).forEach((x) => {
    list.innerHTML += `
      <div id="recipe-${x.id}" class="recipe-card">
        <h3>${x.title}</h3>
        <div class="field-label">Ingredients</div>
        <div class="field-value">${x.ingredients}</div>
        <div class="field-label">Instructions</div>
        <div class="field-value">${x.instructions}</div>
        <div class="card-actions">
          <button class="btn btn-edit" onclick="startEdit(${x.id})">Edit</button>
          <button class="btn btn-delete" onclick="deleteRecipe(${x.id})">Delete</button>
        </div>
      </div>
    `;
  });
}

// Fetch all recipes from the server and render them on the page
function getAllRecipes() {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      data = JSON.parse(xhr.response) || [];
      renderRecipes();
    }
  };

  // Send a GET request to the server to retrieve all recipes
  xhr.open('GET', API, true);
  xhr.send();
}

// When the page loads, fetch all recipes from the server and render them on the page
(() => {
  getAllRecipes();
})();