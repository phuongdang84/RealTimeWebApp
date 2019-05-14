using System;
using System.Threading.Tasks;
using WebService.Extensions;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace WebService.Controllers
{
    public class ApiController : Controller
    {
        private readonly EnvironmentSocketManager _socketManager;

        public ApiController(EnvironmentSocketManager socketManager)
        {
            _socketManager = socketManager;
        }

        public async Task Report(double liqTemperature, double liqMoisture, double liqHumidity)
        {
            var reading = new
            {
                Date = DateTime.Now,
                LiquidTemp = liqTemperature,
                LiquidMois = liqMoisture,
                LiquidHum = liqHumidity
            };

            await _socketManager.SendMessageToAllAsync(JsonConvert.SerializeObject(reading));
        }

        public async Task Generate()
        {
            var rnd = new Random();

            for (var i = 0; i < 100; i++)
            {
                await Report(rnd.Next(23, 35), rnd.Next(13, 85), rnd.Next(13, 45));
                await Task.Delay(5000);
            }
        }
    }
}