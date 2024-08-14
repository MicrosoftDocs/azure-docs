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
ms.date: 08/05/2024
---

# Create a vector query in Azure AI Search

In Azure AI Search, if you have a [vector index](vector-search-how-to-create-index.md), this article explains how to:

> [!div class="checklist"]
> + [Query vector fields](#vector-query-request)
> + [Filter a vector query](#vector-query-with-filter)
> + [Query multiple vector fields at once](#multiple-vector-fields)
> + [Set vector weights](#vector-weighting)
> + [Query with integrated vectorization](#query-with-integrated-vectorization)
> + [Set thresholds to exclude low-scoring results (preview)](#set-thresholds-to-exclude-low-scoring-results-preview)

This article uses REST for illustration. For code samples in other languages, see the [azure-search-vector-samples](https://github.com/Azure/azure-search-vector-samples) GitHub repository for end-to-end solutions that include vector queries. 

You can also use [Search Explorer](search-explorer.md) in the Azure portal.

## Prerequisites

+ Azure AI Search, in any region and on any tier.

+ [A vector index on Azure AI Search](vector-search-how-to-create-index.md). Check for a `vectorSearch` section in your index to confirm a vector index.

+ Optionally, [add a vectorizer](vector-search-how-to-configure-vectorizer.md) to your index for built-in text-to-vector or image-to-vector conversion during queries.

+ Visual Studio Code with a [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) and sample data if you want to run these examples on your own. To get started with the REST client, see [Quickstart: Azure AI Search using REST](search-get-started-rest.md).

## Convert a query string input into a vector

To query a vector field, the query itself must be a vector. 

One approach for converting a user's text query string into its vector representation is to call an embedding library or API in your application code. As a best practice, *always use the same embedding models used to generate embeddings in the source documents*. You can find code samples showing [how to generate embeddings](vector-search-how-to-generate-embeddings.md) in the [azure-search-vector-samples](https://github.com/Azure/azure-search-vector-samples) repository.

A second approach is [using integrated vectorization](#query-with-integrated-vectorization), now generally available, to have Azure AI Search handle your query vectorization inputs and outputs.

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

### [**2024-07-01**](#tab/query-2024-07-01)

[**2024-07-01**](/rest/api/searchservice/search-service-api-versions#2024-07-01) is the stable REST API version for [Search POST](/rest/api/searchservice/documents/search-post). This version supports:

+ `vectorQueries` is the construct for vector search.
+ `vectorQueries.kind` set to `vector` for a vector array, or set to `text` if the input is a string and [you have a vectorizer](#query-with-integrated-vectorization).
+ `vectorQueries.vector` is query (a vector representation of text or an image).
+ `vectorQueries.weight` (optional) specifies the relative weight of each vector query included in search operations (see [Vector weighting](#vector-weighting)).
+ `exhaustive` (optional) invokes exhaustive KNN at query time, even if the field is indexed for HNSW.

In the following example, the vector is a representation of this string: "what Azure services support full text search". The query targets the `contentVector` field. The query returns `k` results. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2024-07-01
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
            "weight": 0.5,
            "k": 5
        }
    ]
}
```

### [**2024-05-01-preview**](#tab/query-2024-05-01-preview)

[**2024-05-01-preview**](/rest/api/searchservice/search-service-api-versions#2024-05-01-preview) is the latest preview API version for [Search - POST](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2024-05-01-preview&tabs=HTTP&preserve-view=true). It supports the same vector query syntax as **2024-07-01**, with extra parameters for hybrid search and minimum thresholds for excluding weaker results. 

This preview adds:

+ [`threshold`](#set-thresholds-to-exclude-low-scoring-results-preview) for excluding low scoring results.
+ [`Hybridsearch.MaxTextRecallSize`](hybrid-search-how-to-query.md#set-maxtextrecallsize-and-countandfacetmode-preview) for more control over the inputs to a [hybrid query](hybrid-search-how-to-query.md).

In the following example, the vector is a representation of this string: "what Azure services support full text search". The query targets the `contentVector` field. The query returns `k` results. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2024-05-01-preview
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "count": true,
    "select": "title, content, category",
    "hybridSearch": {
        "maxTextRecallSize": 100,
        "countAndFacetMode": "countAllResults"
        }
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
            "fields": "contentVector",
            "k": 5,
            "exhaustive": true,
            "weight": 2,
            "threshold": {
                "kind": "vectorSimilarity",
                "value": 0.8
            },

        }
    ]
```

### [**Azure portal**](#tab/portal-vector-query)

Use Search Explorer to formulate a vector query. Search Explorer has a **Query view** and **JSON View**. If you have a vectorizer, you can use **Query view** (see [Query with integrated vectorization](#query-with-integrated-vectorization) for steps.)

Otherwise, if you don't have a vectorizer, you must use **JSON view** and formulate the vector query in JSON, pasting in a vector array as the query input.

1. Sign in to the [Azure portal](https://portal.azure.com) and find your search service.

1. Under **Search management** and **Indexes**, select the index.

   :::image type="content" source="media/vector-search-how-to-query/select-index.png" alt-text="Screenshot of the indexes menu." border="true":::

1. On Search Explorer, under **View**, select **JSON view**.

   :::image type="content" source="media/vector-search-how-to-query/select-json-view.png" alt-text="Screenshot of the index list." border="true":::

1. By default, the search API is **2024-05-01-preview**. You can choose another API version.

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

### [**2024-07-01**](#tab/filter-2024-07-01)

[**2024-07-01**](/rest/api/searchservice/search-service-api-versions#2024-07-01) is the stable version for this API. It has:

+ `vectorFilterMode` for prefilter (default) or postfilter [filtering modes](vector-search-filters.md).
+ `filter` provides the criteria.

In the following example, the vector is a representation of this query string: "what Azure services support full text search". The query targets the `contentVector` field. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

The filter criteria are applied to a filterable text field (`category` in this example) before the search engine executes the vector query.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2024-07-01
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

### [**2024-05-01-preview**](#tab/filter-2024-05-01-preview)

[**2024-05-01-preview**](/rest/api/searchservice/search-service-api-versions#2024-05-01-preview) introduces filter options. This version adds:

+ `vectorFilterMode` for prefilter (default) or postfilter [filtering modes](vector-search-filters.md).
+ `filter` provides the criteria.

In the following example, the vector is a representation of this query string: "what Azure services support full text search". The query targets the `contentVector` field. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

The filter criteria are applied to a filterable text field (`category` in this example) before the search engine executes the vector query.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2024-05-01-preview
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

---

## Multiple vector fields

You can set the "vectorQueries.fields" property to multiple vector fields. The vector query executes against each vector field that you provide in the `fields` list. When querying multiple vector fields, make sure each one contains embeddings from the same embedding model, and that the query is also generated from the same embedding model.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2024-07-01
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

## Query with integrated vectorization

This section shows a vector query that invokes the [integrated vectorization](vector-search-integrated-vectorization.md) that converts a text or [image query](search-get-started-portal-image-search.md) into a vector. We recommend the stable [**2024-07-01**](/rest/api/searchservice/documents/search-post) REST API, Search Explorer, or newer Azure SDK packages for this feature.

A prerequisite is a search index having a [vectorizer configured and assigned](vector-search-how-to-configure-vectorizer.md) to a vector field. The vectorizer provides connection information to an embedding model used at query time. 

### [**Azure portal**](#tab/builtin-portal)

Search Explorer supports integrated vectorization at query time. If your index contains vector fields and has a vectorizer, you can use the built-in text-to-vector conversion.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure AI Search service.

1. From the left menu, expand **Search management** > **Indexes**, and select your index. Search Explorer is the first tab on the index page.

1. Check **Vector profiles** to confirm you have a vectorizer.

   :::image type="content" source="media/vector-search-how-to-query/check-vectorizer.png" alt-text="Screenshot of a vectorizer setting in a search index.":::

1. In Search Explorer, you can enter a text string into the default search bar in query view. The built-in vectorizer converts your string into a vector, performs the search, and returns results.

   Alternatively, you can select **View** > **JSON view** to view or modify the query. If vectors are present, Search Explorer sets up a vector query automatically. You can use JSON view to select fields used in search and in the response, add filters, or construct more advanced queries like hybrid. A JSON example is provided in the REST API tab of this section.

### [**REST API**](#tab/builtin-2024-07-01)

1. Use [Index - GET](/rest/api/searchservice/indexes/get) to return the index definition and check for the presence of a vectorizer configuration. Look for `vectorizers` in your index definition. It should specify a deployed embedding model.

1. Use [Search - POST](/rest/api/searchservice/documents/search-post) for the query request.

    + `kind` must be set to `text` .
    + `text` must have a text string. It's passed to the vectorizer assigned to the vector field.
    + `fields` is the vector field to search.
    + `k` is the number of vector matches to return.

Here's a simple example of a query that's vectorized at query time. The text string is vectorized and then used to query the descriptionVector field.

```http
POST https://{{search-service}}.search.windows.net/indexes/{{index}}/docs/search?api-version=2024-07-01
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
POST https://{{search-service}}.search.windows.net/indexes/{{index}}/docs/search?api-version=2024-07-01
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
> Vectorization occurs during indexing and querying. If you don't need data chunking and vectorization in the index, you can skip steps like creating an indexer, skillset, and data source. In this workflow, vectorization is used only at query time to convert a text string or an image into an embedding. You can define a vectorizer in the search index for this step.

---

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

## Vector weighting

Add a `weight` query parameter to specify the relative weight of each vector query included in search operations. This value is used when combining the results of multiple ranking lists produced by two or more vector queries in the same request, or from the vector portion of a hybrid query.

The default is 1.0 and the value must be a positive number larger than zero.

Weights are used when calculating the [reciprocal rank fusion](hybrid-search-ranking.md#weighted-scores) scores of each document. The calculation is multiplier of the `weight` value against the rank score of the document within its respective result set.

The following example is a hybrid query with two vector query strings and one text string. Weights are assigned to the vector queries. The first query is 0.5 or half the weight, reducing its importance in the request. The second vector query is twice as important. 

Text queries have no weight parameters, but you can increase or decrease their importance by setting [maxTextRecallSize](hybrid-search-how-to-query.md#set-maxtextrecallsize-and-countandfacetmode-preview).

```http
POST https://[service-name].search.windows.net/indexes/[index-name]/docs/search?api-version=2024-07-01

    { 
      "vectorQueries": [ 
        { 
          "kind": "vector", 
          "vector": [1.0, 2.0, 3.0], 
          "fields": "my_first_vector_field", 
          "k": 10, 
          "weight": 0.5 
        },
        { 
          "kind": "vector", 
          "vector": [4.0, 5.0, 6.0], 
          "fields": "my_second_vector_field", 
          "k": 10, 
          "weight": 2.0
        } 
      ], 
      "search": "hello world" 
    } 
```

## Set thresholds to exclude low-scoring results (preview)

Because nearest neighbor search always returns the requested `k` neighbors, it's possible to get multiple low scoring matches as part of meeting the `k` number requirement on search results. To exclude low-scoring search result, you can add a `threshold` query parameter that filters out results based on a minimum score. Filtering occurs before [fusing results](hybrid-search-ranking.md) from different recall sets. 

This parameter is still in preview. We recommend preview REST API version [2024-05-01-preview](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2024-05-01-preview&preserve-view=true).

In this example, all matches that score below 0.8 are excluded from vector search results, even if the number of results fall below `k`.

```http
POST https://[service-name].search.windows.net/indexes/[index-name]/docs/search?api-version=2024-05-01-preview 
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

 <!-- Keep H2 as-is. Direct link from a blog post. Bulk of maxtextsizerecall has moved to hybrid query doc-->
## MaxTextSizeRecall for hybrid search (preview)

Vector queries are often used in hybrid constructs that include nonvector fields. If you discover that BM25-ranked results are over or under represented in a hybrid query results, you can [set `maxTextRecallSize`](hybrid-search-how-to-query.md#set-maxtextrecallsize-and-countandfacetmode-preview) to increase or decrease the BM25-ranked results provided for hybrid ranking.

You can only set this property in hybrid requests that include both "search" and "vectorQueries" components.

This parameter is still in preview. We recommend preview REST API version [2024-05-01-preview](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2024-05-01-preview&preserve-view=true).

For more information, see [Set maxTextRecallSize - Create a hybrid query](hybrid-search-how-to-query.md#set-maxtextrecallsize-and-countandfacetmode-preview).

## Next steps

As a next step, review vector query code examples in [Python](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-python), [C#](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-dotnet) or [JavaScript](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-javascript).
