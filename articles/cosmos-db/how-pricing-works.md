---
title: How Azure Cosmos DB pricing works
description: This article explains the pricing model of Azure Cosmos DB including free options.
author: rimman

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/20/2018
ms.author: rimman
---

# How Azure Cosmos DB pricing works

The pricing model of Azure Cosmos DB simplifies your cost management and cost planning. With Cosmos DB, you pay for the provisioned throughput that you need and the storage that you consume.

* **Provisioned Throughput**: Provisioned throughput (also called reserved throughput) guarantees high performance at any scale. You specify the throughput (RU/s) that you need, and Cosmos DB dedicates the resources required to guarantee this level of throughput. You are billed hourly for the maximum provisioned throughput for a given hour.

> [!NOTE]
> Because the provisioned throughput model dedicates resources to your container or database, you will be charged for the reserved throughput even if you don’t run any workloads.

* **Consumed Storage**: You are billed a flat rate for the total amount of storage (GBs) consumed for data plus indexes for a given hour.

Provisioned throughput, specified as [Request Units](request-units.md) per second (RU/s), allows you to read from or write data into containers or databases. You can [provision throughput on either a database or a container](set-throughput.md). You can scale up/down throughput at any time, based on your workload needs. Cosmos DB pricing is elastic and is proportional to the throughput amount that you configure. The minimum entry and the scale increments provide a full range of price vs. elasticity spectrum to all segments of customers, from “small scale” to “large scale” containers (for example, a collection of documents or a table or a graph, depending on the data model of choice). Each database or container is billed on an hourly basis for the throughput provisioned in units of 100 RU/s, with a minimum of 400 RU/s, and storage consumed (in GBs). Unlike throughput, which you have to provision, storage is billed on a consumption basis. That is, you don’t have to reserve any storage in advance. You are billed only for the storage you consume.

For details, see the [Cosmos DB pricing page](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/) and [Understanding your Cosmos DB bill](understand-your-bill.md).

The pricing model is consistent across all Cosmos DB data models and APIs. See [How Cosmos DB pricing model is cost-effective for customers](total-cost-of-ownership.md). There is a minimum throughput required on a database or container to ensure the SLAs. You can increase or decrease provisioned throughput by $6 for each 100 RU/s.

The current minimum price for both database and container-based throughput is $24/month (see the [Cosmos DB pricing page](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/). If your workload has many containers, it can be optimized for cost using database level provisioned throughput that allows you to have any number of containers in a database sharing the throughput among the containers. The table below summarizes provisioned throughput costs.

|Entity  | Minimum throughput |Scale increments |Provisioning Scope |
|---------|---------|---------|-------|
|Database    | 400 RU/s ($24/month)    | 100 RU/s ($6/month)   |Throughput is reserved for the database and is shared by containers within the database |
|Container     | 400 RU/s ($24/month)    | 100 RU/s ($6/month)  |Throughput is reserved for a specific container |

As shown in the table, Cosmos DB throughput costs start at a price of $24/month. If you start with the minimum and scale up over time to a production level deployment, your costs will rise smoothly (in increments of $6/month) as you provision greater amounts of throughput. The pricing model is elastic and there is a smooth continuum of price points as you scale up or down.

## Trying Cosmos DB for free

Cosmos DB offers several options for developers to use Cosmos DB for free. See [Using Cosmos DB for development and testing](ptimize-dev-test.md) for details. These options include:

* **Azure Free Account**: Microsoft Azure offers a [free tier](https://azure.microsoft.com/free/) which gives you $200 in Azure credits for the first 30 days and a limited quantity of free services for 12 months. For more information, see [Azure free account](https://docs.microsoft.com/en-us/azure/billing/billing-avoid-charges-free-account). Cosmos DB is a part of Azure free account; specifically for Cosmos DB, you get the first 5 GB in storage and 400 RUs free for the entire year. To get Cosmos DB as a part of Azure free account go [here](https://azure.microsoft.com/free/).

* **Try Cosmos DB for free**: Cosmos DB offers an experience that gives you a time-limited full-service experience with Cosmos DB free. It is designed to enable you to try out Cosmos DB, do a tutorial, perform a demo, or complete a quickstart without requiring an Azure account or a credit card. [Try Cosmos DB for free](https://azure.microsoft.com/en-us/try/cosmosdb/) offers Cosmos DB free for one month, with the ability to renew any number of times.

* **Cosmos DB emulator**: Cosmos DB Emulator provides a local environment that emulates the Cosmos DB service for development purposes, at no cost and with high fidelity to the cloud service. Using Cosmos DB emulator, you can develop and test your applications locally, without creating an Azure subscription or incurring any costs. You can develop against the emulator locally before going into production in the cloud. When you are satisfied with how the application is working against the Cosmos DB emulator, you can switch to using a Cosmos DB account in the cloud and significantly save on cost.

## Commitment-based pricing

Cosmos DB [reserved capacity](cosmos-db-reserved-capacity.md) can significantly reduce your Cosmos DB costs with one-year or three-year upfront commitments with savings from 20-65% off. Cosmos DB reserved capacity helps you lower costs by pre-paying for Cosmos DB provisioned throughput (RU/s) for a period of one year or three years and you get a discount on the throughput provisioned. Reserved capacity provides a billing discount and does not affect the runtime state of your Cosmos DB resources. Cosmos DB reserved capacity applies consistently to all APIs (including MongoDB, Cassandra, SQL, Gremlin and Azure Tables) and all regions worldwide. You can learn more about reserved capacity in this [article](cosmos-db-reserved-capacity.md) and buy reserved capacity by going to the [Azure portal](https://portal.azure.com/).

## Next steps

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
* Learn more about [Optimizing the cost of multi-region Cosmos accounts](optimize-cost-regions.md)
* Learn more about [Cosmos DB reserved capacity](cosmos-db-reserved-capacity.md)
* Learn more about [Cosmos DB pricing page](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/)
* Learn more about [Cosmos DB Emulator](local-emulator.md)
* Learn more about [Azure Free account](https://azure.microsoft.com/free/)
* Learn more about [Try Cosmos DB for free](https://azure.microsoft.com/en-us/try/cosmosdb/)
