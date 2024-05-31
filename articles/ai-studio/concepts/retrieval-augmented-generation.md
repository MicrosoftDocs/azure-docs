---
title: Retrieval augmented generation in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces retrieval augmented generation for use in generative AI applications.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: conceptual
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: eur
author: eric-urban
---

# Retrieval augmented generation and indexes

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

This article talks about the importance and need for Retrieval Augmented Generation (RAG) and index in generative AI. 

## What is RAG?

Some basics first. Large language models (LLMs) like ChatGPT are trained on public internet data which was available at the point in time when they were trained. They can answer questions related to the data they were trained on. This public data might not be sufficient to meet all your needs. You might want questions answered based on your private data. Or, the public data might simply have gotten out of date. The solution to this problem is Retrieval Augmented Generation (RAG), a pattern used in AI which uses an LLM to generate answers with your own data.

## How does RAG work?

RAG is a pattern which uses your data with an LLM to generate answers specific to your data. When a user asks a question, the data store is searched based on user input. The user question is then combined with the matching results and sent to the LLM using a prompt (explicit instructions to an AI or machine learning model) to generate the desired answer. This can be illustrated as follows.

:::image type="content" source="../media/index-retrieve/rag-pattern.png" alt-text="Screenshot of the RAG pattern." lightbox="../media/index-retrieve/rag-pattern.png":::


## What is an index and why do I need it?

RAG uses your data to generate answers to the user question. For RAG to work well, we need to find a way to search and send your data in an easy and cost efficient manner to the LLMs. This is achieved by using an index. An index is a data store which allows you to search data efficiently. This is very useful in RAG. An index can be optimized for LLMs by creating vectors (text data converted to number sequences using an embedding model). A good index usually has efficient search capabilities like keyword searches, semantic searches, vector searches or a combination of these. This optimized RAG pattern can be illustrated as follows.

:::image type="content" source="../media/index-retrieve/rag-pattern-with-index.png" alt-text="Screenshot of the RAG pattern with index." lightbox="../media/index-retrieve/rag-pattern-with-index.png":::

Azure AI provides an index asset to use with RAG pattern. The index asset contains important information like where is your index stored, how to access your index, what are the modes in which your index can be searched, does your index have vectors, what is the embedding model used for vectors etc. The Azure AI index uses [Azure AI Search](/azure/search/search-what-is-azure-search) as the primary and recommended index store. Azure AI Search is an Azure resource that supports information retrieval over your vector and textual data stored in search indexes.

## Next steps

- [Create a vector index](../how-to/index-add.md)
