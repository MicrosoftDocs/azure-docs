---
title: Create Indexer (Azure Search Service REST api-version=2017-11-11-Preview)
description: In the preview API, indexers are extended to include outputFieldMapping parameters used to map enrichment output to a field in an Azure Search index.
services: search
manager: pablocas
author: luiscabrer
ms.author: luisca
ms.date: 05/01/2018
ms.prod: "azure"
ms.service: search
ms.devlang: rest-api
ms.workload: search
ms.topic: language-reference
---
# Create Indexer (Azure Search Service REST api-version=2017-11-11-Preview)

This API reference is a preview-specific version of the documentation, covering cognitive search enhancements to indexing.

As with the [generally available](https://docs.microsoft.com/rest/api/searchservice/create-indexer) version, you can create a new indexer within an Azure Search service using an HTTP POST request. 

```http
POST https://[service name].search.windows.net/indexers?api-version=[api-version]  
    Content-Type: application/json  
    api-key: [admin key]  
```  
The **api-key** must be an admin key (as opposed to a query key). Refer to the authentication section in [Security in Azure Search](search-security-overview.md) to learn more about keys. [Create an Azure Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.

Alternatively, you can use PUT and specify the data source name on the URI. If the data source does not exist, it will be created.  

```http
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=[api-version]  
```  
The **api-version** is required. The current generally available version is `2017-11-11`, but you need the preview version for cognitive search.  See [API versions in Azure Search](search-api-versions.md) for details.

For data-platform-specific guidance on creating indexers, start with [Indexers overview](search-indexer-overview.md), which includes the complete list of [related articles](search-indexer-overview.md#next-steps).

> [!NOTE]  
>  The maximum number of indexers allowed varies by pricing tier. The free service allows up to 3 indexers. Standard service allows 50 indexers. Standard High Definition services do not support indexers at all. See [Service Limits](search-limits-quotas-capacity.md) for details.    

## Request  
 The body of the request contains an indexer definition, which specifies the data source and the target index for indexing, as well as optional [indexer schedule](#indexer-schedule) and [indexer parameters](#indexer-parameters).  

 The syntax for structuring the request payload is as follows. A sample request is provided later in this topic.  

```json
{   
    "name" : "Required for POST, optional for PUT. The name of the indexer",  
    "description" : "Optional. Anything you want, or null",  
    "dataSourceName" : "Required. The name of an existing data source",  
    "targetIndexName" : "Required. The name of an existing index",  
    "schedule" : { Optional, but immediately runs once if unspecified. See Indexing Schedule below. },  
    "parameters" : { Optional. See Indexing Parameters below. },  
    "fieldMappings" : { Optional. See fieldMappings below. },
    "outputFieldMappings" : { Required for enrichment pipelines. See outputFieldMappings below. },
    "disabled" : Optional boolean value indicating whether the indexer is disabled. False by default.
}  
```
### Data source and target index

An indexer, [data source](https://docs.microsoft.com/rest/api/searchservice/create-data-source), and [index](https://docs.microsoft.com/rest/api/searchservice/create-index) are a triad in how they work together, but each one also exists independently in Azure Search to flex with your application architecture. For example, using the same data source in multiple indexers, or using the same indexer write to multiple indexes, and so forth. Having said that, if neither the data source nor index exists when you create the indexer, both resources are created alongside the indexer when the request is submitted.

The data source you provide determines how the indexer crawls the source, the type of content and supported operations (such as image analysis and cognitive search behaviors over blobs), and how source data is serialized and ingested internally. Data sources can be any of the following Azure data sources:

+ [Azure Cosmos DB](search-howto-index-cosmosdb.md)
+ [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md)
+ [Azure SQL](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Table Storage](search-howto-indexing-azure-tables.md)

Any of these data sources can be used in [cognitive search](cognitive-search-concept-intro.md). It's [indexer parameters](#parameters) and [output field mappings](#field-mappings) with a [skillset](ref-create-skillset.md) that invoke cognitive search enrichments.
 
<a name="indexer-schedule"></a>

### Schedule  
An indexer can optionally specify a schedule. Without a schedule, the indexer is runs immediately when you send the request: connecting to, crawling, and indexing the data source. For some scenarios including long-running indexing jobs, schedules are used to [extend the processing window](https://docs.microsoft.com/azure/search/search-howto-reindex#scale-out-indexing) beyond the 24-hour maximum. If a schedule is present, the indexer runs periodically as per schedule. The scheduler is built in; you cannot use an external scheduler.A  **Schedule** has the following attributes: 

-   **interval**: Required. A duration value that specifies an interval or period for indexer runs. The smallest allowed interval is five minutes; the longest is one day. It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](http://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). The pattern for this is: `"P[nD][T[nH][nM]]".` Examples:  `PT15M` for every 15 minutes, `PT2H` for every 2 hours.  

-   **startTime**: Optional. A UTC datetime when the indexer should start running.  

<a name="indexer-parameters"></a>

### Configuration parameters 

An indexer can optionally take configuration parameters that modify behavior. Configuration parameters are comma-delimited on the indexer request. 

```json
    {
      "name" : "my-blob-indexer-for-congitive-search",
      ... other indexer properties
      "parameters" : { "configuration" : { "maxFailedItems" : "15", "imageAction" : "generateNormalizedImages", "dataToExtract" : "contentAndMetadata" } }
    }
```

#### General parameters for all indexers

| Parameter | Type and allowed values	| Usage  |
|-----------|------------|--------------------------|--------|
| `"batchSize"` | Integer<br/>Default is source-specific (1000 for Azure SQL Database and Azure Cosmos DB, 10 for Azure Blob Storage) | Specifies the number of items that are read from the data source and indexed as a single batch in order to improve performance. |
| `"maxFailedItems"` | Integer<br/>Default is 0 | Number of errors to tolerate before an indexer run is considered a failure. You can retrieve information about failed items using [Get Indexer Status](https://docs.microsoft.com/rest/api/searchservice/get-indexer-status).  |
| `"maxFailedItemsPerBatch"` | Integer<br/>Default is 0 | Number of errors to tolerat in each batch before an indexer run is considered a failure. |

#### Blob configuration parameters

Several parameters are exclusive to a particular indexer, such as Azure blob indexing. The **Applies to** column identifies how the parameter is used.

| Parameter | Applies to               |	Type and allowed values	| Usage  |
|-----------|--------------------------|----------------------------|--------|
| `"parsingMode"` | [Azure blobs](search-howto-indexing-azure-blob-storage.md)<br/><br/>[CSV](search-howto-index-csv-blobs.md)<br/><br/>[JSON](search-howto-index-json-blobs.md) | String<br/>`"text"`<br/>`"delimitedText"`<br/>`"json"`<br/>`"jsonArray"`  | Set to `text` to improve indexing performance on plain text files in blob storage. <br/><br/>Set to `delimitedText` when blobs are plain CSV files. <br/><br/>Set to `json` to extract structured content from JSON blobs in Azure Blob storage. <br/>Set to `jsonArray` to extract individual elements of an array as separate documents in Azure Search. |
| `"excludedFileNameExtensions"` | [Azure blobs](search-howto-indexing-azure-blob-storage.md) | String<br/>Comma-delimited list | Controls which blobs are ignored based on a comma-delimited list of file extensions. For example, you could exclude ".png, .png, .mp4" to skip those files. | 
| `"indexedFileNameExtensions"` | [Azure blobs](search-howto-indexing-azure-blob-storage.md) | String<br/>Comma-delimited list | Controls which blobs are indexed based on a comma-delimited list of file extensions. For example, you could enable indexing for specific application files ".docx, .pptx, .msg" to specifically include those file types. | 
| `"failOnUnsupportedContentType"` | [Azure blobs](search-howto-indexing-azure-blob-storage.md) | true (default) <br/>false | Set to `false` if you want to continue indexing when an unsupported content type is encountered, and you don't know all the content types (file extensions) in advance. |
| `"failOnUnprocessableDocument"` | [Azure blobs](search-howto-indexing-azure-blob-storage.md) | true (default) <br/>false | Set to `false` if you want to continue indexing if a document fails indexing. |
| `"indexStorageMetadataOnlyForOversizedDocuments"` | [Azure blobs](search-howto-indexing-azure-blob-storage.md) | true (default) <br/>false | Azure Search limits the size of blobs, as documented in [Service Limits](search-limits-quotas-capacity.md). Oversized blobs are treated as errors by default. Set this property to `true` to still index storage metadata for blob content that is too large to process.  |
| `"delimitedTextHeaders"` | [CSV](search-howto-index-csv-blobs.md) | String<br/>Comma-delimited list| Specifies a comma-delimited list of column headers, useful for mapping source fields to destination fields in an index. CSV blobs are a preview feature.|
| `"delimitedTextDelimiter"` | [CSV](search-howto-index-csv-blobs.md) | String<br/>user-defined | Specifies the end-of-line delimiter for CSV files where each line starts a new document (for example, `"|"`). CSV blobs are a preview feature. |
| `"firstLineContainsHeaders"` | [CSV](search-howto-index-csv-blobs.md) | true (default) <br/>false | Indicates that the first (non-blank) line of each blob contains headers. CSV blobs are a preview feature. |
| `"documentRoot"` | [JSON](search-howto-index-json-blobs.md#nested-json-arrays) | String<br/>User-defined | Given a nested JSON array, you can specify a path to the array using this property. JSON arrays are a preview feature. |
| `"imageAction"` | [Azure blobs](search-howto-indexing-azure-blob-storage.md)<br/><br/>[image-analysis](cognitive-search-concept-image-scenarios.md) | String<br/>`"none"`<br/>`"generateNormalizedImages"` | Tells the indexer to extract text from images (for example, the word "stop" from a traffic Stop sign), and embed it as part of the content field. <br/><br/>Set to`"none"` to ignore embedded images or image files in the data set. This is the default. <br/><br/>Set to`"generateNormalizedImages"` to create an array of normalized images as part of document cracking, and embed the information as part of the content field. This setting applies to Azure blob data sources when `"dataToExtract"` is set to `"contentAndMetadata"`. Normalized images are subject to additional processing resulting in uniform image output, sized and rotated to promote consistent rendering when you include images in visual search results (for example, same-size photographs in a graph control as seen in the [JFK demo](https://github.com/Microsoft/AzureSearch_JFK_Files)). |
| `"dataToExtract"` | [Azure blobs](search-howto-indexing-azure-blob-storage.md)<br/><br/>[image-analysis](cognitive-search-concept-image-scenarios.md) | String<br/>`"storageMetadata"`<br/>`"allMetadata"`<br/>`"contentAndMetadata"`   | Tells the indexer which data to extract from image content. Applies to embedded image content in a .PDF or other application, or image files such as .jpg and .png, in Azure blobs. <br/><br/>Set to `"storageMetadata"` to index just the [standard blob properties and user-specified metadata](../storage/blobs/storage-properties-metadata.md). <br/><br/>Set to `"allMetadata"` to extract metadata provided by the Azure blob storage subsystem and the [content-type specific metadata](search-howto-indexing-azure-blob-storage.md#ContentSpecificMetadata) (for example, metadata unique to just .png files) are indexed. <br/><br/>Set to `"contentAndMetadata"` to extract all metadata and textual content from each blob. This is the default value. Requires that you have also set `"imageAction"` to `"generateNormalizedImages"`. |


#### Database configuration parameters

The following parameters are specific to Azure Cosmos DB or Azure SQL Database.

| Parameter | Applies to   |	Type and allowed values	| Usage  |
|-----------|--------------------------|----------------------------|--------|
| `"assumeOrderByHighWaterMarkColumn"` | [Cosmos DB](search-howto-index-cosmosdb.md) | true (default) <br/>false | Explicitly tells Azure Search to order results by a timestamp (`_ts` column) when the Cosmos DB query also includes an ORDER BY on the same field. |
| `"disableOrderByHighWaterMarkColumn"` | [Azure SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md) |  true <br/>false (default) | If you have a specific need for turning off the high-water mark that allows the indexer to keep track of its progress, you can set this parameter to do so. If indexing is interrupted for any reason, a full re-index is required. |
| `"queryTimeout"` | [Azure SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md) | String<br/>"00:00:00"| Set this parameter to increase the timeout beyond the 5-minute default. Value is articulated in hours, minutes, and seconds. |

<a name="field-mappings"></a>

### Field mappings

Indexer definitions contain field associations for mapping a source field to a destination field in an Azure Search index. There are two types of associations depending on whether the content transfer follows a direct or enriched path:

+ **fieldMappings** are optional, applied when source-destination field names do not match, or when you want to specify a function.
+ **outputFieldMappings** are required if you are building [an enrichment pipeline](cognitive-search-concept-intro.md). In an enrichment pipeline, the output field is a construct defined during the enrichment process. For example, the output field might be a compound structure built during enrichment from two separate fields in the source document. 

#### fieldMappings parameter

In the following example, consider a source table with a field `_id`. Azure Search doesn't allow a field name starting with an underscore, so the field must be renamed. This can be done using the `fieldMappings` property of the indexer as follows:

```json
"fieldMappings" : [ { "sourceFieldName" : "_id", "targetFieldName" : "id" } ]
```

You can specify multiple field mappings:

```json
"fieldMappings" : [
    { "sourceFieldName" : "_id", "targetFieldName" : "id" },
    { "sourceFieldName" : "_timestamp", "targetFieldName" : "timestamp" }
]
```

Both source and target field names are case-insensitive.

To learn about scenarios where field mappings are useful, see [Search Indexer Field Mappings](https://docs.microsoft.com/azure/search/search-indexer-field-mappings).

#### outputFieldMappings parameter

In cognitive search scenarios in which a skillset is bound to an indexer, you must add `outputFieldMappings` to associate any output of an enrichment step that provides content to a searchable field in the index.

```json
  "outputFieldMappings" : [
        {
          "sourceFieldName" : "/document/organizations", 
          "targetFieldName" : "organizations"
        },
        {
          "sourceFieldName" : "/document/pages/*/keyPhrases/*", 
          "targetFieldName" : "keyphrases"
        },
        {
            "sourceFieldName": "/document/languageCode",
            "targetFieldName": "language",
            "mappingFunction": null
        }      
   ],
```

<a name="FieldMappingFunctions"></a>

#### Field mapping functions

Field mappings can also be used to transform source field values using *field mapping functions*. For example, an arbitrary string value can be base64-encoded so it can be used to populate a document key field.

To learn more about when and how to use field mapping functions, see [Field Mapping Functions](https://docs.microsoft.com/azure/search/search-indexer-field-mappings#field-mapping-functions).

### Request body examples  
 The following example creates an indexer that copies data from the table referenced by the `ordersds` data source to the `orders` index on a schedule that starts on Jan 1, 2015 UTC and runs hourly. Each indexer invocation will be successful if no more than 5 items fail to be indexed in each batch, and no more than 10 items fail to be indexed in total.  

```json
{
    "name" : "myindexer",  
    "description" : "a cool indexer",  
    "dataSourceName" : "ordersds",  
    "targetIndexName" : "orders",  
    "schedule" : { "interval" : "PT1H", "startTime" : "2015-01-01T00:00:00Z" },  
    "parameters" : { "maxFailedItems" : 10, "maxFailedItemsPerBatch" : 5 }  
}
```

## Response  
 201 Created for a successful request.  

## See also

+ [Cognitive search overview](cognitive-search-concept-intro.md)
+ [Quickstart: Try cognitive search](cognitive-search-quickstart-blob.md)
+ [How to map fields](cognitive-search-output-field-mapping.md)
