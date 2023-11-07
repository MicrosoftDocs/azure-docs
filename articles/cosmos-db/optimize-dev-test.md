---
title: Optimizing for development and testing in Azure Cosmos DB
description: This article explains how Azure Cosmos DB offers multiple options for development and testing of the service for free.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 08/26/2021
---

# Optimize development and testing cost in Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

This article describes the different options to use Azure Cosmos DB for development and testing for free of cost, as well as techniques to optimize cost in development or test accounts.

## Azure Cosmos DB emulator (locally downloadable version)

[Azure Cosmos DB emulator](emulator.md) is a local downloadable version that mimics the Azure Cosmos DB cloud service. You can write and test code that uses the Azure Cosmos DB APIs even if you have no network connection and without incurring any costs. Azure Cosmos DB emulator provides a local environment for development purposes with high fidelity to the cloud service. You can develop and test your application locally, without creating an Azure subscription. When you're ready to deploy your application to the cloud, update the connection string to connect to the Azure Cosmos DB endpoint in the cloud, no other modifications are needed. You can also [set up a CI/CD pipeline with the Azure Cosmos DB emulator](tutorial-setup-ci-cd.md) build task in Azure DevOps to run tests. You can get started by visiting the [Azure Cosmos DB emulator](emulator.md) article.

## Try Azure Cosmos DB for free

[Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) is a free of charge experience that allows you to experiment with Azure Cosmos DB in the cloud without signing up for an Azure account or using your credit card. The Try Azure Cosmos DB accounts are available for a limited time, currently 30 days. You can renew them at any time. Try Azure Cosmos DB accounts makes it easy to evaluate Azure Cosmos DB, build and test an application or use the Quickstarts or tutorials. You can also create a demo, perform unit testing, or even create a multi-region account and run an app on it without incurring any costs. In a Try Azure Cosmos DB account, you can have one shared throughput database with a maximum of 25 containers and 20,000 RU/s of throughput, or one container with up to 5000 RU/s. To get started, see [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) page.

## Azure Cosmos DB free tier

Azure Cosmos DB free tier makes it easy to get started, develop and test your applications, or even run small production workloads for free. When free tier is enabled on an account, you'll get the first 1000 RU/s and 25 GB of storage in the account free.

Free tier lasts indefinitely for the lifetime of the account and comes with all the [benefits and features](introduction.md#key-benefits) of a regular Azure Cosmos DB account, including unlimited storage and throughput (RU/s), SLAs, high availability, turnkey global distribution in all Azure regions, and more. You can create a free tier account using Azure portal, CLI, PowerShell, and a Resource Manager template. To learn more, see how to [create a free tier account](free-tier.md) article and the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/).

## Azure free account

Azure Cosmos DB is included in the [Azure free account](https://azure.microsoft.com/free), which offers Azure credits and resources for free for a certain time period. Specifically for Azure Cosmos DB, this free account offers 25-GB storage and 400 RUs of provisioned throughput for the entire year. This experience enables any developer to easily test the features of Azure Cosmos DB or integrate it with other Azure services at zero cost. With Azure free account, you get a $200 credit to spend in the first 30 days. You won’t be charged, even if you start using the services until you choose to upgrade. To get started, visit [Azure free account](https://azure.microsoft.com/free) page.

## Azure Cosmos DB serverless

[Azure Cosmos DB serverless](serverless.md) lets you use your Azure Cosmos DB account in a consumption-based fashion where you are only charged for the Request Units consumed by your database operations and the storage consumed by your data. There is no minimum charge involved when using Azure Cosmos DB in serverless mode. Because it eliminates the concept of provisioned capacity, it is best suited for development or testing activities specifically when your database is idle most of the time.

## Use shared throughput databases

In a [shared throughput database](set-throughput.md#set-throughput-on-a-database), all containers inside the database share the provisioned throughput (RU/s) of the database. For example, if you provision a database with 400 RU/s and have four containers, all four containers will share the 400 RU/s. In a development or testing environment, where each container may be accessed less frequently and thus require lower than the minimum of 400 RU/s,  putting containers in a shared throughput database can help optimize cost.

For example, suppose your development or test account has four containers. If you create four containers with dedicated throughput (minimum of 400 RU/s), your total RU/s will be 1600 RU/s. In contrast, if you create a shared throughput database (minimum 400 RU/s) and put your containers there, your total RU/s will be just 400 RU/s. In general, shared throughput databases are great for scenarios where you don't need guaranteed throughput on any individual container.  Learn more about [shared throughput databases.](set-throughput.md#set-throughput-on-a-database)

## Next steps

You can get started with using the emulator or the free Azure Cosmos DB accounts with the following articles:

* Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
* Learn more about [Azure Cosmos DB serverless](serverless.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
* Learn more about [Optimizing storage cost](optimize-cost-storage.md)
* Learn more about [Optimizing the cost of reads and writes](optimize-cost-reads-writes.md)
* Learn more about [Optimizing the cost of queries](./optimize-cost-reads-writes.md)
* Learn more about [Optimizing the cost of multi-region Azure Cosmos DB accounts](optimize-cost-regions.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
