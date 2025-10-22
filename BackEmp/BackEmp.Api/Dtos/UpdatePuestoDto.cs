using System.ComponentModel.DataAnnotations;

namespace BackEmp.Api.Dtos;

public record class UpdatePuestoDto(
    [Required(ErrorMessage = "El nombre del puesto es obligatorio.")]
    [StringLength(50, ErrorMessage = "El nombre del puesto no puede superar los 50 caracteres.")]
    string Name,

    [StringLength(250, ErrorMessage = "La descripción no puede superar los 250 caracteres.")]
    string? Descripcion
);