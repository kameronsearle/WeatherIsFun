using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Net.Http;

namespace WeatherIsFun
{
    public class ApiClass
    {
        //this is where John and I create a class to create an API connection for Aaron's JS file to query with

        public static HttpClient httpClient;
        public static Uri weatherUri;
        public static string ApiKey;

        public ApiClass()
        {
            httpClient = new HttpClient();
            weatherUri = new Uri("https://api.weatherbit.io/v2.0/forecast/3hourly?");
            ApiKey = "3fc84cd75954400286c2a01862d36683";

            httpClient.BaseAddress = weatherUri;
            httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        public void Test()
        {
            Console.WriteLine("TESTTTTTT");
        }
        
        public string getWeatherByCityName(string city)
        {
            string cityString = "city=" + city + ",NC&key=" + ApiClass.ApiKey;
            
            Uri cityUri = new Uri(cityString);
            Uri newUri = new Uri(ApiClass.weatherUri, cityUri);
            
            //do the request here
            //then return it

            return null;
        }

    }
}
