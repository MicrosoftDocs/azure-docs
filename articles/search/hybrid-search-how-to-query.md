---
title: Hybrid query
titleSuffix: Azure AI Search
description: Learn how to build queries for hybrid search.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 04/23/2024
---

# Create a hybrid query in Azure AI Search

[Hybrid search](hybrid-search-overview.md) combines one or more keyword queries with one or more vector queries in a single search request. The queries execute in parallel. The results are merged and reordered by new search scores, using [Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md) to return a single ranked result set.

In most cases, [per benchmark tests](https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/azure-ai-search-outperforming-vector-search-with-hybrid/ba-p/3929167), hybrid queries with semantic ranking return the most relevant results.

To define a hybrid query, use REST API [**2023-11-01**](/rest/api/searchservice/documents/search-post), [**2023-10-01-preview**](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2023-10-01-preview&preserve-view=true), [**2024-03-01-preview**](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2024-03-01-preview&preserve-view=true), Search Explorer in the Azure portal, or newer versions of the Azure SDKs. 

## Prerequisites

+ A search index containing `searchable` vector and nonvector fields. See [Create an index](search-how-to-create-search-index.md) and [Add vector fields to a search index](vector-search-how-to-create-index.md).

+ (Optional) If you want [semantic ranking](semantic-how-to-configure.md), your search service must be Basic tier or higher, with [semantic ranking enabled](semantic-how-to-enable-disable.md).

+ (Optional) If you want text-to-vector conversion of a query string (currently in preview), [create and assign a vectorizer](vector-search-how-to-configure-vectorizer.md) to vector fields in the search index.

## Run a hybrid query in Search Explorer

1. In [Search Explorer](search-explorer.md), make sure the API version is **2023-10-01-preview** or later.

1. Under **View**, select **JSON view**. 

1. Replace the default query template with a hybrid query, such as the one starting on line 539 for the [vector quickstart example](vector-search-how-to-configure-vectorizer.md#try-a-vectorizer-with-sample-data). For brevity, the vector is truncated in this article. 

   A hybrid query has a text query specified in `search`, and a vectory query specified under `vectorQueries.vector`.

   The text query and vector query should be equivalent or at least not conflict. If the queries are different, you don't get the benefit of hybrid.

    ```json
    {
        "count": true,
        "search": "historic hotel walk to restaurants and shopping",
        "select": "HotelId, HotelName, Category, Tags, Description",
        "top": 7,
        "vectorQueries": [
            {
                "vector": [0.01944167, 0.0040178085, -0.007816401 ... <remaining values omitted> ], 
                "k": 7,
                "fields": "DescriptionVector",
                "kind": "vector",
                "exhaustive": true
            }
        ]
    }
    ```

1. Select **Search**.

## Hybrid query request (REST API)

A hybrid query combines text search and vector search, where the `search` parameter takes a query string and `vectorQueries.vector` takes the vector query. The search engine runs full text and vector queries in parallel. The union of all matches is evaluated for relevance using Reciprocal Rank Fusion (RRF) and a single result set is returned in the response.

Results are returned in plain text, including vectors in fields marked as `retrievable`. Because numeric vectors aren't useful in search results, choose other fields in the index as a proxy for the vector match. For example, if an index has "descriptionVector" and "descriptionText" fields, the query can match on "descriptionVector" but the search result can show "descriptionText". Use the `select` parameter to specify only human-readable fields in the results.

The following example shows a hybrid query configuration.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "vectorQueries": [{
        "vector": [
            -0.009154141,
            0.018708462,
            . . . 
            -0.02178128,
            -0.00086512347
        ],
        "fields": "DescriptionVector",
        "kind": "vector",
        "exhaustive": true,
        "k": 10
    }],
    "search": "historic hotel walk to restaurants and shopping",
    "select": "HotelName, Description, Address/City",
    "top": "10"
}
```

**Key points:**

+ The vector query string is specified through the `vectorQueries.vector` property. The query executes against the "DescriptionVector" field. Set `kind` to "vector" to indicate the query type. Optionally, set `exhaustive` to true to query the full contents of the vector field.

+ Keyword search is specified through `search` property. It executes in parallel with the vector query.

+ `k` determines how many nearest neighbor matches are returned from the vector query and provided to the RRF ranker.

+ `top` determines how many matches are returned in the response all-up. In this example, the response includes 10 results, assuming there are at least 10 matches in the merged results.

## Hybrid search with filter

This example adds a filter, which is applied to the `filterable` nonvector fields of the search index.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "vectorQueries": [
        {
            "vector": [
                -0.009154141,
                0.018708462,
                . . . 
                -0.02178128,
                -0.00086512347
            ],
            "fields": "DescriptionVector",
            "kind": "vector",
            "k": 10
        }
    ],
    "search": "historic hotel walk to restaurants and shopping",
    "vectorFilterMode": "postFilter",
    "filter": "ParkingIncluded",
    "top": "10"
}
```

**Key points:**

+ Filters are applied to the content of filterable fields. In this example, the ParkingIncluded field is a boolean and it's marked as `filterable` in the index schema.

+ In hybrid queries, filters can be applied before query execution to reduce the query surface, or after query execution to trim results. `"preFilter"` is the default. To use `postFilter`, set the [filter processing mode](vector-search-filters.md) as shown in this example.

+ When you postfilter query results, the number of results might be less than top-n.

## Semantic hybrid search

