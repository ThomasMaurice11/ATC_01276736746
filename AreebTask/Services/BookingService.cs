using AreebTask.DTOs;
using AreebTask.Models;
using AreebTask.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AreebTask.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;

        public BookingService(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        public async Task<IActionResult> CreateBooking(int eventId, ClaimsPrincipal user)
        {
            var userId = user?.FindFirst("id")?.Value;

            if (string.IsNullOrEmpty(userId))
                return new BadRequestObjectResult("Invalid user");

            if (!await _bookingRepository.EventExistsAsync(eventId))
                return new BadRequestObjectResult("Event does not exist");

            var booking = new Booking
            {
                UserId = userId,
                EventId = eventId,
                BookingDate = DateTime.UtcNow
            };

            await _bookingRepository.AddBookingAsync(booking);
            return new OkResult();
        }

        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _bookingRepository.GetBookingByIdAsync(id);
            if (booking == null)
                return new NotFoundResult();

            await _bookingRepository.RemoveBookingAsync(booking);
            return new NoContentResult();
        }
    }
}