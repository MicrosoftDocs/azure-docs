---
title: Indexer overview
titleSuffix: Azure AI Search
description: Crawl Azure SQL Database, SQL Managed Instance, Azure Cosmos DB, or Azure storage to extract searchable data and populate an Azure AI Search index.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 10/05/2023
---

# Indexers in Azure AI Search

An *indexer* in Azure AI Search is a crawler that extracts searchable content from cloud data sources and populates a search index using field-to-field mappings between source data and a search index. This approach is sometimes referred to as a 'pull model' because the search service pulls data in without you having to write any code that adds data to an index. Indexers also drive the [AI enrichment](cognitive-search-concept-intro.md) capabilities of Azure AI Search, integrating external processing of content en route to an index.

Indexers are cloud-only, with individual indexers for [supported data sources](#supported-data-sources). When configuring an indexer, you'll specify a data source (origin) and a search index (destination). Several sources, such as Azure Blob Storage, have more configuration properties specific to that content type.

You can run indexers on demand or on a recurring data refresh schedule that runs as often as every five minutes. More frequent updates require a ['push model'](search-what-is-data-import.md) that simultaneously updates data in both Azure AI Search and your external data source.

## Indexer scenarios and use cases

You can use an indexer as the sole means for data ingestion, or in combination with other techniques. The following table summarizes the main scenarios.

| Scenario |Strategy |
|----------|---------|
| Single data source | This pattern is the simplest: one data source is the sole content provider for a search index. Most supported data sources provide some form of change detection so that subsequent indexer runs pick up the difference when content is added or updated in the source. |
| Multiple data sources | An indexer specification can have only one data source, but the search index itself can accept content from multiple sources, where each indexer run brings new content from a different data provider. Each source can contribute its share of full documents, or populate selected fields in each document. For a closer look at this scenario, see [Tutorial: Index from multiple data sources](tutorial-multiple-data-sources.md). |
| Multiple indexers | Multiple data sources are typically paired with multiple indexers if you need to vary run time parameters, the schedule, or field mappings. </br></br>[Cross-region scale out of Azure AI Search](search-reliability.md#data-sync) is another scenario. You might have copies of the same search index in different regions. To synchronize search index content, you could have multiple indexers pulling from the same data source, where each indexer targets a different search index in each region.</br></br>[Parallel indexing](search-howto-large-index.md#parallel-indexing) of very large data sets also requires a multi-indexer strategy, where each indexer targets a subset of the data. |
| Content transformation | Indexers drive [AI enrichment](cognitive-search-concept-intro.md). Content transforms are defined in a [skillset](cognitive-search-working-with-skillsets.md) that you attach to the indexer.|

 You should plan on creating one indexer for every target index and data source combination. You can have multiple indexers writing into the same index, and you can reuse the same data source for multiple indexers. However, an indexer can only consume one data source at a time, and can only write to a single index. As the following graphic illustrates, one data source provides input to one indexer, which then populates a single index:  

:::image type="content" source="media/search-indexer-overview/azsrch-ds-indxr-index.png" alt-text="Diagram of indexer workflow.":::

 Although you can only use one indexer at a time, resources can be used in different combinations. The main takeaway of the next illustration is to notice is that a data source can be paired with more than one indexer, and multiple indexers can write to same index.  

:::image type="content" source="media/search-indexer-overview/azsrch-ds2-indexer3-index2.png" alt-text="Diagram of multiple combinations of data sources, indexers, and indexes.":::

<a name="supported-data-sources"></a>

## Supported data sources

Indexers crawl data stores on Azure and outside of Azure.

+ [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md)
+ [Azure Cosmos DB](search-howto-index-cosmosdb.md)
+ [Azure Data Lake Storage Gen2](search-howto-index-azure-data-lake-storage.md)
+ [Azure SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Table Storage](search-howto-indexing-azure-tables.md)
+ [Azure SQL Managed Instance](search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers.md)
+ [SQL Server on Azure Virtual Machines](search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers.md)
+ [Azure Files](search-file-storage-integration.md) (in preview)
+ [Azure MySQL](search-howto-index-mysql.md) (in preview)
+ [SharePoint in Microsoft 365](search-howto-index-sharepoint-online.md) (in preview)
+ [Azure Cosmos DB for MongoDB](search-howto-index-cosmosdb-mongodb.md) (in preview)
+ [Azure Cosmos DB for Apache Gremlin](search-howto-index-cosmosdb-gremlin.md) (in preview)

Azure Cosmos DB for Cassandra is not supported.

Indexers accept flattened row sets, such as a table or view, or items in a container or folder. In most cases, it creates one search document per row, record, or item.

Indexer connections to remote data sources can be made using standard Internet connections (public) or encrypted private connections when you use Azure virtual networks for client apps. You can also set up connections to authenticate using a managed identity. For more information about secure connections, see [Indexer access to content protected by Azure network security features](search-indexer-securing-resources.md) and [Connect to a data source using a managed identity](search-howto-managed-identities-data-sources.md).

## Stages of indexing

On an initial run, when the index is empty, an indexer will read in all of the data provided in the table or container. On subsequent runs, the indexer can usually detect and retrieve just the data that has changed. For blob data, change detection is automatic. For other data sources like Azure SQL or Azure Cosmos DB, change detection must be enabled.

For each document it receives, an indexer implements or coordinates multiple steps, from document retrieval to a final search engine "handoff" for indexing. Optionally, an indexer also drives [skillset execution and outputs](cognitive-search-concept-intro.md), assuming a skillset is defined.

:::image type="content" source="media/search-indexer-overview/indexer-stages.png" alt-text="Diagram of indexer stages." border="false":::

<a name="document-cracking"></a>

### Stage 1: Document cracking

Document cracking is the process of opening files and extracting content. Text-based content can be extracted from files on a service, rows in a table, or items in container or collection. If you add a skillset and [image skills](cognitive-search-concept-image-scenarios.md), document cracking can also extract images and queue them for image processing.

Depending on the data source, the indexer will try different operations to extract potentially indexable content:

+ When the document is a file with embedded images, such as a PDF, the indexer extracts text, images, and metadata. Indexers can open files from [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md#supported-document-formats), [Azure Data Lake Storage Gen2](search-howto-index-azure-data-lake-storage.md#supported-document-formats), and [SharePoint](search-howto-index-sharepoint-online.md#supported-document-formats).

+ When the document is a record in [Azure SQL](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md), the indexer will extract non-binary content from each field in each record.

+ When the document is a record in [Azure Cosmos DB](search-howto-index-cosmosdb.md), the indexer will extract non-binary content from fields and subfields from the Azure Cosmos DB document.

### Stage 2: Field mappings 

An indexer extracts text from a source field and sends it to a destination field in an index or knowledge store. When field names and data types coincide, the path is clear. However, you might want different names or types in the output, in which case you need to tell the indexer how to map the field.

To [specify field mappings](search-indexer-field-mappings.md), enter the source and destination fields in the indexer definition.

Field mapping occurs after document cracking, but before transformations, when the indexer is reading from the source documents. When you define a field mapping, the value of the source field is sent as-is to the destination field with no modifications. 

### Stage 3: Skillset execution

Skillset execution is an optional step that invokes built-in or custom AI processing. Skillsets can add optical character recognition (OCR) or other forms of image analysis if the content is binary. Skillsets can also add natural language processing. For example, you can add text translation or key phrase extraction. 

Whatever the transformation, skillset execution is where enrichment occurs. If an indexer is a pipeline, you can think of a [skillset](cognitive-search-defining-skillset.md) as a "pipeline within the pipeline".

### Stage 4: Output field mappings

If you include a skillset, you'll need to [specify output field mappings](cognitive-search-output-field-mapping.md) in the indexer definition. The output of a skillset is manifested internally as a tree structure referred to as an *enriched document*. Output field mappings allow you to select which parts of this tree to map into fields in your index.

Despite the similarity in names, output field mappings and field mappings build associations from different sources. Field mappings associate the content of source field to a destination field in a search index. Output field mappings associate the content of an internal enriched document (skill outputs) to destination fields in the index. Unlike field mappings, which are considered optional, an output field mapping is required for any transformed content that should be in the index.

The next image shows a sample indexer [debug session](cognitive-search-debug-session.md) representation of the indexer stages: document cracking, field mappings, skillset execution, and output field mappings.

:::image type="content" source="media/search-indexer-overview/sample-debug-session.png" alt-text="Screenshot of a sample debug session." lightbox="media/search-indexer-overview/sample-debug-session.png":::

## Basic workflow

Indexers can offer features that are unique to the data source. In this respect, some aspects of indexer or data source configuration will vary by indexer type. However, all indexers share the same basic composition and requirements. Steps that are common to all indexers are covered below.

### Step 1: Create a data source

Indexers require a *data source* object that provides a connection string and possibly credentials. Data sources are independent objects. Multiple indexers can use the same data source object to load more than one index at a time.

You can create a data source using any of these approaches:

+ Using the Azure portal, on the **Data sources** tab of your search service pages, select **Add data source** to specify the data source definition.
+ Using the Azure portal, the [Import data wizard](search-import-data-portal.md) outputs a data source.
+ Using the REST APIs, call [Create Data Source](/rest/api/searchservice/create-data-source).
+ Using the Azure SDK for .NET, call [SearchIndexerDataSourceConnection class](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourceconnection)

### Step 2: Create an index

An indexer will automate some tasks related to data ingestion, but creating an index is generally not one of them. As a prerequisite, you must have a predefined index that contains corresponding target fields for any source fields in your external data source. Fields need to match by name and data type. If not, you can [define field mappings](search-indexer-field-mappings.md) to establish the association. 

For more information, see [Create an index](search-how-to-create-search-index.md).

### Step 3: Create and run (or schedule) the indexer

An indexer definition consists of properties that uniquely identify the indexer, specify which data source and index to use, and provide other configuration options that influence run time behaviors, including whether the indexer runs on demand or on a schedule.

Any errors or warnings about data access or skillset validation will occur during indexer execution. Until indexer execution starts, dependent objects such as data sources, indexes, and skillsets are passive on the search service. 

For more information, see [Create an indexer](search-howto-create-indexers.md)

After the first indexer run, you can [rerun it on demand](search-howto-run-reset-indexers.md) or [set up a schedule](search-howto-schedule-indexers.md).

You can monitor [indexer status in the portal](search-howto-monitor-indexers.md) or through [Get Indexer Status API](/rest/api/searchservice/get-indexer-status). You should also [run queries on the index](search-query-create.md) to verify the result is what you expected.

Indexers don't have dedicated processing resources. Based on this, indexers' status may show as idle before running (depending on other jobs in the queue) and run times may not be predictable. Other factors define indexer performance as well, such as document size, document complexity, image analysis, among others.

## Next steps

Now that you've been introduced to indexers, a next step is to review indexer properties and parameters, scheduling, and indexer monitoring. Alternatively, you could return to the list of [supported data sources](#supported-data-sources) for more information about a specific source.

+ [Create indexers](search-howto-create-indexers.md)
+ [Reset and run indexers](search-howto-run-reset-indexers.md)
+ [Schedule indexers](search-howto-schedule-indexers.md)
+ [Define field mappings](search-indexer-field-mappings.md)
+ [Monitor indexer status](search-howto-monitor-indexers.md)
