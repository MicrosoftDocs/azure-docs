--- 
title: Tips for AI enrichment design
titleSuffix: Azure Cognitive Search
description: Tips and troubleshooting for setting up AI enrichment pipelines in Azure Cognitive Search.

manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/08/2020
---
# Tips for AI enrichment in Azure Cognitive Search

This article contains a list of tips and tricks to keep you moving as you get started with AI enrichment capabilities in Azure Cognitive Search. 

If you have not done so already, step through the [Tutorial: Learn how to call AI enrichment APIs](cognitive-search-quickstart-blob.md) for practice in applying AI enrichments to a blob data source.

## Tip 1: Start with a small dataset
The best way to find issues quickly is to increase the speed at which you can fix issues. The best way to reduce the indexing time is by reducing the number of documents to be indexed. 

Start by creating a data source with just a handful of documents/records. Your document sample should be a good representation of the variety of documents that will be indexed. 

Run your document sample through the end-to-end pipeline and check that the results meet your needs. Once you are satisfied with the results, you can add more files to your data source.

## Tip 2: Make sure your data source credentials are correct
The data source connection is not validated until you define an indexer that uses it. If you see any errors mentioning that the indexer cannot get to the data, make sure that:
- Your connection string is correct. Specially when you are creating SAS tokens, make sure to use the format expected by Azure Cognitive Search. See [How to specify credentials section](
https://docs.microsoft.com/azure/search/search-howto-indexing-azure-blob-storage#how-to-specify-credentials) to learn about the different formats supported.
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

### Debug sessions

Debug sessions is a visual editor that works with an existing skillset in the Azure portal. Within a debug session you can identify and resolve errors, validate changes, and push changes to a production skillset in the AI enrichment pipeline. This is a preview feature and access is granted on a case-by-case basis. [Read the documentation](https://docs.microsoft.com/azure/search/cognitive-search-debug-session) and find out how to apply for access.

## Tip 5: Expected content fails to appear

Missing content could be the result of documents getting dropped during indexing. Free and Basic tiers have low limits on document size. Any file exceeding the limit is dropped during indexing. You can check for dropped documents in the Azure portal. In the search service dashboard, double-click the Indexers tile. Review the ratio of successful documents indexed. If it is not 100%, you can click the ratio to get more detail. 

If the problem is related to file size, you might see an error like this: "The blob \<file-name>" has the size of \<file-size> bytes, which exceeds the maximum size for document extraction for your current service tier." For more information on indexer limits, see [Service limits](search-limits-quotas-capacity.md).

A second reason for content failing to appear might be related input/output mapping errors. For example, an output target name is "People" but the index field name is lower-case "people". The system could return 201 success messages for the entire pipeline so you think indexing succeeded, when in fact a field is empty. 

## Tip 6: Extend processing beyond maximum run time (24-hour window)

Image analysis is computationally-intensive for even simple cases, so when images are especially large or complex, processing times can exceed the maximum time allowed. 

Maximum run time varies by tier: several minutes on the Free tier, 24-hour indexing on billable tiers. If processing fails to complete within a 24-hour period for on-demand processing, switch to a schedule to have the indexer pick up processing where it left off. 

For scheduled indexers, indexing resumes on schedule at the last known good document. By using a recurring schedule, the indexer can work its way through the image backlog over a series of hours or days, until all un-processed images are processed. For more information on schedule syntax, see [Step 3: Create-an-indexer](search-howto-indexing-azure-blob-storage.md#step-3-create-an-indexer) or see [How to schedule indexers for Azure Cognitive Search](search-howto-schedule-indexers.md).

> [!NOTE]
> If an indexer is set to a certain schedule but repeatedly fails on the same document over and over again each time it runs, the indexer will begin running on a less frequent interval (up to the maximum of at least once every 24 hours) until it successfully makes progress again.  If you believe you have fixed whatever the issue that was causing the indexer to be stuck at a certain point, you can perform an on demand run of the indexer, and if that successfully makes progress, the indexer will return to its set schedule interval again.

For portal-based indexing (as described in the quickstart), choosing the "run once" indexer option limits processing to 1 hour (`"maxRunTime": "PT1H"`). You might want to extend the processing window to something longer.

## Tip 7: Increase indexing throughput

For [parallel indexing](search-howto-large-index.md), place your data into multiple containers or multiple virtual folders inside the same container. Then create multiple datasource and indexer pairs. All indexers can use the same skillset and write into the same target search index, so your search app doesn’t need to be aware of this partitioning.
For more information, see [Indexing Large Datasets](search-howto-indexing-azure-blob-storage.md#indexing-large-datasets).

## See also
+ [Quickstart: Create an AI enrichment pipeline in the portal](cognitive-search-quickstart-blob.md)
+ [Tutorial: Learn AI enrichment REST APIs](cognitive-search-tutorial-blob.md)
+ [Specifying data source credentials](search-howto-indexing-azure-blob-storage.md#how-to-specify-credentials)
+ [Indexing Large Datasets](search-howto-indexing-azure-blob-storage.md#indexing-large-datasets)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to map enriched fields to an index](cognitive-search-output-field-mapping.md)
