---
title: Indexer overview
titleSuffix: Azure Cognitive Search
description: Crawl Azure SQL Database, SQL Managed Instance, Azure Cosmos DB, or Azure storage to extract searchable data and populate an Azure Cognitive Search index.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/29/2021
---

# Indexers in Azure Cognitive Search

An *indexer* in Azure Cognitive Search is a crawler that extracts searchable text and metadata from an external Azure data source and populates a search index using field-to-field mappings between source data and your index. This approach is sometimes referred to as a 'pull model' because the service pulls data in without you having to write any code that adds data to an index. Indexers also drive the [AI enrichment](cognitive-search-concept-intro.md) capabilities of Cognitive Search, integrating external processing of content en route to an index.

Indexers are Azure-only, with individual indexers for [Azure SQL](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md), [Azure Cosmos DB](search-howto-index-cosmosdb.md), [Azure Table Storage](search-howto-indexing-azure-tables.md) and [Blob Storage](search-howto-indexing-azure-blob-storage.md). When configuring an indexer, you'll specify a data source (origin), as well as an index (destination). Several sources, such as Blob storage, have additional configuration properties specific to that content type.

You can run indexers on demand or on a recurring data refresh schedule that runs as often as every five minutes. More frequent updates require a ['push model'](search-what-is-data-import.md) that simultaneously updates data in both Azure Cognitive Search and your external data source.

## Usage scenarios

You can use an indexer as the sole means for data ingestion, or as part of a combination of techniques that load and optionally transform or enrich content along the way. The following table summarizes the main scenarios.

| Scenario |Strategy |
|----------|---------|
| Single data source | This pattern is the simplest: one data source is the sole content provider for a search index. From the source, you'll identify one field containing unique values to serve as the document key in the search index. The unique value will be used as an identifier. All other source fields are mapped implicitly or explicitly to corresponding fields in an index. </br></br>An important takeaway is that the value of a document key originates from source data. A search service does not generate key values. On subsequent runs, incoming documents with new keys are added, while incoming documents with existing keys are either merged or overwritten, depending on whether index fields are null or populated. |
| Multiple data sources | An index can accept content from multiple sources, where each run brings new content from a different source. </br></br>One outcome might be an index that gains documents after each indexer run, with entire documents created in full from each source. For example, documents 1-100 are from Blob storage, documents 101-200 are from Azure SQL, and so forth. The challenge for this scenario lies in designing an index schema that works for all incoming data, and a document key structure that is uniform in the search index. Natively, the values that uniquely identify a document are metadata_storage_path in a blob container and a primary key in a SQL table. You can imagine that one or both sources must be amended to provide key values in a common format, regardless of content origin. For this scenario, you should expect to perform some level of pre-processing to homogenize the data so that it can be pulled into a single index. </br></br>An alternative outcome might be search documents that are partially populated on the first run, and then further populated by subsequent runs to bring in values from other sources. For example, fields 1-10 are from Blob storage, 11-20 from Azure SQL, and so forth. The challenge of this pattern is making sure that each indexing run is targeting the same document. Merging fields into an existing document requires a match on the document key. For a demonstration of this scenario, see [Tutorial: Index from multiple data sources](tutorial-multiple-data-sources.md). |
| Multiple indexers | If you're using multiple data sources, you might also need multiple indexers if you need to vary run time parameters, the schedule, or field mappings. Although multiple indexer-data-source sets can target the same index, be careful of indexer runs that can overwrite existing values in the index. If a second indexer-data-source targets the same documents and fields, any values from the first run will be overwritten. Field values are replaced in full; an indexer cannot merge values from multiple runs into the same field.</br></br>Another multi-indexer use case is [cross-region scale out of Cognitive Search](search-performance-optimization.md#use-indexers-for-updating-content-on-multiple-services). You might have copies of the same search index in different regions. To synchronize search index content, you could have multiple indexers pulling from the same data source, where each indexer targets a different search index.</br></br>[Parallel indexing](search-howto-large-index.md#parallel-indexing) of very large data sets also requires a multi-indexer strategy. Each indexer targets a subset of the data. |
| Content transformation | Cognitive Search supports optional [AI enrichment](cognitive-search-concept-intro.md) behaviors that add image analysis and natural language processing to create new searchable content and structure. AI enrichment is indexer-driven, through an attached [skillset](cognitive-search-working-with-skillsets.md). To perform AI enrichment, the indexer still needs an index and an Azure data source, but in this scenario, adds skillset processing to indexer execution. |

<a name="supported-data-sources"></a>

## Supported data sources

Indexers crawl data stores on Azure.

