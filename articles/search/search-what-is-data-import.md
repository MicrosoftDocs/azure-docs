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

Azure Search is a hosted cloud search service that provides a search engine, search features, and data storage. The service operates over persisted data (an index) that provides documents and information used to process an index, execute queries, or formulate search results. Among these high-level operations are specific low-level operations for text analysis, ranking, filtering, sorting, faceting, and other functions used to compute or display search results. 

The relevance of the search experience depends on the quality of the data that you upload and how often it needs to be refreshed. In this article, we'll introduce the push and pull (crawl) approaches for importing and refreshing an index. 

Before you can import data, the index must already exist, and the data that you upload must conform to the schema. See [Indexes in Azure Search](search-what-is-an-index.md) for more information.

##Dataset considerations

There are no restrictions on the type of data that you upload as long as the schema and datasets are formulated as JSON structures.

The data that you load should originate from whatever database or data source that your custom application creates or consumes. For example, if your application is an online retail catalog, the index you create for Azure Search should draw data from the product inventory or sales databases that support your application. 

An index in Azure Search gets data from a single table, view, blob container, or equivalent. You might need to create a data structure in your database or noSQL application that provides the data to Azure Search. Alternatively, for certain data sources like Azure SQL Database or DocumentDB, you can create an indexer that crawls an external table, view or blob container for data to upload into Azure Search. 

##Latency and data synchronization requirements

The following table is a summary of common requirements and recommendations for meeting them.

|Requirements|Recommendations|
|------------|---------------|
|Near real-time data synchronization|Code, either .NET or REST API, to push updates to an index. A pull approach to data ingestion is a scheduled operation, which can't run fast enough to keep up with rapid changes in a primary data source.|
|Azure SQL Database, DocumentDB, or SQL Server on Azure VMs|Indexers are pegged to specific data source types. If primary data sources are in a supported data source, you can use an indexer to crawl the data source and schedule data refresh as frequently as hourly intervals. You can configure an indexer in the portal or in code.|
|Scheduled data refresh|Use an indexer (see above).|
|Crawler|Use an indexer (see above).|
|Code-free prototyping or editing|The portal includes an Import Data Wizard that configures an indexer, sometimes generating a preliminary schema if there is enough information in the primary database to do so. The wizard includes options for setting up scheduled data refresh. Optionally, you can add language analyzers or CORS options. There are a few downsides: you cannot add scoring profiles, nor can you export a schema created in the portal to a JSON file for use in code.| 