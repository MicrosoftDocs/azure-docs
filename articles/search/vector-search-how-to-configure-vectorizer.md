---
title: Configure a vectorizer
titleSuffix: Azure AI Search
description: Steps for adding a vectorizer to a search index in Azure AI Search. A vectorizer calls an embedding model that generates embeddings from text.

author: heidisteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 05/08/2024
---

# Configure a vectorizer in a search index

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2023-10-01-preview REST API](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true) and [2024-03-01-preview REST API](/rest/api/searchservice/operation-groups?view=rest-searchservice-2024-03-01-preview&preserve-view=true) support the [AzureOpenAIEmbedding vectorizer](vector-search-vectorizer-azure-open-ai.md) and [custom vectorizer](vector-search-vectorizer-custom-web-api.md). [2024-05-01-preview REST API](/rest/api/searchservice/operation-groups?view=rest-searchservice-2024-05-01-preview&preserve-view=true) adds support for the [Azure AI Vision vectorizer](vector-search-vectorizer-ai-services-vision.md) and the [Azure AI Studio model catalog vectorizer](vector-search-vectorizer-azure-machine-learning-ai-studio-catalog.md).

In Azure AI Search a *vectorizer* is software that performs vectorization, such as a deployed embedding model on Azure OpenAI, that converts text (or images) to vectors during query execution.

It's defined in a [search index](search-what-is-an-index.md), it applies to searchable vector fields, and it's used at query time to generate an embedding for a text or image query input. If instead you need to vectorize content as part of the indexing process, refer to [Integrated Vectorization (Preview)](vector-search-integrated-vectorization.md). For built-in vectorization during indexing, you can configure an indexer and skillset that calls an embedding model for your raw text content.

To add a vectorizer to search index, you can use the index designer in Azure portal, or call the [Create or Update Index 2024-05-01-preview](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true) REST API, or use any Azure beta SDK package that's updated to provide this feature.

## Prerequisites

+ [An index with searchable vector fields](vector-search-how-to-create-index.md) on Azure AI Search.

+ A deployed embedding model, such as **text-embedding-ada-002** on Azure OpenAI. It's used to vectorize a query. It must be identical to the model used to generate the embeddings in your index. You can also use [models deployed from the Azure AI Studio model catalog](vector-search-integrated-vectorization-ai-studio.md) or an [Azure AI Vision model](/azure/ai-services/computer-vision/concept-image-retrieval).

+ Permissions to use the embedding model. If you're using Azure OpenAI, the caller must have [Cognitive Services OpenAI User](/azure/ai-services/openai/how-to/role-based-access-control#azure-openai-roles) permissions. Or, you can provide an API key.

