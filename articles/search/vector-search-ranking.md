---
title: Vector query execution and scoring
titleSuffix: Azure Cognitive Search
description: Explains the concepts behind vector query execution, including how matches are found in vector space and ranked in search results.

author: yahnoosh
ms.author: jlembicz
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/29/2023
---

# Vector query execution and scoring in Azure Cognitive Search

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [alpha SDKs](https://github.com/Azure/cognitive-search-vector-pr#readme).

This article is for developers who need a deeper understanding of vector search concepts in Azure Cognitive Search:

+ Vector structures in a search index
+ Vector query execution
+ Scoring and ranking vector queries

## Vector structures in a search index

Azure Cognitive Search is used to index and query content that you host in a search index on a search service. Having full control over what your index contains, how often it's updated, and where the index is located are fundamental reasons for choosing Cognitive Search over other solutions. The addition of vector search support doesn't change the fundamentals:

+ Vector data is in a search index
+ Vector fields are the unit for indexing and queries
+ Vectors can be pushed or pulled into a search index using familiar approaches (portal, REST APIs, Azure SDKs)

Internally, the search engine creates and manages the vector indexes for vector data. Regarding vector indexes, the only consideration for developers is staying under the [vector index size limit](vector-search-index-size.md) for a search service. 

### About vector search

Vector search is a method of information retrieval that aims to overcome the limitations of traditional keyword-based search. Rather than relying solely on lexical analysis and matching of individual query terms, vector search uses machine learning models to capture the meaning of words and phrases in context. This is done by representing documents and queries as vectors in a high-dimensional space, called an embedding. By capturing the intent of the query with the embedding, vector search can return more relevant results that match the user's needs, even if the exact terms aren't present in the document. Additionally, vector search can be applied to different types of content, such as images and videos, not just text. This enables new search experiences such as multi-modal search or cross-language search.

### Embeddings and vectorization

*Embeddings* are a specific type of vector representation created by machine learning models that capture the semantic meaning of text, or abstract representations of other content such as images. Natural language machine learning models are trained on large amounts of data to identify patterns and relationships between words. During training, they learn to represent any input as a vector of real numbers in an intermediary step called the *encoder*. After training is complete, these language models can be modified so the intermediary vector representation becomes the model's output. The resulting embeddings are high-dimensional vectors, where words with similar meanings are closer together in the vector space, as explained in [this Azure OpenAI Service article](/azure/cognitive-services/openai/concepts/understand-embeddings). The effectiveness of vector search in retrieving relevant information depends on the effectiveness of the embedding model in distilling the meaning of documents and queries into the resulting vector. The best models are well-trained on the types of data they're representing. This can be achieved by training directly on the problem space or fine-tuning a general-purpose model, such as GPT. Azure Cognitive Search today doesn't provide a way to vectorize documents and queries, leaving it up to you to pick the best embedding model for your data. The new vector search APIs allow you to store and retrieve vectors efficiently. 

In order to create effective embeddings for vector search, it's important to take input size limitations into account. Therefore, it's highly recommended to follow [guidelines for chunking data](vector-search-how-to-chunk-documents.md) before generating embeddings. This ensures that the embeddings accurately capture the relevant information and enable more efficient vector search.

### What is the embedding space?

These machine learning models map individual words, phrases, or documents (for natural language processing), images, or other forms of data into an abstract representation comprised of a vector of real numbers representing a coordinate in a high-dimensional space. In this embedding space, similar items are located close together, and dissimilar items are located farther apart.

For example, documents that talk about different species of dogs would be clustered close together in the embedding space. Documents about cats would be close together, but farther from the dogs cluster while still being in the neighborhood for animals. Dissimilar concepts such as cloud computing would be much farther away. In practice, these embedding spaces are very abstract and don't have well-defined, human-interpretable meanings, but the core idea stays the same.

## Vector query execution

The input data within a query request would be fed into the same machine learning model that generated the embedding space for the vector index. This model would output a vector in the same embedding space. Since similar data are clustered close together, finding matches is equivalent to finding the nearest vectors and returning the associated documents as the search result.

Using the previous example, if a query request is about dogs, the model maps the query into a vector that exists somewhere in the cluster of vectors representing documents about dogs. Finding the nearest vectors, or the most "similar" vector based on a similarity metric, would return those relevant documents.

Commonly used similarity metrics include `cosine`, `euclidean` (also known as `l2 norm`), and `dot product`, which are summarized here:

+ Cosine calculates the angle between two vectors.

+ Euclidean calculates the Euclidean distance between two vectors, which is the l2-norm of the difference of the two vectors.

+ Dot product is affected by both vectors' magnitudes and the angle between them.

For normalized embedding spaces, dot product is equivalent to the cosine similarity, but is more efficient.

## Scoring and ranking vector search results

Azure Cognitive Search uses Hierarchical Navigation Small Worlds (HNSW) for Approximate Nearest Neighbors (ANN) indexing and queries.

ANN is a class of algorithms for finding matches in vector space. In general, this class of algorithms employs techniques such as graph construction, data partitioning, and other methods to significantly reduce the search space to accelerate query processing. The specific approach will depend on the algorithm. While sacrificing some precision, these algorithms offer scalable and faster retrieval of approximate nearest neighbors, which makes them ideal for balancing accuracy and efficiency in modern information retrieval applications. You may adjust the parameters of your algorithm to fine-tune the recall, latency, memory, and disk footprint requirements of your search application.

Azure Cognitive Search uses _HNSW_, which is a leading algorithm optimized for high-recall, low-latency applications where data distribution is unknown or can change frequently.

> [!NOTE]
> Finding the true set of [_k_ nearest neighbors](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm) requires comparing the input vector exhaustively against all vectors in the dataset. While each vector similarity calculation is relatively fast, performing these exhaustive comparisons across large datasets is computationally expensive and slow due to the sheer number of comparisons. For example, if a dataset contains 10 million 1,000-dimensional vectors, computing the distance between the query vector and all vectors in the dataset would require scanning 37 GB of data (assuming single-precision floating point vectors) and a high number of similarity calculations.
> 
> To address this challenge, approximate nearest neighbor (ANN) search methods are used to trade off recall for speed. These methods can efficiently find a small set of candidate vectors that are similar to the query vector and have high likelihood to be in the globally most similar neighbors. Each algorithm has a different approach to reducing the total number of vectors comparisons, but they all share the ability to balance accuracy and efficiency by tweaking the algorithm configuration parameters.

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

Note that full-text search could return fewer than the requested number of results if there are fewer or no matches, but vector search will return up to `k` matches as long as there are enough documents in the vector index. This is because with vector search, similarity is relative to the input query vector, not absolute. This means less relevant results have a worse similarity score, but they can still be the "nearest" vectors if there aren't any closer vectors. As such, a response with no meaningful results can still return `k` results, but each result's similarity score would be low.

## Next steps

+ [Try the quickstart](search-get-started-vector.md)
+ [Learn more about embeddings](vector-search-how-to-generate-embeddings.md)
+ [Learn more about data chunking](vector-search-how-to-chunk-documents.md)
