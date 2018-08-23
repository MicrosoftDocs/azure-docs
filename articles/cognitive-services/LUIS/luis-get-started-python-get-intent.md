---
title: Analyze natural language text in Language Understanding (LUIS) using Python - Cognitive Services - Azure Cognitive Services | Microsoft Docs
description: In this quickstart, use an available public LUIS app to determine a user's intention from conversational text. Using Python, send the user's intention as text to the public app's HTTP prediction endpoint. At the endpoint, LUIS applies the public app's model to analyze the natural language text for meaning, determining overall intent and extracting data relevant to the app's subject domain.  
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 08/23/2018
ms.author: diberry
#Customer intent:  As an API or REST developer new to the LUIS service, I want to query the LUIS endpoint of a published model using Python so that I can see the JSON prediction response.
---

# Quickstart: Analyze text using Python

[!include[Quickstart introduction for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

<a name="create-luis-subscription-key"></a>

## Prerequisites

* [Python](https://www.python.org/) programming language
* [Visual Studio Code](https://code.visualstudio.com/)
* Public app ID: df67dcdb-c37d-46af-88e1-8b97951ca1c2


[!include[Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-luis-repo-note.md)]

## Get LUIS key

[!include[Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-get-key-para.md)]

## Analyze text with browser

[!include[Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-browser-para.md)]

## Analyze text with Python

You can use Python to access the same results you saw in the browser window in the previous step.

1. Copy one of the following code snippets:

   [!code-python[Console app code that calls a LUIS endpoint for Python 2.7](~/samples-luis/documentation-samples/quickstarts/analyze-text/python/quickstart-call-endpoint-2-7.py)]

   [!code-python[Console app code that calls a LUIS endpoint for Python 3.6](~/samples-luis/documentation-samples/quickstarts/analyze-text/python/quickstart-call-endpoint-3-6.py)]


2. Replace the value of the `Ocp-Apim-Subscription-Key` field with your key.

3. Run the script. It displays the same JSON that you saw earlier in the browser window.

## LUIS keys

[!include[Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-key-usage-para.md)]

## Clean up resources

Delete the PHP file.

## Next steps
> [!div class="nextstepaction"]
> [Add utterances](luis-get-started-python-add-utterance.md)