namespace IdentityService.API.Models
{
    public class UpdateProfileDto
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string? ProfilePicture { get; set; }
    }

}
