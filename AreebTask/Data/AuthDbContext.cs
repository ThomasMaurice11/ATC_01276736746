using AreebTask.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace AreebTask.Data
{
    public class AuthDbContext : IdentityDbContext<ApplicationUser>
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options)
            : base(options) { }

        public DbSet<Event> Events { get; set; }
        public DbSet<EventTranslation> EventTranslations { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure relationships and constraints
            builder.Entity<Event>()
                .HasMany(e => e.Translations)
                .WithOne(t => t.Event)
                .HasForeignKey(t => t.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Event>()
                .HasMany(e => e.Bookings)
                .WithOne(b => b.Event)
                .HasForeignKey(b => b.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            
        }
    }
}