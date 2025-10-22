namespace BackEmp.Api.Dtos;

public record class PuestoDto(
    int Id,
    string Name,
    string? Descripcion
);