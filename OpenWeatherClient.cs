using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Net.Http;

namespace WeatherIsFun
{
    public class OpenWeatherClient
    {
        //this is where John and I create a class to create an API connection for Aaron's JS file to query with

        public static HttpClient httpClient;
        public static Uri weatherUri;
        public static string ApiKey;

        public OpenWeatherClient()
        {
            httpClient = new HttpClient();
            // weatherUri = new Uri("https://api.weatherbit.io/v2.0/current?");
            weatherUri = new Uri("https://api.openweathermap.org/data/2.5/forecast?q=");
            ApiKey = "be9480de0e2a569cdce658cd82879182";

            httpClient.BaseAddress = weatherUri;
            httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            
        }

        public void Test()
        {
            Console.WriteLine("TESTTTTTT");
        }
        

        public async Task<string> getForecastByLatLong(string lat, string lon)
        {
            UriBuilder uriBuilder = new UriBuilder("https://samples.openweathermap.org/data/2.5/forecast");
            uriBuilder.Query = $"lat={lat}&lon={lon}&APPID={ApiKey}";
            HttpResponseMessage resp = await httpClient.GetAsync(uriBuilder.Uri);

            if (resp.IsSuccessStatusCode)
            {
                return await resp.Content.ReadAsStringAsync();
            }
            return "{success:false}";
        }

    }
}
