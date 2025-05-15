using AreebTask.DTOs;
using AreebTask.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AreebTask.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<IActionResult> PostBooking(int eventId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await _bookingService.CreateBooking(eventId, User);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
            => await _bookingService.DeleteBooking(id);
    }
}