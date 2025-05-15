using System.ComponentModel.DataAnnotations;

namespace AreebTask.DTOs.Events
{
    public class EventBasicCreateDto
    {
        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Venue { get; set; }

        [Required]
        public IFormFile ImageFile { get; set; }
    }
    public class EventCreateDto : EventBasicCreateDto
    {
        public List<EventTranslationDto> Translations { get; set; }
    }
    public class EventUpdateDto
    {
        public DateTime? Date { get; set; }
        public string Venue { get; set; }
        public IFormFile ImageFile { get; set; }
    }
    public class EventTranslationDto
    {
        [Required]
        public string LanguageCode { get; set; }

        [Required]
        public string Name { get; set; }

        public string Details { get; set; }
        public string Price { get; set; }
        public string Category { get; set; }
    }
    public class EventTranslationUpdateDto
    {
        [Required]
        public string LanguageCode { get; set; }

        public string Name { get; set; }
        public string Details { get; set; }
        public string Price { get; set; }
        public string Category { get; set; }
    }
    public class EventResponseDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }
        public DateTime Date { get; set; }
        public string Venue { get; set; }
        public bool IsBooked { get; set; }
        public List<EventTranslationDto> Translations { get; set; }
    }
    public class EventListResponseDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }
        public DateTime Date { get; set; }
        public string Venue { get; set; }
        public bool IsBooked { get; set; }
        public List<EventTranslationDto> Translations { get; set; }
    }
    public class EventCreateFormModel
    {
        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Venue { get; set; }

        [Required]
        public IFormFile ImageFile { get; set; }

        [Required]
        public string TranslationsJson { get; set; }
    }
}
