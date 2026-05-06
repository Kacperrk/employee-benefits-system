using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context) => _context = context;

        // --- REJESTRACJA ---
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            // Sprawdź, czy login jest już zajęty
            if (await _context.Users.AnyAsync(u => u.login == request.Login))
            {
                return BadRequest(new { message = "Użytkownik o takim loginie już istnieje." });
            }

            var newUser = new User
            {
                first_name = request.FirstName,
                last_name = request.LastName,
                login = request.Login,
                password_hash = request.Password, // W przyszłości: użyj hashowania!
                role = UserRole.employee,         // Domyślna rola
                points = 100,                     // Punkty na start
                active = true
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Rejestracja zakończona sukcesem" });
        }

        // --- LOGOWANIE ---
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            // Szukamy użytkownika w bazie na podstawie loginu i hasła
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.login == request.Login && u.password_hash == request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Błędny login lub hasło" });
            }

            if (!user.active)
            {
                return BadRequest(new { message = "Konto jest nieaktywne" });
            }

            // Zwracamy dane użytkownika (na razie z fake-tokenem)
            return Ok(new
            {
                Token = "fake-jwt-token",
                Role = user.role.ToString(),
                User = $"{user.first_name} {user.last_name}",
                UserId = user.id,
                Points = user.points
            });
        }
    }

    // DTO (Data Transfer Objects) dla przejrzystości danych wejściowych
    public class LoginDto
    {
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}