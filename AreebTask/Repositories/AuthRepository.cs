using AreebTask.Models;
using Microsoft.AspNetCore.Identity;

namespace AreebTask.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthRepository(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<IdentityResult> CreateUserAsync(ApplicationUser user, string password)
            => await _userManager.CreateAsync(user, password);

        public async Task<ApplicationUser> FindUserByNameAsync(string username)
            => await _userManager.FindByNameAsync(username);

        public async Task<bool> CheckPasswordAsync(ApplicationUser user, string password)
            => await _userManager.CheckPasswordAsync(user, password);

        public async Task<IdentityResult> AddToRoleAsync(ApplicationUser user, string role)
            => await _userManager.AddToRoleAsync(user, role);
    }
}