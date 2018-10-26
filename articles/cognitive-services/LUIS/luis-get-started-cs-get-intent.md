---
title: C# Quickstart - predict intent - LUIS
titleSuffix: Azure Cognitive Services
description: In this quickstart, use an available public LUIS app to determine a user's intention from conversational text. Using C#, send the user's intention as text to the public app's HTTP prediction endpoint. At the endpoint, LUIS applies the public app's model to analyze the natural language text for meaning, determining overall intent and extracting data relevant to the app's subject domain.  
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 09/10/2018
ms.author: diberry
#Customer intent: As an API or REST developer new to the LUIS service, I want to query the LUIS endpoint of a published model using C# so that I can see the JSON prediction response.
---

# Quickstart: Get intent using C#

[!INCLUDE [Quickstart introduction for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

<a name="create-luis-subscription-key"></a>

## Prerequisites

* [Visual Studio Community 2017 edition](https://visualstudio.microsoft.com/vs/community/)
* C# programming language (included with VS Community 2017)
* Public app ID: df67dcdb-c37d-46af-88e1-8b97951ca1c2


[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-luis-repo-note.md)]

## Get LUIS key

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-get-key-para.md)]

## Get intent with browser

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-browser-para.md)]

## Get intent programmatically

Use C# to query the prediction endpoint GET [API](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78) to get the same results as you saw in the browser window in the previous section. 

1. Create a new console application in Visual Studio. 

    ![LUIS user settings menu access](media/luis-get-started-cs-get-intent/visual-studio-console-app.png)

2. In the Visual Studio project, in the Solutions Explorer, select **Add reference**, then select **System.Web** from the Assemblies tab.

    ![LUIS user settings menu access](media/luis-get-started-cs-get-intent/add-system-dot-web-to-project.png)

3. Overwrite Program.cs with the following code:
    
   [!code-csharp[Console app code that calls a LUIS endpoint](~/samples-luis/documentation-samples/quickstarts/analyze-text/csharp/Program.cs)]

4. Replace the value of `YOUR_KEY` with your LUIS key.

5. Build and run the console application. It displays the same JSON that you saw earlier in the browser window.

    ![Console window displays JSON result from LUIS](./media/luis-get-started-cs-get-intent/console-turn-on.png)

## LUIS keys

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-key-usage-para.md)]

## Clean up resources

When you are finished with this quickstart, close the Visual Studio project and remove the project directory from the file system. 

## Next steps

> [!div class="nextstepaction"]
> [Add utterances and train with C#](luis-get-started-cs-add-utterance.md)