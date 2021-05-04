---
title: Contextually filter by using metadata
titleSuffix: Azure Cognitive Services
description: QnA Maker Prebuilt API
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: conceptual
ms.date: 05/04/2021
ms.custom: "devx-track-js, devx-track-csharp"
---

# Prebuilt API

The Prebuilt API provides user the capability to ingest text and query over it without having to create knowledgebases, maintain question and answer pairs or incurring cost for underutilized infrastructure. Users can consume this API that users to meet their question and answering needs without having to learn the details about QnA Maker.

Prebuilt API provides question answering independent of the storage type i.e., customer doesn’t need to create a storage specific to QnA Maker in a pre-defined format in Azure. 

For a given user query and give block of text/passage the API will return an answer and precise answer present at runtime. 

<a name="qna-entity"></a>


## Example usage of Prebuilt API

Imagine that you have one or more blocks of text from which you would like to get answers for a given question. Conventionally you would have had to create as many knowledgebases as the number of blocks of text. However, now with Prebuilt API you can query the blocks of text without having to create the knowledgebases as shown below,

### Querying over a single block of text
```json
{
    "question": "How long it takes to charge surface pro 4?",
    "documents": [
        {
            "text": "### The basics #### Power and charging It takes two to four hours to charge the Surface Pro 4 battery fully from an empty state. It can take longer if you’re using your Surface for power-intensive activities like gaming or video streaming while you’re charging it. You can use the USB port on your Surface Pro 4 power supply to charge other devices, like a phone, while your Surface charges.",
            "id": "doc1"
        }
    ],
    "Language": "en"
}
```
In the above request body we query over a single block of text. A sample response received for the above query is shown below,

```json
{
    "answers": [
        {
            "answer": "### The basics #### Power and charging It takes two to four hours to charge the Surface Pro 4 battery fully from an empty state. It can take longer if you’re using your Surface for power-intensive activities like gaming or video streaming while you’re charging it. You can use the USB port on your Surface Pro 4 power supply to charge other devices, like a phone, while your Surface charges.",
            "answerSpan": {
                "text": "two to four hours",
                "score": 0.0,
                "startIndex": 47,
                "endIndex": 64
            },
            "score": 0.9599020481109619,
            "id": "doc1",
            "answerStartIndex": 0,
            "answerEndIndex": 390
        },
        {
            "answer": "It can take longer if you’re using your Surface for power-intensive activities like gaming or video streaming while you’re charging it. You can use the USB port on your Surface Pro 4 power supply to charge other devices, like a phone, while your Surface charges.",
            "score": 0.06749606877565384,
            "id": "doc1",
            "answerStartIndex": 129,
            "answerEndIndex": 390
        },
        {
            "answer": "You can use the USB port on your Surface Pro 4 power supply to charge other devices, like a phone, while your Surface charges.",
            "score": 0.011389964260160923,
            "id": "doc1",
            "answerStartIndex": 265,
            "answerEndIndex": 390
        }
    ]
}
```
We see that multiple answers are received as part of the API response. Each answer has a specific confidence score which helps understand the overall relevance of the answer. Users can make use of this confidence score to show the answers to the query.

## Prebuilt API reference
Please vist the [Prebuilt API reference](http://docs.microsoft.com/rest/api/cognitiveservices-qnamaker/qnamaker5.0preview2/prebuilt/generateanswer) documentation to understand the input and output parameters required for calling the API.
