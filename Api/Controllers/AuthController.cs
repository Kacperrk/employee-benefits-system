using Api.Data;
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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.login == request.Login && u.password_hash == request.Password);

            if (user == null) return Unauthorized(new { message = "Błędny login lub hasło" });

            return Ok(new
            {
                Token = "fake-jwt-token",
                Role = user.role.ToString(),
                User = $"{user.first_name} {user.last_name}",
                UserId = user.id
            });
        }
    }

    public class LoginDto { public string Login { get; set; } = string.Empty; public string Password { get; set; } = string.Empty; }
}