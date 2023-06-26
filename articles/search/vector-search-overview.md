---
title: Vector search
titleSuffix: Azure Cognitive Search
description: Describes concepts, scenarios, and availability of the vector search feature in Cognitive Search.

author: yahnoosh
ms.author: jlembicz
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/29/2023
---

# Vector search within Azure Cognitive Search

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [alpha SDKs](https://github.com/Azure/cognitive-search-vector-pr#readme).

## What can you do with vectors in Cognitive Search?

Scenarios for vector search include the following items:

+ **Vector search for text**. You can encode text using embedding models such as OpenAI embeddings or open source models such as SBERT, and retrieve with queries that are also encoded as vectors to improve recall.

+ **Vector search across different data types**. You can encode images, text, audio, and video, or even a mix of them (for example, with models like CLIP) and do a similarity search across them.

+ **Multi-lingual search**: You can use multilingual embeddings models to represent your document in multiple languages in a single vector space to allow finding documents regardless of the language they are in.

+ **Filtered vector search**: You can use [filters](search-filters.md) with vector queries to select a specific category of indexed documents, or to implement document-level security, geospatial search, and more.

+ **Hybrid search**. For text data, you can combine the best of vector retrieval and keyword retrieval to obtain the best results. Use with semantic search (preview) for even more accuracy with L2 reranking using the same language models that power Bing.  

+ **Vector storage or vector database**. A common scenario is to vectorize all of your data into a vector database, and then when the application needs to find an item, you use a query vector to retrieve similar items. Because Cognitive Search can store vectors, you could use it purely as a vector store.

## Next steps

+ [Try the quickstart](search-get-started-vector.md)
+ [Learn more about vector indexing](vector-search-how-to-create-index.md)
+ [Learn more about vector queries](vector-search-how-to-query.md)
