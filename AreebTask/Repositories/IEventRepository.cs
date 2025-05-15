using AreebTask.DTOs.Events;
using AreebTask.Models;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AreebTask.Repositories
{
    public interface IEventRepository
    {
        Task<Event> GetEventByIdAsync(int id);
        Task<List<Event>> GetAllEventsAsync();
        Task AddEventAsync(Event eventItem);
        Task UpdateEventAsync(Event eventItem);
        Task DeleteEventAsync(Event eventItem);
        Task<bool> EventExistsAsync(int id);
        Task AddEventTranslationAsync(EventTranslation translation);
        Task<bool> IsUserBookedForEventAsync(string userId, int eventId);
    }
}