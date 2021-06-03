---
title: Create an indexer
titleSuffix: Azure Cognitive Search
description: Set properties on an indexer to determine data origin and destinations. You can set parameters to modify runtime behaviors.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/28/2021
---

# Creating indexers in Azure Cognitive Search

A search indexer provides an automated workflow for transferring documents and content from an external data source, to a search index on your search service. As originally designed, it extracts text and metadata from an Azure data source, serializes documents into JSON, and passes off the resulting documents to a search engine for indexing. It's since been extended to support [AI enrichment](cognitive-search-concept-intro.md) for deep content processing. 

Using indexers significantly reduces the quantity and complexity of the code you need to write. This article focuses on the mechanics of creating an indexer as preparation for more advanced work with source-specific indexers and [skillsets](cognitive-search-working-with-skillsets.md).

## What's an indexer definition?

Indexers are used for either text-based indexing that pulls alphanumeric content from source fields into index fields, or AI-based processing that analyzes undifferentiated text for structure, or analyzes images for text and information, also adding that content to an index. The following index definitions are typical of what you might create for either scenario.

### Indexers for text content

The original purpose of an indexer was to simplify the complex process of loading an index by providing a mechanism for connecting to and reading text and numeric content from fields in a data source, serialize that content as JSON documents, and hand off those documents to the search engine for indexing. This is still a primary use case, and for this operation, you'll need to create an indexer with the properties defined in the following example.

