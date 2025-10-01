namespace BasketballAPI.Models
{
    public class Game
    {
        public int Id { get; set; }
        public int LocalPoints { get; set; }
        public int VisitorPoints { get; set; }
        public int LocalFouls { get; set; }
        public int VisitorFouls { get; set; }
        public int CurrentQuarter { get; set; }
        public int Minutes { get; set; }
        public int Seconds { get; set; }
    }
}
