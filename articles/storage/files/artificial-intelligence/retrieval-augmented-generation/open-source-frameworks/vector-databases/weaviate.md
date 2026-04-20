---
title: Build RAG pipelines with Weaviate and Azure Files
description: Use Weaviate as a vector database to build retrieval-augmented generation (RAG) pipelines using data stored in Azure Files.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: overview
ms.date: 04/09/2026
ms.author: t-flynnr
---

# Weaviate with Azure Files

Weaviate is a vector database that supports hybrid search, combining vector similarity with BM25 keyword matching in a single query. When combined with Azure Files as the document source, Weaviate serves as the vector store for similarity search while orchestration frameworks such as LangChain, LlamaIndex, or Haystack handle ingestion and query-time retrieval.

Weaviate is operated and managed by Weaviate B.V. and is available as a third-party service.

## Why use Weaviate with Azure Files?

* **Hybrid search:** Weaviate combines vector similarity with BM25 keyword matching, with configurable weighting via an `alpha` parameter. This can improve results for file shares that contain a mix of natural-language documents and structured data.
* **Open source with managed cloud:** Run Weaviate self-hosted on your own infrastructure, or use Weaviate Cloud for a managed experience. The same APIs work in both environments.
* **Multi-tenancy support:** Weaviate supports tenant isolation at the collection level, which can map to Azure Files directory hierarchies for organizations that need per-department data separation.
* **Module ecosystem:** Weaviate's module architecture supports built-in vectorizers, rerankers, and generative modules that can offload embedding and generation to the database layer.

## Azure Marketplace availability

Weaviate is available through the [Azure Marketplace](https://marketplace.microsoft.com/en-us/product/weaviatebv1686614539420.weaviate_1). Using the Marketplace can simplify procurement and enable unified billing through an Azure subscription.

## Tutorials

The following tutorials demonstrate how to build RAG pipelines over documents stored in Azure Files using Weaviate with different orchestration frameworks:

| Framework | Tutorial |
| :--- | :--- |
| LangChain | [LangChain + Weaviate](../tutorials/langchain-weaviate/tutorial-langchain-weaviate.md) |
| LlamaIndex | [LlamaIndex + Weaviate](../tutorials/llamaindex-weaviate/tutorial-llamaindex-weaviate.md) |
| Haystack | [Haystack + Weaviate](../tutorials/haystack-weaviate/tutorial-haystack-weaviate.md) |

> [!NOTE]
> All tutorials require the same [project setup and prerequisites](../setup.md).

## Next steps

* [Azure Storage documentation](/azure/storage/)
* [Weaviate documentation](https://weaviate.io/developers/weaviate)
* [Weaviate on Azure Marketplace](https://marketplace.microsoft.com/en-us/product/weaviatebv1686614539420.weaviate_1)
