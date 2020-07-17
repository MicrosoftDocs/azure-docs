---
title: Index large data set using built-in indexers
titleSuffix: Azure Cognitive Search
description: Strategies for large data indexing or computationally intensive indexing through batch mode, resourcing, and techniques for scheduled, parallel, and distributed indexing.

manager: liamca
author: dereklegenzoff
ms.author: delegenz
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/05/2020
---

# How to index large data sets in Azure Cognitive Search

Azure Cognitive Search supports [two basic approaches](search-what-is-data-import.md) for importing data into a search index: *pushing* your data into the index programmatically, or pointing an [Azure Cognitive Search indexer](search-indexer-overview.md) at a supported data source to *pull* in the data.

As data volumes grow or processing needs change, you might find that simple or default indexing strategies are no longer practical. For Azure Cognitive Search, there are several approaches for accommodating larger data sets, ranging from how you structure a data upload request, to using a source-specific indexer for scheduled and distributed workloads.

The same techniques also apply to long-running processes. In particular, the steps outlined in [parallel indexing](#parallel-indexing) are helpful for computationally intensive indexing, such as image analysis or natural language processing in an [AI enrichment pipeline](cognitive-search-concept-intro.md).

The following sections explore techniques for indexing large amounts of data using both the push API and indexers.

## Push API

When pushing data into an index, there's several key considerations that impact indexing speeds for the push API. These factors are outlined in the section below. 

In addition to the information in this article, you can also take advantage of the code samples in the [optimizing indexing speeds tutorial](tutorial-optimize-indexing-push-api.md) to learn more.

### Service tier and number of partitions/replicas

Adding partitions or increasing the tier of your search service will both increase indexing speeds.

Adding additional replicas may also increase indexing speeds but it isn't guaranteed. On the other hand, additional replicas will increase the query volume your search service can handle. Replicas are also a key component for getting an [SLA](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

Before adding partition/replicas or upgrading to a higher tier, consider the monetary cost and allocation time. Adding partitions can significantly increase indexing speed but adding/removing them can take anywhere from 15 minutes to several hours. For more information, see the documentation on [adjusting capacity](search-capacity-planning.md).

### Index Schema

The schema of your index plays an important role in indexing data. Adding fields and adding additional properties to those fields (such as *searchable*, *facetable*, or *filterable*) both reduce indexing speeds.

In general, we recommend only adding additional properties to fields if you intend to use them.

> [!NOTE]
> To keep document size down, avoid adding non-queryable data to an index. Images and other binary data are not directly searchable and shouldn't be stored in the index. To integrate non-queryable data into search results, you should define a non-searchable field that stores a URL reference to the resource.

### Batch Size

One of the simplest mechanisms for indexing a larger data set is to submit multiple documents or records in a single request. As long as the entire payload is under 16 MB, a request can handle up to 1000 documents in a bulk upload operation. These limits apply whether you're using the [Add Documents REST API](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) or the [Index method](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.documentsoperationsextensions.index?view=azure-dotnet) in the .NET SDK. For either API, you would package 1000 documents in the body of each request.

Using batches to index documents will significantly improve indexing performance. Determining the optimal batch size for your data is a key component of optimizing indexing speeds. The two primary factors influencing the optimal batch size are:
+ The schema of your index
+ The size of your data

Because the optimal batch size depends on your index and your data, the best approach is to test different batch sizes to determine what results in the fastest indexing speeds for your scenario. This [tutorial](tutorial-optimize-indexing-push-api.md) provides sample code for testing batch sizes using the .NET SDK. 

### Number of threads/workers

To take full advantage of Azure Cognitive Search's indexing speeds, you'll likely need to use multiple threads to send batch indexing requests concurrently to the service.  

The optimal number of threads is determined by:

+ The tier of your search service
+ The number of partitions
+ The size of your batches
+ The schema of your index

You can modify this sample and test with different thread counts to determine the optimal thread count for your scenario. However, as long as you have several threads running concurrently, you should be able to take advantage of most of the efficiency gains. 

> [!NOTE]
> As you increase the tier of your search service or increase the partitions, you should also increase the number of concurrent threads.

As you ramp up the requests hitting the search service, you may encounter [HTTP status codes](https://docs.microsoft.com/rest/api/searchservice/http-status-codes) indicating the request didn't fully succeed. During indexing, two common HTTP status codes are:

+ **503 Service Unavailable** - This error means that the system is under heavy load and your request can't be processed at this time.
+ **207 Multi-Status** - This error means that some documents succeeded, but at least one failed.

### Retry strategy 

If a failure happens, requests should be retried using an [exponential backoff retry strategy](https://docs.microsoft.com/dotnet/architecture/microservices/implement-resilient-applications/implement-retries-exponential-backoff).

Azure Cognitive Search's .NET SDK automatically retries 503s and other failed requests but you'll need to implement your own logic to retry 207s. Open-source tools such as [Polly](https://github.com/App-vNext/Polly) can also be used to implement a retry strategy.

### Network data transfer speeds

Network data transfer speeds can be a limiting factor when indexing data. Indexing data from within your Azure environment is an easy way to speed up indexing.

## Indexers

[Indexers](search-indexer-overview.md) are used to crawl supported Azure data sources for searchable content. While not specifically intended for large-scale indexing, several indexer capabilities are particularly useful for accommodating larger data sets:

+ Schedulers allow you to parcel out indexing at regular intervals so that you can spread it out over time.
+ Scheduled indexing can resume at the last known stopping point. If a data source is not fully crawled within a 24-hour window, the indexer will resume indexing on day two at wherever it left off.
+ Partitioning data into smaller individual data sources enables parallel processing. You can break up source data into smaller components, such as into multiple containers in Azure Blob storage, and then create corresponding, multiple [data source objects](https://docs.microsoft.com/rest/api/searchservice/create-data-source) in Azure Cognitive Search that can be indexed in parallel.

> [!NOTE]
> Indexers are data-source-specific, so using an indexer approach is only viable for selected data sources on Azure: [SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md), [Blob storage](search-howto-indexing-azure-blob-storage.md), [Table storage](search-howto-indexing-azure-tables.md), [Cosmos DB](search-howto-index-cosmosdb.md).

### Batch Size

As with the push API, indexers allow you to configure the number of items per batch. For indexers based on the [Create Indexer REST API](https://docs.microsoft.com/rest/api/searchservice/Create-Indexer), you can set the `batchSize` argument to customize this setting to better match the characteristics of your data. 

Default batch sizes are data source specific. Azure SQL Database and Azure Cosmos DB have a default batch size of 1000. In contrast, Azure Blob indexing sets batch size at 10 documents in recognition of the larger average document size. 

### Scheduled indexing

Indexer scheduling is an important mechanism for processing large data sets, as well as slow-running processes like image analysis in a cognitive search pipeline. Indexer processing operates within a 24-hour window. If processing fails to finish within 24 hours, the behaviors of indexer scheduling can work to your advantage. 

By design, scheduled indexing starts at specific intervals, with a job typically completing before resuming at the next scheduled interval. However, if processing does not complete within the interval, the indexer stops (because it ran out of time). At the next interval, processing resumes where it last left off, with the system keeping track of where that occurs. 

In practical terms, for index loads spanning several days, you can put the indexer on a 24-hour schedule. When indexing resumes for the next 24-hour cycle, it restarts at the last known good document. In this way, an indexer can work its way through a document backlog over a series of days until all unprocessed documents are processed. For more information about this approach, see [Indexing large datasets in Azure Blob storage](search-howto-indexing-azure-blob-storage.md#indexing-large-datasets). For more information about setting schedules in general, see [Create Indexer REST API](https://docs.microsoft.com/rest/api/searchservice/Create-Indexer) or see [How to schedule indexers for Azure Cognitive Search](search-howto-schedule-indexers.md).

<a name="parallel-indexing"></a>

### Parallel indexing

A parallel indexing strategy is based on indexing multiple data sources in unison, where each data source definition specifies a subset of the data. 

For non-routine, computationally intensive indexing requirements - such as OCR on scanned documents in a cognitive search pipeline, image analysis, or natural language processing - a parallel indexing strategy is often the right approach for completing a long-running process in the shortest time. If you can eliminate or reduce query requests, parallel indexing on a service that is not simultaneously handling queries is your best strategy option for working through a large body of slow-processing content. 

Parallel processing has these elements:

+ Subdivide source data among multiple containers or multiple virtual folders inside the same container. 
+ Map each mini data set to its own [data source](https://docs.microsoft.com/rest/api/searchservice/create-data-source), paired to its own [indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer).
+ For cognitive search, reference the same [skillset](https://docs.microsoft.com/rest/api/searchservice/create-skillset) in each indexer definition.
+ Write into the same target search index. 
+ Schedule all indexers to run at the same time.

> [!NOTE]
> In Azure Cognitive Search, you cannot assign individual replicas or partitions to indexing or query processing. The system determines how resources are used. To understand the impact on query performance, you might try parallel indexing in a test environment before rolling it into production.  

### How to configure parallel indexing

For indexers, processing capacity is loosely based on one indexer subsystem for each service unit (SU) used by your search service. Multiple concurrent indexers are possible on Azure Cognitive Search services provisioned on Basic or Standard tiers having at least two replicas. 

1. In the [Azure portal](https://portal.azure.com), on your search service dashboard **Overview** page, check the **Pricing tier** to confirm it can accommodate parallel indexing. Both Basic and Standard tiers offer multiple replicas.

2. You can run as many indexers in parallel as the number of search units in your service. In **Settings** > **Scale**, [increase replicas](search-capacity-planning.md) or partitions for parallel processing: one additional replica or partition for each indexer workload. Leave a sufficient number for existing query volume. Sacrificing query workloads for indexing is not a good tradeoff.

3. Distribute data into multiple containers at a level that Azure Cognitive Search indexers can reach. This could be multiple tables in Azure SQL Database, multiple containers in Azure Blob storage, or multiple collections. Define one data source object for each table or container.

4. Create and schedule multiple indexers to run in parallel:

   + Assume a service with six replicas. Configure six indexers, each one mapped to a data source containing one-sixth of the data set for a 6-way split of the entire data set. 

   + Point each indexer to the same index. For cognitive search workloads, point each indexer to the same skillset.

   + Within each indexer definition, schedule the same run-time execution pattern. For example, `"schedule" : { "interval" : "PT8H", "startTime" : "2018-05-15T00:00:00Z" }` creates a schedule on 2018-05-15 on all indexers, running at eight-hour intervals.

At the scheduled time, all indexers begin execution, loading data, applying enrichments (if you configured a cognitive search pipeline), and writing to the index. Azure Cognitive Search does not lock the index for updates. Concurrent writes are managed, with retry if a particular write does not succeed on first attempt.

> [!Note]
> When increasing replicas, consider increasing the partition count if index size is projected to increase significantly. Partitions store slices of indexed content; the more partitions you have, the smaller the slice each one has to store.

## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Indexing in the portal](search-import-data-portal.md)
+ [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md)
+ [Azure Blob Storage indexer](search-howto-indexing-azure-blob-storage.md)
+ [Azure Table Storage indexer](search-howto-indexing-azure-tables.md)
+ [Security in Azure Cognitive Search](search-security-overview.md)
