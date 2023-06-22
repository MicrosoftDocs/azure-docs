---
title: Vector search
titleSuffix: Azure Cognitive Search
description: Describes concepts, scenarios, and availability of the vector search feature in Cognitive Search.

author: yahnoosh
ms.author: jlembicz
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/29/2023
---

<!-- Janusz, here's your doc from the repo.  I think it needs a simpler intro, similar to semantic search overivew, with sections for "how it works", scnearios, availability and pricing, but I don't want to lose content so if we can't think of how to offload anything, all content should stay here. -->

# Vector search within Azure Cognitive Search

Vector search is a method of information retrieval that aims to overcome the limitations of traditional keyword-based search. Rather than relying solely on lexical analysis and matching of individual query terms, vector search uses machine learning models to capture the meaning of words and phrases in context. This is done by representing documents and queries as vectors in a high-dimensional space, called an embedding. By understanding the intent of the query, vector search can return more relevant results that match the user's needs, even if the exact terms are not present in the document. Additionally, vector search can be applied to different types of content, such as images and videos, not just text.

## Embeddings and vectorization

*Embeddings* are a specific type of vector representation created by machine learning models that capture the semantic meaning of text, or abstract representations of other content such as images. Natural language machine learning models are trained on large amounts of data to identify patterns and relationships between words. During training, they learn to represent any input as a vector of real numbers in an intermediary step called the 'encoder'. After training is complete, these language models can be modified so the intermediary vector representation becomes the model's output. The resulting embeddings are high-dimensional vectors, where words with similar meanings are closer together in the vector space, as explained in [this Azure OpenAI Service article](/azure/cognitive-services/openai/concepts/understand-embeddings). The effectiveness of vector search in retrieving relevant information depends on the effectiveness of the embedding model in distilling the meaning of documents and queries into the resulting vector. The best models are well-trained on the types of data they are representing. This can be achieved by training directly on the problem space or fine-tuning a general-purpose model, such as GPT. Azure Cognitive Search today doesn't provide a way to vectorize documents and queries, leaving it up to you to pick the best embedding model for your data. The new vector search APIs allow you to store and retrieve vectors efficiently. 

In order to create effective embeddings for vector search, it is important to take input size limitations into account. Therefore, it is highly recommended to follow [guidelines for chunking data](vector-search-how-to-chunk-documents.md) before generating embeddings. This will ensure that the embeddings accurately capture the relevant information and enable more efficient vector search.

### What is the embedding space?

These machine learning models map individual words, phrases, or documents (for natural language processing), images, or other forms of data into an abstract representation comprised of a vector of real numbers representing a coordinate in a high-dimensional space. In this embedding space, similar items are located close together, and dissimilar items are located farther apart.

For example, documents that talk about different species of dogs would be clustered close together in the embedding space. Documents about cats would be close together, but farther from the dogs cluster while still being in the neighborhood for animals. Dissimilar concepts such as cloud computing would be much farther away. In practice, these embedding spaces are very abstract and don't have well-defined, human-interpretable meanings, but the core idea stays the same.

### How does this fit into search? 

The input data within a search request would be fed into the same machine learning model that generated the embedding space for the vector index. This model would output a vector in the same embedding space. Since similar data are clustered close together, finding matches is equivalent to finding the nearest vectors -- the "nearest neighbors" -- and returning the associated documents as the search result.

Using the previous example, if a search request is about dogs, the model would map the query into a vector that exists somewhere in the cluster of vectors representing documents about dogs. Finding the nearest vectors -- the most "similar" based on a similarity metric -- would return those relevant documents.

Commonly used similarity metrics include 'cosine', 'euclidean' (also known as 'l2 norm'), and 'dot product', which are summarized here. Cosine calculates the angle between two vectors. Euclidean calculates the Euclidean distance between two vectors, which is the l2-norm of the difference of the two vectors. Dot product is affected by both vectors' magnitudes and the angle between them. For normalized embedding spaces, dot product is equivalent to the cosine similarity, but is more efficient.

## Approximate Nearest Neighbors

Finding the true set of 'k' nearest neighbors requires comparing the input vector exhaustively against all vectors in the dataset. While each vector similarity calculation is relatively fast, performing these exhaustive comparisons across large datasets is computationally expensive and slow because of the sheer number of comparisons that are required. For example, if a dataset contains 10 million 1,000-dimensional vectors, computing the distance between the query vector and all vectors in the dataset would require scanning 37 GB of data (assuming single-precision floating point vectors) and a high number of similarity calculations.

