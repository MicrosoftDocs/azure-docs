---
title: Get intent with REST call in Node.js
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 09/27/2019
ms.author: diberry
---

## Prerequisites

* [Node.js](https://nodejs.org/) programming language 
* [Visual Studio Code](https://code.visualstudio.com/)
* Public app ID: df67dcdb-c37d-46af-88e1-8b97951ca1c2


> [!NOTE] 
> The complete Node.js solution is available from the [**Azure-Samples** GitHub repository](https://github.com/Azure-Samples/cognitive-services-language-understanding/blob/master/documentation-samples/quickstarts/analyze-text/node).

## Get LUIS key

[!INCLUDE [Use authoring key for endpoint](../../../../includes/cognitive-services-luis-qs-endpoint-get-key-para.md)]

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

[!INCLUDE [Use authoring key for endpoint](../../../../includes/cognitive-services-luis-qs-endpoint-key-usage-para.md)]

## Clean up resources

When you are finished with this quickstart, close the Visual Studio project and remove the project directory from the file system. 

## Next steps

> [!div class="nextstepaction"]
> [Add utterances and train with Node.js](../luis-get-started-node-add-utterance.md)