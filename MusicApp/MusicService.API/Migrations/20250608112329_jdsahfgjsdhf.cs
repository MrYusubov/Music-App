using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicService.API.Migrations
{
    /// <inheritdoc />
    public partial class jdsahfgjsdhf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MusicCloudinaryId",
                table: "Musics",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PosterCloudinaryId",
                table: "Musics",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MusicCloudinaryId",
                table: "Musics");

            migrationBuilder.DropColumn(
                name: "PosterCloudinaryId",
                table: "Musics");
        }
    }
}
