using AreebTask.Data;
using AreebTask.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AreebTask.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly AuthDbContext _context;

        public BookingRepository(AuthDbContext context)
        {
            _context = context;
        }

        public async Task<bool> EventExistsAsync(int eventId)
            => await _context.Events.AnyAsync(e => e.EventId == eventId);

        public async Task AddBookingAsync(Booking booking)
        {
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
        }

        public async Task<Booking> GetBookingByIdAsync(int id)
            => await _context.Bookings.FindAsync(id);

        public async Task RemoveBookingAsync(Booking booking)
        {
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> BookingExistsAsync(int id)
            => await _context.Bookings.AnyAsync(e => e.BookingId == id);
    }
}