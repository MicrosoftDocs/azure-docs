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

In Azure Search, the service operates over persisted data (an index) that provides documents and information used to process an index, execute queries, or formulate search results. To populate an index, you can use a push or pull model for loading data.

Prior to import, the index must already exist. See [Indexes in Azure Search](search-what-is-an-index.md) for more information.

##Push data to an index

This approach refers to taking an existing dataset that conforms to the index schema, and posting it to your search service. For applications having very low latency requirements (for example, if you need search operations to be in synch with inventory databases), a push model is your only option.

You can use the REST API or .NET SDK to push data to an index. There is currently no tool support for pushing data via the portal.

This approach is more flexible than a pull model because you upload documents individually or in batches (up to 1000 per batch or 16 MB, whichever limit comes first).

##Pull (crawl) data 

A pull model crawls a supported data source and loads the index for you. In Azure Search, this capability is implemented through *indexers*, currently available for Azure SQL database, DocumentDB, and SQL Server on Azure VMs. See [Indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md) to learn about uploading Azure SQL data.

You can use the portal, REST API, or .NET SDK to pull data into an index.

##Dataset requirements

There are no restrictions on the type of data that you upload as long as the schema and datasets are formulated as JSON structures.

Data should originate from whatever database or data source that your custom application creates or consumes. For example, if your application is an online retail catalog, the index you create for Azure Search should draw data from the product inventory or sales databases that support your application. 

The dataset should derive from a single table, view, blob container, or equivalent. You might need to create a data structure in your database or noSQL application that provides the data to Azure Search. Alternatively, for certain data sources like Azure SQL Database or DocumentDB, you can create an indexer that crawls an external table, view or blob container for data to upload into Azure Search. 

##Choosing a data import approach

|Criteria|Recommended approach|
|------------|---------------|
|Near real-time data synchronization|Code, either .NET or REST API, to push updates to an index. A pull approach to data ingestion is a scheduled operation, which can't run fast enough to keep up with rapid changes in a primary data source.|
|Azure SQL Database, DocumentDB, or SQL Server on Azure VMs|Indexers are pegged to specific data source types. If primary data sources are a supported data source type, an indexer is the easiest way to load an index. You can schedule data refresh as frequently as hourly intervals. You can configure an indexer in the portal or in code.|
|Scheduled data refresh|Use an indexer (see above).|
|Code-free prototyping or editing|The portal includes an Import Data Wizard that configures an indexer, sometimes generating a preliminary schema if there is enough information in the primary database to do so. The wizard includes options for setting up scheduled data refresh. Optionally, you can add language analyzers or CORS options. There are a few downsides: you cannot add scoring profiles, nor can you export a schema created in the portal to a JSON file for use in code.| 