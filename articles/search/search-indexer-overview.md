---
title: Indexers for crawling data during import
titleSuffix: Azure Cognitive Search
description: Crawl Azure SQL Database, SQL Managed Instance, Azure Cosmos DB, or Azure storage to extract searchable data and populate an Azure Cognitive Search index.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/11/2020
ms.custom: fasttrack-edit
---

# Indexers in Azure Cognitive Search

An *indexer* in Azure Cognitive Search is a crawler that extracts searchable data and metadata from an external Azure data source and populates a search index using field-to-field mappings between source data and your index. This approach is sometimes referred to as a 'pull model' because the service pulls data in without you having to write any code that adds data to an index.

Indexers are Azure-only, with individual indexers for [Azure SQL](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md), [Azure Cosmos DB](search-howto-index-cosmosdb.md), [Azure Table Storage](search-howto-indexing-azure-tables.md) and [Blob Storage](search-howto-indexing-azure-blob-storage.md). When configuring an indexer, you'll specify a data source (origin), as well as an index (destination). Several sources, such as Blob storage, have additional configuration properties specific to that content type.

You can run indexers on demand or on a recurring data refresh schedule that runs as often as every five minutes. More frequent updates require a push model that simultaneously updates data in both Azure Cognitive Search and your external data source.

## Usage scenarios

You can use an indexer as the sole means for data ingestion, or use a combination of techniques that include loading just some of the fields in your index, optionally transforming or enriching content along the way. The following table summarizes the main scenarios.

| Scenario |Strategy |
|----------|---------|
| Single source | This pattern is the simplest: one data source is the sole content provider for a search index. From the source, you'll identify one field containing unique values to serve as the document key in the search index. The unique value will be used as an identifier. All other source fields are mapped implicitly or explicitly to corresponding fields in an index. </br></br>An important takeaway is that the value of a document key originates from source data. A search service does not generate key values. On subsequent runs, incoming documents with new keys are added, while incoming documents with existing keys are either merged or overwritten, depending on whether index fields are null or populated. |
| Multiple sources| An index can accept content from multiple sources, where each run brings new content from a different source. </br></br>One outcome might be an index that gains documents after each indexer run, with entire documents created in full from each source. For example, documents 1-100 are from Blob storage, documents 101-200 are from Azure SQL, and so forth. The challenge for this scenario lies in designing an index schema that works for all incoming data, and a document key structure that is uniform in the search index. Natively, the values that uniquely identify a document are metadata_storage_path in a blob container and a primary key in a SQL table. You can imagine that one or both sources must be amended to provide key values in a common format, regardless of content origin. For this scenario, you should expect to perform some level of pre-processing to homogenize the data so that it can be pulled into a single index.</br></br>An alternative outcome might be search documents that are partially populated on the first run, and then further populated by subsequent runs to bring in values from other sources. For example, fields 1-10 are from Blob storage, 11-20 from Azure SQL, and so forth. The challenge of this pattern is making sure that each indexing run is targeting the same document. Merging fields into an existing document requires a match on the document key. For a demonstration of this scenario, see [Tutorial: Index from multiple data sources](tutorial-multiple-data-sources.md). |
| Content transformation | Cognitive Search supports optional [AI enrichment](cognitive-search-concept-intro.md) behaviors that add image analysis and natural language processing to create new searchable content and structure. AI enrichment is indexer-driven, through an attached [skillset](cognitive-search-working-with-skillsets.md). To perform AI enrichment, the indexer still needs an index and data source, but in this scenario, adds skillset processing to indexer execution. |

## Approaches for creating and managing indexers

You can create and manage indexers using these approaches:

+ [Portal > Import Data Wizard](search-import-data-portal.md)
+ [Service REST API](/rest/api/searchservice/Indexer-operations)
+ [.NET SDK](/dotnet/api/azure.search.documents.indexes.models.searchindexer)

