---
title: Tips for AI enrichment design
titleSuffix: Azure AI Search
description: Tips and troubleshooting for setting up AI enrichment pipelines in Azure AI Search.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/16/2022
---
# Tips for AI enrichment in Azure AI Search

This article contains a list of tips and tricks to keep you moving as you get started with AI enrichment capabilities in Azure AI Search. 

If you haven't already, step through [Quickstart: Create a skillset for AI enrichment](cognitive-search-quickstart-blob.md) for a light-weight introduction to enrichment of blob data.

## Tip 1: Start with a small dataset

The best way to find issues quickly is to increase the speed at which you can fix issues, which means working with smaller or simpler documents. 

Start by creating a data source with just a handful of documents or rows in a table that are representative of the documents that will be indexed. 

Run your sample through the end-to-end pipeline and check that the results meet your needs. Once you're satisfied with the results, you're ready to add more files to your data source.

## Tip 2: Make sure your data source credentials are correct

The data source connection isn't validated until you define an indexer that uses it. If you get connection errors, make sure that:

+ Your connection string is correct. Specially when you're creating SAS tokens, make sure to use the format expected by Azure AI Search. See [How to specify credentials section](search-howto-indexing-azure-blob-storage.md#credentials) to learn about the different formats supported.

+ Your container name in the indexer is correct.

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

> [!NOTE]
> As a best practice, set the maxFailedItems, maxFailedItemsPerBatch to 0 for production workloads

## Tip 4: Use Debug sessions to identify and resolve issues with your skillset 

**Debug sessions** is a visual editor that works with an existing skillset in the Azure portal. Within a debug session you can identify and resolve errors, validate changes, and commit changes to a production skillset in the AI enrichment pipeline. This is a preview feature [read the documentation](./cognitive-search-debug-session.md). For more information about concepts and getting started, see [Debug sessions](./cognitive-search-tutorial-debug-sessions.md).

Debug sessions work on a single document are a great way for you to iteratively build more complex enrichment pipelines.

## Tip 5: Looking at enriched documents under the hood 

Enriched documents are temporary structures created during enrichment, and then deleted when processing is complete.

To capture a snapshot of the enriched document created during indexing, add a field called ```enriched``` to your index. The indexer automatically dumps into the field a string representation of all the enrichments for that document.

The ```enriched``` field will contain a string that is a logical representation of the in-memory enriched document in JSON.  The field value is a valid JSON document, however. Quotes are escaped so you'll need to replace `\"` with `"` in order to view the document as formatted JSON. 

The enriched field is intended for debugging purposes only, to help you understand the logical shape of the content that expressions are being evaluated against. You shouldn't depend on this field for indexing purposes.

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

## Tip 6: Expected content fails to appear

Missing content could be the result of documents getting dropped during indexing. Free and Basic tiers have low limits on document size. Any file exceeding the limit is dropped during indexing. You can check for dropped documents in the Azure portal. In the search service dashboard, double-click the Indexers tile. Review the ratio of successful documents indexed. If it isn't 100%, you can select the ratio to get more detail. 

If the problem is related to file size, you might see an error like this: "The blob \<file-name>" has the size of \<file-size> bytes, which exceed the maximum size for document extraction for your current service tier." For more information on indexer limits, see [Service limits](search-limits-quotas-capacity.md).

A second reason for content failing to appear might be related input/output mapping errors. For example, an output target name is "People" but the index field name is lower-case "people". The system could return 201 success messages for the entire pipeline so you think indexing succeeded, when in fact a field is empty. 

## Tip 7: Extend processing beyond maximum run time (24-hour window)

Image analysis is computationally intensive for even simple cases, so when images are especially large or complex, processing times can exceed the maximum time allowed. 

Maximum run time varies by tier: several minutes on the Free tier, 24-hour indexing on billable tiers. If processing fails to complete within a 24-hour period for on-demand processing, switch to a schedule to have the indexer pick up processing where it left off. 

For scheduled indexers, indexing resumes on schedule at the last known good document. By using a recurring schedule, the indexer can work its way through the image backlog over a series of hours or days, until all unprocessed images are processed. For more information on schedule syntax, see [Schedule an indexer](search-howto-schedule-indexers.md).

> [!NOTE]
> If an indexer is set to a certain schedule but repeatedly fails on the same document over and over again each time it runs, the indexer will begin running on a less frequent interval (up to the maximum of at least once every 24 hours) until it successfully makes progress again.  If you believe you have fixed whatever the issue that was causing the indexer to be stuck at a certain point, you can perform an on-demand run of the indexer, and if that successfully makes progress, the indexer will return to its set schedule interval again.

For portal-based indexing (as described in the quickstart), choosing the "run once" indexer option limits processing to 1 hour (`"maxRunTime": "PT1H"`). You might want to extend the processing window to something longer.

## Tip 8: Increase indexing throughput

For [parallel indexing](search-howto-large-index.md), place your data into multiple containers or multiple virtual folders inside the same container. Then create multiple data source and indexer pairs. All indexers can use the same skillset and write into the same target search index, so your search app doesn’t need to be aware of this partitioning.

## See also

+ [Quickstart: Create an AI enrichment pipeline in the portal](cognitive-search-quickstart-blob.md)
+ [Tutorial: Learn AI enrichment REST APIs](cognitive-search-tutorial-blob.md)
+ [How to configure blob indexers](search-howto-indexing-azure-blob-storage.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to map enriched fields to an index](cognitive-search-output-field-mapping.md)
