---
title: How-to use Azure OpenAI's search operation
titleSuffix: Azure OpenAI
description: Learn how to search across documents with Azure OpenAI
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: how-to
ms.date: 06/24/2022
recommendations: false
keywords:
---


# How to use Azure OpenAI's search operation

The search endpoint ([/search](../reference.md#search)) allows you to do a semantic search over a set of documents. This means that you can provide a query, such as a natural language question or a statement, and the provided documents will be scored and ranked based on how semantically related they're to the input query.

The "documents" can be words, sentences, paragraphs or even longer documents. For example, if you provide documents `["White House", "hospital", "school"]` and query "the president", you’ll get a different similarity score for each document. The higher the similarity score, the more semantically similar the document is to the query (in this example, "White House" will be most similar to "the president").

## Providing documents

Up to 200 documents can be passed as part of the request using the documents parameter.

> [!NOTE]
> At this time we do not support passing documents as a file. if you have a larger set of documents we recommend using our Embeddings API <!--TODO:Replace with link[Embeddings API](./Use%20Embeddings.md)--> to generate embeddings for your content.

## Understanding similarity scores

The similarity score is a positive score that usually ranges from 0 to 300 (but can sometimes go higher), where a score above 200 usually means the document is semantically similar to the query. At the moment, the score is very useful for ranking. We've seen it outperform many existing semantic ranking approaches.For example, you can use it for re-ranking the top few hundred examples from an existing information retrieval system.

Each search query produces a different distribution of scores for a fixed group of documents. For instance, if you have a group of documents that are summaries of books, the query "sci-fi novels" might have a mean score of 150 and standard deviation of 50, whereas the query "cat training" might have a mean score of 200 and standard deviation of 10, if you were to search these queries against every document in the group. The variation is a consequence of the search setup, where the query's probability (what is used to create the score) is conditioned on the document's probability.

If you need scores that don't vary by query, you can randomly sample 50-100 documents for a query and calculate the mean and standard deviation, then normalize new scores for that same query using that mean and standard deviation.

## Next steps

Learn more about the [underlying engines/models that power Azure OpenAI](../concepts/engines.md).