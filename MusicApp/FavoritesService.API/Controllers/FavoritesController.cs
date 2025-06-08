using Microsoft.AspNetCore.Mvc;
using FavoritesService.API.Models;
using FavoritesService.API.Services;

namespace FavoritesService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FavoritesController : ControllerBase
{
    private readonly IFavoritesService _favoritesService;

    public FavoritesController(IFavoritesService favoritesService)
    {
        _favoritesService = favoritesService;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetFavorites(string userId)
    {
        var favorites = await _favoritesService.GetFavoritesAsync(userId);
        return Ok(favorites);
    }

    [HttpPost("{userId}")]
    public async Task<IActionResult> AddToFavorites(string userId, [FromBody] FavoriteItem item)
    {
        await _favoritesService.AddToFavoritesAsync(userId, item);
        return Ok();
    }


    [HttpDelete("{userId}/{musicId}")]
    public async Task<IActionResult> RemoveFromFavorites(string userId, int musicId)
    {
        await _favoritesService.RemoveFromFavoritesAsync(userId, musicId);
        return NoContent();
    }
}