```json
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

The **`name`**, **`dataSourceName`**, and **`targetIndexName`**  properties are required, and depending on how you create the indexer, both data source and index must already exist on the service before you can run the indexer. 

The **`parameters`** property modifies run time behaviors, such as how many errors to accept before failing the entire job. Parameters are also how you would specify source-specific behaviors. For example, if the source is Blob storage, you can set a parameter that filters on file extensions: `"parameters" : { "configuration" : { "indexedFileNameExtensions" : ".pdf,.docx" } }`.

The **`field mappings`** property is used to explicitly map source-to-destination fields if those fields differ by name or type. Other properties (not shown), are used to [specify a schedule](search-howto-schedule-indexers.md), create the indexer in a disabled state, or specify an [encryption key](search-security-manage-encryption-keys.md) for supplemental encryption of data at rest.

### Indexers for AI indexing

Because indexers are the mechanism by which a search service makes outbound requests, indexers were extended to support AI enrichments, adding infrastructure and objects to implement this use case.

All of the above properties and parameters apply to indexers that perform AI enrichment. The following properties are specific to AI enrichment: **`skillSets`**, **`outputFieldMappings`**, **`cache`** (preview and REST only). 

```json
{
  "name": (required) String that uniquely identifies the indexer,
  "dataSourceName": (required) String, name of an existing data source,
  "targetIndexName": (required) String, name of an existing index,
  "skillsetName" : (required for AI enrichment) String, name of an existing skillset,
  "cache":  {
    "storageConnectionString" : (required for caching AI enriched content) Connection string to a blob container,
    "enableReprocessing": true
    },
  "parameters": {
    "batchSize": null,
    "maxFailedItems": null,
    "maxFailedItemsPerBatch": null
  },
  "fieldMappings": [],
  "outputFieldMappings" : (required for AI enrichment) { ... },
}
```

AI enrichment is beyond the scope of this article. For more information, start with these articles: [AI enrichment](cognitive-search-concept-intro.md), [Skillsets in Azure Cognitive Search](cognitive-search-working-with-skillsets.md), and [Create Skillset (REST)](/rest/api/searchservice/create-skillset).

## Choose an indexer client and create the indexer

When you are ready to create an indexer on a remote search service, you will need a search client in the form of a tool, like Azure portal or Postman, or code that instantiates an indexer client. We recommend the Azure portal or REST APIs for early development and proof-of-concept testing.

### Permissions

All operations related to indexers, including GET requests for status or definitions, require an [admin api-key](search-security-api-keys.md) on the request.

### Limits

All [service tiers limit](search-limits-quotas-capacity.md#indexer-limits) the number of objects that you can create. If you are experimenting on the Free tier, you can only have 3 objects of each type and 2 minutes of indexer processing (not including skillset processing).

### Use Azure portal to create an indexer

The portal provides two options for creating an indexer: [**Import data wizard**](search-import-data-portal.md) and **New Indexer** that provides fields for specifying an indexer definition. The wizard is unique in that it creates all of the required elements. Other approaches require that you have predefined a data source and index.

The following screenshot shows where you can find these features in the portal. 

  :::image type="content" source="media/search-howto-create-indexers/portal-indexer-client.png" alt-text="hotels indexer" border="true":::

### Use a REST client

Both Postman and Visual Studio Code (with an extension for Azure Cognitive Search) can function as an indexer client. Using either tool, you can connect to your search service and send [Create Indexer (REST)](/rest/api/searchservice/create-indexer) requests. There are numerous tutorials and examples that demonstrate REST clients for creating objects. 

Start with either of these articles to learn about each client:

+ [Create a search index using REST and Postman](search-get-started-rest.md)
+ [Get started with Visual Studio Code and Azure Cognitive Search](search-get-started-vs-code.md)

Refer to the [Indexer operations (REST)](/rest/api/searchservice/Indexer-operations) for help with formulating indexer requests.

### Use an SDK

For Cognitive Search, the Azure SDKs implement generally available features. As such, you can use any of the SDKs to create indexer-related objects. All of them provide a **SearchIndexerClient** that has methods for creating indexers and related objects, including skillsets.

| Azure SDK | Client | Examples |
|-----------|--------|----------|
| .NET | [SearchIndexerClient](/dotnet/api/azure.search.documents.indexes.searchindexerclient) | [DotNetHowToIndexers](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToIndexers) |
| Java | [SearchIndexerClient](/java/api/com.azure.search.documents.indexes.searchindexerclient) | [CreateIndexerExample.java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateIndexerExample.java) |
| JavaScript | [SearchIndexerClient](/javascript/api/@azure/search-documents/searchindexerclient) | [Indexers](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/javascript/src/indexers) |
| Python | [SearchIndexerClient](/python/api/azure-search-documents/azure.search.documents.indexes.searchindexerclient) | [sample_indexers_operations.py](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_indexers_operations.py) |

## Run the indexer

An indexer runs automatically when you create the indexer on the service. This is the moment of truth where you will find out if there are data source connection errors, field mapping issues, or skillset problems. 

There are several ways to run an indexer:

+ Send an HTTP request for [Create Indexer](/rest/api/searchservice/create-indexer) or [Update indexer](/rest/api/searchservice/update-indexer) to add or change the definition, and run the indexer.

+ Send an HTTP request for [Run Indexer](/rest/api/searchservice/run-indexer) to execute an indexer with no changes to the definition.

+ Run a program that calls SearchIndexerClient methods for create, update, or run.

> [!NOTE]
> To avoid immediately running an indexer upon creation, include **`disabled=true`** in the indexer definition.

Alternatively, put the indexer [on a schedule](search-howto-schedule-indexers.md) to invoke processing at regular intervals. 

Scheduled processing usually coincides with a need for incremental indexing of changed content. Change detection logic is a capability that's built into source platforms. Changes in a blob container are detected by the indexer automatically. For guidance on leveraging change detection in other data sources, refer to the indexer docs for specific data sources:

+ [Azure SQL database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Data Lake Storage Gen2](search-howto-index-azure-data-lake-storage.md)
+ [Azure Table Storage](search-howto-indexing-azure-tables.md)
+ [Azure Cosmos DB](search-howto-index-cosmosdb.md)

## Change detection and indexer state

Indexers can detect changes in the underlying data and only process new or updated documents on each indexer run. For example, if indexer status says that a run was successful with `0/0` documents processed, it means that the indexer didn't find any new or changed rows or blobs in the underlying data source.

How an indexer supports change detection varies by data source:

+ Azure Blob Storage, Azure Table Storage, and Azure Data Lake Storage Gen2 stamp each blob or row update with a date and time. The various indexers use this information to determine which documents to update in the index. Built-in change detection means that an indexer can recognize new and updated documents, with no additional configuration required on your part.

+ Azure SQL and Cosmos DB provide change detection features in their platforms. You can specify the change detection policy in your data source definition.

For large indexing loads, an indexer also keeps track of the last document it processed through an internal "high water mark". The marker is never exposed in the API, but internally the indexer keeps track of where it stopped. When indexing resumes, either through a scheduled run or an on-demand invocation, the indexer references the high water mark so that it can pick up where it left off.

If you need to clear the high water mark to re-index in full, you can use [Reset Indexer](/rest/api/searchservice/reset-indexer). For more selective re-indexing, use [Reset Skills](/rest/api/searchservice/preview-api/reset-skills) or [Reset Documents](/rest/api/searchservice/preview-api/reset-documents). Through the reset APIs, you can clear internal state, and also flush the cache if you enabled [incremental enrichment](search-howto-incremental-index.md). For more background and comparison of each reset option, see [Run or reset indexers, skills, and documents](search-howto-run-reset-indexers.md).

## Know your data

Indexers expect a tabular row set, where each row becomes a full or partial search document in the index. Often, there is a one-to-one correspondence between a row and the resulting search document, where all the fields in the row set fully populate each document. But you can use indexers to generate just part of a document, for example if you're using multiple indexers or approaches to build out the index. 

To flatten relational data into a row set, you should create a SQL view, or build a query that returns parent and child records in the same row. For example, the built-in hotels sample dataset is a SQL database that has 50 records (one for each hotel), linked to room records in a related table. The query that flattens the collective data into a row set embeds all of the room information in JSON documents in each hotel record. The embedded room information is a generated by a query that uses a **FOR JSON AUTO** clause. You can learn more about this technique in [define a query that returns embedded JSON](index-sql-relational-data.md#define-a-query-that-returns-embedded-json). This is just one example; you can find other approaches that will produce the same effect.

In addition to flattened data, it's important to pull in only searchable data. Searchable data is alphanumeric. Cognitive Search cannot search over binary data in any format, although it can extract and infer text descriptions of image files (see [AI enrichment](cognitive-search-concept-intro.md)) to create searchable content. Likewise, using AI enrichment, large text can be analyzed by natural language models to find structure or relevant information, generating new content that you can add to a search document.

Given that indexers don't fix data problems, other forms of data cleansing or manipulation might be needed. For more information, you should refer to the product documentation of your [Azure database product](../index.yml?product=databases).

## Know your index

Recall that indexers pass off the search documents to the search engine for indexing. Just as indexers have properties that determine execution behavior, an index schema has properties that profoundly affect how strings are indexed (only strings are analyzed and tokenized). Depending on analyzer assignments, indexed strings might be different from what you passed in. You can evaluate the effects of analyzers using [Analyze Text (REST)](/rest/api/searchservice/test-analyzer). For more information about analyzers, see [Analyzers for text processing](search-analyzers.md).

In terms of how indexers interact with an index, an indexer only checks field names and types. There is no validation step that ensures incoming content is correct for the corresponding search field in the index. As a verification step, you can run queries on the populated index that return entire documents or selected fields. For more information about querying the contents of an index, see [Create a basic query](search-query-create.md).

## Next steps

+ [Schedule indexers](search-howto-schedule-indexers.md)
+ [Define field mappings](search-indexer-field-mappings.md)
+ [Monitor indexer status](search-howto-monitor-indexers.md)
+ [Connect using managed identities](search-howto-managed-identities-data-sources.md)