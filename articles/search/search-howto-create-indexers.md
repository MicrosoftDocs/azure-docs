---
title: Create an indexer
titleSuffix: Azure Cognitive Search
description: Set properties on an indexer to determine data origin and destinations. You can set parameters to modify runtime behaviors.

manager: nitinme
author: HeidiSteen
ms.author: heidist

ms.service: cognitive-search
ms.topic: how-to
ms.date: 01/17/2022
---

# Creating indexers in Azure Cognitive Search

A search indexer provides an automated workflow for reading content from an external data source, and ingesting that content into a search index on your search service. Indexers support two workflows: 

+ Extract text and metadata during indexing for full text search scenarios

+ Apply integrated machine learning and AI models to analyze content that is *not* intrinsically searchable, such as images and large undifferentiated text. This extended workflow is called [AI enrichment](cognitive-search-concept-intro.md) and it's indexer-driven.

Using indexers significantly reduces the quantity and complexity of the code you need to write. This article focuses on the basics of creating an indexer. Depending on the data source and your workflow, additional configuration might be necessary.

## Indexer definitions

When creating an indexer, the definition will adhere to one of two patterns: text-based indexing or AI enrichment with skills.

### Indexer definition for full text search

Full text search is the primary use case for indexers, and for this operation, an indexer uses the following properties.

```json
{
  "name": (required) String that uniquely identifies the indexer,
  "description": (optional),
  "dataSourceName": (required) String indicating which existing data source to use,
  "targetIndexName": (required) String indicating which existing index to use,
  "parameters": {
    "batchSize": null,
    "maxFailedItems": 0,
    "maxFailedItemsPerBatch": 0,
    "base64EncodeKeys": false,
    "configuration": {}
  },
  "fieldMappings": (optional) unless field discrepancies need resolution,
  "disabled": null,
  "schedule": null,
  "encryptionKey": null
}
```

