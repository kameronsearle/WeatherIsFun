using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WeatherIsFun.Pages
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        // GET: 3
        [HttpGet("{state}/{city}", Name = "Get")]
        public string Get(string state, string city)
        {
            ApiClass api = new ApiClass();
            api.getWeatherByCityName("Layton", "UT");
            return state + city;
        }
    }
}
