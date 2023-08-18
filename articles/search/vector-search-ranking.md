---
title: Vector query execution and scoring
titleSuffix: Azure Cognitive Search
description: Explains the concepts behind vector query execution, including how matches are found in vector space and ranked in search results.

author: yahnoosh
ms.author: jlembicz
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/14/2023
---

# Vector query execution and scoring in Azure Cognitive Search

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr#readme).

This article is for developers who need a deeper understanding of vector query execution and ranking in Azure Cognitive Search.

## Vector similarity

In a vector query, the search query is a vector as opposed to text in full-text queries. Documents that match the vector query are ranked using vector similarity configured on the vector field defined in the index. A vector query specifies the `k` parameter, which determines how many nearest neighbors of the query vector should be returned from the index. 

> [!NOTE]
> Full-text search queries could return fewer than the requested number of results if there are fewer or no matches, but vector search will return up to `k` matches as long as there are enough documents in the index. This is because with vector search, similarity is relative to the input query vector, not absolute. This means less relevant results have a worse similarity score, but they can still be the "nearest" vectors if there aren't any closer vectors. As such, a response with no meaningful results can still return `k` results, but each result's similarity score would be low.

In a typical application, the input data within a query request would be fed into the same machine learning model that generated the embedding space for the vector index. This model would output a vector in the same embedding space. Since similar data are clustered close together, finding matches is equivalent to finding the nearest vectors and returning the associated documents as the search result.

If a query request is about dogs, the model maps the query into a vector that exists somewhere in the cluster of vectors representing documents about dogs. Identifying which vectors are the most similar to the query, based on a similarity metric, determines which documents are the most relevant.

Commonly used similarity metrics include `cosine`, `euclidean` (also known as `l2 norm`), and `dotProduct`, which are summarized here:

+ `cosine` calculates the angle between two vectors. Cosine is the similarity metric used by [Azure OpenAI embedding models](/azure/ai-services/openai/concepts/understand-embeddings#cosine-similarity).

+ `euclidean` calculates the Euclidean distance between two vectors, which is the l2-norm of the difference of the two vectors.

+ `dotProduct` is affected by both vectors' magnitudes and the angle between them.

For normalized embedding spaces, dotProduct is equivalent to the cosine similarity, but is more efficient.

## Hybrid search

By performing similarity searches over vector representations of your data, you can find information that's similar to your search query, even if the search terms don't match up perfectly to the indexed content. In practice, we often need to expand lexical matches with semantic matches to guarantee good recall. The notion of composing term queries with vector queries is called *hybrid search*.

In Azure Cognitive Search, embeddings are indexed alongside textual and numerical fields allowing you to issue hybrid term and vector queries and take advantage of existing functionalities like filtering, faceting, sorting, scoring profiles, and [semantic search](semantic-search-overview.md) in a single search request.
Hybrid search combines results from both term and vector queries, which use different ranking functions such as BM25 and cosine similarity. To present these results in a single ranked list, a method of merging the ranked result lists is needed.

## Reciprocal Rank Fusion (RRF) for hybrid queries

For hybrid search scoring, Cognitive Search uses Reciprocal Rank Fusion (RRF). In information retrieval, RRF combines the results of different search methods to produce a single, more accurate and relevant result. (Here, a search method refers to methods such as vector search and full-text search.) RRF is based on the concept of reciprocal rank, which is the inverse of the rank of the first relevant document in a list of search results. 

At a basic level, RRF works by taking the search results from multiple methods, assigning a reciprocal rank score to each document in the results, and then combining these scores to create a new ranking. The main idea behind this method is that documents appearing in the top positions across multiple search methods are likely to be more relevant and should be ranked higher in the combined result.

Here's a simple explanation of the RRF process:

1. Obtain search results from multiple methods: Let's say we have two search methods, A and B. (In the context of Azure Cognitive Search, this will be vector search and full-text search.) We search for a specific query on both methods and get ranked lists of documents as results.

1. Assign reciprocal rank scores: For each document in the search results, we assign a reciprocal rank score based on its position in the list. The score is calculated as 1/(rank + k), where rank is the position of the document in the list, and k is a constant which was experimentally observed to perform best if it's set to a small value like 60.

1. Combine scores: For each document, we sum the reciprocal rank scores obtained from each search system. This gives us a combined score for each document. 

1. Rank documents based on combined scores: Finally, we sort the documents based on their combined scores, and the resulting list is the fused ranking.

By default, if you aren't using pagination, Cognitive Search returns the top 50 highest ranking matches for full text search, and it returns `k` matches for vector search. In a hybrid query, the top 50 highest ranked matches of the unified result set are returned. You can use `$top`, `$skip`, and `$next` for paginated results. For more information, see [How to work with search results](search-pagination-page-layout.md).

## Next steps

+ [Try the quickstart](search-get-started-vector.md)
+ [Learn more about embeddings](vector-search-how-to-generate-embeddings.md)
+ [Learn more about data chunking](vector-search-how-to-chunk-documents.md)

