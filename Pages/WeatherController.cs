using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Geocoding;
using Geocoding.Google;
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

        [HttpGet("{address}", Name = "Get")]
        public async Task<string> Get(string address)
        {
            IGeocoder geocoder = new GoogleGeocoder() { ApiKey = "AIzaSyAZU4WGweBjNGS3l-a_i81SlD2OtgqggSw" };
            IEnumerable<Address> addresses = await geocoder.GeocodeAsync(address);
            
            return "";
        }
    }
}
