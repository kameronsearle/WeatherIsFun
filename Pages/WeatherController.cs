using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Geocoding;
using Geocoding.Google;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using OpenWeatherMap.Standard;
using WeatherGovAPI;

namespace WeatherIsFun.Pages
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        // Example: api/Weather/Layton%20Utah
        [HttpGet("{address}", Name = "WeatherLookup")]
        public async Task<string> Get(string address)
        {
            try
            {
                Console.WriteLine("Getting by address");
                IGeocoder geocoder = new GoogleGeocoder() { ApiKey = "AIzaSyAZU4WGweBjNGS3l-a_i81SlD2OtgqggSw" };
                IEnumerable<Address> addresses = await geocoder.GeocodeAsync(address);
                var googleAddress = addresses.First();
                Console.WriteLine($"Found coordinates for address " +
                    $"Lat: {googleAddress.Coordinates.Latitude} " +
                    $"Long: {googleAddress.Coordinates.Longitude}");

                var weatherClient = new WeatherGovClient();
                var welcome = await weatherClient.GetWelcome(googleAddress.Coordinates.Latitude.ToString(),
                    googleAddress.Coordinates.Longitude.ToString());

                if (welcome == null)
                {
                    return "{\"success\": false, \"message\": \"failed to get welcome\"}";
                }

                var forecast = await weatherClient.GetForecastFromWelcome(welcome);

                if (forecast == null)
                {
                    return "{\"success\": false, \"message\": \"failed to get forecast\"}";
                }


                return forecast.ToJSON();
            }
            catch (Exception e)
            {
                // default error message
                return $"{{\"success\": false, \"message\": \"{e.Message}\"}}";
            }

        }
    }
}
