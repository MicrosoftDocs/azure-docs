---
title: Knowledge base - QnA Maker
titleSuffix: Azure Cognitive Services
description: A QnA Maker knowledge base consists of a set of question/answer (QnA) pairs and optional metadata associated with each QnA pair.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: conceptual
ms.date: 08/26/2019
ms.author: diberry
ms.custom: seodec18
---

# What is a QnA Maker Knowledge base?

A QnA Maker knowledge base consists of a set of question/answer (QnA) pairs and optional metadata associated with each QnA pair.

## Key knowledge base concepts

* **Questions** - A question contains text that best represents a user query. 
* **Answers** - An answer is the response that is returned when a user query is matched with the associated question.  
* **Metadata** - Metadata are tags associated with a QnA pair and are represented as key-value pairs. Metadata tags are used to filter QnA pairs and limit the set over which query matching is performed.

A single QnA, represented by a numeric QnA ID, has multiple variants of a question (alternate questions) that all map to a single answer. Additionally, each such pair can have multiple metadata fields associated with it: one key, and one value.

![QnA Maker knowledge bases](../media/qnamaker-concepts-knowledgebase/knowledgebase.png) 

## Knowledge base content format

When you ingest rich content into a knowledge base, QnA Maker attempts to convert the content to markdown. Read [this](https://aka.ms/qnamaker-docs-markdown-support) blog to understand the markdown formats understandable by most chat clients.

Metadata fields consist of key-value pairs separated by a colon **(Product:Shredder)**. Both key and value must be text-only. The metadata key must not contain any spaces. Metadata supports only one value per key.

## How QnA Maker processes a user query to select the best answer

The trained and [published](/azure/cognitive-services/qnamaker/quickstarts/create-publish-knowledge-base#publish-the-knowledge-base) QnA Maker knowledge base receives a user query, from a bot or other client application, at the [GenerateAnswer API](/azure/cognitive-services/qnamaker/how-to/metadata-generateanswer-usage). The following diagram illustrates the process when the user query is received.

![The ranking process for a user query](../media/qnamaker-concepts-knowledgebase/rank-user-query-first-with-azure-search-then-with-qna-maker.png)

### Ranker process

The process is explained in the following table:

|Step|Purpose|
|--|--|
|1|The client application sends the user query to the [GenerateAnswer API](/azure/cognitive-services/qnamaker/how-to/metadata-generateanswer-usage).|
|2|Qna Maker preprocessing the user query with language detection, spellers, and word breakers.|
|3|This preprocessing is taken to alter user query for best search results.|
|4|This altered query is sent to Azure Search Index, receiving the `top` number of results. If the correct answer isn't in these results, increase the value of `top` slightly. Generally a value of 10 for `top` works in 90% of queries.|
|5|QnA Maker applies advanced featurization to determine the correctness of the fetched Azure Search results for user query. |
|6|The trained ranker model uses the feature score, from step 5, to rank the Azure Search results.|
|7|The new results are returned to the client application in ranked order.|
|||

Features used include but are not limited to word-level semantics, term-level importance in a corpus, and deep learned semantic models to determine similarity and relevance between two text strings.

## HTTP request and response with endpoint
When you publish your knowledge base, the service creates a REST-based HTTP **endpoint** that can be integrated into your application, commonly a chat bot. 

### The user query request to generate an answer

A **user query** is the question that the end user asks of the knowledge base, such as, `How do I add a collaborator to my app?`. The query is often in a natural language format or a few keywords that represent the question, such as, `help with collaborators`. The query is sent to your knowledge from an HTTP **request** in your client application.

```json
{
    "question": "qna maker and luis",
    "top": 6,
    "isTest": true,
    "scoreThreshold": 20,
    "strictFilters": [
    {
        "name": "category",
        "value": "api"
    }],
    "userId": "sd53lsY="
}
```

You control the response by setting properties such as [scoreThreshold](./confidence-score.md#choose-a-score-threshold), [top](../how-to/improve-knowledge-base.md#use-the-top-property-in-the-generateanswer-request-to-get-several-matching-answers), and [strictFilters](../how-to/metadata-generateanswer-usage.md#filter-results-with-strictfilters-for-metadata-tags).

Use [conversation context](../how-to/metadata-generateanswer-usage.md#use-question-and-answer-results-to-keep-conversation-context) with [multi-turn functionality](../how-to/multiturn-conversation.md) to keep the conversation going to refine the questions and answers, to find the correct and final answer.

### The response from a call to generate answer

The HTTP **response** is the answer retrieved from the knowledge base, based on the best match for a given user query. The response includes the answer and the prediction score. If you asked for more than one top answer, with the `top` property, you get more than one top answer, each with a score. 

```json
{
    "answers": [
        {
            "questions": [
                "What is the closing time?"
            ],
            "answer": "10.30 PM",
            "score": 100,
            "id": 1,
            "source": "Editorial",
            "metadata": [
                {
                    "name": "restaurant",
                    "value": "paradise"
                },
                {
                    "name": "location",
                    "value": "secunderabad"
                }
            ]
        }
    ]
}
```

### Test and production knowledge base
A Knowledge base is the repository of questions and answers created, maintained, and used through QnA Maker. Each QnA Maker tier can be used for multiple Knowledge bases.

A knowledge base has two states - Test and published. 

The **test knowledge base** is the version that is being edited, saved, and tested for accuracy and completeness of responses. Changes made to the test knowledge base do not affect the end user of your application/chat bot. The test knowledge base is known as `test` in the HTTP request. 

The **published knowledge base** is the version that is used in your chat bot/application. The action of publishing a knowledge base puts the content of the Test knowledge base in the Published version of the knowledge base. Since the published knowledge base is the version that the application uses through the endpoint, care should be taken to ensure that the content is correct and well-tested. The published knowledge base is known as `prod` in the HTTP request. 

## Next steps

> [!div class="nextstepaction"]
> [Development lifecycle of a knowledge base](./development-lifecycle-knowledge-base.md)

## See also

[QnA Maker overview](../Overview/overview.md)

Create and edit knowledge base with: 
* [REST API](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/qnamaker/knowledgebase)
* [.Net SDK](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebase?view=azure-dotnet)

Generate answer with: 
* [REST API](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/qnamakerruntime/runtime/generateanswer)
* [.Net SDK](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.runtime?view=azure-dotnet)
