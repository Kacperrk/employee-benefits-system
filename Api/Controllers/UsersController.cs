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
            var user = new User
            {
                first_name = dto.FirstName,
                last_name = dto.LastName,
                login = dto.Login,
                password_hash = dto.Password, // W produkcji użyj BCrypt!
                role = Enum.Parse<UserRole>(dto.Role),
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
    }

    public class CreateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "employee";
    }
}