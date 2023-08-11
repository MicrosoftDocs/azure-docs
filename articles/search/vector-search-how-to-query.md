---
title: Query vector data in a search index
titleSuffix: Azure Cognitive Search
description: Build queries for vector-only fields and hybrid search scenarios that combine vectors with semantic and standard search syntax.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 08/10/2023
---

# Query vector data in a search index

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr#readme).

In Azure Cognitive Search, if you added vector fields to a search index, this article explains how to:

> [!div class="checklist"]
> + [Query vector fields](#query-syntax-for-vector-search).
> + [Combine vector, full text search, and semantic search in a hybrid query](#query-syntax-for-hybrid-search).
> + [Query multiple vector fields at once](#query-syntax-for-vector-query-over-multiple-fields).
> + [Run multiple vector queries in parallel](#query-syntax-for-multiple-vector-queries).

Code samples in the [cognitive-search-vector-pr](https://github.com/Azure/cognitive-search-vector-pr) repository demonstrate end-to-end workflows that include schema definition, vectorization, indexing, and queries.

## Prerequisites

+ Azure Cognitive Search, in any region and on any tier. Most existing services support vector search. For a small subset of services created prior to January 2019, an index containing vector fields will fail on creation. In this situation, a new service must be created.

+ A search index containing vector fields. See [Add vector fields to a search index](vector-search-how-to-query.md).

+ Use REST API version **2023-07-01-Preview**, the [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr/tree/main), or Search Explorer in the Azure portal.

+ (Optional) If you want to also use [semantic search (preview)](semantic-search-overview.md) and vector search together, your search service must be Basic tier or higher, with [semantic search enabled](semantic-search-overview.md#enable-semantic-search).

## Limitations

Cognitive Search doesn't provide built-in vectorization of the query input string. Encoding (text-to-vector) of the query string requires that you pass the query string to an embedding model for vectorization. You would then pass the response to the search engine for similarity search over vector fields.

All results are returned in plain text, including vectors. If you use Search Explorer in the Azure portal to query an index that contains vectors, the numeric vectors are returned in plain text. Because numeric vectors aren't useful in search results, choose other fields in the index as a proxy for the vector match. For example, if an index has "descriptionVector" and "descriptionText" fields, the query can match on "descriptionVector" but the search result shows "descriptionText". Use the `select` parameter to specify only human-readable fields in the results.

## Check your index for vector fields

If you aren't sure whether your search index already has vector fields, look for:

+ A `vectorSearch` algorithm configuration embedded in the index schema.

+ In the fields collection, look for fields of type `Collection(Edm.Single)`, with a `dimensions` attribute and a `vectorSearchConfiguration` set to the name of the `vectorSearch` algorithm configuration used by the field.

You can also send an empty query (`search=*`) against the index. If the vector field is "retrievable", the response includes a vector field consisting of an array of floating point values.

## Convert query input into a vector

To query a vector field, the query itself must be a vector. To convert a text query string provided by a user into a vector representation, your application must call an embedding library that provides this capability. Use the same embedding library that you used to generate embeddings in the source documents.

You can find multiple instances of query string conversion in the [cognitive-search-vector-pr](https://github.com/Azure/cognitive-search-vector-pr/) repository for each of the Azure SDKs.

Here's a REST API example of a query string submitted to a deployment of an Azure OpenAI model:

```http
POST https://{{openai-service-name}}.openai.azure.com/openai/deployments/{{openai-deployment-name}}/embeddings?api-version={{openai-api-version}}
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "input": "what azure services support full text search"
}
```

The expected response is 202 for a successful call to the deployed model. 
The "embedding" field in the body of the response is the vector representation of the  query string "input". For testing purposes, you would copy the value of the "embedding" array into "vector.value" in a query request, using syntax shown in the next several sections. 

The actual response for this POST call to the deployment model includes 1536 embeddings, trimmed here to just the first few vectors for readability.

```json
{
    "object": "list",
    "data": [
        {
            "object": "embedding",
            "index": 0,
            "embedding": [
                -0.009171937,
                0.018715322,
                ...
                -0.0016804502
            ]
        }
    ],
    "model": "ada",
    "usage": {
        "prompt_tokens": 7,
        "total_tokens": 7
    }
}
```

## Query syntax for vector search

You can use the Azure portal, REST APIs, or the beta packages of the Azure SDKs to query vectors.

### [**Azure portal**](#tab/portal-vector-query)

Be sure to the **JSON view** and formulate the query in JSON. The search bar in **Query view** is for full text search and will treat any vector input as plain text.

1. Sign in to Azure portal and find your search service.

1. Under **Search management** and **Indexes**, select the index.

   :::image type="content" source="media/vector-search-how-to-query/select-index.png" alt-text="Screenshot of the indexes menu." border="true":::

1. On Search Explorer, under **View**, select **JSON view**.

   :::image type="content" source="media/vector-search-how-to-query/select-json-view.png" alt-text="Screenshot of the index list." border="true":::

1. By default, the search API is **2023-07-01-Preview**. This is the correct API version for vector search.

1. Paste in a JSON vector query, and then select **Search**. You can use the REST example as a template for your JSON query.

   :::image type="content" source="media/vector-search-how-to-query/paste-vector-query.png" alt-text="Screenshot of the JSON query." border="true":::

### [**REST API**](#tab/rest-vector-query)

In this vector query, which is shortened for brevity, the "value" contains the vectorized text of the query input. The "fields" property specifies which vector fields are searched. The "k" property specifies the number of nearest neighbors to return as top hits.

In the following example, the vector is a representation of this query string: `"what Azure services support full text search"`. The query request targets the "contentVector" field. The actual vector has 1536 embeddings. It's trimmed in this example for readability.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version={{api-version}}
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
        "k": 5
    }],
    "select": "title, content, category"
}
```

The response includes 5 matches, and each result provides a search score, title, content, and category. In a similarity search, the response always includes "k" matches, even if the similarity is weak. For indexes that have fewer than "k" documents, only those number of documents will be returned.

Notice that "select" returns textual fields from the index. Although the vector field is "retrievable" in this example, its content isn't usable as a search result, so it's not included in the results.

### [**.NET**](#tab/dotnet-vector-query)

+ Use the [**Azure.Search.Documents 11.5.0-beta.4**](https://www.nuget.org/packages/Azure.Search.Documents/11.5.0-beta.4) package for vector scenarios. 

+ See the [cognitive-search-vector-pr](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-dotnet) GitHub repository for .NET code samples.

### [**Python**](#tab/python-vector-query)

+ Use the [**Azure.Search.Documents 11.4.0b8**](https://pypi.org/project/azure-search-documents/11.4.0b8/) package for vector scenarios. 

+ See the [cognitive-search-vector-pr](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python) GitHub repository for Python code samples.

### [**JavaScript**](#tab/js-vector-query)

+ Use the [**@azure/search-documents 12.0.0-beta.2**](https://www.npmjs.com/package/@azure/search-documents/v/12.0.0-beta.2) package for vector scenarios.  

+ See the [cognitive-search-vector-pr](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-javascript) GitHub repository for JavaScript code samples.

---

## Query syntax for hybrid search

A hybrid query combines full text search and vector search, where the `"search"` parameter takes a query string and `"vectors.value"` takes the vector query. The search engine runs full text and vector queries in parallel. All matches are evaluated for relevance using Reciprocal Rank Fusion (RRF) and a single result set is returned in the response.

Hybrid queries are useful because they add support for filters, orderby, and [semantic search](semantic-how-to-query-request.md) For example, in addition to the vector query, you could filter by location or search over product names or titles, scenarios for which similarity search isn't a good fit.

The following example is from the [Postman collection of REST APIs](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python) that demonstrate query configurations. It shows a complete request that includes vector search, full text search with filters, and semantic search with captions and answers. Semantic search is an optional premium feature. It's not required for vector search or hybrid search. For content that includes rich descriptive text *and* vectors, it's possible to benefit from all of the search modalities in one request.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version={{api-version}}
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
    "queryType": "semantic",
    "semanticConfiguration": "my-semantic-config",
    "queryLanguage": "en-us",
    "captions": "extractive",
    "answers": "extractive",
    "filter": "category eq 'Databases'",
    "top": "10"
}
```

## Query syntax for vector query over multiple fields

You can set the "vectors.fields" property to multiple vector fields. For example, the Postman collection has vector fields named "titleVector" and "contentVector". A single vector query executes over both the "titleVector" and "contentVector" fields, which must have the same embedding space since they share the same query vector.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version={{api-version}}
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "vectors": [{
        "value": [
            -0.009154141,
            0.018708462,
            -0.0016989828,
            -0.0117696095,
            -0.013770515,
        . . .
        ],
        "fields": "contentVector, titleVector",
        "k": 5
    }],
    "select": "title, content, category"
}
```

## Query syntax for multiple vector queries

You can issue a search request containing multiple query vectors using the "vectors" query parameter. The queries execute concurrently in the search index, each one looking for similarities in the target vector fields. The result set is a union of the documents that matched both vector queries. A common example of this query request is when using models such as [CLIP](https://openai.com/research/clip) for a multi-modal vector search where the same model can vectorize image and non-image content.

+ `vectors.value` property contains the vector query generated from the embedding model used to create image and text vectors in the search index. 
+ `vectors.fields` contains the image vectors and text vectors in the search index. This is the searchable data.
+ `vectors.k` is the number of nearest neighbor matches to include in results.

```http
{
    "vectors": [ 
        {
            "value": [
                -0.001111111,
                0.018708462,
                -0.013770515,
            . . .
            ],
            "fields": "myimagevector",
            "k": 5
        },
        {
            "value": [
                -0.002222222,
                0.018708462,
                -0.013770515,
            . . .
            ],
            "fields": "mytextvector",
            "k": 5
        }
    ]
}
```

Search results would include a combination of text and images, assuming your search index includes a field for the image file (a search index doesn't store images).

## Configure a query response

When you're setting up the vector query, think about the response structure. The response is a flattened rowset. Parameters on the query determine which fields are in each row and how many rows are in the response. The search engine ranks the matching documents and returns the most relevant results.

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

Ranking of results is computed by either:

+ The similarity metric specified in the index `vectorConfiguration` for a vector-only query. Valid values are `cosine` , `euclidean`, and `dotProduct`.
+ Reciprocal Rank Fusion (RRF) if there are multiple sets of search results.

Azure OpenAI embedding models use cosine similarity, so if you're using Azure OpenAI embedding models, `cosine` is the recommended metric. Other supported ranking metrics include `euclidean` and `dotProduct`.

Multiple sets are created if the query targets multiple vector fields, or if the query is a hybrid of vector and full text search, with or without the optional semantic reranking capabilities of [semantic search](semantic-search-overview.md). Within vector search, a vector query can only target one internal vector index. So for [multiple vector fields](#query-syntax-for-vector-query-over-multiple-fields) and [multiple vector queries](#query-syntax-for-multiple-vector-queries), the search engine generates multiple queries that target the respective vector indexes of each field. Output is a set of ranked results for each query, which are fused using RRF. For more information, see [Vector query execution and scoring](vector-search-ranking.md).

## Next steps

As a next step, we recommend reviewing the demo code for [Python](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python), [C#](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-dotnet) or [JavaScript](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-javascript).
