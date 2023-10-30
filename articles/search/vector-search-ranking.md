---
title: Vector relevance and ranking
titleSuffix: Azure Cognitive Search
description: Explains the concepts behind vector relevance, scoring, including how matches are found in vector space and ranked in search results.

author: yahnoosh
ms.author: jlembicz
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/13/2023
---

# Relevance and ranking in vector search

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr#readme).

In vector query execution, the search engine looks for similar vectors to find the best candidates to return in search results. Depending on how you indexed the vector content, the search for relevant matches is either exhaustive, or constrained to near neighbors for faster processing. Once candidates are found, similarity metrics are used to score each result based on the strength of the match. This article explains the algorithms used to determine relevance and the similarity metrics used for scoring.

## Determine relevance in vector search

The algorithms that determine relevance are exhaustive k-nearest neighbors (KNN) and Hierarchical Navigable Small World (HNSW). 

Exhaustive KNN performs a brute-force search that enables users to search the entire vector space for matches that are most similar to the query. It does this by calculating the distances between all pairs of data points and finding the exact `k` nearest neighbors for a query point. 

HNSW is an algorithm used for efficient approximate nearest neighbor (ANN) search in high-dimensional spaces. It organizes data points into a hierarchical graph structure that enables fast neighbor queries by navigating through the graph while maintaining a balance between search accuracy and computational efficiency.

Only fields marked as `searchable` in the index, or as `searchFields` in the query, are used for searching and scoring. Only fields marked as `retrievable`, or fields specified in `select` in the query, are returned in search results, along with their search score.

### When to use exhaustive KNN

This algorithm is intended for scenarios where high recall is of utmost importance, and users are willing to accept the trade-offs in search performance. Because it's computationally intensive, use exhaustive KNN for small to medium datasets, or when precision requirements outweigh query performance considerations. 

Another use is to build a dataset to evaluate approximate nearest neighbor algorithm recall. Exhaustive KNN can be used to build the ground truth set of nearest neighbors.

