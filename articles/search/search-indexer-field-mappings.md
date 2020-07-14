---
title: Field mappings in indexers
titleSuffix: Azure Cognitive Search
description: Configure field mappings in an indexer to account for differences in field names and data representations.

manager: nitinme
author: mattmsft 
ms.author: magottei
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# Field mappings and transformations using Azure Cognitive Search indexers

When using Azure Cognitive Search indexers, you sometimes find that the input data doesn't quite match the schema of your target index. In those cases, you can use **field mappings** to reshape your data during the indexing process.

Some situations where field mappings are useful:

* Your data source has a field named `_id`, but Azure Cognitive Search doesn't allow field names that start with an underscore. A field mapping lets you effectively rename a field.
* You want to populate several fields in the index from the same data source data. For example, you might want to apply different analyzers to those fields.
* You want to populate an index field with data from more than one data source, and the data sources each use different field names.
* You need to Base64 encode or decode your data. Field mappings support several **mapping functions**, including functions for Base64 encoding and decoding.

> [!NOTE]
> Field mappings in indexers are a simple way to map data fields to index fields, with some ability for light-weight data conversion. More complex data might require pre-processing to reshape it into a form that's conducive to indexing. One option you might consider is [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/).

## Set up field mappings

A field mapping consists of three parts:

