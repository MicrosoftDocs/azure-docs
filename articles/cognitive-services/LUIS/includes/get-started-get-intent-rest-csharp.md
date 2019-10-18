---
title: Get prediction with REST call in C#
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 10/17/2019
ms.author: diberry
---

## Prerequisites

* [.NET Core V2.2+](https://dotnet.microsoft.com/download)
* Public app ID: df67dcdb-c37d-46af-88e1-8b97951ca1c2

## Get LUIS key

[!INCLUDE [Use authoring key for endpoint](..//includes/get-key-for-quickstart.md)]

## Get intent programmatically

Use C# to query the prediction endpoint GET [API](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78) to get the prediction result. 

1. Create a new console application targeting the C# language, with a project and folder name of `predict-with-rest`. 

    ```csharp
    dotnet new console -lang C# -n predict-with-rest
    ```

1. Install required dependencies with the following dotnet CLI commands.

    ```csharp
    dotnet add package System.Net.Http
    ```
1. Overwrite Program.cs with the following code:
    
   ```csharp
    using System;
    using System.Net.Http;
    using System.Web;
    
    namespace predict_with_rest
    {
        class Program
        {
            static void Main(string[] args)
            {
                var key = "YOUR-KEY";
                var endpoint = "westus2.api.cognitive.microsoft.com";
                var appId = "df67dcdb-c37d-46af-88e1-8b97951ca1c2"; //public sample app
    
                var utterance = "turn on the left light";
    
                MakeRequest(key, endpoint, appId, utterance);
    
                Console.WriteLine("Hit ENTER to exit...");
                Console.ReadLine();
            }
            static async void MakeRequest(string key, string endpoint, string appId, string utterance)
            {
                var client = new HttpClient();
                var queryString = HttpUtility.ParseQueryString(string.Empty);
    
                // The request header contains your subscription key
                client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);
    
                // The "q" parameter contains the utterance to send to LUIS
                queryString["query"] = utterance;
    
                // These optional request parameters are set to their default values
                queryString["verbose"] = "true";
                queryString["show-all-intents"] = "true";
                queryString["staging"] = "false";
                queryString["timezoneOffset"] = "0";
    
                var endpointUri = String.Format("https://{0}/luis/prediction/v3.0/apps/{1}/slots/production/predict?query={2}", endpoint, appId, queryString);
    
                var response = await client.GetAsync(endpointUri);
    
                var strResponseContent = await response.Content.ReadAsStringAsync();
                
                // Display the JSON result from LUIS
                Console.WriteLine(strResponseContent.ToString());
            }
        }
    }

   ```

1. Replace the value of `YOUR-KEY` with your LUIS key.

1. Build the console application. 

    ```csharp
    dotnet build
    ```

1. Run the console application. The console output displays the same JSON that you saw earlier in the browser window.

    ```csharp
    dotnet build
    ```

1. Review prediction response in JSON format:

    ```console
    Hit ENTER to exit...
    {"query":"query=turn on the left light","prediction":{"topIntent":"HomeAutomation.TurnOn","intents":{"HomeAutomation.TurnOn":{"score":0.219572827},"None":{"score":0.1371486},"HomeAutomation.TurnOff":{"score":0.0241389349}},"entities":{}}}
    ```

    The JSON response formatted for readability: 

    ```JSON
    {
        "query": "query=turn on the left light",
        "prediction": {
            "topIntent": "HomeAutomation.TurnOn",
            "intents": {
                "HomeAutomation.TurnOn": {
                    "score": 0.219572827
                },
                "None": {
                    "score": 0.1371486
                },
                "HomeAutomation.TurnOff": {
                    "score": 0.0241389349
                }
            },
            "entities": {}
        }
    }
    ```
## LUIS keys

[!INCLUDE [Use authoring key for endpoint](..//includes/starter-key-explanation.md)]

## Clean up resources

When you are finished with this quickstart, delete the project directory from the file system. 

## Next steps

> [!div class="nextstepaction"]
> [Add utterances and train with C#](../luis-get-started-cs-add-utterance.md)