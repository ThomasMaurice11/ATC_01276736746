using AreebTask.Models;
using Microsoft.AspNetCore.Identity;

namespace AreebTask.Repositories
{
    public interface IAuthRepository
    {
        Task<IdentityResult> CreateUserAsync(ApplicationUser user, string password);
        Task<ApplicationUser> FindUserByNameAsync(string username);
        Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
        Task<IdentityResult> AddToRoleAsync(ApplicationUser user, string role);
    }
}