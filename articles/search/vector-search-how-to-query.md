---
title: Query vector data in a search index
titleSuffix: Azure Cognitive Search
description: Build queries for vector-only fields and hybrid search scenarios that combine vectors with semantic and standard search syntax.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 07/07/2023
---

# Query vector data in a search index

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [alpha SDKs](https://github.com/Azure/cognitive-search-vector-pr#readme).

In Azure Cognitive Search, if you added vector fields to a search index, this article explains how to query those fields. It also explains how to combine vector queries with full text search and semantic search for hybrid query scenarios.

## Prerequisites

+ Azure Cognitive Search, in any region and on any tier. However, if you want to also use [semantic search](semantic-search-overview.md) for hybrid queries, your search service must be Basic tier or higher, with [semantic search enabled](semantic-search-overview.md#enable-semantic-search).

  Most existing services support vector search. For a small subset of services created prior to January 2019, an index containing vector fields will fail on creation. In this situation, a new service must be created.

+ A search index containing vector fields. See [Add vector fields to a search index](vector-search-how-to-query.md).

+ Use REST API version 2023-07-01-preview or Azure portal to query vector fields. You can also use alpha versions of the Azure SDKs. For more information, see [this readme](https://github.com/Azure/cognitive-search-vector-pr/blob/main/README.md).

## Check your index for vector fields

In the index schema, check for:

+ A `vectorSearch` algorithm configuration.

+ In the fields collection, look for fields of type `Collection(Edm.Single)`, with a `dimensions` attribute and a `vectorSearchConfiguration` set to the name of the `vectorSearch` algorithm configuration used by the field.

Search documents containing vector data have fields containing many hundreds of floating point values.

## Convert query input into a vector

To query a vector field, the query itself must be a vector. To convert a text query string provided by a user into a vector representation, your application must call an embedding library that provides this capability. Use the same embedding library that you used to generate embeddings in the source documents.

Here's an example of a query string submitted to a deployment of an Azure OpenAI model:

```http
POST https://{{openai-service-name}}.openai.azure.com/openai/deployments/{{openai-deployment-name}}/embeddings?api-version={{openai-api-version}}
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "input": "what azure services support full text search"
}
```

The expected response is 202 for a successful call to the deployed model. The body of the response provides the vector representation of the "input". The vector for the query is in the "embedding" field. For testing purposes, you would copy the embedding value into "vector.value" in a query request, using syntax from the next sections. Note that the actual response for this query included 1536 embeddings, trimmed here for brevity.

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

In this vector query, which is shortened for brevity, the "value" contains the vectorized text of the query input. The "fields" property specifies which vector fields are searched. The "k" property specifies the number of nearest neighbors to return as top hits.

Recall that the vector query was generated from this string: `"what Azure services support full text search"`. The search targets the "contentVector" field.

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

## Query syntax for hybrid search

A hybrid query combines full text search, semantic search (reranking), and vector search. The search engine runs full text and vector queries in parallel. Semantic ranking is applied to the results from the text search. A single result set is returned in the response.

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

## Query syntax for cross-field vector query

You can set "vector.fields" property to multiple vector fields. For example, the Postman collection has vector fields named titleVector and contentVector. Your query can include both titleVector and contentVector.

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

## Query syntax for multi-modal vector queries

You can issue a search request with multiple query vectors using the `vectors` query parameter. The queries execute concurrently over the same embedding space in the search index, looking for similarities in each of the vector fields. The result set is a union of the documents that matched all vector queries. A common example of this query request is when using models such as [CLIP](https://openai.com/research/clip) for a multi-modal vector search.

You must use REST for this scenario. Currently, there isn't support for multiple vector fields in the alpha SDKs.

+ `vectors.value` property contains the vector query generated from the embedding model used to create image and text vectors in the search index. 
+ `vectors.fields` contains the image vectors and text vectors in the search index.
+ `vectors.k` is the number of nearest neighbor matches to include in results.

```http
{
    "vectors": [ 
        {
            "value": [1.0, 2.0],
            "fields": "myimagevector",
            "k": 5
        },
        {
            "value": [1.0, 2.0, 3.0],
            "fields": "mytextvector",
            "k": 5
        }
    ]
}
```

Search results would include a combination of text and images, assuming your search index includes a field for the image file (a search index doesn't store images).

## Next steps

As a next step, we recommend reviewing the demo code for [Python](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python), or [C#](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-dotnet).

