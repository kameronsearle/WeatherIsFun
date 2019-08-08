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
            // weatherUri = new Uri("https://api.weatherbit.io/v2.0/current?");
            weatherUri = new Uri("https://api.openweathermap.org/data/2.5/forecast?q=");
            //ApiKey = "6ee32fcf7b6f047c765508d65a86eebf";
            //ApiKey = "b9ece6529f842e2c6c1df682183c4f3a";
            ApiKey = "886705b4c1182eb1c69f28eb8c520e20";

            httpClient.BaseAddress = weatherUri;
            httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        public void Test()
        {
            Console.WriteLine("TESTTTTTT");
        }
        
        public string getWeatherByCityName(string city)
        {
            string complete = "city="+ city +",US&appid=" + ApiClass.ApiKey;
            
            Uri cityUri = new Uri(complete);           
            Uri newUri = new Uri(ApiClass.weatherUri, cityUri);
            

            //do the request here
            //then return it

            return null;
        }

        private async Task<string> createProductAsync(string path)
        {
            Uri pathUri = new Uri(path);
            string result = "";
            HttpResponseMessage resp = await httpClient.GetAsync(pathUri);

            if (resp.IsSuccessStatusCode)
            {
                //result = resp.Content;
            }
            return "";
        }

    }
}
