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

+ [Azure Cognitive Search](/azure/search/search-what-is-azure-search) is an Azure resource that supports information retrieval over your vector and textual data stored in search indexes. The index is stored in your search service. A prompt flow can create, populate, and query your index on Cognitive Search.

## Choose a vector store

You can use either store in prompt flow, so which one should you use?

**Faiss** is an open source library that you download and use a component of your solution. This library might be the best place to start if you have vector-only data. Some key points about working with Faiss:

+ Local storage, with no costs for creating an index (only storage cost).
+ You can build and query an index in memory.
+ You can share copies for individual use. If you want to host the index for an application, you need to set that up.
+ Faiss scales with underlying compute loading index.

**Azure Cognitive Search** is a dedicated PaaS resource that you create in an Azure subscription. A single search service can host a large number of search indexes for vector search and full text search scenarios. Indexes contain only the data you provide and can be queried and used in a RAG pattern. If you have enterprise level business requirements, hosting your vector data on Azure might be the best choice. Some key points about vector support in Cognitive Search:

+ [Vector capabilities](/azure/search/vector-search-overview) in Azure Cognitive Search are in public preview.
+ Vectors must be generated externally from Cognitive Search and then passed to a search index. The prompt flow can help with this step.
+ Vector data can coexist with nonvector data in the same search index, which means you can use all of the [features of Azure Cognitive Search](/azure/search/search-features-list) for hosting, indexing, and queries.

To use Cognitive Search as a vector store for Azure Machine Learning, [you must have a search service](/azure/search/search-create-service-portal). Once the service exists, you can choose it as a vector index. Because this approach is all-Azure, there's deep integration between Azure Machine Learning and Cognitive Search. The prompt flow creates the index, generates vectors from your source data, stores the vectors in the index on Cognitive Search, invokes similarity search on Cognitive Search, and returns the response.

<!-- | Pros	| Cons |
| ----------- | ----------- |
| Supports Vector Search, Semantic search, filters | Monthly subscription fees | 
| Can be scaled via replicas and partitions as needed | Initial setup is complex: need to provision and manage Azure Resource, need to grant access for local dev usage/manage secrets |
| Support and detailed documentation are available on service features/limitations | Limitations on number of vectors, which can be stored in index |  -->

## Next steps

[How to create vector index in Azure Machine Learning prompt flow (preview)](how-to-create-vector-index.md)
