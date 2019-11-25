---
title: Get model with REST call in C#
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 10/18/2019
ms.author: diberry
---

## Prerequisites

* Starter key.
* Import the [TravelAgent](https://github.com/Azure-Samples/cognitive-services-language-understanding/blob/master/documentation-samples/quickstarts/change-model/TravelAgent.json) app from the cognitive-services-language-understanding GitHub repository.
* The LUIS application ID for the imported TravelAgent app. The application ID is shown in the application dashboard.
* The version ID within the application that receives the utterances. The default ID is "0.1".
* [.NET Core V2.2+](https://dotnet.microsoft.com/download)
* [Visual Studio Code](https://code.visualstudio.com/)

## Example utterances JSON file

[!INCLUDE [Quickstart explanation of example utterance JSON file](get-started-get-model-json-example-utterances.md)]

## Get LUIS key

[!INCLUDE [Use authoring key for endpoint](../includes/get-key-quickstart.md)]

## Change model programmatically

Use C# to add a machine-learned entity [API](https://aka.ms/luis-apim-v3-authoring) to the application. 

1. Create a new console application targeting the C# language, with a project and folder name of `model-with-rest`. 

    ```console
    dotnet new console -lang C# -n model-with-rest
    ```

1. Install required dependencies with the following dotnet CLI commands.

    ```console
    dotnet add package System.Net.Http
    dotnet add package JsonFormatterPlus
    ```
1. Overwrite Program.cs with the following code:

    ```csharp
    using System;
    using System.IO;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using System.Linq;
    
    // 3rd party NuGet packages
    using JsonFormatterPlus;
    
    namespace AddUtterances
    {
        class Program
        {
            // NOTE: use your starter key value
            static string authoringKey = "YOUR-KEY";
    
            // NOTE: Replace this endpoint with your starter key endpoint
            // for example, westus.api.cognitive.microsoft.com
            static string endpoint = "YOUR-ENDPOINT";
    
            // NOTE: Replace this with the ID of your LUIS application
            static string appID = "YOUR-APP-ID";
    
            // NOTE: Replace this your version number
            static string appVersion = "0.1";
    
            static string host = String.Format("https://{0}/luis/authoring/v3.0-preview/apps/{1}/versions/{2}/", endpoint, appID, appVersion);
    
            // GET request with authentication
            async static Task<HttpResponseMessage> SendGet(string uri)
            {
                using (var client = new HttpClient())
                using (var request = new HttpRequestMessage())
                {
                    request.Method = HttpMethod.Get;
                    request.RequestUri = new Uri(uri);
                    request.Headers.Add("Ocp-Apim-Subscription-Key", authoringKey);
                    return await client.SendAsync(request);
                }
            }
            // POST request with authentication
            async static Task<HttpResponseMessage> SendPost(string uri, string requestBody)
            {
                using (var client = new HttpClient())
                using (var request = new HttpRequestMessage())
                {
                    request.Method = HttpMethod.Post;
                    request.RequestUri = new Uri(uri);
    
                    if (!String.IsNullOrEmpty(requestBody))
                    {
                        request.Content = new StringContent(requestBody, Encoding.UTF8, "text/json");
                    }
    
                    request.Headers.Add("Ocp-Apim-Subscription-Key", authoringKey);
                    return await client.SendAsync(request);
                }
            }        
            // Add utterances as string with POST request
            async static Task AddUtterances(string utterances)
            {
                string uri = host + "examples";
    
                var response = await SendPost(uri, utterances);
                var result = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Added utterances.");
                Console.WriteLine(JsonFormatter.Format(result));
            }
            // Train app after adding utterances
            async static Task Train()
            {
                string uri = host  + "train";
    
                var response = await SendPost(uri, null);
                var result = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Sent training request.");
                Console.WriteLine(JsonFormatter.Format(result));
            }    
            // Check status of training
            async static Task Status()
            {
                var response = await SendGet(host  + "train");
                var result = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Requested training status.");
                Console.WriteLine(JsonFormatter.Format(result));
            }    
            // Add utterances, train, check status
            static void Main(string[] args)
            {
                string utterances = @"
                [
                    {
                    'text': 'go to Seattle today',
                    'intentName': 'BookFlight',
                    'entityLabels': [
                        {
                        'entityName': 'Location::LocationTo',
                        'startCharIndex': 6,
                        'endCharIndex': 12
                        }
                    ]
                    },
                    {
                        'text': 'a barking dog is annoying',
                        'intentName': 'None',
                        'entityLabels': []
                    }
                ]
                ";            
                AddUtterances(utterances).Wait();
                Train().Wait();
                Status().Wait();
            }
        }
    }
    ```

1. Replace the following values:

    * `YOUR-KEY` with your starter key
    * `YOUR-ENDPOINT` with your endpoint, for example, `westus2.api.cognitive.microsoft.com`
    * `YOUR-APP-ID` with your app's ID

1. Build the console application. 

    ```console
    dotnet build
    ```

1. Run the console application. The console output displays the same JSON that you saw earlier in the browser window.

    ```console
    dotnet run
    ```

## LUIS keys

[!INCLUDE [Use authoring key for endpoint](../includes/starter-key-explanation.md)]

## Clean up resources

When you are finished with this quickstart, delete the file from the file system. 

## Next steps

> [!div class="nextstepaction"]
> [Best practices for an app](../luis-concept-best-practices.md)