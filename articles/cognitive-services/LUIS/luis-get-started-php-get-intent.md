---
title: PHP  Quickstart - predict intent - LUIS
titleSuffix: Azure Cognitive Services
description: In this quickstart, use an available public LUIS app to determine a user's intention from conversational text. Using PHP, send the user's intention as text to the public app's HTTP prediction endpoint. At the endpoint, LUIS applies the public app's model to analyze the natural language text for meaning, determining overall intent and extracting data relevant to the app's subject domain.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 09/10/2018
ms.author: diberry
#Customer intent: As an API or REST developer new to the LUIS service, I want to query the LUIS endpoint of a published model using PHP so that I can see the JSON prediction response.
---

# Quickstart: Get intent using PHP

[!INCLUDE [Quickstart introduction for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

<a name="create-luis-subscription-key"></a>

## Prerequisites

* [PHP](http://php.net/) programming language
* [Visual Studio Code](https://code.visualstudio.com/)
* Public app ID: df67dcdb-c37d-46af-88e1-8b97951ca1c2


[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-luis-repo-note.md)]

## Get LUIS key

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-get-key-para.md)]

## Get intent with browser

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-browser-para.md)]

## Get intent programmatically 

You can use PHP to access the same results you saw in the browser window in the previous step. 

1. Copy the code that follows and save it with filename `endpoint-call.php`:

   [!code-php[PHP code that calls a LUIS endpoint](~/samples-luis/documentation-samples/quickstarts/analyze-text/php/endpoint-call.php)]

2. Replace `"YOUR-KEY"` with your endpoint key.

3. Run the PHP application with `php endpoint-call.php`. It displays the same JSON that you saw earlier in the browser window.

## LUIS keys

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-key-usage-para.md)]

## Clean up resources

Delete the PHP file.

## Next steps

> [!div class="nextstepaction"]
> [Add utterances](luis-get-started-php-add-utterance.md)