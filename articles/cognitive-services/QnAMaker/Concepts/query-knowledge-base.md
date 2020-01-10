---
title: Query the knowledge base - QnA Maker
description: A knowledge base must be published. Once published, the knowledge base is queried at the runtime prediction endpoint using the generateAnswer API.
ms.topic: conceptual
ms.date: 01/09/2020
---

# Query the knowledge base for answers

A knowledge base must be published. Once published, the knowledge base is queried at the runtime prediction endpoint using the generateAnswer API. The query includes the question text, and other settings, to help QnA Maker select the best possible match to an answer.

## How QnA Maker processes a user query to select the best answer

The trained and [published](/azure/cognitive-services/qnamaker/quickstarts/create-publish-knowledge-base#publish-the-knowledge-base) QnA Maker knowledge base receives a user query, from a bot or other client application, at the [GenerateAnswer API](/azure/cognitive-services/qnamaker/how-to/metadata-generateanswer-usage). The following diagram illustrates the process when the user query is received.

![The ranking process for a user query](../media/qnamaker-concepts-knowledgebase/rank-user-query-first-with-azure-search-then-with-qna-maker.png)

### Ranker process

The process is explained in the following table.

|Step|Purpose|
|--|--|
|1|The client application sends the user query to the [GenerateAnswer API](/azure/cognitive-services/qnamaker/how-to/metadata-generateanswer-usage).|
|2|QnA Maker preprocesses the user query with language detection, spellers, and word breakers.|
|3|This preprocessing is taken to alter the user query for the best search results.|
|4|This altered query is sent to an Azure Cognitive Search Index, which receives the `top` number of results. If the correct answer isn't in these results, increase the value of `top` slightly. Generally, a value of 10 for `top` works in 90% of queries.|
|5|QnA Maker applies advanced featurization to determine the correctness of the fetched search results for the user query. |
|6|The trained ranker model uses the feature score, from step 5, to rank the Azure Cognitive Search results.|
|7|The new results are returned to the client application in ranked order.|
|||

Features used include but aren't limited to word-level semantics, term-level importance in a corpus, and deep learned semantic models to determine similarity and relevance between two text strings.

## HTTP request and response with endpoint
When you publish your knowledge base, the service creates a REST-based HTTP endpoint that can be integrated into your application, commonly a chat bot.

### The user query request to generate an answer

A user query is the question that the end user asks of the knowledge base, such as `How do I add a collaborator to my app?`. The query is often in a natural language format or a few keywords that represent the question, such as `help with collaborators`. The query is sent to your knowledge base from an HTTP request in your client application.

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

### The response from a call to generate an answer

The HTTP response is the answer retrieved from the knowledge base, based on the best match for a given user query. The response includes the answer and the prediction score. If you asked for more than one top answer with the `top` property, you get more than one top answer, each with a score.

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


## Next steps

> [!div class="nextstepaction"]
> [Confidence score](./confidence-score.md)
