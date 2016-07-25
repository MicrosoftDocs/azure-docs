<properties
pageTitle="Indexing JSON blobs with Azure Search blob indexer"
description="Indexing JSON blobs with Azure Search blob indexer"
services="search"
documentationCenter=""
authors="chaosrealm"
manager="pablocas"
editor="" />

<tags
ms.service="search"
ms.devlang="rest-api"
ms.workload="search" ms.topic="article"  
ms.tgt_pltfrm="na"
ms.date="07/25/2016"
ms.author="eugenesh" />

# Indexing JSON blobs with Azure Search blob indexer 

This article shows how to configure Azure Search blob indexer to extract structured content from blobs that contain JSON.

## Scenarios

By default, [Azure Search blob indexer](search-howto-indexing-azure-blob-storage.md) parses JSON blobs as a single chunk of text. Often, you want preserve the structure of your JSON documents. For example, given the JSON document 

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

you can populate your Azure Search index with 3 separate documents, each with "id" and "text" fields. 

> [AZURE.IMPORTANT] This functionality is currently in preview. It is available only in the REST API using version **2015-02-28-Preview**. Please remember, preview APIs are intended for testing and evaluation, and should not be used in production environments. 

## Setting up JSON indexing

To index JSON blobs, set the `parsingMode` configuration parameter to `json` (to index each blob as a single document) or `jsonArray` (if your blobs contain a JSON array): 

	{
	  "name" : "my-json-indexer",
	  ... other indexer properties
	  "parameters" : { "configuration" : { "parsingMode" : "json" | "jsonArray" } }
	}

If needed, use **field mappings** to pick the properties of the source JSON document used to populate your target search index.  This is described in detail below. 

> [AZURE.IMPORTANT] When you use `json` or `jsonArray` parsing mode, Azure Search assumes that all blobs in your data source will be JSON. If you need to support a mix of JSON and non-JSON blobs in the same data source, please let us know on [our UserVoice site](https://feedback.azure.com/forums/263029-azure-search).

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

Let's say you have a search index with the following fields: `text` of type Edm.String, `date` of type Edm.DateTimeOffset, and `tags` of type Collection(Edm.String). To map your JSON into the desired shape, use the following field mappings: 

	"fieldMappings" : [ 
        { "sourceFieldName" : "/article/text", "targetFieldName" : "text" },
        { "sourceFieldName" : "/article/datePublished", "targetFieldName" : "date" },
        { "sourceFieldName" : "/article/tags", "targetFieldName" : "tags" }
  	]

The source field names in the mappings are specified using the [JSON Pointer](http://tools.ietf.org/html/rfc6901) notation. You start with a forward slash to refer to the root of your JSON document, then drill into the desired property (at arbitrary level of nesting) by using forward slash-separated path. 

You can also refer to individual array elements by using a zero-based index. For example, to pick the first element of the "tags" array from the above example, use a field mapping like this:

	{ "sourceFieldName" : "/article/tags/0", "targetFieldName" : "firstTag" }

> [AZURE.NOTE] If a source field name in a field mapping path refers to a property that doesn't exist in JSON, that mapping is skipped without an error. This is done so that we can support documents with a different schema (which is a common use case). Because there is no validation, you need to take care to avoid typos in your field mapping specification. 

If your JSON documents only contain simple top-level properties, you may not need field mappings at all. For example, if your JSON looks like this, the top-level properties "text", "datePublished" and "tags" will directly map to the corresponding fields in the search index: 
 
	{ 
	   "text" : "A hopefully useful article explaining how to parse JSON blobs",
	   "datePublished" : "2016-04-13" 
       "tags" : [ "search", "storage", "howto" ]    
 	}

## "Plucking" the array of JSON objects

What if you wish to index an array of JSON objects, but that array is nested somewhere within the document? You can "pluck" the array using the `documentRoot` configuration property. For example, if your blobs look like this: 

	{ 
		"level1" : {
			"level2" : [
				{ "id" : "1", "text" : "Use the documentRoot property" }, 
				{ "id" : "2", "text" : "to pluck the array you want to index" },
				{ "id" : "3", "text" : "even if it's nested inside the document" }  
			]
		}
	} 

use this configuration to index the array contained in the "level2" property: 

	{
		"name" : "my-json-array-indexer",
		... other indexer properties
		"parameters" : { "configuration" : { "parsingMode" : "jsonArray", "documentRoot" : "/level1/level2" } }
	}


## Request examples

Putting this all together, here are the complete payloads examples. 

Datasource: 

	POST https://[service name].search.windows.net/datasources?api-version=2015-02-28-Preview
	Content-Type: application/json
	api-key: [admin key]

	{
	    "name" : "my-blob-datasource",
	    "type" : "azureblob",
	    "credentials" : { "connectionString" : "<my storage connection string>" },
	    "container" : { "name" : "my-container", "query" : "optional, my-folder" }
	}   

Indexer:

	POST https://[service name].search.windows.net/indexers?api-version=2015-02-28-Preview
	Content-Type: application/json
	api-key: [admin key]

	{
	  "name" : "my-json-indexer",
	  "dataSourceName" : "my-blob-datasource",
	  "targetIndexName" : "my-target-index",
	  "schedule" : { "interval" : "PT2H" },
      "parameters" : { "configuration" : { "useJsonParser" : true } }, 
      "fieldMappings" : [ 
        { "sourceFieldName" : "/article/text", "targetFieldName" : "text" },
        { "sourceFieldName" : "/article/datePublished", "targetFieldName" : "date" },
        { "sourceFieldName" : "/article/tags", "targetFieldName" : "tags" }
  	  ]
	}

## Help us make Azure Search better

If you have feature requests or ideas for improvements, please reach out to us on our [UserVoice site](https://feedback.azure.com/forums/263029-azure-search/).