from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from recipe_routes import recipe_router

app = FastAPI(title="Recipe App", version="1.0.0")

@app.get("/")
async def home():
    return FileResponse("frontend/index.html")

app.include_router(recipe_router, tags=["Recipes"], prefix="/recipes")

app.mount("/", StaticFiles(directory="frontend"), name="static")
