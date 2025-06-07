﻿namespace MusicService.API.Entities
{
    public class Playlist
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public List<PlaylistMusic> PlaylistMusics { get; set; } = new();
    }

}