If you're using an SDK, create a [SearchIndexerClient](/dotnet/api/azure.search.documents.indexes.searchindexerclient) to work with indexers, data sources, and skillsets. The above link is for the .NET SDK, but all SDKs provide a SearchIndexerClient and similar APIs.

Initially, new data sources are announced as preview features and are REST-only. After graduating to general availability, full support is built into the portal and into the various SDKs, each of which are on their own release schedules.

## Permissions

All operations related to indexers, including GET requests for status or definitions, require an [admin api-key](search-security-api-keys.md).

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

## Stages of indexing

On an initial run, when the index is empty, an indexer will read in all of the data provided in the table or container. On subsequent runs, the indexer can usually detect and retrieve just the data that has changed. For blob data, change detection is automatic. For other data sources like Azure SQL or Cosmos DB, change detection must be enabled.

For each of the document it ingests, an indexer implements or coordinates multiple steps, from document retrieval to a final search engine "handoff" for indexing. Optionally, an indexer is also instrumental in driving skillset execution and outputs, assuming a skillset is defined.

:::image type="content" source="media/search-indexer-overview/indexer-stages.png" alt-text="Indexer Stages" border="false":::

### Stage 1: Document cracking

Document cracking is the process of opening files and extracting content. Depending on the type of data source, the indexer will try performing different operations to extract potentially indexable content.  

Examples:  

+ When the document is a record in an [Azure SQL data source](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md), the indexer will extract each of the fields for the record.
+ When the document is a PDF file in an [Azure Blob Storage data source](search-howto-indexing-azure-blob-storage.md), the indexer will extract text, images, and metadata.
+ When the document is a  record in a [Cosmos DB data source](search-howto-index-cosmosdb.md), the indexer will extract the fields and subfields from the Cosmos DB document.

### Stage 2: Field mappings 

An indexer extracts text from a source field and sends it to a destination field in an index or knowledge store. When field names and types coincide, the path is clear. However, you might want different names or types in the output, in which case you need to tell the indexer how to map the field. This step occurs after document cracking, but before transformations, when the indexer is reading from the source documents. When you define a [field mapping](search-indexer-field-mappings.md), the value of the source field is sent as-is to the destination field with no modifications. Field mappings are optional.

### Stage 3: Skillset execution

Skillset execution is an optional step that invokes built-in or custom AI processing. You might need it for optical character recognition (OCR) in the form of image analysis, or you might need language translation. Whatever the transformation, skillset execution is where enrichment occurs. If an indexer is a pipeline, you can think of a [skillset](cognitive-search-defining-skillset.md) as a "pipeline within the pipeline". A skillset has its own sequence of steps called skills.

### Stage 4: Output field mappings

If you include a skillset, you will most likely need to include output field mappings. The output of a skillset is really a tree of information called the enriched document. Output field mappings allow you to select which parts of this tree to map into fields in your index. Learn how to [define output field mappings](cognitive-search-output-field-mapping.md).

Whereas field mappings associate verbatim values from the data source to destination fields, output field mappings tell the indexer how to associate the transformed values in the enriched document to destination fields in the index. Unlike field mappings, which are considered optional, you will always need to define an output field mapping for any transformed content that needs to reside in an index.

The next image shows a sample indexer [debug session](cognitive-search-debug-session.md) representation of the indexer stages: document cracking, field mappings, skillset execution, and output field mappings.

:::image type="content" source="media/search-indexer-overview/sample-debug-session.png" alt-text="sample debug session" lightbox="media/search-indexer-overview/sample-debug-session.png":::

## Basic configuration steps

Indexers can offer features that are unique to the data source. In this respect, some aspects of indexer or data source configuration will vary by indexer type. However, all indexers share the same basic composition and requirements. Steps that are common to all indexers are covered below.

### Step 1: Create a data source

An indexer obtains data source connection from a *data source* object. The data source definition provides a connection string and possibly credentials. Call the [Create Datasource](/rest/api/searchservice/create-data-source) REST API or [SearchIndexerDataSourceConnection class](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourceconnection) to create the resource.

