namespace IdentityService.API.Models
{
    public class ProfileDto
    {
        public string Id { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? ProfilePicture { get; set; }
    }

}
