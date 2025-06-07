using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace IdentityService.API.Entities
{
    public class CustomIdentityUser : IdentityUser
    {
        [Url]
        public string? ProfilePicture { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