+ [Visual Studio Code](https://code.visualstudio.com/download) with a [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to send the query and accept a response.

We recommend that you enable diagnostic logging on your search service to confirm vector query execution.

## Try a vectorizer with sample data

The [Import and vectorize data wizard](search-get-started-portal-import-vectors.md) reads files from Azure Blob storage, creates an index with chunked and vectorized fields, and adds a vectorizer. By design, the vectorizer that's created by the wizard is set to the same embedding model used to index the blob content.

1. [Upload sample data files](/azure/storage/blobs/storage-quickstart-blobs-portal) to a container on Azure Storage. We used some [small text files from NASA's earth book](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/nasa-e-book/earth-txt-10) to test these instructions on a free search service.
  
1. Run the [Import and vectorize data wizard](search-get-started-portal-import-vectors.md), choosing the blob container for the data source.

   :::image type="content" source="media/vector-search-how-to-configure-vectorizer/connect-to-data.png" lightbox="media/vector-search-how-to-configure-vectorizer/connect-to-data.png" alt-text="Screenshot of the connect to your data page.":::

1. Choose an existing deployment of **text-embedding-ada-002**. This model generates embeddings during indexing and is also used to configure the vectorizer used during queries.

   :::image type="content" source="media/vector-search-how-to-configure-vectorizer/vectorize-enrich-data.png" lightbox="media/vector-search-how-to-configure-vectorizer/vectorize-enrich-data.png" alt-text="Screenshot of the vectorize and enrich data page.":::

1. After the wizard is finished and all indexer processing is complete, you should have an index with a searchable vector field. The field's JSON definition looks like this:

   ```json
    {
        "name": "vector",
        "type": "Collection(Edm.Single)",
        "searchable": true,
        "retrievable": true,
        "dimensions": 1536,
        "vectorSearchProfile": "vector-nasa-ebook-text-profile"
    }
   ```

1. You should also have a vector profile and a vectorizer, similar to the following example:

   ```json
   "profiles": [
      {
        "name": "vector-nasa-ebook-text-profile",
        "algorithm": "vector-nasa-ebook-text-algorithm",
        "vectorizer": "vector-nasa-ebook-text-vectorizer"
      }
    ],
    "vectorizers": [
      {
        "name": "vector-nasa-ebook-text-vectorizer",
        "kind": "azureOpenAI",
        "azureOpenAIParameters": {
          "resourceUri": "https://my-fake-azure-openai-resource.openai.azure.com",
          "deploymentId": "text-embedding-ada-002",
          "modelName": "text-embedding-ada-002",
          "apiKey": "0000000000000000000000000000000000000",
          "authIdentity": null
        },
        "customWebApiParameters": null
      }
    ]
    ```

1. Skip ahead to [test your vectorizer](#test-a-vectorizer) for text-to-vector conversion during query execution.

## Define a vectorizer and vector profile

This section explains the modifications to an index schema for defining a vectorizer manually.

1. Use [Create or Update Index (preview)](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true) to add `vectorizers` to a search index.

1. Add the following JSON to your index definition. The vectorizers section provides connection information to a deployed embedding model. This step shows two vectorizer examples so that you can compare an Azure OpenAI embedding model and a custom web API side by side.

    ```json
      "vectorizers": [
        {
          "name": "my_azure_open_ai_vectorizer",
          "kind": "azureOpenAI",
          "azureOpenAIParameters": {
            "resourceUri": "https://url.openai.azure.com",
            "deploymentId": "text-embedding-ada-002",
            "modelName": "text-embedding-ada-002",
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

1. In the same index, add a vector profiles section that specifies one of your vectorizers. Vector profiles also require a [vector search algorithm](vector-search-ranking.md) used to create navigation structures.

    ```json
    "profiles": [ 
        { 
            "name": "my_vector_profile", 
            "algorithm": "my_hnsw_algorithm", 
            "vectorizer":"my_azure_open_ai_vectorizer" 
        }
    ]
    ```

1. Assign a vector profile to a vector field. The following example shows a fields collection with the required key field, a title string field, and two vector fields with a vector profile assignment.

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
                "name": "vector", 
                "type": "Collection(Edm.Single)", 
                "dimensions": 1536, 
                "vectorSearchProfile": "my_vector_profile", 
                "searchable": true, 
                "retrievable": true
            }, 
            { 
                "name": "my-second-vector", 
                "type": "Collection(Edm.Single)", 
                "dimensions": 1024, 
                "vectorSearchProfile": "my_vector_profile", 
                "searchable": true, 
                "retrievable": true
            }
    ]
    ```

## Test a vectorizer

Use a search client to send a query through a vectorizer. This example assumes Visual Studio Code with a REST client and a [sample index](#try-a-vectorizer-with-sample-data).

1. In Visual Studio Code, provide a search endpoint and [search query API key](search-security-api-keys.md#find-existing-keys):

   ```http
    @baseUrl: 
    @queryApiKey: 00000000000000000000000
   ```

1. Paste in a [vector query request](vector-search-how-to-query.md). Be sure to use a preview REST API version.

   ```http
    ### Run a query
    POST {{baseUrl}}/indexes/vector-nasa-ebook-txt/docs/search?api-version=2023-10-01-preview  HTTP/1.1
        Content-Type: application/json
        api-key: {{queryApiKey}}
    
        {
            "count": true,
            "select": "title,chunk",
            "vectorQueries": [
                {
                    "kind": "text",
                    "text": "what cloud formations exists in the troposphere",
                    "fields": "vector",
                    "k": 3,
                    "exhaustive": true
                }
            ]
        }
   ```

   Key points about the query include:

   + `"kind": "text"` tells the search engine that the input is a text string, and to use the vectorizer associated with the search field.

   + `"text": "what cloud formations exists in the troposphere"` is the text string to vectorize.

   + `"fields": "vector"` is the name of the field to query over. If you use the sample index produced by the wizard, the generated vector field is named `vector`.

1. Send the request. You should get three `k` results, where the first result is the most relevant.

Notice that there are no vectorizer properties to set at query time. The query reads the vectorizer properties, as per the vector profile field assignment in the index.

## Check logs

If you enabled diagnostic logging for your search service, run a Kusto query to confirm query execution on your vector field:

```kusto
OperationEvent
| where TIMESTAMP > ago(30m)
| where Name == "Query.Search" and AdditionalInfo["QueryMetadata"]["Vectors"] has "TextLength"
```

## Best practices

If you are setting up an Azure OpenAI vectorizer, consider the same [best practices](cognitive-search-skill-azure-openai-embedding.md#best-practices) that we recommend for the Azure OpenAI embedding skill.

## See also

+ [Integrated vectorization (preview)](vector-search-integrated-vectorization.md)
