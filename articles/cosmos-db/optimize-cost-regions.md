---
title: Optimize cost for multi-region deployments in Azure Cosmos DB
description: This article explains how to manage costs of multi-region deployments in Azure Cosmos DB.
author: rimman
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/21/2019
ms.author: rimman
---

# Optimize multi-region cost in Azure Cosmos DB

You can add and remove regions to your Azure Cosmos account at any time. The throughput that you configure for various Azure Cosmos databases and containers is reserved in each region associated with your account. If the throughput provisioned per hour, that is the sum of RU/s configured across all the databases and containers for your Azure Cosmos account is `T` and the number of Azure regions associated with your database account is `N`, then the total provisioned throughput for your Cosmos account, for a given hour is equal to:

1. `T x N RU/s` if your Azure Cosmos account is configured with a single write region. 

1. `T x (N+1) RU/s` if your Azure Cosmos account is configured with all regions capable of processing writes. 

Provisioned throughput with single write region costs $0.008/hour per 100 RU/s and provisioned throughput with multiple writable regions costs $0.016/per hour per 100 RU/s. To learn more, see Azure Cosmos DB [Pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/).

## Costs for multiple write regions

In a multi-master system, the net available RUs for write operations increases `N` times where `N` is the number of write regions. Unlike single region writes, every region is now writable and should support conflict resolution. The amount of workload for writers has increased. From the cost planning point of view, to perform `M` RU/s worth of writes worldwide, you will need to provision M `RUs` at a container or database level. You can then add as many regions as you would like and use them for writes to perform `M` RU worth of worldwide writes. 

### Example

Consider you have a container in West US provisioned with throughput 10K RU/s and stores 1 TB of data this month. Let’s assume you add three regions - East US, North Europe, and East Asia, each with the same storage and throughput and you want the ability to write to the containers in all four regions from your globally distributed app. Your total monthly bill(assuming 31 days) in a month is as follows:

|**Item**|**Usage (monthly)**|**Rate**|**Monthly Cost**|
|----|----|----|----|
|Throughput bill for container in West US (multiple write regions) |10K RU/s * 24 * 31 |$0.016 per 100 RU/s per hour |$1,190.40 |
|Throughput bill for 3 additional regions - East US, North Europe, and East Asia (multiple write regions) |(3 + 1) * 10K RU/s * 24 * 31 |$0.016 per 100 RU/s per hour |$4,761.60 |
|Storage bill for container in West US |100 GB |$0.25/GB |$25 |
|Storage bill for 3 additional regions - East US, North Europe, and East Asia |3 * 1 TB |$0.25/GB |$75 |
|**Total**|||**$6,052** |

## Improve throughput utilization on a per region-basis

If you have inefficient utilization, for example, one or more under-utilized or over-utilized regions, you can take the following steps to improve throughput utilization:  

1. Make sure you optimize provisioned throughput (RUs) in the write region first, and then make the maximum use of the RUs in read regions by using change feed from the read-region etc. 

2. Multiple write regions reads and writes can be scaled across all regions associated with Azure Cosmos account. 

3. Monitor the activity in your regions and you could add and remove regions on demand to scale your read and write throughput.

## Next steps

Next you can proceed to learn more about cost optimization in Azure Cosmos DB with the following articles:

* Learn more about [Optimizing for development and testing](optimize-dev-test.md)
* Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
* Learn more about [Optimizing storage cost](optimize-cost-storage.md)
* Learn more about [Optimizing the cost of reads and writes](optimize-cost-reads-writes.md)
* Learn more about [Optimizing the cost of queries](optimize-cost-queries.md)

