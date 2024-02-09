---
title: Index large data sets for full text search
titleSuffix: Azure AI Search
description: Strategies for large data indexing or computationally intensive indexing through batch mode, resourcing, and scheduled, parallel, and distributed indexing.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 01/17/2023
---

# Index large data sets in Azure AI Search

If your search solution requirements include indexing big data or complex data, this article describes the strategies for accommodating long running processes on Azure AI Search.

This article assumes familiarity with the [two basic approaches for importing data](search-what-is-data-import.md): pushing data into an index, or pulling in data from a supported data source using a [search indexer](search-indexer-overview.md). The strategy you choose will be determined by the indexing approach you're already using. If your scenario involves computationally intensive [AI enrichment](cognitive-search-concept-intro.md), then your strategy must include indexers, given the skillset dependency on indexers.

This article complements [Tips for better performance](search-performance-tips.md), which offers best practices on index and query design. A well-designed index that includes only the fields and attributes you need is an important prerequisite for large-scale indexing.

> [!NOTE]
> The strategies described in this article assume a single large data source. If your solution requires indexing from multiple data sources, see [Index multiple data sources in Azure AI Search](/samples/azure-samples/azure-search-dotnet-scale/multiple-data-sources/) for a recommended approach.

## Index large data using the push APIs

"Push" APIs, such as [Add Documents REST API](/rest/api/searchservice/addupdate-or-delete-documents) or the [IndexDocuments method (Azure SDK for .NET)](/dotnet/api/azure.search.documents.searchclient.indexdocuments), are the most prevalent form of indexing in Azure AI Search. For solutions that use a push API, the strategy for long-running indexing will have one or both of the following components:

+ Batching documents
+ Managing threads

### Batch multiple documents per request

A simple mechanism for indexing a large quantity of data is to submit multiple documents or records in a single request. As long as the entire payload is under 16 MB, a request can handle up to 1000 documents in a bulk upload operation. These limits apply whether you're using the [Add Documents REST API](/rest/api/searchservice/addupdate-or-delete-documents) or the [IndexDocuments method](/dotnet/api/azure.search.documents.searchclient.indexdocuments) in the .NET SDK. For either API, you would package 1000 documents in the body of each request.

Batching documents will significantly shorten the amount of time it takes to work through a large data volume. Determining the optimal batch size for your data is a key component of optimizing indexing speeds. The two primary factors influencing the optimal batch size are:

+ The schema of your index
+ The size of your data

Because the optimal batch size depends on your index and your data, the best approach is to test different batch sizes to determine which one results in the fastest indexing speeds for your scenario. [Tutorial: Optimize indexing with the push API](tutorial-optimize-indexing-push-api.md) provides sample code for testing batch sizes using the .NET SDK.

### Add threads and a retry strategy

Indexers have built-in thread management, but when you're using the push APIs, your application code will have to manage threads. Make sure there are sufficient threads to make full use of the available capacity, especially if you've recently increased partitions or have upgraded to a higher tier search service. 

