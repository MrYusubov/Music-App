using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicService.API.Data;
using MusicService.API.Dtos;
using MusicService.API.Entities;

namespace MusicService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MusicsController : ControllerBase
{
    private readonly MusicDbContext _context;

    public MusicsController(MusicDbContext context)
    {
        _context = context;
    }

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
        return Ok(music);
    }

    [HttpPost]
    public async Task<IActionResult> Create(MusicCreateDto dto)
    {
        var music = new Music
        {
            Title = dto.Title,
            Artist = dto.Artist,
            Genre = dto.Genre,
            CloudinaryPublicId = dto.CloudinaryPublicId
        };

        _context.Musics.Add(music);
        await _context.SaveChangesAsync();

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
}
