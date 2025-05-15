using AreebTask.Data;
using AreebTask.DTOs.Events;
using AreebTask.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AreebTask.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly AuthDbContext _context;
        private readonly IWebHostEnvironment _env;

        public EventRepository(AuthDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<Event> GetEventByIdAsync(int id)
            => await _context.Events
                .Include(e => e.Translations)
                .FirstOrDefaultAsync(e => e.EventId == id);

        public async Task<List<Event>> GetAllEventsAsync()
            => await _context.Events
                .Include(e => e.Translations)
                .OrderByDescending(e => e.EventId)
                .ToListAsync();

        public async Task AddEventAsync(Event eventItem)
        {
            _context.Events.Add(eventItem);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateEventAsync(Event eventItem)
        {
            _context.Events.Update(eventItem);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEventAsync(Event eventItem)
        {
            if (!string.IsNullOrEmpty(eventItem.ImageUrl))
            {
                var fileName = Path.GetFileName(new Uri(eventItem.ImageUrl).LocalPath);
                var filePath = Path.Combine(_env.WebRootPath, "images", "events", fileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _context.Events.Remove(eventItem);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EventExistsAsync(int id)
            => await _context.Events.AnyAsync(e => e.EventId == id);

        public async Task AddEventTranslationAsync(EventTranslation translation)
        {
            _context.EventTranslations.Add(translation);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsUserBookedForEventAsync(string userId, int eventId)
            => await _context.Bookings
                .AnyAsync(b => b.EventId == eventId && b.UserId == userId);
    }
}