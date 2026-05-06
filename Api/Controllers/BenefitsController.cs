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
    public class BenefitsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BenefitsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetBenefits()
        {
            var benefits = await _context.Benefits.Where(b => b.active).ToListAsync();
            return Ok(benefits);
        }

        [HttpPost]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> AddBenefit([FromBody] BenefitDto dto)
        {
            var benefit = new Benefit
            {
                name        = dto.Name,
                cost_points = dto.CostPoints,
                active      = true
            };
            _context.Benefits.Add(benefit);
            await _context.SaveChangesAsync();
            return Ok(benefit);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> DeactivateBenefit(int id)
        {
            var benefit = await _context.Benefits.FindAsync(id);
            if (benefit == null) return NotFound();

            benefit.active = false;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Benefit dezaktywowany" });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBenefitById(int id)
        {
            var benefit = await _context.Benefits.FindAsync(id);
            if (benefit == null)
                return NotFound(new { message = $"Benefit o ID {id} nie został znaleziony." });

            return Ok(benefit);
        }
    }

    public class BenefitDto
    {
        public string Name      { get; set; } = string.Empty;
        public int    CostPoints { get; set; }
    }
}
