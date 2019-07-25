---
title: Publish knowledge base, REST, Node.js
titleSuffix: QnA Maker - Azure Cognitive Services 
description: This Node.js quickstart walks you through programmatically publishing your knowledge base (KB). Publishing pushes the latest version of the knowledge base to a dedicated Azure Search index and creates an endpoint that can be called in your application or chat bot.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 02/28/2019
ms.author: diberry
---

# Quickstart: Publish a knowledge base in QnA Maker using Node.js

This REST-based quickstart walks you through programmatically publishing your knowledge base (KB). Publishing pushes the latest version of the knowledge base to a dedicated Azure Search index and creates an endpoint that can be called in your application or chat bot.

This quickstart calls QnA Maker APIs:
* [Publish](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/publish) - this API doesn't require any information in the body of the request.

## Prerequisites

* [Node.js 6+](https://nodejs.org/en/download/)
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 
* QnA Maker knowledge base (KB) ID found in the URL in the kbid query string parameter as shown below.

    ![QnA Maker knowledge base ID](../media/qnamaker-quickstart-kb/qna-maker-id.png)

    If you don't have a knowledge base yet, you can create a sample one to use for this quickstart: [Create a new knowledge base](create-new-kb-nodejs.md).


> [!NOTE] 
> The complete solution file(s) are available from the [**Azure-Samples/cognitive-services-qnamaker-nodejs** GitHub repository](https://github.com/Azure-Samples/cognitive-services-qnamaker-nodejs/tree/master/documentation-samples/quickstarts/publish-knowledge-base-short).

## Create a knowledge base Node.js file

Create a file named `publish-knowledge-base.js`.

## Add required dependencies

At the top of `publish-knowledge-base.js`, add the following lines to add necessary dependencies to the project:

[!code-nodejs[Add the dependencies](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/publish-knowledge-base-short/publish-knowledge-base.js?range=1-3 "Add the dependencies")]

## Add required constants

After the preceding required dependencies, add the required constants to access QnA Maker. Replace the values with your own.

[!code-nodejs[Add required constants](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/publish-knowledge-base-short/publish-knowledge-base.js?range=11-14 "Add required constants")]

## Add POST request to publish knowledge base

After the required constants, add the following code, which makes an HTTPS request to the QnA Maker API to publish a knowledge base and receives the response:

[!code-nodejs[Add a POST request to publish knowledge base](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/publish-knowledge-base-short/publish-knowledge-base.js?range=16-47 "Add a POST request to publish knowledge base")]

The API call returns a 204 status for a successful publish without any content in the body of the response. The code adds content for 204 responses.

For any other response, that response is returned unaltered.

## Run the program

Build and run the program. It will automatically send the request to the QnA Maker API to publish the knowledge base, then the response is printed to the console window.

Once your knowledge base is published, you can query it from the endpoint with a client application or chat bot. 

```bash
node publish-knowledge-base.js
```

[!INCLUDE [Clean up files and knowledge base](../../../../includes/cognitive-services-qnamaker-quickstart-cleanup-resources.md)] 

## Next steps

After the knowledge base is published, you need the [endpoint URL to generate an answer](../Tutorials/create-publish-answer.md#generating-an-answer). 

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)
