---
title: Create, publish, answer 
titleSuffix: QnA Maker - Azure Cognitive Services 
description: This REST-based tutorial walks you through programmatically creating and publishing a knowledge base, then answering a question from the knowledge base.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: tutorial
ms.date: 01/24/2019
ms.author: diberry
#Customer intent: As an API or REST developer new to the QnA Maker service, I want to understand all the programming requirements to create a knowledge base and generate an answer from that knowledge base. 
---

# Tutorial: Using C#, create knowledge base then answer question

This tutorial walks you through programmatically creating and publishing a knowledge base (KB), then answering a customer question with the knowledge base. 

> [!div class="checklist"]
> * Create a knowledge base 
> * Check creation status
> * Train and publish the knowledge base
> * Get endpoint information
> * Use Curl to query the knowledge base


This quickstart calls QnA Maker APIs:

* [Create Knowledge base (kb)](https://go.microsoft.com/fwlink/?linkid=2092179)
* [Get Operation Details](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/operations/getdetails)
* [Get Knowledge base details](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/getdetails) 
* [Get Knowledge base endpoints](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/endpointkeys/getkeys)
* [Publish](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/publish) 

## Prerequisites

* Latest [**Visual Studio Community edition**](https://www.visualstudio.com/downloads/).
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 

> [!NOTE] 
> The complete solution file(s) are available from the [**Azure-Samples/cognitive-services-qnamaker-csharp** GitHub repository](https://github.com/Azure-Samples/cognitive-services-qnamaker-csharp/tree/master/documentation-samples/tutorials/create-publish-answer-knowledge-base).

## Create a knowledge base project

[!INCLUDE [Create Visual Studio Project](../../../../includes/cognitive-services-qnamaker-quickstart-csharp-create-project.md)] 

## Add the required dependencies

At the top of Program.cs, replace the single _using_ statement with the following lines to add necessary dependencies to the project:

[!code-csharp[Add the required dependencies](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=1-11 "Add the required dependencies")]

## Add a KBDetails class
Add this KBDetails class inside the Namespace brackets. This class allows the NewtonSoft library to deserialize the JSON response into a C# class.

[!code-csharp[Add a KBDetails class](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=15-26 "Add a KBDetails class")]

## Add the required constants

At the top of the Program class, add the following constants to access QnA Maker:

[!code-csharp[Add the required constants](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=30-57 "Add the required constants")]

## Add the KB definition

After the constants, add the following KB model definition:

[!code-csharp[Add the KB definition](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=59-85 "Add the KB definition")]

## Add supporting functions and structures
Add the following code block inside the Program class:

[!code-csharp[Add supporting functions and structures](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=87-123 "Add supporting functions and structures")]

## Add a POST request to create KB

The following code makes an HTTPS request to the QnA Maker API to create a KB and receives the response:

[!code-csharp[Add a POST request to create KB](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=124-141 "Add a POST request to create KB")]

This API call returns a JSON response that includes the operation ID. Later, the program uses the operation ID to determine if the KB is successfully created. 

```JSON
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-09-26T05:19:01Z",
  "lastActionTimestamp": "2018-09-26T05:19:01Z",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "YYYe12ff-5d04-4b73-b594-8575f9787963"
}
```

## Add GET request to determine creation status

Check the status of the creation operation.

[!code-csharp[Add GET request to determine creation status](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=142-151 "Add GET request to determine creation status")]

This API call returns a JSON response that includes the operation status: 

```JSON
{
  "operationState": "Running",
  "createdTimestamp": "2018-09-26T05:22:53Z",
  "lastActionTimestamp": "2018-09-26T05:22:53Z",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "YYYe12ff-5d04-4b73-b594-8575f9787963"
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
  "operationId": "YYYe12ff-5d04-4b73-b594-8575f9787963"
}
```

## Add CreateKB method

The following method encapsulates the calls to create the KB and check on the status.  The _create_ **Operation ID** is returned in the POST response header field **Location**, then used as part of the route in the GET request. Because the KB creation may take some time, you need to repeat calls to check the status until the status is either successful or fails. When the operation succeeds, the KB ID is returned in **resourceLocation**. 

[!code-csharp[Add GET request to determine creation status](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=152-227 "Add GET request to determine creation status")]

## Add publish method

After the knowledge base is successfully created, publish the KB. You may have expected a call to a training API. That is not required with this version. 

The following code makes an HTTPS request to the QnA Maker API to publish a KB and receives the response:

[!code-csharp[Add publish method](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=228-259 "Add publish method")]

The API call returns a 204 status for a successful publish without any content in the body of the response. The quickstart code adds text for 204 responses so you can see the result.

For any other response, that response is returned unaltered.

## Generating an answer
In order to access the KB to send a question and receive the best answer, the program needs the _endpoint host_ from the KB details API and the _primary endpoint key_ from the Endpoints API. Those methods are in the following sections along with the method to generate an answer. 

The following table illustrates how the data is used to construct the URI:

|Generate answer URI template|
|--|
|https://**HOSTNAME**.azurewebsites.net/qnamaker/knowledgebases/**KBID**/generateAnswer|

The _primary endpoint_ is passed as a header to authenticate the request to generate an answer:

|Header name|Header value|
|--|--|
|Authorization|`Endpoint` + **primary endpoint**<br>Example: `Endpoint xxxxxxx`<br>Notice the space between the text of `Endpoint` and the value the of primary endpoint. 

The body of the request needs to pass the proper JSON:

```JSON
{
    question: "What languages does QnA Maker support?"
}
```

## Get KB details
Add the following method to get the KB details. These details contain the host name of the KB. The host name is the name of the QnA Maker azure web service you entered when creating the QnA Maker resource. 

[!code-csharp[Get KB Details](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=260-273 "Add publish method")]

This API call returns a JSON response: 

```JSON
{
  "id": "ZZZ31e19-cba7-48d1-8594-5c4297ecc9c1",
  "hostName": "https://qnamaker-s0-s.azurewebsites.net",
  "lastAccessedTimestamp": "2018-10-11T18:10:05Z",
  "lastChangedTimestamp": "2018-10-11T18:09:37Z",
  "lastPublishedTimestamp": "2018-10-11T18:10:15Z",
  "name": "QnA Maker FAQ from quickstart",
  "userId": "AAAc3841df0b42cdb00f53a49d51a89c",
  "urls": [
    "https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs",
    "https://docs.microsoft.com/bot-framework/resources-bot-framework-faq"
  ],
  "sources": [
    "Custom Editorial"
  ]
}
```

## Get KB endpoints
Add the following method to get the QnA Maker's primary endpoints. These endpoints are not tied to the KB, they are valid for all KBs associated with the QnA Maker resource keys from the Azure portal.  

[!code-csharp[Get KB Endpoints](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=274-289 "Get KB Endpoints")]

This API call returns a JSON response: 

```JSON
{
  "primaryEndpointKey": "AAAb5719-e2f7-4a33-937d-7a3b4736a1be",
  "secondaryEndpointKey": "BBBcba78-c1d2-4166-b98f-c77255aefaba",
  "installedVersion": "4.2.0",
  "lastStableVersion": "4.2.0"
}
```

## Get an answer
Add the following method to get an answer to the user's question. 

[!code-csharp[Get Answer](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=290-315 "Get Answer")]

This API call returns a JSON response: 

```JSON
{
  "answers": [
    {
      "questions": [
        "Does QnA Maker support non-English languages?"
      ],
      "answer": "See more details about [supported languages](https://docs.microsoft.com/azure/cognitive-services/qnamaker/overview/languages-supported).\n\n\nIf you have content from multiple languages, be sure to create a separate service for each language.",
      "score": 82.19,
      "id": 11,
      "source": "https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs",
      "metadata": []
    }
  ]
}
```

## Main method
The main method shows the synchronous calls to create, publish, and generate the answer. 

[!code-csharp[Main method](~/samples-qnamaker-csharp/documentation-samples/tutorials/create-publish-answer-knowledge-base/QnaMakerQuickstart/Program.cs?range=316-337 "Main method")]

## Build and run the program

Build and run the program. 

Once your knowledge base is created, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page. Once you know how to use the generate answer API, you can use the API with any language or HTTP request framework. 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)
