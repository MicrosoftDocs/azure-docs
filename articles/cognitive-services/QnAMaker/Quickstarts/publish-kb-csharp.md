---
title: "Quickstart: Publish knowledge base - REST, C# -  QnA Maker"
titleSuffix: Azure Cognitive Services 
description: This REST-based quickstart walks you through publishing your KB which pushes the latest version of the tested knowledge base to a dedicated Azure Search index representing the published knowledge base. It also creates an endpoint that can be called in your application or chat bot.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 11/18/2018
ms.author: diberry
#Customer intent: As an API or REST developer new to the QnA Maker service, I want to programmatically publish a knowledge base using C#. 
---

# Quickstart: Publish a knowledge base in QnA Maker using C#

This quickstart walks you through programmatically publishing your knowledge base (KB). Publishing pushes the latest version of the knowledge base to a dedicated Azure Search index and creates an endpoint that can be called in your application or chat bot.

This quickstart calls QnA Maker APIs:
* [Publish](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75fe) - this API doesn't require any information in the body of the request.

## Prerequisites

* Latest [**Visual Studio Community edition**](https://www.visualstudio.com/downloads/).
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 
* QnA Maker knowledge base (KB) ID found in the URL in the kbid query string parameter as shown below.

    ![QnA Maker knowledge base ID](../media/qnamaker-quickstart-kb/qna-maker-id.png)

If you don't have a knowledge base yet, you can create a sample one to use for this quickstart: [Create a new knowledge base](create-new-kb-csharp.md).

[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../includes/cognitive-services-qnamaker-csharp-repo-note.md)]

## Create knowledge base project

1. Open Visual Studio 2017 Community edition.
1. Create a new **Console App (.Net Core)** project and name the project `QnaMakerQuickstart`. Accept the defaults for the remaining settings.
1. In the Solution Explorer, right-click on the project name, **QnaMakerQuickstart**, then select **Manage NuGet Packages...**.

## Add required dependencies

At the top of Program.cs, replace the single using statement with the following lines to add necessary dependencies to the project:

[!code-csharp[Add the required dependencies](~/samples-qnamaker-csharp/documentation-samples/quickstarts/publish-knowledge-base/QnAMakerPublishQuickstart/Program.cs?range=1-2 "Add the required dependencies")]

## Add required constants

At the top of the Program class, add the following constants to access QnA Maker:

[!code-csharp[Add the required constants](~/samples-qnamaker-csharp/documentation-samples/quickstarts/publish-knowledge-base/QnAMakerPublishQuickstart/Program.cs?range=11-14 "Add the required constants")]

## Add POST request to publish KB

The following code makes an HTTPS request to the QnA Maker API to publish a KB and receives the response:

[!code-csharp[Add HTTP Post request and response](~/samples-qnamaker-csharp/documentation-samples/quickstarts/publish-knowledge-base/QnAMakerPublishQuickstart/Program.cs?range=16-30 "Add HTTP Post request and response")]

The API call returns a 204 status for a successful publish without any content in the body of the response. The code adds content for 204 responses.

For any other response, that response is returned unaltered.
 
## Build and run the program

Build and run the program. It will automatically send the request to the QnA Maker API to publish the KB, then the response is printed to the console window.

Once your knowledge base is published, you can query it from the endpoint with a client application or chat bot. 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
