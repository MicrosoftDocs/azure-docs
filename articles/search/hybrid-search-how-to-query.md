---
title: Hybrid query how-to
titleSuffix: Azure Cognitive Search
description: Learn how to build queries for hybrid search.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 10/10/2023
---

# Create a hybrid query in Azure Cognitive Search

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr#readme).

Hybrid search consists of keyword queries and vector queries in a single search request. 

The response includes the top results ordered by search score. Both vector queries and free text queries are assigned an initial search score from their respecitive scoring or similarity algorithms. Those scores are merged using [Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md) to return a single ranked result set. 

## Prerequisites

+ Azure Cognitive Search, in any region and on any tier. Most existing services support vector search. For services created prior to January 2019, there is a small subset which won't support vector search. If an index containing vector fields fails to be created or updated, this is an indicator. In this situation, a new service must be created.

+ A search index containing vector and non-vector fields. See [Create an index](search-how-to-create-search-index.md) and [Add vector fields to a search index](vector-search-how-to-create-index.md).

+ Use REST API version **2023-07-01-Preview**, the [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr/tree/main), or Search Explorer in the Azure portal.

+ (Optional) If you want to also use [semantic ranking](semantic-search-overview.md) and vector search together, your search service must be Basic tier or higher, with [semantic ranking enabled](semantic-how-to-enable-disable.md).

## Limitations

Cognitive Search doesn't provide built-in vectorization of the query input string. Encoding (text-to-vector) of the query string requires that you pass the query string to an embedding model for vectorization. You would then pass the response to the search engine for similarity search over vector fields.

All results are returned in plain text, including vectors. If you use Search Explorer in the Azure portal to query an index that contains vectors, the numeric vectors are returned in plain text. Because numeric vectors aren't useful in search results, choose other fields in the index as a proxy for the vector match. For example, if an index has "descriptionVector" and "descriptionText" fields, the query can match on "descriptionVector" but the search result shows "descriptionText". Use the `select` parameter to specify only human-readable fields in the results.

## Hybrid query request

A hybrid query combines full text search and vector search, where the `"search"` parameter takes a query string and `"vectors.value"` takes the vector query. The search engine runs full text and vector queries in parallel. All matches are evaluated for relevance using Reciprocal Rank Fusion (RRF) and a single result set is returned in the response.

Hybrid queries are useful because they add support for all query capabilities, including orderby and [semantic ranking](semantic-how-to-query-request.md). For example, in addition to the vector query, you could search over people or product names or titles, scenarios for which similarity search isn't a good fit.

The following example is from the [Postman collection of REST APIs](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python) that demonstrate hybrid query configurations.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-07-01-Preview
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "vectors": [{
        "value": [
            -0.009154141,
            0.018708462,
            . . . 
            -0.02178128,
            -0.00086512347
        ],
        "fields": "contentVector",
        "k": 10
    }],
    "search": "what azure services support full text search",
    "select": "title, content, category",
    "top": "10"
}
```

## Hybrid search with filter

This example adds a filter, which is applied to the "filterable" nonvector fields of the search index.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version={{api-version}}
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "vectors": [
        {
            "value": [
                -0.009154141,
                0.018708462,
                . . . 
                -0.02178128,
                -0.00086512347
            ],
            "fields": "contentVector",
            "k": 10
        }
    ],
    "search": "what azure services support full text search",
    "filter": "category eq 'Databases'",
    "top": "10"
}
```

## Semantic hybrid search

Assuming that you've [enabled semantic ranking](semantic-how-to-enable-disable.md) and your index definition includes a [semantic configuration](semantic-how-to-query-request.md), you can formulate a query that includes vector search, plus keyword search with semantic ranking, caption, answers, and spell check. 

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version={{api-version}}
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "vectors": [
        {
            "value": [
                -0.009154141,
                0.018708462,
                . . . 
                -0.02178128,
                -0.00086512347
            ],
            "fields": "contentVector",
            "k": 10
        }
    ],
    "search": "what azure services support full text search",
    "select": "title, content, category",
    "queryType": "semantic",
    "semanticConfiguration": "my-semantic-config",
    "queryLanguage": "en-us",
    "captions": "extractive",
    "answers": "extractive",
    "top": "10"
}
```

## Semantic hybrid search with filter

Here's the last query in the collection. It's the same semantic hybrid query as the previous example, but with a filter.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version={{api-version}}
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "vectors": [
        {
            "value": [
                -0.009154141,
                0.018708462,
                . . . 
                -0.02178128,
                -0.00086512347
            ],
            "fields": "contentVector",
            "k": 10
        }
    ],
    "search": "what azure services support full text search",
    "select": "title, content, category",
    "queryType": "semantic",
    "semanticConfiguration": "my-semantic-config",
    "queryLanguage": "en-us",
    "captions": "extractive",
    "answers": "extractive",
    "filter": "category eq 'Databases'",
    "top": "10"
}
```

