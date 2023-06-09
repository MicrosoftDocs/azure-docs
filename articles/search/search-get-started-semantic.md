---
title: 'Quickstart: semantic search'
titleSuffix: Azure Cognitive Search
description: Change an existing index to use semantic search.
author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 06/09/2023
---

# Quickstart: Use semantic search with an existing index

In Azure Cognitive Search, [semantic search](semantic-search-overview.md) is query-side functionality that uses pre-trained AI from Microsoft to analyze and re-rank search results. For many scenarios, semantic search significantly improves relevance, with minimal work for the developer.

This quickstart shows you how to modify a query so that it invokes the semantic re-ranker and returns both "captions" and "answers".

## Prerequisites

+ Azure Cognitive Search, at Standard one (S1) or higher, with semantic search enabled.

+ An existing search index and a client that can send queries. 

  For this quickstart, we use the small index of 4 hotels created in the [text search quickstart](search-get-started-text.md). A small index with minimal content is suboptimal for semantic search, but the quickstarts provide query syntax in a broad range of clients, which is useful for learning the configuration.

## Next steps

In this quickstart, you learned the steps for invoking semantic search. We recommend trying semantic search on your own content as a next step. However, if instead you want to work with additional demos, visit the following link.

> [!div class="nextstepaction"]
> [Tutorial: Add search to web apps](tutorial-python-overview.md)
