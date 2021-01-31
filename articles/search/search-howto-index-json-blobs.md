---
title: Search over JSON blobs
titleSuffix: Azure Cognitive Search
description: Crawl Azure JSON blobs for text content using the Azure Cognitive Search Blob indexer. Indexers automate data ingestion for selected data sources like Azure Blob storage.

manager: nitinme
author: HeidiSteen
ms.author: heidist

ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/01/2021
---
# How to index JSON blobs using a Blob indexer in Azure Cognitive Search

This article shows you how to configure a [blob indexer](search-howto-indexing-azure-blob-storage.md) for blobs that consist of JSON documents. JSON blobs in Azure Blob storage commonly assume any of these forms:

+ A single JSON document
+ A JSON document containing an *array* of well-formed JSON elements
+ A JSON document containing multiple individual JSON entities, separated by a newline

The blob indexer provides a **`parsingMode`** parameter on the request to optimize the output based on the structure of the JSON input. Output is a search document, which can be conceptualized as a single item in search results. Parsing modes consist of the following options:

| parsingMode | JSON document | Description | Availability |
|--------------|-------------|--------------|--------------|
| **`json`** | One per blob | (default) Parses JSON blobs as a single chunk of text. Each JSON blob becomes a single search document. | Generally available in both [REST](/rest/api/searchservice/indexer-operations) API and [.NET](/dotnet/api/azure.search.documents.indexes.models.searchindexer) SDK. |
| **`jsonArray`** | Multiple per blob | Parses a JSON array in the blob, where each element of the array becomes a separate search document.  | Generally available in both [REST](/rest/api/searchservice/indexer-operations) API and [.NET](/dotnet/api/azure.search.documents.indexes.models.searchindexer) SDK. |
| **`jsonLines`** | Multiple per blob | Parses a blob that contains multiple JSON entities (also an array), with individual elements separated by a newline. The indexer starts a new search document after each new line. | Generally available in both [REST](/rest/api/searchservice/indexer-operations) API and [.NET](/dotnet/api/azure.search.documents.indexes.models.searchindexer) SDK. |

For both **`jsonArray`** and **`jsonLines`**, review [Indexing one blob to produce many search documents](search-howto-index-one-to-many-blobs.md) to understand how the blob indexer handles disambiguation of the document key for multiple search documents produced from the same blob.

Within the indexer definition, you can optionally use [field mappings](search-indexer-field-mappings.md) to choose which properties of the source JSON document are used to populate your target search index. For `jsonArray` parsing mode, if the array exists as a lower-level property, you can set a document root indicating where the array is placed within the blob.

The following sections describe each mode in more detail. If you are unfamiliar with indexer clients and concepts, see [Create a search indexer](search-howto-create-indexers.md).

<a name="parsing-single-blobs"></a>

## Parse single JSON blobs

By default, [blob indexers](search-howto-indexing-azure-blob-storage.md) parse JSON blobs as a single chunk of text. Often, you want to preserve the structure of your JSON documents. For example, assume you have the following JSON document in Azure Blob storage:

```http
{
    "article" : {
        "text" : "A hopefully useful article explaining how to parse JSON blobs",
        "datePublished" : "2016-04-13",
        "tags" : [ "search", "storage", "howto" ]    
    }
}
```

The blob indexer parses the JSON document into a single search document, loading an index by matching "text", "datePublished", and "tags" from the source against identically named and typed target index fields. Given an index with "text", "datePublished, and "tags" fields, the blob indexer can infer the correct mapping without a field mapping present in the request. As with all indexers, if fields do not clearly match, you should explicitly specify the [field mappings](search-indexer-field-mappings.md).

<a name="parsing-arrays"></a>

## Parse JSON arrays

Alternatively, you can use the JSON array option. This option is useful when blobs contain an array of well-formed JSON objects, and you want each element to become a separate search document. Using **`jsonArrays`**, the following JSON blob produces three separate documents, each with `"id"` and `"text"` fields.  

```text
[
    { "id" : "1", "text" : "example 1" },
    { "id" : "2", "text" : "example 2" },
    { "id" : "3", "text" : "example 3" }
]
```

