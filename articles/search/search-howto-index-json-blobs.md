---
title: Indexing JSON blobs with Azure Search blob indexer
description: Indexing JSON blobs with Azure Search blob indexer
author: chaosrealm
manager: jlembicz
services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 04/20/2018
ms.author: eugenesh
---

# Indexing JSON blobs with Azure Search blob indexer
This article shows you how to configure an Azure Search blob indexer to extract structured content from JSON blobs in Azure Blob storage.

JSON blobs in Azure Blob storage are typically either a single JSON document or a JSON array. The blob indexer in Azure Search can parse either construction, depending on how you set the **parsingMode** parameter on the request.

| JSON document | parsingMode | Description | Availability |
|--------------|-------------|--------------|--------------|
| One per blob | `json` | Parses JSON blobs as a single chunk of text. Each JSON blob becomes a single Azure Search document. | Generally available in both [REST](https://docs.microsoft.com/rest/api/searchservice/indexer-operations) and [.NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexer) APIs. |
| Multiple per blob | `jsonArray` | Parses a JSON array in the blob, where each element of the array becomes a separate Azure Search document.  | In preview, in [REST api-version=`2017-11-11-Preview`](search-api-2017-11-11-preview.md) and [.NET SDK Preview](https://aka.ms/search-sdk-preview). |

> [!Note]
> Preview APIs are intended for testing and evaluation, and should not be used in production environments.
>

## Setting up JSON indexing
Indexing JSON blobs is similar to the regular document extraction in a three-part workflow common to all indexers in Azure Search.

### Step 1: Create a data source

The first step is to provide data source connection information used by the indexer. 
The data source type, specified here as `azureblob`, determines which data extraction behaviors are invoked by the indexer. For JSON blob indexing, data source definition is the same for both JSON documents and arrays. 

    POST https://[service name].search.windows.net/datasources?api-version=2017-11-11
    Content-Type: application/json
    api-key: [admin key]

    {
        "name" : "my-blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
        "container" : { "name" : "my-container", "query" : "optional, my-folder" }
    }   

### Step 2: Create a target search index 

Indexers are paired with an index schema. If you are using the API (rather than the portal), prepare an index in advance so that you can specify it on the indexer operation. 

> [!Note]
> Indexers are exposed in the portal through the **Import** action for a limited number of generally available indexers. Often, the import workflow can often construct a preliminary index based on metadata in the source. For more information, see [Import data into Azure Search in the portal](search-import-data-portal.md).

### Step 3: Configure and run the indexer

Until now, definitions for the data source and index have been parsingMode agnostic. However, in step 3 for Indexer configuration, the path diverges depending on how you want the JSON blob content to be parsed and structured in an Azure Search index.

When calling the indexer, do the following:

+ Set the **parsingMode** parameter to `json` (to index each blob as a single document) or `jsonArray` (if your blobs contain JSON arrays and you need each element of an array to be treated as a separate document).

+ Optionally, use **field mappings** to choose which properties of the source JSON document are used to populate your target search index. For JSON arrays, if the array exists as a lower level property, you can set a document root indicating where the array is placed within the blob.

> [!IMPORTANT]
> When you use `json` or `jsonArray` parsing mode, Azure Search assumes that all blobs in your data source contain JSON. If you need to support a mix of JSON and non-JSON blobs in the same data source, let us know on [our UserVoice site](https://feedback.azure.com/forums/263029-azure-search).


## How to parse single JSON blobs

By default, [Azure Search blob indexer](search-howto-indexing-azure-blob-storage.md) parses JSON blobs as a single chunk of text. Often, you want to preserve the structure of your JSON documents. For example, assume you have the following JSON document in Azure Blob storage:

    {
        "article" : {
            "text" : "A hopefully useful article explaining how to parse JSON blobs",
            "datePublished" : "2016-04-13",
            "tags" : [ "search", "storage", "howto" ]    
        }
    }

### Indexer definition for single JSON blobs

Using the Azure Search blob indexer, a JSON document similar to the previous example is parsed into a single Azure Search document. The indexer loads an index by matching "text", "datePublished", and "tags" from the source against identically named and typed target fields.

Configuration is provided in the body of an indexer operation. Recall that the data source object, previously defined, specifies the data source type and connection information. Additionally, the target index must also exist as an empty container in your service. Schedule and parameters are optional, but if you omit them, the indexer runs immediately, using `json` as the parsing mode.

A fully specified request might look as follows:

    POST https://[service name].search.windows.net/indexers?api-version=2017-11-11
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "my-json-indexer",
      "dataSourceName" : "my-blob-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" },
      "parameters" : { "configuration" : { "parsingMode" : "json" } }
    }

As noted, field mappings are not required. Given an index with "text", "datePublished, and "tags" fields, the blob indexer can infer the correct mapping without a field mapping present in the request.

## How to parse JSON arrays (preview)

Alternatively, you can opt for the JSON array preview feature. This capability is useful when blobs contain an *array of JSON objects*, and you want each element to become a separate Azure Search document. For example, given the following JSON blob, you can populate your Azure Search index with three separate documents, each with "id" and "text" fields.  

    [
        { "id" : "1", "text" : "example 1" },
        { "id" : "2", "text" : "example 2" },
        { "id" : "3", "text" : "example 3" }
    ]

### Indexer definition for a JSON array

For a JSON array, the indexer request uses the preview API and the `jsonArray` parser. These are the only two array-specific requirements for indexing JSON blobs.

    POST https://[service name].search.windows.net/indexers?api-version=2017-11-11-Preview
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "my-json-indexer",
      "dataSourceName" : "my-blob-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" },
      "parameters" : { "configuration" : { "parsingMode" : "jsonArray" } }
    }