**Key points:**

+ Vector search is specified through the vector "vector.value" property. Keyword search is specified through "search" property.

+ In a hybrid search, you can integrate vector search with full text search over keywords. Filters, spell check, and semantic ranking apply to textual content only, and not vectors. In this final query, there's no semantic "answer" because the system didn't produce one that was sufficiently strong.

## Configure a query response

When you're setting up the hybrid query, think about the response structure. The response is a flattened rowset. Parameters on the query determine which fields are in each row and how many rows are in the response. The search engine ranks the matching documents and returns the most relevant results.

### Fields in a response

Search results are composed of "retrievable" fields from your search index. A result is either:

+ All "retrievable" fields (a REST API default).
+ Fields explicitly listed in a "select" parameter on the query. 

The examples in this article used a "select" statement to specify text (non-vector) fields in the response.

> [!NOTE]
> Vectors aren't designed for readability, so avoid returning them in the response. Instead, choose non-vector fields that are representative of the search document. For example, if the query targets a "descriptionVector" field, return an equivalent text field if you have one ("description") in the response.

### Number of results

A query might match to any number of documents, as many as all of them if the search criteria are weak (for example "search=*" for a null query). Because it's seldom practical to return unbounded results, you should specify a maximum for the response:

+ `"k": n` results for vector-only queries
+ `"top": n` results for hybrid queries that include a "search" parameter

Both "k" and "top" are optional. Unspecified, the default number of results in a response is 50. You can set "top" and "skip" to [page through more results](search-pagination-page-layout.md#paging-results) or change the default.

### Ranking

Multiple sets are created for hybrid queries, with or without the optional [semantic reranking](semantic-search-overview.md). Ranking of results is computed by Reciprocal Rank Fusion (RRF).

In this section, compare the responses between single vector search and simple hybrid search for the top result. The different ranking algorithms, HNSW's similarity metric and RRF is this case, produce scores that have different magnitudes. This behavior is by design. RRF scores can appear quite low, even with a high similarity match. Lower scores are a characteristic of the RRF algorithm. In a hybrid query with RRF, more of the reciprocal of the ranked documents are included in the results, given the relatively smaller score of the RRF ranked documents, as opposed to pure vector search.

**Single Vector Search**: Results ordered by cosine similarity (default vector similarity distance function).

```json
{
    "@search.score": 0.8851871,
    "title": "Azure Cognitive Search",
    "content": "Azure Cognitive Search is a fully managed search-as-a-service that enables you to build rich search experiences for your applications. It provides features like full-text search, faceted navigation, and filters. Azure Cognitive Search supports various data sources, such as Azure SQL Database, Azure Blob Storage, and Azure Cosmos DB. You can use Azure Cognitive Search to index your data, create custom scoring profiles, and integrate with other Azure services. It also integrates with other Azure services, such as Azure Cognitive Services and Azure Machine Learning.",
    "category": "AI + Machine Learning"
},
```

**Hybrid Search**: Combined keyword and vector search results using Reciprocal Rank Fusion.

```json
{
    "@search.score": 0.03333333507180214,
    "title": "Azure Cognitive Search",
    "content": "Azure Cognitive Search is a fully managed search-as-a-service that enables you to build rich search experiences for your applications. It provides features like full-text search, faceted navigation, and filters. Azure Cognitive Search supports various data sources, such as Azure SQL Database, Azure Blob Storage, and Azure Cosmos DB. You can use Azure Cognitive Search to index your data, create custom scoring profiles, and integrate with other Azure services. It also integrates with other Azure services, such as Azure Cognitive Services and Azure Machine Learning.",
    "category": "AI + Machine Learning"
},
```

## Next steps

As a next step, we recommend reviewing the demo code for [Python](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python), [C#](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-dotnet) or [JavaScript](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-javascript).
