---
title: Call a Language Understanding Intelligent Services (LUIS) app using C# | Microsoft Docs 
description: Learn to call a LUIS app using C#. 
services: cognitive-services
author: DeniseMak
manager: rstand

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 09/29/2017
ms.author: v-demak
---

# Call a LUIS app using C#

This Quickstart shows you how to call your Language Understanding Intelligent Service (LUIS) app in just a few minutes. When you're finished, you'll be able to use C# code to pass utterances to a LUIS endpoint and get results.

## Before you begin
You need a Cognitive services API key to make calls to the sample LUIS app we use in this walkthrough. 
To get an API key follow these steps: 
  1. You first need to create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  2. Log in to the Azure portal at https://portal.azure.com. 
  3. Follow the steps in [Creating Subscription Keys using Azure](./AzureIbizaSubscription.md) to get a key.
  4. Go back to https://www.luis.ai and log in using your Azure account. 

## Understand what LUIS returns

To understand what a LUIS app returns, you can paste the URL of a sample LUIS app into a browser window. The sample app you'll use is an IoT app that detects whether the user wants to turn on or turn off lights.

1. The endpoint of the sample app is in this format: `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/60340f5f-99c1-4043-8ab9-c810ff16252d?subscription-key=<YOUR_API_KEY>&verbose=false&q=turn%20on%20the%20left%20light`. Copy the URL and substitute your subscription key for the value of the `subscription-key` field.
2. Paste the URL into a browser window and press Enter. The browswer displays a JSON result that indicates that LUIS detects the `TurnOn` intent and the `Light` entity with the value `left`.

    ![JSON result detects the intent TurnOn](./media/luis-get-started-node-get-intent/json-turn-on-left.png)
3. Change the value of the `q=` parameter in the URL to `turn off the floor light`, and press enter. The result now indicates that the LUIS detected the `TurnOff` intent and the `Light` entity with value `floor`. 

    ![JSON result detects the intent TurnOff](./media/luis-get-started-node-get-intent/json-turn-off-floor.png)


## Consume a LUIS result using the Endpoint API with C# 

You can use C# to access to the same results you saw in the browser window in the previous step. 
1. Create a new console application in Visual Studio. Copy the code that follows and save it into an .cs file:

```cs
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

```
2. Replace the value of the `subscriptionKey` variable with your LUIS subscription key.

3. In the Visual Studio project, add a reference to **System.Web**.

4. Run the console application. It displays the same JSON that you saw earlier in the browser window.

![Console window displays JSON result from LUIS](./media/luis-get-started-cs-get-intent/console-turn-on.png)

## Next steps

* Try adding a parameter to the code to test some other utterances to the sample app.
