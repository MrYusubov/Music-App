using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicService.API.Data;
using MusicService.API.Entities;
using System.Security.Claims;

namespace MusicService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlaylistsController : ControllerBase
{
    private readonly MusicDbContext _context;

    public PlaylistsController(MusicDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePlaylist([FromBody] string name)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var playlist = new Playlist
        {
            Name = name,
            UserId = userId
        };

        _context.Playlists.Add(playlist);
        await _context.SaveChangesAsync();

        return Ok(playlist);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlaylist(int id)
    {
        var playlist = await _context.Playlists.FindAsync(id);
        if (playlist == null)
            return NotFound();

        _context.Playlists.Remove(playlist);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{playlistId}/add/{musicId}")]
    public async Task<IActionResult> AddMusicToPlaylist(int playlistId, int musicId)
    {
        var playlist = await _context.Playlists.FindAsync(playlistId);
        var music = await _context.Musics.FindAsync(musicId);

        if (playlist == null || music == null)
            return NotFound("Playlist və ya mahnı tapılmadı");

        var alreadyExists = await _context.PlaylistMusics
            .AnyAsync(pm => pm.PlaylistId == playlistId && pm.MusicId == musicId);

        if (!alreadyExists)
        {
            var playlistMusic = new PlaylistMusic
            {
                PlaylistId = playlistId,
                MusicId = musicId
            };

            _context.PlaylistMusics.Add(playlistMusic);
            await _context.SaveChangesAsync();
        }

        return Ok();
    }

    [HttpDelete("{playlistId}/remove/{musicId}")]
    public async Task<IActionResult> RemoveMusicFromPlaylist(int playlistId, int musicId)
    {
        var item = await _context.PlaylistMusics
            .FirstOrDefaultAsync(pm => pm.PlaylistId == playlistId && pm.MusicId == musicId);

        if (item == null)
            return NotFound("Mahnı playlistdə yoxdur");

        _context.PlaylistMusics.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPlaylists()
    {
        var playlists = await _context.Playlists
            .Include(p => p.PlaylistMusics)
                .ThenInclude(pm => pm.Music)
            .ToListAsync();

        return Ok(playlists);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPlaylist(int id)
    {
        var playlist = await _context.Playlists
            .Include(p => p.PlaylistMusics)
                .ThenInclude(pm => pm.Music)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (playlist == null)
            return NotFound();

        return Ok(playlist);
    }
}
