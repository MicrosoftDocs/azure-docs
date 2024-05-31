---
title: Vector query how-to
titleSuffix: Azure AI Search
description: Learn how to build queries for vector search.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 05/30/2024
---

# Create a vector query in Azure AI Search

In Azure AI Search, if you have a [vector index](vector-search-how-to-create-index.md), this article explains how to:

> [!div class="checklist"]
> + [Query vector fields](#vector-query-request)
> + [Filter a vector query](#vector-query-with-filter)
> + [Query multiple vector fields at once](#multiple-vector-fields)
> + [Query with integrated vectorization (preview)](#query-with-integrated-vectorization-preview)
> + [Set thresholds to exclude low-scoring results (preview)](#set-thresholds-to-exclude-low-scoring-results-preview)
> + [Set MaxTextSizeRecall to control the number of results (preview)](#maxtextsizerecall-for-hybrid-search-preview)
> + [Set vector weights (preview)](#vector-weighting-preview)

This article uses REST for illustration. For code samples in other languages, see the [azure-search-vector-samples](https://github.com/Azure/azure-search-vector-samples) GitHub repository for end-to-end solutions that include vector queries. 

You can also use [Search explorer](search-explorer.md) in the Azure portal if you [configure a vectorizer](vector-search-how-to-configure-vectorizer.md) that converts strings into embeddings.

## Prerequisites

+ Azure AI Search, in any region and on any tier.

+ [A vector index on Azure AI Search](vector-search-how-to-create-index.md). Check for a `vectorSearch` section in your index to confirm a vector index.

+ Visual Studio Code with a [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) and sample data if you want to run these examples on your own. To get started with the REST client, see [Quickstart: Azure AI Search using REST](search-get-started-rest.md).

## Convert a query string input into a vector

To query a vector field, the query itself must be a vector. 

One approach for converting a user's text query string into its vector representation is to call an embedding library or API in your application code. As a best practice, *always use the same embedding models used to generate embeddings in the source documents*. You can find code samples showing [how to generate embeddings](vector-search-how-to-generate-embeddings.md) in the [azure-search-vector-samples](https://github.com/Azure/azure-search-vector-samples) repository.

A second approach is [using integrated vectorization](#query-with-integrated-vectorization-preview), currently in public preview, to have Azure AI Search handle your query vectorization inputs and outputs.

Here's a REST API example of a query string submitted to a deployment of an Azure OpenAI embedding model:

```http
POST https://{{openai-service-name}}.openai.azure.com/openai/deployments/{{openai-deployment-name}}/embeddings?api-version={{openai-api-version}}
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "input": "what azure services support generative AI'"
}
```

The expected response is 202 for a successful call to the deployed model. 

The "embedding" field in the body of the response is the vector representation of the  query string "input". For testing purposes, you would copy the value of the "embedding" array into "vectorQueries.vector" in a query request, using syntax shown in the next several sections. 

The actual response for this POST call to the deployed model includes 1536 embeddings, trimmed here to just the first few vectors for readability.

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

In this approach, your application code is responsible for connecting to a model, generating embeddings, and handling the response.

## Vector query request

This section shows you the basic structure of a vector query. You can use the Azure portal, REST APIs, or the Azure SDKs to formulate a vector query. If you're migrating from [**2023-07-01-Preview**](/rest/api/searchservice/index-preview), there are breaking changes. See [Upgrade to the latest REST API](search-api-migration.md) for details.

### [**2023-11-01**](#tab/query-2023-11-01)

[**2023-11-01**](/rest/api/searchservice/search-service-api-versions#2023-11-01) is the stable REST API version for [Search POST](/rest/api/searchservice/documents/search-post). This version supports:

+ `vectorQueries` is the construct for vector search.
+ `kind` set to `vector` specifies that the query is a vector array.
+ `vector` is query (a vector representation of text or an image).
+ `exhaustive` (optional) invokes exhaustive KNN at query time, even if the field is indexed for HNSW.

In the following example, the vector is a representation of this string: "what Azure services support full text search". The query targets the `contentVector` field. The query returns `k` results. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "count": true,
    "select": "title, content, category",
    "vectorQueries": [
        {
            "kind": "vector",
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

### [**2023-10-01-Preview**](#tab/query-2023-10-01-Preview)

[**2023-10-01-Preview**](/rest/api/searchservice/search-service-api-versions#2023-10-01-Preview) is the preview API version for [Search POST](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2023-10-01-preview&tabs=HTTP&preserve-view=true). It supports the same vector query syntax as 2023-11-01 (shown in this tab), but also adds [integrated vectorization of text queries](#query-with-integrated-vectorization-preview). 

+ `vectorQueries` is the construct for vector search.
+ `kind` set to `vector` specifies that the query is a vector array.
+ `vector` is query (a vector representation of text or an image).
+ `exhaustive` (optional) invokes exhaustive KNN at query time, even if the field is indexed for HNSW.

In the following example, the vector is a representation of this string: "what Azure services support full text search". The query targets the `contentVector` field. The query returns `k` results. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-10-01-Preview
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "count": true,
    "select": "title, content, category",
    "vectorQueries": [
        {
            "kind": "vector",
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

> [!IMPORTANT]
> The vector query syntax for this version is obsolete in later versions. We recommend [upgrading to the latest REST API](search-api-migration.md).

[**2023-07-01-Preview**](/rest/api/searchservice/index-preview) first introduced vector query support to [Search Documents](/rest/api/searchservice/preview-api/search-documents). This version added:

+ `vectors` for specifying a vector to search for, vector fields to search in, and the k-number of nearest neighbors to return.

In the following example, the vector is a representation of this query string: "what Azure services support full text search". The query targets the `contentVector` field. The query returns `k` results. The actual vector has 1536 embeddings. It's trimmed in this example for readability.

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

The response includes five matches, and each result provides a search score, title, content, and category. In a similarity search, the response always includes `k` matches, even if the similarity is weak. For indexes that have fewer than `k` documents, only those number of documents are returned.

Notice that `select` returns textual fields from the index. Although the vector field is `retrievable` in this example, its content isn't meaningful as a search result, so it's often excluded in the results.

### [**Azure portal**](#tab/portal-vector-query)

Use Search explorer to formulate a vector query. Search explorer has a **Query view** and **JSON View**. You must use **JSON view**, and you must formulate the vector query in JSON. The search bar in **Query view** is for full text search and treats any vector input as plain text (it doesn't execute a vector search).

1. Sign in to Azure portal and find your search service.

1. Under **Search management** and **Indexes**, select the index.

   :::image type="content" source="media/vector-search-how-to-query/select-index.png" alt-text="Screenshot of the indexes menu." border="true":::

1. On Search Explorer, under **View**, select **JSON view**.

   :::image type="content" source="media/vector-search-how-to-query/select-json-view.png" alt-text="Screenshot of the index list." border="true":::

1. By default, the search API is **2023-10-01-Preview**. You can choose another API version.

1. Paste in a JSON vector query, and then select **Search**.

   :::image type="content" source="media/vector-search-how-to-query/paste-vector-query.png" alt-text="Screenshot of the JSON query." border="true":::

---

## Vector query response

In Azure AI Search, query responses consist of all `retrievable` fields by default. However, it's common to limit search results to a subset of `retrievable` fields by listing them in a `select` statement.

In a vector query, carefully consider whether you need to vector fields in a response. Vector fields aren't human readable, so if you're pushing a response to a web page, you should choose nonvector fields that are representative of the result. For example, if the query executes against `contentVector`, you could return `content` instead.

If you do want vector fields in the result, here's an example of the response structure. `contentVector` is a string array of embeddings, trimmed here for brevity. The search score indicates relevance. Other nonvector fields are included for context.

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

+ `k` determines how many nearest neighbor results are returned, in this case, three. Vector queries always return `k` results, assuming at least `k` documents exist, even if there are documents with poor similarity, because the algorithm finds any `k` nearest neighbors to the query vector. 

+ The **`@search.score`** is determined by the [vector search algorithm](vector-search-ranking.md). 

+ Fields in search results are either all `retrievable` fields, or fields in a `select` clause. During vector query execution, the match is made on vector data alone. However, a response can include any `retrievable` field in an index. Because there's no facility for decoding a vector field result, the inclusion of nonvector text fields is helpful for their human readable values.

## Vector query with filter

A query request can include a vector query and a [filter expression](search-filters.md). Filters apply to `filterable` nonvector fields, either a string field or numeric, and are useful for including or excluding search documents based on filter criteria. Although a vector field isn't filterable itself, filters can be applied to other fields in the same index.

You can apply filters as exclusion criteria before the query executes, or after query execution to filter search results. For a comparison of each mode and the expected performance based on index size, see [Filters in vector queries](vector-search-filters.md).

> [!TIP]
> If you don't have source fields with text or numeric values, check for document metadata, such as LastModified or CreatedBy properties, that might be useful in a metadata filter.

### [**2023-11-01**](#tab/filter-2023-11-01)

[**2023-11-01**](/rest/api/searchservice/search-service-api-versions#2023-11-01) is the stable version for this API. It has:

+ `vectorFilterMode` for prefilter (default) or postfilter [filtering modes](vector-search-filters.md).
+ `filter` provides the criteria.

In the following example, the vector is a representation of this query string: "what Azure services support full text search". The query targets the `contentVector` field. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

The filter criteria are applied to a filterable text field (`category `in this example) before the search engine executes the vector query.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "count": true,
    "select": "title, content, category",
    "filter": "category eq 'Databases'",
    "vectorFilterMode": "preFilter",
    "vectorQueries": [
        {
            "kind": "vector",
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

### [**2023-10-01-Preview**](#tab/filter-2023-10-01-Preview)

[**2023-10-01-Preview**](/rest/api/searchservice/search-service-api-versions#2023-10-01-Preview) introduces filter options. This version adds:

+ `vectorFilterMode` for prefilter (default) or postfilter [filtering modes](vector-search-filters.md).
+ `filter` provides the criteria.

In the following example, the vector is a representation of this query string: "what Azure services support full text search". The query targets the `contentVector` field. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

The filter criteria are applied to a filterable text field (`category` in this example) before the search engine executes the vector query.

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
            "kind": "vector",
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

[**2023-07-01-Preview**](/rest/api/searchservice/index-preview) supports post-filtering only.  

In the following example, the vector is a representation of this query string: "what Azure services support full text search". The query targets the `contentVector` field. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

In this API version, there's no prefilter support or `vectorFilterMode` parameter. The filter criteria are applied after the search engine executes the vector query. The set of `"k"` nearest neighbors is retrieved, and then combined with the set of filtered results. As such, the value of `"k"` predetermines the surface over which the filter is applied. For `"k": 10`, the filter is applied to 10 most similar documents. For `"k": 100`, the filter iterates over 100 documents (assuming the index contains 100 documents that are sufficiently similar to the query).

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

You can set the "vectorQueries.fields" property to multiple vector fields. The vector query executes against each vector field that you provide in the `fields` list. When querying multiple vector fields, make sure each one contains embeddings from the same embedding model, and that the query is also generated from the same embedding model.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "count": true,
    "select": "title, content, category",
    "vectorQueries": [
        {
            "kind": "vector",
            "vector": [
                -0.009154141,
                0.018708462,
                . . . 
                -0.02178128,
                -0.00086512347
            ],
            "exhaustive": true,
            "fields": "contentVector, titleVector",
            "k": 5
        }
    ]
}
```

## Multiple vector queries

Multi-query vector search sends multiple queries across multiple vector fields in your search index. A common example of this query request is when using models such as [CLIP](https://openai.com/research/clip) for a multimodal vector search where the same model can vectorize image and text content.

The following query example looks for similarity in both `myImageVector` and `myTextVector`, but sends in two different query embeddings respectively, each executing in parallel. This query produces a result that's scored using [Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md).

+ `vectorQueries` provides an array of vector queries.
+ `vector` contains the image vectors and text vectors in the search index. Each instance is a separate query.
+ `fields` specifies which vector field to target.
+ `k` is the number of nearest neighbor matches to include in results.

```json
{
    "count": true,
    "select": "title, content, category",
    "vectorQueries": [
        {
            "kind": "vector",
            "vector": [
                -0.009154141,
                0.018708462,
                . . . 
                -0.02178128,
                -0.00086512347
            ],
            "fields": "myimagevector",
            "k": 5
        },
        {
            "kind": "vector"
            "vector": [
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

## Query with integrated vectorization (preview)

This section shows a vector query that invokes the new [integrated vectorization](vector-search-integrated-vectorization.md) preview feature that converts a text query into a vector. Use [**2023-10-01-Preview** REST API](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2023-10-01-preview&preserve-view=true) or an updated beta Azure SDK package.

A prerequisite is a search index having a [vectorizer configured and assigned](vector-search-how-to-configure-vectorizer.md) to a vector field. The vectorizer provides connection information to an embedding model used at query time.

Queries provide text strings instead of vectors:

+ `kind` must be set to `text` .
+ `text` must have a text string. It's passed to the vectorizer assigned to the vector field.
+ `fields` is the vector field to search.

Here's a simple example of a query that's vectorized at query time. The text string is vectorized and then used to query the descriptionVector field.

```http
POST https://{{search-service}}.search.windows.net/indexes/{{index}}/docs/search?api-version=2023-10-01-preview
{
    "select": "title, genre, description",
    "vectorQueries": [
        {
            "kind": "text",
            "text": "mystery novel set in London",
            "fields": "descriptionVector",
            "k": 5
        }
    ]
}
```

Here's a [hybrid query](hybrid-search-how-to-query.md) using integrated vectorization of text queries. This query includes multiple query vector fields, multiple nonvector fields, a filter, and semantic ranking. Again, the differences are the `kind` of vector query and the `text` string instead of a `vector`.

In this example, the search engine makes three vectorization calls to the vectorizers assigned to `descriptionVector`, `synopsisVector`, and `authorBioVector` in the index. The resulting vectors are used to retrieve documents against their respective fields. The search engine also executes a keyword search on the `search` query, "mystery novel set in London". 

```http
POST https://{{search-service}}.search.windows.net/indexes/{{index}}/docs/search?api-version=2023-10-01-preview
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "search":"mystery novel set in London", 
    "searchFields":"description, synopsis", 
    "semanticConfiguration":"my-semantic-config", 
    "queryType":"semantic",
    "select": "title, author, synopsis",
    "filter": "genre eq 'mystery'",
    "vectorFilterMode": "postFilter",
    "vectorQueries": [
        {
            "kind": "text",
            "text": "mystery novel set in London",
            "fields": "descriptionVector, synopsisVector",
            "k": 5
        },
        {
            "kind": "text"
            "text": "living english author",
            "fields": "authorBioVector",
            "k": 5
        }
    ]
}
```

The scored results from all four queries are fused using [RRF ranking](hybrid-search-ranking.md). Secondary [semantic ranking](semantic-search-overview.md) is invoked over the fused search results, but on the `searchFields` only, boosting results that are the most semantically aligned to `"search":"mystery novel set in London"`.

> [!NOTE]
> Vectorizers are used during indexing and querying. If you don't need data chunking and vectorization in the index, you can skip steps like creating an indexer, skillset, and data source. In this scenario, the vectorizer is used only at query time to convert a text string to an embedding.

## Number of ranked results in a vector query response

A vector query specifies the `k` parameter, which determines how many matches are returned in the results. The search engine always returns `k` number of matches. If `k` is larger than the number of documents in the index, then the number of documents determines the upper limit of what can be returned.

If you're familiar with full text search, you know to expect zero results if the index doesn't contain a term or phrase. However, in vector search, the search operation is identifying nearest neighbors, and it will always return `k` results even if the nearest neighbors aren't that similar. So, it's possible to get results for nonsensical or off-topic queries, especially if you aren't using prompts to set boundaries. Less relevant results have a worse similarity score, but they're still the "nearest" vectors if there isn't anything closer. As such, a response with no meaningful results can still return `k` results, but each result's similarity score would be low. 

A [hybrid approach](hybrid-search-overview.md) that includes full text search can mitigate this problem. Another mitigation is to set a minimum threshold on the search score, but only if the query is a pure single vector query. Hybrid queries aren't conducive to minimum thresholds because the RRF ranges are so much smaller and volatile.

Query parameters affecting result count include:

+ `"k": n` results for vector-only queries
+ `"top": n` results for hybrid queries that include a "search" parameter

Both "k" and "top" are optional. Unspecified, the default number of results in a response is 50. You can set "top" and "skip" to [page through more results](search-pagination-page-layout.md#paging-results) or change the default.

## Ranking algorithms used in a vector query

Ranking of results is computed by either:

+ Similarity metric
+ Reciprocal Rank Fusion (RRF) if there are multiple sets of search results.

### Similarity metric

The similarity metric specified in the index `vectorSearch` section for a vector-only query. Valid values are `cosine`, `euclidean`, and `dotProduct`.

Azure OpenAI embedding models use cosine similarity, so if you're using Azure OpenAI embedding models, `cosine` is the recommended metric. Other supported ranking metrics include `euclidean` and `dotProduct`.

### Using RRF

Multiple sets are created if the query targets multiple vector fields, runs multiple vector queries in parallel, or if the query is a hybrid of vector and full text search, with or without [semantic ranking](semantic-search-overview.md). 

During query execution, a vector query can only target one internal vector index. So for [multiple vector fields](#multiple-vector-fields) and [multiple vector queries](#multiple-vector-queries), the search engine generates multiple queries that target the respective vector indexes of each field. Output is a set of ranked results for each query, which are fused using RRF. For more information, see [Relevance scoring using Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md).

## Set thresholds to exclude low-scoring results (preview)

Because nearest neighbor search always returns the requested `k` neighbors, it's possible to get low scoring matches as part of meeting the `k` number requirement on search results.

Using the 2024-05-01-preview REST APIs, you can now add a `threshold` query parameter to exclude low-scoring search results.

```http
POST https://[service-name].search.windows.net/indexes/[index-name]/docs/search?api-version=2024-05-01-Preview 
    Content-Type: application/json 
    api-key: [admin key] 

    { 
      "vectorQueries": [ 
        { 
          "kind": "vector", 
          "vector": [1.0, 2.0, 3.0], 
          "fields": "my-cosine-field", 
          "threshold": { 
            "kind": "vectorSimilarity", 
            "value": 0.8 
          } 
        }
      ]
    }
```

Filtering occurs before [fusing results](hybrid-search-ranking.md) from different recall sets. 

## MaxTextSizeRecall for hybrid search (preview)

Add a `hybridSearch` query parameter object to specify the maximum number of documents recalled using text queries in hybrid (text and vector) search. The default is 1,000 documents. With this parameter, you can increase or decrease the number of results returned in hybrid queries.

```http
POST https://[service-name].search.windows.net/indexes/[index-name]/docs/search?api-version=2024-05-01-Preview 
    Content-Type: application/json 
    api-key: [admin key] 

    { 
      "vectorQueries": [ 
        { 
          "kind": "vector", 
          "vector": [1.0, 2.0, 3.0], 
          "fields": "my_vector_field", 
          "k": 10 
        } 
      ], 
      "search": "hello world", 
      "hybridSearch": { 
        "maxTextRecallSize": 100, 
        "countAndFacetMode": "countAllResults" 
      } 
    } 
```

## Vector weighting (preview)

Add a `weight` query parameter to specify the relative weight of each vector included in search operations. This feature is particularly useful in complex queries where two or more distinct result sets need to be combined, such as in hybrid search or multivector requests. 

Weights are used when calculating the [reciprocal rank fusion](hybrid-search-ranking.md) scores of each document. The calculation is multiplier of the `weight` value against the rank score of the document within its respective result set. 

```http
POST https://[service-name].search.windows.net/indexes/[index-name]/docs/search?api-version=2024-05-01-Preview 
Content-Type: application/json 
api-key: [admin key] 

    { 
      "vectorQueries": [ 
        { 
          "kind": "vector", 
          "vector": [1.0, 2.0, 3.0], 
          "fields": "my_vector_field", 
          "k": 10, 
          "weight": 0.5 
        } 
      ], 
      "search": "hello world" 
    } 
```

## Next steps

As a next step, review vector query code examples in [Python](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-python), [C#](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-dotnet) or [JavaScript](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-javascript).
