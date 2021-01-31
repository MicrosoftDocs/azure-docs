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

<!-- options for JSON documents
JSON
  example
JSON LINES
  example
JSON ARRAYs
  example-->

<!-- If you are unfamiliar with indexer clients and concepts, see [Create a search indexer](search-howto-create-indexers.md). For a step by step exercise using REST and Postman, see XXX -->

# How to index JSON blobs using a Blob indexer in Azure Cognitive Search

This article shows you how to configure a [blob indexer](search-howto-indexing-azure-blob-storage.md) to extract structured content from JSON documents in Azure Blob storage and make it searchable in Azure Cognitive Search.

<!-- 
heading or transition -->

JSON blobs in Azure Blob storage commonly assume any of these forms:

+ a single JSON document
+ a collection of JSON entities as an *array* of well-formed JSON elements
+ multiple individual JSON entities separated by a newline

When blob content consists of JSON, you can configure the blob indexer to include a **`parsingMode`** parameter on the request to optimize the output based on the structure of the JSON input.

Parsing modes consist of the following options

*JSON* articulates each blob as a single search document, showing up as an independent item in search results. 

*JSON array* is for blobs that contain well-formed JSON data - the well-formed JSON corresponds to an array of objects, or has a property which is an array of objects and you want each element to be articulated as a standalone, independent search document. If blobs are complex, and you don't choose *JSON array* the entire blob is ingested as a single document.

*JSON lines* is for blobs composed of multiple JSON entities separated by a new-line, where you want each entity to be articulated as a standalone independent search document. If blobs are complex, and you don't choose *JSON lines* parsing mode, then the entire blob is ingested as a single document. -->

| JSON document | parsingMode | Description | Availability |
|--------------|-------------|--------------|--------------|
| One per blob | `json` | Parses JSON blobs as a single chunk of text. Each JSON blob becomes a single Azure Cognitive Search document. | Generally available in both [REST](/rest/api/searchservice/indexer-operations) API and [.NET](/dotnet/api/azure.search.documents.indexes.models.searchindexer) SDK. |
| Multiple per blob | `jsonArray` | Parses a JSON array in the blob, where each element of the array becomes a separate Azure Cognitive Search document.  | Generally available in both [REST](/rest/api/searchservice/indexer-operations) API and [.NET](/dotnet/api/azure.search.documents.indexes.models.searchindexer) SDK. |
| Multiple per blob | `jsonLines` | Parses a blob which contains multiple JSON entities (an "array") separated by a newline, where each entity becomes a separate Azure Cognitive Search document. | Generally available in both [REST](/rest/api/searchservice/indexer-operations) API and [.NET](/dotnet/api/azure.search.documents.indexes.models.searchindexer) SDK. |

## Parsing modes

JSON blobs can assume multiple forms. The **`parsingMode`** parameter on the JSON indexer determines how JSON blob content is parsed and structured in an Azure Cognitive Search index:

| parsingMode | Description |
|-------------|-------------|
| `json`  | Index each blob as a single document. This is the default. |
| `jsonArray` | Choose this mode if your blobs consist of JSON arrays, and you need each element of the array to become a separate document in Azure Cognitive Search. |
|`jsonLines` | Choose this mode if your blobs consist of multiple JSON entities, that are separated by a new line, and you need each entity to become a separate document in Azure Cognitive Search. |

You can think of a document as a single item in search results. If you want each element in the array to show up in search results as an independent item, then use the `jsonArray` or `jsonLines` option as appropriate.

Within the indexer definition, you can optionally use [field mappings](search-indexer-field-mappings.md) to choose which properties of the source JSON document are used to populate your target search index. For `jsonArray` parsing mode, if the array exists as a lower-level property, you can set a document root indicating where the array is placed within the blob.

