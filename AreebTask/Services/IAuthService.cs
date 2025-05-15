using AreebTask.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;

namespace AreebTask.Services
{
    public interface IAuthService
    {
        Task<IActionResult> RegisterUser(RegisterModel model);
        Task<IActionResult> RegisterAdmin(RegisterModel model);
        Task<IActionResult> Login(LoginModel model);
    }
}