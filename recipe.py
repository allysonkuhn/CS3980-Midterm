from pydantic import BaseModel

class Recipe(BaseModel):
    id: int
    title: str
    ingredients: str
    instructions: str

class RecipeRequest(BaseModel):
    title: str
    ingredients: str
    instructions: str