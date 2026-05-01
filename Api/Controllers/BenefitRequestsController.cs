using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BenefitRequestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BenefitRequestsController(AppDbContext context) => _context = context;

        [HttpPost]
        public async Task<IActionResult> SubmitRequest([FromBody] RequestDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            var benefit = await _context.Benefits.FindAsync(dto.BenefitId);

            if (user == null || benefit == null) return BadRequest("Nieprawidłowy użytkownik lub benefit");
            if (user.points < benefit.cost_points) return BadRequest("Brak wystarczającej liczby punktów");

            var request = new BenefitRequest
            {
                user_id = dto.UserId,
                benefit_id = dto.BenefitId,
                status = RequestStatus.pending,
                request_date = DateTime.UtcNow
            };

            _context.BenefitRequests.Add(request);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Wniosek złożony" });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRequests()
        {
            // JOIN - pobieramy wniosek razem z danymi o użytkowniku i beneficie
            var requests = await _context.BenefitRequests
                .Include(r => r.User)
                .Include(r => r.Benefit)
                .Select(r => new {
                    r.id,
                    User = $"{r.User.first_name} {r.User.last_name}",
                    Benefit = r.Benefit.name,
                    r.status,
                    r.request_date
                })
                .ToListAsync();

            return Ok(requests);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
        {
            var request = await _context.BenefitRequests.Include(r => r.User).Include(r => r.Benefit).FirstOrDefaultAsync(r => r.id == id);
            if (request == null) return NotFound();

            if (newStatus.ToLower() == "approved")
            {
                if (request.User.points < request.Benefit.cost_points) return BadRequest("Pracownik nie ma już punktów");
                request.User.points -= request.Benefit.cost_points;
                request.status = RequestStatus.approved;
            }
            else
            {
                request.status = RequestStatus.rejected;
            }

            request.decision_date = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Status zmieniony na {newStatus}" });
        }
    }

    public class RequestDto { public int UserId { get; set; } public int BenefitId { get; set; } }
}