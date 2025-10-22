using System.ComponentModel.DataAnnotations;

namespace BackEmp.Api.Dtos;

public record class CreateEmpleadoDto(
    [Required(ErrorMessage = "El nombre es obligatorio.")][StringLength(50, ErrorMessage = "El nombre no puede superar los 50 caracteres.")]string Nombre,
    [Required(ErrorMessage = "Los apellidos son obligatorios.")] string Apellidos,
    [Range(1, int.MaxValue, ErrorMessage = "El ID del puesto no es válido.")] int PuestoId,
    [Required(ErrorMessage = "El departamento es obligatorio.")] string Departamento,
    [Range(1000, 10000, ErrorMessage = "El salario debe estar entre 1000 y 10000.")]decimal Salario,
    [Required(ErrorMessage = "La fecha de nacimiento es obligatoria.")] DateOnly FechaNacimiento
);