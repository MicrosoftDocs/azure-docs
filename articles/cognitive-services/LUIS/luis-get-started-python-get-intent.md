---
title: Python Quickstart - predict intent - LUIS
titleSuffix: Azure Cognitive Services
description: In this quickstart, you learn to call a LUIS app using Python.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 09/10/2018
ms.author: diberry
#Customer intent: As a developer new to LUIS, I want to query the endpoint of a published model using Python. 
---

# Quickstart: Get intent using Python
In this quickstart, pass utterances to a LUIS endpoint and get intent and entities back.

[!include[Quickstart introduction for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

## Prerequisites

* [Python 3.6](https://www.python.org/downloads/) or later.
* [Visual Studio Code](https://code.visualstudio.com/)

[!include[Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-luis-repo-note.md)]

## Get LUIS key

[!include[Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-get-key-para.md)]

## Get intent with browser

[!include[Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-browser-para.md)]

## Get intent  programmatically

You can use Python to access the same results you saw in the browser window in the previous step.

1. Copy one of the following code snippets to a file called `quickstart-call-endpoint.py`:

   [!code-python[Console app code that calls a LUIS endpoint for Python 2.7](~/samples-luis/documentation-samples/quickstarts/analyze-text/python/2.x/quickstart-call-endpoint-2-7.py)]

   [!code-python[Console app code that calls a LUIS endpoint for Python 3.6](~/samples-luis/documentation-samples/quickstarts/analyze-text/python/3.x/quickstart-call-endpoint-3-6.py)]

2. Replace the value of the `Ocp-Apim-Subscription-Key` field with your LUIS endpoint key.

3. Install dependencies with `pip install requests`.

4. Run the script with `python ./quickstart-call-endpoint.py`. It displays the same JSON that you saw earlier in the browser window.

## LUIS keys

[!include[Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-key-usage-para.md)]

## Clean up resources
Delete the python file. 

## Next steps

> [!div class="nextstepaction"]
> [Add utterances](luis-get-started-python-add-utterance.md)