+ [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md)
+ [Azure Data Lake Storage Gen2](search-howto-index-azure-data-lake-storage.md) (in preview)
+ [Azure Table Storage](search-howto-indexing-azure-tables.md)
+ [Azure Cosmos DB](search-howto-index-cosmosdb.md)
+ [Azure SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [SQL Managed Instance](search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers.md)
+ [SQL Server on Azure Virtual Machines](search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers.md)

Indexer connections to remote data sources can be made using standard Internet connections (public) or encrypted private connections when you use Azure virtual networks for client apps. You can also set up connections to authenticate using a trusted service identity. For more information about secure connections, see [Granting access via private endpoints](search-indexer-securing-resources.md#granting-access-via-private-endpoints) and [Connect to a data source using a managed identity](search-howto-managed-identities-data-sources.md).

## Stages of indexing

On an initial run, when the index is empty, an indexer will read in all of the data provided in the table or container. On subsequent runs, the indexer can usually detect and retrieve just the data that has changed. For blob data, change detection is automatic. For other data sources like Azure SQL or Cosmos DB, change detection must be enabled.

For each document it receives, an indexer implements or coordinates multiple steps, from document retrieval to a final search engine "handoff" for indexing. Optionally, an indexer is also instrumental in driving skillset execution and outputs, assuming a skillset is defined.

:::image type="content" source="media/search-indexer-overview/indexer-stages.png" alt-text="Indexer Stages" border="false":::

### Stage 1: Document cracking

Document cracking is the process of opening files and extracting content. Depending on the type of data source, the indexer will try performing different operations to extract potentially indexable content.  

Examples:  

+ When the document is a record in an [Azure SQL data source](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md), the indexer will extract each of the fields for the record.
+ When the document is a PDF file in an [Azure Blob Storage data source](search-howto-indexing-azure-blob-storage.md), the indexer will extract text, images, and metadata.
+ When the document is a  record in a [Cosmos DB data source](search-howto-index-cosmosdb.md), the indexer will extract the fields and subfields from the Cosmos DB document.

### Stage 2: Field mappings 

An indexer extracts text from a source field and sends it to a destination field in an index or knowledge store. When field names and types coincide, the path is clear. However, you might want different names or types in the output, in which case you need to tell the indexer how to map the field. 

This step occurs after document cracking, but before transformations, when the indexer is reading from the source documents. When you define a [field mapping](search-indexer-field-mappings.md), the value of the source field is sent as-is to the destination field with no modifications. 

### Stage 3: Skillset execution

Skillset execution is an optional step that invokes built-in or custom AI processing. You might need it for optical character recognition (OCR) in the form of image analysis if the source data is a binary image, or you might need language translation if content is in different languages. 

Whatever the transformation, skillset execution is where enrichment occurs. If an indexer is a pipeline, you can think of a [skillset](cognitive-search-defining-skillset.md) as a "pipeline within the pipeline".

### Stage 4: Output field mappings

If you include a skillset, you will most likely need to include output field mappings. The output of a skillset is really a tree of information called the *enriched document*. Output field mappings allow you to select which parts of this tree to map into fields in your index. Learn how to [define output field mappings](cognitive-search-output-field-mapping.md).

Whereas field mappings associate verbatim values from the data source to destination fields, output field mappings tell the indexer how to associate the transformed values in the enriched document to destination fields in the index. Unlike field mappings, which are considered optional, you will always need to define an output field mapping for any transformed content that needs to reside in an index.

The next image shows a sample indexer [debug session](cognitive-search-debug-session.md) representation of the indexer stages: document cracking, field mappings, skillset execution, and output field mappings.

:::image type="content" source="media/search-indexer-overview/sample-debug-session.png" alt-text="sample debug session" lightbox="media/search-indexer-overview/sample-debug-session.png":::

## Basic workflow

Indexers can offer features that are unique to the data source. In this respect, some aspects of indexer or data source configuration will vary by indexer type. However, all indexers share the same basic composition and requirements. Steps that are common to all indexers are covered below.

### Step 1: Create a data source

Indexers require a *data source* object that provides a connection string and possibly credentials. Call the [Create Data Source (REST)](/rest/api/searchservice/create-data-source) or [SearchIndexerDataSourceConnection class](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourceconnection) to create the resource.

Data sources are configured and managed independently of the indexers that use them, which means a data source can be used by multiple indexers to load more than one index at a time.

### Step 2: Create an index

An indexer will automate some tasks related to data ingestion, but creating an index is generally not one of them. As a prerequisite, you must have a predefined index with fields that match those in your external data source. Fields need to match by name and data type. If not, you can [define field mappings](search-indexer-field-mappings.md) to establish the association. For more information about structuring an index, see [Create an Index (REST)](/rest/api/searchservice/Create-Index) or [SearchIndex class](/dotnet/api/azure.search.documents.indexes.models.searchindex).

> [!Tip]
> Although indexers cannot generate an index for you, the **Import data** wizard in the portal can help. In most cases, the wizard can infer an index schema from existing metadata in the source, presenting a preliminary index schema which you can edit in-line while the wizard is active. Once the index is created on the service, further edits in the portal are mostly limited to adding new fields. Consider the wizard for creating, but not revising, an index. For hands-on learning, step through the [portal walkthrough](search-get-started-portal.md).

### Step 3: Create and run (or schedule) the indexer

An indexer runs when you first [create an indexer](/rest/api/searchservice/Create-Indexer) on the search service. It's only when you create or run the indexer that you'll find out if the data source is accessible or the skillset is valid. After the first run, you can re-run it on demand using [Run Indexer](/rest/api/searchservice/run-indexer), or you can [define a recurring schedule](search-howto-schedule-indexers.md). 

You can monitor the indexer status in the portal or through [Get Indexer Status API](/rest/api/searchservice/get-indexer-status). You should also [run queries on the index](search-query-create.md) to verify the result is what you expected.

## Next steps

Now that you've been introduced, a next step is to review indexer properties and parameters, scheduling, and indexer monitoring. Alternatively, you could return to the list of [supported data sources](#supported-data-sources) for more information about a specific source.

+ [Create indexers](search-howto-create-indexers.md)
+ [Reset and run indexers](search-howto-run-reset-indexers.md)
+ [Schedule indexers](search-howto-schedule-indexers.md)
+ [Define field mappings](search-indexer-field-mappings.md)
+ [Monitor indexer status](search-howto-monitor-indexers.md)