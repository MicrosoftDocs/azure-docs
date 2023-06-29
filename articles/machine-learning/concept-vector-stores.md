---
title: Concept Vector Stores in AzureML (preview)
titleSuffix: Azure Machine Learning embedding vectors in AzureML
description: This concept article helps you use a vector index in AzureML for performing Retrieval Augmented Generation.
services: machine-learning
ms.author: balapv
author: balapv
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 06/30/2023
ms.topic: conceptual

---

# Vector Stores in AzureML

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

This concept article helps you use a vector index in AzureML for performing Retrieval Augmented Generation. A vector index stores embeddings, which are numerical representations of concepts (data) converted to number sequences, which enable LLMs to understand the relationships between those concepts. Creating vector stores will better help you to hook up your data with an LLM and retrieve the data efficiently.

AzureML supports embedding vectors to be stored in 2 types of vector stores. Faiss and Azure Cognitive Search.

Faiss is a local file-based store. The Vector Index will be stored in the storage account of your AzureML workspace. Since it is stored locally, the costs are minimal making it ideal for development and testing.

Azure Cognitive Search index will use the Azure Cognitive Search service to store the index. Apart from being an index store, this type of index with more features, it allows for large size and scale, making it a good fit for production scenarios or scenarios where the special features are needed.


The following tables list pros and cons for each type of Index:

**Faiss**

| Pros	| Cons |
| ----------- | ----------- |
| No costs for creating an index: only storage cost | Limited query capabilities, just embedding vector similarity search | 
| Can be built and queried in-memory | Hosting for access in an application needs user to setup |
| Easy to share copies for individual use |  | 
| Scales with underlying compute loading Index |  | 

 

**Azure Cognitive Search**

 
| Pros	| Cons |
| ----------- | ----------- |
| Supports Vector Search, Semantic search, filters | Monthly subscription fees | 
| Can be scaled via replicas and partitions as needed | Initial setup is complex: need to provision and manage Azure Resource, need to grant access for local dev usage/manage secrets |
| Support and detailed documentation are available on service features/limitations | Limitations on number of vectors which can be stored in index | 

## Next steps

[How to create vector index in Azure Machine Learning prompt flow (preview)](how-to-create-vector-index.md)


 
