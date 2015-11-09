<properties
	pageTitle="Data Import in Azure Search | Microsoft Azure | Hosted cloud search service"
	description="How to upload data to an index in Azure Search"
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags=""/>

<tags
	ms.service="search"
	ms.devlang="na"
	ms.workload="search"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="11/09/2015"
	ms.author="heidist"/>

# Import data to Azure Search
> [AZURE.SELECTOR]
- [Overview](search-what-is-data-import.md)
- [Portal](search-import-data-portal.md)
- [.NET](search-import-data-dotnet.md)
- [REST API](search-import-data-rest-api.md)
- [Indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md)

Azure Search is a hosted cloud search service that provides a search engine, advanced search functionality, and search application data storage.

Search operates over an index that provides field values and instructions used to formulate search results or query execution, including analysis, ranking, filtering, and other functions. The index is populated with data captured by or consumed by your application. Anything that appears in a search results page or is otherwise returned in an Azure Search response must come from the index. As you can imagine, this data must be in sync with other data sources used in your solution. Consider an online retail business: the inventory database that captures sales transactions must have the same SKUs, pricing, and availability as the data surfaced via search results. Depending on the degree of latency acceptable for your solution, you might find that synchronizing data can happen once a week, once a day, or in near real-time using concurrent writes to both an inventory database and an Azure Search index.

In this article, we'll introduce the various approaches for importing and refreshing searchable data. In addition to different techniques (programmatic or portal-based), you'll also learn about data ingestion options. These consist of a push model that uploads data to an index, or a pull model that crawls a specific data source for values to upload to Azure Search.

Before you can import data, the index must already exist. See [Indexes in Azure Search](search-what-is-an-index.md) for more information.
