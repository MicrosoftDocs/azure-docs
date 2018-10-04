---
title: Java Quickstart - predict intent - LUIS
titleSuffix: Azure Cognitive Services
description: In this quickstart, use an available public LUIS app to determine a user's intention from conversational text. Using Java, send the user's intention as text to the public app's HTTP prediction endpoint. At the endpoint, LUIS applies the public app's model to analyze the natural language text for meaning, determining overall intent and extracting data relevant to the app's subject domain.  
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 09/10/2018
ms.author: diberry
#Customer intent: As a developer new to LUIS, I want to query the endpoint of a published model using Java. 
---

# Quickstart: Get intent using Java

[!INCLUDE [Quickstart introduction for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

<a name="create-luis-subscription-key"></a>

## Prerequisites

* [JDK SE](http://www.oracle.com/technetwork/java/javase/downloads/index.html)  (Java Development Kit, Standard Edition)
* [Visual Studio Code](https://code.visualstudio.com/)
* Public app ID: df67dcdb-c37d-46af-88e1-8b97951ca1c2


[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-luis-repo-note.md)]

## Get LUIS key

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-get-key-para.md)]

## Get intent with browser

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-browser-para.md)]

## Get intent programmatically 

You can use Java to access the same results you saw in the browser window in the previous step. 

1. Copy the following code to create a class in a file named `LuisGetRequest.java`:

   [!code-java[Console app code that calls a LUIS endpoint](~/samples-luis/documentation-samples/quickstarts/analyze-text/java/call-endpoint.java)]

2. Replace the value of the `YOUR-KEY` variable with your LUIS key.

3. Compile the java program with `javac -cp ":lib/*" LuisGetRequest.java`. 

4. Run the application with `java -cp ":lib/*" LuisGetRequest.java`. It displays the same JSON that you saw earlier in the browser window.

    ![Console window displays JSON result from LUIS](./media/luis-get-started-java-get-intent/console-turn-on.png)
    
## LUIS keys

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-key-usage-para.md)]

## Clean up resources

Delete the Java file. 

## Next steps
> [!div class="nextstepaction"]
> [Add utterances](luis-get-started-java-add-utterance.md)