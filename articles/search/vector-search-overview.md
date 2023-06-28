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

Currently in Azure Cognitive Search, "vector search" is indexing and information retrieval of vector fields in a search index. This article is a high-level introduction to the vector search feature. It also explains integration with other vector capabilities across Azure, and support for other vector data initiatives at Microsoft.

We recommend this article for background, but if you'd rather get started, follow these steps:

+ [Add vector fields to an index](vector-search-how-to-create-index.md) using Azure portal or the [**2023-07-10-Preview REST APIs**](/rest/api/searchservice/index-preview).
+ [Import vector data](search-what-is-data-import.md) using push or pull methodologies. Vectors must be generated in advance.
+ [Query vector data](vector-search-how-to-query.md) using Azure portal or the preview REST APIs.

## What's vector search in Cognitive Search?

In Cognitive Search, vector search identifies the most similar vectors in the vector space for a given query vector. Cognitive Search uses the HNSW algorithm to find the approximate nearest neighbors, and up to _k_ items are returned in results.

Queries in Cognitive Search are always scoped to a search index that's hosted on your search service, and that doesn't change with vector search. Vector space is composed of internal-only vector indexes consisting solely of the vector data that you load into it.

Support for vector search is in public preview and available through the [**2023-07-01-Preview REST APIs**](/rest/api/searchservice/index-preview). Support consists of a *vector field*, which your documents can provide embeddings for. When you issue a search request with a query vector, the service identifies similar vectors and returns the corresponding documents.

### How does vector search work in Azure Cognitive Search?

With standalone vector search, you first use a deep neural network (DNN), such as a large language model (LLM), to transform content into a vector representation within an embedding space. You can then provide these vectors in a document payload to the search index for indexing. To serve search requests, you use the same DNN from indexing to transform the search query into a vector representation, and vector search finds the most similar vectors and return the corresponding documents.

In Cognitive Search, you can index vector data as fields in documents alongside textual and other types of content. The data type for a vector field is `Collection(Edm.Single)`.

Vector queries can be issued standalone or in combination with other query types, including term queries and filters in the same search request.

### Limitations

Azure Cognitive Search doesn't currently provide vector embedding generation capabilities. You need to provide the embeddings yourself by using a service such as Azure OpenAI. See the document titled [How to generate embeddings](./vector-search-how-to-generate-embeddings.md) to learn more. Note the following details:

+ For document indexing, vectors must be created and inserted into the source documents. 
+ For queries, inputs from the user must be converted to a vector
+ Use the same embedding model for queries and indexes.
+ We recommend Azure OpenAI _text-ada-002_ and image retrieval REST API for vector generation.

### Availability and pricing

+ No extra charge for the feature. You're charged for just the search service itself.
+ Available in all tiers, in all regions.

> [!NOTE]
> Some older search services created before January 1, 2019 are deployed on infrastructure that doesn't support vector workloads. If you try to add a vector field to a schema and get an error, it's a result of outdated services. In this situation, you must create a new search service to try out the vector feature.

### What can you do with vectors in Cognitive Search?

Scenarios for vector search include the following items:

+ **Vector search for text**. You can encode text using embedding models such as OpenAI embeddings or open source models such as SBERT, and retrieve with queries that are also encoded as vectors to improve recall.

+ **Vector search across different data types**. You can encode images, text, audio, and video, or even a mix of them (for example, with models like CLIP) and do a similarity search across them.

+ **Multi-lingual search**: You can use multilingual embeddings models to represent your document in multiple languages in a single vector space to allow finding documents regardless of the language they are in.

+ **Filtered vector search**: You can use [filters](search-filters.md) with vector queries to select a specific category of indexed documents, or to implement document-level security, geospatial search, and more.

+ **Hybrid search**. For text data, you can combine the best of vector retrieval and keyword retrieval to obtain the best results. Use with semantic search (preview) for even more accuracy with L2 reranking using the same language models that power Bing.  

+ **Vector storage or vector database**. A common scenario is to vectorize all of your data into a vector database, and then when the application needs to find an item, you use a query vector to retrieve similar items. Because Cognitive Search can store vectors, you could use it purely as a vector store.

## Vector integration across Azure

+ Azure OpenAI provides embedding models. Demos and samples target the **text-embedding-ada-002** and other models. We recommend Azure OpenAI for generating embeddings for text.

+ [Image Retrieval REST API (Preview)](/rest/api/computervision/2023-02-01-preview/image-retrieval/vectorize-image) supports vectorization of image content. We recommend this API for image vector data in Azure Cognitive Search.

+ Several Azure data platforms now have vector search features in preview, including those listed as a supported data source for indexers. Unless it's mentioned otherwise, you should assume that the vector search previews in other Azure products are independent of Azure Cognitive Search. If you want to use the vector capabilities in Azure Cognitive Search with vector data from those data platforms, you can set up an indexer in your search service and pull in vector data using the same workflow as you would for nonvector content.

  Currently, just two indexer data sources have been tested and are confirmed to work: [Azure blob indexers](search-howto-indexing-azure-blob-storage.md) and [Azure Cosmos DB for NoSQL indexers](search-howto-index-cosmosdb.md). For more information, see [Add vector fields to a search index](vector-search-how-to-create-index.md)

## Other vector initiatives at Microsoft

+ [Semantic kernel](https://github.com/microsoft/semantic-kernel/blob/main/README.md)

## Next steps

+ [Try the quickstart](search-get-started-vector.md)
+ [Learn more about vector indexing](vector-search-how-to-create-index.md)
+ [Learn more about vector queries](vector-search-how-to-query.md)