1. A `sourceFieldName`, which represents a field in your data source. This property is required.
2. An optional `targetFieldName`, which represents a field in your search index. If omitted, the same name as in the data source is used.
3. An optional `mappingFunction`, which can transform your data using one of several predefined functions. This can be applied on both input and output field mappings. The full list of functions is [below](#mappingFunctions).

Field mappings are added to the `fieldMappings` array of the indexer definition.

## Map fields using the REST API

You can add field mappings when creating a new indexer using the [Create Indexer](https://docs.microsoft.com/rest/api/searchservice/create-Indexer) API request. You can manage the field mappings of an existing indexer using the [Update Indexer](https://docs.microsoft.com/rest/api/searchservice/update-indexer) API request.

For example, here's how to map a source field to a target field with a different name:

```JSON

PUT https://[service name].search.windows.net/indexers/myindexer?api-version=[api-version]
Content-Type: application/json
api-key: [admin key]
{
    "dataSourceName" : "mydatasource",
    "targetIndexName" : "myindex",
    "fieldMappings" : [ { "sourceFieldName" : "_id", "targetFieldName" : "id" } ]
}
```

A source field can be referenced in multiple field mappings. The following example shows how to "fork" a field, copying the same source field to two different index fields:

```JSON

"fieldMappings" : [
    { "sourceFieldName" : "text", "targetFieldName" : "textStandardEnglishAnalyzer" },
    { "sourceFieldName" : "text", "targetFieldName" : "textSoundexAnalyzer" }
]
```

> [!NOTE]
> Azure Cognitive Search uses case-insensitive comparison to resolve the field and function names in field mappings. This is convenient (you don't have to get all the casing right), but it means that your data source or index cannot have fields that differ only by case.  
>
>

## Map fields using the .NET SDK

You define field mappings in the .NET SDK using the [FieldMapping](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.fieldmapping) class, which has the properties `SourceFieldName` and `TargetFieldName`, and an optional `MappingFunction` reference.

You can specify field mappings when constructing the indexer, or later by directly setting the `Indexer.FieldMappings` property.

The following C# example sets the field mappings when constructing an indexer.

```csharp
  List<FieldMapping> map = new List<FieldMapping> {
    // removes a leading underscore from a field name
    new FieldMapping("_custId", "custId"),
    // URL-encodes a field for use as the index key
    new FieldMapping("docPath", "docId", FieldMappingFunction.Base64Encode() )
  };

  Indexer sqlIndexer = new Indexer(
    name: "azure-sql-indexer",
    dataSourceName: sqlDataSource.Name,
    targetIndexName: index.Name,
    fieldMappings: map,
    schedule: new IndexingSchedule(TimeSpan.FromDays(1)));

  await searchService.Indexers.CreateOrUpdateAsync(indexer);
```

<a name="mappingFunctions"></a>

## Field mapping functions

A field mapping function transforms the contents of a field before it's stored in the index. The following mapping functions are currently supported:

* [base64Encode](#base64EncodeFunction)
* [base64Decode](#base64DecodeFunction)
* [extractTokenAtPosition](#extractTokenAtPositionFunction)
* [jsonArrayToStringCollection](#jsonArrayToStringCollectionFunction)
* [urlEncode](#urlEncodeFunction)
* [urlDecode](#urlDecodeFunction)

<a name="base64EncodeFunction"></a>

### base64Encode function

Performs *URL-safe* Base64 encoding of the input string. Assumes that the input is UTF-8 encoded.

#### Example - document key lookup

Only URL-safe characters can appear in an Azure Cognitive Search document key (because customers must be able to address the document using the [Lookup API](https://docs.microsoft.com/rest/api/searchservice/lookup-document) ). If the source field for your key contains URL-unsafe characters, you can use the `base64Encode` function to convert it at indexing time. However, a document key (both before and after conversion) can't be longer than 1,024 characters.

When you retrieve the encoded key at search time, you can then use the `base64Decode` function to get the original key value, and use that to retrieve the source document.

```JSON

"fieldMappings" : [
  {
    "sourceFieldName" : "SourceKey",
    "targetFieldName" : "IndexKey",
    "mappingFunction" : {
      "name" : "base64Encode",
      "parameters" : { "useHttpServerUtilityUrlTokenEncode" : false }
    }
  }]
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

If the `useHttpServerUtilityUrlTokenEncode` or `useHttpServerUtilityUrlTokenDecode` parameters for encoding and decoding respectively are set to `true`, then `base64Encode` behaves like [HttpServerUtility.UrlTokenEncode](https://msdn.microsoft.com/library/system.web.httpserverutility.urltokenencode.aspx) and `base64Decode` behaves like [HttpServerUtility.UrlTokenDecode](https://msdn.microsoft.com/library/system.web.httpserverutility.urltokendecode.aspx).

> [!WARNING]
> If `base64Encode` is used to produce key values, `useHttpServerUtilityUrlTokenEncode` must be set to true. Only URL-safe base64 encoding can be used for key values. See [Naming rules &#40;Azure Cognitive Search&#41;](https://docs.microsoft.com/rest/api/searchservice/naming-rules) for the full set of restrictions on characters in key values.

The .NET libraries in Azure Cognitive Search assume the full .NET Framework, which provides built-in encoding. The `useHttpServerUtilityUrlTokenEncode` and `useHttpServerUtilityUrlTokenDecode` options leverage this built-in functionality. If you are using .NET Core or another framework, we recommend setting those options to `false` and calling your framework's encoding and decoding functions directly.

The following table compares different base64 encodings of the string `00>00?00`. To determine the required additional processing (if any) for your base64 functions, apply your library encode function on the string `00>00?00` and compare the output with the expected output `MDA-MDA_MDA`.

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

* `delimiter`: a string to use as the separator when splitting the input string.
* `position`: an integer zero-based position of the token to pick after the input string is split.

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

For example, if the input string is `["red", "white", "blue"]`, then the target field of type `Collection(Edm.String)` will be populated with the three values `red`, `white`, and `blue`. For input values that cannot be parsed as JSON string arrays, an error is returned.

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

This function can be used to encode a string so that it is "URL safe". When used with a string that contains characters that are not allowed in a URL, this function will convert those "unsafe" characters into character-entity equivalents. This function uses the UTF-8 encoding format.

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

 Some Azure storage clients automatically url encode blob metadata if it contains non-ASCII characters. However, if you want to make such metadata searchable (as plain text), you can use the `urlDecode` function to turn the encoded data back into regular strings when populating your search index.

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
 
 This function converts a string of any length to a fixed length string.
 
 ### Example - map document keys that are too long
 
When facing errors complaining about document key being longer than 1024 characters, this function can be applied to reduce the length of the document key.

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
