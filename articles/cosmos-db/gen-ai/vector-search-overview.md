---
title: Vector search concept overview
description: Vector search concept overview
author: wmwxwa
ms.author: wangwilliam
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/01/2024
---

# What is vector search?

Vector search is a method that helps you find similar items based on their data characteristics rather than by exact matches on a property field. This technique is useful in applications such as searching for similar text, finding related images, making recommendations, or even detecting anomalies. It works by taking the [vector embeddings](vector-embeddings.md) of your data and query, and then measuring the [distance](distance-functions.md) between the data vectors and your query vector. The data vectors that are closest to your query vector are the ones that are found to be most similar semantically.

This [interactive visualization](https://openai.com/index/introducing-text-and-code-embeddings/#_1Vr7cWWEATucFxVXbW465e) shows some examples of closeness and distance between vectors.

Two major types of vector search algorithms are k-nearest neighbors (kNN) and approximate nearest neighbor (ANN). Between [kNN and ANN](knn-vs-ann.md), the latter offers a balance between accuracy and efficiency, making it better suited for large-scale applications. Some well-known ANN algorithms include Inverted File (IVF), Hierarchical Navigable Small World (HNSW), and the state-of-the-art DiskANN.

Using an integrated vector search feature in a fully featured database ([as opposed to a pure vector database](../vector-database.md#integrated-vector-database-vs-pure-vector-database)) offers an efficient way to store, index, and search high-dimensional vector data directly alongside other application data. This approach removes the necessity of migrating your data to costlier alternative vector databases and provides a seamless integration of your AI-driven applications.

## Related content
- [What is a vector database?](../vector-database.md)
- [Retrieval Augmented Generation (RAG)](rag.md)
- [Vector database in Azure Cosmos DB NoSQL](../nosql/vector-search.md)
- [Vector database in Azure Cosmos DB for MongoDB](../mongodb/vcore/vector-search.md)
- LLM [tokens](tokens.md)
- Vector [embeddings](vector-embeddings.md)
- [Distance functions](distance-functions.md)
- [kNN vs ANN vector search algorithms](knn-vs-ann.md)
- [Multi-tenancy for Vector Search](../nosql/multi-tenancy-vector-search.md)
