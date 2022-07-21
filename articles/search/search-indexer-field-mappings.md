---
title: Field mappings in indexers
titleSuffix: Azure Cognitive Search
description: Configure field mappings in an indexer to account for differences in field names and data representations.

manager: nitinme
author: HeidiSteen
ms.author: heidist

ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/17/2022
---

# Field mappings and transformations using Azure Cognitive Search indexers

![Indexer Stages](./media/search-indexer-field-mappings/indexer-stages-field-mappings.png "indexer stages")

When using an Azure Cognitive Search indexer to push content into a search index, the indexer automatically assigns the source-to-destination field mappings. Implicit field mappings occur when field names and data types are compatible. If inputs and outputs don't match, you can define explicit *field mappings* to set up the data path, as described in this article.

Field mappings also provide light-weight data conversion through mapping functions. If more processing is required, consider [Azure Data Factory](../data-factory/index.yml) to bridge the gap.

## Scenarios and limitations

Field mappings enable the following scenarios:

+ Rename fields or handle name discrepancies. Suppose your data source has a field named `_city`. Given that Azure Cognitive Search doesn't allow field names that start with an underscore, a field mapping lets you effectively rename a field.

+ Data type discrepancies. Cognitive Search has a smaller set of [supported data types](/rest/api/searchservice/supported-data-types) than many data sources. If you're importing SQL data, a field mapping allows you to [map the SQL data type](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md#mapping-data-types) you want in a search index.

+ One-to-many data paths. You can populate multiple fields in the index with content from the same field. For example, you might want to apply different analyzers to each field.

+ Multiple data sources with different field names where you want to populate a search field with documents from more than one data source. If the field names vary between the data sources, you can use a field mapping to clarify the path.

