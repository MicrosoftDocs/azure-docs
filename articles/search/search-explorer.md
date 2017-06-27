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
ms.date: 06/26/2017
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

This article shows you how to query an index using **Search Explorer** in the Azure portal.

Before your start, you should already have [created an Azure Search index](search-what-is-an-index.md) and [populated it with data](search-what-is-data-import.md).

## Open the service dashboard
1. Click **All resources** in the menu on the left side of the [Azure Portal](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices)
2. Select your Azure Search service

## Select an index
1. Select the index you would like to search from the **Indexes** tile.

![](./media/search-explorer/pick-index.png)

## Open Search Explorer

Click on the Search Explorer tile to slide open the search bar and results pane.
![](./media/search-explorer/search-explorer-tile.png)

## Start searching
1. To search your Azure Search index, start typing into the "*Query string*" field and then press "**Search**".
   
   * When using the Search Explorer, you can specify any of the [query parameters](https://msdn.microsoft.com/library/dn798927.aspx)
2. In the "*Results*" section, the query's results will be presented in the raw JSON that you would receiving in an HTTP Response Body when issuing search requests against the Azure Search REST API.
3. The query string is automatically parsed into the proper request URL to submit a HTTP request against the Azure Search REST API

![](./media/search-explorer/search-bar.png)


