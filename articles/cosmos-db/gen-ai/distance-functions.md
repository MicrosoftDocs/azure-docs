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

Distance functions are mathematical formulas used to measure the similarity or dissimilarity between vectors. Common examples include Euclidean distance, cosine similarity, and dot product. These measurements are crucial for determining how closely related two pieces of data.

## Euclidean distance

Euclidean distance is a mathematical concept that measures the straight-line distance between two points in a Euclidean space. It is named after the ancient Greek mathematician Euclid, who is often referred to as the “father of geometry”.

## Cosine similarity

Cosine similarity measures the cosine of the angle between two vectors projected in a multidimensional space. This measurement is beneficial, because if two documents are far apart by Euclidean distance because of size, they could still have a smaller angle between them and therefore higher cosine similarity.

## Related content
- [VectorDistance system function](query/vectordistance.md) in Azure Cosmos DB NoSQL
