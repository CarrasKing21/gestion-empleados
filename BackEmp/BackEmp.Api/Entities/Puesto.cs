using System.ComponentModel.DataAnnotations;

namespace BackEmp.Api.Entities;

public class Puesto
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Name { get; set; } = null!;

    [StringLength(250)] // Longitud máxima para la descripción
    public string? Descripcion { get; set; }
}