namespace MusicService.API.Entities
{
    public class CloudinaryEntry
    {
        public int MusicId { get; set; }
        public string CloudinaryPublicId { get; set; } = null!;
        public string PosterLink { get; set; } = null!;
    }

}
