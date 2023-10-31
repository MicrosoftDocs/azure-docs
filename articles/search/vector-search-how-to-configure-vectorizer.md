---
title: Configure vectorizer
titleSuffix: Azure AI Search
description: Steps for adding a vectorizer to a search index in Azure AI Search. A vectorizer calls an embedding model that generates embeddings from text.

author: heidisteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 10/30/2023
---

# Configure a vectorizer in a search index

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2023-10-01-Preview REST API](/rest/api/searchservice/2023-10-01-preview/skillsets/create-or-update) supports this feature.

A *vectorizer* is a component of a search index that specifies a vectorization agent, such as a deployed embedding model on Azure OpenAI that converts text to vectors. You can define a vectorizer once, and then reference it in the vector profile assigned to a vector field.

The vectorizer that's assigned to a field is used during indexing and queries.

You can use the Azure portal (**Import and vectorize data** wizard), the [2023-10-01-Preview](/rest/api/searchservice/2023-10-01-preview/indexes/create-or-update) REST APIs, or any Azure beta SDK package that's been updated to provide this feature.

## Prerequisites

+ A deployed embedding model on Azure OpenAI, or a custom skill that wraps an embedding model.

+ Permissions to upload a payload to the model. The connection to a vectorizer is specified in the skillset. If you're using Azure OpenAI, the caller must have Cognitive Services OpenAI User permissions.

+ A supported data source.

## Define a vectorizer

1. Use [Create or Update Index](/rest/api/searchservice/2023-10-01-preview/indexes/create-or-update) to add a vectorizer.

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
            "kind": "azureOpenAI",
            "customVectorizerParameters": {
              "uri": "https://my-endpoint",
              "authResourceId": " ",
              "authIdentity": " "
            }
          }
        ]
    ```

## Define a profile that includes a vectorizer

Add a profiles section that specifies combinations of algorithms and vectorizers.

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

Assign a profile to each vector field.

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

1. [Run the indexer](search-howto-run-reset-indexers.md).

1. [Query the vector field](vector-search-how-to-query.md). There are no vectorizer properties to set at query time. The query uses the algorithm and vectorizer provided through the profile assignment.

## See also

+ [Integrated vectorization (preview)](vector-search-integrated-vectorization.md)