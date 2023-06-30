---
title: Azure OpenAI Service embeddings
titleSuffix: Azure OpenAI - embeddings and cosine similarity
description: Learn more about Azure OpenAI embeddings API for document search and cosine similarity
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: tutorial
ms.date: 03/22/2023
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom:
---

# Understanding embeddings in Azure OpenAI Service

An embedding is a special format of data representation that can be easily utilized by machine learning models and algorithms. The embedding is an information dense representation of the semantic meaning of a piece of text. Each embedding is a vector of floating-point numbers, such that the distance between two embeddings in the vector space is correlated with semantic similarity between two inputs in the original format. For example, if two texts are similar, then their vector representations should also be similar.

## Embedding models

Different Azure OpenAI embedding models are specifically created to be good at a particular task. **Similarity embeddings** are good at capturing semantic similarity between two or more pieces of text. **Text search embeddings** help measure whether long documents are relevant to a short query. **Code search embeddings** are useful for embedding code snippets and embedding natural language search queries.

Embeddings make it easier to do machine learning on large inputs representing words by capturing the semantic similarities in a vector space. Therefore, we can use embeddings to determine if two text chunks are semantically related or similar, and provide a score to assess similarity.

## Cosine similarity

Azure OpenAI embeddings rely on cosine similarity to compute similarity between documents and a query.

From a mathematic perspective, cosine similarity measures the cosine of the angle between two vectors projected in a multi-dimensional space. This is beneficial because if two documents are far apart by Euclidean distance because of size, they could still have a smaller angle between them and therefore higher cosine similarity. For more information about cosine similarity equations, see [this article on Wikipedia](https://en.wikipedia.org/wiki/Cosine_similarity).

An alternative method of identifying similar documents is to count the number of common words between documents. Unfortunately, this approach doesn't scale since an expansion in document size is likely to lead to a greater number of common words detected even among completely disparate topics. For this reason, cosine similarity can offer a more effective alternative.

## Next steps

Learn more about using Azure OpenAI and embeddings to perform document search with our [embeddings tutorial](../tutorials/embeddings.md).
