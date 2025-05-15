using System;
using System.Collections.Generic;

namespace AreebTask.Models
{
    public class Event
    {
        public int EventId { get; set; }
        public DateTime Date { get; set; }
        public string Venue { get; set; }
        public byte[] ImageData { get; set; }
        public string ImageUrl { get; set; }

        public List<EventTranslation> Translations { get; set; } = new List<EventTranslation>();
        public List<Booking> Bookings { get; set; } = new List<Booking>();
    }
}