Parameters modify run time behaviors, such as how many errors to accept before failing the entire job. The parameters above are available for all indexers and are documented in the [REST API reference](/rest/api/searchservice/create-indexer#request-body). Source-specific indexers for blobs, SQL, and Cosmos DB provide additional "configuration" parameters for source-specific behaviors. For example, if the source is Blob Storage, you can set a parameter that filters on file extensions: `"parameters" : { "configuration" : { "indexedFileNameExtensions" : ".pdf,.docx" } }`.

Field mappings are used to explicitly map source-to-destination fields if those fields differ by name or type. 

An indexer will run immediately when you create it on the search service. If you don't want indexer execution, set "disabled" to true. 

You can also [specify a schedule](search-howto-schedule-indexers.md) or set an [encryption key](search-security-manage-encryption-keys.md) for supplemental encryption of the indexer definition.

### Indexing for AI enrichment

Indexers also drive [AI enrichment](cognitive-search-concept-intro.md). All of the above properties and parameters apply, but the following properties are specific to AI enrichment: **`skillSetName`**, **`outputFieldMappings`**, **`cache`**. A few other required and similarly named properties are added for context.

```json
{
  "name": (required) String that uniquely identifies the indexer,
  "dataSourceName": (required) String, provides raw content that will be enriched,
  "targetIndexName": (required) String, name of an existing index,
  "skillsetName" : (required for AI enrichment) String, name of an existing skillset,
  "cache":  {
    "storageConnectionString" : (required if you enable the cache) Connection string to a blob container,
    "enableReprocessing": true
    },
  "parameters": { },
  "fieldMappings": (optional) Maps fields in the underlying data source to fields in an index,
  "outputFieldMappings" : (required) Maps skill outputs to fields in an index,
}
```

AI enrichment is out of scope for this article. For more information, start with [Skillsets in Azure Cognitive Search](cognitive-search-working-with-skillsets.md), [Create a skillset](cognitive-search-defining-skillset.md), [Map enrichment output fields](cognitive-search-output-field-mapping.md), and [Enable caching for AI enrichment](search-howto-incremental-index.md).

## Prerequisites

+ Use a [supported data source](search-indexer-overview.md#supported-data-sources).

+ [Create a search index](search-how-to-create-search-index.md) that can accept incoming data.

+ Have admin rights. All operations related to indexers, including GET requests for status or definitions, require an [admin api-key](search-security-api-keys.md) on the request.

+ Be under the [maximum limits](search-limits-quotas-capacity.md#indexer-limits) for your service tier. The Free tier allows three objects of each type and 1-3 minutes of indexer processing or 3-10 if there is a skillset.

## Prepare data

Indexers work with data sets. When you run an indexer, it connects to your data source, retrieves the data from the container or folder, optionally serializes it into JSON before passing it to the search engine for indexing. This section describes the requirements of incoming data for text-based indexing.

If your data is already JSON, the structure or shape of incoming data should correspond to the schema of your search index. Most indexes are fairly flat, where the fields collection consists of fields at the same level, but hierarchical or nested structures are possible through [complex fields and collections](search-howto-complex-data-types.md). 

If your data is relational, you will need to provide it as a flattened row set, where each row becomes a full or partial search document in the index. To flatten relational data into a row set, you should create a SQL view, or build a query that returns parent and child records in the same row. For example, the built-in hotels sample dataset is a SQL database that has 50 records (one for each hotel), linked to room records in a related table. The query that flattens the collective data into a row set embeds all of the room information in JSON documents in each hotel record. The embedded room information is a generated by a query that uses a **FOR JSON AUTO** clause. You can learn more about this technique in [define a query that returns embedded JSON](index-sql-relational-data.md#define-a-query-that-returns-embedded-json). This is just one example; you can find other approaches that will produce the same result.

If your data is file-based, the indexer generally creates one search document for each file, where the search document consists of fields for content and metadata. Depending on the file type, the indexer can sometimes parse one file into multiple search documents (for example, if the file is CSV and each row becomes a search document).

Remember to pull in only searchable and filterable data. Searchable data is text. Filterable data is alphanumeric. Cognitive Search cannot search over binary data in any format, although it can extract and infer text descriptions of image files (see [AI enrichment](cognitive-search-concept-intro.md)) to create searchable content. Likewise, large text can be broken down and analyzed by natural language models to find structure or relevant information, generating new content that you can add to a search document.

Given that indexers don't fix data problems, other forms of data cleansing or manipulation might be needed. For more information, you should refer to the product documentation of your [Azure database product](../index.yml?product=databases).

## Prepare an index

The output of an indexer is a search index, and the attributed fields in the index will receive the incoming data. Fields are the only receptors of external content, and depending on how the fields are attributed, the values for each field will be analyzed, tokenized, or stored as verbatim strings for filters, fuzzy search, and typeahead queries.

Recall that indexers pass off the search documents to the search engine for indexing. Just as indexers have properties that determine execution behavior, an index schema has properties that profoundly affect how strings are indexed (only strings are analyzed and tokenized). 

Depending on analyzer assignments on each field, indexed strings might be different from what you passed in. You can evaluate the effects of analyzers using [Analyze Text (REST)](/rest/api/searchservice/test-analyzer). For more information about analyzers, see [Analyzers for text processing](search-analyzers.md).

In terms of how indexers interact with an index, an indexer only checks field names and types. There is no validation step that ensures incoming content is correct for the corresponding search field in the index.

## Create an indexer

When you are ready to create an indexer on a remote search service, you will need a search client, such as Azure portal or Postman, or code that instantiates an indexer client. We recommend the Azure portal or REST APIs for early development and proof-of-concept testing.

### [**Azure portal**](#tab/indexer-portal)

The portal provides two options for creating an indexer: [**Import data wizard**](search-import-data-portal.md) and **New Indexer** that provides a visual editor for specifying an indexer definition. The wizard is unique in that it creates all of the required elements. Other approaches require that you have predefined a data source and index.

The following screenshot shows where you can find these features in the portal. 

  :::image type="content" source="media/search-howto-create-indexers/portal-indexer-client.png" alt-text="hotels indexer" border="true":::

### [**REST**](#tab/indexer-rest)

Both Postman and Visual Studio Code (with an extension for Azure Cognitive Search) can function as an indexer client. Using either tool, you can connect to your search service and send [Create Indexer (REST)](/rest/api/searchservice/create-indexer) or [Update indexer](/rest/api/searchservice/update-indexer) requests. 

```http
POST /indexers?api-version=[api-version]
{
  "name": (required) String that uniquely identifies the indexer,
  "dataSourceName": (required) String indicated which existing data source to use,
  "targetIndexName": (required) String,
  "parameters": {
    "batchSize": null,
    "maxFailedItems": null,
    "maxFailedItemsPerBatch": null
  },
  "fieldMappings": [ optional unless there are field discrepancies that need resolution]
}
```

There are numerous tutorials and examples that demonstrate REST clients for creating objects.  Start with either of these articles to learn about each client:

+ [Create a search index using REST and Postman](search-get-started-rest.md)
+ [Get started with Visual Studio Code and Azure Cognitive Search](search-get-started-vs-code.md)

Refer to the [Indexer operations (REST)](/rest/api/searchservice/Indexer-operations) for help with formulating indexer requests.

### [**.NET SDK**](#tab/indexer-csharp)

For Cognitive Search, the Azure SDKs implement generally available features. As such, you can use any of the SDKs to create indexer-related objects. All of them provide a **SearchIndexerClient** that has methods for creating indexers and related objects, including skillsets.

| Azure SDK | Client | Examples |
|-----------|--------|----------|
| .NET | [SearchIndexerClient](/dotnet/api/azure.search.documents.indexes.searchindexerclient) | [DotNetHowToIndexers](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToIndexers) |
| Java | [SearchIndexerClient](/java/api/com.azure.search.documents.indexes.searchindexerclient) | [CreateIndexerExample.java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateIndexerExample.java) |
| JavaScript | [SearchIndexerClient](/javascript/api/@azure/search-documents/searchindexerclient) | [Indexers](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/search/search-documents/samples/v11/javascript) |
| Python | [SearchIndexerClient](/python/api/azure-search-documents/azure.search.documents.indexes.searchindexerclient) | [sample_indexers_operations.py](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_indexers_operations.py) |

---

## Run the indexer

By default, an indexer runs immediately when you create it on the search service. You can override this behavior by setting "disabled" to true in the indexer definition. Indexer execution is the moment of truth where you will find out if there are data source connection errors, field mapping issues, or skillset problems. 

There are several ways to run an indexer:

+ Run on indexer creation or update (default).

+ Run on demand when there are no changes to the definition, or precede with reset for full indexing. For more information, see [Run or reset indexers](search-howto-run-reset-indexers.md).

+ [Schedule indexer processing](search-howto-schedule-indexers.md) to invoke execution at regular intervals. 

Scheduled execution is usually implemented when you have a need for incremental indexing so that you can pick up the latest changes. As such, scheduling has a dependency on change detection.

## Change detection and internal state

Change detection logic is a capability that's built into source platforms. If your data source support change detection, an indexer can detect changes in the underlying data and only process new or updated documents on each indexer run, leaving unchanged content as-is. If indexer execution history says that a run was successful with `0/0` documents processed, it means that the indexer didn't find any new or changed rows or blobs in the underlying data source.

How an indexer supports change detection varies by data source:

+ Azure Blob Storage, Azure Table Storage, and Azure Data Lake Storage Gen2 stamp each blob or row update with a date and time. The various indexers use this information to determine which documents to update in the index. Built-in change detection means that an indexer can recognize new and updated documents automatically.

+ Azure SQL and Cosmos DB provide change detection features in their platforms. You can specify the change detection policy in your data source definition.

For large indexing loads, an indexer also keeps track of the last document it processed through an internal "high water mark". The marker is never exposed in the API, but internally the indexer keeps track of where it stopped. When indexing resumes, either through a scheduled run or an on-demand invocation, the indexer references the high water mark so that it can pick up where it left off.

If you need to clear the high water mark to re-index in full, you can use [Reset Indexer](/rest/api/searchservice/reset-indexer). For more selective re-indexing, use [Reset Skills](/rest/api/searchservice/preview-api/reset-skills) or [Reset Documents](/rest/api/searchservice/preview-api/reset-documents). Through the reset APIs, you can clear internal state, and also flush the cache if you enabled [incremental enrichment](search-howto-incremental-index.md). For more background and comparison of each reset option, see [Run or reset indexers, skills, and documents](search-howto-run-reset-indexers.md).

## Check results

[Monitor indexer status](search-howto-monitor-indexers.md) to check for status. Successful execution can still include warning and notifications. Be sure to check both successful and failed status notifications for details about the job.

For additional verification, [run queries](search-query-create.md) on the populated index that return entire documents or selected fields.

## Next steps

+ [Index data from Azure Blob Storage](search-howto-indexing-azure-blob-storage.md)
+ [Index data from Azure SQL database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Index data from Azure Data Lake Storage Gen2](search-howto-index-azure-data-lake-storage.md)
+ [Index data from Azure Table Storage](search-howto-indexing-azure-tables.md)
+ [Index data from Azure Cosmos DB](search-howto-index-cosmosdb.md)