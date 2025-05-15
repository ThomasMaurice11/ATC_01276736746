using AreebTask.DTOs.Events;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AreebTask.Services
{
    public interface IEventService
    {
        Task<ActionResult<EventResponseDto>> CreateEvent([FromForm] EventBasicCreateDto eventDto);
        Task<ActionResult<EventResponseDto>> AddEventTranslation(int eventId, EventTranslationDto translationDto);
        Task<IActionResult> UpdateEvent(int id, [FromForm] EventUpdateDto eventDto);
        Task<IActionResult> UpdateEventTranslations(int id, List<EventTranslationUpdateDto> translations);
        Task<ActionResult<IEnumerable<EventListResponseDto>>> GetAllEvents(ClaimsPrincipal user);
        Task<ActionResult<EventResponseDto>> GetEvent(int id, ClaimsPrincipal user);
        Task<IActionResult> DeleteEvent(int id);
    }
}