---
title: Node.js Quickstart - predict intent - LUIS
titleSuffix: Azure Cognitive Services
description: In this quickstart, use an available public LUIS app to determine a user's intention from conversational text. Using Node.js, send the user's intention as text to the public app's HTTP prediction endpoint. At the endpoint, LUIS applies the public app's model to analyze the natural language text for meaning, determining overall intent and extracting data relevant to the app's subject domain.  
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 09/10/2018
ms.author: diberry
#Customer intent: As an API or REST developer new to the LUIS service, I want to query the LUIS endpoint of a published model using Node.js so that I can see the JSON prediction response.
---

# Quickstart: Get intent using Node.js

[!INCLUDE [Quickstart introduction for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

<a name="create-luis-subscription-key"></a>

## Prerequisites

* [Node.js](https://nodejs.org/) programming language 
* [Visual Studio Code](https://code.visualstudio.com/)
* Public app ID: df67dcdb-c37d-46af-88e1-8b97951ca1c2


> [!NOTE] 
> The complete Node.js solution is available from the [**LUIS-Samples** Github repository](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/quickstarts/analyze-text/node).

## Get LUIS key

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-get-key-para.md)]

## Get intent with browser

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-browser-para.md)]

## Get intent programmatically

You can use Node.js to access the same results you saw in the browser window in the previous step.

1. Copy the following code snippet:

   [!code-nodejs[Console app code that calls a LUIS endpoint for Node.js](~/samples-luis/documentation-samples/quickstarts/analyze-text/node/call-endpoint.js)]

2. Create `.env` file with the following text or set these variables in the system environment:

    ```CMD
    LUIS_APP_ID=df67dcdb-c37d-46af-88e1-8b97951ca1c2
    LUIS_ENDPOINT_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

3. Set the `LUIS_ENDPOINT_KEY` environment variable to your key.

4. Install dependencies by running the following command at the command-line: `npm install`.

5. Run the code with `npm start`. It displays the same values that you saw earlier in the browser window.

## LUIS keys

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-key-usage-para.md)]

## Clean up resources

Delete the Node.js file.

## Next steps
> [!div class="nextstepaction"]
> [Add utterances](luis-get-started-node-add-utterance.md)