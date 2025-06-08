namespace MusicService.API.Entities;

public class Music
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Artist { get; set; } = null!;
    public string Genre { get; set; } = null!;
    public string MusicCloudinaryId { get; set; }
    public string PosterCloudinaryId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

