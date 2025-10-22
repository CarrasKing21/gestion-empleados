// Hypothetical content of d:\david\csharp\BackEmp\BackEmp.Api\Entities\Empleado.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace BackEmp.Api.Entities;

public class Empleado
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Nombre { get; set; } = null!;

    [Required]
    [StringLength(100)] // Ajusta la longitud según sea necesario
    public string Apellidos { get; set; } = null!;

    public int PuestoId { get; set; }
    public Puesto Puesto { get; set; } = null!; // Navigation property

    [Required]
    public string Departamento { get; set; } = null!;

    [Range(1000, 10000)]
    public decimal Salario { get; set; }

    public DateOnly FechaNacimiento { get; set; }
}
