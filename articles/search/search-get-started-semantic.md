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

> [!IMPORTANT]
> Semantic search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through Azure portal, preview REST APIs, and beta SDKs. This feature is billable. See [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

In Azure Cognitive Search, [semantic search](semantic-search-overview.md) is query-side functionality that uses AI from Microsoft to re-score search results, moving results that have more semantic relevance to the top of the list. Semantic search improves an initial result set was generated from a BM25 ranking. In many cases, semantic search significantly improves overall relevance, with minimal work for the developer.

This quickstart shows the query modifications that invoke semantic search. 

## Prerequisites

+ Azure Cognitive Search, at Standard one (S1) tier or higher, with [semantic search enabled](semantic-search-overview.md#enable-semantic-search).

+ An existing search index, with a client that can send queries. Run at least one query on your index to verify it's operational.

  For this quickstart, we use the small index of four hotels created in the [full text search quickstart](search-get-started-text.md). A small index with minimal content is suboptimal for semantic search, but the quickstarts include query logic for a broad range of clients, which is useful for learning syntax.

+ An API key and search endpoint:

  [Sign in to the Azure portal](https://portal.azure.com/) and [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).

  In **Overview**, copy the URL and save it to Notepad for a later step. An example endpoint might look like `https://mydemo.search.windows.net`.

  In **Keys**, copy and save an admin key for full rights to create and delete objects. There are two interchangeable primary and secondary keys. Choose either one.

  ![Get an HTTP endpoint and access key](media/search-get-started-rest/get-url-key.png "Get an HTTP endpoint and access key")

## Add semantic search

You can update an existing search index to include a *semantic configuration* and a *semantic query type*. This update doesn't require a reindexing of content. 

+ A semantic configuration establishes a priority order for fields that contribute a title, keywords, and content used in semantic reranking. Specifying field priority is necessary for query performance.

+ Queries that invoke semantic search include parameters for query type, query language, and whether captions and answers are returned. 

### [**Python**](#tab/python)

[!INCLUDE [python-sdk-semantic-quickstart](includes/quickstarts/python-semantic.md)]

---

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

## Next steps

In this quickstart, you learned how to invoke semantic search on an existing index. We recommend trying semantic search on your own indexes as a next step. However, if you want to continue with demos, visit the following link.

> [!div class="nextstepaction"]
> [Tutorial: Add search to web apps](tutorial-python-overview.md)