+ Base64 encoding or decoding of data. Field mappings support several [**mapping functions**](#mappingFunctions), including functions for Base64 encoding and decoding.

+ Splitting strings or recasting a JSON array into a string collection. [Field mapping functions](#mappingFunctions) provide this capability.

### Limitations

Before you start mapping fields, make sure the following limitations won't block you:

+ The "targetFieldName" must be set to a single field name, either a simple field or a collection. You can't define a field path to a subfield in a complex field (such as `address/city`) at this time. A workaround is to add a skillset and use a [Shaper skill](cognitive-search-skill-shaper.md).

+ Field mappings only work for search indexes. For indexers that also create [knowledge stores](knowledge-store-concept-intro.md), [data shapes](knowledge-store-projection-shape.md) and [projections](knowledge-store-projections-examples.md) determine field associations, and any field mappings and output field mappings in the indexer are ignored.

## Set up field mappings

Field mappings are added to the "fieldMappings" array of the indexer definition. A field mapping consists of three parts.

| Property | Description |
|----------|-------------|
| "sourceFieldName" | Required. Represents a field in your data source. |
|  "targetFieldName" | Optional. Represents a field in your search index. If omitted, the value of "sourceFieldName" is assumed for the target. |
| "mappingFunction" | Optional. Consists of [predefined functions](#mappingFunctions) that transform data. You can apply functions to both source and target field mappings. |

Azure Cognitive Search uses case-insensitive comparison to resolve the field and function names in field mappings. This is convenient (you don't have to get all the casing right), but it means that your data source or index can't have fields that differ only by case.  

> [!NOTE]
> If no field mappings are present, indexers assume data source fields should be mapped to index fields with the same name. Adding a field mapping overrides these default field mappings for the source and target field. Some indexers, such as the [blob storage indexer](search-howto-indexing-azure-blob-storage.md), add default field mappings for the index key field.

You can use the portal, REST API, or an Azure SDK to define field mappings.

### [**Azure portal**](#tab/portal)

If you're using the [Import data wizard](search-import-data-portal.md), field mappings aren't supported because the wizard creates target search fields that mirror the origin source fields.

In the portal, you can set field mappings in an indexer after the indexer already exists:

1. Open the JSON definition of an existing indexer.

1. Under the "fieldMappings" section, add the source and destination fields. Destination fields must exist in the search index and conform to [field naming conventions](/rest/api/searchservice/naming-rules). Refer to the REST API tab for more JSON syntax details.

1. Save your changes.

1. If the search field is empty, run the indexer to import data from the source field to the newly mapped search field. If the search field was previously populated, reset the indexer before running it to drop and add the content.

### [**REST APIs**](#tab/rest)

Add field mappings when creating a new indexer using the [Create Indexer](/rest/api/searchservice/create-Indexer) API request. Manage the field mappings of an existing indexer using the [Update Indexer](/rest/api/searchservice/update-indexer) API request.

This example maps a source field to a target field with a different name:

```JSON
PUT https://[service name].search.windows.net/indexers/myindexer?api-version=[api-version]
Content-Type: application/json
api-key: [admin key]
{
    "dataSourceName" : "mydatasource",
    "targetIndexName" : "myindex",
    "fieldMappings" : [ { "sourceFieldName" : "_city", "targetFieldName" : "city" } ]
}
```

A source field can be referenced in multiple field mappings. The following example shows how to "fork" a field, copying the same source field to two different index fields:

```JSON

"fieldMappings" : [
    { "sourceFieldName" : "text", "targetFieldName" : "textStandardEnglishAnalyzer" },
    { "sourceFieldName" : "text", "targetFieldName" : "textSoundexAnalyzer" }
]
```

### [**.NET SDK (C#)**](#tab/csharp)

In the Azure SDK for .NET, use the [FieldMapping](/dotnet/api/azure.search.documents.indexes.models.fieldmapping) class that provides "SourceFieldName" and "TargetFieldName" properties and an optional "MappingFunction" reference.

Specify field mappings when constructing the indexer, or later by directly setting [SearchIndexer.FieldMappings](/dotnet/api/azure.search.documents.indexes.models.searchindexer.fieldmappings). The following C# example sets the field mappings when constructing an indexer.

```csharp
var indexer = new SearchIndexer("hotels-sql-idxr", dataSource.Name, searchIndex.Name)
{
    Description = "SQL data indexer",
    Schedule = schedule,
    Parameters = parameters,
    FieldMappings =
    {
        new FieldMapping("_hotelId") {TargetFieldName = "HotelId", FieldMappingFunction.Base64Encode()},
        new FieldMapping("Amenities") {TargetFieldName = "Tags"}
    }
};

await indexerClient.CreateOrUpdateIndexerAsync(indexer);
```

---
<a name="mappingFunctions"></a>

## Field mapping functions and examples

A field mapping function transforms the contents of a field before it's stored in the index. The following mapping functions are currently supported:

+ [base64Encode](#base64EncodeFunction)
+ [base64Decode](#base64DecodeFunction)
+ [extractTokenAtPosition](#extractTokenAtPositionFunction)
+ [jsonArrayToStringCollection](#jsonArrayToStringCollectionFunction)
+ [urlEncode](#urlEncodeFunction)
+ [urlDecode](#urlDecodeFunction)

<a name="base64EncodeFunction"></a>

### base64Encode function

Performs *URL-safe* Base64 encoding of the input string. Assumes that the input is UTF-8 encoded.

#### Example: Base-encoding a document key

Only URL-safe characters can appear in an Azure Cognitive Search document key (so that you can address the document using the [Lookup API](/rest/api/searchservice/lookup-document)). If the source field for your key contains URL-unsafe characters, such as `-` and `\`, use the `base64Encode` function to convert it at indexing time. 

The following example specifies the base64Encode function on "metadata_storage_name" to handle unsupported characters.

```http
PUT /indexers?api-version=2020-06-30
{
  "dataSourceName" : "my-blob-datasource ",
  "targetIndexName" : "my-search-index",
  "fieldMappings" : [
    { 
        "sourceFieldName" : "metadata_storage_name", 
        "targetFieldName" : "key", 
        "mappingFunction" : { 
            "name" : "base64Encode",
            "parameters" : { "useHttpServerUtilityUrlTokenEncode" : false }
        } 
    }
  ]
}
```

A document key (both before and after conversion) can't be longer than 1,024 characters. When you retrieve the encoded key at search time, use the `base64Decode` function to get the original key value, and use that to retrieve the source document.

#### Example: Make a base-encoded field "searchable"

There are times when you need to use an encoded version of a field like "metadata_storage_path" as the key, but also need an un-encoded version for full text search. To support both scenarios, you can map "metadata_storage_path" to two fields: one for the key (encoded), and a second for a path field that we can assume is attributed as "searchable" in the index schema.

```http
PUT /indexers/blob-indexer?api-version=2020-06-30
{
    "dataSourceName" : " blob-datasource ",
    "targetIndexName" : "my-target-index",
    "schedule" : { "interval" : "PT2H" },
    "fieldMappings" : [
        { "sourceFieldName" : "metadata_storage_path", "targetFieldName" : "key", "mappingFunction" : { "name" : "base64Encode" } },
        { "sourceFieldName" : "metadata_storage_path", "targetFieldName" : "path" }
      ]
}
```

#### Example - preserve original values

The [blob storage indexer](search-howto-indexing-azure-blob-storage.md) automatically adds a field mapping from `metadata_storage_path`, the URI of the blob, to the index key field if no field mapping is specified. This value is Base64 encoded so it's safe to use as an Azure Cognitive Search document key. The following example shows how to simultaneously map a *URL-safe* Base64 encoded version of `metadata_storage_path` to a `index_key` field and preserve the original value in a `metadata_storage_path` field:

```JSON
"fieldMappings": [
  {
    "sourceFieldName": "metadata_storage_path",
    "targetFieldName": "metadata_storage_path"
  },
  {
    "sourceFieldName": "metadata_storage_path",
    "targetFieldName": "index_key",
    "mappingFunction": {
       "name": "base64Encode"
    }
  }
]
```

If you don't include a parameters property for your mapping function, it defaults to the value `{"useHttpServerUtilityUrlTokenEncode" : true}`.

Azure Cognitive Search supports two different Base64 encodings. You should use the same parameters when encoding and decoding the same field. For more information, see [base64 encoding options](#base64details) to decide which parameters to use.

<a name="base64DecodeFunction"></a>

### base64Decode function

Performs Base64 decoding of the input string. The input is assumed to be a *URL-safe* Base64-encoded string.

#### Example - decode blob metadata or URLs

Your source data might contain Base64-encoded strings, such as blob metadata strings or web URLs, that you want to make searchable as plain text. You can use the `base64Decode` function to turn the encoded data back into regular strings when populating your search index.

```JSON
"fieldMappings" : [
  {
    "sourceFieldName" : "Base64EncodedMetadata",
    "targetFieldName" : "SearchableMetadata",
    "mappingFunction" : { 
      "name" : "base64Decode", 
      "parameters" : { "useHttpServerUtilityUrlTokenDecode" : false }
    }
  }]
```

If you don't include a parameters property, it defaults to the value `{"useHttpServerUtilityUrlTokenEncode" : true}`.

Azure Cognitive Search supports two different Base64 encodings. You should use the same parameters when encoding and decoding the same field. For more details, see [base64 encoding options](#base64details) to decide which parameters to use.

<a name="base64details"></a>

#### base64 encoding options

Azure Cognitive Search supports URL-safe base64 encoding and normal base64 encoding. A string that is base64 encoded during indexing should be decoded later with the same encoding options, or else the result won't match the original.

If the `useHttpServerUtilityUrlTokenEncode` or `useHttpServerUtilityUrlTokenDecode` parameters for encoding and decoding respectively are set to `true`, then `base64Encode` behaves like [HttpServerUtility.UrlTokenEncode](/dotnet/api/system.web.httpserverutility.urltokenencode) and `base64Decode` behaves like [HttpServerUtility.UrlTokenDecode](/dotnet/api/system.web.httpserverutility.urltokendecode).

> [!WARNING]
> If `base64Encode` is used to produce key values, `useHttpServerUtilityUrlTokenEncode` must be set to true. Only URL-safe base64 encoding can be used for key values. See [Naming rules](/rest/api/searchservice/naming-rules) for the full set of restrictions on characters in key values.

The .NET libraries in Azure Cognitive Search assume the full .NET Framework, which provides built-in encoding. The `useHttpServerUtilityUrlTokenEncode` and `useHttpServerUtilityUrlTokenDecode` options leverage this built-in functionality. If you're using .NET Core or another framework, we recommend setting those options to `false` and calling your framework's encoding and decoding functions directly.

The following table compares different base64 encodings of the string `00>00?00`. To determine the required processing (if any) for your base64 functions, apply your library encode function on the string `00>00?00` and compare the output with the expected output `MDA-MDA_MDA`.

| Encoding | Base64 encode output | Additional processing after library encoding | Additional processing before library decoding |
| --- | --- | --- | --- |
| Base64 with padding | `MDA+MDA/MDA=` | Use URL-safe characters and remove padding | Use standard base64 characters and add padding |
| Base64 without padding | `MDA+MDA/MDA` | Use URL-safe characters | Use standard base64 characters |
| URL-safe base64 with padding | `MDA-MDA_MDA=` | Remove padding | Add padding |
| URL-safe base64 without padding | `MDA-MDA_MDA` | None | None |

<a name="extractTokenAtPositionFunction"></a>

### extractTokenAtPosition function

Splits a string field using the specified delimiter, and picks the token at the specified position in the resulting split.

This function uses the following parameters:

+ `delimiter`: a string to use as the separator when splitting the input string.
+ `position`: an integer zero-based position of the token to pick after the input string is split.

For example, if the input is `Jane Doe`, the `delimiter` is `" "`(space) and the `position` is 0, the result is `Jane`; if the `position` is 1, the result is `Doe`. If the position refers to a token that doesn't exist, an error is returned.

#### Example - extract a name

Your data source contains a `PersonName` field, and you want to index it as two separate `FirstName` and `LastName` fields. You can use this function to split the input using the space character as the delimiter.

```JSON
"fieldMappings" : [
  {
    "sourceFieldName" : "PersonName",
    "targetFieldName" : "FirstName",
    "mappingFunction" : { "name" : "extractTokenAtPosition", "parameters" : { "delimiter" : " ", "position" : 0 } }
  },
  {
    "sourceFieldName" : "PersonName",
    "targetFieldName" : "LastName",
    "mappingFunction" : { "name" : "extractTokenAtPosition", "parameters" : { "delimiter" : " ", "position" : 1 } }
  }]
```

<a name="jsonArrayToStringCollectionFunction"></a>

### jsonArrayToStringCollection function

Transforms a string formatted as a JSON array of strings into a string array that can be used to populate a `Collection(Edm.String)` field in the index.

For example, if the input string is `["red", "white", "blue"]`, then the target field of type `Collection(Edm.String)` will be populated with the three values `red`, `white`, and `blue`. For input values that can't be parsed as JSON string arrays, an error is returned.

#### Example - populate collection from relational data

Azure SQL Database doesn't have a built-in data type that naturally maps to `Collection(Edm.String)` fields in Azure Cognitive Search. To populate string collection fields, you can pre-process your source data as a JSON string array and then use the `jsonArrayToStringCollection` mapping function.

```JSON
"fieldMappings" : [
  {
    "sourceFieldName" : "tags", 
    "mappingFunction" : { "name" : "jsonArrayToStringCollection" }
  }]
```

<a name="urlEncodeFunction"></a>

### urlEncode function

This function can be used to encode a string so that it is "URL safe". When used with a string that contains characters that aren't allowed in a URL, this function will convert those "unsafe" characters into character-entity equivalents. This function uses the UTF-8 encoding format.

#### Example - document key lookup

`urlEncode` function can be used as an alternative to the `base64Encode` function, if only URL unsafe characters are to be converted, while keeping other characters as-is.

Say, the input string is `<hello>` - then the target field of type `(Edm.String)` will be populated with the value `%3chello%3e`

When you retrieve the encoded key at search time, you can then use the `urlDecode` function to get the original key value, and use that to retrieve the source document.

```JSON
"fieldMappings" : [
  {
    "sourceFieldName" : "SourceKey",
    "targetFieldName" : "IndexKey",
    "mappingFunction" : {
      "name" : "urlEncode"
    }
  }]
 ```

 <a name="urlDecodeFunction"></a>

### urlDecode function

 This function converts a URL-encoded string into a decoded string using UTF-8 encoding format.

### Example - decode blob metadata

 Some Azure storage clients automatically URL-encode blob metadata if it contains non-ASCII characters. However, if you want to make such metadata searchable (as plain text), you can use the `urlDecode` function to turn the encoded data back into regular strings when populating your search index.

 ```JSON
"fieldMappings" : [
  {
    "sourceFieldName" : "UrlEncodedMetadata",
    "targetFieldName" : "SearchableMetadata",
    "mappingFunction" : {
      "name" : "urlDecode"
    }
  }]
 ```
 
 <a name="fixedLengthEncodeFunction"></a>

### fixedLengthEncode function
 
 This function converts a string of any length to a fixed-length string.

### Example - map document keys that are too long

When errors occur that are related to document key length exceeding 1024 characters, this function can be applied to reduce the length of the document key.

 ```JSON

"fieldMappings" : [
  {
    "sourceFieldName" : "metadata_storage_path",
    "targetFieldName" : "your key field",
    "mappingFunction" : {
      "name" : "fixedLengthEncode"
    }
  }]
 ```

## See also

+ [Supported data types in Cognitive Search](/rest/api/searchservice/supported-data-types)
+ [SQL data type map](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md#mapping-data-types)