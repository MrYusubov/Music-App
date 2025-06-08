using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicService.API.Migrations
{
    /// <inheritdoc />
    public partial class remove_cld : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CloudinaryPublicId",
                table: "Musics");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CloudinaryPublicId",
                table: "Musics",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
