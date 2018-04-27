---
title: Troubleshooting tips for cognitive search in Azure Search | Microsoft Docs
description: Tips and troubleshooting for setting up cognitive search pipelines in Azure Search.
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
# Troubleshooting tips for cognitive search

This article contains a list of tips and tricks to keep you moving as you get started with cognitive search capabilities in Azure Search. 

If you have not done so already, step through the [Tutorial: Learn how to call the cognitive search APIs](cognitive-search-quickstart-blob.md) for practice in applying cognitive search enrichments to a blob data source.

## Tip 1: Start with a small dataset
The best way to find issues quickly is to increase the speed at which you can fix issues. The best way to reduce the indexing time is by reducing the number of documents to be indexed. 

Start by creating a data source with just a handful of documents/records. Your document sample should be a good representation of the variety of documents that will be indexed. 

Run your document sample through the end-to-end pipeline and check that the results meet your needs. Once you are satisfied with the results, you can add more files to your data source.

## Tip 2: Make sure your data source credentials are correct
The data source connection is not validated until you define an indexer that uses it. If you see any errors mentioning that the indexer cannot get to the data, make sure that:
- Your connection string is correct. Specially when you are creating SAS tokens, make sure to use the format expected by Azure Search. See [How to specify credentials section](
https://docs.microsoft.com/en-us/azure/search/search-howto-indexing-azure-blob-storage#how-to-specify-credentials) to learn about the different formats supported.
- Your container name in the indexer is correct.

## Tip 3: See what works even if there are some failures
Sometimes a small failure stops an indexer in its tracks. That is fine if you plan to fix issues one by one. However, you might want to ignore a particular type of error, allowing the indexer to continue so that you can see what flows are actually working.

In that case, you may want to tell the indexer to ignore errors. Do that by setting *maxFailedItems* and *maxFailedItemsPerBatch* as -1 as part of the indexer definition.

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
## Tip 4: Looking at enriched documents under the hood 
Enriched documents are temporary structures created during enrichment, and then deleted when processing is complete.

To capture a snapshot of the enriched document created during indexing, add a field called ```enriched``` to your index. The indexer automatically dumps into the field a string representation of all the enrichments for that document.

The ```enriched``` field will contain a string that is a logical representation of the in-memory enriched document in JSON.  The field value is a valid JSON document, however. Quotes are escaped so you'll need to replace `\"` with `"` in order to view the document as formatted JSON. 

The enriched field is intended for debugging purposes only, to help you understand the logical shape of the content that expressions are being evaluated against. You should not depend on this field for indexing purposes.

Add an ```enriched``` field as part of your index definition for debugging purposes:

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

## Tip 5: Extend processing beyond the 24-hour window

Image analysis is computationally-intensive for even simple cases, so when images are especially large or complex, processing times can exceed the maximum time allowed. If processing fails to complete within a 24-hour period for on-demand processing, switch to a schedule to have the indexer pick up processing where it left off. 

For scheduled indexers, indexing resumes on schedule at the last known good document. By using a recurring schedule, the indexer can work its way through the image backlog over a series of hours or days, until all un-processed images are processed. For more information on schedule syntax, see [Step 3: Create-an-indexer](search-howto-indexing-azure-blob-storage.md#step-3-create-an-indexer).

## Tip 6: Increase indexing throughput

For [parallel indexing](search-howto-reindex.md#parallel-indexing), place your data into multiple containers or multiple virtual folders inside the same container. Then create multiple datasource and indexer pairs. All indexers can use the same skillset and write into the same target search index, so your search app doesn’t need to be aware of this partitioning.
For more information, see [Indexing Large Datasets](search-howto-indexing-azure-blob-storage.md#indexing-large-datasets).

## See also
+ [Quickstart: Quickstart: Create a cognitive search pipeline in the portal](cognitive-search-quickstart-blob.md)
+ [Tutorial: Learn cognitive search REST APIs](cognitive-search-tutorial-blob.md)
+ [Specifying data source credentials](search-howto-indexing-azure-blob-storage.md#how-to-specify-credentials)
+ [Indexing Large Datasets](search-howto-indexing-azure-blob-storage.md#indexing-large-datasets)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to map enriched fields to an index](cognitive-search-output-field-mapping.md)