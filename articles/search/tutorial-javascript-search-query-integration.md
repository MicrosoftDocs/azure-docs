---
title: "Explore code (JavaScript tutorial)"
titleSuffix: Azure Cognitive Search
description: Understand the JavaScript SDK Search integration queries used in the Search-enabled website with this cheat sheet. 
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 07/18/2023
ms.custom: devx-track-js
ms.devlang: javascript
---

# 4 - Explore the JavaScript search code

In the previous lessons, you added search to a Static Web App. This lesson highlights the essential steps that establish integration. If you're looking for a cheat sheet on how to integrate search into your JavaScript app, this article explains what you need to know.

The application is available: 
* [Sample](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/master/search-website-functions-v4)
* [Demo website - aka.ms/azs-good-books](https://aka.ms/azs-good-books)

## Azure SDK @azure/search-documents 

The Function app uses the Azure SDK for Cognitive Search:

* NPM: [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents)
* Reference Documentation: [Client Library](/javascript/api/overview/azure/search-documents-readme)

The Function app authenticates through the SDK to the cloud-based Cognitive Search API using your resource name, resource key, and index name. The secrets are stored in the Static Web App settings and pulled in to the Function as environment variables. 

## Configure secrets in a configuration file

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/api-v4/src/lib/config.js":::

## Azure Function: Search the catalog

The `Search` [API](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website-functions-v4/api-v4/src/functions/search.js) takes a search term and searches across the documents in the Search Index, returning a list of matches. 

The Azure Function pulls in the Search configuration information, and fulfills the query.

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/api-v4/src/functions/search.js" :::

## Client: Search from the catalog

Call the Azure Function in the React client with the following code. 

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/client-v4/src/pages/Search/Search.js" highlight="41-52" :::

## Azure Function: Suggestions from the catalog

The `Suggest` [API](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website-functions-v4/api-v4/src/functions/suggest.js) takes a search term while a user is typing and suggests search terms such as book titles and authors across the documents in the search index, returning a small list of matches. 

The search suggester, `sg`, is defined in the [schema file](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website-functions-v4/bulk-insert-v4/good-books-index.json) used during bulk upload.

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/api-v4/src/functions/suggest.js" :::

## Client: Suggestions from the catalog

The Suggest function API is called in the React app at `\src\components\SearchBar\SearchBar.js` as part of component initialization:

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/client-v4/src/components/SearchBar/SearchBar.js" highlight="52-60" :::

## Azure Function: Get specific document 

The `Lookup` [API](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website-functions-v4/api-v4/src/functions/lookup.js) takes an ID and returns the document object from the Search Index. 

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/api-v4/src/functions/lookup.js" :::

## Client: Get specific document 

This function API is called in the React app at `\src\pages\Details\Detail.js` as part of component initialization:

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/client-v4/src/pages/Details/Details.js" highlight="20-30" :::

## Next steps

* [Index Azure SQL data](search-indexer-tutorial.md)
