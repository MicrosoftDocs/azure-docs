---
title: Vector search
titleSuffix: Azure Cognitive Search
description: Describes concepts, scenarios, and availability of the vector search feature in Cognitive Search.

author: robertklee
ms.author: robertlee
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/10/2023
---

# Vector search within Azure Cognitive Search

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [alpha SDKs](https://github.com/Azure/cognitive-search-vector-pr#readme).

This article is a high-level introduction to vector search in Azure Cognitive Search. It also explains integration with other Azure services and covers the core concepts you should know for vector search development.

We recommend this article for background, but if you'd rather get started, follow these steps:

> [!div class="checklist"]
> + [Generate vector embeddings](vector-search-how-to-generate-embeddings.md) before you start.
> + [Add vector fields to an index](vector-search-how-to-create-index.md) using Azure portal or the [**2023-07-01-Preview REST APIs**](/rest/api/searchservice/index-preview).
> + [Load vector data](search-what-is-data-import.md) into an index using push or pull methodologies. 
> + [Query vector data](vector-search-how-to-query.md) using Azure portal or the preview REST APIs.

## What's vector search in Cognitive Search?

Vector search is a new capability for indexing, storing, and retrieving vector embeddings. You can use it to power similarity search, multi-modal search, recommendations engines, or applications implementing the [Retrieval Augmented Generation (RAG) architecture](https://arxiv.org/abs/2005.11401).

Support for vector search is in public preview and available through the [**2023-07-01-Preview REST APIs**](/rest/api/searchservice/index-preview). To use vector search, define a *vector field* in the index definition and index documents with vector data. Then you can issue search request with a query vector, returning documents with the requested `k` nearest neighbors (kNN) according to the selected vector similarity metric.

You can index vector data as fields in documents alongside textual and other types of content. Vector queries can be issued independently or in combination with other query types, including term queries (hybrid search) and filters in the same search request.

## Limitations

Azure Cognitive Search doesn't generate vector embeddings for your content. You need to provide the embeddings yourself by using a service such as Azure OpenAI. See [How to generate embeddings](./vector-search-how-to-generate-embeddings.md) to learn more.

## Availability and pricing

Vector search is available as part of all Cognitive Search tiers in all regions at no extra charge.

> [!NOTE]
> Some older search services created before January 1, 2019 are deployed on infrastructure that doesn't support vector workloads. If you try to add a vector field to a schema and get an error, it's a result of outdated services. In this situation, you must create a new search service to try out the vector feature.

## What scenarios can vector search support?

Scenarios for vector search include:

+ **Vector search for text**. Encode text using embedding models such as OpenAI embeddings or open source models such as SBERT, and retrieve documents with queries that are also encoded as vectors.

+ **Vector search across different data types (multi-modal)**. Encode images, text, audio, and video, or even a mix of them (for example, with models like CLIP) and do a similarity search across them.

+ **Multi-lingual search**. Use a multi-lingual embeddings model to represent your document in multiple languages in a single vector space to find documents regardless of the language they are in.

<!-- @Farzad, filterable is false on a vector field, so we need to explain what we mean here. I wonder if it goes with hybrid query? -->
+ **Filtered vector search**. Use [filters](search-filters.md) with vector queries to select a specific category of indexed documents, or to implement document-level security, geospatial search, and more.

+ **Hybrid search**. For text data, combine the best of vector retrieval and keyword retrieval to obtain the best results. Use with [semantic search (preview)](semantic-search-overview.md) for even more accuracy with L2 reranking using the same language models that power Bing.  

+ **Vector database**. Use Cognitive Search as a vector store to server as long-term memory or an external knowledge base for Large Language Models (LLMs), or other applications.

## Azure integration and related services

You can use other Azure services to provide embeddings and data storage.

+ Azure OpenAI provides embedding models. Demos and samples target the [text-embedding-ada-002](/azure/cognitive-services/openai/concepts/models#embeddings-models) and other models. We recommend Azure OpenAI for generating embeddings for text.

+ [Image Retrieval Vectorize Image API(Preview)](/azure/cognitive-services/computer-vision/how-to/image-retrieval#call-the-vectorize-image-api) supports vectorization of image content. We recommend this API for generating embeddings for images.

+ Azure Cognitive Search can automatically index vector data from two data sources: [Azure blob indexers](search-howto-indexing-azure-blob-storage.md) and [Azure Cosmos DB for NoSQL indexers](search-howto-index-cosmosdb.md). For more information, see [Add vector fields to a search index.](vector-search-how-to-create-index.md)

+ [LangChain](https://docs.langchain.com/docs/) is a framework for developing applications powered by language models. Use the [Azure Cognitive Search vector store integration](https://python.langchain.com/docs/modules/data_connection/vectorstores/integrations/azuresearch) to simplify the creation of applications using LLMs with Azure Cognitive Search as your vector datastore.

+ [Semantic kernel](https://github.com/microsoft/semantic-kernel/blob/main/README.md) is a lightweight SDK enabling integration of AI Large Language Models (LLMs) with conventional programming languages. It's useful for chunking large documents in a larger workflow that sends inputs to embedding models.

## Vector search concepts

If you're new to vectors, this section explains some core concepts.

### About vector search

Vector search is a method of information retrieval that aims to overcome the limitations of traditional keyword-based search. Rather than relying solely on lexical analysis and matching of individual query terms, vector search uses machine learning models to capture the meaning of words and phrases in context. This is done by representing documents and queries as vectors in a high-dimensional space, called an embedding. By capturing the intent of the query with the embedding, vector search can return more relevant results that match the user's needs, even if the exact terms aren't present in the document. Additionally, vector search can be applied to different types of content, such as images and videos, not just text. This enables new search experiences such as multi-modal search or cross-language search.

### Embeddings and vectorization

*Embeddings* are a specific type of vector representation created by machine learning models that capture the semantic meaning of text, or representations of other content such as images. Natural language machine learning models are trained on large amounts of data to identify patterns and relationships between words. During training, they learn to represent any input as a vector of real numbers in an intermediary step called the *encoder*. After training is complete, these language models can be modified so the intermediary vector representation becomes the model's output. The resulting embeddings are high-dimensional vectors, where words with similar meanings are closer together in the vector space, as explained in [this Azure OpenAI Service article](/azure/cognitive-services/openai/concepts/understand-embeddings). 

The effectiveness of vector search in retrieving relevant information depends on the effectiveness of the embedding model in distilling the meaning of documents and queries into the resulting vector. The best models are well-trained on the types of data they're representing. You can evaluate existing models such as Azure OpenAI text-embedding-ada-002, bring your own model that's trained directly on the problem space, or fine-tune a general-purpose model. Azure Cognitive Search doesn't impose constraints on which model you choose, so pick the best one for your data. 

In order to create effective embeddings for vector search, it's important to take input size limitations into account. Therefore, we recommend following the [guidelines for chunking data](vector-search-how-to-chunk-documents.md) before generating embeddings. This best practice ensures that the embeddings accurately capture the relevant information and enable more efficient vector search.

### What is the embedding space?

*Embedding space* is the corpus for vector search. Machine learning models create the embedding space by mapping individual words, phrases, or documents (for natural language processing), images, or other forms of data into a representation comprised of a vector of real numbers representing a coordinate in a high-dimensional space. In this embedding space, similar items are located close together, and dissimilar items are located farther apart. 

For example, documents that talk about different species of dogs would be clustered close together in the embedding space. Documents about cats would be close together, but farther from the dogs cluster while still being in the neighborhood for animals. Dissimilar concepts such as cloud computing would be much farther away. In practice, these embedding spaces are abstract and don't have well-defined, human-interpretable meanings, but the core idea stays the same.

Popular vector similarity metrics include the following, which are all supported by Azure Cognitive Search. 

+ `euclidean` (also known as `L2 norm`): This measures the length of the vector difference between two vectors.
+ `cosine`: This measures the angle between two vectors, and is not affected by differing vector lengths.
+ `dotProduct`: This measures both the length of each of the pair of two vectors, and the angle between them. For normalized vectors, this is identical to `cosine` similarity, but slightly more performant.

### Approximate Nearest Neighbors

Approximate Nearest Neighbor search (ANN) is a class of algorithms for finding matches in vector space. This class of algorithms employs different data structures or data partitioning methods to significantly reduce the search space to accelerate query processing. The specific approach depends on the algorithm. While this approach sacrifices some accuracy, these algorithms offer scalable and faster retrieval of approximate nearest neighbors, which makes them ideal for balancing accuracy and efficiency in modern information retrieval applications. You may adjust the parameters of your algorithm to fine-tune the recall, latency, memory, and disk footprint requirements of your search application.

Azure Cognitive Search uses Hierarchical Navigable Small Worlds (HNSW), which is a leading ANN algorithm optimized for high-recall, low-latency applications where data distribution is unknown or can change frequently.

> [!NOTE]
> Finding the true set of [_k_ nearest neighbors](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm) requires comparing the input vector exhaustively against all vectors in the dataset. While each vector similarity calculation is relatively fast, performing these exhaustive comparisons across large datasets is computationally expensive and slow due to the sheer number of comparisons. For example, if a dataset contains 10 million 1,000-dimensional vectors, computing the distance between the query vector and all vectors in the dataset would require scanning 37 GB of data (assuming single-precision floating point vectors) and a high number of similarity calculations.
> 
> To address this challenge, approximate nearest neighbor (ANN) search methods are used to trade off recall for speed. These methods can efficiently find a small set of candidate vectors that are similar to the query vector and have high likelihood to be in the globally most similar neighbors. Each algorithm has a different approach to reducing the total number of vectors comparisons, but they all share the ability to balance accuracy and efficiency by tweaking the algorithm configuration parameters.

## Next steps

+ [Try the quickstart](search-get-started-vector.md)
+ [Learn more about vector indexing](vector-search-how-to-create-index.md)
+ [Learn more about vector queries](vector-search-how-to-query.md)

