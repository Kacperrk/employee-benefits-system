using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config  = config;
        }

        // --- REJESTRACJA ---
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            if (await _context.Users.AnyAsync(u => u.login == request.Login))
                return BadRequest(new { message = "Użytkownik o takim loginie już istnieje." });

            var newUser = new User
            {
                first_name    = request.FirstName,
                last_name     = request.LastName,
                login         = request.Login,
                password_hash = request.Password, // W produkcji: BCrypt!
                role          = UserRole.employee,
                points        = 100,
                active        = true
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Rejestracja zakończona sukcesem" });
        }

        // --- LOGOWANIE ---
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.login == request.Login && u.password_hash == request.Password);

            if (user == null)
                return Unauthorized(new { message = "Błędny login lub hasło" });

            if (!user.active)
                return BadRequest(new { message = "Konto jest nieaktywne" });

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                Token  = token,
                Role   = user.role.ToString(),
                User   = $"{user.first_name} {user.last_name}",
                UserId = user.id,
                Points = user.points
            });
        }

        // --- GENEROWANIE TOKENU ---
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
                new Claim(ClaimTypes.Name,           $"{user.first_name} {user.last_name}"),
                new Claim(ClaimTypes.Role,           user.role.ToString()),
            };

            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer:             _config["Jwt:Issuer"],
                audience:           _config["Jwt:Audience"],
                claims:             claims,
                expires:            DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginDto
    {
        public string Login    { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName  { get; set; } = string.Empty;
        public string Login     { get; set; } = string.Empty;
        public string Password  { get; set; } = string.Empty;
    }
}
