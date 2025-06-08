namespace MusicService.API.Dtos;

public class MusicCreateDto
{
    public string Title { get; set; } = null!;
    public string Artist { get; set; } = null!;
    public string Genre { get; set; } = null!;
    public string CloudinaryPublicId { get; set; } = null!;
    public string PosterLink { get; set; } = null!;
}


