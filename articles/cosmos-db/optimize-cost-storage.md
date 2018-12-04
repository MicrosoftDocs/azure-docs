---
title: Optimizing storage cost of Azure Cosmos DB
description: This article explains how to manage storage costs of Azure Cosmos DB
author: rimman

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: rimman
---

# Optimizing storage cost

Azure Cosmos DB offers limitless storage and throughput. Unlike throughput, which you have to provision/configure on your Cosmos containers or databases, the storage is billed based on a consumption basis, that is, you are billed only for the logical storage you actually consume and you don’t have to reserve any storage in advance. Storage automatically will scale up and down based on the data that you add or remove to a Cosmos DB container.

## Storage cost

Storage is billed by GBs of local SSD-backed storage used by your data and indexing. The total storage used is the total storage of data and indexes used across all selected regions you are using for Cosmos DB. If you are globally replicating a Cosmos account into three regions, you will pay for that total storage cost in each of those three regions. Additional estimating assistance on storage can be found in our [capacity planner](https://www.documentdb.com/capacityplanner). The cost for storage in Azure Cosmos DB is $0.25 GB/month (see [Pricing Page](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/)). You can set up alerts for storage used by a Cosmos container to monitor your storage growth (see [Monitor Azure Cosmos DB](monitor-accounts.md)).

## Item size

Cosmos DB expects the item size to be 2 MB or less for optimal performance and cost benefits. If you need any Cosmos item to be larger than 2 MB, consider redesigning the item schema. In the rare event that you cannot, you can chunk the item into subitems and link them logically with a common ID. All the features can be easily made to work consistently by anchoring to that logical identifier.

## Indexing

All data is automatically indexed, by default, which can increase the total consumed storage, but custom index policies can be applied to reduce this overhead. Automatic indexing that has not been tuned through policy is about 10-20% of the item size. By removing or customizing index policies, you will not incur extra cost (for writes) and will not require additional throughput capacity to be provisioned which could contribute to additional cost. See [Indexing in Cosmos DB](indexing-policies.md). If you are coming from a relational background, you may assume that “index everything” means doubling of storage or higher – in Cosmos DB, in the median case, it’s much lower. In Cosmos DB, the storage overhead of index is typically low (10-20%) even with automatic indexing, because it is designed for a low storage footprint. By managing the indexing policy, you can control the tradeoff of index footprint and query performance in a more fine-grained manner.

## Time to live and change feed

Once you no longer need the data you can gracefully “age it out” of Cosmos DB by either using [time to live](time-to-live.md) or Cosmos DB [change feed](change-feed.md) to migrate the older data to another store (for example, Azure blob storage or a data warehouse). With time to live or TTL, Cosmos DB provides the ability to delete items automatically from a container after a certain time period. By default, you can set time to live at the container level and override the value on a per-item basis. After you set the TTL at a container or at an item level, Cosmos DB will automatically remove these items after the time period, since the time they were last modified. Using change feed, you can migrate data (to either another container in Cosmos DB or to an external store). The result is zero down time and when you are done migrating, you can either delete or TTL the source Cosmos container.

## Rich media data types 

If you want to store rich media types, for example, videos, images, etc., you have a number of options in Cosmos DB. One option is to store these rich media types as Cosmos items (there will be a 2 MB limit per item, which you could avoid by chaining the data item into multiple subitems). Or you can store them in Azure Blob storage storing all the metadata and referencing them from your Cosmos items. There are a number of pros and cons to consider with this approach. The first approach gets you the best performance (latency, throughput SLAs) plus turnkey global distribution capabilities for your rich media data types in addition to your regular Cosmos items, but it will come at a higher price point. By storing media in Azure Blob storage, you could lower your overall costs. If latency is critical, you could use premium storage for rich media files that are referenceable from Cosmos items. This integrates natively with CDN to serve images from the edge server at lower cost to circumvent geo-restriction. The con in this scenario is that you have to deal with two services - Cosmos DB and Azure Blob storage, which may increase operational costs. 

## Checking storage usage 

To check the storage usage of a Cosmos container, you can run a HEAD or GET request against the Cosmos container, and inspect the x-ms-request-quota and the x-ms-request-usage headers. Alternatively, you can use the SDK, the [DocumentSizeQuota, and [DocumentSizeUsage](http://msdn.microsoft.com/library/azure/dn850324.aspx) properties in [ResourceResponse<T>](http://msdn.microsoft.com/library/dn799209.aspx) contain these corresponding values.

## Using SDK

```csharp
// Measure the item size usage (which includes the index size)

ResourceResponse<DocumentCollection> collectionInfo = await client.ReadDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri("db", "coll"));   

Console.WriteLine("Item size quota: {0}, usage: {1}", collectionInfo.DocumentQuota, collectionInfo.DocumentUsage);
```

## Next steps

* Learn more about [How Cosmos pricing works](how-pricing-works.md)
* Learn more about [Request Units](request-units.md) in Azure Cosmos DB
* Learn to [provision throughput on a database or a container](set-throughput.md)
* Learn more about [logical partitions](partition-data.md)
* Learn [how to provision throughput on a Cosmos container](how-to-provision-container-throughput.md)
* Learn [how to provision throughput on a Cosmos database](how-to-provision-database-throughput.md)
* Learn more about [How Cosmos DB pricing model is cost-effective for customers](total-cost-of-ownership.md)
* Learn more about [Optimizing for development and testing](optimize-dev-test.md)
* Learn more about [Understanding your Cosmos DB bill](understand-your-bill.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
* Learn more about [Optimizing the cost of reads and writes](optimize-cost-reads-writes.md)
* Learn more about [Optimizing the cost of queries](optimize-cost-queries)
* Learn more about [Optimizing the cost of multi-region Cosmos accounts](optimize-cost-regions.md)
* Learn more about [Cosmos DB reserved capacity](cosmos-db-reserved-capacity.md)
* Learn more about [Cosmos DB pricing page](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/)
* Learn more about [Cosmos DB Emulator](local-emulator.md)
* Learn more about [Azure Free account](https://azure.microsoft.com/free/)
* Learn more about [Try Cosmos DB for free](https://azure.microsoft.com/en-us/try/cosmosdb/)
