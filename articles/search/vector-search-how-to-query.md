---
title: Vector query how-to
titleSuffix: Azure Cognitive Search
description: Learn how to build queries for vector search.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 10/13/2023
---

# Create a vector query in Azure Cognitive Search

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST APIs, and [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr#readme).

In Azure Cognitive Search, if you added vector fields to a search index, this article explains how to:

> [!div class="checklist"]
> + [Query vector fields](#vector-query-request)
> + [Filter a vector query](#vector-query-with-filter)
> + [Query multiple vector fields at once](#multiple-vector-fields)

Code samples in the [cognitive-search-vector-pr](https://github.com/Azure/cognitive-search-vector-pr) repository demonstrate end-to-end workflows that include schema definition, vectorization, indexing, and queries.

## Prerequisites

+ Azure Cognitive Search, in any region and on any tier. Most existing services support vector search. For services created prior to January 2019, there's a small subset that won't support vector search. If an index containing vector fields fails to be created or updated, this is an indicator. In this situation, a new service must be created.

+ A search index containing vector fields. See [Add vector fields to a search index](vector-search-how-to-create-index.md).

+ Use REST API version **2023-10-01-Preview** if you want pre-filters. Otherwise, you can use **2023-07-01-Preview**, the [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr/tree/main), or Search Explorer in the Azure portal.

## Limitations

Cognitive Search doesn't provide built-in vectorization of the query input string. Encoding (text-to-vector) of the query string requires that you pass the query string to an embedding model for vectorization. You would then pass the response to the search engine for similarity search over vector fields.

All results are returned in plain text, including vectors. If you use Search Explorer in the Azure portal to query an index that contains vectors, the numeric vectors are returned in plain text. Because numeric vectors aren't useful in search results, choose other fields in the index as a proxy for the vector match. For example, if an index has "descriptionVector" and "descriptionText" fields, the query can match on "descriptionVector" but the search result can show "descriptionText". Use the `select` parameter to specify only human-readable fields in the results.

## Check your index for vector fields

If you aren't sure whether your search index already has vector fields, look for:

+ A non-empty `vectorSearch` property containing algorithms and other vector-related configurations embedded in the index schema.

+ In the fields collection, look for fields of type `Collection(Edm.Single)`, with a `dimensions` attribute and a `vectorSearchConfiguration` set to the name of the `vectorSearch` algorithm configuration used by the field.

You can also send an empty query (`search=*`) against the index. If the vector field is "retrievable", the response includes a vector field consisting of an array of floating point values.

## Convert query input into a vector

To query a vector field, the query itself must be a vector. To convert a text query string provided by a user into a vector representation, your application must call an embedding library or API endpoint that provides this capability. **Use the same embedding that you used to generate embeddings in the source documents.**

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

## Vector query request

You can use the Azure portal, REST APIs, or the beta packages of the Azure SDKs to query vectors.

### [**2023-10-01-Preview**](#tab/query-2023-10-01-Preview)

REST API version [**2023-10-01-Preview**](/rest/api/searchservice/search-service-api-versions#2023-10-01-Preview) introduces breaking changes to the vector query definition in [Search Documents](/rest/api/searchservice/2023-10-01-preview/documents/search-post). This version adds:

+ `vectorQueries` for specifying a vector to search for, vector fields to search in, and the k-number of nearest neighbors to return.
+ `kind` is a parameter of `vectorQueries` and it can only be set to `vector` in this preview.
+ `exhaustive` can be set to true or false, and invokes exhaustive KNN at query time.

In the following example, the vector is a representation of this query string: `"what Azure services support full text search"`. The query targets the "contentVector" field. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-10-01-Preview
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "count": true,
    "select": "title, content, category",
    "vectorQueries": [
        {
            "kind": "vector"
            "vector": [
                -0.009154141,
                0.018708462,
                . . . 
                -0.02178128,
                -0.00086512347
            ],
            "exhaustive": true,
            "fields": "contentVector",
            "k": 5
        }
    ]
}
```

### [**2023-07-01-Preview**](#tab/query-vector-query)

REST API version [**2023-07-01-Preview**](/rest/api/searchservice/index-preview) introduces vector query support to [Search Documents](/rest/api/searchservice/preview-api/search-documents). This version adds:

+ `vectors` for specifying a vector to search for, vector fields to search in, and the k-number of nearest neighbors to return.

In the following example, the vector is a representation of this query string: `"what Azure services support full text search"`. The query targets the "contentVector" field. The actual vector has 1536 embeddings. It's trimmed in this example for readability.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-10-01-Preview
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

The response includes five matches, and each result provides a search score, title, content, and category. In a similarity search, the response always includes "k" matches, even if the similarity is weak. For indexes that have fewer than "k" documents, only those number of documents will be returned.

Notice that "select" returns textual fields from the index. Although the vector field is "retrievable" in this example, its content isn't usable as a search result, so it's often excluded in the results.

## Vector query response

Here's a modified example so that you can see the basic structure of a response from a pure vector query. 

```json
{
    "@odata.count": 3,
    "value": [
        {
            "@search.score": 0.80025613,
            "title": "Azure Search",
            "category": "AI + Machine Learning",
            "contentVector": [
                -0.0018343845,
                0.017952163,
                0.0025753193,
                ...
            ]
        },
        {
            "@search.score": 0.78856903,
            "title": "Azure Application Insights",
            "category": "Management + Governance",
            "contentVector": [
                -0.016821077,
                0.0037742127,
                0.016136652,
                ...
            ]
        },
        {
            "@search.score": 0.78650564,
            "title": "Azure Media Services",
            "category": "Media",
            "contentVector": [
                -0.025449317,
                0.0038463024,
                -0.02488436,
                ...
            ]
        }
    ]
}
```

**Key points:**

+ It's reduced to 3 "k" matches.
+ It shows a **`@search.score`** that's determined by the HNSW algorithm and a `cosine` similarity metric. 
+ Fields include text and vector values. The content vector field consists of 1536 dimensions for each match, so it's truncated for brevity (normally, you might exclude vector fields from results). The text fields used in the response (`"select": "title, category"`) aren't used during query execution. The match is made on vector data alone. However, a response can include any "retrievable" field in an index. As such, the inclusion of text fields is helpful because its values are easily recognized by users.

### [**Azure portal**](#tab/portal-vector-query)

Azure portal supports **2023-07-01-Preview** behaviors.

Be sure to the **JSON view** and formulate the query in JSON. The search bar in **Query view** is for full text search and will treat any vector input as plain text.

1. Sign in to Azure portal and find your search service.

1. Under **Search management** and **Indexes**, select the index.

   :::image type="content" source="media/vector-search-how-to-query/select-index.png" alt-text="Screenshot of the indexes menu." border="true":::

1. On Search Explorer, under **View**, select **JSON view**.

   :::image type="content" source="media/vector-search-how-to-query/select-json-view.png" alt-text="Screenshot of the index list." border="true":::

1. By default, the search API is **2023-07-01-Preview**. This is the correct API version for vector search.

1. Paste in a JSON vector query, and then select **Search**. You can use the REST example as a template for your JSON query.

   :::image type="content" source="media/vector-search-how-to-query/paste-vector-query.png" alt-text="Screenshot of the JSON query." border="true":::

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

## Vector query with filter

A query request can include a vector query and a [filter expression](search-filters.md). Filters apply to "filterable" text and numeric fields, and are useful for including or excluding search documents based on filter criteria. Although a vector field isn't filterable itself, a query can include filters on other fields in the same index.

In **2023-07-01-Preview**, a filter in a pure vector query is effectively processed as a post-query operation. The set of `"k"` nearest neighbors is retrieved, and then combined with the set of filtered results. As such, the value of `"k"` predetermines the surface over which the filter is applied. For `"k": 10`, the filter is applied to 10 most similar documents. For `"k": 100`, the filter iterates over 100 documents (assuming the index contains 100 documents that are sufficiently similar to the query).

In **2023-10-01-Preview**, a filter can be either pre-query or post-query. The default is pre-query. If you require the post-query action instead, set the `vectorFiltermode` parameter.

> [!TIP]
> If you don't have source fields with text or numeric values, check for document metadata, such as LastModified or CreatedBy properties, that might be useful in a metadata filter.

### [**2023-10-01-Preview**](#tab/filter-2023-10-01-Preview)

REST API version [**2023-10-01-Preview**](/rest/api/searchservice/search-service-api-versions#2023-10-01-Preview) introduces filter options. This version adds:

+ `vectorFilterMode` for prefiltering (default) or postfiltering during query execution. Valid values are `preFilter` (default), `postFilter`, and null.
+ `filter` provides the criteria.

In the following example, the vector is a representation of this query string: `"what Azure services support full text search"`. The query targets the "contentVector" field. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

The filter criteria are applied to a filterable text field ("category" in this example) before the search engine executes the vector query.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-10-01-Preview
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "count": true,
    "select": "title, content, category",
    "filter": "category eq 'Databases'",
    "vectorFilterMode": "preFilter",
    "vectorQueries": [
        {
            "kind": "vector"
            "vector": [
                -0.009154141,
                0.018708462,
                . . . 
                -0.02178128,
                -0.00086512347
            ],
            "exhaustive": true,
            "fields": "contentVector",
            "k": 5
        }
    ]
}
```

### [**2023-07-01-Preview**](#tab/filter-2023-07-01-Preview)

REST API version [**2023-07-01-Preview**](/rest/api/searchservice/index-preview) supports post-filtering over query results. 

In the following example, the vector is a representation of this query string: `"what Azure services support full text search"`. The query targets the "contentVector" field. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

In this API version, there is no pre-filter support or `vectorFilterMode` parameter. The filter criteria are applied after the search engine executes the vector query.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-07-01-Preview
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
        },
    ],
    "select": "title, content, category",
    "filter": "category eq 'Databases'"
}
```

---

## Multiple vector fields

You can set the "vectors.fields" property to multiple vector fields. For example, the Postman collection has vector fields named "titleVector" and "contentVector". A single vector query executes over both the "titleVector" and "contentVector" fields, which must have the same embedding space since they share the same query vector.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-07-01-Preview
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

## Multiple vector queries

Multi-query vector search sends multiple queries across multiple vector fields in your search index. A common example of this query request is when using models such as [CLIP](https://openai.com/research/clip) for a multi-modal vector search where the same model can vectorize image and non-image content.

The following query example looks for similarity in both `myImageVector` and `myTextVector`, but sends in two different query embeddings respectively. This scenario is ideal for multi-modal use cases where you want to search over different embedding spaces. This query produces a result that's scored using [Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md).

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

Multiple sets are created if the query targets multiple vector fields, or if the query is a hybrid of vector and full text search, with or without the optional semantic reranking capabilities of [semantic search](semantic-search-overview.md). Within vector search, a vector query can only target one internal vector index. So for [multiple vector fields](#multiple-vector-fields) and [multiple vector queries](#multiple-vector-queries), the search engine generates multiple queries that target the respective vector indexes of each field. Output is a set of ranked results for each query, which are fused using RRF. For more information, see [Vector query execution and scoring](vector-search-ranking.md).

## Next steps

As a next step, we recommend reviewing the demo code for [Python](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python), [C#](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-dotnet) or [JavaScript](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-javascript).
