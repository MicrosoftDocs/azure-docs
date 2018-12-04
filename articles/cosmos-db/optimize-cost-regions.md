---
title: Optimizing cost for multi-region deployments in Azure Cosmos DB
description: This article explains how to manage costs of multi-region deployments in Azure Cosmos DB.
author: rimman

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: rimman
---

# Optimizing multi-region cost

You can add and remove Azure regions anywhere in the world to your Cosmos account at any time. The throughput that you have configured for various Cosmos databases and containers will be reserved in each of the Azure regions associated with your Cosmos account. If the provisioned throughput (that is, the sum of RU/sec configured across all the databases and containers) for your Cosmos account (provisioned per hour) is T and the number of Azure regions associated with your database account is N, then the total provisioned throughput for a given hour, for your Cosmos account, (a) configured with a single write region is equal to T x N RU/s, and (b) configured with all regions capable of processing writes is equal to T x (N+1) RU/s, respectively. Provisioned throughput (single write region) costs $0.008/hour per 100 RU/s and provisioned throughput with multiple writable regions (multi-master config) costs $0.016/per hour per 100 RU/s. To learn more, see Cosmos DB [Pricing Page](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/).

## Multiple write regions costs

In a multi-master system, net available RUs for writes increase N times. N is the number of write regions. Unlike a single region writes Cosmos account (single master), every region is now writable and also now needs to perform conflict resolution. The amount of work done as part of writers has increased. From the cost planning point of view, our recommendation is as follows: to perform M RU worth of writes worldwide, you will need to provision M RUs at a container or database level. You can then add as many regions as you would like and use them for writes to perform M RU worth of worldwide writes. 

## Multiple write regions cost example

Let’s assume you have a container in West US provisioned with throughput 10K RU/s and store 1 TB of data this month. Let’s assume you add three regions - East US, North Europe, and East Asia, each with the same storage and throughput and you want the ability to write to the containers in all four regions from your globally distributed app. Your total monthly bill will be (assuming 31 days in a month):

|Item|Usage (monthly)|Rate|Monthly Cost|
|----|----|----|----|
|Throughput bill for container in West US (multiple write regions) |10K RU/s * 24 * 31 |$0.016 per 100 RU/s per hour |$1,190.40 |
|Throughput bill for 3 additional regions - East US, North Europe, and East Asia (multiple write regions) |(3 + 1) * 10K RU/s * 24 * 31 |$0.016 per 100 RU/s per hour |$4,761.60 |
|Storage bill for container in West US |100 GB |$0.25/GB |$25 |
|Storage bill for 3 additional regions - East US, North Europe, and East Asia |3 * 1 TB |$0.25/GB |$75 |
|**Total**|||**$6,052** |

## Improving throughput utilization on a per region-basis

If you have inefficient utilization (one or more under- or over-utilized regions), you can take the following steps to improve throughput utilization:  

1. Make sure you optimize provisioned throughput (RUs) in the write region first, and thereafter, make the maximum use of the RUs in read regions by using change feed from the read-region etc. 

2. With multiple write regions (that is, multi-master support) reads and writes can be scaled across all regions associated with Cosmos account. 

3. Monitor the activity in your regions and you could add and remove regions on demand to scale your read and write throughput.

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
* Learn more about [Optimizing storage cost](optimize-cost-storage.md)
* Learn more about [Optimizing the cost of reads and writes](optimize-cost-reads-writes.md)
* Learn more about [Optimizing the cost of queries](optimize-cost-queries)
* Learn more about [Cosmos DB reserved capacity](cosmos-db-reserved-capacity.md)
* Learn more about [Cosmos DB pricing page](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/)
* Learn more about [Cosmos DB Emulator](local-emulator.md)
* Learn more about [Azure Free account](https://azure.microsoft.com/free/)
* Learn more about [Try Cosmos DB for free](https://azure.microsoft.com/en-us/try/cosmosdb/)
