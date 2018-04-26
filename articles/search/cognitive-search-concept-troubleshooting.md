---
title: Troubleshooting Guide for Cognitive Search scenarios in Azure Search | Microsoft Docs
description: Troubleshooting Guide for Cognitive Search.
services: search
manager: pablocas
author: luiscabrer

ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.date: 05/01/2018
ms.author: luisca
---
# Troubleshooting guide for cognitive search

This article contains a list of tips and tricks to get you moving as you are getting started with Cognitive Search capabilities. 

If you have not done so already, you should walk through the [Getting Started Tutorial](cognitive-search-quickstart-blob.md). It is a good step-by-step tutorial that explains how to apply cognitive search capabilities to a blob data source.

## At first start with a small dataset
The best way to find issues quickly is to increase the speed at which you can fix issues. The best way to reduce the indexing time is to reduce the number of documents to be indexed. Start by creating a data source with just a handful of documents/records. Your document sample should be a good representation of the variety of documents that will be indexed. 

Run your document sample through the end-to-end pipeline and check that the results meet your needs. Once you are satisfied with the results, you can add more files to your data source.

## Make sure your data source credentials are correct
The data source connection is not validated until you define an indexer that uses it. If you see any errors mentioning that the indexer cannot get to the data, make sure that:
- Your connection string is correct. Specially when you are creating SAS tokens, make sure to use the format expected by Azure Search. See [How to specify credentials section](
https://docs.microsoft.com/en-us/azure/search/search-howto-indexing-azure-blob-storage#how-to-specify-credentials) to learn about the different formats supported.
- Your container name in the indexer is correct.

## Seeing what works even if there are some failures
Sometimes a small failure may stop your indexer from continuing to run. That is fine if you are planning to fix issues one by one. Sometimes you want to ignore a particular type of error and have the indexer continue running so that you can see what flows are actually working.

In that case you may want to tell the indexer to ignore errors. Do that by setting *maxFailedItems* and *maxFailedItemsPerBatch* as -1 as part of the indexer definition.

```
{
  "// rest of your indexer definition
   "parameters":
   {
      "maxFailedItems":-1,
      "maxFailedItemsPerBatch":-1
   }
}
```
## Looking under the hood: displaying the enriched document
Enriched documents are temporary structures created during enrichment. They are then deleted when the process is complete.

To capture an enriched document created during indexing, add a field called ```enriched``` to your index. The indexer automatically dumps into it a string representation of all the enrichments for that document.

The enriched field will contain a string that is a logical representation of the in-memory enriched document in json.  The field value is a valid json document, however, quotes are escaped so you'll need to replace \" with " in order to view the document as formatted json.  The enriched field is intended for debugging purposes only to help you understand the logical shape of the content that expressions are being evaluated against.

This is a tool to be used for debugging purposes, and you should not depending on this field for indexing purposes.

Include the *enriched* field as part of your index definition for debugging purposes:

#### Request Body Syntax
```json
{
  "fields": [
    // other fields go here.
    {
      "name": "enriched",
      "type": "Edm.String",
      "searchable": false,
      "sortable": false,
      "filterable": false,
      "facetable": false
    }
  ]
}
```
## Speed up indexing
Depending on the complexity of your skillset, there may be quite a bit of processign going on for each of your documents. Depending on the type of subscription you have, you may be able to run several indexers in parallel. 

You would need to place your data into multiple containers or multiple virtual folders inside the same container. Then create multiple datasource / indexer pairs. All indexers can use the same skillset and write into the same target search index, so your search app doesn’t need to be aware of this partitioning.
For more details on this approach, see [Indexing Large Datasets] (https://docs.microsoft.com/en-us/azure/search/search-howto-indexing-azure-blob-storage#indexing-large-datasets).

## See also
+ [Getting Started Tutorial](cognitive-search-quickstart-blob.md)
+ [Specifying data source credentials](https://docs.microsoft.com/en-us/azure/search/search-howto-indexing-azure-blob-storage#how-to-specify-credentials)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Indexing Large Datasets](https://docs.microsoft.com/en-us/azure/search/search-howto-indexing-azure-blob-storage#indexing-large-datasets)
+ [How to map enriched fields to an index](cognitive-search-output-field-mapping.md)