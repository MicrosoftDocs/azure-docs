---
title: Search over JSON blobs
titleSuffix: Azure AI Search
description: Extract searchable text from JSON blobs using the Blob indexer in Azure AI Search. Indexers provide indexing automation for supported data sources like Azure Blob Storage.

manager: nitinme
author: HeidiSteen
ms.author: heidist

ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 01/11/2024
---

# Index JSON blobs and files in Azure AI Search

**Applies to**: [Blob indexers](search-howto-indexing-azure-blob-storage.md), [File indexers](search-file-storage-integration.md)

For blob indexing in Azure AI Search, this article shows you how to set properties for blobs or files consisting of JSON documents. JSON files in Azure Blob Storage or Azure File Storage commonly assume any of these forms:

+ A single JSON document
+ A JSON document containing an array of well-formed JSON elements
+ A JSON document containing multiple entities, separated by a newline

The blob indexer provides a `parsingMode` parameter to optimize the output of the search document based on JSON structure. Parsing modes consist of the following options:

| parsingMode | JSON document | Description |
|--------------|-------------|--------------|
| **`json`** | One per blob | (default) Parses JSON blobs as a single chunk of text. Each JSON blob becomes a single search document. |
| **`jsonArray`** | Multiple per blob | Parses a JSON array in the blob, where each element of the array becomes a separate search document.  |
| **`jsonLines`** | Multiple per blob | Parses a blob that contains multiple JSON entities (also an array), with individual elements separated by a newline. The indexer starts a new search document after each new line. |

For both **`jsonArray`** and **`jsonLines`**, you should review [Indexing one blob to produce many search documents](search-howto-index-one-to-many-blobs.md) to understand how the blob indexer handles disambiguation of the document key for multiple search documents produced from the same blob.

Within the indexer definition, you can optionally set [field mappings](search-indexer-field-mappings.md) to choose which properties of the source JSON document are used to populate your target search index. For example, when using the **`jsonArray`** parsing mode, if the array exists as a lower-level property, you can set a "documentRoot" property indicating where the array is placed within the blob.

The following sections describe each mode in more detail. If you're unfamiliar with indexer clients and concepts, see [Create a search indexer](search-howto-create-indexers.md). You should also be familiar with the details of [basic blob indexer configuration](search-howto-indexing-azure-blob-storage.md), which isn't repeated here.

<a name="parsing-single-blobs"></a>

## Index single JSON documents (one per blob)

By default, blob indexers parse JSON blobs as a single chunk of text, one search document for each blob in a container. If the JSON is structured, the search document can reflect that structure, with individual elements represented as individual fields. For example, assume you have the following JSON document in Azure Blob Storage:

```http
{
    "article" : {
        "text" : "A hopefully useful article explaining how to parse JSON blobs",
        "datePublished" : "2020-04-13",
        "tags" : [ "search", "storage", "howto" ]    
    }
}
```

The blob indexer parses the JSON document into a single search document, loading an index by matching "text", "datePublished", and "tags" from the source against identically named and typed target index fields. Given an index with "text", "datePublished, and "tags" fields, the blob indexer can infer the correct mapping without a field mapping present in the request.

Although the default behavior is one search document per JSON blob, setting the **`json`** parsing mode changes the internal field mappings for content, promoting fields inside `content` to actual fields in the search index. An example indexer definition for the **`json`** parsing mode might look like this:

```http
POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
    "name" : "my-json-indexer",
    "dataSourceName" : "my-blob-datasource",
    "targetIndexName" : "my-target-index",
    "parameters" : { "configuration" : { "parsingMode" : "json" } }
}
```

> [!NOTE]
> As with all indexers, if fields do not clearly match, you should expect to explicitly specify individual [field mappings](search-indexer-field-mappings.md) unless you are using the implicit fields mappings available for blob content and metadata, as described in [basic blob indexer configuration](search-howto-indexing-azure-blob-storage.md).

### json example (single hotel JSON files)

The [hotel JSON document data set](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/hotels/hotel-json-documents) on GitHub is helpful for testing JSON parsing, where each blob represents a structured JSON file. You can upload the data files to Blob Storage and use the [**Import data** wizard](search-get-started-portal.md) to quickly evaluate how this content is parsed into individual search documents. 

The data set consists of five blobs, each containing a hotel document with an address collection and a rooms collection. The blob indexer detects both collections and reflects the structure of the input documents in the index schema.

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

The `parameters` property on the indexer contains parsing mode values. For a JSON array, the indexer definition should look similar to the following example.

```http
POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
    "name" : "my-json-indexer",
    "dataSourceName" : "my-blob-datasource",
    "targetIndexName" : "my-target-index",
    "parameters" : { "configuration" : { "parsingMode" : "jsonArray" } }
}
```

### jsonArrays example (clinical trials sample data)

The [clinical trials JSON data set](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/clinical-trials/clinical-trials-json) on GitHub is helpful for testing JSON array parsing. You can upload the data files to Blob storage and use the [**Import data** wizard](search-get-started-portal.md) to quickly evaluate how this content is parsed into individual search documents. 

The data set consists of eight blobs, each containing a JSON array of entities, for a total of 100 entities. The entities vary as to which fields are populated, but the end result is one search document per entity, from all arrays, in all blobs.

<a name="nested-json-arrays"></a>

### Parsing nested JSON arrays

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

## Parse JSON entities separated by newlines

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
    "parameters" : { "configuration" : { "parsingMode" : "jsonLines" } }
}
```

## Map JSON fields to search fields

Field mappings associate a source field with a destination field in situations where the field names and types aren't identical. But field mappings can also be used to match parts of a JSON document and "lift" them into top-level fields of the search document.

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
> If "sourceFieldName" refers to a property that doesn't exist in the JSON blob, that mapping is skipped without an error. This behavior allows indexing to continue for JSON blobs that have a different schema (which is a common use case). Because there is no validation check, check the mappings carefully for typos so that you aren't losing documents for the wrong reason.
>

## Next steps

+ [Configure blob indexers](search-howto-indexing-azure-blob-storage.md)
+ [Define field mappings](search-indexer-field-mappings.md)
+ [Indexers overview](search-indexer-overview.md)
+ [How to index CSV blobs with a blob indexer](search-howto-index-csv-blobs.md)
+ [Tutorial: Search semi-structured data from Azure Blob Storage](search-semi-structured-data.md)
