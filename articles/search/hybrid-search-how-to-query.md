---
title: Hybrid query how-to
titleSuffix: Azure AI Search
description: Learn how to build queries for hybrid search.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
---

# Create a hybrid query in Azure AI Search

Hybrid search consists of keyword queries and vector queries in a single search request. 

The response includes the top results ordered by search score. Both vector queries and free text queries are assigned an initial search score from their respective scoring or similarity algorithms. Those scores are merged using [Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md) to return a single ranked result set. 

## Prerequisites

+ Azure AI Search, in any region and on any tier. Most existing services support vector search. For services created prior to January 2019, there's a small subset that doesn't support vector search. If an index containing vector fields fails to be created or updated, this is an indicator. In this situation, a new service must be created.

+ A search index containing vector and non-vector fields. See [Create an index](search-how-to-create-search-index.md) and [Add vector fields to a search index](vector-search-how-to-create-index.md).

+ Use [**Search Post REST API version 2023-11-01**](/rest/api/searchservice/documents/search-post), Search Explorer in the Azure portal, or packages in the Azure SDKs that have been updated to use this feature.

+ (Optional) If you want to also use [semantic ranking](semantic-search-overview.md) and vector search together, your search service must be Basic tier or higher, with [semantic ranking enabled](semantic-how-to-enable-disable.md).

## Tips

The stable version (**2023-11-01**) of vector search doesn't provide built-in vectorization of the query input string. Encoding (text-to-vector) of the query string requires that you pass the query string to an external embedding model for vectorization. You would then pass the response to the search engine for similarity search over vector fields.

The preview version (**2023-10-01-Preview**) of vector search adds [integrated vectorization](vector-search-integrated-vectorization.md). If you want to explore this feature, [create and assign a vectorizer](vector-search-how-to-configure-vectorizer.md) to get built-in embedding of query strings.

All results are returned in plain text, including vectors in fields marked as `retrievable`. Because numeric vectors aren't useful in search results, choose other fields in the index as a proxy for the vector match. For example, if an index has "descriptionVector" and "descriptionText" fields, the query can match on "descriptionVector" but the search result can show "descriptionText". Use the `select` parameter to specify only human-readable fields in the results.

## Hybrid query request

A hybrid query combines full text search and vector search, where the `"search"` parameter takes a query string and `"vectors.value"` takes the vector query. The search engine runs full text and vector queries in parallel. All matches are evaluated for relevance using Reciprocal Rank Fusion (RRF) and a single result set is returned in the response.

Hybrid queries are useful because they add support for all query capabilities, including orderby and [semantic ranking](semantic-how-to-query-request.md). For example, in addition to the vector query, you could search over people or product names or titles, scenarios for which similarity search isn't a good fit.

The following example is from the [Postman collection of REST APIs](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python) that demonstrate hybrid query configurations.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
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
        "kind": "vector",
        "exhaustive": true,
        "k": 10
    }],
    "search": "what azure services support full text search",
    "select": "title, content, category",
    "top": "10"
}
```

**Key points:**

+ The vector query string is specified through the vector "vector.value" property. The query executes against the "contentVector" field. Set "kind" to "vector" to indicate the query type. Optionally, set "exhaustive" to true to query the full contents of the vector field.

+ Keyword search is specified through "search" property. It executes in parallel with the vector query.

+ "k" determines how many nearest neighbor matches are returned from the vector query and provided to the RRF ranker.

+ "top" determines how many matches are returned in the response all-up. In this example, the response includes 10 results, assuming there are at least 10 matches in the merged results.

## Hybrid search with filter

This example adds a filter, which is applied to the "filterable" nonvector fields of the search index.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
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
            "kind": "vector",
            "k": 10
        }
    ],
    "search": "what azure services support full text search",
    "vectorFilterMode": "postFilter",
    "filter": "category eq 'Databases'",
    "top": "10"
}
```

**Key points:**

+ Filters are applied to the content of filterable fields. In this example, the category field is marked as filterable in the index schema.

+ In hybrid queries, filters can be applied before query execution to reduce the query surface, or after query execution to trim results. `"preFilter"` is the default. To use `postFilter`, set the [filter processing mode](vector-search-filters.md).

## Semantic hybrid search

Assuming that you [enabled semantic ranking](semantic-how-to-enable-disable.md) and your index definition includes a [semantic configuration](semantic-how-to-query-request.md), you can formulate a query that includes vector search, plus keyword search. Semantic ranking occurs over the merged result set, adding captions and answers. 

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
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
            "kind": "vector",
            "k": 50
        }
    ],
    "search": "what azure services support full text search",
    "select": "title, content, category",
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
            "kind": "vector",
            "k": 50
        }
    ],
    "search": "what azure services support full text search",
    "select": "title, content, category",
    "queryType": "semantic",
    "semanticConfiguration": "my-semantic-config",
    "captions": "extractive",
    "answers": "extractive",
    "filter": "category eq 'Databases'",
    "vectorFilterMode": "postFilter",
    "top": "50"
}
```

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

If you're using semantic ranking, it's a best practice to set both "k" and "top" to 50. The semantic ranker can take up to 50 results. By specifying 50 for each query, you get equal representation from both search subsystems. 

### Ranking

Multiple sets are created for hybrid queries, with or without the optional [semantic reranking](semantic-search-overview.md). Ranking of results is computed by Reciprocal Rank Fusion (RRF).

In this section, compare the responses between single vector search and simple hybrid search for the top result. The different ranking algorithms, HNSW's similarity metric and RRF is this case, produce scores that have different magnitudes. This behavior is by design. RRF scores can appear quite low, even with a high similarity match. Lower scores are a characteristic of the RRF algorithm. In a hybrid query with RRF, more of the reciprocal of the ranked documents are included in the results, given the relatively smaller score of the RRF ranked documents, as opposed to pure vector search.

**Single Vector Search**: Results ordered by cosine similarity (default vector similarity distance function).

```json
{
    "@search.score": 0.8851871,
    "title": "Azure AI Search",
    "content": "Azure AI Search is a fully managed search-as-a-service that enables you to build rich search experiences for your applications. It provides features like full-text search, faceted navigation, and filters. Azure AI Search supports various data sources, such as Azure SQL Database, Azure Blob Storage, and Azure Cosmos DB. You can use Azure AI Search to index your data, create custom scoring profiles, and integrate with other Azure services. It also integrates with other Azure services, such as Azure Cognitive Services and Azure Machine Learning.",
    "category": "AI + Machine Learning"
},
```

**Hybrid Search**: Combined keyword and vector search results using Reciprocal Rank Fusion.

```json
{
    "@search.score": 0.03333333507180214,
    "title": "Azure AI Search",
    "content": "Azure AI Search is a fully managed search-as-a-service that enables you to build rich search experiences for your applications. It provides features like full-text search, faceted navigation, and filters. Azure AI Search supports various data sources, such as Azure SQL Database, Azure Blob Storage, and Azure Cosmos DB. You can use Azure AI Search to index your data, create custom scoring profiles, and integrate with other Azure services. It also integrates with other Azure services, such as Azure Cognitive Services and Azure Machine Learning.",
    "category": "AI + Machine Learning"
},
```

## Next steps

As a next step, we recommend reviewing the demo code for [Python](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python), [C#](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-dotnet) or [JavaScript](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-javascript).
