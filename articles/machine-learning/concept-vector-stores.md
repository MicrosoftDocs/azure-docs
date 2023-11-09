---
title: Concept Vector Stores in Azure Machine Learning (preview)
titleSuffix: Azure Machine Learning embedding vectors in AzureML
description: This concept article helps you use a vector index in Azure Machine Learning for performing Retrieval Augmented Generation.
services: machine-learning
ms.author: balapv
author: balapv
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 07/27/2023
ms.topic: conceptual

---

# Vector stores in Azure Machine Learning (preview)

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

This concept article helps you use a vector index in Azure Machine Learning for performing Retrieval Augmented Generation (RAG). A vector index stores embeddings, which are numerical representations of concepts (data) converted to number sequences, which enable LLMs to understand the relationships between those concepts. Creating vector stores helps you to hook up your data with a large language model (LLM) like GPT-4 and retrieve the data efficiently.

Azure Machine Learning supports two types of vector stores that contain your supplemental data used in a RAG workflow:

+ [Faiss](https://github.com/facebookresearch/faiss) is an open source library that provides a local file-based store. The vector index is stored in the storage account of your Azure Machine Learning workspace. Since it's stored locally, the costs are minimal making it ideal for development and testing.

+ [Azure AI Search](/azure/search/search-what-is-azure-search) (formerly Cognitive Search) is an Azure resource that supports information retrieval over your vector and textual data stored in search indexes. A prompt flow can create, populate, and query your vector data stored in Azure AI Search.

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

To use AI Search as a vector store for Azure Machine Learning, [you must have a search service](/azure/search/search-create-service-portal). Once the service exists and you've granted access to developers, you can choose **Azure AI Search** as a vector index in a prompt flow. The prompt flow creates the index on Azure AI Search, generates vectors from your source data, sends the vectors to the index, invokes similarity search on AI Search, and returns the response.

## Next steps

[How to create vector index in Azure Machine Learning prompt flow (preview)](how-to-create-vector-index.md)