1. [Increase the number of concurrent threads](tutorial-optimize-indexing-push-api.md#use-multiple-threadsworkers) in your client code.

1. As you ramp up the requests hitting the search service, you might encounter [HTTP status codes](/rest/api/searchservice/http-status-codes) indicating the request didn't fully succeed. During indexing, two common HTTP status codes are:

   + **503 Service Unavailable** - This error means that the system is under heavy load and your request can't be processed at this time.

   + **207 Multi-Status** - This error means that some documents succeeded, but at least one failed.

1. To handle failures, requests should be retried using an [exponential backoff retry strategy](/dotnet/architecture/microservices/implement-resilient-applications/implement-retries-exponential-backoff).

The Azure .NET SDK automatically retries 503s and other failed requests, but you'll need to implement your own logic to retry 207s. Open-source tools such as [Polly](https://github.com/App-vNext/Polly) can also be used to implement a retry strategy.

## Index with indexers and the "pull" APIs

[Indexers](search-indexer-overview.md) have several capabilities that are useful for long-running processes:

+ Batching documents
+ Parallel indexing over partitioned data
+ Scheduling and change detection for indexing just new and change documents over time

Indexer schedules can resume processing at the last known stopping point. If data isn't fully indexed within the processing window, the indexer picks up wherever it left off on the next run, assuming you're using a data source that provides change detection.

Partitioning data into smaller individual data sources enables parallel processing. You can break up source data, such as into multiple containers in Azure Blob Storage, create a [data source](/rest/api/searchservice/create-data-source) for each partition, and then [run the indexers in parallel](search-howto-run-reset-indexers.md), subject to the number of search units of your search service.

### Check indexer batch size

As with the push API, indexers allow you to configure the number of items per batch. For indexers based on the [Create Indexer REST API](/rest/api/searchservice/Create-Indexer), you can set the `batchSize` argument to customize this setting to better match the characteristics of your data. 

Default batch sizes are data source specific. Azure SQL Database and Azure Cosmos DB have a default batch size of 1000. In contrast, Azure Blob indexing sets batch size at 10 documents in recognition of the larger average document size. 

### Schedule indexers for long-running processes

Indexer scheduling is an important mechanism for processing large data sets and for accommodating slow-running processes like image analysis in an enrichment pipeline. 

Typically, indexer processing runs within a 2-hour window. If the indexing workload takes days rather than hours to complete, you can put the indexer on a consecutive, recurring schedule that starts every two hours. Assuming the data source has [change tracking enabled](search-howto-create-indexers.md#change-detection-and-internal-state), the indexer will resume processing where it last left off. At this cadence, an indexer can work its way through a document backlog over a series of days until all unprocessed documents are processed. 

```json
{
    "dataSourceName" : "hotels-ds",
    "targetIndexName" : "hotels-idx",
    "schedule" : { "interval" : "PT2H", "startTime" : "2022-01-01T00:00:00Z" }
}
```

When there are no longer any new or updated documents in the data source, indexer execution history will report `0/0` documents processed, and no processing occurs.

For more information about setting schedules, see [Create Indexer REST API](/rest/api/searchservice/Create-Indexer) or see [How to schedule indexers for Azure AI Search](search-howto-schedule-indexers.md).

> [!NOTE]
> Some indexers that run on an older runtime architecture have a 24-hour rather than 2-hour maximum processing window. The 2-hour limit is for newer content processors that run in an [internally managed multi-tenant environment](search-indexer-securing-resources.md#indexer-execution-environment). Whenever possible, Azure AI Search tries to offload indexer and skillset processing to the multi-tenant environment. If the indexer can't be migrated, it will run in the private environment and it can run for as long as 24 hours. If you're scheduling an indexer that exhibits these characteristics, assume a 24 hour processing window.

<a name="parallel-indexing"></a>

### Run indexers in parallel

If you partition your data, you can create multiple indexer-data-source combinations that pull from each data source and write to the same search index. Because each indexer is distinct, you can run them at the same time, populating a search index more quickly than if you ran them sequentially. 

Make sure you have sufficient capacity. One search unit in your service can run one indexer at any given time. Creating multiple indexers is only useful if they can run in parallel.

The number of indexing jobs that can run simultaneously varies for text-based and skills-based indexing. For more information, see [Indexer execution](search-howto-run-reset-indexers.md#indexer-execution).

If your data source is an [Azure Blob Storage container](../storage/blobs/storage-blobs-introduction.md#containers) or [Azure Data Lake Storage Gen 2](../storage/blobs/storage-blobs-introduction.md#about-azure-data-lake-storage-gen2), enumerating a large number of blobs can take a long time (even hours) until this operation is completed. This will cause that your indexer's documents succeeded count isn't increased during that time and it may seem it's not making any progress, when it is. If you would like document processing to go faster for a large number of blobs, consider partitioning your data into multiple containers and create parallel indexers pointing to a single index.

1. Sign in to the [Azure portal](https://portal.azure.com) and check the number of search units used by your search service. Select **Settings** > **Scale** to view the number at the top of the page. The number of indexers that will run in parallel is approximately equal to the number of search units. 

1. Partition source data among multiple containers or multiple virtual folders inside the same container.

1. Create multiple [data sources](/rest/api/searchservice/create-data-source), one for each partition, paired to its own [indexer](/rest/api/searchservice/create-indexer).

1. Specify the same target search index in each indexer.

1. Schedule the indexers.

1. Review indexer status and execution history for confirmation.

There are some risks associated with parallel indexing. First, recall that indexing doesn't run in the background, increasing the likelihood that queries will be throttled or dropped. 

Second, Azure AI Search doesn't lock the index for updates. Concurrent writes are managed, invoking a retry if a particular write doesn't succeed on first attempt, but you might notice an increase in indexing failures.

Although multiple indexer-data-source sets can target the same index, be careful of indexer runs that can overwrite existing values in the index. If a second indexer-data-source targets the same documents and fields, any values from the first run will be overwritten. Field values are replaced in full; an indexer can't merge values from multiple runs into the same field.

## Index big data on Spark

If you have a big data architecture and your data is on a Spark cluster, we recommend [SynapseML for loading and indexing data](search-synapseml-cognitive-services.md). The tutorial includes steps for calling Azure AI services for AI enrichment, but you can also use the AzureSearchWriter API for text indexing.

## See also

+ [Tips for improving performance](search-performance-tips.md)
+ [Performance analysis](search-performance-analysis.md)
+ [Indexer overview](search-indexer-overview.md)
+ [Monitor indexer status](search-howto-monitor-indexers.md)


<!-- Azure AI Search supports [two basic approaches](search-what-is-data-import.md) for importing data into a search index. You can *push* your data into the index programmatically, or point an [Azure AI Search indexer](search-indexer-overview.md) at a supported data source to *pull* in the data.

As data volumes grow or processing needs change, you might find that simple indexing strategies are no longer practical. For Azure AI Search, there are several approaches for accommodating larger data sets, ranging from how you structure a data upload request, to using a source-specific indexer for scheduled and distributed workloads.

The same techniques used for long-running processes. In particular, the steps outlined in [parallel indexing](#run-indexers-in-parallel) are helpful for computationally intensive indexing, such as image analysis or natural language processing in an [AI enrichment pipeline](cognitive-search-concept-intro.md).

The following sections explain techniques for indexing large amounts of data for both push and pull approaches. You should also review [Tips for improving performance](search-performance-tips.md) for more best practices.

For C# tutorials, code samples, and alternative strategies, see:

+ [Tutorial: Optimize indexing workloads](tutorial-optimize-indexing-push-api.md)
+ [Tutorial: Index at scale using SynapseML and Apache Spark](search-synapseml-cognitive-services.md) -->
