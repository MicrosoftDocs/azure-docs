---
title: Hybrid search
titleSuffix: Azure Cognitive Search
description: Describes concepts and architecture of hybrid query processing and document retrieval. Hybrid queries combine vector search and full text search.

author: robertklee
ms.author: robertlee
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/27/2023
---

# Hybrid search using vectors and full text in Azure Cognitive Search

> [!IMPORTANT]
> Hybrid search uses the [vector features](vector-search-overview.md) currently in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Hybrid search is a combination of full text and vector queries that execute against a search index that contains both searchable plain text content and generated embeddings. For query purposes, hybrid search is:

+ A single query request that includes both `search` and `vectors` query parameters
+ Executing in parallel
+ With merged results in the query response, scored using [Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md)

This article explains the concepts, benefits, and limitations of hybrid search.

## How does hybrid search work?

In Azure Cognitive Search, vector indexes containing embeddings can live alongside textual and numerical fields allowing you to issue hybrid full text and vector queries. Hybrid queries can take advantage of existing functionality like filtering, faceting, sorting, scoring profiles, and [semantic ranking](semantic-search-overview.md) in a single search request.

Hybrid search combines results from both full text and vector queries, which use different ranking functions such as BM25 and HNSW. A [Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md) algorithm is used to merge results. The query response provides just one result set, using RRF to determine which matches are included.

## Structure of a hybrid query

Hybrid search is predicated on having a search index that contains fields of various [data types](/rest/api/searchservice/supported-data-types), including plain text and numbers, geo coordinates for geospatial search, and vectors for a mathematical representation of a chunk of text or image, audio, and video. You can use almost all query capabilities in Cognitive Search with a vector query, except for client-side interactions such as autocomplete and suggestions.

A representative hybrid query might be as follows (notice the vector is trimmed for brevity):

```http
POST https://{{searchServiceName}}.search.windows.net/indexes/hotels-vector-quickstart/docs/search?api-version=2023-07-01-Preview
  content-type: application/JSON
{
    "count": true,
    "search": "historic hotel walk to restaurants and shopping",
    "select": "HotelId, HotelName, Category, Description, Address/City, Address/StateProvince",
    "filter": "geo.distance(Location, geography'POINT(-77.03241 38.90166)') le 300",
    "facets": [ "Address/StateProvince"], 
    "vectors": [
        {
            "value": [ <array of embeddings> ]
            "k": 7,
            "fields": "DescriptionVector"
        },
        {
            "value": [ <array of embeddings> ]
            "k": 7,
            "fields": "Description_frVector"
        }
    ],
    "queryType": "semantic",
    "queryLanguage": "en-us",
    "semanticConfiguration": "my-semantic-config"
}
```

Key points include:

+ `search` specifies a full text search query.
+ `vectors` for vector queries, which can be multiple, targeting multiple vector fields. If the embedding space includes multi-lingual content, vector queries can find the match with no language analyzers or translation required.
+ `select` specifies which fields to return in results, which can be text fields that are human readable.
+ `filters` can specify geospatial search or other include and exclude criteria, such as whether parking is included. The geospatial query in this example finds hotels within a 300-kilometer radius of Washington D.C.
+ `facets` can be used to compute facet buckets over results that are returned from hybrid queries.
+ `queryType=semantic` invokes semantic ranking, applying machine reading comprehension to surface more relevant search results.

Filters and facets target data structures within the index that are distinct from the inverted indexes used for full text search and the vector indexes used for vector search. As such, when filters and faceted operations execute, the search engine can apply the operational result to the hybrid search results in the response.

Notice how there's no `orderby` in the query. Explicit sort orders override relevanced-ranked results, so if you want similarity and BM25 relevance, omit sorting in your query.

A response from the above query might look like this:

```http
{
    "@odata.count": 3,
    "@search.facets": {
        "Address/StateProvince": [
            {
                "count": 1,
                "value": "NY"
            },
            {
                "count": 1,
                "value": "VA"
            }
        ]
    },
    "value": [
        {
            "@search.score": 0.03333333507180214,
            "@search.rerankerScore": 2.5229012966156006,
            "HotelId": "49",
            "HotelName": "Old Carrabelle Hotel",
            "Description": "Spacious rooms, glamorous suites and residences, rooftop pool, walking access to shopping, dining, entertainment and the city center.",
            "Category": "Luxury",
            "Address": {
                "City": "Arlington",
                "StateProvince": "VA"
            }
        },
        {
            "@search.score": 0.032522473484277725,
            "@search.rerankerScore": 2.111117362976074,
            "HotelId": "48",
            "HotelName": "Nordick's Motel",
            "Description": "Only 90 miles (about 2 hours) from the nation's capital and nearby most everything the historic valley has to offer.  Hiking? Wine Tasting? Exploring the caverns?  It's all nearby and we have specially priced packages to help make our B&B your home base for fun while visiting the valley.",
            "Category": "Boutique",
            "Address": {
                "City": "Washington D.C.",
                "StateProvince": null
            }
        }
    ]
}
```

## Benefits

Hybrid search combines the strengths of vector search and keyword search. The advantage of vector search is finding information that's similar to your search query, even if there are no keyword matches in the inverted index. The advantage of keyword or full text search is precision, and the ability to apply semantic ranking that improves the quality of the initial results. Some scenarios - such as querying over product codes, highly specialized jargon, dates, and people's names - can perform better with keyword search because it can identify exact matches.

Benchmark testing on real-world and benchmark datasets indicates that hybrid retrieval with semantic ranking offers significant benefits in search relevance.

## See also

[Outperform vector search with hybrid retrieval and ranking (Tech blog)](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167)