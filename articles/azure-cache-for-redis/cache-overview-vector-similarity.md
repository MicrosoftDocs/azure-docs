---
title: About Vector Embeddings and Vector Search in Azure Cache for Redis
description: Learn about Azure Cache for Redis to store vector embeddings and provide similarity search.
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: overview
ms.date: 09/18/2023
---

# About Vector Embeddings and Vector Search in Azure Cache for Redis

Vector similarity search (VSS) has become a popular use-case for AI-driven applications. Azure Cache for Redis can be used to store vector embeddings and compare them through vector similarity search. This article is a high-level introduction to the concept of vector embeddings, vector comparison, and how Redis can be used as a seamless part of a vector similarity workflow.

For a tutorial on how to use Azure Cache for Redis and Azure OpenAI to perform vector similarity search, see [Tutorial: Conduct  vector similarity search on Azure OpenAI embeddings using Azure Cache for Redis](./cache-tutorial-vector-similarity.md)

## Scope of Availability

|Tier      | Basic / Standard  | Premium  |Enterprise | Enterprise Flash  |
|--------- |:------------------:|:----------:|:---------:|:---------:|
|Available | No          | No       |  Yes  | Yes (preview) |

Vector search capabilities in Redis require [Redis Stack](https://redis.io/docs/about/about-stack/), specifically the [RediSearch](https://redis.io/docs/interact/search-and-query/) module. This capability is only available in the [Enterprise tiers of Azure Cache for Redis](./cache-redis-modules.md).

## What are vector embeddings?

### Concept

Vector embeddings are a fundamental concept in machine learning and natural language processing that enable the representation of data, such as words, documents, or images as numerical vectors in a high-dimension vector space. The primary idea behind vector embeddings is to capture the underlying relationships and semantics of the data by mapping them to points in this vector space. In simpler terms, that means converting your text or images into a sequence of numbers that represents the data, and then comparing the different number sequences. This allows complex data to be manipulated and analyzed mathematically, making it easier to perform tasks like similarity comparison, recommendation, and classification.

<!-- TODO - Add image example -->

Each machine learning model classifies data and produces the vector in a different manner. Furthermore, it's typically not possible to determine exactly what semantic meaning each vector dimension represents. But because the model is consistent between each block of input data, similar words, documents, or images have vectors that are also similar. For example, the words `basketball` and `baseball` have embeddings vectors much closer to each other than a word like `rainforest`.

### Vector comparison

Vectors can be compared using various metrics. The most popular way to compare vectors is to use [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity), which measures the cosine of the angle between two vectors in a multi-dimensional space. The closer the vectors, the smaller the angle. Other common distance metrics include [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) and [inner product](https://en.wikipedia.org/wiki/Inner_product_space).

### Generating embeddings

Many machine learning models support embeddings APIs. For an example of how to create vector embeddings using Azure OpenAI Service, see [Learn how to generate embeddings with Azure OpenAI](../ai-services/openai/how-to/embeddings.md).

## What is a vector database?

A vector database is a database that can store, manage, retrieve, and compare vectors. Vector databases must be able to efficiently store a high-dimensional vector and retrieve it with minimal latency and high throughput. Non-relational datastores are most commonly used as vector databases, although it's possible to use relational databases like PostgreSQL, for example, with the [pgvector](https://github.com/pgvector/pgvector) extension.

### Index method

Vector databases need to index data for fast search and retrieval. There are several common indexing methods, including:

- **K-Nearest Neighbors (KNN)** - an exhaustive method that provides the most precision but with higher computational cost.
- **Approximate Nearest Neighbors (ANN)** - a more efficient by trading precision for greater speed and lower processing overhead.

### Search capabilities

Finally, vector databases execute vector searches by using the chosen vector comparison method to return the most similar vectors. Some vector databases can also perform _hybrid_ searches by first narrowing results based on characteristics or metadata also stored in the database before conducting the vector search. This is a way to make the vector search more effective and customizable. For example, a vector search could be limited to only vectors with a specific tag in the database, or vectors with geolocation data in a certain region.

## Vector search key scenarios

Vector similarity search can be used in multiple applications. Some common use-cases include:

- **Semantic Q&A**. Create a chatbot that can respond to questions about your own data. For instance, a chatbot that can respond to employee questions on their healthcare coverage. Hundreds of pages of dense healthcare coverage documentation can be split into chunks, converted into embeddings vectors, and searched based on vector similarity. The resulting documents can then be summarized for employees using another large language model (LLM). [Semantic Q&A Example](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/vector-similarity-search-with-azure-cache-for-redis-enterprise/ba-p/3822059)
- **Document Retrieval**. Use the deeper semantic understanding of text provided by LLMs to provide a richer document search experience where traditional keyword-based search falls short. [Document Retrieval Example](https://github.com/RedisVentures/redis-arXiv-search)
- **Product Recommendation**. Find similar products or services to recommend based on past user activities, like search history or previous purchases. [Product Recommendation Example](https://github.com/RedisVentures/LLM-Recommender)
- **Visual Search**. Search for products that look similar to a picture taken by a user or a picture of another product. [Visual Search Example](https://github.com/RedisVentures/redis-product-search)
- **Semantic Caching**. Reduce the cost and latency of LLMs by caching LLM completions. LLM queries are compared using vector similarity. If a new query is similar enough to a previously cached query, the cached query is returned. [Semantic Caching example using LangChain](https://python.langchain.com/docs/integrations/llms/llm_caching#redis-cache)
- **LLM Conversation Memory**. Persist conversation history with an LLM as embeddings in a vector database. Your application can use vector search to pull relevant history or "memories" into the response from the LLM. [LLM Conversation Memory example](https://github.com/continuum-llms/chatgpt-memory)

## Why choose Azure Cache for Redis for storing and searching vectors?

Azure Cache for Redis can be used effectively as a vector database to store embeddings vectors and to perform vector similarity searches. In many ways, Redis is naturally a great choice in this area. It's extremely fast because it runs in-memory, unlike other vector databases that run on-disk. This can be useful when processing large datasets! Redis is also battle-hardened. Support for vector storage and search has been available for years, and many key machine learning frameworks like [LangChain](https://python.langchain.com/docs/integrations/vectorstores/redis) and [LlamaIndex](https://gpt-index.readthedocs.io/en/latest/examples/vector_stores/RedisIndexDemo.html) feature rich integrations with Redis. For example, the Redis LangChain integration [automatically generates an index schema for metadata](https://python.langchain.com/docs/integrations/vectorstores/redis#inspecting-the-created-index) passed in when using Redis as a vector store. This makes it much easier to filter results based on metadata.

Redis has a wide range of vector search capabilities through the [RediSearch module](cache-redis-modules.md#redisearch), which is available in the Enterprise tier of Azure Cache for Redis. These include:

- Multiple distance metrics, including `Euclidean`, `Cosine`, and `Internal Product`.
- Support for both KNN (using `FLAT`) and ANN (using `HNSW`) indexing methods.
- Vector storage in hash or JSON data structures
- Top K queries
- [Vector range queries](https://redis.io/docs/interact/search-and-query/search/vectors/#creating-a-vss-range-query) (i.e., find all items within a specific vector distance)
- Hybrid search with [powerful query features](https://redis.io/docs/interact/search-and-query/) such as:
  - Geospatial filtering
  - Numeric and text filters
  - Prefix and fuzzy matching
  - Phonetic matching
  - Boolean queries

Additionally, Redis is often an economical choice because it's already so commonly used for caching or session store applications. In these scenarios, it can pull double-duty by serving a typical caching role while simultaneously handling vector search applications.

## What are my other options for storing and searching for vectors?

There are multiple other solutions on Azure for vector storage and search. These include:

- [Azure AI Search](../search/vector-search-overview.md)
- [Azure Cosmos DB](../cosmos-db/mongodb/vcore/vector-search.md) using the MongoDB vCore API
- [Azure Database for PostgreSQL - Flexible Server](../postgresql/flexible-server/how-to-use-pgvector.md) using `pgvector`

## Next Steps

The best way to get started with embeddings and vector search is to try it yourself!

> [!div class="nextstepaction"]
> [Tutorial: Conduct vector similarity search on Azure OpenAI embeddings using Azure Cache for Redis](./cache-tutorial-vector-similarity.md)
