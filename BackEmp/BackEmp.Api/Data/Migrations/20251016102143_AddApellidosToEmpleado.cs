using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEmp.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddApellidosToEmpleado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Apellidos",
                table: "Empleados",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Apellidos",
                table: "Empleados");
        }
    }
}
