---
title: "Explore code (JavaScript tutorial)"
titleSuffix: Azure Cognitive Search
description: Understand the JavaScript SDK Search integration queries used in the Search-enabled website with this cheat sheet. 
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 09/13/2023
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

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/api/src/lib/config.js":::

## Azure Function: Search the catalog

The [Search API](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website-functions-v4/api/src/functions/search.js) takes a search term and searches across the documents in the search index, returning a list of matches. 

The Azure Function pulls in the search configuration information, and fulfills the query.

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/api/src/functions/search.js" :::

## Client: Search from the catalog

Call the Azure Function in the React client with the following code. 

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/client/src/pages/Search.js" highlight="88-100" :::

## Client: Facets from the catalog

This React component includes the search textbox and the [**facets**](search-faceted-navigation.md) associated with the search results. Facets need to be thought out and designed as part of the search schema when the search data is loaded. Then the facets are used in the search query, along with the search text, to provide the faceted navigation experience. 

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/client/src/components/Facets/Facets.js" highlight="49-76" :::

## Client: Pagination from the catalog

When the search results expand beyond a trivial few (8), the `@mui/material/TablePagination` component provides **pagination** across the results.

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/client/src/components/Pager.js" highlight="27" :::

When the user changes the page, that value is sent to the parent `Search.js` page from the `handleChangePage` function. The function sends a new request to the search API for the same query and the new page. The API response updates the facets, results, and pager components.

## Azure Function: Suggestions from the catalog

The [Suggest API](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website-functions-v4/api/src/functions/suggest.js) takes a search term while a user is typing and suggests search terms such as book titles and authors across the documents in the search index, returning a small list of matches. 

The search suggester, `sg`, is defined in the [schema file](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website-functions-v4/bulk-insert/good-books-index.json) used during bulk upload.

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/api/src/functions/suggest.js" :::

## Client: Suggestions from the catalog

The Suggest function API is called in the React app at `\src\components\SearchBar\SearchBar.js` as part of component initialization:

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/client/src/components/SearchBar.js" highlight="40-55, 75-117" :::

This React component uses the `@mui/material/Autocomplete` component to provide a search textbox, which also supports displaying suggestions (using the `renderInput` function). Autocomplete starts after the first several characters are entered. As each new character is entered, it's sent as a query to the search engine. The results are displayed as a short list of suggestions.

This autocomplete functionality is a common feature but this specific implementation has an additional use case. The customer can enter text and select from the suggestions _or_ submit their entered text. The input from the suggestion list as well as the input from the textbox must be tracked for changes, which impact how the form is rendered and what is sent to the **search** API when the form is submitted.

If your use case for search allows your user to select only from the suggestions, that will reduce the scope of complexity of the control but limit the user experience. 

## Azure Function: Get specific document 

The [Lookup API](https://github.com/Azure-Samples/azure-search-javascript-samples/blob/master/search-website-functions-v4/api/src/functions/lookup.js) takes an ID and returns the document object from the search index. 

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/api/src/functions/lookup.js" :::

## Client: Get specific document 

This function API is called in the React app at `\src\pages\Details\Detail.js` as part of component initialization:

:::code language="javascript" source="~/azure-search-javascript-samples/search-website-functions-v4/client/src/pages/Details.js" highlight="17-21,28" :::

If your client app can use pregenerated content, this page is a good candidate for autogeneration because the content is static, pulled directly from the search index.

## Next steps

In this tutorial series, you learned how to create and load a search index in JavaScript, and you built a web app that provides a search experience that includes a search bar, faceted navigation and filters, suggestions, pagination, and document lookup.

As a next step, you can extend this sample in several directions:

* Add [autocomplete](search-add-autocomplete-suggestions.md) for more typeahead.
* Add or modify [facets](search-faceted-navigation.md) and [filters](search-filters.md).
* Change the authentication and authorization model, using [Microsoft Entra ID](search-security-rbac.md) instead of [key-based authentication](search-security-api-keys.md).
* Change the [indexing methodology](search-what-is-data-import.md). Instead of pushing JSON to a search index, preload a blob container with the good-books dataset and [set up a blob indexer](search-howto-indexing-azure-blob-storage.md) to ingest the data. Knowing how to work with indexers gives you more options for data ingestion and [content enrichment](cognitive-search-concept-intro.md) during indexing.
