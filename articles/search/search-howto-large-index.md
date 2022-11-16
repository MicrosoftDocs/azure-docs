---
title: Index large data set using built-in indexers
titleSuffix: Azure Cognitive Search
description: Strategies for large data indexing or computationally intensive indexing through batch mode, resourcing, and techniques for scheduled, parallel, and distributed indexing.

manager: nitinme
author: dereklegenzoff
ms.author: delegenz
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/17/2022
---

# Index large data sets in Azure Cognitive Search

Azure Cognitive Search supports [two basic approaches](search-what-is-data-import.md) for importing data into a search index: *pushing* your data into the index programmatically, or pointing an [Azure Cognitive Search indexer](search-indexer-overview.md) at a supported data source to *pull* in the data.

As data volumes grow or processing needs change, you might find that simple or default indexing strategies are no longer practical. For Azure Cognitive Search, there are several approaches for accommodating larger data sets, ranging from how you structure a data upload request, to using a source-specific indexer for scheduled and distributed workloads.

The same techniques also apply to long-running processes. In particular, the steps outlined in [parallel indexing](#run-indexers-in-parallel) are helpful for computationally intensive indexing, such as image analysis or natural language processing in an [AI enrichment pipeline](cognitive-search-concept-intro.md).

The following sections explain techniques for indexing large amounts of data using both the push API and indexers. You should also review [Tips for improving performance](search-performance-tips.md) for more best practices.

For a C# tutorial and code sample, see [Tutorial: Optimize indexing speeds](tutorial-optimize-indexing-push-api.md). 

## Indexing large datasets with the "push" API

When pushing large data volumes into an index using the [Add Documents REST API](/rest/api/searchservice/addupdate-or-delete-documents) or the [IndexDocuments method (Azure SDK for .NET)](/dotnet/api/azure.search.documents.searchclient.indexdocuments), batching documents and managing threads are two techniques that improve indexing speed.

### Batch multiple documents per request

One of the simplest mechanisms for indexing a larger data set is to submit multiple documents or records in a single request. As long as the entire payload is under 16 MB, a request can handle up to 1000 documents in a bulk upload operation. These limits apply whether you're using the [Add Documents REST API](/rest/api/searchservice/addupdate-or-delete-documents) or the [IndexDocuments method](/dotnet/api/azure.search.documents.searchclient.indexdocuments) in the .NET SDK. For either API, you would package 1000 documents in the body of each request.

Using batches to index documents will significantly improve indexing performance. Determining the optimal batch size for your data is a key component of optimizing indexing speeds. The two primary factors influencing the optimal batch size are:

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

## Indexing large datasets with indexers and the "pull" APIs

[Indexers](search-indexer-overview.md) have built-in capabilities that are particularly useful for accommodating larger data sets:

+ Indexer schedules allow you to parcel out indexing at regular intervals so that you can spread it out over time.

+ Scheduled indexing can resume at the last known stopping point. If a data source isn't fully scanned within a 24-hour window, the indexer will resume indexing on day two at wherever it left off.

+ Partitioning data into smaller individual data sources enables parallel processing. You can break up source data into smaller components, such as into multiple containers in Azure Blob Storage, create a [data source](/rest/api/searchservice/create-data-source) for each partition, and then run multiple indexers in parallel. 

### Check indexer batch size

As with the push API, indexers allow you to configure the number of items per batch. For indexers based on the [Create Indexer REST API](/rest/api/searchservice/Create-Indexer), you can set the `batchSize` argument to customize this setting to better match the characteristics of your data. 

Default batch sizes are data source specific. Azure SQL Database and Azure Cosmos DB have a default batch size of 1000. In contrast, Azure Blob indexing sets batch size at 10 documents in recognition of the larger average document size. 

### Schedule indexers for long-running processes

Indexer scheduling is an important mechanism for processing large data sets and for accommodating slow-running processes like image analysis in an enrichment pipeline. Indexer processing operates within a 24-hour window. If processing fails to finish within 24 hours, the behaviors of indexer scheduling can work to your advantage. 

By design, scheduled indexing starts at specific intervals, with a job typically completing before resuming at the next scheduled interval. However, if processing does not complete within the interval, the indexer stops (because it ran out of time). At the next interval, processing resumes where it last left off, with the system keeping track of where that occurs. 

In practical terms, for index loads spanning several days, you can put the indexer on a 24-hour schedule. When indexing resumes for the next 24-hour cycle, it restarts at the last known good document. In this way, an indexer can work its way through a document backlog over a series of days until all unprocessed documents are processed. For more information about setting schedules, see [Create Indexer REST API](/rest/api/searchservice/Create-Indexer) or see [How to schedule indexers for Azure Cognitive Search](search-howto-schedule-indexers.md).

<a name="parallel-indexing"></a>

### Run indexers in parallel

If you partition your data, you can create multiple indexer-data-source combinations that pull from each data source and write to the same search index. Because each indexer is distinct, you can run them at the same time, populating a search index more quickly than if you ran them sequentially. 

Make sure you have sufficient capacity. One search unit in your service can run one indexer at any given time. Creating multiple indexers is only useful if they can run in parallel.

The number of indexing jobs that can run simultaneously varies for text-based and skills-based indexing. For more information, see [Indexer execution](search-howto-run-reset-indexers.md#indexer-execution).

If your data source is an [Azure Blob Storage container](../storage/blobs/storage-blobs-introduction.md#containers) or [Azure Data Lake Storage Gen 2](../storage/blobs/storage-blobs-introduction.md#about-azure-data-lake-storage-gen2), enumerating a big number of blobs can take a long time (even hours) until this operation is completed. This will cause that your indexer's documents succeded count is not increased during that time and it may seem it's not making any progress, when it is. If you would like document processing to go faster for a big number of blobs, consider partitioning your data into multiple containers and create parallel indexers pointing to a single index.

1. [Sign in to Azure portal](https://portal.azure.com) and check the number of search units used by your search service. Select **Settings** > **Scale** to view the number at the top of the page. The number of indexers that will run in parallel is approximately equal to the number of search units. 

1. Partition source data among multiple containers or multiple virtual folders inside the same container.

1. Create multiple [data sources](/rest/api/searchservice/create-data-source), one for each partition, paired to its own [indexer](/rest/api/searchservice/create-indexer).

1. Specify the same target search index in each indexer.

1. Schedule the indexers. 

1. Review indexer status and execution history for confirmation.

There are some risks associated with parallel indexing. First, recall that indexing does not run in the background, increasing the likelihood that queries will be throttled or dropped. 

Second, Azure Cognitive Search does not lock the index for updates. Concurrent writes are managed, invoking a retry if a particular write does not succeed on first attempt, but you might notice an increase in indexing failures.

Although multiple indexer-data-source sets can target the same index, be careful of indexer runs that can overwrite existing values in the index. If a second indexer-data-source targets the same documents and fields, any values from the first run will be overwritten. Field values are replaced in full; an indexer can't merge values from multiple runs into the same field.

## See also

+ [Tips for improving performance](search-performance-tips.md)
+ [Performance analysis](search-performance-analysis.md)
+ [Indexer overview](search-indexer-overview.md)
+ [Monitor indexer status](search-howto-monitor-indexers.md)