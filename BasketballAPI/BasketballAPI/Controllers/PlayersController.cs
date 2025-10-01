using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BasketballAPI.Data;
using BasketballAPI.Models;

namespace BasketballAPI.Controllers
{
    [Route("api/players")]
    [ApiController]
    [Authorize]
    public class PlayersController : ControllerBase
    {
        private readonly GameContext _context;

        public PlayersController(GameContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Player>>> GetPlayers(
            [FromQuery] int? teamId = null,
            [FromQuery] string? search = null)
        {
            var query = _context.Players.Include(p => p.Team).AsQueryable();

            if (teamId.HasValue)
                query = query.Where(p => p.TeamId == teamId.Value);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.FullName.Contains(search) || p.Position.Contains(search));
            }

            var players = await query.OrderBy(p => p.Number).ToListAsync();
            return Ok(players);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Player>> GetPlayer(int id)
        {
            var player = await _context.Players.Include(p => p.Team).FirstOrDefaultAsync(p => p.Id == id);
            if (player == null) return NotFound();
            return Ok(player);
        }

        [HttpPost]
        public async Task<ActionResult<Player>> CreatePlayer(Player player)
        {
            var teamExists = await _context.Teams.AnyAsync(t => t.Id == player.TeamId);
            if (!teamExists)
                return BadRequest(new { message = "El equipo no existe" });

            _context.Players.Add(player);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPlayer), new { id = player.Id }, player);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlayer(int id, Player player)
        {
            if (id != player.Id) return BadRequest();

            var existingPlayer = await _context.Players.FindAsync(id);
            if (existingPlayer == null) return NotFound();

            existingPlayer.FullName = player.FullName;
            existingPlayer.Number = player.Number;
            existingPlayer.Position = player.Position;
            existingPlayer.Height = player.Height;
            existingPlayer.Age = player.Age;
            existingPlayer.Nationality = player.Nationality;
            existingPlayer.PhotoUrl = player.PhotoUrl;
            existingPlayer.TeamId = player.TeamId;

            await _context.SaveChangesAsync();
            return Ok(existingPlayer);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlayer(int id)
        {
            var player = await _context.Players.FindAsync(id);
            if (player == null) return NotFound();

            _context.Players.Remove(player);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}