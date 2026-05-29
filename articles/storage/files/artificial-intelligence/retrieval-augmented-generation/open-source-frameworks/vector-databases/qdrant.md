---
title: Build RAG pipelines with Qdrant and Azure Files
description: Use Qdrant as a vector database to build retrieval-augmented generation (RAG) pipelines using data stored in Azure Files.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: overview
ms.date: 04/09/2026
ms.author: t-flynnr
---

# Qdrant with Azure Files

Qdrant is a vector database built in Rust that supports advanced payload filtering for scoping queries by metadata at retrieval time. When combined with Azure Files as the document source, Qdrant serves as the vector store for similarity search while orchestration frameworks such as LangChain, LlamaIndex, or Haystack handle ingestion and query-time retrieval.

Qdrant is operated and managed by Qdrant Solutions GmbH and is available as a third-party service.

## Why use Qdrant with Azure Files?

* **Payload filtering:** Store any JSON-serializable metadata in Qdrant payloads and filter on it at query time. Filters are applied during HNSW graph traversal rather than as a post-filter, so filtering does not degrade search performance.
* **Self-hosting option:** Deploy Qdrant on your own infrastructure, such as Azure Kubernetes Service (AKS), alongside Azure Files private endpoints. This keeps the entire RAG pipeline within your Azure tenant's network boundary.
* **Managed cloud:** Use Qdrant Cloud for a managed experience with the same API as the self-hosted deployment. The free tier is sufficient for development and testing.
* **Collection auto-creation:** Qdrant creates collections on first insert with the correct vector dimensions and distance metric, reducing manual setup steps.

## Azure Marketplace availability

Qdrant is available through the [Azure Marketplace](https://marketplace.microsoft.com/en-us/product/saas/qdrantsolutionsgmbh1698769709989.qdrant-db). Using the Marketplace can simplify procurement and enable unified billing through an Azure subscription.

## Tutorials

The following tutorials demonstrate how to build RAG pipelines over documents stored in Azure Files using Qdrant with different orchestration frameworks:

| Framework | Tutorial |
| :--- | :--- |
| LangChain | [LangChain + Qdrant](../tutorials/langchain-qdrant/tutorial-langchain-qdrant.md) |
| LlamaIndex | [LlamaIndex + Qdrant](../tutorials/llamaindex-qdrant/tutorial-llamaindex-qdrant.md) |
| Haystack | [Haystack + Qdrant](../tutorials/haystack-qdrant/tutorial-haystack-qdrant.md) |

> [!NOTE]
> All tutorials require the same [project setup and prerequisites](../setup.md).

## Next steps

* [Azure Storage documentation](/azure/storage/)
* [Qdrant documentation](https://qdrant.tech/documentation/)
* [Qdrant on Azure Marketplace](https://marketplace.microsoft.com/en-us/product/saas/qdrantsolutionsgmbh1698769709989.qdrant-db)
