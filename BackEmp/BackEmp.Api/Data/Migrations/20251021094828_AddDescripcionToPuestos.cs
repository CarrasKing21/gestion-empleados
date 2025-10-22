using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEmp.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDescripcionToPuestos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "Puestos",
                type: "TEXT",
                maxLength: 250,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Puestos",
                keyColumn: "Id",
                keyValue: 1,
                column: "Descripcion",
                value: null);

            migrationBuilder.UpdateData(
                table: "Puestos",
                keyColumn: "Id",
                keyValue: 2,
                column: "Descripcion",
                value: null);

            migrationBuilder.UpdateData(
                table: "Puestos",
                keyColumn: "Id",
                keyValue: 3,
                column: "Descripcion",
                value: null);

            migrationBuilder.UpdateData(
                table: "Puestos",
                keyColumn: "Id",
                keyValue: 4,
                column: "Descripcion",
                value: null);

            migrationBuilder.UpdateData(
                table: "Puestos",
                keyColumn: "Id",
                keyValue: 5,
                column: "Descripcion",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "Puestos");
        }
    }
}
