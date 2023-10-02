---
title: Quickstart vector search
titleSuffix: Azure Cognitive Search
description: Use the preview REST APIs to call vector search.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 07/07/2023
---

# Quickstart: Use preview REST APIs for vector search queries

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr#readme).

Get started with vector search in Azure Cognitive Search using the **2023-07-01-Preview** REST APIs that create, load, and query a search index. Search indexes now support vector fields in the fields collection. When querying the search index, you can build vector-only queries, or create hybrid queries that target vector fields *and* textual fields configured for filters, sorts, facets, and semantic ranking.

## Prerequisites

+ [Postman app](https://www.postman.com/downloads/)

+ An Azure subscription. [Create one for free](https://azure.microsoft.com/free/).

+ Azure Cognitive Search, in any region and on any tier. However, if you want to also use [semantic search](semantic-search-overview.md), as shown in the last two examples, your search service must be Basic tier or higher, with [semantic search enabled](semantic-how-to-enable-disable.md).

  Most existing services support vector search. For a small subset of services created prior to January 2019, an index containing vector fields will fail on creation. In this situation, a new service must be created.

+ [Sample Postman collection](https://github.com/Azure/cognitive-search-vector-pr/tree/main/postman-collection), with requests targeting the **2023-07-01-preview** API version of Azure Cognitive Search.

+ Optional. To use the "Create Query Embeddings" request, you need [Azure OpenAI](https://aka.ms/oai/access) with a deployment of **text-embedding-ada-002**. For this request, provide your Azure OpenAI endpoint, key, model deployment name, and API version in the collection variables.

## About the sample data and queries

Sample data consists of text and vector descriptions of 108 Azure services, generated from ChatGPT in Azure OpenAI.

+ Textual data is used for keyword search, semantic ranking, and capabilities that depend on text (filters, facets, and sorting). 

+ Vector data (text embeddings) is used for vector search. Currently, Cognitive Search doesn't generate vectors for you. For this quickstart, vector data was generated previously and copied into the "Upload Documents" request and into the query requests.

  For documents, we generated vector data using demo code that calls Azure OpenAI for the embeddings. Samples are currently using beta versions of the Azure SDKs and are available in [Python](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python), [C#](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-dotnet), and [JavaScript](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-javascript).

  For queries, we used the "Create Query Embeddings" request that calls Azure OpenAI and outputs embeddings for a search string. If you want to formulate your own vector queries against the sample data of 108 Azure services, provide your Azure OpenAI connection information in the Postman collection variables. Your Azure OpenAI service must have a deployment of an embedding model that's identical to the one used to generate embeddings in your search corpus. For this quickstart, the following parameters were used: 
  
  + Model name: **text-embedding-ada-002**
  + Model version: **2**
  + API version: **2023-05-15**.

## Set up your project

If you're unfamiliar with Postman, see [this quickstart](search-get-started-rest.md) for instructions on how to import collections and set variables.

1. [Fork or clone the repository](https://github.com/Azure/cognitive-search-vector-pr).

1. Start Postman and import the collection `Vector Search QuickStart.postman_collection v1.0.json`.

1. Right-click the collection name and select **Edit** to set the collection's variables to valid values for Azure Cognitive Search and Azure OpenAI.

1. Select **Variables** from the list of actions at the top of the page. Into **Current value**, provide the following values. Required and recommended values are specified.

    | Variable | Current value |
    |----------|---------------|
    | index-name | *index names are lower-case, no spaces, and can't start or end with dashes* |
    | search-service-name | *from Azure portal, get just the name of the service, not the full URL* |
    | search-api-version | 2023-07-01-Preview |
    | search-api-key | *provide an admin key* |
    | openai-api-key | *optional. Set this value if you want to generate embeddings. Find this value in Azure portal.* |
    | openai-service-name | *optional. Set this value if you want to generate embeddings. Find this value in Azure portal.* |
    | openai-deployment-name | text-embedding-ada-002 |
    | openai-api-version | 2023-05-15 |

1. Save your changes.

You're now ready to send the requests to your search service. For each request, select the blue **Send** button. When you see a success message, move on to the next request.

## Create an index

Use the [Create or Update Index](/rest/api/searchservice/preview-api/create-or-update-index) REST API for this request.

The index schema is organized around a product catalog scenario. Sample data consists of titles, categories, and descriptions of 108 Azure services. This schema includes fields for vector and traditional keyword search, with configurations for vector and semantic search.

```http
PUT https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}?api-version={{api-version}}
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "name": "{{index-name}}",
    "fields": [
        {
            "name": "id",
            "type": "Edm.String",
            "key": true,
            "filterable": true
        },
        {
            "name": "category",
            "type": "Edm.String",
            "filterable": true,
            "searchable": true,
            "retrievable": true
        },
        {
            "name": "title",
            "type": "Edm.String",
            "searchable": true,
            "retrievable": true
        },
        {
            "name": "titleVector",
            "type": "Collection(Edm.Single)",
            "searchable": true,
            "retrievable": true,
            "dimensions": 1536,
            "vectorSearchConfiguration": "vectorConfig"
        },
        {
            "name": "content",
            "type": "Edm.String",
            "searchable": true,
            "retrievable": true
        },
        {
            "name": "contentVector",
            "type": "Collection(Edm.Single)",
            "searchable": true,
            "retrievable": true,
            "dimensions": 1536,
            "vectorSearchConfiguration": "vectorConfig"
        }
    ],
    "corsOptions": {
        "allowedOrigins": [
            "*"
        ],
        "maxAgeInSeconds": 60
    },
    "vectorSearch": {
        "algorithmConfigurations": [
            {
                "name": "vectorConfig",
                "kind": "hnsw"
            }
        ]
    },
    "semantic": {
        "configurations": [
            {
                "name": "my-semantic-config",
                "prioritizedFields": {
                    "titleField": {
                        "fieldName": "title"
                    },
                    "prioritizedContentFields": [
                        {
                            "fieldName": "content"
                        }
                    ],
                    "prioritizedKeywordsFields": []
                }
            }
        ]
    }
}
```

You should get a status HTTP 201 success.

**Key points:**

+ The "fields" collection includes a required key field, a category field, and pairs of fields (such as "title", "titleVector") for keyword and vector search. Colocating vector and non-vector fields in the same index enables hybrid queries. For instance, you can combine filters, keyword search with semantic ranking, and vectors into a single query operation.

+ Vector fields must be `"type": "Collection(Edm.Single)"` with `"dimensions"` and `"vectorSearchConfiguration"` properties. See [this article](/rest/api/searchservice/preview-api/create-or-update-index) for property descriptions.

+ The "vectorSearch" object is an array of algorithm configurations used by vector fields. Currently, only HNSW is supported. HNSW is a graph-based Approximate Nearest Neighbors (ANN) algorithm optimized for high-recall, low-latency applications.

+ [Optional]: The "semanticSearch" configuration enables reranking of search results. You can rerank results in queries of type "semantic" for string fields that are specified in the configuration. See [Semantic Search overview](semantic-search-overview.md) to learn more.

## Upload documents

Use the [Add, Update, or Delete Documents](/rest/api/searchservice/preview-api/add-update-delete-documents) REST API for this request.

For readability, the following example shows a subset of documents and embeddings. The body of the Upload Documents request consists of 108 documents, each with a full set of embeddings for "titleVector" and "contentVector".

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/index?api-version={{api-version}}
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "value": [
        {
            "id": "1",
            "title": "Azure App Service",
            "content": "Azure App Service is a fully managed platform for building, deploying, and scaling web apps. You can host web apps, mobile app backends, and RESTful APIs. It supports a variety of programming languages and frameworks, such as .NET, Java, Node.js, Python, and PHP. The service offers built-in auto-scaling and load balancing capabilities. It also provides integration with other Azure services, such as Azure DevOps, GitHub, and Bitbucket.",
            "category": "Web",
            "titleVector": [
                -0.02250031754374504,
                 . . . 
                        ],
            "contentVector": [
                -0.024740582332015038,
                 . . .
            ],
            "@search.action": "upload"
        },
        {
            "id": "2",
            "title": "Azure Functions",
            "content": "Azure Functions is a serverless compute service that enables you to run code on-demand without having to manage infrastructure. It allows you to build and deploy event-driven applications that automatically scale with your workload. Functions support various languages, including C#, F#, Node.js, Python, and Java. It offers a variety of triggers and bindings to integrate with other Azure services and external services. You only pay for the compute time you consume.",
            "category": "Compute",
            "titleVector": [
                -0.020159931853413582,
                . . .
            ],
            "contentVector": [
                -0.02780858241021633,,
                 . . .
            ],
            "@search.action": "upload"
        }
        . . .
    ]
}
```

**Key points:**

+ Documents in the payload consist of fields defined in the index schema. 

+ Vector fields contain floating point values. The dimensions attribute has a minimum of 2 and a maximum of 2048 floating point values each. This quickstart sets the dimensions attribute to 1536 because that's the size of embeddings generated by the Open AI's **text-embedding-ada-002** model.

## Run queries

Use the [Search Documents](/rest/api/searchservice/preview-api/search-documents) REST API for this request. Public preview has several limitations. POST is required for this preview and the API version must be 2023-07-01-Preview.

There are several queries to demonstrate the patterns. We use the same query string (*"what Azure services support full text search"*) across all of them so that you can compare results and relevance.

+ [Single vector search](#single-vector-search)
+ [Single vector search with filter](#single-vector-search-with-filter)
+ [Cross-field vector search](#cross-field-vector-search)
+ [Multi-query vector search](#multi-query-vector-search)
+ [Hybrid search](#hybrid-search)
+ [Hybrid search with filter](#hybrid-search-with-filter)
+ [Semantic hybrid search](#semantic-hybrid-search)
+ [Semantic hybrid search with filter](#semantic-hybrid-search-with-filter)

### Single vector search

In this vector query, which is shortened for brevity, the "value" contains the vectorized text of the query input, "fields" determines which vector fields are searched, and "k" specifies the number of nearest neighbors to return.

Recall that the vector query was generated from this string: `"what Azure services support full text search"`. The search targets the `contentVector` field.

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
            "k": 5
        }
    ]
}
```

The response includes 5 results, and each result provides a search score, title, content, and category. In a similarity search, the response will always include "k" results ordered by the value similarity score.

### Single vector search with filter

You can add filters, but the filters are applied to the non-vector content in your index. In this example, the filter applies to the "category" field.

The response is 10 Azure services, with a search score, title, and category for each one. Notice the `select` property. It's used to select specific fields for the response.

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
        },
    ],
    "select": "title, content, category",
    "filter": "category eq 'Databases'"
}
```

### Cross-field vector search

A cross-field vector query sends a single query across multiple vector fields in your search index. This query example looks for similarity in both "titleVector" and "contentVector" and displays scores using [Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md):

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
            "fields": "titleVector, contentVector",
            "k": 5
        }
    ]
}
```

### Multi-query vector search

Multi-query vector search sends multiple queries across multiple vector fields in your search index. This query example looks for similarity in both `titleVector` and `contentVector`, but sends in two different query embeddings respectively. This scenario is ideal for multi-modal use cases where you want to search over a `textVector` field and an `imageVector` field. You can also use this scenario if you have different embedding models with different dimensions in your search index. This also displays scores using [Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md).

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version={{api-version}}
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "vectors": [
        {
            "value": [
                -0.01234823,
                0.018708462,
                . . . 
                -0.99456344,
                -0.00084123
            ],
            "fields": "contentVector",
            "k": 5
        },
        {
            "value": [
                -0.43725224,
                0.000234324,
                . . . 
                -0.99912342,
                -0.01239130
            ],
            "fields": "contentVector",
            "k": 5
        }
    ]
}
```

### Hybrid search

Hybrid search consists of keyword queries and vector queries in a single search request. 

The response includes the top 10 ordered by search score. Both vector queries and free text queries are assigned a search score according to the scoring or similarity functions configured on the fields (BM25 for text fields). The scores are merged using [Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md) to weight each document with the inverse of its position in the ranked result set. 

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
    "top": "10"
}
```

Compare the responses between Single Vector Search and Simple Hybrid Search for the top result. The different ranking algorithms, HNSW's similarity metric and RRF respectively, produce scores that have different magnitudes. This is by design. Note that RRF scores may appear quite low, even with a high similarity match. This is a characteristic of the RRF algorithm. When using hybrid search and RRF, more of the reciprocal of the ranked documents are included in the results, given the relatively smaller score of the RRF ranked documents, as opposed to pure vector search.

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

### Hybrid search with filter

This example adds a filter, which is applied to the nonvector content of the search index.

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

### Semantic hybrid search

Assuming that you've [enabled semantic search](semantic-how-to-enable-disable.md) and your index definition includes a [semantic configuration](semantic-how-to-query-request.md), you can formulate a query that includes vector search, plus keyword search with semantic ranking, caption, answers, and spell check. 

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

### Semantic hybrid search with filter

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

## Clean up

Azure Cognitive Search is a billable resource. If it's no longer needed, delete it from your subscription to avoid charges.

## Next steps

As a next step, we recommend reviewing the demo code for [Python](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python), [C#](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-dotnet), or [JavaScript](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-javascript).


