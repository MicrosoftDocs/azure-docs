---
title: Configure vectorizer
titleSuffix: Azure AI Search
description: Steps for adding a vectorizer to a search index in Azure AI Search. A vectorizer calls an embedding model that generates embeddings from text.

author: heidisteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 11/10/2023
---

# Configure a vectorizer in a search index

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2023-10-01-Preview REST API](/rest/api/searchservice/operation-groups?view=rest-searchservice-2023-10-01-preview&preserve-view=true) supports this feature.

A *vectorizer* is a component of a [search index](search-what-is-an-index.md) that specifies a vectorization agent, such as a deployed embedding model on Azure OpenAI that converts text to vectors. You can define a vectorizer once, and then reference it in the vector profile assigned to a vector field.

A vectorizer is used during indexing and queries. It allows the search service to handle chunking and coding on your behalf.

You can use the [**Import and vectorize data** wizard](search-get-started-portal-import-vectors.md), the [2023-10-01-Preview](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true) REST APIs, or any Azure beta SDK package that's been updated to provide this feature.

## Prerequisites

+ A deployed embedding model on Azure OpenAI, or a custom skill that wraps an embedding model.

+ Permissions to upload a payload to the embedding model. The connection to a vectorizer is specified in the skillset. If you're using Azure OpenAI, the caller must have [Cognitive Services OpenAI User](/azure/ai-services/openai/how-to/role-based-access-control#azure-openai-roles) permissions.

+ A [supported data source](search-indexer-overview.md#supported-data-sources) and a [data source definition](search-howto-create-indexers.md#prepare-a-data-source) for your indexer.

+ A skillset that performs data chunking and vectorization of those chunks. You can omit a skillset if you only want integrated vectorization at query time, or if you don't need chunking or [index projections](index-projections-concept-intro.md) during indexing. This article assumes you already know how to [create a skillset](cognitive-search-defining-skillset.md).

+ An index that specifies vector and non-vector fields. This article assumes you already know how to [create a vector index](vector-search-how-to-create-index.md) and covers just the steps for adding vectorizers and field assignments.

+ An [indexer](search-howto-create-indexers.md) that drives the pipeline.

## Define a vectorizer

1. Use [Create or Update Index (preview)](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true) to add a vectorizer.

1. Add the following JSON to your index definition. Provide valid values and remove any properties you don't need:

    ```json
      "vectorizers": [
        {
          "name": "my_open_ai_vectorizer",
          "kind": "azureOpenAI",
          "azureOpenAIParameters": {
            "resourceUri": "https://url.openai.azure.com",
            "deploymentId": "text-embedding-ada-002",
            "apiKey": "mytopsecretkey"
          }
        },
        {
          "name": "my_custom_vectorizer",
          "kind": "customWebApi",
          "customVectorizerParameters": {
            "uri": "https://my-endpoint",
            "authResourceId": " ",
            "authIdentity": " "
          }
        }
      ]
    ```

## Define a profile that includes a vectorizer

1. Use [Create or Update Index (preview)](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true) to add a profile.

1. Add a profiles section that specifies combinations of algorithms and vectorizers.

    ```json
    "profiles": [ 
        { 
            "name": "my_open_ai_profile", 
            "algorithm": "my_hnsw_algorithm", 
            "vectorizer":"my_open_ai_vectorizer" 
        }, 
        { 
            "name": "my_custom_profile", 
            "algorithm": "my_hnsw_algorithm", 
            "vectorizer":"my_custom_vectorizer" 
        }
    ]
    ```

## Assign a vector profile to a field

1. Use [Create or Update Index (preview)](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true) to add field attributes.

1. For each vector field in the fields collection, assign a profile.

    ```json
    "fields": [ 
            { 
                "name": "ID", 
                "type": "Edm.String", 
                "key": true, 
                "sortable": true, 
                "analyzer": "keyword" 
            }, 
            { 
                "name": "title", 
                "type": "Edm.String"
            }, 
            { 
                "name": "synopsis", 
                "type": "Collection(Edm.Single)", 
                "dimensions": 1536, 
                "vectorSearchProfile": "my_open_ai_profile", 
                "searchable": true, 
                "retrievable": true, 
                "filterable": false, 
                "sortable": false, 
                "facetable": false 
            }, 
            { 
                "name": "reviews", 
                "type": "Collection(Edm.Single)", 
                "dimensions": 1024, 
                "vectorSearchProfile": "my_custom_profile", 
                "searchable": true, 
                "retrievable": true, 
                "filterable": false, 
                "sortable": false, 
                "facetable": false 
            } 
    ]
    ```

## Test a vectorizer

1. [Run the indexer](search-howto-run-reset-indexers.md). When you run the indexer, the following operations occur:

    + Data retrieval from the supported data source
    + Document cracking
    + Skills processing for data chunking and vectorization
    + Indexing to one or more indexes

1. [Query the vector field](vector-search-how-to-query.md) once the indexer is finished. In a query that uses integrated vectorization:

    + Set `"kind"` to `"text"`.
    + Set `"text"` to the string to be vectorized.

    ```json
    "count": true,
    "select": "title",
    "vectorQueries": [ 
       { 
          "kind": "text",
          "text": "story about horses set in Australia",
          "fields": "synopsis",
          "k": 5
       }
    ]
    ```

There are no vectorizer properties to set at query time. The query uses the algorithm and vectorizer provided through the profile assignment in the index.

## See also

+ [Integrated vectorization (preview)](vector-search-integrated-vectorization.md)