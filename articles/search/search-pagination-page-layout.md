<properties 
	pageTitle="How to page search results in Azure Search | Microsoft Azure | Hosted cloud search service" 
	description="Pagination in Azure Search, a hosted cloud search service on Microsoft Azure." 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="paulettm" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="05/17/2016" 
	ms.author="heidist"/>

#How to page search results in Azure Search#

This article provides guidance on how to use the Azure Search Service REST API to implement standard elements of a search results page, such as total counts, document retrieval, sort orders, and navigation.
 
In every case mentioned below, page-related options that contribute data or information to your search results page are specified through the [Search Document](http://msdn.microsoft.com/library/azure/dn798927.aspx) requests sent to your Azure Search Service. Requests include a GET command, path, and query parameters that inform the service what is being requested, and how to formulate the response.

> [AZURE.NOTE] A valid request includes a number of elements, such as a service URL and path, HTTP verb, `api-version`, and so on. For brevity, we trimmed the examples to highlight just the syntax that is relevant to pagination. Please see the [Azure Search Service REST API](http://msdn.microsoft.com/library/azure/dn798935.aspx) documentation for details about request syntax.

## Total hits and Page Counts ##

Showing the total number of results returned from a query, and then returning those results in smaller chunks, is fundamental to virtually all search pages.

![][1]
 
In Azure Search, you use the `$count`, `$top`, and `$skip` parameters to return these values. The following example shows a sample request for total hits, returned as `@OData.count`:

    	GET /indexes/onlineCatalog/docs?$count=true

Retrieve documents in groups of 15, and also show the total hits, starting at the first page:

		GET /indexes/onlineCatalog/docs?search=*$top=15&$skip=0&$count=true

Paginating results requires both `$top` and `$skip`, where `$top` specifies how many items to return in a batch, and `$skip` specifies how many items to skip. In the following example, each page shows the next 15 items, indicated by the incremental jumps in the `$skip` parameter.

    	GET /indexes/onlineCatalog/docs?search=*$top=15&$skip=0&$count=true

    	GET /indexes/onlineCatalog/docs?search=*$top=15&$skip=15&$count=true

    	GET /indexes/onlineCatalog/docs?search=*$top=15&$skip=30&$count=true

## Layout  ##

On a search results page, you might want to show a thumbnail image, a subset of fields, and a link to a full product page.

 ![][2]
 
In Azure Search, you would use `$select` and a lookup command to implement this experience.

To return a subset of fields for a tiled layout:

    	GET /indexes/ onlineCatalog/docs?search=*&$select=productName,imageFile,description,price,rating 

Images and media files are not directly searchable and should be stored in another storage platform, such as Azure Blob storage, to reduce costs. In the index and documents, define a field that stores the URL address of the external content. You can then use the field as an image reference. The URL to the image should be in the document.

To retrieve a product description page for an **onClick** event, use [Lookup Document](http://msdn.microsoft.com/library/azure/dn798929.aspx) to pass in the key of the document to retrieve. The data type of the key is `Edm.String`. In this example, it is *246810*. 
   
    	GET /indexes/onlineCatalog/docs/246810

## Sort by relevance, rating, or price ##

Sort orders often default to relevance, but it's common to make alternative sort orders readily available so that customers can quickly reshuffle existing results into a different rank order.

 ![][3]

In Azure Search, sorting is based on the `$orderby` expression, for all fields that are indexed as `"Sortable": true.`

Relevance is strongly associated with scoring profiles. You can use the default scoring, which relies on text analysis and statistics to rank order all results, with higher scores going to documents with more or stronger matches on a search term.

Alternative sort orders are typically associated with **onClick** events that call back to a method that builds the sort order. For example, given this page element:

 ![][4]

You would create a method that accepts the selected sort option as input, and returns an ordered list for the criteria associated with that option.

 ![][5]
 
> [AZURE.NOTE] While the default scoring is sufficient for many scenarios, we recommend basing relevance on a custom scoring profile instead. A custom scoring profile gives you a way to boost items that are more beneficial to your business. See [Add a scoring profile](http://msdn.microsoft.com/library/azure/dn798928.aspx) for more information. 

## Faceted navigation ##

Search navigation is common on a results page, often located at the side or top of a page. In Azure Search, faceted navigation provides self-directed search based on predefined filters. See [Faceted navigation in Azure Search](search-faceted-navigation.md) for details.

## Filters at the page level ##

If your solution design included dedicated search pages for specific types of content (for example, an online retail application that has departments listed at the top of the page), you can insert a filter expression alongside an **onClick** event to open a page in a prefiltered state. 

You can send a filter with or without a search expression. For example, the following request will filter on brand name, returning only those documents that match it.

    	GET /indexes/onlineCatalog/docs?$filter=brandname eq ‘Microsoft’ and category eq ‘Games’

See [Search Documents (Azure Search API)](http://msdn.microsoft.com/library/azure/dn798927.aspx) for more information about `$filter` expressions.

## See Also ##

- [Azure Search Service REST API](http://msdn.microsoft.com/library/azure/dn798935.aspx)
- [Index Operations](http://msdn.microsoft.com/library/azure/dn798918.aspx)
- [Document Operations](http://msdn.microsoft.com/library/azure/dn800962.aspx)
- [Video and tutorials about Azure Search](search-video-demo-tutorial-list.md)
- [Faceted Navigation in Azure Search](search-faceted-navigation.md)


<!--Image references-->
[1]: ./media/search-pagination-page-layout/Pages-1-Viewing1ofNResults.PNG
[2]: ./media/search-pagination-page-layout/Pages-2-Tiled.PNG
[3]: ./media/search-pagination-page-layout/Pages-3-SortBy.png
[4]: ./media/search-pagination-page-layout/Pages-4-SortbyRelevance.png
[5]: ./media/search-pagination-page-layout/Pages-5-BuildSort.png 