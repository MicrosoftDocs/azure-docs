<properties
	pageTitle="Indexers in Azure Search | Microsoft Azure | Hosted cloud search service"
	description="Crawl Azure SQL database, DocumentDB, or Azure storage to extract searchable data and populate an Azure Search index."
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
	ms.date="04/14/2016"
	ms.author="heidist"/>

# Indexers in Azure Search
> [AZURE.SELECTOR]
- [Overview](search-indexer-overview.md)
- [Portal](search-import-data-portal.md)
- [Azure SQL](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md)
- [DocumentDB](../documentdb/documentdb-search-indexer.md)
- [Blob Storage (preview)](search-howto-indexing-azure-blob-storage.md)
- [Table Storage (preview)](search-howto-indexing-azure-tables.md)

An **indexer** in Azure Search is a crawler that extracts searchable data and metadata from an external data source and populates an index based on field-to-field mappings between the index and your data source. This approach is sometimes referred to as a 'pull model' because the service pulls data in without you having to write any code that pushes data to an index.

You can use an indexer as the sole means for data ingestion, or use a combination of techniques that include the use of an indexer for loading just some of the fields in your index.

Indexers can be run on demand or on a recurring data refresh schedule that runs as often as every fifteen minutes. More frequent updates require a push model that simultaneously updates data in both Azure Search and your external data source.

An indexer pulls data from a **data source** which holds information such as a connection string. Currently the following data sources are supported:

- [Azure SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md) (or SQL Server in an Azure virtual machine)
- [DocumentDB](../documentdb/documentdb-search-indexer.md)
- [Azure Blob storage](search-howto-indexing-azure-blob-storage.md) (Currently in preview. Extracts text from PDF, Office documents, HTML, XML.)
- [Azure Table Storage](search-howto-indexing-azure-tables.md) (Currently in preview)

Data sources are configured and managed independently of the indexers that use them, which means a data source can be used by multiple indexers to load more than one index at a time. 

Both the [.NET SDK](https://msdn.microsoft.com/library/azure/microsoft.azure.search.iindexersoperations.aspx) and the [Service REST API](https://msdn.microsoft.com/library/azure/dn946891.aspx) support managing indexers and data sources. 

Alternatively, you can also configure an indexer in the portal when you use the **Import Data** wizard. See [Get started with Azure Search in the portal](search-get-started-portal) for a quick tutorial, using sample data and the DocumentDB indexer to create and load an index using the wizard.



