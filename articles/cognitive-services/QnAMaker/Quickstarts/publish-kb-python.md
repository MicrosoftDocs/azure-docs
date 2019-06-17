---
title: Publish knowledge base, REST, Python
titleSuffix: QnA Maker - Azure Cognitive Services 
description: This Python REST-based quickstart walks you through publishing your knowledge base which pushes the latest version of the tested knowledge base to a dedicated Azure Search index representing the published knowledge base. It also creates an endpoint that can be called in your application or chat bot.
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

# Quickstart: Publish a knowledge base in QnA Maker using Python

This REST-based quickstart walks you through programmatically publishing your knowledge base (KB). Publishing pushes the latest version of the knowledge base to a dedicated Azure Search index and creates an endpoint that can be called in your application or chat bot.

This quickstart calls QnA Maker APIs:
* [Publish](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/publish) - this API doesn't require any information in the body of the request.

## Prerequisites

* [Python 3.7](https://www.python.org/downloads/)
* You must have a QnA Maker service. To retrieve your key, select Keys under Resource Management in your dashboard.
* QnA Maker knowledge base (KB) ID found in the URL in the kbid query string parameter as shown below.

    ![QnA Maker knowledge base ID](../media/qnamaker-quickstart-kb/qna-maker-id.png)

    If you don't have a knowledge base yet, you can create a sample one to use for this quickstart: [Create a new knowledge base](create-new-kb-nodejs.md).

> [!NOTE] 
> The complete solution file(s) are available from the [**Azure-Samples/cognitive-services-qnamaker-python** GitHub repository](https://github.com/Azure-Samples/cognitive-services-qnamaker-python/tree/master/documentation-samples/quickstarts/publish-knowledge-base).

## Create a knowledge base Python file

Create a file named `publish-kb-3x.py`.

## Add the required dependencies

At the top of `publish-kb-3x.py`, add the following lines to add necessary dependencies to the project:

[!code-python[Add the required dependencies](~/samples-qnamaker-python/documentation-samples/quickstarts/publish-knowledge-base/publish-kb-3x.py?range=1-1 "Add the required dependencies")]

## Add required constants

After the preceding required dependencies, add the required constants to access QnA Maker. Replace the values with your own.

[!code-python[Add the required constants](~/samples-qnamaker-python/documentation-samples/quickstarts/publish-knowledge-base/publish-kb-3x.py?range=5-15 "Add the required constants")]

## Add POST request to publish knowledge base

After the required constants, add the following code, which makes an HTTPS request to the QnA Maker API to publish a knowledge base and receives the response:

[!code-python[Add a POST request to publish knowledge base](~/samples-qnamaker-python/documentation-samples/quickstarts/publish-knowledge-base/publish-kb-3x.py?range=17-26 "Add a POST request to publish knowledge base")]

The API call returns a 204 status for a successful publish without any content in the body of the response. The code adds content for 204 responses.

For any other response, that response is returned unaltered.

## Build and run the program

Enter the following command at a command-line to run the program. It will send the request to the QnA Maker API to publish the knowledge base, then print out 204 for success or errors.

```bash
python publish-kb-3x.py
```

[!INCLUDE [Clean up files and knowledge base](../../../../includes/cognitive-services-qnamaker-quickstart-cleanup-resources.md)] 

## Next steps

After the knowledge base is published, you need the [endpoint URL to generate an answer](../Tutorials/create-publish-answer.md#generating-an-answer). 

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)

[QnA Maker overview](../Overview/overview.md)
