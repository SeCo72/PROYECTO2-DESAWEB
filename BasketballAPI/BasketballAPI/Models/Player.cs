namespace BasketballAPI.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int Number { get; set; }
        public string Position { get; set; } = string.Empty;
        public decimal Height { get; set; }
        public int Age { get; set; }
        public string Nationality { get; set; } = string.Empty;
        public string? PhotoUrl { get; set; }
        
        public int TeamId { get; set; }
        public Team Team { get; set; } = null!;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
