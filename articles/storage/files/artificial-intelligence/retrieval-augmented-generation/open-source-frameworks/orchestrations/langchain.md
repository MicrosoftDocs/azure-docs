---
title: Build RAG pipelines with LangChain and Azure Files
description: Use LangChain as an orchestration framework to build retrieval-augmented generation (RAG) pipelines using data stored in Azure Files.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: overview
ms.date: 04/09/2026
ms.author: t-flynnr
---

# LangChain with Azure Files

LangChain is an open-source framework designed to simplify the creation of applications powered by large language models (LLMs). By using LangChain with Azure Files, you can build robust retrieval-augmented generation (RAG) pipelines that leverage your existing file shares as a primary data source.

LangChain's modular architecture and **LangChain Expression Language (LCEL)** allow you to swap components—such as document loaders, retrievers, and vector stores—with minimal code changes.

## Why use LangChain with Azure Files?

Integrating LangChain with Azure Files offers several advantages for AI workflows:

* **Modular integrations:** Connect Azure Files to a wide array of vector databases and LLMs without rewriting core logic.
* **Streamlined orchestration:** Use LCEL to build composable, testable pipelines that support asynchronous execution and real-time streaming.
* **Optional observability:** Integrate with tools like LangSmith to trace execution, evaluate retrieval quality, and debug latency.
* **Direct data access:** Directly ingest unstructured data from Azure Files, maintaining your existing storage hierarchy as the system of record.

## Tutorials

The following tutorials demonstrate how to build RAG pipelines over documents stored in Azure Files using LangChain with different vector databases:

| Vector database | Tutorial |
| :--- | :--- |
| Pinecone | [LangChain + Pinecone](../tutorials/langchain-pinecone/tutorial-langchain-pinecone.md) |
| Weaviate | [LangChain + Weaviate](../tutorials/langchain-weaviate/tutorial-langchain-weaviate.md) |
| Qdrant | [LangChain + Qdrant](../tutorials/langchain-qdrant/tutorial-langchain-qdrant.md) |

> [!NOTE]
> All tutorials require the same [project setup and prerequisites](../setup.md).

## Next steps

* [Azure Storage documentation](/azure/storage/)
* [LangChain documentation](https://python.langchain.com/docs/introduction/)
* [LangChain GitHub](https://github.com/langchain-ai/langchain)
