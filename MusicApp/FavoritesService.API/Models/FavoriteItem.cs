namespace FavoritesService.API.Models;

public class FavoriteItem
{
    public string UserId { get; set; }
    public int MusicId { get; set; }
    public string Title { get; set; }
    public string Artist { get; set; }
    public string Genre { get; set; }
    public string CloudinaryPublicId { get; set; }
    public string PosterLink { get; set; }
}

