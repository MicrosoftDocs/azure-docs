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

When formulating a [semantic query](semantic-how-to-query-request.md), you can optionally extract content from the top-matching documents that "answers" the query directly. One or more answers can be included in the response, which you can then render on a search page to improve the user experience of your app.

In this article, learn how to request a semantic answer, unpack the response, and what content characteristics are most conducive to producing high quality answers.

## Prerequisites

All prerequisites that apply to semantic queries also apply to answers, including service tier and region.

+ Queries formulated using the [semantic query type](semantic-how-to-query-request.md) and include the "answers" parameter. For more information, see [request answers in the query](#query-params).

+ Query strings must be formulated in language having the characteristics of a question.

+ Search documents must include text having the characteristics of an answer. Text must exist in one of the fields listed in "searchFields".

## What is a semantic answer?

Semantic answers are produced from machine reading comprehension models that can formulate answers to queries that look like questions. The model identifies possible answers from the available documents, and when it reaches a high enough confidence level, it will propose an answer.

The answers are composed of verbatim passages, as extracted from documents in an initial result set. For an answer to be returned, phrases or sentences must exist in a search document that have the language characteristics of an answer, and the query itself must be posed as a question. 

Answers are returned as an independent, top-level object in the query response payload that you can choose to render on  search pages, along side search results. Structurally, it's an array element of a response that includes text, a document key, and a confidence score.

<a name="query-params"></a>

## How to request semantic answers in a query

To return a semantic answer, the query must have the semantic query type, language, search fields, and the "answers" parameter. Specifying the "answers" parameter does not guarantee that you will get an answer, but the request must include this parameter if answer processing is to be invoked at all.

The "searchFields" parameter is critical to returning a high quality answer, both in terms of content and order.

```json
{
    "search": "how do clouds form",
    "queryType": "semantic",
    "queryLanguage": "en-us",
    "searchFields": "title,locations,content",
    "answers": "extractive|count-3",
    "count": "true"
}
```

+ A query string must not be null and should be formulated as question. In this preview, the "queryType" and "queryLanguage" must be set exactly as shown in the example.

+ The "searchFields" parameter determines which fields provide tokens to the extraction model. A maximum of 10,000 tokens are used during token intake, so start the field list with concise fields, and then progress to text-rich fields.

+ For "answers", the basic parameter construction is `"answers": "extractive"`, where the default number of answers returned is one. You can increase the number of answers by adding a count, up to a maximum of five.  Whether you need more than one answer depends on the user experience of your app, and how you want to render results.

## Deconstruct an answer from the response

Answers are provided in the @search.answers array, which appears first in the response. If an answer is indeterminate, the response will show up as `"@search.answers": []`. When designing a search results page that includes answers, be sure to handle cases where answers are not found.

The "key" is the document key or ID of the match. Given a document key, you can use [Lookup Document](/rest/api/searchservice/lookup-document) API to retrieve any or all parts of the search document to include on the search page or a detail page.

Both "text" and "highlights" provide identical content, in both plain text and with highlights. By default, highlights are styled as `<em>`, which you can override using the existing highlightPreTag and highlightPostTag parameters. As noted elsewhere, the substance of an answer is verbatim content from a search document. The extraction model looks for characteristics of an answer to find the appropriate content, but does not compose new language in the response.

The "score" is a confidence score that reflects the strength of the answer. If there are multiple answers in the response, this score is used to determine the order. Top answers and top captions can be derived from different search documents, where the top answer originates from one document, and the top caption from another, but in general you will see the same documents in the top positions.

Answers are followed by the "value" array, which always includes scores, captions, and any fields that are retrievable by default. If you specified the select parameter, the "value" array is limited to the fields that you specified. For more information about items in the response, see [Create a semantic query](semantic-how-to-query-request.md).

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
            "title": "Earth Atmosphere",
            "content": "Fog is essentially a cloud lying on the ground. Like all clouds, it forms when the air reaches its dew point—the temperature at  \n\nwhich an air mass is cool enough for its water vapor to condense into liquid droplets.\n\nThis false-color image shows valley fog, which is common in the Pacific Northwest of North America. On clear winter nights, the \n\nground and overlying air cool off rapidly, especially at high elevations. Cold air is denser than warm air, and it sinks down into the \n\nvalleys. The moist air in the valleys gets chilled to its dew point, and fog forms. If undisturbed by winds, such fog may persist for \n\ndays. The Terra satellite captured this image of foggy valleys northeast of Vancouver in February 2010.\n\n\n",
            "metadata_storage_path": "aHR0cHM6Ly9oZWlkaXN0YmxvYnN0b3JhZ2UuYmxvYi5jb3JlLndpbmRvd3MubmV0L25hc2EtZWJvb2stMS01MC9wYWdlLTQxLnBkZg2",
            "locations": [
                "Pacific Northwest",
                "North America",
                "Vancouver"
            ]
        }
```

## Tips for producing high-quality answers

For best results, return semantic answers on a document corpus having the following characteristics:

+ "searchFields" should include one or more fields that provides sufficient text in which an answer is likely to be found.

+ Fields should not contain more than 10,000 tokens (approximately three pages in length on a printed page). Fields can contain more content, but the extraction model will ignore it.

+ query strings must not be null (search=`*`) and the string should have the characteristics of a question, as opposed to a keyword search (a sequential list of arbitrary terms or phrases). If the query string does not appear to be answer, answer processing is skipped, even if the request specifies "answers" as a query parameter.

## Next steps

+ [Semantic search overview](semantic-search-overview.md)
+ [Semantic ranking algorithm](semantic-ranking.md)
+ [Similarity algorithm](index-ranking-similarity.md)
+ [Create a semantic query](semantic-how-to-query-request.md)