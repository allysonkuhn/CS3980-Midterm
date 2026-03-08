const API = 'http://127.0.0.1:8000/recipes';
let data = [];
let editingId = null;

function submitRecipe() {
  const title = document.getElementById('title').value.trim();
  const ingredients = document.getElementById('ingredients').value.trim();
  const instructions = document.getElementById('instructions').value.trim();

  if (!title || !ingredients || !instructions) {
    alert('Please fill in all fields before saving.');
    return;
  }

  const body = JSON.stringify({ title, ingredients, instructions });

  if (editingId) {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status === 200) {
        const updated = JSON.parse(xhr.response);
        const recipe = data.find((x) => x.id == editingId);
        recipe.title = updated.title;
        recipe.ingredients = updated.ingredients;
        recipe.instructions = updated.instructions;
        editingId = null;
        clearForm();
        renderRecipes();
      }
    };
    xhr.open('PUT', API + '/' + editingId, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(body);
  } else {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status === 201) {
        const newRecipe = JSON.parse(xhr.response);
        data.push(newRecipe);
        clearForm();
        renderRecipes();
      }
    };
    xhr.open('POST', API, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(body);
  }
}

function deleteRecipe(id) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      data = data.filter((x) => x.id != id);
      renderRecipes();
    }
  };
  xhr.open('DELETE', API + '/' + id, true);
  xhr.send();
}

function startEdit(id) {
  const recipe = data.find((x) => x.id == id);
  editingId = id;
  document.getElementById('title').value = recipe.title;
  document.getElementById('ingredients').value = recipe.ingredients;
  document.getElementById('instructions').value = recipe.instructions;
  document.getElementById('form-title').textContent = 'Edit Recipe';
  document.getElementById('cancel-btn').style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
  editingId = null;
  clearForm();
}

function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('ingredients').value = '';
  document.getElementById('instructions').value = '';
  document.getElementById('form-title').textContent = 'Add a New Recipe';
  document.getElementById('cancel-btn').style.display = 'none';
}

function renderRecipes() {
  const list = document.getElementById('recipe-list');
  const empty = document.getElementById('no-recipes');
  list.innerHTML = '';

  if (data.length === 0) {
    empty.style.display = 'block';
    return;
  }

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

function getAllRecipes() {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      data = JSON.parse(xhr.response) || [];
      renderRecipes();
    }
  };
  xhr.open('GET', API, true);
  xhr.send();
}

(() => {
  getAllRecipes();
})();