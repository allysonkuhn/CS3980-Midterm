from pydantic import BaseModel

# Define data models for recipes using Pydantic's BaseModel
class Recipe(BaseModel):
    id: int
    title: str
    ingredients: str
    instructions: str

# Define a separate model for recipe creation requests, which does not include the ID field since it will be generated automatically
class RecipeRequest(BaseModel):
    title: str
    ingredients: str
    instructions: str