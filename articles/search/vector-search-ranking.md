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

# Relevance scoring in vector search

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr#readme).

This article is for developers who need a deeper understanding of relevance scoring for vector queries in Azure Cognitive Search.

## Scoring algorithms used in vector search

Hierarchical Navigable Small World (HNSW) is an algorithm used for efficient [approximate nearest neighbor (ANN)](vector-search-overview.md#approximate-nearest-neighbors) search in high-dimensional spaces. It organizes data points into a hierarchical graph structure that enables fast neighbor queries by navigating through the graph while maintaining a balance between search accuracy and computational efficiency.

HNSW has several configuration parameters that can be tuned to achieve the throughput, latency, and recall objectives for your search application. You can create multiple configurations if you need optimizations for specific scenarios, but only one configuration can be specified on each vector field.

Vector search algorithms are specified in the json path `vectorSearch.algorithmConfigurations` in a search index, and then specified on the field definition (also in the index):

- [Create a vector index](vector-search-how-to-create-index.md)

Because many algorithm configuration parameters are used to initialize the vector index during index creation, they're immutable parameters and can't be changed once the index is built. There's a subset of query-time parameters that may be modified.

## How HNSW ranking works

Vector queries execute against an embedding space consisting of vectors generated from the same embedding model. In a typical application, the input value within a query request is fed into the same machine learning model that generated embeddings in the vector index. The output is a vector in the same embedding space. Since similar vectors are clustered close together, finding matches is equivalent to finding the vectors that are closest to the query vector, and returning the associated documents as the search result.

For example, if a query request is about hotels, the model maps the query into a vector that exists somewhere in the cluster of vectors representing documents about hotels. Identifying which vectors are the most similar to the query, based on a similarity metric, determines which documents are the most relevant.

### Indexing vectors with the HNSW algorithm

The goal of indexing a new vector into an HNSW graph is to add it to the graph structure in a manner that allows for efficient nearest neighbor search. The following steps summarize the process:

1. Initialization: Start with an empty HNSW graph, or the existing HNSW graph if it's not a new index.

1. Entry point: This is the top-level of the hierarchical graph and serves as the starting point for indexing.

1. Adding to the graph: Different hierarchical levels represent different granularities of the graph, with higher levels being more global, and lower levels being more granular. Each node in the graph represents a vector point. 

   - Each node is connected to up to `m` neighbors that are nearby. This is the `m` parameter.

   - The number of data points that considered as candidate connections is governed by the `efConstruction` parameter. This dynamic list forms the set of closest points in the existing graph for the algorithm to consider. Higher `efConstruction` values result in more nodes being considered, which often leads to denser local neighborhoods for each vector.

   - These connections use the configured similarity `metric` to determine distance. Some connections are "long-distance" connections that connect across different hierarchical levels, creating shortcuts in the graph that enhance search efficiency.

1. Graph pruning and optimization: This may be performed after indexing all vectors to improve navigability and efficiency of the HNSW graph. 

### Retrieving vectors with the HNSW algorithm

In the HNSW algorithm, a vector query search operation is executed by navigating through this hierarchical graph structure. The following summarize the steps in the process:

1. Initialization: The algorithm initiates the search at the top-level of the hierarchical graph. This entry point contains the set of vectors that serve as starting points for search.

1. Traversal: Next, it traverses the graph level by level, navigating from the top-level to lower levels, selecting candidate nodes that are closer to the query vector based on the configured distance metric, such as cosine similarity.

1. Pruning: To improve efficiency, the algorithm prunes the search space by only considering nodes that are likely to contain nearest neighbors. This is achieved by maintaining a priority queue of potential candidates and updating it as the search progresses. The length of this queue is configured by the parameter `efSearch`.

1. Refinement: As the algorithm moves to lower, more granular levels, HNSW considers more neighbors near the query, which allows the candidate set of vectors to be refined, improving accuracy.

1. Completion: The search completes when the desired number of nearest neighbors have been identified, or when other stopping criteria are met. This desired number of nearest neighbors is governed by the query-time parameter `k`.

Only fields marked as `searchable` in the index are used for scoring. Only fields marked as `retrievable`, or fields that are specified in `searchFields` in the query, are returned in search results, along with their search score.

## Similarity metrics used to measure nearness

A similarity metric measures the distance between neighboring vectors. Commonly used similarity metrics include `cosine`, `euclidean` (also known as `l2 norm`), and `dotProduct`, which are listed in the following table.

| Metric | Description |
|--------|-------------|
| `cosine` | Calculates the angle between two vectors. Cosine is the similarity metric used by [Azure OpenAI embedding models](/azure/ai-services/openai/concepts/understand-embeddings#cosine-similarity), so if you're using Azure OpenAI, specify `cosine` in the vector configuration.|
| `euclidean` | Calculates the Euclidean distance between two vectors, which is the l2-norm of the difference of the two vectors. |
| `dotProduct` | Calculates the products of vectors' magnitudes and the angle between them. |

For normalized embedding spaces, `dotProduct` is equivalent to the `cosine` similarity, but is more efficient.

If you're using the `cosine` metric, it's important to note that the calculated `@search.score` isn't the cosine value between the query vector and the document vectors. Instead, Cognitive Search applies transformations such that the score function is monotonically decreasing, meaning score values will always decrease in value as the similarity becomes worse. This transformation ensures that search scores are usable for ranking purposes.

There are some nuances with similarity scores: 

- Cosine similarity is defined as the cosine of the angle between two vectors.
- Cosine distance is defined as `1 - cosine_similarity`.

To create a monotonically decreasing function, the `@search.score` is defined as `1 / (1 + cosine_distance)`.

Developers who need a cosine value instead of the synthetic value can use a formula to convert the search score back to cosine distance:

```csharp
double ScoreToSimilarity(double score)
{
    double cosineDistance = (1 - score) / score;
    return  -cosineDistance + 1;
}
```

Having the original cosine value can be useful in custom solutions that set up thresholds to trim results of low quality results.

## Scores in a vector search results

Whenever results are ranked, **`@search.score`** property contains the value used to order the results. 

The following table identifies the scoring property returned on each match, algorithm, and range. 

| Search method | Parameter | Scoring algorithm | Range |
|---------------|-----------|-------------------|-------|
| vector search | `@search.score` | HNSW algorithm, using the similarity metric specified in the HNSW configuration. | 0.333 - 1.00 (Cosine) | 

## Number of ranked results in a vector query response

A vector query specifies the `k` parameter, which determines how many nearest neighbors of the query vector should be found in vector space and returned in the results. If `k` is larger than the number of documents in the index, then the number of documents determines the upper limit of what can be returned.

The search engine always returns `k` number of matches, as long as there are enough documents in the index. If you're familiar with full text search, you know to expect zero results if the index doesn't contain a term or phrase. However, in vector search, similarity is relative to the input query vector, not absolute. It's possible to get positive results for a nonsensical or off-topic query. Less relevant results have a worse similarity score, but they're still the "nearest" vectors if there isn't anything closer. As such, a response with no meaningful results can still return `k` results, but each result's similarity score would be low. A [hybrid approach](hybrid-search-overview.md) that includes full text search can mitigate this problem.

## Next steps

+ [Try the quickstart](search-get-started-vector.md)
+ [Learn more about embeddings](vector-search-how-to-generate-embeddings.md)
+ [Learn more about data chunking](vector-search-how-to-chunk-documents.md)