Data sources are configured and managed independently of the indexers that use them, which means a data source can be used by multiple indexers to load more than one index at a time.

### Step 2: Create an index

An indexer will automate some tasks related to data ingestion, but creating an index is generally not one of them. As a prerequisite, you must have a predefined index with fields that match those in your external data source. Fields need to match by name and data type. For more information about structuring an index, see [Create an Index (Azure Cognitive Search REST API)](/rest/api/searchservice/Create-Index) or [SearchIndex class](/dotnet/api/azure.search.documents.indexes.models.searchindex). For help with field associations, see [Field mappings in Azure Cognitive Search indexers](search-indexer-field-mappings.md).

> [!Tip]
> Although indexers cannot generate an index for you, the **Import data** wizard in the portal can help. In most cases, the wizard can infer an index schema from existing metadata in the source, presenting a preliminary index schema which you can edit in-line while the wizard is active. Once the index is created on the service, further edits in the portal are mostly limited to adding new fields. Consider the wizard for creating, but not revising, an index. For hands-on learning, step through the [portal walkthrough](search-get-started-portal.md).

### Step 3: Create and schedule the indexer

The indexer definition is a construct that brings together all of the elements related to data ingestion. Required elements include a data source and index. Optional elements include a schedule and field mappings. Field mappings are only optional if source fields and index fields clearly correspond. For more information about structuring an indexer, see [Create Indexer (Azure Cognitive Search REST API)](/rest/api/searchservice/Create-Indexer).

<a id="RunIndexer"></a>

## Run indexers on-demand

While it's common to schedule indexing, an indexer can also be invoked on demand using the [Run command](/rest/api/searchservice/run-indexer):

```http
POST https://[service name].search.windows.net/indexers/[indexer name]/run?api-version=2020-06-30
api-key: [Search service admin key]
```

> [!NOTE]
> When Run API returns a success code, the indexer invocation has been scheduled, but the actual processing happens asynchronously. 

You can monitor the indexer status in the portal or through [Get Indexer Status API](/rest/api/searchservice/get-indexer-status). 

<a name="GetIndexerStatus"></a>

## Get indexer status

You can retrieve the status and execution history of an indexer through the [Get Indexer Status command](/rest/api/searchservice/get-indexer-status):

```http
GET https://[service name].search.windows.net/indexers/[indexer name]/status?api-version=2020-06-30
api-key: [Search service admin key]
```

The response contains overall indexer status, the last (or in-progress) indexer invocation, and the history of recent indexer invocations.

```output
{
    "status":"running",
    "lastResult": {
        "status":"success",
        "errorMessage":null,
        "startTime":"2018-11-26T03:37:18.853Z",
        "endTime":"2018-11-26T03:37:19.012Z",
        "errors":[],
        "itemsProcessed":11,
        "itemsFailed":0,
        "initialTrackingState":null,
        "finalTrackingState":null
     },
    "executionHistory":[ {
        "status":"success",
         "errorMessage":null,
        "startTime":"2018-11-26T03:37:18.853Z",
        "endTime":"2018-11-26T03:37:19.012Z",
        "errors":[],
        "itemsProcessed":11,
        "itemsFailed":0,
        "initialTrackingState":null,
        "finalTrackingState":null
    }]
}
```

Execution history contains up to the 50 most recent completed executions, which are sorted in reverse chronological order (so the latest execution comes first in the response).

## Next steps

Now that you have the basic idea, the next step is to review requirements and tasks specific to each data source type.

+ [Azure SQL Database, SQL Managed Instance, or SQL Server on an Azure virtual machine](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Cosmos DB](search-howto-index-cosmosdb.md)
+ [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md)
+ [Azure Table Storage](search-howto-indexing-azure-tables.md)
+ [Indexing CSV blobs using the Azure Cognitive Search Blob indexer](search-howto-index-csv-blobs.md)
+ [Indexing JSON blobs with Azure Cognitive Search Blob indexer](search-howto-index-json-blobs.md)