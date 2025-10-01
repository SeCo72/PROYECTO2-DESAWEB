using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BasketballAPI.Data;
using BasketballAPI.Models;

namespace BasketballAPI.Controllers
{
    [Route("api/matches")]
    [ApiController]
    [Authorize]
    public class MatchesController : ControllerBase
    {
        private readonly GameContext _context;

        public MatchesController(GameContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatches([FromQuery] string? status = null)
        {
            var query = _context.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Game)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(m => m.Status == status);

            var matches = await query.OrderByDescending(m => m.ScheduledDate).ToListAsync();
            return Ok(matches);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Match>> GetMatch(int id)
        {
            var match = await _context.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Game)
                .Include(m => m.MatchPlayers)
                    .ThenInclude(mp => mp.Player)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (match == null) return NotFound();
            return Ok(match);
        }

        [HttpPost]
        public async Task<ActionResult<Match>> CreateMatch(Match match)
        {
            var homeTeamExists = await _context.Teams.AnyAsync(t => t.Id == match.HomeTeamId);
            var awayTeamExists = await _context.Teams.AnyAsync(t => t.Id == match.AwayTeamId);

            if (!homeTeamExists || !awayTeamExists)
                return BadRequest(new { message = "Uno o ambos equipos no existen" });

            if (match.HomeTeamId == match.AwayTeamId)
                return BadRequest(new { message = "Un equipo no puede jugar contra sí mismo" });

            _context.Matches.Add(match);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMatch), new { id = match.Id }, match);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMatch(int id, Match match)
        {
            if (id != match.Id) return BadRequest();

            var existingMatch = await _context.Matches.FindAsync(id);
            if (existingMatch == null) return NotFound();

            existingMatch.HomeTeamId = match.HomeTeamId;
            existingMatch.AwayTeamId = match.AwayTeamId;
            existingMatch.ScheduledDate = match.ScheduledDate;
            existingMatch.HomeScore = match.HomeScore;
            existingMatch.AwayScore = match.AwayScore;
            existingMatch.Status = match.Status;
            existingMatch.GameId = match.GameId;

            await _context.SaveChangesAsync();
            return Ok(existingMatch);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatch(int id)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null) return NotFound();

            _context.Matches.Remove(match);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{matchId}/roster")]
        public async Task<IActionResult> SetRoster(int matchId, [FromBody] List<int> playerIds)
        {
            var match = await _context.Matches
                .Include(m => m.MatchPlayers)
                .FirstOrDefaultAsync(m => m.Id == matchId);

            if (match == null) return NotFound();

            _context.MatchPlayers.RemoveRange(match.MatchPlayers);

            foreach (var playerId in playerIds)
            {
                var player = await _context.Players.FindAsync(playerId);
                if (player != null)
                {
                    match.MatchPlayers.Add(new MatchPlayer
                    {
                        MatchId = matchId,
                        PlayerId = playerId,
                        IsStarter = false
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Roster actualizado correctamente" });
        }

        [HttpGet("{matchId}/roster")]
        [AllowAnonymous]
        public async Task<ActionResult> GetRoster(int matchId)
        {
            var roster = await _context.MatchPlayers
                .Include(mp => mp.Player)
                    .ThenInclude(p => p.Team)
                .Where(mp => mp.MatchId == matchId)
                .ToListAsync();

            return Ok(roster);
        }
    }
}