Assuming that you [enabled semantic ranking](semantic-how-to-enable-disable.md) and your index definition includes a [semantic configuration](semantic-how-to-query-request.md), you can formulate a query that includes vector search and keyword search, with semantic ranking over the merged result set. Optionally, you can add captions and answers. 

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "vectorQueries": [
        {
            "vector": [
                -0.009154141,
                0.018708462,
                . . . 
                -0.02178128,
                -0.00086512347
            ],
            "fields": "DescriptionVector",
            "kind": "vector",
            "k": 50
        }
    ],
    "search": "historic hotel walk to restaurants and shopping",
    "select": "HotelName, Description, Tags",
    "queryType": "semantic",
    "semanticConfiguration": "my-semantic-config",
    "captions": "extractive",
    "answers": "extractive",
    "top": "50"
}
```

**Key points:**

+ Semantic ranking accepts up to 50 results from the merged response. Set "k" and "top" to 50 for equal representation of both queries.

+ "queryType" and "semanticConfiguration" are required.

+ "captions" and "answers" are optional. Values are extracted from verbatim text in the results. An answer is only returned if the results include content having the characteristics of an answer to the query.

## Semantic hybrid search with filter

Here's the last query in the collection. It's the same semantic hybrid query as the previous example, but with a filter.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "vectorQueries": [
        {
            "vector": [
                -0.009154141,
                0.018708462,
                . . . 
                -0.02178128,
                -0.00086512347
            ],
            "fields": "DescriptionVector",
            "kind": "vector",
            "k": 50
        }
    ],
    "search": "historic hotel walk to restaurants and shopping",
    "select": "HotelName, Description, Tags",
    "queryType": "semantic",
    "semanticConfiguration": "my-semantic-config",
    "captions": "extractive",
    "answers": "extractive",
    "filter": "ParkingIsIncluded'",
    "vectorFilterMode": "postFilter",
    "top": "50"
}
```

**Key points:**

+ The filter mode can affect the number of results available to the semantic reranker. As a best practice, it's smart to give the semantic ranker the maximum number of documents (50). If prefilters or postfilters are too selective, you might be underserving the semantic ranker by giving it fewer than 50 documents to work with.

+ Prefiltering is applied before query execution. If prefilter reduces the search area to 100 documents, the vector query executes over the "DescriptionVector" field for those 100 documents, returning the k=50 best matches. Those 50 matching documents then pass to RRF for merged results, and then to semantic ranker.

+ Postfilter is applied after query execution. If k=50 returns 50 matches on the vector query side, then the post-filter is applied to the 50 matches, reducing results that meet filter criteria, leaving you with fewer than 50 documents to pass to semantic ranker

## Configure a query response

When you're setting up the hybrid query, think about the response structure. The response is a flattened rowset. Parameters on the query determine which fields are in each row and how many rows are in the response. The search engine ranks the matching documents and returns the most relevant results.

### Fields in a response

Search results are composed of `retrievable` fields from your search index. A result is either:

+ All `retrievable` fields (a REST API default).
+ Fields explicitly listed in a "select" parameter on the query. 

The examples in this article used a "select" statement to specify text (nonvector) fields in the response.

> [!NOTE]
> Vectors aren't reverse engineered into human readable text, so avoid returning them in the response. Instead, choose nonvector fields that are representative of the search document. For example, if the query targets a "DescriptionVector" field, return an equivalent text field if you have one ("Description") in the response.

### Number of results

A query might match to any number of documents, as many as all of them if the search criteria are weak (for example "search=*" for a null query). Because it's seldom practical to return unbounded results, you should specify a maximum for the response:

+ `"k": n` results for vector-only queries
+ `"top": n` results for hybrid queries that include a "search" parameter

Both "k" and "top" are optional. Unspecified, the default number of results in a response is 50. You can set "top" and "skip" to [page through more results](search-pagination-page-layout.md#paging-results) or change the default.

If you're using semantic ranking, it's a best practice to set both "k" and "top" to at least 50. The semantic ranker can take up to 50 results. By specifying 50 for each query, you get equal representation from both search subsystems.

### Ranking

Multiple sets are created for hybrid queries, with or without the optional [semantic reranking](semantic-search-overview.md). Ranking of results is computed by Reciprocal Rank Fusion (RRF).

In this section, compare the responses between single vector search and simple hybrid search for the top result. The different ranking algorithms, HNSW's similarity metric and RRF is this case, produce scores that have different magnitudes. This behavior is by design. RRF scores can appear quite low, even with a high similarity match. Lower scores are a characteristic of the RRF algorithm. In a hybrid query with RRF, more of the reciprocal of the ranked documents are included in the results, given the relatively smaller score of the RRF ranked documents, as opposed to pure vector search.

**Single Vector Search**: @search.score for results ordered by cosine similarity (default vector similarity distance function).

```json
{
    "@search.score": 0.8399121,
    "HotelId": "49",
    "HotelName": "Old Carrabelle Hotel",
    "Description": "Spacious rooms, glamorous suites and residences, rooftop pool, walking access to shopping, dining, entertainment and the city center.",
    "Category": "Luxury",
    "Address": {
    "City": "Arlington"
    }
}
```

**Hybrid Search**: @search.score for hybrid results ranked using Reciprocal Rank Fusion.

```json
{
    "@search.score": 0.032786883413791656,
    "HotelId": "49",
    "HotelName": "Old Carrabelle Hotel",
    "Description": "Spacious rooms, glamorous suites and residences, rooftop pool, walking access to shopping, dining, entertainment and the city center.",
    "Category": "Luxury",
    "Address": {
    "City": "Arlington"
    }
}
```

## Next steps

As a next step, we recommend reviewing the demo code for [Python](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-python), [C#](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-dotnet) or [JavaScript](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-javascript).