The **`parameters`** property on the indexer contains parsing mode values. For a JSON array, the indexer definition should look similar to the following example.

```http
POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
    "name" : "my-json-indexer",
    "dataSourceName" : "my-blob-datasource",
    "targetIndexName" : "my-target-index",
    "schedule" : { "interval" : "PT2H" },
    "parameters" : { "configuration" : { "parsingMode" : "jsonArray" } }
}
```

<a name="nested-json-arrays"></a>

## Parse nested arrays

For JSON arrays having nested elements, you can specify a **`documentRoot`** to indicate a multi-level structure. For example, if your blobs look like this:

```http
{
    "level1" : {
        "level2" : [
            { "id" : "1", "text" : "Use the documentRoot property" },
            { "id" : "2", "text" : "to pluck the array you want to index" },
            { "id" : "3", "text" : "even if it's nested inside the document" }  
        ]
    }
}
```

Use this configuration to index the array contained in the `level2` property:

```http
{
    "name" : "my-json-array-indexer",
    ... other indexer properties
    "parameters" : { "configuration" : { "parsingMode" : "jsonArray", "documentRoot" : "/level1/level2" } }
}
```

## Parse blobs separated by newlines

If your blob contains multiple JSON entities separated by a newline, and you want each element to become a separate search document, use **`jsonLines`**.

```text
{ "id" : "1", "text" : "example 1" }
{ "id" : "2", "text" : "example 2" }
{ "id" : "3", "text" : "example 3" }
```

For JSON lines, the indexer definition should look similar to the following example.

```http
POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
    "name" : "my-json-indexer",
    "dataSourceName" : "my-blob-datasource",
    "targetIndexName" : "my-target-index",
    "schedule" : { "interval" : "PT2H" },
    "parameters" : { "configuration" : { "parsingMode" : "jsonLines" } }
}
```

## Map JSON fields to search fields

Field mappings are used to associate a source field with a destination field in situations where the field names and types are not identical. But field mappings can also be used to match parts of a JSON document and "lift" them into top-level fields of the search document.

The following example illustrates this scenario. For more information about field mappings in general, see [field mappings](search-indexer-field-mappings.md).

```http
{
    "article" : {
        "text" : "A hopefully useful article explaining how to parse JSON blobs",
        "datePublished" : "2016-04-13"
        "tags" : [ "search", "storage", "howto" ]    
    }
}
```

Assume a search index with the following fields: `text` of type `Edm.String`, `date` of type `Edm.DateTimeOffset`, and `tags` of type `Collection(Edm.String)`. Notice the discrepancy between "datePublished" in the source and `date` field in the index. To map your JSON into the desired shape, use the following field mappings:

```http
"fieldMappings" : [
    { "sourceFieldName" : "/article/text", "targetFieldName" : "text" },
    { "sourceFieldName" : "/article/datePublished", "targetFieldName" : "date" },
    { "sourceFieldName" : "/article/tags", "targetFieldName" : "tags" }
    ]
```

Source fields are specified using the [JSON Pointer](https://tools.ietf.org/html/rfc6901) notation. You start with a forward slash to refer to the root of your JSON document, then pick the desired property (at arbitrary level of nesting) by using forward slash-separated path.

You can also refer to individual array elements by using a zero-based index. For example, to pick the first element of the "tags" array from the above example, use a field mapping like this:

```http
{ "sourceFieldName" : "/article/tags/0", "targetFieldName" : "firstTag" }
```

> [!NOTE]
> If **`sourceFieldName`** refers to a property that doesn't exist in the JSON blob, that mapping is skipped without an error. This behavior allows indexing to continue for JSON blobs that have a different schema (which is a common use case). Because there is no validation check, check the mappings carefully for typos so that you aren't losing documents for the wrong reason.
>

## Next steps

+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [Indexing Azure Blob Storage with Azure Cognitive Search](search-howto-index-json-blobs.md)
+ [Indexing CSV blobs with Azure Cognitive Search blob indexer](search-howto-index-csv-blobs.md)
+ [Tutorial: Search semi-structured data from Azure Blob storage](search-semi-structured-data.md)