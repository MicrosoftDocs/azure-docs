---
title: "Explore code (JavaScript tutorial)"
titleSuffix: Azure Cognitive Search
description: Understand the JavaScript SDK Search integration queries used in the Search-enabled website with this cheat sheet. 
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 08/29/2023
ms.custom: devx-track-js
ms.devlang: javascript
---

# 4 - Explore the JavaScript search code

In the previous lessons, you added search to a static web app. This lesson highlights the essential steps that establish integration. If you're looking for a cheat sheet on how to integrate search into your JavaScript app, this article explains what you need to know.

The source code is available in the [azure-search-javascript-samples](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/master/search-website-functions-v4) GitHub repository.

## Azure SDK @azure/search-documents 

The Function app uses the Azure SDK for Cognitive Search:

* NPM: [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents)
* Reference Documentation: [Client Library](/javascript/api/overview/azure/search-documents-readme)

The Function app authenticates through the SDK to the cloud-based Cognitive Search API using your resource name, [API key](search-security-api-keys.md), and index name. The secrets are stored in the static web app settings and pulled in to the function as environment variables. 

## Configure secrets in a configuration file

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/api-v4/src/lib/config.js":::

## Azure Function: Search the catalog

The [Search API](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website-functions-v4/api-v4/src/functions/search.js) takes a search term and searches across the documents in the search index, returning a list of matches. 

The Azure Function pulls in the search configuration information, and fulfills the query.

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/api-v4/src/functions/search.js" :::

## Client: Search from the catalog

Call the Azure Function in the React client with the following code. 

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/client-v4/src/pages/Search/Search.js" highlight="41-52" :::

## Azure Function: Suggestions from the catalog

The [Suggest API](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website-functions-v4/api-v4/src/functions/suggest.js) takes a search term while a user is typing and suggests search terms such as book titles and authors across the documents in the search index, returning a small list of matches. 

The search suggester, `sg`, is defined in the [schema file](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website-functions-v4/bulk-insert-v4/good-books-index.json) used during bulk upload.

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/api-v4/src/functions/suggest.js" :::

## Client: Suggestions from the catalog

The Suggest function API is called in the React app at `\src\components\SearchBar\SearchBar.js` as part of component initialization:

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/client-v4/src/components/SearchBar/SearchBar.js" highlight="52-60" :::

## Azure Function: Get specific document 

The [Lookup API](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website-functions-v4/api-v4/src/functions/lookup.js) takes an ID and returns the document object from the search index. 

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/api-v4/src/functions/lookup.js" :::

## Client: Get specific document 

This function API is called in the React app at `\src\pages\Details\Detail.js` as part of component initialization:

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/client-v4/src/pages/Details/Details.js" highlight="20-30" :::

## Next steps

In this tutorial series, you learned how to create and load a search index in JavaScript, and you built a web app that provides a search experience that includes a search bar, faceted navigation and filters, suggestions, pagination, and document lookup.

As a next step, you can extend this sample in several directions:

* Add [autocomplete](search-add-autocomplete-suggestions.md) for more typeahead.
* Add or modify [facets](search-faceted-navigation.md) and [filters](search-filters.md).
* Change the authentication and authorization model, using [Azure Active Directory](search-security-rbac.md) instead of [key-based authentication](search-security-api-keys.md).
* Change the [indexing methodology](search-what-is-data-import.md). Instead of pushing JSON to a search index, preload a blob container with the good-books dataset and [set up a blob indexer](search-howto-indexing-azure-blob-storage.md) to ingest the data. Knowing how to work with indexers gives you more options for data ingestion and [content enrichment](cognitive-search-concept-intro.md) during indexing.
