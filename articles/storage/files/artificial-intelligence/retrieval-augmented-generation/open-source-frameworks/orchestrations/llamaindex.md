---
title: Build RAG pipelines with LlamaIndex and Azure Files
description: Use LlamaIndex as an orchestration framework to build retrieval-augmented generation (RAG) pipelines using data stored in Azure Files.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: overview
ms.date: 04/09/2026
ms.author: t-flynnr
---

# LlamaIndex with Azure Files

LlamaIndex is an open-source framework designed for building retrieval-augmented generation (RAG) applications. By using LlamaIndex with Azure Files, you can build RAG pipelines that use your existing file shares as a primary data source.

LlamaIndex provides fine-grained control over each stage of the pipeline through abstractions such as `SentenceSplitter` for chunking, `VectorStoreIndex` for indexing, and `RetrieverQueryEngine` for query-time retrieval and response synthesis.

## Why use LlamaIndex with Azure Files?

* **Retrieval-focused abstractions:** LlamaIndex provides specialized index types (`VectorStoreIndex`, `KeywordTableIndex`, `KnowledgeGraphIndex`) and query engines that give you control over retrieval strategies without restructuring your pipeline.
* **Node-based document model:** Documents are parsed into typed nodes that carry metadata and parent-child relationships, enabling filtering and source citation at query time.
* **Broad connector ecosystem:** LlamaHub provides connectors for data sources beyond file systems, so the same retrieval patterns you build for Azure Files extend to databases, APIs, and SaaS tools.
* **Multimodal support:** LlamaIndex handles text, tables, images, and structured data within a single index, which is useful for Azure Files shares that contain mixed document types.

## Tutorials

The following tutorials demonstrate how to build RAG pipelines over documents stored in Azure Files using LlamaIndex with different vector databases:

| Vector database | Tutorial |
| :--- | :--- |
| Pinecone | [LlamaIndex + Pinecone](../tutorials/llamaindex-pinecone/tutorial-llamaindex-pinecone.md) |
| Weaviate | [LlamaIndex + Weaviate](../tutorials/llamaindex-weaviate/tutorial-llamaindex-weaviate.md) |
| Qdrant | [LlamaIndex + Qdrant](../tutorials/llamaindex-qdrant/tutorial-llamaindex-qdrant.md) |

> [!NOTE]
> All tutorials require the same [project setup and prerequisites](../setup.md).

## Next steps

* [Azure Storage documentation](/azure/storage/)
* [LlamaIndex documentation](https://docs.llamaindex.ai/)
* [LlamaIndex GitHub](https://github.com/run-llama/llama_index)
