using AreebTask.Models;
using System.Threading.Tasks;

namespace AreebTask.Repositories
{
    public interface IBookingRepository
    {
        Task<bool> EventExistsAsync(int eventId);
        Task AddBookingAsync(Booking booking);
        Task<Booking> GetBookingByIdAsync(int id);
        Task RemoveBookingAsync(Booking booking);
        Task<bool> BookingExistsAsync(int id);
    }
}