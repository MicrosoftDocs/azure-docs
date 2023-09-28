---
title: Vector search scoring
titleSuffix: Azure Cognitive Search
description: Explains the concepts behind vector relevance scoring, including how matches are found in vector space and ranked in search results.

author: yahnoosh
ms.author: jlembicz
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/27/2023
---

# Relevance scoring in vector similarity search

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr#readme).

This article is for developers who need a deeper understanding of relevance scoring for vector queries in Azure Cognitive Search.

## Scoring algorithms used in vector similarity search

Hierarchical Navigable Small World (HNSW) is the scoring algorithm used for vector similarity search. It follows the principle of [Approximate Nearest Neighbors (ANN)](vector-search-overview.md#approximate-nearest-neighbors), where  the search surface area is reduced to a small set of candidate vectors similar to the query vector.

HNSW has configuration parameters. You can create multiple configurations if you need optimizations for specific scenarios, but only one configuration can be specified on each vector query.

## Vector scoring concepts

Vector queries execute against an embedding space consisting of vectors generated from the same embedding model. In a typical application, the input value within a query request would be fed into the same machine learning model that generated the embedding space for the vector index. This model would output a vector in the same embedding space. Since similar vectors are clustered close together, finding matches is equivalent to finding the nearest vectors and returning the associated documents as the search result.

For example, if a query request is about hotels, the model maps the query into a vector that exists somewhere in the cluster of vectors representing documents about hotels. Identifying which vectors are the most similar to the query, based on a similarity metric, determines which documents are the most relevant.

## Number of ranked results in a vector query response

A vector query specifies the `k` parameter, which determines how many nearest neighbors of the query vector should be returned in the results. If `k` is larger than the number of documents in the index, then the number of documents determines the upper limit of what can be returned.

The search engine returns `k` number of matches, as long as there are enough documents in the index. If you're familiar with full text search, you know to expect zero results if the index doesn't contain a term or phrase. However, in vector search, similarity is relative to the input query vector, not absolute. It's possible to get positive results for a nonsensical or off-topic query. Less relevant results have a worse similarity score, but they're still the "nearest" vectors if there isn't anything closer. As such, a response with no meaningful results can still return `k` results, but each result's similarity score would be low. A [hybrid approach](hybrid-search-overview.md) that includes full text search can mitigate this problem.

## Similarity metrics used to measure nearness

A similarity metric measures the distance between neighboring vectors. Commonly used similarity metrics include `cosine`, `euclidean` (also known as `l2 norm`), and `dotProduct`, which are summarized in the following table.

| Metric | Description |
|--------|-------------|
| `cosine` | Calculates the angle between two vectors. Cosine is the similarity metric used by [Azure OpenAI embedding models](/azure/ai-services/openai/concepts/understand-embeddings#cosine-similarity). |
| `euclidean` | Calculates the Euclidean distance between two vectors, which is the l2-norm of the difference of the two vectors. |
| `dotProduct` | Calculates the products of vectors' magnitudes and the angle between them. |

For normalized embedding spaces, `dotProduct` is equivalent to the `cosine` similarity, but is more efficient.

## Next steps

+ [Try the quickstart](search-get-started-vector.md)
+ [Learn more about embeddings](vector-search-how-to-generate-embeddings.md)
+ [Learn more about data chunking](vector-search-how-to-chunk-documents.md)
