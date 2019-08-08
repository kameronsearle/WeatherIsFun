using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace WeatherGovAPI
{
    public class WeatherGovClient
    {
        HttpClient httpClient;
        public WeatherGovClient()
        {
            httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri("https://api.weather.gov");
            httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/geo+json"));
            httpClient.DefaultRequestHeaders.Add("User-Agent", "StudentWeatherApp");
        }

        public async Task<Welcome> GetWelcome(string lat, string lon)
        {
            var requestUri = new Uri($"https://api.weather.gov/points/{lat},{lon}");
            var response = await httpClient.GetAsync(requestUri);
            if (response.IsSuccessStatusCode)
            {
                return Welcome.FromJson(await response.Content.ReadAsStringAsync());
            }
            else
            {
                Console.WriteLine($"Request failed, uri={requestUri.ToString()}");
            }

            return null;
        }

        public async Task<Forecast> GetForecastFromWelcome(Welcome welcome)
        {
            var requestUri = welcome.Properties.Forecast;
            var response = await httpClient.GetAsync(requestUri);
            if (response.IsSuccessStatusCode)
            {
                return Forecast.FromJson(await response.Content.ReadAsStringAsync());
            }

            return null;
        }
    }
}
