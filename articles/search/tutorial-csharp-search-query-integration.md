---
title: "Explore code (.NET tutorial)"
titleSuffix: Azure AI Search
description: Understand the .NET SDK Search integration queries used in the Search-enabled website with this cheat sheet.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 07/18/2023
ms.custom:
  - devx-track-csharp
  - devx-track-dotnet
  - ignite-2023
ms.devlang: csharp
---

# 4 - Explore the .NET search code

In the previous lessons, you added search to a Static Web App. This lesson highlights the essential steps that establish integration. If you're looking for a cheat sheet on how to integrate search into your web app, this article explains what you need to know.

The application is available: 
* [Sample](https://github.com/azure-samples/azure-search-dotnet-samples/tree/master/search-website-functions-v4)
* [Demo website - aka.ms/azs-good-books](https://aka.ms/azs-good-books)

## Azure SDK Azure.Search.Documents

The Function app uses the Azure SDK for Azure AI Search:

* NuGet: [Azure.Search.Documents](https://www.nuget.org/packages/Azure.Search.Documents/)
* Reference Documentation: [Client Library](/dotnet/api/overview/azure/search)

The Function app authenticates through the SDK to the cloud-based Azure AI Search API using your resource name, resource key, and index name. The secrets are stored in the Static Web App settings and pulled in to the Function as environment variables. 

## Configure secrets in a local.settings.json file

:::code language="json" source="~/azure-search-dotnet-samples/search-website-functions-v4/api/local.settings.json":::

## Azure Function: Search the catalog

The `Search` [API](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/search-website-functions-v4/api/Search.cs) takes a search term and searches across the documents in the Search Index, returning a list of matches. 

The Azure Function pulls in the Search configuration information, and fulfills the query.

:::code language="csharp" source="~/azure-search-dotnet-samples/search-website-functions-v4/api/Search.cs" :::

## Client: Search from the catalog

Call the Azure Function in the React client with the following code. 

:::code language="javascript" source="~/azure-search-dotnet-samples/search-website-functions-v4/client/src/pages/Search/Search.js" :::

## Azure Function: Suggestions from the catalog

The `Suggest` [API](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/search-website-functions-v4/api/Suggest.cs) takes a search term while a user is typing and suggests search terms such as book titles and authors across the documents in the search index, returning a small list of matches. 

The search suggester, `sg`, is defined in the [schema file](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/search-website-functions-v4/bulk-insert/BookSearchIndex.cs) used during bulk upload.

:::code language="csharp" source="~/azure-search-dotnet-samples/search-website-functions-v4/api/Suggest.cs"  :::

## Client: Suggestions from the catalog

The Suggest function API is called in the React app at `\client\src\components\SearchBar\SearchBar.js` as part of component initialization:

:::code language="javascript" source="~/azure-search-dotnet-samples/search-website-functions-v4/client/src/components/SearchBar/SearchBar.js" :::

## Azure Function: Get specific document 

The `Lookup` [API](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/search-website-functions-v4/api/Lookup.cs) takes an ID and returns the document object from the Search Index. 

:::code language="csharp" source="~/azure-search-dotnet-samples/search-website-functions-v4/api/Lookup.cs"  :::

## Client: Get specific document 

This function API is called in the React app at `\client\src\pages\Details\Detail.js` as part of component initialization:

:::code language="javascript" source="~/azure-search-dotnet-samples/search-website-functions-v4/client/src/pages/Details/Details.js"  :::

## C# models to support function app

The following models are used to support the functions in this app.

:::code language="csharp" source="~/azure-search-dotnet-samples/search-website-functions-v4/api/Models.cs" :::

## Next steps

* [Index Azure SQL data](search-indexer-tutorial.md)
