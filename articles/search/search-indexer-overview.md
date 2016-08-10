<properties
	pageTitle="Indexers in Azure Search | Microsoft Azure | Hosted cloud search service"
	description="Crawl Azure SQL database, DocumentDB, or Azure storage to extract searchable data and populate an Azure Search index."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="paulettm"
	editor=""
    tags="azure-portal"/>

<tags
	ms.service="search"
	ms.devlang="na"
	ms.workload="search"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="08/08/2016"
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

You can run indexers on demand or on a recurring data refresh schedule that runs as often as every fifteen minutes. More frequent updates require a push model that simultaneously updates data in both Azure Search and your external data source.

## Approaches for creating and managing indexers

For generally available indexers like Azure SQL or DocumentDB, you can create and manage indexers using these approaches:

- [Portal > Import Data Wizard ](search-get-started-portal)
- [Service REST API](https://msdn.microsoft.com/library/azure/dn946891.aspx)
- [.NET SDK](https://msdn.microsoft.com/library/azure/microsoft.azure.search.iindexersoperations.aspx)

Preview indexers, such as Azure Blob or Table storage, require code and preview APIs such [Azure Search Preview REST API for indexers](search-api-indexers-2015-02-28-preview.md). Portal tooling is typically not available for preview features.

## Basic configuration steps

Indexers can offer features that are unique to the data source. In this respect, some aspects of indexer or data source configuration will vary by indexer type. However, all indexers share the same basic composition and requirements. Steps that are common to all indexers are covered below.

### Step 1: Create an index

An indexer will automate some tasks related to data ingestion, but creating an index is not one of them. As a prerequisite, you must have a predefined index with fields that match those in your external data source. For more information about structuring an index, see [Create an Index (Azure Search REST API)](https://msdn.microsoft.com/library/azure/dn798941.aspx).

### Step 2: Create a data source

An indexer pulls data from a **data source** which holds information such as a connection string. Currently the following data sources are supported:

- [Azure SQL Database or SQL Server on an Azure virtual machine](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md)
- [DocumentDB](../documentdb/documentdb-search-indexer.md)
- [Azure Blob storage (Preview)](search-howto-indexing-azure-blob-storage.md), used to extract text from PDF, Office documents, HTML, or XML
- [Azure Table Storage (Preview)](search-howto-indexing-azure-tables.md)

Data sources are configured and managed independently of the indexers that use them, which means a data source can be used by multiple indexers to load more than one index at a time. 

### Step 3:Create and schedule the indexer

The indexer definition is a construct specifying the index, data source, and a schedule. An indexer can reference a data source from another service, as long as that data source is from the same subscription. For more information about structuring an indexer, see [Create Indexer (Azure Search REST API)](https://msdn.microsoft.com/library/azure/dn946899.aspx).

## Next steps

Now that you have the basic idea, the next step is to review requirements and tasks specific to each data source type.

- [Azure SQL Database or SQL Server on an Azure virtual machine](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md)
- [DocumentDB](../documentdb/documentdb-search-indexer.md)
- [Azure Blob storage (Preview)](search-howto-indexing-azure-blob-storage.md), used to extract text from PDF, Office documents, HTML, or XML
- [Azure Table Storage (Preview)](search-howto-indexing-azure-tables.md)
- [Indexing CSV blobs using the Azure Search Blob indexer (Preview)](search-howto-index-csv-blobs.md)
- [Indexing JSON blobs with Azure Search Blob indexer (Preview)](search-howto-index-json-blobs.md)

