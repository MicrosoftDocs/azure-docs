---
title: Retrieval augmented generation in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces retrieval augmented generation for use in generative AI applications.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: eur
---

# Retrieval augmented generation and indexes

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

This article talks about the importance and need for Retrieval Augmented Generation (RAG) and Index in generative AI. 

## What is RAG?

Some basics first. Large language models (LLMs) like ChatGPT are trained on public internet data which was available at the point in time when they were trained. They can answer questions related to the data they were trained on. This public data might not be sufficient to meet all your needs. You might want questions answered based on your private data. Or, the public data might simply have gotten out of date. The solution to this problem is Retrieval Augmented Generation (RAG), a pattern used in AI which uses an LLM to generate answers with your own data.

## How does RAG work?

RAG is a pattern which uses your data with an LLM to generate answers specific to your data. When a user asks a question, the data store is searched based on user input. The user question is then combined with the matching results and sent to the LLM using a prompt (explicit instructions to an AI or machine learning model) to generate the desired answer. This can be illustrated as follows.

:::image type="content" source="../media/index-retrieve/rag-pattern.png" alt-text="Screenshot of the RAG pattern." lightbox="../media/index-retrieve/rag-pattern.png":::


## What is an Index and why do I need it?

RAG uses your data to generate answers to the user question. For RAG to work well, we need to find a way to search and send your data in an easy and cost efficient manner to the LLMs. This is achieved by using an Index. An Index is a data store which allows you to search data efficiently. This is very useful in RAG. An Index can be optimized for LLMs by creating Vectors (text/data converted to number sequences using an embedding model). A good Index usually has efficient search capabilities like keyword searches, semantic searches, vector searches or a combination of these. This optimized RAG pattern can be illustrated as follows.

:::image type="content" source="../media/index-retrieve/rag-pattern-with-index.png" alt-text="Screenshot of the RAG pattern with index." lightbox="../media/index-retrieve/rag-pattern-with-index.png":::


Azure AI provides an Index asset to use with RAG pattern. The Index asset contains important information like where is your index stored, how to access your index, what are the modes in which your index can be searched, does your index have vectors, what is the embedding model used for vectors etc. The Azure AI Index uses [Azure AI Search](/azure/search/search-what-is-azure-search) as the primary / recommended Index store. Azure AI Search is an Azure resource that supports information retrieval over your vector and textual data stored in search indexes.

Azure AI Index also supports [FAISS](https://github.com/facebookresearch/faiss) (Facebook AI Similarity Search) which is an open source library that provides a local file-based store. FAISS supports vector only search capabilities and is supported via SDK only.


## Next steps

- [Create a vector index](../how-to/index-add.md)
- [Check out the Azure AI samples for RAG](https://github.com/Azure-Samples/azureai-samples/notebooks/rag)
  











