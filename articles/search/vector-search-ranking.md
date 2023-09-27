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

## Scoring alogrithms used in vector similarity search

Hierarchical Navigable Small World (HNSW) is the scoring algorithm used for vector similiarity search.

It follows the principle of Approximate Nearest Neighbors (ANN), finding vectors that are the closest match, and then scanning the nearest neihbors in vector space for additional matches.

HNSW has a default configuration, which you can modify in a search index to create more configurations, one of which is specified on each vectory query.

## Vector scoring fundamentals

Vector queries execute against an embedding space consisting of vectors generated from the same embedding model. 

Both the query and corpus must be vectors generated from the same model, such as the **text-embedding-ada-002** model in Azure OpenAI.

A vector query specifies the `k` parameter, which determines how many nearest neighbors of the query vector should be returned in the results. 

Because similarity is relative rather than absolute, it's possible for the algorithm to find "similarity" in vectors that might not actually be a good match. For example, you could get positive results for a non-sensical or off-topic query.

  `k` number of matches are returned as long as there are enough documents in the index. This is because with vector search, similarity is relative to the input query vector, not absolute. Less relevant results have a worse similarity score, but they are still the "nearest" vectors if there isn't anything closer. As such, a response with no meaningful results can still return `k` results, but each result's similarity score would be low.

In a typical application, the input value within a query request would be fed into the same machine learning model that generated the embedding space for the vector index. This model would output a vector in the same embedding space. Since similar vectors are clustered close together, finding matches is equivalent to finding the nearest vectors and returning the associated documents as the search result.

For example, if a query request is about dogs, the model maps the query into a vector that exists somewhere in the cluster of vectors representing documents about dogs. Identifying which vectors are the most similar to the query, based on a similarity metric, determines which documents are the most relevant.

### Similarity metrics used to measure nearness

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
