---
title: Vector store database
titleSuffix: Azure AI Search
description: Describes concepts behind vector storage in Azure AI Search.

author: robertklee
ms.author: robertlee
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 01/29/2024
---

# Vector storage in Azure AI Search

Azure AI Search provides vector storage and configurations for [vector search](vector-search-overview.md) and [hybrid queries](hybrid-search-overview.md). Support is implemented at the field level, which means you can combine vector and nonvector fields in the same search corpus.

Vectors are stored in a search index. Use the [Create Index REST API](/rest/api/searchservice/indexes/create-or-update) or an equivalent Azure SDK method to create the vector store.

## Retrieval patterns

In Azure AI Search, there are two patterns for working with the search engine's response. Your index schema should reflect your primary use case.

+ Send the search results directly to the client app. In a direct response from the search engine, results are returned in a flattened row set, and you can choose which fields are included. It's expected that you would populate the vector store (search index) with nonvector content that's human readable so that you don't have to decode vectors for your response. The search engine matches on vectors, but returns nonvector values from the same search document.

+ Send the search results to a chat model and an orchestration layer that coordinates prompts and maintains chat history for a conversational approach.

In a chat solution, results are fed into prompt flows and chat models like GPT and Text-Davinci use the search results, with or without their own training data, as grounding data for formulating the response. This is approach is based on [**Retrieval augmented generation (RAG)**](retrieval-augmented-generation-overview.md) architecture.

## Basic schema for vectors

An index schema for a vector store requires a name, a key field, one or more vector fields, and a vector configuration. Content fields are recommended for hybrid queries, or for returning human readable content that doesn't have to be decoded first. For more information about configuring a vector index, see [Create a vector store](vector-search-how-to-create-index.md).

```json
{
  "name": "example-index",
  "fields": [
    { "name": "id", "type": "Edm.String", "searchable": false, "filterable": true, "retrievable": true, "key": true },
    { "name": "content", "type": "Edm.String", "searchable": true, "retrievable": true, "analyzer": null },
    { "name": "content_vector", "type": "Collection(Edm.Single)", "searchable": true, "filterable": false, "retrievable": true,
      "dimensions": 1536, "vectorSearchProfile": null },
    { "name": "metadata", "type": "Edm.String", "searchable": true, "filterable": false, "retrievable": true, "sortable": false, "facetable": false }
  ],
  "vectorSearch": {
    "algorithms": [
      {
        "name": "default",
        "kind": "hnsw",
        "hnswParameters": {
          "metric": "cosine",
          "m": 4,
          "efConstruction": 400,
          "efSearch": 500
        },
        "exhaustiveKnnParameters": null
      }
    ],
    "profiles": [],
    "vectorizers": []
  }
}
```

The vector search algorithms specify the navigation structures used at query time. The structures are created during indexing, but used during queries.

The content of your vector fields is determined by the [embedding step](vector-search-how-to-generate-embeddings.md) that vectorizes or encodes your content. If you use the same embedding model for all of your fields, you can [build vector queries](vector-search-how-to-query.md) that cover all of them. 

If you use search results as grounding data, where a chat model generates the answer to a query, design a schema that stores chunks of text. Data chunking is a requirement if source files are too large for the embedding model, but it's also efficient for chat if the original source files contain a varied information. 


## Next steps

+ [Try the quickstart](search-get-started-vector.md)
+ [Learn more about vector stores](vector-search-how-to-create-index.md)
+ [Learn more about vector queries](vector-search-how-to-query.md)
+ [Azure Cognitive Search and LangChain: A Seamless Integration for Enhanced Vector Search Capabilities](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-and-langchain-a-seamless-integration-for/ba-p/3901448)
