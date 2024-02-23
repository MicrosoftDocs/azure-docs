---
title: Optimize cost for multi-region deployments in Azure Cosmos DB
description: This article explains how to manage costs of multi-region deployments in Azure Cosmos DB.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/22/2024
---

# Optimize multi-region cost in Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

You can add and remove regions to your Azure Cosmos DB account at any time. The throughput that you configure for various Azure Cosmos DB databases and containers is reserved in each region associated with your account. If the throughput provisioned per hour that is the sum of RU/s configured across all the databases and containers for your Azure Cosmos DB account is `T` and the number of Azure regions associated with your database account is `N`, then the total provisioned throughput for your Azure Cosmos DB account, for a given hour is equal to `T x N RU/s`.

Provisioned throughput with single write region costs $0.008/hour per 100 RU/s and provisioned throughput with multiple writable regions costs $0.016/per hour per 100 RU/s. To learn more, see Azure Cosmos DB [Pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/).

## Costs for multiple write regions

In a multi-region writes system, the net available RUs for write operations increases `N` times where `N` is the number of write regions. Unlike single region writes, every region is now writable and supports conflict resolution. From the cost planning point of view, to perform `M` RU/s worth of writes worldwide, you need to configure `M` RUs at a container or database level. You can then add as many regions as you would like and use them for writes to perform `M` RU worth of worldwide writes.

### Example

Consider that you have a container in West US configured for single-region writes, provisioned with throughput of 10K RU/s, storing 0.5 TB of data this month. Let’s assume you add a region, East US, with the same storage and throughput and you want the ability to write to the containers in both the regions from your app. 

This example details your new total monthly consumption (assuming 730 hours in a month):

|**Item**|**Usage (monthly)**|
|----|----|----|
|Throughput bill for container in West US (single write region) |10K RU/s * 730 hours |
|Throughput bill for container in two regions - West US & East US (multiple write regions) |2 * 10K RU/s * 730 hours |
|Storage bill for container in West US |0.5 TB (or 512 GB) |
|Storage bill for container in two regions - West US & East US |2 * 0.5 TB (or 1,024 GB) |

## Improve throughput utilization on a per region-basis

If you have inefficient utilization, you can take steps to make the maximum use of the RUs in read regions by using change feed from the read-region or move it to another secondary if over-utilized. For example, one or more under-utilized read regions is considered inefficient. You need to ensure you optimize provisioned throughput (RUs) in the write region first. Writes cost more than reads unless large queries so maintaining even utilization can be challenging. Overall, monitor the consumed throughput in your regions and add or remove regions on demand to scale your read and write throughput. Make sure to understand the effect to latency for any apps that are deployed in the same region.

## Related content

- Learn more about [Optimizing for development and testing](optimize-dev-test.md)
- Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
- Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
- Learn more about [Optimizing storage cost](optimize-cost-storage.md)
- Learn more about [Optimizing the cost of reads and writes](optimize-cost-reads-writes.md)
- Learn more about [Optimizing the cost of queries](./optimize-cost-reads-writes.md)
