---
title: Retrieval-Augmented Generation (RAG) with Azure Files
description: Learn how to build retrieval-augmented generation (RAG) pipelines over documents stored in Azure Files, using either Azure-native AI services or non-Microsoft open-source AI tooling for orchestration, embeddings, and vector search.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: overview
ms.date: 04/09/2026
ms.author: t-flynnr
ms.custom: devx-track-python
---

# Retrieval-Augmented Generation (RAG) with Azure Files

This article explains how Azure Files can serve as the document source for retrieval-augmented generation (RAG) pipelines.

## Data discovery at scale

Organizations often store large document collections—sometimes millions of files—on Azure file shares. Locating relevant information across these shares typically requires traversing directory hierarchies and inspecting files individually, using tools such as File Explorer via Server Message Block (SMB), or command-line and programmatic interfaces via SMB or Network File System (NFS).

At the same time, Azure file shares are commonly deployed within environments that enforce strict identity-based access controls and corporate networking policies. Any AI-based solution must respect these existing security and governance boundaries.

## Retrieval-augmented generation (RAG)

Retrieval-augmented generation (RAG) pipelines reduce the burden of manual search while preserving existing identity, permission, and networking controls. RAG pipelines work by:

- Converting documents into vector embeddings
- Storing those embeddings in a searchable vector database
- Using a large language model (LLM) to generate responses grounded in retrieved content

This approach enables users to query their files using natural language and receive context-aware answers scoped only to content a user is authorized to access.

## Core RAG workflow

The tutorials in this section provide minimal, end-to-end reference implementations that demonstrate how developer-owned RAG pipelines can be layered on top of administrator-managed Azure Files, using either open-source AI tooling or Azure-native AI services.

Although each tutorial uses a different orchestration framework and vector database, they all follow the same core workflow, which can scale from local experimentation to an automated production pipeline:

1. Enumerate and download files from an Azure file share using a mount point or the Azure Files Python SDK
1. Parse each file into a document containing extracted text and Azure Files metadata
1. Split each document into overlapping text chunks suitable for embedding
1. Generate vector embeddings using Azure OpenAI and store them in a vector database
1. Build a question-answering chain using a large language model (LLM) that embeds a user's query, retrieves the most relevant chunks from the vector database, and generates a response that is grounded in the retrieved context

## Related content

- [Explore Azure Files features and capabilities](/azure/storage/files/storage-files-introduction).
- [Learn more about retrieval-augmented generation (RAG)](/azure/ai-studio/concepts/retrieval-augmented-generation).
- [Review Azure OpenAI models and deployment options](/azure/ai-services/openai/overview).
