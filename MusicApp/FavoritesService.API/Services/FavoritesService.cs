using FavoritesService.API.Models;
using StackExchange.Redis;
using System.Text.Json;

namespace FavoritesService.API.Services
{
    public class FavoritesService : IFavoritesService
    {
        private readonly IDatabase _redisDb;

        public FavoritesService()
        {
            var redisConfig = new ConfigurationOptions
            {
                EndPoints = { { "redis-11724.c265.us-east-1-2.ec2.redns.redis-cloud.com", 11724 } },
                User = "default",
                Password = "dX6msHFfhC5Fdnh0rNZq3jb7m9hMr5TE",
                AbortOnConnectFail = false
            };

            var redis = ConnectionMultiplexer.Connect(redisConfig);
            _redisDb = redis.GetDatabase();
        }


        public async Task<List<FavoriteItem>> GetFavoritesAsync(string userId)
        {
            var data = await _redisDb.StringGetAsync(GetKey(userId));
            if (data.IsNullOrEmpty) return new List<FavoriteItem>();

            return JsonSerializer.Deserialize<List<FavoriteItem>>(data!)!;
        }

        public async Task AddToFavoritesAsync(string userId, FavoriteItem item)
        {
            var currentFavorites = await GetFavoritesAsync(userId);
            if (!currentFavorites.Any(x => x.MusicId == item.MusicId))
            {
                currentFavorites.Add(item);
                await _redisDb.StringSetAsync(GetKey(userId), JsonSerializer.Serialize(currentFavorites));
            }
        }

        public async Task RemoveFromFavoritesAsync(string userId, int musicId)
        {
            var currentFavorites = await GetFavoritesAsync(userId);
            var updatedFavorites = currentFavorites.Where(x => x.MusicId != musicId).ToList();

            await _redisDb.StringSetAsync(GetKey(userId), JsonSerializer.Serialize(updatedFavorites));
        }

        private static string GetKey(string userId) => $"favorites:{userId}";
    }
}
