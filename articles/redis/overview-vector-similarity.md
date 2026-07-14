---
title: About Vector Embeddings and Vector Search in Azure Managed Redis
description: Learn how Azure Managed Redis stores vector embeddings and supports vector similarity search for AI applications.
ms.date: 06/22/2026
ms.update-cycle: 180-days
ms.topic: overview
ms.collection:
  - ce-skilling-ai-copilot
ms.custom:
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Managed Redis
---

# What are vector embeddings and vector search in Azure Managed Redis?

Vector similarity search (VSS) is a common capability in AI-powered intelligent applications. You can use Azure Managed Redis as a low-latency vector database when you combine it with embedding models, such as [Azure OpenAI](/azure/ai-services/openai/overview), for Retrieval-Augmented Generation (RAG), semantic caching, recommendation, search, and other AI scenarios.

This article introduces vector embeddings, vector similarity search, and how Azure Managed Redis can store and search vectors by using the RediSearch module.

For tutorials and sample applications that use Azure Managed Redis with Azure OpenAI, see the following resources:

- [Tutorial: Conduct vector similarity with OpenAI embeddings using Azure Managed Redis using LangChain](tutorial-vector-similarity.md)

## Scope of availability

Vector search capabilities in Redis require [Redis Stack](https://redis.io/docs/latest/operate/oss_and_stack/stack-with-enterprise/), specifically the [RediSearch](https://redis.io/docs/latest/operate/oss_and_stack/stack-with-enterprise/search/) module. In Azure Managed Redis, RediSearch is available as a managed module that you must enable when you create the cache.

The following table shows RediSearch availability for Azure Managed Redis tiers.

| Azure Managed Redis tier | RediSearch support |
|---|---|
| Memory Optimized | Yes |
| Balanced | Yes |
| Compute Optimized | Yes |
| Flash Optimized | No |

> [!IMPORTANT]
> You can't add modules to an Azure Managed Redis instance after it's created. If you plan to use vector search, enable the RediSearch module during provisioning.

## Plan an Azure Managed Redis instance for vector search

Before you create an Azure Managed Redis instance for vector search, plan the cache configuration and data model. You must choose some options, including modules and clustering policy, during provisioning.

For vector search workloads:

- Enable the **RediSearch** module when you create the Azure Managed Redis instance.
- Use the **Enterprise** clustering policy. RediSearch requires Enterprise clustering policy.
- Use the `NoEviction` eviction policy when RediSearch is enabled.
- Choose a supported in-memory tier: **Memory Optimized**, **Balanced**, or **Compute Optimized**.
- Size the cache for both vector data and index overhead.
- Store metadata with vectors, such as document ID, title, source URL, category, timestamp, tenant ID, or access-control fields, so queries can filter results and return source information.
- Use TLS for client connections and consider Microsoft Entra authentication where supported by your client.
- For production workloads, consider Private Link, high availability, and diagnostics.

Azure Managed Redis manages the available module versions for the service. You can't manually load modules or manually update module versions.

For more information, see [Use Redis modules with Azure Managed Redis](redis-modules.md), [Azure Managed Redis architecture](architecture.md), and [Quickstart: Create an Azure Managed Redis instance](quickstart-create-managed-redis.md).

## What are vector embeddings?

Vector embeddings are numerical representations of data, such as words, documents, images, or products, in a high-dimensional vector space. Embeddings capture semantic relationships in a way that allows applications to compare data mathematically.

For example, the words `basketball` and `baseball` typically have embeddings that are closer to each other than either word is to `rainforest`, because the model places semantically related concepts near each other in vector space.

Different machine learning models generate embeddings differently. For best results, use one embedding model consistently for a given vector index. The index schema, vector dimensions, and distance metric should match the embedding model used to generate the vectors.

### Vector comparison

You can compare vectors using distance or similarity metrics. Common metrics include:

- **Cosine similarity**, which compares the angle between vectors.
- **Euclidean distance**, which measures straight-line distance in vector space.
- **Inner product**, which some embedding and ranking scenarios commonly use.

The correct metric depends on the embedding model and how the vectors are normalized. For many text embedding scenarios, cosine similarity is a common choice.

### Generating embeddings

Many machine learning models support embeddings APIs. For an example of how to create vector embeddings using Azure OpenAI, see [Learn how to generate embeddings with Azure OpenAI](/azure/ai-services/openai/how-to/embeddings).

## What is a vector database?

A vector database stores, indexes, retrieves, and compares high-dimensional vectors. Vector databases are designed to return similar vectors with low latency and high throughput.

You can use Azure Managed Redis as a vector database by storing embeddings in Redis data structures and indexing them by using RediSearch.

### Vector storage and metadata

In Redis, you can store vectors in hashes or JSON documents. Store useful metadata with each vector, such as document ID, title, source URL, category, timestamp, tenant ID, or access-control fields.

Metadata makes vector search more useful because applications can filter results before or during vector search. For RAG applications, metadata can also be returned with search results to support citations and source grounding.

### Index and search methods

Vector databases use indexes to make search efficient. RediSearch supports common vector indexing approaches, including:

- **FLAT** - An exact brute-force index. FLAT can be useful for smaller datasets or workloads that require exhaustive search.
- **HNSW** - An approximate nearest-neighbor index based on Hierarchical Navigable Small World graphs. HNSW is often used for larger datasets where lower latency is more important than exhaustive precision.

Common search methods include:

- **K-nearest neighbors (KNN)** - Returns the top `K` most similar vectors.
- **Approximate nearest neighbors (ANN)** - Trades some precision for lower latency and reduced compute cost.

### Search capabilities

Vector databases execute searches by comparing a query vector against indexed vectors and returning the most similar results. Many applications also use hybrid search, where metadata filters narrow the candidate set before or during vector comparison.

For example, a product recommendation query might search only products in a specific category, or a RAG application might search only documents the current user is allowed to access.

## Vector search key scenarios

Vector similarity search can be used in many application patterns, including:

- **Semantic Q&A**. Build a chatbot that answers questions over your own data. Documents can be chunked, embedded, stored in Azure Managed Redis, and retrieved by vector similarity before being summarized by a large language model.
- **Document retrieval**. Use embeddings to provide semantic document search when keyword search isn't enough.
- **Product recommendation**. Find similar products or services based on browsing activity, purchase history, or product descriptions.
- **Visual search**. Search for products or images that are visually similar to a submitted image.
- **Semantic caching**. Reduce LLM cost and latency by caching completions and reusing cached responses when a new prompt is semantically similar to a previous prompt.
- **LLM conversation memory**. Store short-term memory, such as recent conversation turns, and long-term memory, such as durable summaries, user preferences, or facts, as embeddings that applications can retrieve for future responses.

## Why choose Azure Managed Redis for storing and searching vectors?

Azure Managed Redis is useful for vector search workloads that need low-latency access close to application data, cache data, session state, or conversational memory. Because Redis is commonly used for high-performance application patterns, Azure Managed Redis can support vector search while also serving adjacent use cases such as caching, rate limiting, session storage, semantic caching, and agent memory.

Many AI and application frameworks include Redis integrations, including:

- [Microsoft Agent Framework Redis Provider](/python/api/agent-framework-core/agent_framework.redis.redisprovider?view=agent-framework-python-latest)
- [Semantic Kernel Redis Connector](/semantic-kernel/concepts/vector-store-connectors/out-of-the-box-connectors/redis-connector?pivots=programming-language-python)
- [LangChain Redis Integrations](https://docs.langchain.com/oss/python/integrations/providers/redis)
- [LlamaIndex Redis Vector Store](https://developers.llamaindex.ai/python/framework-api-reference/storage/vector_store/redis/)

Azure Managed Redis uses the RediSearch module to support vector search capabilities such as:

- Common distance metrics, including `L2`, `COSINE`, and `IP`.
- KNN search with `FLAT` and `HNSW` vector indexes.
- Vector storage in hash or JSON data structures.
- Top K queries.
- [Vector range queries](https://redis.io/docs/latest/develop/interact/search-and-query/advanced-concepts/vectors/#range-queries).
- Hybrid search with query features such as:
  - Geospatial filtering.
  - Numeric and text filters.
  - Prefix and fuzzy matching.
  - Phonetic matching.
  - Boolean queries.

## What are my other options for storing and searching vectors?

Azure provides multiple services for vector storage and search. The best choice depends on your workload.

| Service | Consider when |
|---|---|
| Azure Managed Redis | You need low-latency vector search close to application cache, session state, semantic cache, or LLM memory patterns. |
| [Azure AI Search](/azure/search/vector-search-overview) | You need a search-first service for document indexing, hybrid search, relevance tuning, and enterprise retrieval scenarios. |
| [Azure Cosmos DB](/azure/documentdb/vector-search) | You want vector search alongside operational NoSQL data. |
| [Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/how-to-use-pgvector) | You want vector search in PostgreSQL using `pgvector` alongside relational data. |

## Related content

The best way to get started with embeddings and vector search is to try it yourself.

- [Tutorial: Conduct vector similarity search on Azure OpenAI embeddings using Azure Managed Redis](tutorial-vector-similarity.md)
- [Use Redis modules with Azure Managed Redis](redis-modules.md)
- [Azure Managed Redis architecture](architecture.md)
- [Quickstart: Create an Azure Managed Redis instance](quickstart-create-managed-redis.md)
