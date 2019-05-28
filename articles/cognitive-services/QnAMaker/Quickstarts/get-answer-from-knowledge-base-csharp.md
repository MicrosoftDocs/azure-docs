---
title: "Quickstart: Get answer from knowledge base - REST, C# - QnA Maker"
titlesuffix: Azure Cognitive Services 
description: This C# REST-based quickstart walks you through getting an answer from a knowledge base, programmatically.
services: cognitive-services
author: diberry
manager: nitinme

ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 02/28/2019
ms.author: diberry
#Customer intent: As an API or REST developer new to the QnA Maker service, I want to programmatically get an answer a knowledge base using C#. 
---

# Get answers to a question from a knowledge base with C#

This quickstart walks you through programmatically getting an answer from a published QnA Maker knowledge base. The knowledge base contains questions and answers from [data sources](../Concepts/data-sources-supported.md) such as FAQs. The [question](../how-to/metadata-generateanswer-usage.md#generateanswer-request-configuration) is sent to the QnA Maker service. The [response](../how-to/metadata-generateanswer-usage.md#generateanswer-response-properties) includes the top-predicted answer. 


## Prerequisites

* Latest [**Visual Studio Community edition**](https://www.visualstudio.com/downloads/).
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your Azure dashboard for your QnA Maker resource. 
* **Publish** page settings. If you do not have a published knowledge base, create an empty knowledge base, then import a knowledge base on the **Settings** page, then publish. You can download and use [this basic knowledge base](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/knowledge-bases/basic-kb.tsv). 

    The publish page settings include POST route value, Host value, and EndpointKey value. 

    ![Publish settings](../media/qnamaker-quickstart-get-answer/publish-settings.png)

The code for this quickstart is in the [https://github.com/Azure-Samples/cognitive-services-qnamaker-csharp](https://github.com/Azure-Samples/cognitive-services-qnamaker-csharp/tree/master/documentation-samples/quickstarts/get-answer) repository. 

## Create a knowledge base project

1. Open Visual Studio 2019 Community edition.
1. Create a new Console App (.NET Core) project and name the project QnaMakerQuickstart. Accept the defaults for the remaining settings.

## Add the required dependencies

At the top of the Program.cs file, replace the single using statement with the following lines to add necessary dependencies to the project:

[!code-csharp[Add the required dependencies](~/samples-qnamaker-csharp/documentation-samples/quickstarts/get-answer/QnAMakerAnswerQuestion/Program.cs?range=1-3 "Add the required dependencies")]

## Add the required constants

At the top of the `Program` class, inside the `Main`, add the required constants to access QnA Maker. These values are on the **Publish** page after you publish the knowledge base. 

[!code-csharp[Add the required constants](~/samples-qnamaker-csharp/documentation-samples/quickstarts/get-answer/QnAMakerAnswerQuestion/Program.cs?range=14-30 "Add the required constants")]

## Add a POST request to send question and get answer

The following code makes an HTTPS request to the QnA Maker API to send the question to the knowledge base and receives the response:

[!code-csharp[Add a POST request to send question to knowledge base](~/samples-qnamaker-csharp/documentation-samples/quickstarts/get-answer/QnAMakerAnswerQuestion/Program.cs?range=32-57 "Add a POST request to send question to knowledge base")]

The `Authorization` header's value includes the string `EndpointKey`. 

Learn more about the [request](../how-to/metadata-generateanswer-usage.md#generateanswer-request) and [response](../how-to/metadata-generateanswer-usage.md#generateanswer-response). 

## Build and run the program

Build and run the program from Visual Studio. It will automatically send the request to the QnA Maker API, then it will print to the console window.

[!INCLUDE [JSON request and response](../../../../includes/cognitive-services-qnamaker-quickstart-get-answer-json.md)] 

[!INCLUDE [Clean up files and knowledge base](../../../../includes/cognitive-services-qnamaker-quickstart-cleanup-resources.md)] 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)
