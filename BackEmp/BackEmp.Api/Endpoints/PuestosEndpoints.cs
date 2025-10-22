using BackEmp.Api.Data;
using BackEmp.Api.Dtos;
using BackEmp.Api.Entities;
using BackEmp.Api.Mapping;
using Microsoft.EntityFrameworkCore;

namespace BackEmp.Api.Endpoints;

public static class PuestosEndpoints
{
    const string GetPuestoEndpointName = "GetPuesto";

    public static RouteGroupBuilder MapPuestosEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("puestos")
            .WithParameterValidation();

        // GET /puestos
        group.MapGet("/", async (BackEmpContext dbContext) =>
            await dbContext.Puestos
                           .AsNoTracking()
                           .Select(puesto => puesto.ToPuestoDto())
                           .ToListAsync());

        // GET /puestos/1
        group.MapGet("/{id}", async (int id, BackEmpContext dbContext) =>
        {
            Puesto? puesto = await dbContext.Puestos.FindAsync(id);

            return puesto is null ?
                Results.NotFound() :
                Results.Ok(puesto.ToPuestoDto());
        })
        .WithName(GetPuestoEndpointName);

        // POST /puestos
        group.MapPost("/", async (CreatePuestoDto newPuesto, BackEmpContext dbContext) =>
        {
            Puesto puesto = newPuesto.ToEntity();

            dbContext.Puestos.Add(puesto);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(
                GetPuestoEndpointName,
                new { id = puesto.Id },
                puesto.ToPuestoDto());
        });

        // PUT /puestos/1
        group.MapPut("/{id}", async (int id, UpdatePuestoDto updatedPuesto, BackEmpContext dbContext) =>
        {
            var existingPuesto = await dbContext.Puestos.FindAsync(id);

            if (existingPuesto is null)
            {
                return Results.NotFound();
            }

            dbContext.Entry(existingPuesto).CurrentValues.SetValues(updatedPuesto.ToEntity(id));
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        // DELETE /puestos/1
        group.MapDelete("/{id}", async (int id, BackEmpContext dbContext) =>
        {
            await dbContext.Puestos
                .Where(puesto => puesto.Id == id)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        });

        return group;
    }
}