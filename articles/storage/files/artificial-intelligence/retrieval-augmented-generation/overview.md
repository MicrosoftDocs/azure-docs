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

Retrieval-augmented generation (RAG) is a technique for grounding a large language model's responses in your own content. Instead of relying only on what the model learned during training, a RAG pipeline:

- Converts your documents into vector embeddings
- Stores those embeddings in a searchable vector database
- At query time, retrieves the most relevant chunks for a user's question and passes them to an LLM, which generates an answer grounded in the retrieved content

The result is natural-language search over your own documents, with answers grounded in the retrieved content.

## Enable Azure Files for RAG workloads

Organizations often store large document collections on Azure file shares. The tutorials in this section show how to layer a RAG pipeline on top of an existing Azure file share, so you can add natural-language search over your documents without changing how the share is provisioned or configured.

Every tutorial in this section follows the same workflow, which can scale from local experimentation to an automated production pipeline:

:::image type="complex" source="../media/retrieval-augmented-generation/rag-workflow.png" alt-text="Diagram of the core RAG workflow, split into an Indexing lane and a Querying lane. In the Indexing lane, an Azure file share feeds an orchestration framework that loads and chunks documents, an Azure OpenAI embedding model converts the chunks into vectors, and the vectors are written to a vector database. In the Querying lane, a user's question is embedded by the same Azure OpenAI embedding model, matched against the same vector database by similarity search, and passed with the retrieved chunks to an Azure OpenAI chat model that generates a grounded answer.":::
   The workflow has two phases: **indexing**, which loads documents from an Azure file share, chunks them, embeds the chunks with an Azure OpenAI model, and stores the vectors in a vector database; and **querying**, which embeds a user's question, retrieves the top-K matching chunks from the vector database, and passes them with the question to an Azure OpenAI chat model to generate a grounded answer.
:::image-end:::

**Indexing:**

1. **Azure file share.** Enumerate and download source documents. See [Prepare Azure Files data](./open-source-frameworks/setup.md) for a reference implementation.
1. **Orchestration.** Use a framework to parse each file into text with Azure Files metadata, then split it into overlapping chunks for embedding.
1. **Azure OpenAI embedding model.** Send each chunk to an Azure OpenAI embedding deployment to produce a vector.
1. **Vector database.** Upsert the vectors, along with their text and source metadata, into a vector database.

**Querying:**

5. **Grounded answer.** Embed the user's question with the same embedding model, run a similarity search against the vector database for the top-K chunks, and pass the question and chunks to an Azure OpenAI chat model to generate a grounded answer.

## Common RAG scenarios

The tutorials in this section focus on document-based question answering, but the same indexing and querying pattern applies to any workload that searches your own content by similarity. Azure Files can hold the source data for many of these use cases:

- **Document question answering.** Ask natural-language questions about contracts, policies, manuals, research papers, and support articles stored on your file share.
- **Enterprise knowledge assistants.** Combine internal wikis, onboarding docs, and runbooks on Azure Files to power chat assistants that answer with links to the source file.
- **Fraud and anomaly detection.** Embed transaction records or log entries and compare them to past patterns to flag ones that look unusual.
- **Recommender systems.** Turn user preferences, product descriptions, or media metadata into embeddings, then find related items by similarity.
- **Code and configuration search.** Index source files, deployment templates, or configuration archives on Azure Files to power "find similar" and refactoring tools.
- **Compliance and eDiscovery.** Find documents that are similar in meaning to a reference file across large archival shares, even when they don't share the same keywords.

In each case, Azure Files holds the source data, and the RAG pipeline indexes it into a vector database that the application queries.

## Tutorials in this section

Start with the [setup article](./open-source-frameworks/setup.md) to prepare your project directory and authenticate to Azure Files, then choose a framework and vector database:

| | Pinecone | Weaviate | Qdrant |
| :--- | :--- | :--- | :--- |
| **LangChain** | [Tutorial](./open-source-frameworks/tutorials/langchain-pinecone/tutorial-langchain-pinecone.md) | [Tutorial](./open-source-frameworks/tutorials/langchain-weaviate/tutorial-langchain-weaviate.md) | [Tutorial](./open-source-frameworks/tutorials/langchain-qdrant/tutorial-langchain-qdrant.md) |
| **LlamaIndex** | [Tutorial](./open-source-frameworks/tutorials/llamaindex-pinecone/tutorial-llamaindex-pinecone.md) | [Tutorial](./open-source-frameworks/tutorials/llamaindex-weaviate/tutorial-llamaindex-weaviate.md) | [Tutorial](./open-source-frameworks/tutorials/llamaindex-qdrant/tutorial-llamaindex-qdrant.md) |
| **Haystack** | [Tutorial](./open-source-frameworks/tutorials/haystack-pinecone/tutorial-haystack-pinecone.md) | [Tutorial](./open-source-frameworks/tutorials/haystack-weaviate/tutorial-haystack-weaviate.md) | [Tutorial](./open-source-frameworks/tutorials/haystack-qdrant/tutorial-haystack-qdrant.md) |

## Related content

- [Explore Azure Files features and capabilities](/azure/storage/files/storage-files-introduction).
- [Learn more about retrieval-augmented generation (RAG)](/azure/ai-studio/concepts/retrieval-augmented-generation).
- [Review Azure OpenAI models and deployment options](/azure/ai-services/openai/overview).
