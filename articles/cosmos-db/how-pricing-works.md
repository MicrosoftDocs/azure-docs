---
title: Pricing model of Azure Cosmos DB 
description: This article explains the pricing model of Azure Cosmos DB and how it simplifies your cost management and cost planning.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 08/19/2020
---

# Pricing model in Azure Cosmos DB

The pricing model of Azure Cosmos DB simplifies the cost management and planning. With Azure Cosmos DB, you pay for the operations you perform against the database and for the storage consumed by your data.

- **Database operations**: The way you get charged for your database operations depends on the type of Azure Cosmos account you are using.

  - **Provisioned Throughput**: [Provisioned throughput](set-throughput.md) (also called reserved throughput) guarantees high performance at any scale. You specify the throughput that you need in [Request Units](request-units.md) per second (RU/s), and Azure Cosmos DB dedicates the resources required to guarantee the configured throughput. You can [provision throughput on either a database or a container](set-throughput.md). Based on your workload needs, you can scale throughput up/down at any time or use [autoscale](provision-throughput-autoscale.md) (although there is a minimum throughput required on a database or a container to guarantee the SLAs). You are billed hourly for the maximum provisioned throughput for a given hour.

   > [!NOTE]
   > Because the provisioned throughput model dedicates resources to your container or database, you will be charged for the throughput you have provisioned even if you don't run any workloads.

  - **Serverless**: In [serverless](serverless.md) mode, you don't have to provision any throughput when creating resources in your Azure Cosmos account. At the end of your billing period, you get billed for the amount of Request Units that has been consumed by your database operations.

- **Storage**: You are billed a flat rate for the total amount of storage (in GBs) consumed by your data and indexes for a given hour. Storage is billed on a consumption basis, so you don't have to reserve any storage in advance. You are billed only for the storage you consume.

The pricing model in Azure Cosmos DB is consistent across all APIs. For more information, see the [Azure Cosmos DB pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/), [Understanding your Azure Cosmos DB bill](understand-your-bill.md) and [How Azure Cosmos DB pricing model is cost-effective for customers](total-cost-ownership.md).

If you deploy your Azure Cosmos DB account to a non-government region in the US, there is a minimum price for both database and container-based throughput in provisioned throughput mode. There is no minimum price in serverless mode. The pricing varies depending on the region you are using, see the [Azure Cosmos DB pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) for latest pricing information.

## Try Azure Cosmos DB for free

Azure Cosmos DB offers many options for developers to it for free. These options include:

* **Azure Cosmos DB free tier**: Azure Cosmos DB free tier makes it easy to get started, develop and test your applications, or even run small production workloads for free. When free tier is enabled on an account, you'll get the first 400 RU/s and 5 GB of storage in the account free, for the lifetime of the account. You can have up to one free tier account per Azure subscription and must opt-in when creating the account. To get started, [create a new account in Azure portal with free tier enabled](create-cosmosdb-resources-portal.md) or use an [ARM Template](manage-sql-with-resource-manager.md#free-tier).

* **Azure free account**: Azure offers a [free tier](https://azure.microsoft.com/free/) that gives you $200 in Azure credits for the first 30 days and a limited quantity of free services for 12 months. For more information, see [Azure free account](../cost-management-billing/manage/avoid-charges-free-account.md). Azure Cosmos DB is a part of Azure free account. Specifically for Azure Cosmos DB, this free account offers 5-GB storage and 400 RU/s of provisioned throughput for the entire year.

* **Try Azure Cosmos DB for free**: Azure Cosmos DB offers a time-limited experience by using try Azure Cosmos DB for free accounts. You can create an Azure Cosmos DB account, create database and collections and run a sample application by using the Quickstarts and tutorials. You can run the sample application without subscribing to an Azure account or using your credit card. [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) offers Azure Cosmos DB for one month, with the ability to renew your account any number of times.

* **Azure Cosmos DB emulator**: Azure Cosmos DB emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. Emulator is offered at no cost and with high fidelity to the cloud service. Using Azure Cosmos DB emulator, you can develop and test your applications locally, without creating an Azure subscription or incurring any costs. You can develop your applications by using the emulator locally before going into production. After you are satisfied with the functionality of the application against the emulator, you can switch to using the Azure Cosmos DB account in the cloud and significantly save on cost. For more information about emulator, see [Using Azure Cosmos DB for development and testing](local-emulator.md) article for more details.

## Pricing with reserved capacity

Azure Cosmos DB [reserved capacity](cosmos-db-reserved-capacity.md) helps you save money when using the provisioned throughput mode by pre-paying for Azure Cosmos DB resources for either one year or three years. You can significantly reduce your costs with one-year or three-year upfront commitments and save between 20-65% discounts when compared to the regular pricing. Azure Cosmos DB reserved capacity helps you lower costs by pre-paying for the provisioned throughput (RU/s) for a period of one year or three years and you get a discount on the throughput provisioned. 

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
