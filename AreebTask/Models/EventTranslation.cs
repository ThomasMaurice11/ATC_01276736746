using System.ComponentModel.DataAnnotations.Schema;

namespace AreebTask.Models
{
    public class EventTranslation
    {
        public int EventTranslationId { get; set; }
        public int EventId { get; set; }
        public string LanguageCode { get; set; }
        public string Name { get; set; }
        public string Details { get; set; }
        public string Price { get; set; }
        public string Category { get; set; }

        [ForeignKey("EventId")]
        public Event Event { get; set; }
    }
}