---
title: Optimize storage cost in Azure Cosmos DB
description: This article explains how to manage storage costs for the data stored in Azure Cosmos DB
author: rimman
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/21/2019
ms.author: rimman
---

# Optimize storage cost in Azure Cosmos DB

Azure Cosmos DB offers unlimited storage and throughput. Unlike throughput, which you have to provision/configure on your Azure Cosmos containers or databases, the storage is billed based on a consumption basis. You are billed only for the logical storage you consume and you don’t have to reserve any storage in advance. Storage automatically scales up and down based on the data that you add or remove to an Azure Cosmos DB container.

## Storage cost

Storage is billed with the unit of GBs. Local SSD-backed storage is used by your data and indexing. The total storage used is equal to the storage required by the data and indexes used across all the regions where you are using Azure Cosmos DB. If you globally replicate an Azure Cosmos account across three regions, you will pay for the total storage cost in each of those three regions. To estimate your storage requirement, see [capacity planner](https://www.documentdb.com/capacityplanner) tool. The cost for storage in Azure Cosmos DB is $0.25 GB/month, see [Pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) for latest updates. You can set up alerts to determine storage used by your Azure Cosmos container, to monitor your storage, see [Monitor Azure Cosmos DB](monitor-accounts.md)) article.

## Optimize cost with item size

Azure Cosmos DB expects the item size to be 2 MB or less for optimal performance and cost benefits. If you need any item to store larger than 2 MB of data, consider redesigning the item schema. In the rare event that you cannot redesign the schema, you can split the item into subitems and link them logically with a common identifier(ID). All the Azure Cosmos DB features work consistently by anchoring to that logical identifier.

## Optimize cost with indexing

By default, the data is automatically indexed, which can increase the total storage consumed. However, you can apply custom index policies to reduce this overhead. Automatic indexing that has not been tuned through policy is about 10-20% of the item size. By removing or customizing index policies, you don't pay extra cost for writes and don't require additional throughput capacity. See [Indexing in Azure Cosmos DB](indexing-policies.md) to configure custom indexing policies. If you have worked with relational databases before, you may think that “index everything” means doubling of storage or higher. However, in Azure Cosmos DB, in the median case, it’s much lower. In Azure Cosmos DB, the storage overhead of index is typically low (10-20%) even with automatic indexing, because it is designed for a low storage footprint. By managing the indexing policy, you can control the tradeoff of index footprint and query performance in a more fine-grained manner.

## Optimize cost with time to live and change feed

Once you no longer need the data you can gracefully delete it from your Azure Cosmos account by  using [time to live](time-to-live.md), [change feed](change-feed.md) or you can migrate the old data to another data store such as Azure blob storage or Azure data warehouse. With time to live or TTL, Azure Cosmos DB provides the ability to delete items automatically from a container after a certain time period. By default, you can set time to live at the container level and override the value on a per-item basis. After you set the TTL at a container or at an item level, Azure Cosmos DB will automatically remove these items after the time period since the time they were last modified. By using change feed, you can migrate data to either another container in Azure Cosmos DB or to an external data store. The migration takes zero down time and when you are done migrating, you can either delete or configure time to live to delete the source Azure Cosmos container.

## Optimize cost with rich media data types 

If you want to store rich media types, for example, videos, images, etc., you have a number of options in Azure Cosmos DB. One option is to store these rich media types as Azure Cosmos items. There is a 2-MB limit per item, and you can avoid this limit by chaining the data item into multiple subitems. Or you can store them in Azure Blob storage and use the metadata to reference them from your Azure Cosmos items. There are a number of pros and cons with this approach. The first approach gets you the best performance in terms of latency, throughput SLAs plus turnkey global distribution capabilities for the rich media data types in addition to your regular Azure Cosmos items. However the support is available at a higher price. By storing media in Azure Blob storage, you could lower your overall costs. If latency is critical, you could use premium storage for rich media files that are referenced from Azure Cosmos items. This integrates natively with CDN to serve images from the edge server at lower cost to circumvent geo-restriction. The down side with this scenario is that you have to deal with two services - Azure Cosmos DB and Azure Blob storage, which may increase operational costs. 

## Check storage consumed

To check the storage consumption of an Azure Cosmos container, you can run a HEAD or GET request on the container, and inspect the `x-ms-request-quota` and the `x-ms-request-usage` headers. Alternatively, when working with the .NET SDK, you can use the [DocumentSizeQuota](https://docs.microsoft.com/previous-versions/azure/dn850325(v%3Dazure.100)), and [DocumentSizeUsage](https://msdn.microsoft.com/library/azure/dn850324.aspx) properties to get the storage consumed.

## Using SDK

```csharp
// Measure the item size usage (which includes the index size)
ResourceResponse<DocumentCollection> collectionInfo = await client.ReadDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri("db", "coll"));   

Console.WriteLine("Item size quota: {0}, usage: {1}", collectionInfo.DocumentQuota, collectionInfo.DocumentUsage);
```

## Next steps

Next you can proceed to learn more about cost optimization in Azure Cosmos DB with the following articles:

* Learn more about [Optimizing for development and testing](optimize-dev-test.md)
* Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
* Learn more about [Optimizing the cost of reads and writes](optimize-cost-reads-writes.md)
* Learn more about [Optimizing the cost of queries](optimize-cost-queries.md)
* Learn more about [Optimizing the cost of multi-region Azure Cosmos accounts](optimize-cost-regions.md)

