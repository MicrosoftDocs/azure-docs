---
title: Vector query how-to
titleSuffix: Azure AI Search
description: Learn how to build queries for vector search.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 11/04/2023
---

# Create a vector query in Azure AI Search

In Azure AI Search, if you [added vector fields](vector-search-how-to-create-index.md) to a search index, this article explains how to:

> [!div class="checklist"]
> + [Query vector fields](#vector-query-request)
> + [Filter a vector query](#vector-query-with-filter)
> + [Query multiple vector fields at once](#multiple-vector-fields)
> + [Query with integrated vectorization (preview)](#query-with-integrated-vectorization-preview)

Code samples in the [cognitive-search-vector](https://github.com/Azure/cognitive-search-vector-pr) repository demonstrate end-to-end workflows that include schema definition, vectorization, indexing, and queries.

## Prerequisites

+ Azure AI Search, in any region and on any tier. Most existing services support vector search. For services created prior to January 2019, a small subset won't support vector search. If an index containing vector fields fails to be created or updated, this is an indicator. In this situation, a new service must be created.

+ A search index containing vector fields. See [Add vector fields to a search index](vector-search-how-to-create-index.md).

+ Use REST API version **2023-11-01** if you want the stable version. Otherwise, you can continue to use **2023-10-01-Preview**, **2023-07-01-Preview**, the Azure SDK libraries, or Search Explorer in the Azure portal.

## Tips

The stable version (**2023-11-01**) doesn't provide built-in vectorization of the query input string. Encoding (text-to-vector) of the query string requires that you pass the query string to an external embedding model for vectorization. You would then pass the response to the search engine for similarity search over vector fields.

The preview version (**2023-10-01-Preview**) adds [integrated vectorization](vector-search-integrated-vectorization.md). [Create and assign a vectorizer](vector-search-how-to-configure-vectorizer.md) to get built-in embedding of query strings. [Update your query](#query-with-integrated-vectorization-preview) to provide a text string to the vectorizer.

All results are returned in plain text, including vectors in fields marked as `retrievable`. Because numeric vectors aren't useful in search results, choose other fields in the index as a proxy for the vector match. For example, if an index has "descriptionVector" and "descriptionText" fields, the query can match on "descriptionVector" but the search result can show "descriptionText". Use the `select` parameter to specify only human-readable fields in the results.

## Check your index for vector fields

If you aren't sure whether your search index already has vector fields, look for:

+ A non-empty `vectorSearch` property containing algorithms and other vector-related configurations embedded in the index schema.

+ In the fields collection, look for fields of type `Collection(Edm.Single)` with a `dimensions` attribute, and a `vectorSearch` section in the index.

You can also send an empty query (`search=*`) against the index. If the vector field is "retrievable", the response includes a vector field consisting of an array of floating point values.

## Convert query input into a vector

This section applies to the generally available version of vector search (**2023-11-01**).

To query a vector field, the query itself must be a vector. To convert a text query string provided by a user into a vector representation, your application must call an embedding library or API endpoint that provides this capability. **Use the same embedding that you used to generate embeddings in the source documents.**

You can find multiple instances of query string conversion in the [cognitive-search-vector](https://github.com/Azure/cognitive-search-vector-pr/) repository for each of the Azure SDKs.

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

Your application code is responsible for handling this response and providing the embedding in the query request.

## Vector query request

This section shows you the basic structure of a vector query. You can use the Azure portal, REST APIs, or the beta packages of the Azure SDKs to query vectors.

### [**2023-11-01**](#tab/query-2023-11-01)

REST API version [**2023-11-01**](/rest/api/searchservice/search-service-api-versions#2023-11-01) is the stable API version for [Search POST](/rest/api/searchservice/2023-11-01/documents/search-post). This API supports:

+ `vectorQueries` is the construct for vector search.
+ `kind` set to `vector` specifies the query string is a vector.
+ `vector` is the query string.
+ `exhaustive` (optional) invokes exhaustive KNN at query time, even if the field is indexed for HNSW.

In the following example, the vector is a representation of this query string: "what Azure services support full text search". The query targets the "contentVector" field. The query returns `k` results. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
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

### [**2023-10-01-Preview**](#tab/query-2023-10-01-Preview)

REST API version [**2023-10-01-Preview**](/rest/api/searchservice/search-service-api-versions#2023-10-01-Preview) supports pure vector queries and [integrated vectorization of text queries](#query-with-integrated-vectorization-preview). This section shows the syntax for pure vector queries.

+ `vectorQueries` is the construct for vector search.
+ `kind` set to `vector` specifies the query string is a vector.
+ `vector` is the query string.
+ `exhaustive` (optional) invokes exhaustive KNN at query time, even if the field is indexed for HNSW.

In the following example, the vector is a representation of this query string: "what Azure services support full text search". The query targets the "contentVector" field. The query returns `k` results. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

The syntax for pure vector query is identical to the stable version, but has breaking changes from the 2023-07-01-Preview. The breaking changes are `vectorQueries` (for `vectors`), `vector` (for `value`), `kind` (new, required), `exhaustive` (new, optional).

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

> [!IMPORTANT]
> The vector query syntax for this version is obsolete in later versions.

REST API version [**2023-07-01-Preview**](/rest/api/searchservice/index-preview) first introduced vector query support to [Search Documents](/rest/api/searchservice/preview-api/search-documents). This version added:

+ `vectors` for specifying a vector to search for, vector fields to search in, and the k-number of nearest neighbors to return.

In the following example, the vector is a representation of this query string: "what Azure services support full text search". The query targets the "contentVector" field. The query returns `k` results. The actual vector has 1536 embeddings. It's trimmed in this example for readability.

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

The response includes five matches, and each result provides a search score, title, content, and category. In a similarity search, the response always includes `k` matches, even if the similarity is weak. For indexes that have fewer than `k` documents, only those number of documents will be returned.

Notice that "select" returns textual fields from the index. Although the vector field is "retrievable" in this example, its content isn't meaningful as a search result, so it's often excluded in the results.

### [**Azure portal**](#tab/portal-vector-query)

Azure portal supports **2023-10-01-Preview** and **2023-11-01** behaviors.

Be sure to the **JSON view** and formulate the vector query in JSON. The search bar in **Query view** is for full text search and will treat any vector input as plain text.

1. Sign in to Azure portal and find your search service.

1. Under **Search management** and **Indexes**, select the index.

   :::image type="content" source="media/vector-search-how-to-query/select-index.png" alt-text="Screenshot of the indexes menu." border="true":::

1. On Search Explorer, under **View**, select **JSON view**.

   :::image type="content" source="media/vector-search-how-to-query/select-json-view.png" alt-text="Screenshot of the index list." border="true":::

1. By default, the search API is **2023-10-01-Preview**. This is a valid API version for vector search.

1. Paste in a JSON vector query, and then select **Search**.

   :::image type="content" source="media/vector-search-how-to-query/paste-vector-query.png" alt-text="Screenshot of the JSON query." border="true":::

### [**.NET**](#tab/dotnet-vector-query)

+ Use the [**Azure.Search.Documents 11.5.0-beta.5**](https://www.nuget.org/packages/Azure.Search.Documents/11.5.0-beta.5) package for vector scenarios. 

+ See the [cognitive-search-vector](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-dotnet) GitHub repository for .NET code samples.

### [**Python**](#tab/python-vector-query)

+ Use the [**Azure.Search.Documents /11.4.0b11**](https://pypi.org/project/azure-search-documents//11.4.0b11/) package for vector scenarios. 

+ See the [cognitive-search-vector](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python) GitHub repository for Python code samples.

### [**JavaScript**](#tab/js-vector-query)

+ Use the [**@azure/search-documents 12.0.0-beta.4**](https://www.npmjs.com/package/@azure/search-documents/v/12.0.0-beta.4) package for vector scenarios.  

+ See the [cognitive-search-vector](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-javascript) GitHub repository for JavaScript code samples.

---

## Vector query response

Here's a modified example so that you can see the basic structure of a response from a pure vector query. The previous query examples selected title, content, category as a best practice. This example shows a contentVector field in the response to illustrate that retrievable vector fields can be included.

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

+ `k` usually determines how many matches are returned. You can assume a `k` of three for this response.
+ The **`@search.score`** is determined by the [vector search algorithm](vector-search-ranking.md) (HNSW algorithm and a `cosine` similarity metric in this example). 
+ Fields include text and vector values. The content vector field consists of 1536 dimensions for each match, so it's truncated for brevity (normally, you might exclude vector fields from results). The text fields used in the response (`"select": "title, category"`) aren't used during query execution. The match is made on vector data alone. However, a response can include any "retrievable" field in an index. As such, the inclusion of text fields is helpful because its values are easily recognized by users.

## Vector query with filter

A query request can include a vector query and a [filter expression](search-filters.md). Filters apply to "filterable" text and numeric fields, and are useful for including or excluding search documents based on filter criteria. Although a vector field isn't filterable itself, a query can include filters on other fields in the same index.

In **2023-11-01** or **2023-10-01-Preview**, you can apply a filter before or after query execution. The default is pre-query. If you want post-query filtering instead, set the `vectorFiltermode` parameter.

In **2023-07-01-Preview**, a filter in a pure vector query is processed as a post-query operation.

For a comparison of each mode and the expected performance based on index size, see [Filters in vector queries](vector-search-filters.md).

> [!TIP]
> If you don't have source fields with text or numeric values, check for document metadata, such as LastModified or CreatedBy properties, that might be useful in a metadata filter.

### [**2023-11-01**](#tab/filter-2023-11-01)

REST API version [**2023-11-01**](/rest/api/searchservice/search-service-api-versions#2023-11-01) is the stable version for this API. It has:

+ `vectorFilterMode` for prefiltering (default) or postfiltering during query execution. Valid values are `preFilter` (default), `postFilter`, and null.
+ `filter` provides the criteria.

In the following example, the vector is a representation of this query string: "what Azure services support full text search". The query targets the "contentVector" field. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

The filter criteria are applied to a filterable text field ("category" in this example) before the search engine executes the vector query.

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

### [**2023-10-01-Preview**](#tab/filter-2023-10-01-Preview)

REST API version [**2023-10-01-Preview**](/rest/api/searchservice/search-service-api-versions#2023-10-01-Preview) introduces filter options. This version adds:

+ `vectorFilterMode` for prefiltering (default) or postfiltering during query execution. Valid values are `preFilter` (default), `postFilter`, and null.
+ `filter` provides the criteria.

In the following example, the vector is a representation of this query string: "what Azure services support full text search". The query targets the "contentVector" field. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

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

In the following example, the vector is a representation of this query string: "what Azure services support full text search". The query targets the "contentVector" field. The actual vector has 1536 embeddings, so it's trimmed in this example for readability.

In this API version, there's no pre-filter support or `vectorFilterMode` parameter. The filter criteria are applied after the search engine executes the vector query. The set of `"k"` nearest neighbors is retrieved, and then combined with the set of filtered results. As such, the value of `"k"` predetermines the surface over which the filter is applied. For `"k": 10`, the filter is applied to 10 most similar documents. For `"k": 100`, the filter iterates over 100 documents (assuming the index contains 100 documents that are sufficiently similar to the query).

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
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
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
            "fields": "contentVector, titleVector",
            "k": 5
        }
    ]
}
```

## Multiple vector queries

Multi-query vector search sends multiple queries across multiple vector fields in your search index. A common example of this query request is when using models such as [CLIP](https://openai.com/research/clip) for a multi-modal vector search where the same model can vectorize image and non-image content.

The following query example looks for similarity in both `myImageVector` and `myTextVector`, but sends in two different query embeddings respectively. This scenario is ideal for multi-modal use cases where you want to search over different embedding spaces. This query produces a result that's scored using [Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md).

+ `vectors.value` property contains the vector query generated from the embedding model used to create image and text vectors in the search index. 
+ `vectors.fields` contains the image vectors and text vectors in the search index. This is the searchable data.
+ `vectors.k` is the number of nearest neighbor matches to include in results.

```json
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

Using [**2023-10-01-Preview** REST API](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2023-10-01-preview&preserve-view=true) or beta Azure SDK packages that have been updated to use the feature, your text queries can be vectorized internally, where Azure AI Search makes the call to Azure OpenAI or another vectorization agent, and uses the embedding that comes back in the query.

+ Queries that use [integrated vectorization](vector-search-integrated-vectorization.md) provide `text` strings instead of vectors, and specify `text` as the kind of vector query.

+ A vectorizer that's [configured and assigned to a vector field](vector-search-how-to-configure-vectorizer.md) in the search index determines the embedding model used at query time.

Here's a simple example of a query that's vectorized at query time. The vectorized string is used to query the descriptionVector field.

```http
POST https://{{search-service}}.search.windows.net/indexes/{{index}}/docs/search?api-version=2023-10-01-preview
{
    "select": "title, genre, description",
    "vectorQueries": [
        {
            "kind": "text"
            "text": "mystery novel set in London",
            "fields": "descriptionVector",
            "k": 5
        }
    ]
}
```

Here's a [hybrid query](hybrid-search-how-to-query.md), with multiple vector fields and queries and semantic ranking. Again, the differences are the `kind` of vector query and the `text` string instead of a vector.

In this example, the search engine makes three vectorization calls to the vectorizers assigned to descriptionVector, synopsisVector, and authorBioVector in the index. The resulting vectors are used to retrieve documents against their respective fields. The search engine also executes the `search` query. 

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
            "kind": "text"
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

+ The similarity metric specified in the index `vectorSearch` section for a vector-only query. Valid values are `cosine` , `euclidean`, and `dotProduct`.
+ Reciprocal Rank Fusion (RRF) if there are multiple sets of search results.

Azure OpenAI embedding models use cosine similarity, so if you're using Azure OpenAI embedding models, `cosine` is the recommended metric. Other supported ranking metrics include `euclidean` and `dotProduct`.

Multiple sets are created if the query targets multiple vector fields, or if the query is a hybrid of vector and full text search, with or without [semantic ranking](semantic-search-overview.md). Within vector search, a vector query can only target one internal vector index. So for [multiple vector fields](#multiple-vector-fields) and [multiple vector queries](#multiple-vector-queries), the search engine generates multiple queries that target the respective vector indexes of each field. Output is a set of ranked results for each query, which are fused using RRF. For more information, see [Vector query execution and scoring](vector-search-ranking.md).

## Next steps

As a next step, we recommend reviewing the demo code for [Python](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python), [C#](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-dotnet) or [JavaScript](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-javascript).
