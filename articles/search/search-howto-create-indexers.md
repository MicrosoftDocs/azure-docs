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

# Create a search indexer

A search indexer provides an automated workflow for transferring documents and content from an external data source, to a search index on your search service. As originally designed, it extracts text and other information from Azure data sources, serializes documents into JSON, and passes off the resulting documents to a search engine for indexing. It's since been extended to support [AI enrichment](cognitive-search-concept-intro.md). Using indexers significantly reduces the quantity and complexity of the code you need to write.

This article focuses on the mechanics and structure of indexers so that you have a foundation in place before exploring  source-specific indexers and [skillsets](cognitive-search-working-with-skillsets.md).

## Indexer definition

Indexers can perform text-based indexing that pulls text from source fields to index fields, or perform AI-based processing that analyzes undifferentiated text for structure, or analyzes images for text and information. The following index definitions are typical of what you might expect for either scenario.

### Indexers for text content

The original purpose of an indexer was to simplify the complex process of loading an index by providing a mechanism for connecting to and reading text and numeric content from fields in a data source, serialize that content as JSON documents, and hand off those documents to the search engine for indexing. This is still a primary use case, and for this operation, you'll need to create an indexer with the properties defined in this section.

The **`name`**, **`dataSourceName`**, and **`targetIndexName`**  properties are required, and depending on how you create the indexer, both data source and index must already exist before you can run the indexer. 

The **`parameters`** property informs run time behaviors, such as how many errors to accept before failing the entire job. Parameters are also how you would specify source-specific behaviors. For example, if the source is Blob storage, you can set a parameter that filters on file extensions: `"parameters" : { "configuration" : { "indexedFileNameExtensions" : ".pdf,.docx" } }`.

The **`field mappings`** property is used to explicitly map source-to-destination fields if those fields differ by name or type. Other properties (not shown), are used to specify a schedule, create the indexer in a disabled state, or specify an encryption key for supplemental encryption of data at rest.

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

### Indexers for AI indexing

Because indexers are the mechanism by which a search service makes outbound requests, indexers were extended to support AI enrichments, adding steps and objects necessary for this use case.

All of the above properties and parameters apply to indexers that perform AI enrichment, with the addition of three properties that are specific to AI enrichment: **`skillSets`**, **`outputFieldMappings`**, **`cache`** (preview and REST only). AI enrichment is beyond the scope of this article. For more information, start with [Skillsets in Azure Cognitive Search](cognitive-search-working-with-skillsets.md) or [Create Skillset (REST)](/rest/api/searchservice/create-skillset).

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

## Set up an indexer client

To create an indexer on a remote search service and initiate commands, you will need a search client in the form of a tool, like Azure portal or Postman, or code to instantiate an indexer client that connects to the service. We recommend the Azure portal or REST APIs for early development and proof-of-concept testing.

### Permissions

All operations related to indexers, including GET requests for status or definitions, require an [admin api-key](search-security-api-keys.md) on the request.

### Limits

All [service tiers limit](search-limits-quotas-capacity.md#indexer-limits) the number of objects that you can create. If you are experimenting on the Free tier, you can only have 3 objects of each type and 2 minutes of indexer processing (not including skillset processing).

### Use Azure portal to create an indexer

The portal provides two options for creating an indexer: [**Import Data Wizard**](search-import-data-portal.md) or **New Indexer** that provides fields for specifying an indexer definition. The wizard is unique in that it creates all of the required elements. Other approaches require that you have predefined a data source and index.

  :::image type="content" source="media/search-howto-create-indexers/portal-indexer-client.png" alt-text="hotels indexer" border="true":::

### Use a REST client

Both Postman and Visual Studio Code (with an extension for Azure Cognitive Search) can function as an indexer client. Using either tool, you can connect to your search service and send requests that create indexers and other objects. There are numerous tutorials and examples that demonstrate REST clients for creating objects. 

Start with [Create a search index using REST](search-get-started-rest.md) or [Get started with Visual Studio Code and Azure Cognitive Search](search-get-started-vs-code.md) for an introduction to each client, and then refer to the [Indexer operations (REST)](/rest/api/searchservice/Indexer-operations) for help with indexer requests.

### Use an SDK

For Cognitive Search, the Azure SDKs implement generally available features. As such, you can use any of the SDKs to create indexer-related objects. All of them implement a **SearchIndexerClient** that provides methods to creating indexers and related objects, including skillsets.

| Azure SDK | Client | Examples |
|-----------|--------|----------|
| .NET | [SearchIndexerClient](/dotnet/api/azure.search.documents.indexes.searchindexerclient) | [DotNetHowToIndexers](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToIndexers) |
| Java | [SearchIndexerClient](/java/api/com.azure.search.documents.indexes.searchindexerclient) | [CreateIndexerExample.java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateIndexerExample.java) |
| JavaScript | [SearchIndexerClient](/javascript/api/@azure/search-documents/searchindexerclient) | [Indexers](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/javascript/src/indexers) |
| Python | [SearchIndexerClient](/python/api/azure-search-documents/azure.search.documents.indexes.searchindexerclient) | [sample_indexers_operations.py](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_indexers_operations.py) |

## Run the indexer

An indexer runs automatically when you create the indexer on the service. An interactive HTTP request for Create Indexer or Update indexer will run an indexer. Running a program that calls SearchIndexerClient methods will also run an indexer.

To avoid immediately running an indexer upon creation, set **`disabled=true`** in the indexer definition.

Once an indexer exists, you can run it on demand using [Run Indexer (REST)]() or an equivalent SDK method. Or, specify a schedule that specifies intervals for running the job. Scheduled processing usually coincides with a need for incremental indexing of changed content. Change detection logic is a capability that's built into source platforms. Changes in a blob container are detected by the indexer automatically. For guidance on leveraging change detection in other data sources, refer to the indexer docs for specific data sources:

+ [Azure SQL database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Data Lake Storage Gen2](search-howto-index-azure-data-lake-storage.md)
+ [Azure Table Storage](search-howto-indexing-azure-tables.md)
+ [Azure Cosmos DB](search-howto-index-cosmosdb.md)

## Next steps

+ [Schedule indexers](search-howto-schedule-indexers.md)
+ [Define field mappings](search-indexer-field-mappings.md)
+ [Monitor indexer status](search-howto-monitor-indexers.md)
+ [Connect using managed identities](search-howto-managed-identities-data-sources.md)