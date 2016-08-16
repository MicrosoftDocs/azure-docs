<properties
pageTitle="Azure Search indexer field mappings bridge the differences between data sources and search indexes"
description="Configure Azure Search indexer field mappings to account for differences in field names and data representations"
services="search"
documentationCenter=""
authors="chaosrealm"
manager="pablocas"
editor="" />

<tags
ms.service="search"
ms.devlang="rest-api"
ms.workload="search" 
ms.topic="article"  
ms.tgt_pltfrm="na"
ms.date="04/30/2016"
ms.author="eugenesh" />

# Azure Search indexer field mappings bridge the differences between data sources and search indexes

When using Azure Search indexers, you can occasionally find yourself in situations where your input data doesn't quite match the schema of your target index. In those cases, you can use **field mappings** to transform your data into the desired shape. 

Some situations where field mappings are useful:
 
- Your data source has a field `_id`, but Azure Search doesn't allow field names starting with an underscore. A field mapping allows you to "rename" a field. 
- You want to populate several fields in the index with the same data source data, for example because you want to apply different analyzers to those fields. Field mappings let you "fork" a data source field.
- You need to Base64 encode or decode your data. Field mappings support several **mapping functions**, including functions for Base64 encoding and decoding.   


> [AZURE.IMPORTANT] Currently, field mappings functionality is in preview. It is available only in the REST API using version **2015-02-28-Preview**. Please remember, preview APIs are intended for testing and evaluation, and should not be used in production environments.

## Setting up field mappings

You can add field mappings when creating a new indexer using the [Create Indexer](search-api-indexers-2015-02-28-preview.md#create-indexer) API. You can manage field mappings on an indexing indexer using the [Update Indexer](search-api-indexers-2015-02-28-preview.md#update-indexer) API. 

A field mapping consists of 3 parts: 

1. A `sourceFieldName`, which represents a field in your data source. This property is required. 

2. An optional `targetFieldName`, which represents a field in your search index. If omitted, the same name as in the data source is used. 

3. An optional `mappingFunction`, which can transform your data using one of several predefined functions. The full list of functions is [below](#mappingFunctions).

Fields mappings are added to the `fieldMappings` array on the indexer definition. 

For example, here's how you can accommodate differences in field names: 

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

An indexer can have multiple field mappings. For example, here's how you can "fork" a field:

```JSON

"fieldMappings" : [ 
	{ "sourceFieldName" : "text", "targetFieldName" : "textStandardEnglishAnalyzer" },
	{ "sourceFieldName" : "text", "targetFieldName" : "textSoundexAnalyzer" }, 
] 
```

> [AZURE.NOTE] Azure Search uses case-insensitive comparison to resolve the field and function names in field mappings. This is convenient (you don't have to get all the casing right), but it means that your data source or index cannot have fields that differ only by case.  

<a name="mappingFunctions"></a>
## Field mapping functions

These functions are currently supported: 

- [base64Encode](#base64EncodeFunction)
- [base64Decode](#base64DecodeFunction)
- [extractTokenAtPosition](#extractTokenAtPositionFunction)
- [jsonArrayToStringCollection](#jsonArrayToStringCollectionFunction)

<a name="base64EncodeFunction"></a>
### base64Encode 

Performs *URL-safe* Base64 encoding of the input string. Assumes that the input is UTF-8 encoded. 

#### Sample use case 

Only URL-safe characters can appear in an Azure Search document key (because customers must be able to address the document using the Lookup API, for example). If your data contains URL-unsafe characters and you want to use it to populate a key field in your search index, use this function.   

#### Example 

```JSON

"fieldMappings" : [ 
  { 
    "sourceFieldName" : "Path", 
    "targetFieldName" : "UrlSafePath",
    "mappingFunction" : { "name" : "base64Encode" } 
  }] 
```

<a name="base64DecodeFunction"></a>
### base64Decode

Performs Base64 decoding of the input string. The input is assumed to a *URL-safe* Base64-encoded string. 

#### Sample use case 

Blob custom metadata values must be ASCII-encoded. You can use Base64 encoding to represent arbitrary Unicode strings in blob custom metadata. However, to make search meaningful, you can use this function to turn the encoded data back into "regular" strings when populating your search index.  

#### Example 

```JSON

"fieldMappings" : [ 
  { 
    "sourceFieldName" : "Base64EncodedMetadata", 
    "targetFieldName" : "SearchableMetadata",
    "mappingFunction" : { "name" : "base64Decode" } 
  }] 
```

<a name="extractTokenAtPositionFunction"></a>
### extractTokenAtPosition

Splits a string field using the specified delimiter, and picks the token at the specified position in the resulting split.

For example, if the input is `Jane Doe`, the `delimiter` is `" "`(space) and the `position` is 0, the result is `Jane`; if the `position` is 1, the result is `Doe`. If the position refers to a token that doesn't exist, an error will be returned.

#### Sample use case 

Your data source contains a `PersonName` field, and you want to index it as two separate `FirstName` and `LastName` fields. You can use this function to split the input using the space character as the delimiter.

#### Parameters

- `delimiter`: a string to use as the separator when splitting the input string.
- `position`: an integer zero-based position of the token to pick after the input string is split.    

#### Example

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
### jsonArrayToStringCollection

Transforms a string formatted as a JSON array of strings into a string array that can be used to populate a `Collection(Edm.String)` field in the index. 

For example, if the input string is `["red", "white", "blue"]`, then the target field of type `Collection(Edm.String)` will be populated with the three values `red`, `white` and `blue`. For input values that cannot be parsed as JSON string arrays, an error will be returned. 

#### Sample use case

Azure SQL database doesn't have a built-in data type that naturally maps to `Collection(Edm.String)` fields in Azure Search. To populate string collection fields, format your source data as a JSON string array and use this function. 

#### Example 

```JSON

"fieldMappings" : [ 
  { "sourceFieldName" : "tags", "mappingFunction" : { "name" : "jsonArrayToStringCollection" } }
] 
```

## Help us make Azure Search better

If you have feature requests or ideas for improvements, please reach out to us on our [UserVoice site](https://feedback.azure.com/forums/263029-azure-search/).