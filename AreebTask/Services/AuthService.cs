using AreebTask.DTOs.Auth;
using AreebTask.Models;
using AreebTask.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace AreebTask.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly JwtTokenService _jwtTokenService;

        public AuthService(IAuthRepository authRepository, JwtTokenService jwtTokenService)
        {
            _authRepository = authRepository;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<IActionResult> RegisterUser(RegisterModel model)
        {
            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email
            };

            var result = await _authRepository.CreateUserAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _authRepository.AddToRoleAsync(user, "User");
                return new OkObjectResult(new
                {
                    success = true,
                    message = "User registered successfully"
                });
            }

            return new BadRequestObjectResult(result.Errors);
        }

        public async Task<IActionResult> RegisterAdmin(RegisterModel model)
        {
            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email
            };

            var result = await _authRepository.CreateUserAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _authRepository.AddToRoleAsync(user, "Admin");
                return new OkObjectResult(new
                {
                    success = true,
                    message = "admin registered successfully"
                });
            }

            return new BadRequestObjectResult(result.Errors);
        }

        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _authRepository.FindUserByNameAsync(model.Username);

            if (user != null && await _authRepository.CheckPasswordAsync(user, model.Password))
            {
                var token = await _jwtTokenService.GenerateToken(user);
                return new OkObjectResult(new { Token = token });
            }

            return new UnauthorizedObjectResult("Invalid username or password.");
        }
    }
}