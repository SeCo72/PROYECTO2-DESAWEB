using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BasketballAPI.Data;
using BasketballAPI.Models;

namespace BasketballAPI.Controllers
{
    [Route("api/teams")]
    [ApiController]
    [Authorize]
    public class TeamsController : ControllerBase
    {
        private readonly GameContext _context;

        public TeamsController(GameContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeams([FromQuery] string? search = null)
        {
            var query = _context.Teams.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(t => t.Name.Contains(search) || t.City.Contains(search));
            }

            var teams = await query.Include(t => t.Players).OrderBy(t => t.Name).ToListAsync();
            return Ok(teams);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Team>> GetTeam(int id)
        {
            var team = await _context.Teams.Include(t => t.Players).FirstOrDefaultAsync(t => t.Id == id);
            if (team == null) return NotFound();
            return Ok(team);
        }

        [HttpPost]
        public async Task<ActionResult<Team>> CreateTeam(Team team)
        {
            _context.Teams.Add(team);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTeam), new { id = team.Id }, team);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeam(int id, Team team)
        {
            if (id != team.Id) return BadRequest();

            var existingTeam = await _context.Teams.FindAsync(id);
            if (existingTeam == null) return NotFound();

            existingTeam.Name = team.Name;
            existingTeam.City = team.City;
            existingTeam.LogoUrl = team.LogoUrl;

            await _context.SaveChangesAsync();
            return Ok(existingTeam);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeam(int id)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null) return NotFound();

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}