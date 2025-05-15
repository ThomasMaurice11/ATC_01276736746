using AreebTask.DTOs.Auth;
using AreebTask.Services;
using Microsoft.AspNetCore.Mvc;

namespace AreebTask.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("RegisterUser")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid registration details");

            return await _authService.RegisterUser(model);
        }

        [HttpPost("RegisterAdmin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid registration details");

            return await _authService.RegisterAdmin(model);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid login details.");

            return await _authService.Login(model);
        }
    }
}