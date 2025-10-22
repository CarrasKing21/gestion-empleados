using BackEmp.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackEmp.Api.Data;

public class BackEmpContext(DbContextOptions<BackEmpContext> options)
    : DbContext(options)
{
    public  DbSet<Empleado> Empleados =>  Set<Empleado>();

    public DbSet<Puesto> Puestos => Set<Puesto>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Puesto>().HasData(
            new { Id = 1, Name = "Desarrollador" },
            new { Id = 2, Name = "Programador" },
            new { Id = 3, Name = "Tester" },
            new { Id = 4, Name = "Gerente" },
            new { Id = 5, Name = "Analista" }

        );
    }
}
