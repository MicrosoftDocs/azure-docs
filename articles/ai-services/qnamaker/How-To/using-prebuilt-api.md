---
title: QnA Maker Prebuilt API
titleSuffix: Azure AI services
description: Use the Prebuilt API to get answers over text
#services: cognitive-services
manager: nitinme
ms.author: jboback
author: jboback
ms.service: azure-ai-language
ms.subservice: azure-ai-qna-maker
ms.topic: how-to
ms.date: 05/05/2021
---

# Prebuilt question answering

Prebuilt question answering provides user the capability to answer question over a passage of text  without having to create knowledgebases, maintain question and answer pairs or incurring cost for underutilized infrastructure. This functionality is provided as an API and can be used to meet question and answering needs without having to learn the details about QnA Maker or additional storage.

[!INCLUDE [Custom question answering](../includes/new-version.md)]

> [!NOTE]
> This documentation does not apply to the latest release. To learn about using the Prebuilt API with the latest release consult the [question answering prebuilt API article](../../language-service/question-answering/how-to/prebuilt.md).

Given a user query and a block of text/passage the API will return an answer and precise answer (if available).

<a name="qna-entity"></a>


## Example usage of Prebuilt question answering

Imagine that you have one or more blocks of text from which you would like to get answers for a given question. Conventionally you would have had to create as many sources as the number of blocks of text. However, now with Prebuilt question answering you can query the blocks of text without having to define content sources in a knowledge base. 

Some other scenarios where the Prebuilt API can be used are:

* You are developing an ebook reader app for end users which allows them to highlight text, enter a question and find answers over highlighted text 
* A browser extension that allows users to ask a question over the content being currently displayed on the browser page
* A health bot that takes queries from users and provides answers based on the medical content that the bot identifies as most relevant to the user query 

Below is an example of a sample request:

## Sample Request
```
POST https://{Endpoint}/qnamaker/v5.0-preview.2/generateanswer
```

### Sample Query over a single block of text

Request Body

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
## Sample Response

In the above request body, we query over a single block of text. A sample response received for the above query is shown below,

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
We see that multiple answers are received as part of the API response. Each answer has a specific confidence score that helps understand the overall relevance of the answer. Users can make use of this confidence score to show the answers to the query.

## Prebuilt API Limits 

Visit the [Prebuilt API Limits](../limits.md#prebuilt-question-answering-limits) documentation 

## Prebuilt API reference
Visit the [Prebuilt API reference](/rest/api/cognitiveservices-qnamaker/qnamaker5.0preview2/prebuilt/generateanswer) documentation to understand the input and output parameters required for calling the API.