Again, notice that field mappings are not required. Given an index with "id" and "text" fields, the blob indexer can infer the correct mapping without a field mapping list.

<a name="nested-json-arrays"></a>

### Nested JSON arrays
What if you wish to index an array of JSON objects, but that array is nested somewhere within the document? You can pick which property contains the array using the `documentRoot` configuration property. For example, if your blobs look like this:

    {
        "level1" : {
            "level2" : [
                { "id" : "1", "text" : "Use the documentRoot property" },
                { "id" : "2", "text" : "to pluck the array you want to index" },
                { "id" : "3", "text" : "even if it's nested inside the document" }  
            ]
        }
    }

Use this configuration to index the array contained in the `level2` property:

    {
        "name" : "my-json-array-indexer",
        ... other indexer properties
        "parameters" : { "configuration" : { "parsingMode" : "jsonArray", "documentRoot" : "/level1/level2" } }
    }

## Using field mappings to build search documents

When source and target fields are not perfectly aligned, you can define a field mapping section in the request body for explicit field-to-field associations.

Currently, Azure Search cannot index arbitrary JSON documents directly, because it supports only primitive data types, string arrays, and GeoJSON points. However, you can use **field mappings** to pick parts of your JSON document and "lift" them into top-level fields of the search document. To learn about field mappings basics, see [Field mappings in Azure Search indexers](search-indexer-field-mappings.md).

Revisiting our example JSON document:

    {
        "article" : {
            "text" : "A hopefully useful article explaining how to parse JSON blobs",
            "datePublished" : "2016-04-13"
            "tags" : [ "search", "storage", "howto" ]    
        }
    }

Assume a search index with the following fields: `text` of type `Edm.String`, `date` of type `Edm.DateTimeOffset`, and `tags` of type `Collection(Edm.String)`. Notice the discrepancy between "datePublished" in the source and `date` field in the index. To map your JSON into the desired shape, use the following field mappings:

    "fieldMappings" : [
        { "sourceFieldName" : "/article/text", "targetFieldName" : "text" },
        { "sourceFieldName" : "/article/datePublished", "targetFieldName" : "date" },
        { "sourceFieldName" : "/article/tags", "targetFieldName" : "tags" }
      ]

The source field names in the mappings are specified using the [JSON Pointer](http://tools.ietf.org/html/rfc6901) notation. You start with a forward slash to refer to the root of your JSON document, then pick the desired property (at arbitrary level of nesting) by using forward slash-separated path.

You can also refer to individual array elements by using a zero-based index. For example, to pick the first element of the "tags" array from the above example, use a field mapping like this:

    { "sourceFieldName" : "/article/tags/0", "targetFieldName" : "firstTag" }

> [!NOTE]
> If a source field name in a field mapping path refers to a property that doesn't exist in JSON, that mapping is skipped without an error. This is done so that we can support documents with a different schema (which is a common use case). Because there is no validation, you need to take care to avoid typos in your field mapping specification.
>
>

## Example: Indexer request with field mappings

The following example is a fully specified indexer payload, including field mappings:

    POST https://[service name].search.windows.net/indexers?api-version=2017-11-11
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "my-json-indexer",
      "dataSourceName" : "my-blob-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" },
      "parameters" : { "configuration" : { "parsingMode" : "json" } },
      "fieldMappings" : [
        { "sourceFieldName" : "/article/text", "targetFieldName" : "text" },
        { "sourceFieldName" : "/article/datePublished", "targetFieldName" : "date" },
        { "sourceFieldName" : "/article/tags", "targetFieldName" : "tags" }
        ]
    }


## Help us make Azure Search better
If you have feature requests or ideas for improvements, reach out to us on our [UserVoice site](https://feedback.azure.com/forums/263029-azure-search/).

## See also

+ [Indexers in Azure Search](search-indexer-overview.md)
+ [Indexing Azure Blob Storage with Azure Search](search-howto-index-json-blobs.md)
+ [Indexing CSV blobs with Azure Search blob indexer](search-howto-index-csv-blobs.md)
+ [Tutorial: Search semi-structured data from Azure Blob storage ](search-semi-structured-data.md)
