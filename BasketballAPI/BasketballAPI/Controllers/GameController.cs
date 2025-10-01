using Microsoft.AspNetCore.Mvc;
using BasketballAPI.Data;
using BasketballAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BasketballAPI.Controllers
{
    [Route("game")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly GameContext _context;
        public GameController(GameContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Game>> GetGame(int id)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null) return NotFound();
            return game;
        }

        [HttpPost]
        public async Task<ActionResult<Game>> CreateGame(Game game)
        {
            _context.Games.Add(game);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGame), new { id = game.Id }, game);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGame(int id, Game game)
        {
            var existingGame = await _context.Games.FindAsync(id);
            if (existingGame == null) return NotFound();

            existingGame.LocalPoints = game.LocalPoints;
            existingGame.VisitorPoints = game.VisitorPoints;
            existingGame.LocalFouls = game.LocalFouls;
            existingGame.VisitorFouls = game.VisitorFouls;
            existingGame.CurrentQuarter = game.CurrentQuarter;
            existingGame.Minutes = game.Minutes;
            existingGame.Seconds = game.Seconds;

            await _context.SaveChangesAsync();
            return Ok(existingGame);
        }

    }
}
