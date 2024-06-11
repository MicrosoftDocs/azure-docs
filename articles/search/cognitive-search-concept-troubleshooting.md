---
title: Tips for AI enrichment design
titleSuffix: Azure AI Search
description: Tips and troubleshooting for setting up AI enrichment pipelines in Azure AI Search.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 02/16/2024
---

# Tips for AI enrichment in Azure AI Search 

This article contains tips to help you get started with AI enrichment and skillsets used during indexing.

## Tip 1: Start simple and start small

Both the [**Import data wizard**](cognitive-search-quickstart-blob.md) and [**Import and vectorize data wizard**](search-get-started-portal-import-vectors.md) in the Azure portal support AI enrichment. Without writing any code, you can create and examine all of the objects used in an enrichment pipeline: an index, indexer, data source, and skillset.

Another way to start simply is by creating a data source with just a handful of documents or rows in a table that are representative of the documents that will be indexed. A small data set is the best way to increase the speed of finding and fixing issues.Run your sample through the end-to-end pipeline and check that the results meet your needs. Once you're satisfied with the results, you're ready to add more files to your data source.

## Tip 2: See what works even if there are some failures

Sometimes a small failure stops an indexer in its tracks. That is fine if you plan to fix issues one by one. However, you might want to ignore a particular type of error, allowing the indexer to continue so that you can see what flows are actually working.

To ignore errors during development, set `maxFailedItems` and `maxFailedItemsPerBatch` as -1 as part of the indexer definition.

```json
{
  // rest of your indexer definition
   "parameters":
   {
      "maxFailedItems":-1,
      "maxFailedItemsPerBatch":-1
   }
}
```

> [!NOTE]
> As a best practice, set the `maxFailedItems` and `maxFailedItemsPerBatch` to 0 for production workloads

## Tip 3: Use Debug session to troubleshoot issues

[**Debug session**](./cognitive-search-debug-session.md) is a visual editor that shows a skillset's dependency graph, inputs and outputs, and definitions. It works by loading a single document from your search index, with the current indexer and skillset configuration. You can then run the entire skillset, scoped to a single document. Within a debug session, you can identify and resolve errors, validate changes, and commit changes to a parent skillset. For a walkthrough, see [Tutorial: debug sessions](./cognitive-search-tutorial-debug-sessions.md).

## Tip 4: Expected content fails to appear

If you're missing content, check for dropped documents in the Azure portal. In the search service page, open **Indexers** and look at the **Docs succeeded** column. Click through to indexer execution history to review specific errors. 

If the problem is related to file size, you might see an error like this: "The blob \<file-name>" has the size of \<file-size> bytes, which exceed the maximum size for document extraction for your current service tier." For more information on indexer limits, see [Service limits](search-limits-quotas-capacity.md).

A second reason for content failing to appear might be related input/output mapping errors. For example, an output target name is "People" but the index field name is lower-case "people". The system could return 201 success messages for the entire pipeline so you think indexing succeeded, when in fact a field is empty. 

## Tip 5: Extend processing beyond maximum run time

Image analysis is computationally intensive for even simple cases, so when images are especially large or complex, processing times can exceed the maximum time allowed.

For indexers that have skillsets, skillset execution is [capped at 2 hours for most tiers](search-limits-quotas-capacity.md#indexer-limits). If skillset processing fails to complete within that period, you can put your indexer on a 2-hour recurring schedule to have the indexer pick up processing where it left off. 

Scheduled indexing resumes at the last known good document. On a recurring schedule, the indexer can work its way through the image backlog over a series of hours or days, until all unprocessed images are processed. For more information on schedule syntax, see [Schedule an indexer](search-howto-schedule-indexers.md).

> [!NOTE]
> If an indexer is set to a certain schedule but repeatedly fails on the same document over and over again each time it runs, the indexer will begin running on a less frequent interval (up to the maximum of at least once every 24 hours) until it successfully makes progress again. = If you believe you have fixed whatever the issue that was causing the indexer to be stuck at a certain point, you can perform an on-demand run of the indexer, and if that successfully makes progress, the indexer will return to its set schedule interval again.

## Tip 6: Increase indexing throughput

For [parallel indexing](search-howto-large-index.md), distribute your data into multiple containers or multiple virtual folders inside the same container. Then create multiple data source and indexer pairs. All indexers can use the same skillset and write into the same target search index, so your search app doesn’t need to be aware of this partitioning.

## See also

+ [Quickstart: Create an AI enrichment pipeline in the portal](cognitive-search-quickstart-blob.md)
+ [Tutorial: Learn AI enrichment REST APIs](cognitive-search-tutorial-blob.md)
+ [How to configure blob indexers](search-howto-indexing-azure-blob-storage.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to map enriched fields to an index](cognitive-search-output-field-mapping.md)
