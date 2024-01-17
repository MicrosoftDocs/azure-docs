---
title: Vector search
titleSuffix: Azure AI Search
description: Describes concepts, scenarios, and availability of the vector search feature in Azure AI Search.

author: robertklee
ms.author: robertlee
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 12/05/2023
---

# Vector search in Azure AI Search

Vector search is an approach in information retrieval that uses numeric representations of content for search scenarios. Because the content is numeric rather than plain text, the search engine matches on vectors that are the most similar to the query, with no requirement for matching on exact terms.

This article is a high-level introduction to vector support in Azure AI Search. It also explains integration with other Azure services and covers [terminology and concepts](#vector-search-concepts) related to vector search development.

We recommend this article for background, but if you'd rather get started, follow these steps:

> [!div class="checklist"]
> + [Generate vector embeddings](vector-search-how-to-generate-embeddings.md) before you start, or try out [integrated vectorization (preview)](vector-search-integrated-vectorization.md).
> + [Add vector fields to an index](vector-search-how-to-create-index.md).
> + [Load vector data](search-what-is-data-import.md) into an index using push or pull methodologies. 
> + [Query vector data](vector-search-how-to-query.md) using the Azure portal, REST APIs, or Azure SDK packages.

You could also begin with the [vector quickstart](search-get-started-vector.md) or the [code samples on GitHub](https://github.com/Azure/cognitive-search-vector-pr). 

Vector search is in the Azure portal and the Azure SDKs for [.NET](https://www.nuget.org/packages/Azure.Search.Documents), [Python](https://pypi.org/project/azure-search-documents), and [JavaScript](https://www.npmjs.com/package/@azure/search-documents/v/12.0.0-beta.2).

## What's vector search in Azure AI Search?

Vector search is a new capability for indexing, storing, and retrieving vector embeddings from a search index. You can use it to power similarity search, multi-modal search, recommendations engines, or applications implementing the [Retrieval Augmented Generation (RAG) architecture](https://aka.ms/what-is-rag).

The following diagram shows the indexing and query workflows for vector search.

:::image type="content" source="media/vector-search-overview/vector-search-architecture-diagram-3.svg" alt-text="Architecture of vector search workflow." border="false" lightbox="media/vector-search-overview/vector-search-architecture-diagram-3-high-res.png":::

On the indexing side, Azure AI Search takes vector embeddings and uses a [nearest neighbors algorithm](vector-search-ranking.md) to co-locate similar vectors together in the search index (vectors about popular movies are closer than vectors about popular dog breeds). 

How you get embeddings from your source content depends on your approach and whether you can use preview features. You can vectorize or generate embeddings using models from OpenAI, Azure OpenAI, and any number of providers, over a wide range of source content including text, images, and other content types supported by the models. You can then push pre-vectorized content to [vector fields](vector-search-how-to-create-index.md) in a search index. That's the generally available approach. If you can use preview features, Azure AI Search provides [integrated data chunking and vectorization](vector-search-integrated-vectorization.md) in an indexer pipeline. You still provide the resources (endpoints and connection information), but Azure AI Search makes all of the calls and handles the transitions.

On the query side, in your client application, collect the query input from a user. You can then add an encoding step that converts the input into a vector, and then send the vector query to your index on Azure AI Search for a similarity search. As with indexing, you can deploy the [integrated vectorization (preview)](vector-search-integrated-vectorization.md) to convert text inputs to a vector. For either approach, Azure AI Search returns documents with the requested `k` nearest neighbors (kNN) in the results.

Azure AI Search supports [hybrid scenarios](hybrid-search-overview.md). You can index vector data as fields in documents alongside alphanumeric content. Vector queries can be issued singly or in combination with filters and other query types, including term queries and semantic ranking in the same search request.

## Availability and pricing

Vector search is available as part of all Azure AI Search tiers in all regions at no extra charge.

Newer services created after July 1, 2023 support [higher quotas for vector indexes](vector-search-index-size.md).

> [!NOTE]
> Some older search services created before January 1, 2019 are deployed on infrastructure that doesn't support vector workloads. If you try to add a vector field to a schema and get an error, it's a result of outdated services. In this situation, you must create a new search service to try out the vector feature.

## What scenarios can vector search support?

Scenarios for vector search include:

+ **Vector search for text**. Encode text using embedding models such as OpenAI embeddings or open source models such as SBERT, and retrieve documents with queries that are also encoded as vectors.

+ **Vector search across different content types (multimodal)**. Encode images and text using multimodal embeddings (for example, with [OpenAI CLIP](https://github.com/openai/CLIP) or [GPT-4 Turbo with Vision](/azure/ai-services/openai/whats-new#gpt-4-turbo-with-vision-now-available) in Azure OpenAI) and query an embedding space composed of vectors from both content types.

+ **Multilingual search**. Use a multilingual embeddings model to represent your document in multiple languages in a single vector space to find documents regardless of the language they are in.

+ [**Hybrid search**](hybrid-search-overview.md). Vector search is implemented at the field level, which means you can build queries that include both vector fields and searchable text fields. The queries execute in parallel and the results are merged into a single response. Optionally, add [semantic ranking](semantic-search-overview.md) for even more accuracy with L2 reranking using the same language models that power Bing.

+ **Filtered vector search**. A query request can include a vector query and a [filter expression](search-filters.md). Filters apply to text and numeric fields, and are useful for metadata filters, and including or excluding search documents based on filter criteria. Although a vector field isn't filterable itself, you can set up a filterable text or numeric field. The search engine can process the filter before or after the vector query executes.

+ **Vector database**. Use Azure AI Search as a vector store to serve as long-term memory or an external knowledge base for Large Language Models (LLMs), or other applications. For example, you can use Azure AI Search as a [*vector index* in an Azure Machine Learning prompt flow](/azure/machine-learning/concept-vector-stores) for Retrieval Augmented Generation (RAG) applications. 

## Azure integration and related services

You can use other Azure services to provide embeddings and data storage.

+ Azure OpenAI provides embedding models. Demos and samples target the [text-embedding-ada-002](/azure/ai-services/openai/concepts/models#embeddings-models) and other models. We recommend Azure OpenAI for generating embeddings for text.

+ [Image Retrieval Vectorize Image API(Preview)](/azure/ai-services/computer-vision/how-to/image-retrieval#call-the-vectorize-image-api) supports vectorization of image content. We recommend this API for generating embeddings for images.

+ Azure AI Search can automatically index vector data from two data sources: [Azure blob indexers](search-howto-indexing-azure-blob-storage.md) and [Azure Cosmos DB for NoSQL indexers](search-howto-index-cosmosdb.md). For more information, see [Add vector fields to a search index.](vector-search-how-to-create-index.md)

+ [LangChain](https://docs.langchain.com/docs/) is a framework for developing applications powered by language models. Use the [Azure AI Search vector store integration](https://python.langchain.com/docs/modules/data_connection/vectorstores/integrations/azuresearch) to simplify the creation of applications using LLMs with Azure AI Search as your vector datastore.

+ [Semantic kernel](https://github.com/microsoft/semantic-kernel/blob/main/README.md) is a lightweight SDK enabling integration of AI Large Language Models (LLMs) with conventional programming languages. It's useful for chunking large documents in a larger workflow that sends inputs to embedding models.

## Vector search concepts

If you're new to vectors, this section explains some core concepts.

### About vector search

Vector search is a method of information retrieval where documents and queries are represented as vectors instead of plain text. In vector search, machine learning models generate the vector representations of source inputs, which can be text, images, or other content. Having a mathematic representation of content provides a common basis for search scenarios. If everything is a vector, a query can find a match in vector space, even if the associated original content is in different media or language than the query.

### Why use vector search

When searchable content is represented as vectors, a query can find close matches in similar content. The embedding model used for vector generation knows which words and concepts are similar, and it places the resulting vectors close together in the embedding space. For example, vectorized source documents about "clouds" and "fog" are more likely to show up in a query about "mist" because they're semantically similar, even if they aren't a lexical match.

### Embeddings and vectorization

*Embeddings* are a specific type of vector representation of content or a query, created by machine learning models that capture the semantic meaning of text or representations of other content such as images. Natural language machine learning models are trained on large amounts of data to identify patterns and relationships between words. During training, they learn to represent any input as a vector of real numbers in an intermediary step called the *encoder*. After training is complete, these language models can be modified so the intermediary vector representation becomes the model's output. The resulting embeddings are high-dimensional vectors, where words with similar meanings are closer together in the vector space, as explained in [Understand embeddings (Azure OpenAI)](/azure/ai-services/openai/concepts/understand-embeddings). 

The effectiveness of vector search in retrieving relevant information depends on the effectiveness of the embedding model in distilling the meaning of documents and queries into the resulting vector. The best models are well-trained on the types of data they're representing. You can evaluate existing models such as Azure OpenAI text-embedding-ada-002, bring your own model that's trained directly on the problem space, or fine-tune a general-purpose model. Azure AI Search doesn't impose constraints on which model you choose, so pick the best one for your data. 

In order to create effective embeddings for vector search, it's important to take input size limitations into account. We recommend following the [guidelines for chunking data](vector-search-how-to-chunk-documents.md) before generating embeddings. This best practice ensures that the embeddings accurately capture the relevant information and enable more efficient vector search.

### What is the embedding space?

*Embedding space* is the corpus for vector queries. Within a search index, it's all of the vector fields populated with embeddings from the same embedding model. Machine learning models create the embedding space by mapping individual words, phrases, or documents (for natural language processing), images, or other forms of data into a representation comprised of a vector of real numbers representing a coordinate in a high-dimensional space. In this embedding space, similar items are located close together, and dissimilar items are located farther apart. 

For example, documents that talk about different species of dogs would be clustered close together in the embedding space. Documents about cats would be close together, but farther from the dogs cluster while still being in the neighborhood for animals. Dissimilar concepts such as cloud computing would be much farther away. In practice, these embedding spaces are abstract and don't have well-defined, human-interpretable meanings, but the core idea stays the same.

<a name="eknn"></a>

### Nearest neighbors search

In vector search, the search engine searches through the vectors within the embedding space to identify those that are near to the query vector. This technique is called *nearest neighbor search*. Nearest neighbors help quantify the similarity between items. A high degree of vector similarity indicates that the original data was similar too. To facilitate fast nearest neighbor search, the search engine will perform optimizations or employ data structures or data partitioning to reduce the search space. Each vector search algorithm will have different approaches to this problem, trading off different characteristics such as latency, throughput, recall, and memory. To compute similarity, similarity metrics provide the mechanism for computing this distance.

Azure AI Search currently supports the following algorithms:

+ Hierarchical Navigable Small World (HNSW): HNSW is a leading ANN algorithm optimized for high-recall, low-latency applications where data distribution is unknown or can change frequently. It organizes high-dimensional data points into a hierarchical graph structure that enables fast and scalable similarity search while allowing a tunable a trade-off between search accuracy and computational cost. Because the algorithm requires all data points to reside in memory for fast random access, this algorithm consumes [vector index size](vector-search-index-size.md) quota.

+ Exhaustive K-nearest neighbors (KNN): Calculates the distances between the query vector and all data points. It's computationally intensive, so it works best for smaller datasets. Because the algorithm doesn't require fast random access of data points, this algorithm doesn't consume vector index size quota. However, this algorithm will provide the global set of nearest neighbors.

Within an index definition, you can specify one or more algorithms, and then for each vector field specify which algorithm to use:

+ [Create a vector index](vector-search-how-to-create-index.md) to specify an algorithm in the index and on fields.

+ For exhaustive KNN, use [2023-11-01](/rest/api/searchservice/indexes/create-or-update), [2023-10-01-Preview](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true), or Azure SDK beta libraries that target either REST API version.

Algorithm parameters that are used to initialize the index during index creation are immutable and can't be changed after the index is built. However, parameters that affect the query-time characteristics (`efSearch`) can be modified. 

In addition, fields that specify HNSW algorithm also support exhaustive KNN search using the [query request](vector-search-how-to-query.md) parameter `"exhaustive": true`. The opposite isn't true however. If a field is indexed for `exhaustiveKnn`, you can't use HNSW in the query because the additional data structures that enable efficient search don’t exist.

### Approximate Nearest Neighbors

Approximate Nearest Neighbor search (ANN) is a class of algorithms for finding matches in vector space. This class of algorithms employs different data structures or data partitioning methods to significantly reduce the search space to accelerate query processing. 

ANN algorithms sacrifice some accuracy, but offer scalable and faster retrieval of approximate nearest neighbors, which makes them ideal for balancing accuracy against efficiency in modern information retrieval applications. You can adjust the parameters of your algorithm to fine-tune the recall, latency, memory, and disk footprint requirements of your search application.

Azure AI Search uses HNSW for its ANN algorithm. 

<!-- > [!NOTE]
> Finding the true set of [_k_ nearest neighbors](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm) requires comparing the input vector exhaustively against all vectors in the dataset. While each vector similarity calculation is relatively fast, performing these exhaustive comparisons across large datasets is computationally expensive and slow due to the sheer number of comparisons. For example, if a dataset contains 10 million 1,000-dimensional vectors, computing the distance between the query vector and all vectors in the dataset would require scanning 37 GB of data (assuming single-precision floating point vectors) and a high number of similarity calculations.
> 
> To address this challenge, approximate nearest neighbor (ANN) search methods are used to trade off recall for speed. These methods can efficiently find a small set of candidate vectors that are similar to the query vector and have high likelihood to be in the globally most similar neighbors. Each algorithm has a different approach to reducing the total number of vectors comparisons, but they all share the ability to balance accuracy and efficiency by tweaking the algorithm configuration parameters. -->

## Next steps

+ [Try the quickstart](search-get-started-vector.md)
+ [Learn more about vector indexing](vector-search-how-to-create-index.md)
+ [Learn more about vector queries](vector-search-how-to-query.md)
+ [Azure Cognitive Search and LangChain: A Seamless Integration for Enhanced Vector Search Capabilities](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-and-langchain-a-seamless-integration-for/ba-p/3901448)
