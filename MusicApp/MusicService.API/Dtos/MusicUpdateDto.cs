namespace MusicService.API.Dtos;

public class MusicUpdateDto
{
    public string Title { get; set; } = null!;
    public string Artist { get; set; } = null!;
    public string Genre { get; set; } = null!;
}
