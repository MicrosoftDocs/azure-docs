---
title: Create knowledge base - REST, C#
titlesuffix: QnA Maker- Azure Cognitive Services 
description: This C# REST-based quickstart walks you through creating a sample QnA Maker knowledge base, programmatically, that will appear in your Azure Dashboard of your Cognitive Services API account.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 02/04/2019
ms.author: diberry
#Customer intent: As an API or REST developer new to the QnA Maker service, I want to programmatically create a knowledge base using C#. 
---

# Quickstart: Create a knowledge base in QnA Maker using C#

This quickstart walks you through programmatically creating and publishing a sample QnA Maker knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from [data sources](../Concepts/data-sources-supported.md). The model for the knowledge base is defined in the JSON sent in the body of the API request. 

This quickstart calls QnA Maker APIs:
* [Create KB](https://go.microsoft.com/fwlink/?linkid=2092179)
* [Get Operation Details](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/operations/getdetails)
* [Publish](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/publish) 

## Prerequisites

* Latest [**Visual Studio Community edition**](https://www.visualstudio.com/downloads/).
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 

> [!NOTE] 
> The complete solution file(s) are available from the [**Azure-Samples/cognitive-services-qnamaker-csharp** GitHub repository](https://github.com/Azure-Samples/cognitive-services-qnamaker-csharp).

## Create a knowledge base project

[!INCLUDE [Create Visual Studio Project](../../../../includes/cognitive-services-qnamaker-quickstart-csharp-create-project.md)] 

## Add the required dependencies

At the top of Program.cs, replace the single using statement with the following lines to add necessary dependencies to the project:

[!code-csharp[Add the required dependencies](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=1-11 "Add the required dependencies")]

## Add the required constants

At the top of the Program class, add the following constants to access QnA Maker:

[!code-csharp[Add the required constants](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=17-24 "Add the required constants")]

## Add the KB definition

After the constants, add the following KB definition:

[!code-csharp[Add the required constants](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=32-57 "Add the required constants")]

## Add supporting functions and structures
Add the following code block inside the Program class:

[!code-csharp[Add supporting functions and structures](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=62-82 "Add supporting functions and structures")]

## Add a POST request to create KB

The following code makes an HTTPS request to the QnA Maker API to create a KB and receives the response:

[!code-csharp[Add a POST request to create KB](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=91-105 "Add a POST request to create KB")]

This API call returns a JSON response that includes the operation ID. Use the operation ID to determine if the KB is successfully created. 

```JSON
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-09-26T05:19:01Z",
  "lastActionTimestamp": "2018-09-26T05:19:01Z",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "8dfb6a82-ae58-4bcb-95b7-d1239ae25681"
}
```

## Add GET request to determine creation status

Check the status of the operation.

[!code-csharp[Add GET request to determine creation status](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=159-170 "Add GET request to determine creation status")]

This API call returns a JSON response that includes the operation status: 

```JSON
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-09-26T05:22:53Z",
  "lastActionTimestamp": "2018-09-26T05:22:53Z",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "177e12ff-5d04-4b73-b594-8575f9787963"
}
```

Repeat the call until success or failure: 

```JSON
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-09-26T05:22:53Z",
  "lastActionTimestamp": "2018-09-26T05:23:08Z",
  "resourceLocation": "/knowledgebases/XXX7892b-10cf-47e2-a3ae-e40683adb714",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "177e12ff-5d04-4b73-b594-8575f9787963"
}
```

## Add CreateKB method

The following method creates the KB and repeats checks on the status.  The _create_ **Operation ID** is returned in the POST response header field **Location**, then used as part of the route in the GET request. Because the KB creation may take some time, you need to repeat calls to check the status until the status is either successful or fails. When the operation succeeds, the KB ID is returned in **resourceLocation**. 

[!code-csharp[Add CreateKB method](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=176-237 "Add CreateKB method")]

## Add the CreateKB method to Main

Change the Main method to call the CreateKB method:

[!code-csharp[Add CreateKB method](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=239-248 "Add CreateKB method")]

## Build and run the program

Build and run the program. It will automatically send the request to the QnA Maker API to create the KB, then it will poll for the results every 30 seconds. Each response is printed to the console window.

Once your knowledge base is created, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page. 


[!INCLUDE [Clean up files and KB](../../../../includes/cognitive-services-qnamaker-quickstart-cleanup-resources.md)] 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)
