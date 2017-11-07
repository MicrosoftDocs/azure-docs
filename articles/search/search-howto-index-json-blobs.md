---
title: Indexing JSON blobs with Azure Search blob indexer
description: Indexing JSON blobs with Azure Search blob indexer
services: search
documentationcenter: ''
author: chaosrealm
manager: pablocas
editor: ''

ms.assetid: 57e32e51-9286-46da-9d59-31884650ba99
ms.service: search
ms.devlang: rest-api
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 09/07/2017
ms.author: eugenesh
---

# Indexing JSON blobs with Azure Search blob indexer
This article shows you how to configure Azure Search blob indexer to extract structured content from blobs in Azure Blob storage that contain JSON.

Blobs in Azure blob storage are typically either a single JSON document or a JSON array. The blob indexer in Azure Search can parse either construction, using a **parsingMode** parameter to set the mode:

| JSON document | parsingMode | Description | Availability |
|--------------|-------------|--------------|--------------|
| One per blob | `json` | Parses JSON blobs as a single chunk of text. Each JSON blob becomes a single Azure Search document. | Generally available in both REST and .NET APIs. |
| Multiple per blob | `jsonArray` | Parses a JSON array in the blob, where each element of the array becomes a separate Azure Search document.  | In preview, available through the REST API only, in this api-version: `2016-09-01-Preview` |

> [!Note]
> Preview APIs are intended for testing and evaluation, and should not be used in production environments.
>

## Setting up JSON indexing
Indexing JSON blobs is similar to the regular document extraction in a three-part workflow.

### Step 1: Create a data source

The data source type, specified as `azureblob`, determines which data extraction behaviors are invoked by the indexer. This step is the same for both JSON documents and arrays. 

    POST https://[service name].search.windows.net/datasources?api-version=2016-09-01
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

### Step 3: Configure and run the indexer

Up to this step, definitions for the data source and index are mode agnostic. Indexer configuration is where you specify how you want the blobs to be articulated in your Azure Search index.

When calling the indexer, do the following:

+ Set the **parsingMode** parameter to `json` (to index each blob as a single document) or `jsonArray` (if your blobs contain JSON arrays and you need each element of an array to be treated as a separate document).

+ Optionally, use **field mappings** to pick the properties of the source JSON document used to populate your target search index. For JSON arrays, you can specify a nested path on the source field to more precisely map contents in the array to a corresponding field in your index.

> [!IMPORTANT]
> When you use `json` or `jsonArray` parsing mode, Azure Search assumes that all blobs in your data source contain JSON. If you need to support a mix of JSON and non-JSON blobs in the same data source, let us know on [our UserVoice site](https://feedback.azure.com/forums/263029-azure-search).


## How to parse single JSON blobs

By default, [Azure Search blob indexer](search-howto-indexing-azure-blob-storage.md) parses JSON blobs as a single chunk of text. Often, you want to preserve the structure of your JSON documents. 

For example, assume you have the following JSON document in Azure blob storage:

    {
        "article" : {
            "text" : "A hopefully useful article explaining how to parse JSON blobs",
            "datePublished" : "2016-04-13"
            "tags" : [ "search", "storage", "howto" ]    
        }
    }

Using the Azure Search blob indexer, you can parse this document and load it into an Azure Search index, matching "text", "datePublished", and "tags" from the source against similarly named target fields in your search index.

### Indexer definition for single JSON blobs

Recall that the data source object, previously defined, specifies the data source type and connection information. The target index exists as an empty container in your service. The schedule, if you choose to include it, sets an interval for rerunning the indexer. A parameter determines which JSON parser is used.

    POST https://[service name].search.windows.net/indexers?api-version=2016-09-01
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "my-json-indexer",
      "dataSourceName" : "my-blob-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" },
      "parameters" : { "configuration" : { "parsingMode" : "json" } }
    }

Notice that field mappings are not required. Given an index with "text", "datePublished, and "tags" fields, the blob indexer can infer the correct mapping without a field mapping list.

## How to parse JSON arrays (preview)

Alternatively, you can opt for the JSON array preview feature. This capability is useful when blobs contain an **array of JSON objects**, you may want each element of the array to become a separate Azure Search document. 

For example, given the following JSON blob, you can populate your Azure Search index with three separate documents, each with "id" and "text" fields.  

    [
        { "id" : "1", "text" : "example 1" },
        { "id" : "2", "text" : "example 2" },
        { "id" : "3", "text" : "example 3" }
    ]

### Indexer definition for a JSON array

The indexer definition uses the preview API and the `jsonArray` parser.

    POST https://[service name].search.windows.net/indexers?api-version=2016-09-01-Preview
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "my-json-indexer",
      "dataSourceName" : "my-blob-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" },
      "parameters" : { "configuration" : { "parsingMode" : "jsonArray" } }
    }

Notice that field mappings are not required. Given an index with "id" and "text" fields, the blob indexer can infer the correct mapping without a field mapping list.

## Indexing nested JSON arrays
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

Currently, Azure Search cannot index arbitrary JSON documents directly, because it supports only primitive data types, string arrays, and GeoJSON points. However, you can use **field mappings** to pick parts of your JSON document and "lift" them into top-level fields of the search document. To learn about field mappings basics, see [Field mappings in Azure Search indexers](search-indexer-field-mappings.md).

Revisiting our example JSON document:

    {
        "article" : {
            "text" : "A hopefully useful article explaining how to parse JSON blobs",
            "datePublished" : "2016-04-13"
            "tags" : [ "search", "storage", "howto" ]    
        }
    }

Let's say you have a search index with the following fields: `text` of type `Edm.String`, `date` of type `Edm.DateTimeOffset`, and `tags` of type `Collection(Edm.String)`. Notice the discrepancy between "datePublished" in the source and `date` field in the index. To map your JSON into the desired shape, use the following field mappings:

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

If your JSON documents only contain simple top-level properties, you may not need field mappings at all. For example, if your JSON looks like this, the top-level properties "text", "datePublished" and "tags" directly maps to the corresponding fields in the search index:

    {
       "text" : "A hopefully useful article explaining how to parse JSON blobs",
       "datePublished" : "2016-04-13"
       "tags" : [ "search", "storage", "howto" ]    
     }

Here's a complete indexer payload with field mappings:

    POST https://[service name].search.windows.net/indexers?api-version=2016-09-01
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
+ [Tutorial: Search semi-structured data from Azure blob storage ](search-semi-structured-data.md)