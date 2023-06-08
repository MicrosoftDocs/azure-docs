---
title: 'Quickstart: Use Azure SDKs'
titleSuffix: Azure Cognitive Search
description: "Create, load, and query a search index using the Azure SDKs for .NET, Python, Java, and JavaScript."
manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 06/09/2023
---

# Quickstart: Create a search index using the Azure SDKs

Learn how to use the **Azure.Search.Documents** client library in the Azure SDKs to create, load, and query a search index using sample data.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

+ An Azure Cognitive Search service. [Create a service](search-create-service-portal.md) or [find an existing service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices). You can use a free service for this quickstart.

+ An API key and search endpdoint:

  1. [Sign in to the Azure portal](https://portal.azure.com/).

  1. In your search service **Overview** page, copy the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

  1. In **Settings** > **Keys**, get an admin key for full rights on the service, required if you're creating or deleting objects. There are two interchangeable primary and secondary keys. Choose either one.

     ![Get an HTTP endpoint and access key](media/search-get-started-rest/get-url-key.png "Get an HTTP endpoint and access key")

## Create, load, and query an index

**Azure.Search.Documents** client libraries are available in Azure SDK for .NET, Python, Java, and JavaScript.

## [**.NET**](#tab/dotnet)

[!INCLUDE [python-sdk-quickstart](includes/quickstarts/dotnet.md)]

## [**Python**](#tab/python)

[!INCLUDE [python-sdk-quickstart](includes/quickstarts/python.md)]

## [**Java**](#tab/java)

[!INCLUDE [java-sdk-quickstart](includes/quickstarts/java.md)]

## [**JavaScript**](#tab/javascript)

[!INCLUDE [javascript-sdk-quickstart](includes/quickstarts/javascript.md)]

---

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you're using a free service, remember that you're limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit.

## Next steps

In this quickstart, you worked through a set of tasks to create an index, load it with documents, and run queries. At different stages, we took shortcuts to simplify the code for readability and comprehension. Now that you're familiar with the basic concepts, try a tutorial hat calls the Cognitive Search APIs in a web app.

> [!div class="nextstepaction"]
> [Tutorial: Add search to web apps](tutorial-csharp-overview.md)
