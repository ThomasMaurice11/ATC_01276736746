using AreebTask.DTOs.Events;
using AreebTask.Models;
using AreebTask.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AreebTask.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public EventService(
            IEventRepository eventRepository,
            IWebHostEnvironment env,
            IHttpContextAccessor httpContextAccessor)
        {
            _eventRepository = eventRepository;
            _env = env;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ActionResult<EventResponseDto>> CreateEvent([FromForm] EventBasicCreateDto eventDto)
        {
            if (eventDto.ImageFile == null || eventDto.ImageFile.Length == 0)
                return new BadRequestObjectResult("Image file is required");

            var newEvent = new Event
            {
                Date = eventDto.Date,
                Venue = eventDto.Venue,
                Translations = new List<EventTranslation>()
            };

            // Handle image upload
            var (imageBytes, fileName) = await ProcessImageUpload(eventDto.ImageFile);
            newEvent.ImageData = imageBytes;
            newEvent.ImageUrl = GetImageUrl(fileName);

            await _eventRepository.AddEventAsync(newEvent);
            return new CreatedAtActionResult(
                nameof(GetEvent),
                "Events",
                new { id = newEvent.EventId },
                MapToResponseDto(newEvent));
        }

        public async Task<ActionResult<EventResponseDto>> AddEventTranslation(int eventId, EventTranslationDto translationDto)
        {
            var existingEvent = await _eventRepository.GetEventByIdAsync(eventId);
            if (existingEvent == null)
                return new NotFoundObjectResult("Event not found");

            var translation = new EventTranslation
            {
                EventId = eventId,
                LanguageCode = translationDto.LanguageCode,
                Name = translationDto.Name,
                Details = translationDto.Details,
                Price = translationDto.Price,
                Category = translationDto.Category
            };

            await _eventRepository.AddEventTranslationAsync(translation);
            return new OkObjectResult(MapToResponseDto(existingEvent));
        }

        public async Task<IActionResult> UpdateEvent(int id, [FromForm] EventUpdateDto eventDto)
        {
            var eventItem = await _eventRepository.GetEventByIdAsync(id);
            if (eventItem == null)
                return new NotFoundResult();

            if (eventDto.Date.HasValue) eventItem.Date = eventDto.Date.Value;
            if (!string.IsNullOrEmpty(eventDto.Venue)) eventItem.Venue = eventDto.Venue;

            if (eventDto.ImageFile != null && eventDto.ImageFile.Length > 0)
            {
                var (imageBytes, fileName) = await ProcessImageUpload(eventDto.ImageFile);
                eventItem.ImageData = imageBytes;
                eventItem.ImageUrl = GetImageUrl(fileName);
            }

            await _eventRepository.UpdateEventAsync(eventItem);
            return new NoContentResult();
        }

        public async Task<IActionResult> UpdateEventTranslations(int id, List<EventTranslationUpdateDto> translations)
        {
            var eventItem = await _eventRepository.GetEventByIdAsync(id);
            if (eventItem == null)
                return new NotFoundResult();

            foreach (var translationDto in translations)
            {
                var existingTranslation = eventItem.Translations
                    .FirstOrDefault(t => t.LanguageCode == translationDto.LanguageCode);

                if (existingTranslation != null)
                {
                    existingTranslation.Name = translationDto.Name ?? existingTranslation.Name;
                    existingTranslation.Details = translationDto.Details ?? existingTranslation.Details;
                    existingTranslation.Price = translationDto.Price ?? existingTranslation.Price;
                    existingTranslation.Category = translationDto.Category ?? existingTranslation.Category;
                }
                else
                {
                    eventItem.Translations.Add(new EventTranslation
                    {
                        LanguageCode = translationDto.LanguageCode,
                        Name = translationDto.Name,
                        Details = translationDto.Details,
                        Price = translationDto.Price,
                        Category = translationDto.Category
                    });
                }
            }

            await _eventRepository.UpdateEventAsync(eventItem);
            return new NoContentResult();
        }

        public async Task<ActionResult<IEnumerable<EventListResponseDto>>> GetAllEvents(ClaimsPrincipal user)
        {
            var userId = user?.FindFirst("id")?.Value;
            var events = await _eventRepository.GetAllEventsAsync();

            var response = new List<EventListResponseDto>();
            foreach (var eventItem in events)
            {
                bool isBooked = false;
                if (!string.IsNullOrEmpty(userId))
                {
                    isBooked = await _eventRepository.IsUserBookedForEventAsync(userId, eventItem.EventId);
                }

                response.Add(new EventListResponseDto
                {
                    Id = eventItem.EventId,
                    ImageUrl = eventItem.ImageUrl,
                    Date = eventItem.Date,
                    Venue = eventItem.Venue,
                    IsBooked = isBooked,
                    Translations = eventItem.Translations.Select(MapToTranslationDto).ToList()
                });
            }

            return new OkObjectResult(response);
        }

        public async Task<ActionResult<EventResponseDto>> GetEvent(int id, ClaimsPrincipal user)
        {
            var eventItem = await _eventRepository.GetEventByIdAsync(id);
            if (eventItem == null)
                return new NotFoundResult();

            var userId = user?.FindFirst("id")?.Value;
            bool isBooked = false;
            if (!string.IsNullOrEmpty(userId))
            {
                isBooked = await _eventRepository.IsUserBookedForEventAsync(userId, id);
            }

            var response = MapToResponseDto(eventItem);
            response.IsBooked = isBooked;
            return new OkObjectResult(response);
        }

        public async Task<IActionResult> DeleteEvent(int id)
        {
            var eventItem = await _eventRepository.GetEventByIdAsync(id);
            if (eventItem == null)
                return new NotFoundResult();

            await _eventRepository.DeleteEventAsync(eventItem);
            return new NoContentResult();
        }

        private async Task<(byte[], string)> ProcessImageUpload(IFormFile imageFile)
        {
            using var memoryStream = new MemoryStream();
            await imageFile.CopyToAsync(memoryStream);
            var photoBytes = memoryStream.ToArray();

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);

            if (string.IsNullOrEmpty(_env.WebRootPath))
                throw new InvalidOperationException("WebRootPath is not configured.");

            var filePath = Path.Combine(_env.WebRootPath, "images", "events", fileName);

            Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            await System.IO.File.WriteAllBytesAsync(filePath, photoBytes);

            return (photoBytes, fileName);
        }
        private string GetImageUrl(string fileName)
            => $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/images/events/{fileName}";

        private EventResponseDto MapToResponseDto(Event eventItem)
            => new EventResponseDto
            {
                Id = eventItem.EventId,
                ImageUrl = eventItem.ImageUrl,
                Date = eventItem.Date,
                Venue = eventItem.Venue,
                Translations = eventItem.Translations.Select(MapToTranslationDto).ToList()
            };

        private EventTranslationDto MapToTranslationDto(EventTranslation translation)
            => new EventTranslationDto
            {
                LanguageCode = translation.LanguageCode,
                Name = translation.Name,
                Details = translation.Details,
                Price = translation.Price,
                Category = translation.Category
            };
    }
}