Exhaustive KNN support is available through [2023-10-01-Preview REST API](/rest/api/searchservice/search-service-api-versions#2023-10-01-Preview) and in Azure SDK client libraries that target that REST API version.

### When to use HNSW

HNSW is recommended for most scenarios due to its efficiency when searching over larger data sets. Internally, HNSW creates extra data structures for faster search. However, you aren't locked into using them on every search. HNSW has several configuration parameters that can be tuned to achieve the throughput, latency, and recall objectives for your search application. For example, at query time, you can specify options for exhaustive search, even if the vector field is indexed for HNSW. 

## How nearest neighbor search works

Vector queries execute against an embedding space consisting of vectors generated from the same embedding model. Generally, the input value within a query request is fed into the same machine learning model that generated embeddings in the vector index. The output is a vector in the same embedding space. Since similar vectors are clustered close together, finding matches is equivalent to finding the vectors that are closest to the query vector, and returning the associated documents as the search result.

For example, if a query request is about hotels, the model maps the query into a vector that exists somewhere in the cluster of vectors representing documents about hotels. Identifying which vectors are the most similar to the query, based on a similarity metric, determines which documents are the most relevant.

When vector fields are indexed for exhaustive KNN, the query executes against "all neighbors". For fields indexed for HNSW, the search engine uses an HNSW graph to search over a subset of nodes within the vector index.

### Creating the HNSW graph

The goal of indexing a new vector into an HNSW graph is to add it to the graph structure in a manner that allows for efficient nearest neighbor search. The following steps summarize the process:

1. Initialization: Start with an empty HNSW graph, or the existing HNSW graph if it's not a new index.

1. Entry point: This is the top-level of the hierarchical graph and serves as the starting point for indexing.

1. Adding to the graph: Different hierarchical levels represent different granularities of the graph, with higher levels being more global, and lower levels being more granular. Each node in the graph represents a vector point. 

   - Each node is connected to up to `m` neighbors that are nearby. This is the `m` parameter.

   - The number of data points that considered as candidate connections is governed by the `efConstruction` parameter. This dynamic list forms the set of closest points in the existing graph for the algorithm to consider. Higher `efConstruction` values result in more nodes being considered, which often leads to denser local neighborhoods for each vector.

   - These connections use the configured similarity `metric` to determine distance. Some connections are "long-distance" connections that connect across different hierarchical levels, creating shortcuts in the graph that enhance search efficiency.

1. Graph pruning and optimization: This can happen after indexing all vectors, and it improves navigability and efficiency of the HNSW graph. 

### Retrieving vectors with the HNSW algorithm

In the HNSW algorithm, a vector query search operation is executed by navigating through this hierarchical graph structure. The following summarize the steps in the process:

1. Initialization: The algorithm initiates the search at the top-level of the hierarchical graph. This entry point contains the set of vectors that serve as starting points for search.

1. Traversal: Next, it traverses the graph level by level, navigating from the top-level to lower levels, selecting candidate nodes that are closer to the query vector based on the configured distance metric, such as cosine similarity.

1. Pruning: To improve efficiency, the algorithm prunes the search space by only considering nodes that are likely to contain nearest neighbors. This is achieved by maintaining a priority queue of potential candidates and updating it as the search progresses. The length of this queue is configured by the parameter `efSearch`.

1. Refinement: As the algorithm moves to lower, more granular levels, HNSW considers more neighbors near the query, which allows the candidate set of vectors to be refined, improving accuracy.

1. Completion: The search completes when the desired number of nearest neighbors have been identified, or when other stopping criteria are met. This desired number of nearest neighbors is governed by the query-time parameter `k`.

## Similarity metrics used to measure nearness

A similarity metric measures the distance between neighboring vectors.

| Metric | Description |
|--------|-------------|
| `cosine` | This metric measures the angle between two vectors, and isn't affected by differing vector lengths. Mathematically, it calculates the angle between two vectors. Cosine is the similarity metric used by [Azure OpenAI embedding models](/azure/ai-services/openai/concepts/understand-embeddings#cosine-similarity), so if you're using Azure OpenAI, specify `cosine` in the vector configuration.|
| `dotProduct` | This metric measures both the length of each pair of two vectors, and the angle between them. Mathematically, it calculates the products of vectors' magnitudes and the angle between them. For normalized vectors, this is identical to `cosine` similarity, but slightly more performant. |
| `euclidean` | (also known as `l2 norm`) This metric measures the length of the vector difference between two vectors. Mathematically, it calculates the Euclidean distance between two vectors, which is the l2-norm of the difference of the two vectors. |

## Scores in a vector search results

Whenever results are ranked, **`@search.score`** property contains the value used to order the results. 

| Search method | Parameter | Scoring algorithm | Range |
|---------------|-----------|-------------------|-------|
| vector search | `@search.score` | HNSW or KNN algorithm, using the similarity metric specified in the algorithm configuration. | 0.333 - 1.00 (Cosine) | 

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

## Number of ranked results in a vector query response

A vector query specifies the `k` parameter, which determines how many nearest neighbors of the query vector should be found in vector space and returned in the results. If `k` is larger than the number of documents in the index, then the number of documents determines the upper limit of what can be returned.

The search engine always returns `k` number of matches, as long as there are enough documents in the index. If you're familiar with full text search, you know to expect zero results if the index doesn't contain a term or phrase. However, in vector search, similarity is relative to the input query vector, not absolute. It's possible to get positive results for a nonsensical or off-topic query. Less relevant results have a worse similarity score, but they're still the "nearest" vectors if there isn't anything closer. As such, a response with no meaningful results can still return `k` results, but each result's similarity score would be low. A [hybrid approach](hybrid-search-overview.md) that includes full text search can mitigate this problem.

## Next steps

+ [Try the quickstart](search-get-started-vector.md)
+ [Learn more about embeddings](vector-search-how-to-generate-embeddings.md)
+ [Learn more about data chunking](vector-search-how-to-chunk-documents.md)
