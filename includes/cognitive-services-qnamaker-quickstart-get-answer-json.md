---
title: include file
description: include file 
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: include
ms.custom: include file
ms.date: 02/27/2019
ms.author: diberry
---
<a name="generateanswer-request"></a>
<a name="request-and-response-json">

## GenerateAnswer Request 

You call GenerateAnswer with an HTTP POST request. For sample code that shows how to call GenerateAnswer, see the [quickstarts](../quickstarts/csharp.md).

The **request URL** has the following format: 

```
https://{QnA-Maker-endpoint}/knowledgebases/{knowledge-base-ID}/generateAnswer?isTest=true
```

|HTTP request property|Name|Type|Purpose|
|--|--|--|--|
|URL route parameter|Knowledge base ID|string|The GUID for your knowledge base.|
|URL route parameter|QnAMaker endpoint host|string|The hostname of the endpoint deployed in your Azure subscription. This is available on the Settings page after you publish the knowledge base. |
|Header|Content-Type|string|The media type of the body sent to the API. Default value is: ``|
|Header|Authorization|string|Your endpoint key (EndpointKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).|
|Post Body|JSON object|JSON|The question with settings|
|Query string parameter (optional)|`isTest`|boolean|If set to true, returns results from `testkb` Search index instead of published index.|

The JSON body has several settings:

|JSON body property|Required|Type|Purpose|
|--|--|--|--|
|`question`|required|string|A user question to be sent to your knowledge base.|
|`top`|optional|integer|The number of ranked results to include in the output. The default value is 1.|
|`userId`|optional|string|A unique ID to identify the user. This ID will be recorded in the chat logs.|
|`strictFilters`|optional|string|If specified, tells QnA Maker to return only answers that have the specified metadata. |

An example JSON-formatted question for the REST API:

```json
{
    "question": "Is the QnA Maker Service free?",
    "top": 3,
    "strictFilters": [
      {
        "name": "category",
        "value": "api"
      }
    ],
    "userId": "sd53lsY="
}
```

The question includes a property to return the top three answers. 

<a name="generateanswer-response"></a>

## GenerateAnswer Response

|Answers property (sorted by score)|Purpose|
|--|--|
|score|A ranking score between 0 and 100.|
|Id|A unique ID assigned to the answer.|
|questions|The questions provided by the user.|
|answer|The answer to the question.|
|source|The name of the source from which the answer was extracted or saved in the knowledge base.|
|metadata|The metadata associated with the answer.|
|metadata.name|Metadata name. (string, max Length: 100, required)|
|metadata.value: Metadata value. (string, max Length: 100, required)|

The following is an example answer returned in a JSON object:

```json
{
  "answers": [
    {
      "questions": [
        "How do I embed the QnA Maker service in my website?"
      ],
      "answer": "Follow these steps to embed the QnA Maker service as a web-chat control in your website:\n\n\n1.  Create your FAQ bot by following the instructions [here](https://docs.microsoft.com/azure/cognitive-services/qnamaker/tutorials/create-qna-bot).\n2.  Enable the web chat by following the steps [here](https://docs.microsoft.com/azure/bot-service/bot-service-channel-connect-webchat)",
      "score": 70.95,
      "id": 16,
      "source": "https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs",
      "metadata": []
    },
    {
      "questions": [
        "Do I need to use Bot Framework in order to use QnA Maker?"
      ],
      "answer": "No, you do not need to use the Bot Framework with QnA Maker. However, QnA Maker is offered as one of several templates in Azure Bot Service. Bot Service enables rapid intelligent bot development through Microsoft Bot Framework, and it runs in a server-less environment.",
      "score": 46.94,
      "id": 14,
      "source": "https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs",
      "metadata": []
    },
    {
      "questions": [
        "How can I create a bot with QnA Maker?"
      ],
      "answer": "Follow the instructions in [this](https://docs.microsoft.com/azure/cognitive-services/qnamaker/tutorials/create-qna-bot)documentation to create your Bot with Azure Bot Service.",
      "score": 43.25,
      "id": 15,
      "source": "https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs",
      "metadata": []
    }
  ]
}
```
