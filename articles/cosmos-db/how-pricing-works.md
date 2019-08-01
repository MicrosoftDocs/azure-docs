---
title: Pricing model of Azure Cosmos DB 
description: This article explains the pricing model of Azure Cosmos DB and how it simplifies your cost management and cost planning.
author: rimman
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/21/2019
ms.author: rimman
---

# Pricing model in Azure Cosmos DB 

The pricing model of Azure Cosmos DB simplifies the cost management and planning. With Azure Cosmos DB, you pay for the throughput provisioned and the storage that you consume.

* **Provisioned Throughput**: Provisioned throughput (also called reserved throughput) guarantees high performance at any scale. You specify the throughput (RU/s) that you need, and Azure Cosmos DB dedicates the resources required to guarantee the configured throughput. You are billed hourly for the maximum provisioned throughput for a given hour.

   > [!NOTE]
   > Because the provisioned throughput model dedicates resources to your container or database, you will be charged for the provisioned throughput even if you don’t run any workloads.

* **Consumed Storage**: You are billed a flat rate for the total amount of storage (GBs) consumed for data and the indexes for a given hour.

Provisioned throughput, specified as [Request Units](request-units.md) per second (RU/s), allows you to read from or write data into containers or databases. You can [provision throughput on either a database or a container](set-throughput.md). Based on your workload needs, you can scale throughput up/down at any time. Azure Cosmos DB pricing is elastic and is proportional to the throughput that you configure on a database or a container. The minimum throughput and storage values and the scale increments provide a full range of price vs. elasticity spectrum to all segments of customers, from small scale to large-scale containers. Each database or a container is billed on an hourly basis for the throughput provisioned in the units of 100 RU/s, with a minimum of 400 RU/s, and storage consumed in GBs. Unlike provisioned throughput, storage is billed on a consumption basis. That is, you don’t have to reserve any storage in advance. You are billed only for the storage you consume.

For more information, see the [Azure Cosmos DB pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) and [Understanding your Azure Cosmos DB bill](understand-your-bill.md).

The pricing model in Azure Cosmos DB is consistent across all APIs. To learn more, see [How Azure Cosmos DB pricing model is cost-effective for customers](total-cost-ownership.md). There is a minimum throughput required on a database or a container to ensure the SLAs and you can increase or decrease the provisioned throughput by $6 for each 100 RU/s.

Currently the minimum price for both database and the container-based throughput is $24/month (see the [Azure Cosmos DB pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) for latest information. If your workload uses multiple containers, it can be optimized for cost by using database level throughput because database level throughput allows you to have any number of containers in a database sharing the throughput among the containers. The following table summarizes  provisioned throughput and the costs for different entities:

|**Entity**  | **Minimum throughput & cost** |**Scale increments & cost** |**Provisioning Scope** |
|---------|---------|---------|-------|
|Database    | 400 RU/s ($24/month)    | 100 RU/s ($6/month)   |Throughput is reserved for the database and is shared by containers within the database |
|Container     | 400 RU/s ($24/month)    | 100 RU/s ($6/month)  |Throughput is reserved for a specific container |

As shown in the previous table, the minimum throughput in Azure Cosmos DB starts at a price of $24/month. If you start with the minimum throughput and scale up over time to support your production workloads, your costs will rise smoothly, in the increments of $6/month. The pricing model in Azure Cosmos DB is elastic and there is a smooth increase or decrease in the price as you scale up or down.

## Try Azure Cosmos DB for free 

Azure Cosmos DB offers several options for developers to it for free. These options include:

* **Azure free account**: Azure offers a [free tier](https://azure.microsoft.com/free/) that gives you $200 in Azure credits for the first 30 days and a limited quantity of free services for 12 months. For more information, see [Azure free account](../billing/billing-avoid-charges-free-account.md). Azure Cosmos DB is a part of Azure free account. Specifically for Azure Cosmos DB, this free account offers 5-GB storage and 400 RUs of provisioned throughput for the entire year. 

* **Try Azure Cosmos DB for free**: Azure Cosmos DB offers a time-limited experience by using try Azure Cosmos DB for free accounts. You can create an Azure Cosmos DB account, create database and collections and run a sample application by using the Quickstarts and tutorials. You can run the sample application without subscribing to an Azure account or using your credit card. [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) offers Azure Cosmos DB for one month, with the ability to renew your account any number of times.

* **Azure Cosmos DB emulator**: Azure Cosmos DB emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. Emulator is offered at no cost and with high fidelity to the cloud service. Using Azure Cosmos DB emulator, you can develop and test your applications locally, without creating an Azure subscription or incurring any costs. You can develop your applications by using the emulator locally before going into production. After you are satisfied with the functionality of the application against the emulator, you can switch to using the Azure Cosmos DB account in the cloud and significantly save on cost. For more information about emulator, see [Using Azure Cosmos DB for development and testing](local-emulator.md) article for more details.

## Pricing with reserved capacity

Azure Cosmos DB [reserved capacity](cosmos-db-reserved-capacity.md) helps you save money by pre-paying for Azure Cosmos DB resources for either one year or three years. You can significantly reduce your costs with one-year or three-year upfront commitments and save between 20-65% discounts when compared to the regular pricing. Azure Cosmos DB reserved capacity helps you lower costs by pre-paying for the provisioned throughput (RU/s) for a period of one year or three years and you get a discount on the throughput provisioned. 

Reserved capacity provides a billing discount and does not affect the runtime state of your Azure Cosmos DB resources. Reserved capacity is available consistently to all APIs, which includes MongoDB, Cassandra, SQL, Gremlin, and Azure Tables and all regions worldwide. You can learn more about reserved capacity in [Prepay for Azure Cosmos DB resources with reserved capacity](cosmos-db-reserved-capacity.md) article and buy reserved capacity from the [Azure portal](https://portal.azure.com/).

## Next steps

You can learn more about optimizing the costs for your Azure Cosmos DB resources in the following articles:

* Learn about [Optimizing for development and testing](optimize-dev-test.md)
* Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
* Learn more about [Optimizing storage cost](optimize-cost-storage.md)
* Learn more about [Optimizing the cost of reads and writes](optimize-cost-reads-writes.md)
* Learn more about [Optimizing the cost of queries](optimize-cost-queries.md)
* Learn more about [Optimizing the cost of multi-region Cosmos accounts](optimize-cost-regions.md)
* Learn about [Azure Cosmos DB reserved capacity](cosmos-db-reserved-capacity.md)
* Learn about [Azure Cosmos DB Emulator](local-emulator.md)
