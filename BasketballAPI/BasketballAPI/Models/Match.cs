namespace BasketballAPI.Models
{
    public class Match
    {
        public int Id { get; set; }
        
        public int HomeTeamId { get; set; }
        public Team? HomeTeam { get; set; }
        
        public int AwayTeamId { get; set; }
        public Team? AwayTeam { get; set; }
        
        public DateTime ScheduledDate { get; set; }
        
        public int? HomeScore { get; set; }
        public int? AwayScore { get; set; }
        
        public string Status { get; set; } = "Scheduled";
        
        public int? GameId { get; set; }
        public Game? Game { get; set; }
        
        public ICollection<MatchPlayer>? MatchPlayers { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    
    public class MatchPlayer
    {
        public int Id { get; set; }
        public int MatchId { get; set; }
        public Match? Match { get; set; }
        
        public int PlayerId { get; set; }
        public Player? Player { get; set; }
        
        public bool IsStarter { get; set; } = false;
    }
}
