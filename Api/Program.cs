using Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- SERWISY ---

// 1. PostgreSQL - upewnij się, że w appsettings masz ConnectionStrings:DefaultConnection
builder.Services.AddDbContext<DataContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Kontrolery
builder.Services.AddControllers();

// 3. CORS - kluczowe dla Reacta
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Swagger (Klasyczny interfejs graficzny)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- MIDDLEWARE ---

// Włączamy Swaggera zawsze w trybie Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // To daje interfejs pod adresem /swagger
}

app.UseHttpsRedirection();

// CORS musi być przed MapControllers!
app.UseCors();

app.MapControllers();

app.Run();