<properties
	pageTitle="Indexers in Azure Search | Microsoft Azure | Hosted cloud search service"
	description="Crawl a database to extract searchable data and populate an Azure Search index."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags="azure-portal"/>

<tags
	ms.service="search"
	ms.devlang="na"
	ms.workload="search"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="01/24/2016"
	ms.author="heidist"/>

# Indexers in Azure Search
> [AZURE.SELECTOR]
- [Overview](search-indexer-overview.md)
- [Portal](search-import-data-portal.md)
- [Blob Storage (preview)](search-howto-indexing-azure-blob-storage.md)
- [SQL data](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md)
- [DocumentDB](../documentdb/documentdb-search-indexer.md)

An **Indexer** in Azure Search is a crawler that extracts searchable data and metadata from an external data source and populates an index based on field-to-field mappings between the index and your data source. This approach is sometimes referred to as a 'pull model' because the code you write  retrieves data from an external data source, as opposed to code that pushes data to an index.

You can use an indexer as the sole means for data ingestion, or use a combination of techniques that include the use of an indexer for loading some of the fields in your index.

You can run an indexer on demand or set up a recurring data refresh schedule that runs as often as every fifteen minutes. More frequent updates require a push model that simultaneously updates data in both Azure Search and your external data source.

Each indexer has a single **DataSource** that can be set to any supported type:

- Azure SQL Database or SQL Server in an Azure virtual machine
- DocumentDB
- Azure Blob storage (in preview, useful for PDF, Office documents, HTML, XML, or audio and video content)

DataSources are configured and managed independently of the indexers that use them, which means a data source can be used by multiple indexers to load multiple indexes at a time. As along as Indexers and DataSources are in the same subscription, you can create them for individual service instances that run different data centers for a distributed deployment strategy.

Both the [.NET SDK](https://msdn.microsoft.com/library/azure/microsoft.azure.search.iindexersoperations.aspx) and the [Service REST API](https://msdn.microsoft.com/library/azure/dn946891.aspx) provide interfaces for creating an indexer. Alternatively, you can also configure an indexer in the portal when you use the **Import Data** wizard.


