---
title: Structure a semantic response
titleSuffix: Azure Cognitive Search
description: Describes the semantic ranking algorithm in Cognitive Search and how to structure 'semantic answers' and 'semantic captions' from a result set.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/02/2021
ms.custom: references_regions
---

# Semantic ranking and responses in Azure Cognitive Search

> [!IMPORTANT]
> The semantic ranking algorithm and semantic answers/captions are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Semantic ranking improves the precision of search results by reranking the top matches using a semantic ranking model trained for queries expressed in natural language as opposed to keywords.

This article describes the semantic ranking algorithm and how a semantic response is shaped. A response includes captions, both in plain text and with highlights, and answers (optional).

+ Semantic captions are text passages relevant to the query extracted from the search results. They can help to summarize a result when individual content fields are too large for the results page. Captions feature semantic highlights, allowing users to quickly skim query results to find the most relevant documents thus improving overall user experience.

+ Semantic answers use machine learning models from Bing to formulate answers to queries that look like questions. The answers are selected from a list of passages most relevant to the query, as extracted from the top documents in the query result set. Answers are returned as an independent, top-level object in the query response payload that you can choose to render on the search pages, along side search results.

## Prerequisites

+ Queries formulated using the semantic query type. For more information, see [Create a semantic query](semantic-how-to-query-request.md).

## Understanding a semantic response

A semantic response includes new properties for scores, captions, and answers. A semantic response is built from the standard response, using the top 50 results returned by the [full text search engine](search-lucene-query-architecture.md), which are then re-ranked using the semantic ranker. If more than 50 are specified, the additional results are returned, but they won’t be semantically re-ranked.

As with all queries, a response is composed of all fields marked as retrievable, or just those fields listed in the select statement. It also includes an "answer" field and "captions".

+ For each semantic result, by default, there is one "answer", returned as a distinct field that you can choose to render in a search page. You can specify up to five. Formulation of answer is automated: reading through all the documents in the initial results, running extractive summarization, followed by machine reading comprehension, and finally promoting a direct answer to the user’s question in the answer field.

+ A "caption" is an extraction-based summarization of document content, returned in plain text or with highlights. Captions are included automatically and cannot be suppressed. Highlights are applied using machine reading comprehension to identify which strings should be emphasized. Highlights draw your attention to the most relevant passages, so that you can quickly scan a page of results to find the right document.

A semantically re-ranked result set orders results by the @search.rerankerScore value. If you add an OrderBy clause, an HTTP 400 error will be returned because that clause is not supported in a semantic query.

## Example

The @search.rerankerScore exists alongside the standard @search.score and is used to re-rank the results.

Given the following query:

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2020-06-30-Preview
{
    "search": "newer hotel near the water with a great restaurant",
    "queryType": "semantic",
    "queryLanguage": "en-us",
    "answers": "none",
    "searchFields": "HotelName,Category,Description",
    "select": "HotelId,HotelName,Description,Category",
    "count": true
}
```

You can expect to see the following result, representative of a semantic response. These results show just the top three responses, as ranked by "@search.rerankerScore". Notice how Oceanside Resort is now ranked first. Under the default ranking of "@search.score", this result would be returned in second place, after Trails End.

```http
{
    "@odata.count": 31,
    "@search.answers": [],
    "value": [
        {
            "@search.score": 1.8920634,
            "@search.rerankerScore": 1.1091284966096282,
            "@search.captions": [
                {
                    "text": "Oceanside Resort. Budget. New Luxury Hotel.  Be the first to stay. Bay views from every room, location near the piper, rooftop pool, waterfront dining & more.",
                    "highlights": "<em>Oceanside Resort.</em> Budget. New Luxury Hotel.  Be the first to stay.<em> Bay views</em> from every room, location near the piper, rooftop pool, waterfront dining & more."
                }
            ],
            "HotelId": "18",
            "HotelName": "Oceanside Resort",
            "Description": "New Luxury Hotel.  Be the first to stay. Bay views from every room, location near the piper, rooftop pool, waterfront dining & more.",
            "Category": "Budget"
        },
        {
            "@search.score": 2.5204072,
            "@search.rerankerScore": 1.0731962407007813,
            "@search.captions": [
                {
                    "text": "Trails End Motel. Luxury. Only 8 miles from Downtown.  On-site bar/restaurant, Free hot breakfast buffet, Free wireless internet, All non-smoking hotel. Only 15 miles from airport.",
                    "highlights": "<em>Trails End Motel.</em> Luxury. Only 8 miles from Downtown.  On-site bar/restaurant, Free hot breakfast buffet, Free wireless internet, All non-smoking hotel. Only 15 miles from airport."
                }
            ],
            "HotelId": "40",
            "HotelName": "Trails End Motel",
            "Description": "Only 8 miles from Downtown.  On-site bar/restaurant, Free hot breakfast buffet, Free wireless internet, All non-smoking hotel. Only 15 miles from airport.",
            "Category": "Luxury"
        },
        {
            "@search.score": 1.4104348,
            "@search.rerankerScore": 1.06992666143924,
            "@search.captions": [
                {
                    "text": "Winter Panorama Resort. Resort and Spa. Newly-renovated with large rooms, free 24-hr airport shuttle & a new restaurant. Rooms/suites offer mini-fridges & 49-inch HDTVs.",
                    "highlights": "<em>Winter Panorama Resort</em>. Resort and Spa. Newly-renovated with large rooms, free 24-hr airport shuttle & a new restaurant. Rooms/suites offer mini-fridges & 49-inch HDTVs."
                }
            ],
            "HotelId": "12",
            "HotelName": "Winter Panorama Resort",
            "Description": "Newly-renovated with large rooms, free 24-hr airport shuttle & a new restaurant. Rooms/suites offer mini-fridges & 49-inch HDTVs.",
            "Category": "Resort and Spa"
        }
```

## Next steps

+ [Semantic search overview](semantic-search-overview.md)
+ [Similarity algorithm](index-ranking-similarity.md)
+ [Create a semantic query](semantic-how-to-query-request.md)
+ [Create a basic query](search-query-create.md)