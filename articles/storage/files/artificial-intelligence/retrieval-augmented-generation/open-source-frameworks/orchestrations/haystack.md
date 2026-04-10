---
title: Build RAG pipelines with Haystack and Azure Files
description: Use Haystack as an orchestration framework to build retrieval-augmented generation (RAG) pipelines using data stored in Azure Files.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: overview
ms.date: 04/09/2026
ms.author: t-flynnr
---

# Haystack with Azure Files

Haystack is an open-source framework that models every pipeline as a directed acyclic graph (DAG) of typed components. By using Haystack with Azure Files, you can build retrieval-augmented generation (RAG) pipelines that use your existing file shares as a primary data source.

Haystack separates indexing (embed and write) from querying (embed, retrieve, prompt, and generate) into distinct pipeline objects, making each independently testable and deployable.

## Why use Haystack with Azure Files?

* **Explicit pipeline DAGs:** Every component is a separate, typed node with named input and output sockets. You can visualize the pipeline, validate connections at build time, and trace data through each stage.
* **Separate indexing and query pipelines:** Haystack separates ingestion from retrieval into distinct pipeline objects, making each independently testable and deployable.
* **Custom components via `@component`:** Any Python class decorated with `@component` becomes a pipeline node with typed sockets, making it straightforward to add custom filtering or domain-specific logic as a first-class pipeline node.
* **Built-in evaluation tools:** Haystack includes evaluation components for measuring retrieval and generation quality, so you can quantify the impact of changes to your pipeline.

## Tutorials

The following tutorials demonstrate how to build RAG pipelines over documents stored in Azure Files using Haystack with different vector databases:

| Vector database | Tutorial |
| :--- | :--- |
| Pinecone | [Haystack + Pinecone](../tutorials/haystack-pinecone/tutorial-haystack-pinecone.md) |
| Weaviate | [Haystack + Weaviate](../tutorials/haystack-weaviate/tutorial-haystack-weaviate.md) |
| Qdrant | [Haystack + Qdrant](../tutorials/haystack-qdrant/tutorial-haystack-qdrant.md) |

> [!NOTE]
> All tutorials require the same [project setup and prerequisites](../setup.md).

## Next steps

* [Azure Storage documentation](/azure/storage/)
* [Haystack documentation](https://docs.haystack.deepset.ai/)
* [Haystack GitHub](https://github.com/deepset-ai/haystack)
