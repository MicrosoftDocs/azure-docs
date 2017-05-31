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
ms.date: 04/10/2017
ms.author: eugenesh
---

# Indexing JSON blobs with Azure Search blob indexer
This article shows how to configure Azure Search blob indexer to extract structured content from blobs that contain JSON.

## Scenarios
By default, [Azure Search blob indexer](search-howto-indexing-azure-blob-storage.md) parses JSON blobs as a single chunk of text. Often, you want to preserve the structure of your JSON documents. For example, given the JSON document

    {
        "article" : {
             "text" : "A hopefully useful article explaining how to parse JSON blobs",
            "datePublished" : "2016-04-13"
            "tags" : [ "search", "storage", "howto" ]    
        }
    }

you might want to parse it into an Azure Search document with "text", "datePublished", and "tags" fields.

Alternatively, when your blobs contain an **array of JSON objects**, you may want each element of the array to become a separate Azure Search document. For example, given a blob with this JSON:  

    [
        { "id" : "1", "text" : "example 1" },
        { "id" : "2", "text" : "example 2" },
        { "id" : "3", "text" : "example 3" }
    ]

you can populate your Azure Search index with three separate documents, each with "id" and "text" fields.

> [!IMPORTANT]
> The JSON array parsing functionality is currently in preview. It is available only in the REST API using version **2015-02-28-Preview**. Remember, preview APIs are intended for testing and evaluation, and should not be used in production environments.
>
>

## Setting up JSON indexing
Indexing JSON blobs is similar to the regular document extraction. First, create the datasource exactly as you would normally: 

    POST https://[service name].search.windows.net/datasources?api-version=2016-09-01
    Content-Type: application/json
    api-key: [admin key]

    {
        "name" : "my-blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
        "container" : { "name" : "my-container", "query" : "optional, my-folder" }
    }   

Then create the target search index if you don't already have one. 

Finally create an indexer and set the `parsingMode` parameter to `json` (to index each blob as a single document) or `jsonArray` (if your blobs contain JSON arrays, and you need each element of an array to be treated as a separate document):

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

If needed, use **field mappings** to pick the properties of the source JSON document used to populate your target search index, as shown in the next section.

> [!IMPORTANT]
> When you use `json` or `jsonArray` parsing mode, Azure Search assumes that all blobs in your data source contain JSON. If you need to support a mix of JSON and non-JSON blobs in the same data source, let us know on [our UserVoice site](https://feedback.azure.com/forums/263029-azure-search).
>
>

## Using field mappings to build search documents
Currently, Azure Search cannot index arbitrary JSON documents directly, because it supports only primitive data types, string arrays, and GeoJSON points. However, you can use **field mappings** to pick parts of your JSON document and "lift" them into top-level fields of the search document. To learn about field mappings basics, see [Azure Search indexer field mappings bridge the differences between data sources and search indexes](search-indexer-field-mappings.md).

Coming back to our example JSON document:

    {
        "article" : {
             "text" : "A hopefully useful article explaining how to parse JSON blobs",
            "datePublished" : "2016-04-13"
            "tags" : [ "search", "storage", "howto" ]    
        }
    }

Let's say you have a search index with the following fields: `text` of type `Edm.String`, `date` of type `Edm.DateTimeOffset`, and `tags` of type `Collection(Edm.String)`. To map your JSON into the desired shape, use the following field mappings:

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

use this configuration to index the array contained in the `level2` property:

    {
        "name" : "my-json-array-indexer",
        ... other indexer properties
        "parameters" : { "configuration" : { "parsingMode" : "jsonArray", "documentRoot" : "/level1/level2" } }
    }

## Help us make Azure Search better
If you have feature requests or ideas for improvements, reach out to us on our [UserVoice site](https://feedback.azure.com/forums/263029-azure-search/).
