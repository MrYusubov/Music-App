namespace FavoritesService.API.Models;

public class FavoriteItem
{
    public int MusicId { get; set; }
    public string Title { get; set; } = null!;
    public string Artist { get; set; } = null!;
    public string CloudinaryPublicId { get; set; } = null!;
}
