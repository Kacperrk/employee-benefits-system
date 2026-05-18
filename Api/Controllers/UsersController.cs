using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpPost]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.login == dto.Login))
                return BadRequest("Login jest już zajęty.");

            var user = new User
            {
                first_name = dto.FirstName,
                last_name = dto.LastName,
                login = dto.Login,
                password_hash = dto.Password,
                role = UserRole.employee,
                points = 100,
                active = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Użytkownik dodany", userId = user.id });
        }

        [HttpPut("{id}/points")]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> AssignPoints(int id, [FromBody] int points)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.points = points;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Punkty zaktualizowane" });
        }

        [HttpPut("{id}/role")]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleDto dto)
        {
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
    }

    public class ChangeRoleDto
    {
        public string NewRole { get; set; } = "employee";
    }
}
