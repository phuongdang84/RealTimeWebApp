using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Application.Pages
{
    public class HistoryModel : PageModel
    {
        public string Message { get; set; }

        public void OnGet()
        {
            Message = "Your watering history page.";
        }
    }
}
