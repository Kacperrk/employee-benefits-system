using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    public enum UserRole { employee, administrator }
    public enum RequestStatus { pending, approved, rejected }

    [Table("users")]
    public class User
    {
        [Key]
        public int id { get; set; }
        public string first_name { get; set; } = string.Empty;
        public string last_name { get; set; } = string.Empty;
        public string login { get; set; } = string.Empty;
        public string password_hash { get; set; } = string.Empty;
        public UserRole role { get; set; }
        public int points { get; set; } = 0;
        public bool active { get; set; } = true;
    }

    [Table("benefits")]
    public class Benefit
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; } = string.Empty;
        public int cost_points { get; set; }
        public bool active { get; set; } = true;
    }

    [Table("benefit_requests")]
    public class BenefitRequest
    {
        [Key]
        public int id { get; set; }
        public int user_id { get; set; }
        public int benefit_id { get; set; }
        public RequestStatus status { get; set; } = RequestStatus.pending;
        public DateTime request_date { get; set; } = DateTime.UtcNow;
        public DateTime? decision_date { get; set; }

        [ForeignKey("user_id")]
        public User? User { get; set; }

        [ForeignKey("benefit_id")]
        public Benefit? Benefit { get; set; }
    }
}