---
title: "Query an index (portal - Azure Search) | Microsoft Docs"
description: Issue a search query in the Azure Portal's Search Explorer.
services: search
manager: jhubbard
documentationcenter: ''
author: ashmaka

ms.assetid: 8e524188-73a7-44db-9e64-ae8bf66b05d3
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.date: 07/10/2017
ms.author: ashmaka

---
# Query an Azure Search index using Search Explorer in the Azure Portal
> [!div class="op_single_selector"]
> * [Overview](search-query-overview.md)
> * [Portal](search-explorer.md)
> * [.NET](search-query-dotnet.md)
> * [REST](search-query-rest-api.md)
> 
> 

This article shows you how to query an Azure Search index using **Search Explorer** in the Azure portal. You can use Search Explorer to submit simple or full Lucene query strings to any existing index in your service.

## Open the service dashboard
1. Click **All resources** in the jump bar on the left side of the [Azure portal](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).
2. Select your Azure Search service.

## Select an index

Select the index you would like to search from the **Indexes** tile.

   ![](./media/search-explorer/pick-index.png)

## Open Search Explorer

Click on the Search Explorer tile to slide open the search bar and results pane.

   ![](./media/search-explorer/search-explorer-tile.png)

## Start searching

1. To search your Azure Search index, start typing into the **Query string** field and then press **Search**.
   
   When using the Search Explorer, you can specify any of the [query parameters](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)

   The query string is automatically parsed into the proper request URL to submit a HTTP request against the Azure Search REST API.

2. In the **Results** section, query results are presented in raw JSON, identical to the payload returned in an HTTP Response Body when issuing requests programmatically.

   ![](./media/search-explorer/search-bar.png)

## Next steps

The following resources provide additional query syntax information and examples.

 + [Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) 
 + [Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) 
 + [Lucene query syntax examples](https://docs.microsoft.com/azure/search/search-query-lucene-examples) 
 + [OData Filter expression syntax](https://docs.microsoft.com/rest/api/searchservice/odata-expression-syntax-for-azure-search) 