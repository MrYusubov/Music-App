using Microsoft.EntityFrameworkCore;
using MusicService.API.Entities;

namespace MusicService.API.Data;

public class MusicDbContext : DbContext
{
    public MusicDbContext(DbContextOptions<MusicDbContext> options) : base(options) { }

    public DbSet<Music> Musics => Set<Music>();
    public DbSet<Playlist> Playlists => Set<Playlist>();
    public DbSet<PlaylistMusic> PlaylistMusics => Set<PlaylistMusic>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PlaylistMusic>()
            .HasKey(pm => new { pm.PlaylistId, pm.MusicId });

        modelBuilder.Entity<PlaylistMusic>()
            .HasOne(pm => pm.Playlist)
            .WithMany(p => p.PlaylistMusics)
            .HasForeignKey(pm => pm.PlaylistId);

        modelBuilder.Entity<PlaylistMusic>()
            .HasOne(pm => pm.Music)
            .WithMany()
            .HasForeignKey(pm => pm.MusicId);
    }

}
