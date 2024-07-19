---
title: Distance functions
description: Distance functions overview.
author: wmwxwa
ms.author: wangwilliam
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/01/2024
---

# What are distance functions?

Distance functions are mathematical formulas used to measure the similarity or dissimilarity between vectors (see [vector search](vector-search-overview.md)). Common examples include Manhattan distance, Euclidean distance, cosine similarity, and dot product. These measurements are crucial for determining how closely related two pieces of data are.

## Manhattan distance

This measures the distance between two points by adding up the absolute differences of their coordinates. Imagine walking in a grid-like city, such as many neighborhoods in Manhattan; it is the total number of blocks you walk north-south and east-west.

## Euclidean distance

Euclidean distance measures the straight-line distance between two points. It is named after the ancient Greek mathematician Euclid, who is often referred to as the “father of geometry”.

## Cosine similarity

Cosine similarity measures the cosine of the angle between two vectors projected in a multidimensional space. Two documents may be far apart by Euclidean distance because of document sizes, but they could still have a smaller angle between them and therefore high cosine similarity.

## Dot product

Two vectors are multiplied to return a single number. It combines the two vectors' magnitudes, as well as the cosine of the angle between them, showing how much one vector goes in the direction of another.

## Related content
- [VectorDistance system function](../nosql/query/vectordistance.md) in Azure Cosmos DB NoSQL
- [What is a vector database?](../vector-database.md)
- [Retrieval Augmented Generation (RAG)](rag.md)
- [Vector database in Azure Cosmos DB NoSQL](../nosql/vector-search.md)
- [Vector database in Azure Cosmos DB for MongoDB](../mongodb/vcore/vector-search.md)
- [What is vector search?](vector-search-overview.md)
- LLM [tokens](tokens.md)
- Vector [embeddings](vector-embeddings.md)
- [kNN vs ANN vector search algorithms](knn-vs-ann.md)
