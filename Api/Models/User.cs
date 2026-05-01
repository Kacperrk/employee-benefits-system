using Microsoft.EntityFrameworkCore;

namespace Api.Models; // Zauważ dopisek .Models

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
}