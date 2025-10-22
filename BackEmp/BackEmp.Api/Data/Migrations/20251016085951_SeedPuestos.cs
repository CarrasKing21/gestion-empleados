using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BackEmp.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedPuestos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Puestos",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Desarrollador" },
                    { 2, "Programador" },
                    { 3, "Tester" },
                    { 4, "Gerente" },
                    { 5, "Analista" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Puestos",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Puestos",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Puestos",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Puestos",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Puestos",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
