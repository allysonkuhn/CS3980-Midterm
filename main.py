from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from recipe_routes import recipe_router

# Create FastAPI application instance
app = FastAPI(title="Recipe App", version="1.0.0")

# Define a route for the home page that serves the index.html file
@app.get("/")
async def home():
    return FileResponse("frontend/index.html")

# Include the recipe router with a prefix for all recipe-related endpoints
app.include_router(recipe_router, tags=["Recipes"], prefix="/recipes")

# Mount the static files directory to serve frontend assets like CSS, JS, and images
app.mount("/", StaticFiles(directory="frontend"), name="static")
