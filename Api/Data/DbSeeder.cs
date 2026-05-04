using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        if (!await context.Users.AnyAsync())
        {
            var users = new List<User>
            {
                new User
                {
                    first_name = "Admin",
                    last_name = "System",
                    login = "000",
                    password_hash = "1",
                    role = UserRole.administrator,
                    points = 1000,
                    active = true
                },

                new User { first_name = "Jan", last_name = "Kowalski", login = "001", password_hash = "1", role = UserRole.employee, points = 200, active = true },
                new User { first_name = "Piotr", last_name = "Zieliński", login = "002", password_hash = "1", role = UserRole.employee, points = 150, active = true },
                new User { first_name = "Kasia", last_name = "Wiśniewska", login = "003", password_hash = "1", role = UserRole.employee, points = 300, active = true },
                new User { first_name = "Marek", last_name = "Wójcik", login = "004", password_hash = "1", role = UserRole.employee, points = 50, active = true },
                new User { first_name = "Ewa", last_name = "Kamińska", login = "005", password_hash = "1", role = UserRole.employee, points = 420, active = true },
                new User { first_name = "Tomasz", last_name = "Lewandowski", login = "006", password_hash = "1", role = UserRole.employee, points = 90, active = true },
                new User { first_name = "Ola", last_name = "Dąbrowska", login = "007", password_hash = "1", role = UserRole.employee, points = 260, active = true },
                new User { first_name = "Paweł", last_name = "Kaczmarek", login = "008", password_hash = "1", role = UserRole.employee, points = 120, active = true }
            };

            context.Users.AddRange(users);
            await context.SaveChangesAsync();
        }

        if (!await context.Benefits.AnyAsync())
        {
            var benefits = new List<Benefit>
            {
                new Benefit { name = "Karta sportowa", cost_points = 100, active = true },
                new Benefit { name = "Bilet do kina", cost_points = 50, active = true },
                new Benefit { name = "Voucher 100 zł", cost_points = 300, active = true },
                new Benefit { name = "Dodatkowy dzień wolny", cost_points = 400, active = true },
                new Benefit { name = "Lunch firmowy", cost_points = 80, active = true },
                new Benefit { name = "Kurs online", cost_points = 250, active = true },
                new Benefit { name = "Pakiet medyczny", cost_points = 350, active = true },
                new Benefit { name = "Dofinansowanie do okularów", cost_points = 180, active = true }
            };

            context.Benefits.AddRange(benefits);
            await context.SaveChangesAsync();
        }

        if (!await context.BenefitRequests.AnyAsync())
        {
            var users = await context.Users.ToListAsync();
            var benefits = await context.Benefits.ToListAsync();

            var u001 = users.First(u => u.login == "001");
            var u002 = users.First(u => u.login == "002");
            var u003 = users.First(u => u.login == "003");
            var u004 = users.First(u => u.login == "004");
            var u005 = users.First(u => u.login == "005");
            var u006 = users.First(u => u.login == "006");
            var u007 = users.First(u => u.login == "007");
            var u008 = users.First(u => u.login == "008");

            var karta = benefits.First(b => b.name == "Karta sportowa");
            var kino = benefits.First(b => b.name == "Bilet do kina");
            var voucher = benefits.First(b => b.name == "Voucher 100 zł");
            var dzienWolny = benefits.First(b => b.name == "Dodatkowy dzień wolny");
            var lunch = benefits.First(b => b.name == "Lunch firmowy");
            var kurs = benefits.First(b => b.name == "Kurs online");
            var medyczny = benefits.First(b => b.name == "Pakiet medyczny");
            var okulary = benefits.First(b => b.name == "Dofinansowanie do okularów");

            var requests = new List<BenefitRequest>
            {
                new BenefitRequest
                {
                    user_id = u001.id,
                    benefit_id = kino.id,
                    status = RequestStatus.approved,
                    request_date = DateTime.UtcNow.AddDays(-12),
                    decision_date = DateTime.UtcNow.AddDays(-11)
                },
                new BenefitRequest
                {
                    user_id = u001.id,
                    benefit_id = karta.id,
                    status = RequestStatus.pending,
                    request_date = DateTime.UtcNow.AddDays(-2)
                },
                new BenefitRequest
                {
                    user_id = u002.id,
                    benefit_id = voucher.id,
                    status = RequestStatus.rejected,
                    request_date = DateTime.UtcNow.AddDays(-10),
                    decision_date = DateTime.UtcNow.AddDays(-9)
                },
                new BenefitRequest
                {
                    user_id = u003.id,
                    benefit_id = kurs.id,
                    status = RequestStatus.approved,
                    request_date = DateTime.UtcNow.AddDays(-8),
                    decision_date = DateTime.UtcNow.AddDays(-7)
                },
                new BenefitRequest
                {
                    user_id = u004.id,
                    benefit_id = lunch.id,
                    status = RequestStatus.pending,
                    request_date = DateTime.UtcNow.AddDays(-1)
                },
                new BenefitRequest
                {
                    user_id = u005.id,
                    benefit_id = dzienWolny.id,
                    status = RequestStatus.approved,
                    request_date = DateTime.UtcNow.AddDays(-20),
                    decision_date = DateTime.UtcNow.AddDays(-18)
                },
                new BenefitRequest
                {
                    user_id = u006.id,
                    benefit_id = medyczny.id,
                    status = RequestStatus.rejected,
                    request_date = DateTime.UtcNow.AddDays(-6),
                    decision_date = DateTime.UtcNow.AddDays(-5)
                },
                new BenefitRequest
                {
                    user_id = u007.id,
                    benefit_id = okulary.id,
                    status = RequestStatus.pending,
                    request_date = DateTime.UtcNow.AddDays(-3)
                },
                new BenefitRequest
                {
                    user_id = u008.id,
                    benefit_id = karta.id,
                    status = RequestStatus.approved,
                    request_date = DateTime.UtcNow.AddDays(-15),
                    decision_date = DateTime.UtcNow.AddDays(-14)
                }
            };

            context.BenefitRequests.AddRange(requests);
            await context.SaveChangesAsync();
        }
    }
}
