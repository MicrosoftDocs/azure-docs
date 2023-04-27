---
title: Optimize cost for multi-region deployments in Azure Cosmos DB
description: This article explains how to manage costs of multi-region deployments in Azure Cosmos DB.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 08/26/2021
---

# Optimize multi-region cost in Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

You can add and remove regions to your Azure Cosmos DB account at any time. The throughput that you configure for various Azure Cosmos DB databases and containers is reserved in each region associated with your account. If the throughput provisioned per hour, that is the sum of RU/s configured across all the databases and containers for your Azure Cosmos DB account is `T` and the number of Azure regions associated with your database account is `N`, then the total provisioned throughput for your Azure Cosmos DB account, for a given hour is equal to `T x N RU/s`.

Provisioned throughput with single write region costs $0.008/hour per 100 RU/s and provisioned throughput with multiple writable regions costs $0.016/per hour per 100 RU/s. To learn more, see Azure Cosmos DB [Pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/).

## Costs for multiple write regions

In a multi-region writes system, the net available RUs for write operations increases `N` times where `N` is the number of write regions. Unlike single region writes, every region is now writable and supports conflict resolution. From the cost planning point of view, to perform `M` RU/s worth of writes worldwide, you will need to provision M `RUs` at a container or database level. You can then add as many regions as you would like and use them for writes to perform `M` RU worth of worldwide writes.

### Example

Consider that you have a container in West US configured for single-region writes, provisioned with throughput of 10K RU/s, storing 0.5 TB of data this month. Let’s assume you add a region, East US, with the same storage and throughput and you want the ability to write to the containers in both the regions from your app. Your new total monthly bill (assuming 730 hours in a month) will be as follows:

|**Item**|**Usage (monthly)**|**Rate**|**Monthly Cost**|
|----|----|----|----|
|Throughput bill for container in West US (single write region) |10K RU/s * 730 hours |$0.008 per 100 RU/s per hour |$584 |
|Throughput bill for container in 2 regions - West US & East US (multiple write regions) |2 * 10K RU/s * 730 hours |$0.016 per 100 RU/s per hour |$2,336 |
|Storage bill for container in West US |0.5 TB (or 512 GB) |$0.25/GB |$128 |
|Storage bill for container in 2 regions - West US & East US |2 * 0.5 TB (or 1,024 GB) |$0.25/GB |$256 |

## Improve throughput utilization on a per region-basis

If you have inefficient utilization, for example, one or more under-utilized read regions you can take steps to make the maximum use of the RUs in read regions by using change feed from the read-region or move it to another secondary if over-utilized. You will need to ensure you optimize provisioned throughput (RUs) in the write region first. Writes cost more than reads unless very large queries so maintaining even utilization can be challenging. Overall, monitor the consumed throughput in your regions and add or remove regions on demand to scale your read and write throughput, making to sure understand the impact to latency for any apps that are deployed in the same region.

## Next steps

Next you can proceed to learn more about cost optimization in Azure Cosmos DB with the following articles:

* Learn more about [Optimizing for development and testing](optimize-dev-test.md)
* Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
* Learn more about [Optimizing storage cost](optimize-cost-storage.md)
* Learn more about [Optimizing the cost of reads and writes](optimize-cost-reads-writes.md)
* Learn more about [Optimizing the cost of queries](./optimize-cost-reads-writes.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
