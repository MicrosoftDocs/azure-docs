<properties
pageTitle="Azure Search indexer field mappings"
description="Learn how to use Azure Search field mappings"
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
ms.date="04/28/2016"
ms.author="eugenesh" />

# What are field mappings

When using Azure Search indexers, you can occasionally find yourself in situations where your input data doesn't quite match the schema of your target index. In those cases, you can use **field mappings** to transform your data into the desired shape. 

Some situations where field mappings are useful:
 
- Your data source has a field `_id`, but Azure Search doesn't allow field names starting with an underscore. A field mapping allows you to "rename" a field. 
- You want populate several fields in the index with the same data source data, for example because you want to apply different analyzers to those fields. Field mappings let you to "fork" a data source field.
- You need to  base-64 encode or decode your data. Field mappings support several **mapping functions**, including functions for base-64 encoding and decoding.   


> [AZURE.IMPORTANT] Currently, field mappings functionality is in preview. It is available only in the REST API using version **2015-02-28-Preview**. Please remember, preview APIs are intended for testing and evaluation, and should not be used in production environments.

## Setting up field mappings

A field mapping consists of 3 parts: 

1. `sourceFieldName`, which represents the field in your data source. This property is required. 

2. An optional `targetFieldName`, which represents the name in your search index. You can use this to "rename" a field from the data source.

3. An optional `mappingFunction` allows using several predefined functions to transform your data. The full list of functions is below.

Fields mappings are added to the `fieldsMappings` array on the indexer definition. For example: 

	PUT https://[service name].search.windows.net/indexers/myindexer?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]
    {
        "dataSourceName" : "mydatasource",
        "targetIndexName" : "myindex",
        "fieldMappings" : [ { "sourceFieldName" : "_id", "targetFieldName" : "id" } ] 
    } 

An indexer can have multiple field mappings. For example, here's how you can "fork" a field:

	"fieldMappings" : [ 
	  { "sourceFieldName" : "text", "targetFieldName" : "textStandardEnglishAnalyzer" },
	  { "sourceFieldName" : "text", "targetFieldName" : "textSoundexAnalyzer" }, 
	] 

# Field mapping functions

These functions are currently supported: 

- base64Encode
- base64Decode
- extractTokenAtPosition
- jsonArrayToStringCollection

TODO, eugenesh: a section for each function. 

# Help us make Azure Search better

If you have feature requests or ideas for improvements, please reach out to us on our [UserVoice site](https://feedback.azure.com/forums/263029-azure-search/).