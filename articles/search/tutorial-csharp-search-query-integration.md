---
title: ".NET tutorial: Search integration highlights"
titleSuffix: Azure Cognitive Search
description: Understand the .NET SDK Search integration queries used in the Search-enabled website with this cheat sheet.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 04/23/2021
ms.custom: devx-track-csharp
ms.devlang: dotnet
---

# 4 - .NET Search integration cheat sheet

In the previous lessons, you added search to a Static Web App. This lesson highlights the essential steps that establish integration. If you are looking for a cheat sheet on how to integrate search into your web app, this article explains what you need to know.

The application is available: 
* [Sample](https://github.com/azure-samples/azure-search-dotnet-samples/tree/master/search-website)
* [Demo website - aka.ms/azs-good-books](https://aka.ms/azs-good-books)

## Azure SDK Azure.Search.Documents

The Function app uses the Azure SDK for Cognitive Search:

* NuGet: [Azure.Search.Documents](https://www.nuget.org/packages/Azure.Search.Documents/)
* Reference Documentation: [Client Library](/dotnet/api/overview/azure/search)

The Function app authenticates through the SDK to the cloud-based Cognitive Search API using your resource name, resource key, and index name. The secrets are stored in the Static Web App settings and pulled in to the Function as environment variables. 

## Configure secrets in a local.settings.json file

1. Create a new file named `local.settings.json` at `./api/` and copy the following JSON object into the file.

    ```json
    {
      "IsEncrypted": false,
      "Values": {
        "AzureWebJobsStorage": "",
        "FUNCTIONS_WORKER_RUNTIME": "dotnet",
        "SearchApiKey": "YOUR_SEARCH_QUERY_KEY",
        "SearchServiceName": "YOUR_SEARCH_RESOURCE_NAME",
        "SearchIndexName": "good-books"
      }
    }
    ```

1. Change the following for you own Search resource values: 
    * YOUR_SEARCH_RESOURCE_NAME
    * YOUR_SEARCH_QUERY_KEY

## Azure Function: Search the catalog

The `Search` [API](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/search-website/api/Search.cs) takes a search term and searches across the documents in the Search Index, returning a list of matches. 

The Azure Function pulls in the Search configuration information, and fulfills the query.

:::code language="csharp" source="~/azure-search-dotnet-samples/search-website/api/Search.cs" highlight="22-24, 55" :::

## Client: Search from the catalog

Call the Azure Function in the React client with the following code. 

:::code language="javascript" source="~/azure-search-dotnet-samples/search-website/src/pages/Search/Search.js" highlight="40-51" :::

## Azure Function: Suggestions from the catalog

The `Suggest` [API](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/search-website/api/Suggest.cs) takes a search term while a user is typing and suggests search terms such as book titles and authors across the documents in the search index, returning a small list of matches. 

The search suggester, `sg`, is defined in the [schema file](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/search-website/bulk-insert/BookSearchIndex.cs) used during bulk upload.

:::code language="csharp" source="~/azure-search-dotnet-samples/search-website/api/Suggest.cs" highlight="21-23, 50-52" :::

## Client: Suggestions from the catalog

Th Suggest function API is called in the React app at `\src\components\SearchBar\SearchBar.js` as part of component initialization:

:::code language="javascript" source="~/azure-search-dotnet-samples/search-website/src/components/SearchBar/SearchBar.js" highlight="52-60" :::

## Azure Function: Get specific document 

The `Lookup` [API](https://github.com/Azure-Samples/azure-search-dotent-samples/blob/master/search-website/api/Lookup.cs) takes a ID and returns the document object from the Search Index. 

:::code language="csharp" source="~/azure-search-dotnet-samples/search-website/api/Lookup.cs" highlight="19-21, 42" :::

## Client: Get specific document 

This function API is called in the React app at `\src\pages\Details\Detail.js` as part of component initialization:

:::code language="javascript" source="~/azure-search-dotnet-samples/search-website/src/pages/Details/Details.js" highlight="19-29" :::

## C# models to support function app

The following models are used to support the functions in this app.

:::code language="csharp" source="~/azure-search-dotnet-samples/search-website/api/Models.cs" :::

## Next steps

* [Index Azure SQL data](search-indexer-tutorial.md)
