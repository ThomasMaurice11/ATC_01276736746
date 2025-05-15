using AreebTask.DTOs.Events;
using AreebTask.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AreebTask.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EventResponseDto>> CreateEvent([FromForm] EventBasicCreateDto eventDto)
            => await _eventService.CreateEvent(eventDto);

        [HttpPost("{eventId}/translations")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EventResponseDto>> AddEventTranslation(int eventId, [FromBody] EventTranslationDto translationDto)
            => await _eventService.AddEventTranslation(eventId, translationDto);

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEvent(int id, [FromForm] EventUpdateDto eventDto)
            => await _eventService.UpdateEvent(id, eventDto);

        [HttpPut("UpdateTranslations/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEventTranslations(int id, [FromBody] List<EventTranslationUpdateDto> translations)
            => await _eventService.UpdateEventTranslations(id, translations);

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventListResponseDto>>> GetAllEvents()
            => await _eventService.GetAllEvents(User);

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<EventResponseDto>> GetEvent(int id)
            => await _eventService.GetEvent(id, User);

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEvent(int id)
            => await _eventService.DeleteEvent(id);
    }
}