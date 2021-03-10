---
title: Return a semantic answer
titleSuffix: Azure Cognitive Search
description: Describes the composition of a semantic answer and how to obtain answers from a result set.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/12/2021
---

# Return a semantic answer in Azure Cognitive Search

> [!IMPORTANT]
> Semantic ranking and semantic answers are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When formulating a [semantic query](semantic-how-to-query-request.md), you can optionally extract content from the top-matching documents that answers the query directly. One or more answers are included in the response, which you can then render on a search page.

Extraction and language representation models are used to identify an answer. For an answer to be returned, phrases or sentences must exist in a search document that have the language characteristics of an answer, and the query itself must be posed as a question. If the query looks more like a keyword search than a question, answer processing is skipped.

## Prerequisites

+ Queries formulated using the [semantic query type](semantic-how-to-query-request.md). Required query parameters include queryType, queryLanguage, searchFields, and answers. 

All prerequisites that apply to semantic queries also apply to answers, including service tier and region.

## What is a semantic answer?

A semantic answer is an extraction of content from a matching document that serves as an answer to the query itself. Structurally, it's an element of a response that includes text and a key.

Semantic answers use machine learning models from Bing to formulate answers to queries that look like questions. The answers are selected from passages most relevant to the query, as extracted from the top documents in an initial result set. Answers are returned as an independent, top-level object in the query response payload that you can choose to render on the search pages, along side search results.

A semantic response includes new properties for scores, captions, and answers. A semantic response is built from the standard response, using the top 50 results returned by the [full text search engine](search-lucene-query-architecture.md), which are then re-ranked using the semantic ranker. If more than 50 are specified, the additional results are returned, but they won’t be semantically re-ranked.

As with all queries, a response is composed of all fields marked as retrievable, or just those fields listed in the select statement. It also includes an "answer" field and "captions".

+ For each semantic result, by default, there is one "answer", returned as a distinct field that you can choose to render in a search page. You can specify up to five. Formulation of answer is automated: reading through all the documents in the initial results, running extractive summarization, followed by machine reading comprehension, and finally promoting a direct answer to the user’s question in the answer field.

+ A "caption" is an extraction-based summarization of document content, returned in plain text or with highlights. Captions are included automatically and cannot be suppressed. Highlights are applied using machine reading comprehension to identify which strings should be emphasized. Highlights draw your attention to the most relevant passages, so that you can quickly scan a page of results to find the right document.

A semantically re-ranked result set orders results by the @search.rerankerScore value. If you add an OrderBy clause, an HTTP 400 error will be returned because that clause is not supported in a semantic query.

## Example request and response

```json
{
    "search": "how do clouds form",
    "queryType": "semantic",
    "queryLanguage": "en-us",
    "answers": "extractive",
    "count": "true"
}
```

```json
{
    "@search.answers": [
        {
            "key": "aHR0cHM6Ly9oZWlkaXN0YmxvYnN0b3JhZ2UuYmxvYi5jb3JlLndpbmRvd3MubmV0L25hc2EtZWJvb2stMS01MC9wYWdlLTQ1LnBkZg2",
            "text": "Sunlight heats the land all day, warming that moist air and causing it to rise high into the   atmosphere until it cools and condenses into water droplets. Clouds generally form where air is ascending (over land in this case),   but not where it is descending (over the river).",
            "highlights": "Sunlight heats the land all day, warming that moist air and causing it to rise high into the   atmosphere until it cools and condenses into water droplets. Clouds generally form<em> where air is ascending</em> (over land in this case),   but not where it is<em> descending</em> (over the river).",
            "score": 0.94639826
        }
    ],
    "value": [
        {
            "@search.score": 0.5479723,
            "@search.rerankerScore": 1.0321671911515296,
            "@search.captions": [
                {
                    "text": "Like all clouds, it forms when the air reaches its dew point—the temperature at which an air mass is cool enough for its water vapor to condense into liquid droplets. This false-color image shows valley fog, which is common in the Pacific Northwest of North America.",
                    "highlights": "Like all<em> clouds</em>, it<em> forms</em> when the air reaches its dew point—the temperature at    which an air mass is cool enough for its water vapor to condense into liquid droplets. This false-color image shows valley<em> fog</em>, which is common in the Pacific Northwest of North America."
                }
            ],
            "content": "Fog is essentially a cloud lying on the ground. Like all clouds, it forms when the air reaches its dew point—the temperature at  \n\nwhich an air mass is cool enough for its water vapor to condense into liquid droplets.\n\nThis false-color image shows valley fog, which is common in the Pacific Northwest of North America. On clear winter nights, the \n\nground and overlying air cool off rapidly, especially at high elevations. Cold air is denser than warm air, and it sinks down into the \n\nvalleys. The moist air in the valleys gets chilled to its dew point, and fog forms. If undisturbed by winds, such fog may persist for \n\ndays. The Terra satellite captured this image of foggy valleys northeast of Vancouver in February 2010.\n\n\n",
            "metadata_storage_path": "aHR0cHM6Ly9oZWlkaXN0YmxvYnN0b3JhZ2UuYmxvYi5jb3JlLndpbmRvd3MubmV0L25hc2EtZWJvb2stMS01MC9wYWdlLTQxLnBkZg2",
            "locations": [
                "Pacific Northwest",
                "North America",
                "Vancouver"
            ]
        }
```

## Next steps

+ [Semantic search overview](semantic-search-overview.md)
+ [Similarity algorithm](index-ranking-similarity.md)
+ [Create a semantic query](semantic-how-to-query-request.md)
+ [Create a basic query](search-query-create.md)