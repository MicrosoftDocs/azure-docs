---
title: Quickstart learning how to call a Language Understanding (LUIS) prediction endpoint using C# - Azure Cognitive Services | Microsoft Docs
description: In this quickstart, to get a LUIS prediction response, query a public IoT app's endpoint using C# . The prediction response includes the primary intent of the text and extracts any meaningful data from the text. 
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 08/07/2018
ms.author: diberry
#Customer intent: As a developer new to LUIS, I want to query the LUIS endpoint of a published model using C# so that I can see the JSON prediction response. 
---

# Quickstart: Call a LUIS prediction endpoint using C#

In this quickstart, to get a LUIS prediction response, query a public IoT app's endpoint using C# . The prediction response includes the primary intent of the text and extracts any meaningful data from the text. 

This quickstart uses the endpoint REST API. Refer to the [endpoint API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78) for more information.

For this article, you need a free [LUIS](http://www.luis.ai) account. 

<a name="create-luis-subscription-key"></a>

## Get LUIS key

Access to the prediction endpoint is provided with an endpoint key. For the purposes of this quickstart, use the free starter key associated with your LUIS account. 
 
1. Sign in using your LUIS account. 

    [![Screenshot of Language Understanding (LUIS) app list](media/luis-get-started-cs-get-intent/app-list.png "Screenshot of Language Understanding (LUIS) app list")](media/luis-get-started-cs-get-intent/app-list.png)

2. Select your name in the top right menu, then select **Settings**.

    ![LUIS user settings menu access](media/luis-get-started-cs-get-intent/get-user-settings-in-luis.png)

3. Copy the value of the **Authoring key**. You will use it later in the quickstart. 

    [![Screenshot of Language Understanding (LUIS) user settings](media/luis-get-started-cs-get-intent/get-user-authoring-key.png "Screenshot of Language Understanding (LUIS) user settings")](media/luis-get-started-cs-get-intent/get-user-authoring-key.png)

    The authoring key allows free unlimited requests to the authoring API and up to 1000 queries to the prediction endpoint API per month for all your LUIS apps. 

## Call prediction endpoint with browser

To understand what a LUIS prediction endpoint returns, view a prediction result in a web browser. In order to query a public app, you need your own key and the app ID. The public IoT app ID, `df67dcdb-c37d-46af-88e1-8b97951ca1c2`, is provided as part of the URL in step one.

1. The endpoint of the public IoT app is in this format: `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/df67dcdb-c37d-46af-88e1-8b97951ca1c2?subscription-key=<YOUR_API_KEY>&q=turn%20on%20the%20bedroom%20light`

    Copy the URL and substitute your key for the value of `<YOUR_API_KEY>`.

2. Paste the URL into a browser window and press Enter. The browser displays a JSON result that indicates that LUIS detects the `HomeAutomation.TurnOn` intent as the top intent and the `HomeAutomation.Room` entity with the value `bedroom`.

    ```JSON
    {
      "query": "turn on the bedroom light",
      "topScoringIntent": {
        "intent": "HomeAutomation.TurnOn",
        "score": 0.809439957
      },
      "entities": [
        {
          "entity": "bedroom",
          "type": "HomeAutomation.Room",
          "startIndex": 12,
          "endIndex": 18,
          "score": 0.8065475
        }
      ]
    }
    ```

3. Change the value of the `q=` parameter in the URL to `turn off the living room light`, and press Enter. The result now indicates that LUIS detected the `HomeAutomation.TurnOff` intent as the top intent and the `HomeAutomation.Room` entity with value `living room`. 

    ```JSON
    {
      "query": "turn off the living room light",
      "topScoringIntent": {
        "intent": "HomeAutomation.TurnOff",
        "score": 0.984057844
      },
      "entities": [
        {
          "entity": "living room",
          "type": "HomeAutomation.Room",
          "startIndex": 13,
          "endIndex": 23,
          "score": 0.9619945
        }
      ]
    }
    ```

## Call prediction endpoint with C# 

Use C# to query the prediction endpoint GET [API](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78) to get the same results as you saw in the browser window in the previous section. 

1. Create a new console application in Visual Studio. 

    ![LUIS user settings menu access](media/luis-get-started-cs-get-intent/visual-studio-console-app.png)

2. In the Visual Studio project, in the Solutions Explorer, select **Add reference**, then select **System.Web** from the Assemblies tab.

    ![LUIS user settings menu access](media/luis-get-started-cs-get-intent/add-system-dot-web-to-project.png)

3. Overwrite Program.cs with the following code:
    
   [!code-csharp[Console app code that calls a LUIS endpoint](~/samples-luis/documentation-samples/endpoint-api-samples/csharp/Program.cs)]

4. Replace the value of `YOUR_SUBSCRIPTION_KEY` with your LUIS key.

5. Build and run the console application. It displays the same JSON that you saw earlier in the browser window.

    ![Console window displays JSON result from LUIS](./media/luis-get-started-cs-get-intent/console-turn-on.png)

## Clean up resources

When you are finished with this quickstart, close the Visual Studio project and remove the project directory from the file system. 

## Next steps

> [!div class="nextstepaction"]
> [Add utterances and train with C#](luis-get-started-cs-add-utterance.md)