> [!IMPORTANT]
> When you use `json`, `jsonArray` or `jsonLines` parsing mode, Azure Cognitive Search assumes that all blobs in your data source contain JSON. If you need to support a mix of JSON and non-JSON blobs in the same data source, let us know on [our UserVoice site](https://feedback.azure.com/forums/263029-azure-search).

<a name="parsing-single-blobs"></a>

## Parse single JSON blobs

By default, [Azure Cognitive Search blob indexer](search-howto-indexing-azure-blob-storage.md) parses JSON blobs as a single chunk of text. Often, you want to preserve the structure of your JSON documents. For example, assume you have the following JSON document in Azure Blob storage:

```http
{
    "article" : {
        "text" : "A hopefully useful article explaining how to parse JSON blobs",
        "datePublished" : "2016-04-13",
        "tags" : [ "search", "storage", "howto" ]    
    }
}
```

The blob indexer parses the JSON document into a single Azure Cognitive Search document. The indexer loads an index by matching "text", "datePublished", and "tags" from the source against identically named and typed target index fields.

As noted, field mappings are not required. Given an index with "text", "datePublished, and "tags" fields, the blob indexer can infer the correct mapping without a field mapping present in the request.

<a name="parsing-arrays"></a>

## Parse JSON arrays

Alternatively, you can use the JSON array option. This option is useful when blobs contain an *array of well-formed JSON objects*, and you want each element to become a separate Azure Cognitive Search document. For example, given the following JSON blob, you can populate your Azure Cognitive Search index with three separate documents, each with "id" and "text" fields.  

```text
[
    { "id" : "1", "text" : "example 1" },
    { "id" : "2", "text" : "example 2" },
    { "id" : "3", "text" : "example 3" }
]
```

For a JSON array, the indexer definition should look similar to the following example. Notice that the parsingMode parameter specifies the `jsonArray` parser. Specifying the right parser and having the right data input are the only two array-specific requirements for indexing JSON blobs.

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

Again, notice that field mappings can be omitted. Assuming an index with identically named "id" and "text" fields, the blob indexer can infer the correct mapping without an explicit field mapping list.

<a name="nested-json-arrays"></a>

## Parse nested arrays

For JSON arrays having nested elements, you can specify a `documentRoot` to indicate a multi-level structure. For example, if your blobs look like this:

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

If your blob contains multiple JSON entities separated by a newline, and you want each element to become a separate Azure Cognitive Search document, you can opt for the JSON lines option. For example, given the following blob (where there are three different JSON entities), you can populate your Azure Cognitive Search index with three separate documents, each with "id" and "text" fields.

```text
{ "id" : "1", "text" : "example 1" }
{ "id" : "2", "text" : "example 2" }
{ "id" : "3", "text" : "example 3" }
```

For JSON lines, the indexer definition should look similar to the following example. Notice that the parsingMode parameter specifies the `jsonLines` parser. 

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

Again, notice that field mappings can be omitted, similar to the `jsonArray` parsing mode.

## Map JSON fields to search fields

Field mappings are used to associate a source field with a destination field in situations where the field names and types are not identical. But field mappings can also be used to match parts of a JSON document and "lift" them into top-level fields of the search document.

The following example illustrates this scenario. For more information about field mappings in general, see [Field mappings](search-indexer-field-mappings.md).

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

The source field names in the mappings are specified using the [JSON Pointer](https://tools.ietf.org/html/rfc6901) notation. You start with a forward slash to refer to the root of your JSON document, then pick the desired property (at arbitrary level of nesting) by using forward slash-separated path.

You can also refer to individual array elements by using a zero-based index. For example, to pick the first element of the "tags" array from the above example, use a field mapping like this:

```http
{ "sourceFieldName" : "/article/tags/0", "targetFieldName" : "firstTag" }
```

> [!NOTE]
> If a source field name in a field mapping path refers to a property that doesn't exist in JSON, that mapping is skipped without an error. This is done so that we can support documents with a different schema (which is a common use case). Because there is no validation, you need to take care to avoid typos in your field mapping specification.
>

## Next steps

+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [Indexing Azure Blob Storage with Azure Cognitive Search](search-howto-index-json-blobs.md)
+ [Indexing CSV blobs with Azure Cognitive Search blob indexer](search-howto-index-csv-blobs.md)
+ [Tutorial: Search semi-structured data from Azure Blob storage](search-semi-structured-data.md)