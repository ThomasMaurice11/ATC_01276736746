using Microsoft.Extensions.Logging;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace AreebTask.Models
{
    public class Booking
    {
        public int BookingId { get; set; }
        public string UserId { get; set; }
        public int EventId { get; set; }
        public DateTime BookingDate { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        [ForeignKey("EventId")]
        public Event Event { get; set; }
    }
}