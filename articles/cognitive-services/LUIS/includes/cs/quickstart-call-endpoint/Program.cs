using System;
using System.Net.Http;
using System.Web;

namespace ConsoleLuisEndpointSample
{
    class Program
    {
        static void Main(string[] args)
        {
            MakeRequest();
            Console.WriteLine("Hit ENTER to exit...");
            Console.ReadLine();
        }

        static async void MakeRequest()
        {
            var client = new HttpClient();
            var queryString = HttpUtility.ParseQueryString(string.Empty);

            // This app ID is for a public sample app that recognizes requests to turn on and turn off lights
            var luisAppId = "60340f5f-99c1-4043-8ab9-c810ff16252d";
            var subscriptionKey = "YOUR_SUBSCRIPTION_KEY";

            // The request header contains your subscription key
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

            // The "q" parameter contains the utterance to send to LUIS
            queryString["q"] = "turn on the left light";

            // These optional request parameters are set to their default values
            queryString["timezoneOffset"] = "0";
            queryString["verbose"] = "false";
            queryString["spellCheck"] = "false";
            queryString["staging"] = "false";

            var uri = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/" + luisAppId + "?" + queryString;
            var response = await client.GetAsync(uri);

            var strResponseContent = await response.Content.ReadAsStringAsync();
            
            // Display the JSON result from LUIS
            Console.WriteLine(strResponseContent.ToString());
        }
    }
}