To address this challenge, approximate nearest neighbor (ANN) search methods are used to trade-off recall for speed. These methods can efficiently find a small set of candidate vectors that are most likely to be similar to the query vector, reducing the total number of vectors comparisons.

Azure Cognitive Search will allow to choose between exhaustive and approximate kNN (k-nearest neighbor) algorithms, starting with HNSW. HNSW is a leading algorithm optimized for high-recall, low-latency applications where data distribution is unknown or can change frequently.

## Hybrid search

By performing similarity searches over vector representations of your data, you can find information that's similar to your search query, even if the search terms don't match up perfectly to the indexed content. In practice, we often need to expand lexical matches with semantic matches to guarantee good recall. The notion of composing term queries with vector queries is called *hybrid search*.

In Azure Cognitive Search, embeddings are indexed alongside textual and numerical fields allowing you to issue hybrid term and vector queries and take advantage of existing functionalities like filtering, faceting, sorting, scoring profiles, and [semantic search](semantic-search-overview.md) in a single search request.

Hybrid search combines results from both term and vector queries, which use different ranking functions such as BM25 and cosine similarity. To present these results in a single ranked list, a method of merging the ranked result lists is needed. Azure Cognitive Search uses Reciprocal Rank Fusion, a non-parametric, rank-based method for this purpose. Other methods for ranking hybrid queries will be provided in the future.

## What can you do with vectors in Cognitive Search?

We'll assume you created embeddings for your content like text, images, or audio. Embeddings might be trained on a single type of data (such as sentence embeddings), while others map multiple types of data into the same vector space (for example, sentences and images).

You can now index those embeddings alongside other types of content in Azure Cognitive Search to perform:

+ **Vector search for text**. You can encode text using embedding models such as OpenAI embeddings or open source models such as SBERT, and retrieve with queries that are also encoded as vectors to improve recall.

+ **Vector search across different data types**. You can encode images, text, audio, and video, or even a mix of them (for example, with models like CLIP) and do a similarity search across them.

+ **Multi-lingual search**: You can use multilingual embeddings models to represent your document in multiple languages in a single vector space to allow finding documents regardless of the language they are in.

+ **Filtered vector search**: You can use [filters](search-filters.md) with vector queries to select a specific category of indexed documents, or to implement document-level security, geospatial search, and more.

+ **Hybrid search**. For text data, you can combine the best of vector retrieval and keyword retrieval to obtain the best results. Use with semantic search (preview) for even more accuracy with L2 reranking using the same language models that power Bing.  

+ **Vector storage or vector database**. A common scenario is to vectorize all of your data into a vector database, and then when the application needs to find an item, you use a query vector to retrieve similar items. Because Cognitive Search can store vectors, you could use it purely as a vector store.

## Reciprocal Rank Fusion

For hybrid search scoring, we use Reciprocal Rank Fusion. Reciprocal Rank Fusion (RRF) is a technique used in information retrieval, specifically for combining the results of different search systems to produce a single, more accurate and relevant result. It is based on the concept of reciprocal rank, which is the inverse of the rank of the first relevant document in a list of search results. 

At a basic level, RRF works by taking the search results from multiple systems, assigning a reciprocal rank score to each document in the results, and then combining these scores to create a new ranking. The main idea behind this method is that documents appearing in the top positions across multiple search systems are likely to be more relevant and should be ranked higher in the combined result. 

Here's a simple explanation of the RRF process: 

1. Obtain search results from multiple systems: Let's say we have two search systems, A and B. We search for a specific query on both systems and get ranked lists of documents as results. 

2. Assign reciprocal rank scores: For each document in the search results, we assign a reciprocal rank score based on its position in the list. The score is calculated as 1/(rank + k), where rank is the position of the document in the list, and k is a constant, usually set to a small value like 60.

3. Combine scores: For each document, we sum the reciprocal rank scores obtained from each search system. This gives us a combined score for each document. 

4. Rank documents based on combined scores: Finally, we sort the documents based on their combined scores, and the resulting list is the fused ranking.



<!-- ## Next steps

+ [Try the quickstart](search-get-started-vector.md) to learn the REST APIs and field definitions used in vector search
+ [Try the Python](../demo-python/) or [JavaScript](../demo-javascript/) demos to generate embeddings from Azure OpenAI
+ [Learn more about embeddings](vector-search-how-to.md) and how to use them in Cognitive Search  -->
