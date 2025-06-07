using FavoritesService.API.Models;

namespace FavoritesService.API.Services;


public interface IFavoritesService
{
    Task<List<FavoriteItem>> GetFavoritesAsync(string userId);
    Task AddToFavoritesAsync(string userId, FavoriteItem item);
    Task RemoveFromFavoritesAsync(string userId, int musicId);
}
