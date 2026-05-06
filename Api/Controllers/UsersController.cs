using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            // Sprawdź czy login zajęty
            if (await _context.Users.AnyAsync(u => u.login == dto.Login))
                return BadRequest("Login jest już zajęty.");

            var user = new User
            {
                first_name = dto.FirstName,
                last_name = dto.LastName,
                login = dto.Login,
                password_hash = dto.Password, // BCrypt w produkcji!
                role = UserRole.employee, // ZAWSZE employee przy rejestracji
                points = 0,
                active = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Użytkownik dodany", userId = user.id });
        }

        [HttpPut("{id}/points")]
        public async Task<IActionResult> AssignPoints(int id, [FromBody] int points)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.points = points;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Punkty zaktualizowane" });
        }

        // Tylko admin może zmienić rolę pracownikowi
        [HttpPut("{id}/role")]
        public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleDto dto)
        {
            // Sprawdź czy wykonujący jest adminem
            var requester = await _context.Users.FindAsync(dto.RequesterId);
            if (requester == null || requester.role != UserRole.administrator)
                return Forbid();

            var target = await _context.Users.FindAsync(id);
            if (target == null) return NotFound();

            if (!Enum.TryParse<UserRole>(dto.NewRole, out var parsedRole))
                return BadRequest("Nieprawidłowa rola. Użyj: employee lub administrator");

            target.role = parsedRole;
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Rola zmieniona na {parsedRole}" });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = $"Użytkownik o ID {id} nie istnieje." });

            return Ok(user);
        }
    }

    public class CreateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        // Rola celowo usunięta — zawsze employee
    }

    public class ChangeRoleDto
    {
        public int RequesterId { get; set; } // ID admina który wykonuje zmianę
        public string NewRole { get; set; } = "employee";
    }
}