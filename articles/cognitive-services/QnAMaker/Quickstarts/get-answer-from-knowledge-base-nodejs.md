---
title: "Quickstart: Get answer from knowledge base - REST, Node.js - QnA Maker"
titlesuffix: Azure Cognitive Services 
description: This Node.js REST-based quickstart walks you through getting an answer from a knowledge base, programmatically.
services: cognitive-services
author: diberry
manager: nitinme

ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 02/28/2019
ms.author: diberry
#Customer intent: As an API or REST developer new to the QnA Maker service, I want to programmatically get an answer a knowledge base using Node.js. 
---

# Get answers to a question from a knowledge base with Node.js

This quickstart walks you through programmatically getting an answer from a published QnA Maker knowledge base. The knowledge base contains questions and answers from [data sources](../Concepts/data-sources-supported.md) such as FAQs. The [question](../how-to/metadata-generateanswer-usage.md#generateanswer-request-configuration) is sent to the QnA Maker service. The [response](../how-to/metadata-generateanswer-usage.md#generateanswer-response-properties) includes the top-predicted answer. 

## Prerequisites

* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/)
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your Azure dashboard for your QnA Maker resource. 
* **Publish** page settings. If you do not have a published knowledge base, create an empty knowledge base, then import a knowledge base on the **Settings** page, then publish. You can download and use [this basic knowledge base](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/knowledge-bases/basic-kb.tsv). 

    The publish page settings include POST route value, Host value, and EndpointKey value. 

    ![Publish settings](../media/qnamaker-quickstart-get-answer/publish-settings.png)

The code for this quickstart is in the [https://github.com/Azure-Samples/cognitive-services-qnamaker-nodejs](https://github.com/Azure-Samples/cognitive-services-qnamaker-nodejs/tree/master/documentation-samples/quickstarts/get-answer) repository. 

## Create a Node.js file

Open VSCode and create a new file named `get-answer.js`. 

## Add the required dependencies

At the top of the `get-answer.js` file, add necessary dependencies to the project:

[!code-nodejs[Add the required dependencies](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/get-answer/get-answer.js?range=1-4 "Add the required dependencies")]

## Add the required constants

Next, add the required constants to access QnA Maker. These values are on the **Publish** page after you publish the knowledge base. 

[!code-nodejs[Add the required constants](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/get-answer/get-answer.js?range=6-22 "Add the required constants")]

## Add a POST request to send question and get an answer

The following code makes an HTTPS request to the QnA Maker API to send the question to the knowledge base and receives the response:

[!code-nodejs[Add a POST request to send question to knowledge base](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/get-answer/get-answer.js?range=24-49 "Add a POST request to send question to knowledge base")]

The `Authorization` header's value includes the string `EndpointKey`. 

## Install the dependencies

Install the dependencies from the command line:

```bash
npm install request request-promise
```

## Run the program

Run the program from the command line. It will automatically send the request to the QnA Maker API, then it will print to the console window.

Run the file:

```bash
node get-answer.js
```

[!INCLUDE [JSON request and response](../../../../includes/cognitive-services-qnamaker-quickstart-get-answer-json.md)]

Learn more about the [request](../how-to/metadata-generateanswer-usage.md#generateanswer-request) and [response](../how-to/metadata-generateanswer-usage.md#generateanswer-response).

[!INCLUDE [Clean up files and knowledge base](../../../../includes/cognitive-services-qnamaker-quickstart-cleanup-resources.md)] 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)
