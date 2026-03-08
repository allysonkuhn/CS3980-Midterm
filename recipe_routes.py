from typing import Annotated

from fastapi import APIRouter, HTTPException, Path, status

from recipe import Recipe, RecipeRequest

recipe_router = APIRouter()

recipe_list = []
global_id = 0


@recipe_router.get("")
async def get_all_recipes() -> list[Recipe]:
    return recipe_list


@recipe_router.post("", status_code=201)
async def create_new_recipe(recipe: RecipeRequest) -> Recipe:
    global global_id  
    global_id += 1
    new_recipe = Recipe(id=global_id, title=recipe.title, ingredients=recipe.ingredients, instructions=recipe.instructions)
    recipe_list.append(new_recipe)
    return new_recipe


@recipe_router.put("/{id}")
async def edit_recipe_by_id(
    id: Annotated[int, Path(gt=0, le=1000)], recipe: RecipeRequest
) -> Recipe:
    for x in recipe_list:
        if x.id == id:
            x.title = recipe.title
            x.ingredients = recipe.ingredients
            x.instructions = recipe.instructions
            return x

    raise HTTPException(status_code=404, detail=f"Item with ID={id} is not found.")


@recipe_router.get("/{id}")
async def get_recipe_by_id(id: Annotated[int, Path(gt=0, le=1000)]) -> Recipe:
    for recipe in recipe_list:
        if recipe.id == id:
            return recipe

    raise HTTPException(status_code=404, detail=f"Item with ID={id} is not found.")


@recipe_router.delete("/{id}")
async def delete_recipe_by_id(
    id: Annotated[
        int,
        Path(
            gt=0,
            le=1000,
            title="This is the ID for the desired Recipe Item to be deleted",
        ),
    ],
) -> dict:
    for i in range(len(recipe_list)):
        recipe = recipe_list[i]
        if recipe.id == id:
            recipe_list.pop(i)
            return {"msg": f"The recipe with ID={id} is deleted."}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with ID={id} is not found."
    )