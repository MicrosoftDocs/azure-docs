---
title: Search explorer for querying indexes in Azure Search | Microsoft Docs
description: Learn how to use Search explorer for querying indexes in Azure Search.
manager: cgronlun
author: HeidiSteen
services: search
ms.service: search
ms.topic: conceptual
ms.date: 07/10/2018
ms.author: heidist

---
# How to use Search explorer to query indexes in Azure Search 

This article shows you how to query an existing Azure Search index using **Search explorer** in the Azure portal. You can use Search explorer to submit simple or full Lucene query strings to any existing index in your service.

## Open the service dashboard
1. Click **All resources** in the jump bar on the left side of the [Azure portal](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).
2. Select your Azure Search service.

## Select an index

Select the index you would like to search from the **Indexes** tile.

   ![](./media/search-explorer/pick-index.png)

## Open Search explorer

Click on the Search explorer tile to slide open the search bar and results pane.

   ![](./media/search-explorer/search-explorer-tile.png)

## Start searching

When using the Search explorer, you can specify [query parameters](https://docs.microsoft.com/rest/api/searchservice/Search-Documents) to formulate the query.

1. In **Query string**, type a query and then press **Search**. 

   The query string is automatically parsed into the proper request URL to submit a HTTP request against the Azure Search REST API.   
   
   You can use any valid simple or full Lucene query syntax to create the request. The `*` character is equivalent to an empty or unspecified search that returns all documents in no particular order.

2. In  **Results**, query results are presented in raw JSON, identical to the payload returned in an HTTP Response Body when issuing requests programmatically.

   ![](./media/search-explorer/search-bar.png)

## Next steps

The following resources provide additional query syntax information and examples.

 + [Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) 
 + [Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) 
 + [Lucene query syntax examples](https://docs.microsoft.com/azure/search/search-query-lucene-examples) 
 + [OData Filter expression syntax](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) 