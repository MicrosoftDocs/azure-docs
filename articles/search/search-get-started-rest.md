---
title: 'Quickstart: Create a search index using REST APIs'
titleSuffix: Azure Cognitive Search
description: In this REST API quickstart, learn how to call the Azure Cognitive Search REST APIs using either Postman or Visual Studio Code. 

zone_pivot_groups: URL-test-interface-rest-apis
manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.devlang: rest-api
ms.date: 11/17/2020
---

# Quickstart: Create an Azure Cognitive Search index using REST APIs

This article explains how to formulate REST API requests interactively using the [Azure Cognitive Search REST APIs](/rest/api/searchservice) and an API client for sending and receiving requests. With an API client and these instructions, you can send requests and view responses before writing any code.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

::: zone pivot="url-test-tool-rest-postman"

[!INCLUDE [Send requests using Postman](includes/search-get-started-rest-postman.md)]

::: zone-end

::: zone pivot="url-test-tool-rest-vscode-ext"

[!INCLUDE [Send requests using Visual Studio Code](includes/search-get-started-rest-vscode-ext.md)]

::: zone-end

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you are using a free service, remember that you are limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit. 

## Next steps

Now that you know how to perform core tasks, you can move forward with additional REST API calls for more advanced features, such as indexers or [setting up an enrichment pipeline](cognitive-search-tutorial-blob.md) that adds content transformations to indexing. For your next step, we recommend the following link:

> [!div class="nextstepaction"]
> [Tutorial: Use REST and AI to generate searchable content from Azure blobs](cognitive-search-tutorial-blob.md)