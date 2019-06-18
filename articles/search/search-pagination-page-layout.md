---
title: How to work with search results - Azure Search
description: Structure and sort search results, get a document count, and add content navigation to search results in Azure Search.
author: HeidiSteen
manager: cgronlun
services: search
ms.service: search
ms.devlang: 
ms.topic: conceptual
ms.date: 06/13/2019
ms.author: heidist
ms.custom: seodec2018
---
# How to work with search results in Azure Search
This article provides guidance on how to implement standard elements of a search results page, such as total counts, document retrieval, sort orders, and navigation. Page-related options that contribute data or information to your search results are specified through the [Search Document](https://docs.microsoft.com/rest/api/searchservice/Search-Documents) requests sent to your Azure Search Service. 

In the REST API, requests include a GET command, path, and query parameters that inform the service what is being requested, and how to formulate the response. In the .NET SDK, the equivalent API is [DocumentSearchResult Class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.documentsearchresult-1).

Several code samples include a web frontend interface, which you can find here: [New York City Jobs demo app](https://azjobsdemo.azurewebsites.net/) and [CognitiveSearchFrontEnd](https://github.com/LuisCabrer/CognitiveSearchFrontEnd).

> [!NOTE]
> A valid request includes a number of elements, such as a service URL and path, HTTP verb, `api-version`, and so on. For brevity, we trimmed the examples to highlight just the syntax that is relevant to pagination. For more information about request syntax, see [Azure Search Service REST](https://docs.microsoft.com/rest/api/searchservice).
>

## Total hits and Page Counts

Showing the total number of results returned from a query, and then returning those results in smaller chunks, is fundamental to virtually all search pages.

![][1]

In Azure Search, you use the `$count`, `$top`, and `$skip` parameters to return these values. The following example shows a sample request for total hits on an index called "online-catalog", returned as `@odata.count`:

    GET /indexes/online-catalog/docs?$count=true

Retrieve documents in groups of 15, and also show the total hits, starting at the first page:

    GET /indexes/online-catalog/docs?search=*$top=15&$skip=0&$count=true

Paginating results requires both `$top` and `$skip`, where `$top` specifies how many items to return in a batch, and `$skip` specifies how many items to skip. In the following example, each page shows the next 15 items, indicated by the incremental jumps in the `$skip` parameter.

    GET /indexes/online-catalog/docs?search=*$top=15&$skip=0&$count=true

    GET /indexes/online-catalog/docs?search=*$top=15&$skip=15&$count=true

    GET /indexes/online-catalog/docs?search=*$top=15&$skip=30&$count=true

## Layout

On a search results page, you might want to show a thumbnail image, a subset of fields, and a link to a full product page.

 ![][2]

In Azure Search, you would use `$select` and a [Search API request](https://docs.microsoft.com/rest/api/searchservice/search-documents) to implement this experience.

To return a subset of fields for a tiled layout:

    GET /indexes/online-catalog/docs?search=*&$select=productName,imageFile,description,price,rating

Images and media files are not directly searchable and should be stored in another storage platform, such as Azure Blob storage, to reduce costs. In the index and documents, define a field that stores the URL address of the external content. You can then use the field as an image reference. The URL to the image should be in the document.

To retrieve a product description page for an **onClick** event, use [Lookup Document](https://docs.microsoft.com/rest/api/searchservice/Lookup-Document) to pass in the key of the document to retrieve. The data type of the key is `Edm.String`. In this example, it is *246810*.

    GET /indexes/online-catalog/docs/246810

## Sort by relevance, rating, or price

Sort orders often default to relevance, but it's common to make alternative sort orders readily available so that customers can quickly reshuffle existing results into a different rank order.

 ![][3]

In Azure Search, sorting is based on the `$orderby` expression, for all fields that are indexed as `"Sortable": true.` An `$orderby` clause is an OData expression. For information about syntax, see [OData expression syntax for filters and order-by clauses](query-odata-filter-orderby-syntax.md).

Relevance is strongly associated with scoring profiles. You can use the default scoring, which relies on text analysis and statistics to rank order all results, with higher scores going to documents with more or stronger matches on a search term.

Alternative sort orders are typically associated with **onClick** events that call back to a method that builds the sort order. For example, given this page element:

 ![][4]

You would create a method that accepts the selected sort option as input, and returns an ordered list for the criteria associated with that option.

 ![][5]

> [!NOTE]
> While the default scoring is sufficient for many scenarios, we recommend basing relevance on a custom scoring profile instead. A custom scoring profile gives you a way to boost items that are more beneficial to your business. See [Add scoring profiles](index-add-scoring-profiles.md) for more information.
>

## Faceted navigation

Search navigation is common on a results page, often located at the side or top of a page. In Azure Search, faceted navigation provides self-directed search based on predefined filters. See [Faceted navigation in Azure Search](search-faceted-navigation.md) for details.

## Filters at the page level

If your solution design included dedicated search pages for specific types of content (for example, an online retail application that has departments listed at the top of the page), you can insert a [filter expression](search-filters.md) alongside an **onClick** event to open a page in a pre-filtered state.

You can send a filter with or without a search expression. For example, the following request will filter on brand name, returning only those documents that match it.

    GET /indexes/online-catalog/docs?$filter=brandname eq 'Microsoft' and category eq 'Games'

See [Search Documents (Azure Search API)](https://docs.microsoft.com/rest/api/searchservice/Search-Documents) for more information about `$filter` expressions.

## See Also

- [Azure Search Service REST API](https://docs.microsoft.com/rest/api/searchservice)
- [Index Operations](https://docs.microsoft.com/rest/api/searchservice/Index-operations)
- [Document Operations](https://docs.microsoft.com/rest/api/searchservice/Document-operations)
- [Faceted Navigation in Azure Search](search-faceted-navigation.md)

<!--Image references-->
[1]: ./media/search-pagination-page-layout/Pages-1-Viewing1ofNResults.PNG
[2]: ./media/search-pagination-page-layout/Pages-2-Tiled.PNG
[3]: ./media/search-pagination-page-layout/Pages-3-SortBy.png
[4]: ./media/search-pagination-page-layout/Pages-4-SortbyRelevance.png
[5]: ./media/search-pagination-page-layout/Pages-5-BuildSort.png
