using AreebTask.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AreebTask.Services
{
    public interface IBookingService
    {
        Task<IActionResult> CreateBooking(int eventId, ClaimsPrincipal user);
        Task<IActionResult> DeleteBooking(int id);
    }
}