using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Definicje tabel
        public DbSet<User> Users { get; set; }
        public DbSet<Benefit> Benefits { get; set; }
        public DbSet<BenefitRequest> BenefitRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Mapowanie enumów na tekst w PostgreSQL (żeby w bazie było widać np. 'employee')
            modelBuilder.Entity<User>()
                .Property(u => u.role)
                .HasConversion<string>();

            modelBuilder.Entity<BenefitRequest>()
                .Property(r => r.status)
                .HasConversion<string>();
        }
    }
}