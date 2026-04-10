---
title: Build RAG pipelines with Pinecone and Azure Files
description: Use Pinecone as a vector database to build retrieval-augmented generation (RAG) pipelines using data stored in Azure Files.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: overview
ms.date: 04/09/2026
ms.author: t-flynnr
---

# Pinecone with Azure Files

Pinecone is a managed vector database that you can use to index and retrieve embeddings for retrieval-augmented generation (RAG) workloads. When combined with Azure Files as the document source, Pinecone serves as the vector store for similarity search while orchestration frameworks such as LangChain, LlamaIndex, or Haystack handle ingestion and query-time retrieval.

Pinecone is operated and managed by Pinecone Systems, Inc. and is available as a third-party service.

## Why use Pinecone with Azure Files?

* **Managed vector storage:** Pinecone manages index creation, scaling, and maintenance, allowing you to focus on RAG pipeline implementation rather than operating vector infrastructure.
* **Serverless usage model:** Pinecone offers a serverless deployment option that scales based on query volume and vector count, which is useful for workloads with variable traffic.
* **Namespace support:** Pinecone namespaces can be used to logically partition vectors, which can align with directory boundaries or tenant separation in Azure Files-based workloads.
* **Security and compliance programs:** Pinecone offers compliance programs such as SOC 2, which may help organizations meet internal governance requirements when using a managed vector database.
* **Simple client integration:** Pinecone exposes a stateless API over HTTP, which integrates cleanly with open-source orchestration frameworks such as LangChain, LlamaIndex, and Haystack.

## Azure Marketplace availability

Pinecone is available through the [Azure Marketplace](https://marketplace.microsoft.com/en-us/product/pineconesystemsinc1688761585469.pineconesaas). Using the Marketplace can simplify procurement and enable unified billing through an Azure subscription.

## Tutorials

The following tutorials demonstrate how to build RAG pipelines over documents stored in Azure Files using Pinecone with different orchestration frameworks:

| Framework | Tutorial |
| :--- | :--- |
| LangChain | [LangChain + Pinecone](../tutorials/langchain-pinecone/tutorial-langchain-pinecone.md) |
| LlamaIndex | [LlamaIndex + Pinecone](../tutorials/llamaindex-pinecone/tutorial-llamaindex-pinecone.md) |
| Haystack | [Haystack + Pinecone](../tutorials/haystack-pinecone/tutorial-haystack-pinecone.md) |

> [!NOTE]
> All tutorials require the same [project setup and prerequisites](../setup.md).

## Next steps

* [Azure Storage documentation](/azure/storage/)
* [Pinecone documentation](https://docs.pinecone.io/)
* [Pinecone on Azure Marketplace](https://marketplace.microsoft.com/en-us/product/pineconesystemsinc1688761585469.pineconesaas)
