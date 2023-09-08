---
title: 'Quickstart: semantic search'
titleSuffix: Azure Cognitive Search
description: Change an existing index to use semantic search.
author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.custom: devx-track-dotnet, devx-track-python
ms.topic: quickstart
ms.date: 06/09/2023
---

# Quickstart: Use semantic search with an existing index

> [!IMPORTANT]
> Semantic search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through Azure portal, preview REST APIs, and beta SDKs. This feature is billable. See [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

In Azure Cognitive Search, [semantic search](semantic-search-overview.md) is query-side functionality that uses AI from Microsoft to rescore search results, moving results that have more semantic relevance to the top of the list. Depending on the content and the query, semantic search can significantly improve a BM25-ranked result set, with minimal work for the developer.

This quickstart walks you through the query modifications that invoke semantic search.

> [!NOTE]
> Looking for a Cognitive Search solution with ChatGPT interaction? See [this demo](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/README.md) for details.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

+ Azure Cognitive Search, at Basic tier or higher, with [semantic search enabled](semantic-how-to-enable-disable.md).

+ An API key and service endpoint:

  Sign in to the [Azure portal](https://portal.azure.com) and [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).

  In **Overview**, copy the URL and save it to Notepad for a later step. An example endpoint might look like `https://mydemo.search.windows.net`.

  In **Keys**, copy and save an admin key for full rights to create and delete objects. There are two interchangeable primary and secondary keys. Choose either one.

  ![Get an HTTP endpoint and access key](media/search-get-started-rest/get-url-key.png "Get an HTTP endpoint and access key")

## Add semantic search

To use semantic search, add a *semantic configuration* to a search index, and add parameters to a query. If you have an existing index, you can make these changes without having to reindex your content because there's no impact on the structure of your searchable content.

+ A semantic configuration establishes a priority order for fields that contribute a title, keywords, and content used in semantic reranking. Field prioritization allows for faster processing.

+ Queries that invoke semantic search include parameters for query type, query language, and whether captions and answers are returned. You can add these parameters to your existing query logic. There's no conflict with other parameters.

In this section, we assume the same small hotels index (four documents only) created in the [full text search quickstart](search-get-started-text.md). A small index with minimal content is suboptimal for semantic search, but the quickstarts include query logic for a broad range of clients, which is useful when the objective is to learn syntax.

### [**.NET**](#tab/dotnet)

[!INCLUDE [dotnet-sdk-semantic-quickstart](includes/quickstarts/dotnet-semantic.md)]

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
