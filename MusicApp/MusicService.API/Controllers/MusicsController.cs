using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicService.API.Data;
using MusicService.API.Dtos;
using MusicService.API.Entities;
using MusicService.API.Services;
using System.Security.Claims;

namespace MusicService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MusicsController : ControllerBase
{
    private readonly MusicDbContext _context;
    private readonly CloudinaryStorageService _cloudinaryStorage;

    public MusicsController(MusicDbContext context, CloudinaryStorageService cloudinaryStorage)
    {
        _context = context;
        _cloudinaryStorage = cloudinaryStorage;
    }

    // ------------------ MUSIC OPERATIONS ------------------

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var musics = await _context.Musics.ToListAsync();
        return Ok(musics);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var music = await _context.Musics.FindAsync(id);
        if (music == null) return NotFound();

        var (publicId, posterLink) = await _cloudinaryStorage.GetEntryAsync(id);

        var result = new
        {
            music.Id,
            music.Title,
            music.Artist,
            music.Genre,
            CloudinaryPublicId = publicId,
            PosterLink = posterLink
        };

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(MusicCreateDto dto)
    {
        var music = new Music
        {
            Title = dto.Title,
            Artist = dto.Artist,
            Genre = dto.Genre,
            MusicCloudinaryId = dto.CloudinaryPublicId,
            PosterCloudinaryId = dto.PosterLink
        };

        _context.Musics.Add(music);
        await _context.SaveChangesAsync();

        await _cloudinaryStorage.SaveReferenceAsync(music.Id, dto.CloudinaryPublicId, dto.PosterLink);

        return CreatedAtAction(nameof(Get), new { id = music.Id }, music);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, MusicUpdateDto dto)
    {
        var music = await _context.Musics.FindAsync(id);
        if (music == null) return NotFound();

        music.Title = dto.Title;
        music.Artist = dto.Artist;
        music.Genre = dto.Genre;
        music.MusicCloudinaryId = dto.MusicCloudinaryId;
        music.PosterCloudinaryId = dto.PosterCloudinaryId;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var music = await _context.Musics.FindAsync(id);
        if (music == null) return NotFound();

        _context.Musics.Remove(music);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("by-genre/{genre}")]
    public async Task<IActionResult> GetByGenre(string genre)
    {
        var musics = await _context.Musics
            .Where(m => m.Genre.ToLower() == genre.ToLower())
            .ToListAsync();

        return Ok(musics);
    }

    // ------------------ DEFAULT PLAYLIST OPERATIONS ------------------

    [HttpGet("playlist/all-music/{userId}")]
    public async Task<IActionResult> GetAllMusicsInUserPlaylists(string userId)
    {
        var userPlaylistIds = await _context.Playlists
            .Where(p => p.UserId == userId)
            .Select(p => p.Id)
            .ToListAsync();

        var musics = await _context.PlaylistMusics
            .Where(pm => userPlaylistIds.Contains(pm.PlaylistId))
            .Include(pm => pm.Music)
            .Select(pm => pm.Music)
            .ToListAsync();

        return Ok(musics);
    }


    [HttpGet("playlist/${_userId}")]
    public async Task<IActionResult> GetOrCreateDefaultPlaylist(string _userId)
    {
        var userId = _userId;

        var playlist = await _context.Playlists
            .Include(p => p.PlaylistMusics)
                .ThenInclude(pm => pm.Music)
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (playlist == null)
        {
            playlist = new Playlist
            {
                Name = "My Playlist",
                UserId = userId
            };
            _context.Playlists.Add(playlist);
            await _context.SaveChangesAsync();
        }

        return Ok(playlist);
    }

    [HttpPost("playlist/add/{musicId}/{_userId}")]
    public async Task<IActionResult> AddToDefaultPlaylist(int musicId, string _userId)
    {
        var userId = _userId;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var playlist = await _context.Playlists.FirstOrDefaultAsync(p => p.UserId == userId);
        if (playlist == null)
        {
            playlist = new Playlist
            {
                Name = "My Playlist",
                UserId = userId
            };
            _context.Playlists.Add(playlist);
            await _context.SaveChangesAsync();
        }

        var music = await _context.Musics.FindAsync(musicId);
        if (music == null) return NotFound("Mahnı tapılmadı");

        var exists = await _context.PlaylistMusics
            .AnyAsync(pm => pm.PlaylistId == playlist.Id && pm.MusicId == musicId);

        if (!exists)
        {
            _context.PlaylistMusics.Add(new PlaylistMusic
            {
                PlaylistId = playlist.Id,
                MusicId = musicId
            });
            await _context.SaveChangesAsync();
        }

        return Ok();
    }


    [HttpDelete("playlist/remove/{musicId}/{_userId}")]
    public async Task<IActionResult> RemoveFromDefaultPlaylist(int musicId, string _userId)
    {
        var userId = _userId;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var playlist = await _context.Playlists.FirstOrDefaultAsync(p => p.UserId == userId);
        if (playlist == null) return NotFound("Playlist tapılmadı");

        var item = await _context.PlaylistMusics
            .FirstOrDefaultAsync(pm => pm.PlaylistId == playlist.Id && pm.MusicId == musicId);

        if (item == null) return NotFound("Mahnı playlistdə yoxdur");

        _context.PlaylistMusics.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
