---
title: Vector indexes in Azure AI Studio
titleSuffix: Azure AI services
description: This article introduces vector indexes for use in generative AI applications.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: eur
---

# Vector indexes in Azure AI Studio

This concept article helps you use a vector index in Azure AI Studio for performing Retrieval Augmented Generation (RAG). A vector index indexes embeddings, which are numerical representations of concepts (data) converted to number sequences, which enable LLMs to understand the relationships between those concepts. Creating vector indexes helps you to hook up your data with a large language model (LLM) like GPT-4 and retrieve the data efficiently.

## What is an Index and why do I need it?

RAG uses your data to generate answers to the user question. For RAG to work well, we need to find a way to search and send your data in an easy and cost efficient manner to the LLMs. This is achieved by using an Index. An Index is a data store which allows you to search data efficiently. This is very useful in RAG. An Index can be optimized for LLMs by creating Vectors (text/data converted to number sequences using an embedding model). A good Index usually has efficient search capabilities like keyword searches, semantic searches, vector searches or a combination of these. This optimized RAG pattern can be illustrated as follows.

![RAG Pattern with an Index](../media/rag/rag-pattern-with-index.png)

Azure AI provides an Index asset to use with RAG pattern. The Index asset contains important information like where is your index stored, how to access your index, what are the modes in which your index can be searched, does your index have vectors, and what is the embedding model used for vectors. 

Azure AI Studio supports two types of vector indexes that contain your supplemental data used in a RAG workflow:

+ [Faiss](https://github.com/facebookresearch/faiss) (Facebook AI Similarity Search) is an open source library that provides a local file-based store. The vector index is stored in the storage account of your Azure AI Studio workspace. Since it's stored locally, the costs are minimal making it ideal for development and testing. FAISS supports vector only search capabilities and during the early public preview is currently only supported via SDK.

+ [Azure AI Search](/azure/search/search-what-is-azure-search) is an Azure resource that supports information retrieval over your vector and textual data stored in search indexes. A prompt flow can create, populate, and query your vector data stored in Azure AI Search. The Azure AI Index uses Azure AI Search as the primary and default recommended index store.

## Choose a vector store

You can use either store in prompt flow, so which one should you use?

**Faiss** is an open source library that you download and use a component of your solution. This library might be the best place to start if you have vector-only data. Some key points about working with Faiss:

+ Local storage, with no costs for creating an index (only storage cost).

+ You can build and query an index in memory.

+ You can share copies for individual use. If you want to host the index for an application, you need to set that up.

+ Faiss scales with underlying compute loading index.

**Azure AI Search** is a dedicated PaaS resource that you create in an Azure subscription. A single search service can host a large number of indexes, which can be queried and used in a RAG pattern. Some key points about using Azure AI Search for your vector store:

+ Supports enterprise level business requirements for scale, security, and availability.

+ Supports hybrid information retrieval. Vector data can coexist with non-vector data, which means you can use any of the [features of Azure AI Search](/azure/search/search-features-list) for indexing and queries, including [hybrid search](/azure/search/vector-search-how-to-query) and [semantic reranking](/azure/search/semantic-ranking).

+ [Vector support is in public preview](/azure/search/vector-search-overview). Currently, vectors must be generated externally and then passed to Azure AI Search for indexing and query encoding. The prompt flow handles these transitions for you.

To use Azure AI Search as a vector store for Azure AI Studio, [you must have a search service](/azure/search/search-create-service-portal). Once the service exists and you've granted access to developers, you can choose **Azure AI Search** as a vector index in a prompt flow. The prompt flow creates the index on Azure AI Search, generates vectors from your source data, sends the vectors to the index, invokes similarity search on Azure AI Search, and returns the response.

## Next steps

- [How to create vector index in Azure AI Studio](../how-to/index-add.md)
