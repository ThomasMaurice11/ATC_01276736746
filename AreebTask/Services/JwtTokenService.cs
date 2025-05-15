using AreebTask.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AreebTask.Services
{
    public class JwtTokenService
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _contextAccessor;

        public JwtTokenService(IConfiguration configuration, UserManager<ApplicationUser> userManager, IHttpContextAccessor contextAccessor)
        {
            _configuration = configuration;
            _userManager = userManager;
            _contextAccessor = contextAccessor;
        }


        public string GetUserIdFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.UniqueName)?.Value;

            return userId;
        }







        public async Task<string> GenerateToken(ApplicationUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Id),
            new Claim("id", user.Id),
             new Claim("userName", user.UserName),



        };

            claims.AddRange(userClaims);
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);


            var token = new JwtSecurityToken(
                 issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddYears(100),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
