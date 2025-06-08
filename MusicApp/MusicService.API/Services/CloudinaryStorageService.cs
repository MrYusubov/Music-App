using System.Text.Json;
using MusicService.API.Entities;

namespace MusicService.API.Services
{
    public class CloudinaryStorageService
    {
        private const string _filePath = "/app/MusicService.API/refs/cloudinary-refs.json";

        public CloudinaryStorageService()
        {
            var directory = Path.GetDirectoryName(_filePath);
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory!);

            if (!File.Exists(_filePath))
                File.WriteAllText(_filePath, "");
        }

        public async Task SaveReferenceAsync(int musicId, string publicId, string posterLink)
        {
            var lines = await File.ReadAllLinesAsync(_filePath);
            var filteredLines = lines
                .Select(line => JsonSerializer.Deserialize<CloudinaryEntry>(line))
                .Where(entry => entry?.MusicId != musicId)
                .ToList();

            filteredLines.Add(new CloudinaryEntry
            {
                MusicId = musicId,
                CloudinaryPublicId = publicId,
                PosterLink = posterLink
            });

            using var writer = new StreamWriter(_filePath, false);
            foreach (var entry in filteredLines)
            {
                var json = JsonSerializer.Serialize(entry);
                await writer.WriteLineAsync(json);
            }
        }

        public async Task<(string? PublicId, string? PosterLink)> GetEntryAsync(int musicId)
        {
            var lines = await File.ReadAllLinesAsync(_filePath);
            foreach (var line in lines)
            {
                var entry = JsonSerializer.Deserialize<CloudinaryEntry>(line);
                if (entry?.MusicId == musicId)
                    return (entry.CloudinaryPublicId, entry.PosterLink);
            }

            return (null, null);
        }

        public async Task<string?> GetPublicIdAsync(int musicId)
        {
            var (publicId, _) = await GetEntryAsync(musicId);
            return publicId;
        }
    }
}
