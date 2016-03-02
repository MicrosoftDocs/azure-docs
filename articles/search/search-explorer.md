<properties
	pageTitle="Query an Azure Search index using Search Explorer in the Azure Portal | Microsoft Azure | Hosted cloud search service"
	description="Search Explorer is a code-free approach for querying an Azure Search index in the Azure Portal."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""/>

<tags
	ms.service="search"
	ms.devlang="rest-api"
	ms.workload="search"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="01/23/2016"
	ms.author="heidist"/>

# Query an Azure Search index using Search Explorer in the Azure Portal
> [AZURE.SELECTOR]
- [Overview](search-query-overview.md)
- [Search Explorer](search-explorer.md)
- [Fiddler](search-fiddler.md)
- [.NET](search-query-dotnet.md)
- [REST](search-query-rest-api.md)

**Search Explorer** is a query tool built into the Azure Portal for code-free queries against an Azure Search index. It connects to any index in your service and provides a search box for entering search strings and expressions. Valid query syntax is generated based on the input you provide. Results are displayed in the portal page.

Search Explorer is ideal for learning query syntax, running the occasional ad hoc query, or refining a query expression before attempting to put it in code. To use it, you must already have an Azure Search service and an index. See [Create an Azure Search service in the portal](search-create-service-portal.md) and [Import data to Azure Search using the portal](search-import-data-portal.md) for help with these tasks.

## Open Search Explorer

1. Sign in to the [Azure Portal](https://portal.azure.com).

2. Open the service dashboard of your Azure Search service. Here are a few ways to find the dashboard.
	- In the Jumpbar, click **Home**. The home page has tiles for every service in your subscription. Click the tile to open the service dashboard.
	- In the Jumpbar, click **Browse All** > **Filter by** > **Search services** to find your Search service in the list.

3. In the service dashboard, you will see a command bar at the top, including one for **Search Explorer**. 

  	![][1]

4. Click **Search Explorer** to slide open the Search Explorer blade.
5. Set the index and API version. Search Explorer automatically connects to the first index in your index list but you can click **Change Index** to switch to a different one. **Set API version** lets you specify the generally available or preview versions. Some query syntax is preview only.
6. If you followed [Get started with Azure Search](search-get-started-portal.md) to create and populate an index based on United States Geological Survey (USGS) data for Rhode Island, you can use this search term to verify the same 3 results come back in Search Explorer: `roger williams +school -building`

Notice the query syntax that is generated automatically in response to the search term input.

![][2]

## Next steps

More information about query syntax and examples can be found in [Search Documents](https://msdn.microsoft.com/library/azure/dn798927.aspx) on MSDN.

Visit these links for additional no-code approaches to creating or managing a search service or index:

- [Create an Azure Search service in the portal](search-create-service-portal.md)
- [Import data to Azure Search using the portal](search-import-data-portal.md)
- [Manage your Search service on Azure](search-manage.md)

<!--Image References-->
[1]: ./media/search-explorer/AzSearch-SearchExplorer-Btn.png
[2]: ./media/search-explorer/AzSearch-SearchExplorer-Example.png