---
title: Optimizing for development and testing in Azure Cosmos DB
description: This article explains how Azure Cosmos DB offers multiple options for development and testing of the service for free.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/27/2020
---

# Optimize development and testing cost in Azure Cosmos DB

This article describes the different options to use Azure Cosmos DB for development and testing for free of cost, as well as techniques to optimize cost in development or test accounts.

## Azure Cosmos DB emulator (locally downloadable version)

[Azure Cosmos DB emulator](local-emulator.md) is a local downloadable version that mimics the Azure Cosmos DB cloud service. You can write and test code that uses the Azure Cosmos DB APIs even if you have no network connection and without incurring any costs. Azure Cosmos DB emulator provides a local environment for development purposes with high fidelity to the cloud service. You can develop and test your application locally, without creating an Azure subscription. When you're ready to deploy your application to the cloud, update the connection string to connect to the Azure Cosmos DB endpoint in the cloud, no other modifications are needed. You can also [set up a CI/CD pipeline with the Azure Cosmos DB emulator](tutorial-setup-ci-cd.md) build task in Azure DevOps to run tests. You can get started by visiting the [Azure Cosmos DB emulator](local-emulator.md) article.

## Azure Cosmos DB free tier

Azure Cosmos DB free tier makes it easy to get started, develop and test your applications, or even run small production workloads for free. When free tier is enabled on an account, you'll get the first 400 RU/s and 5 GB of storage in the account free. You can also create a shared throughput database with 25 containers that share 400 RU/s at the database level, all covered by free tier (limit 5 shared throughput databases in a free tier account). Free tier lasts indefinitely for the lifetime of the account and comes with all the [benefits and features](introduction.md#key-benefits) of a regular Azure Cosmos DB account, including unlimited storage and throughput (RU/s), SLAs, high availability, turnkey global distribution in all Azure regions, and more. You can have up to one free tier account per Azure subscription and must opt-in when creating the account. To get started, [create a new account in Azure portal with free tier enabled](create-cosmosdb-resources-portal.md) or use an [ARM Template](manage-sql-with-resource-manager.md#free-tier). See the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) for more details.

## Try Azure Cosmos DB for free

[Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) is a free of charge experience that allows you to experiment with Azure Cosmos DB in the cloud without signing up for an Azure account or using your credit card. The Try Azure Cosmos DB accounts are available for a limited time, currently 30 days. You can renew them at any time. Try Azure Cosmos DB accounts makes it easy to evaluate Azure Cosmos DB, build and test an application or use the Quickstarts or tutorials. You can also create a demo, perform unit testing, or even create a multi-region account and run an app on it without incurring any costs. In a Try Azure Cosmos DB account, you can have one shared throughput database with a maximum of 25 containers and 20,000 RU/s of throughput, or one container with up to 5000 RU/s. To get started, see [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) page.

## Azure free account

Azure Cosmos DB is included in the [Azure free account](https://azure.microsoft.com/free), which offers Azure credits and resources for free for a certain time period. Specifically for Azure Cosmos DB, this free account offers 5-GB storage and 400 RUs of provisioned throughput for the entire year. This experience enables any developer to easily test the features of Azure Cosmos DB or integrate it with other Azure services at zero cost. With Azure free account, you get a $200 credit to spend in the first 30 days. You won’t be charged, even if you start using the services until you choose to upgrade. To get started, visit [Azure free account](https://azure.microsoft.com/free) page.

## Use shared throughput databases

In a [shared throughput database](set-throughput.md#set-throughput-on-a-database), all containers inside the database share the provisioned throughput (RU/s) of the database. For example, if you provision a database with 400 RU/s and have four containers, all four containers will share the 400 RU/s. In a development or testing environment, where each container may be be accessed less frequently and thus require lower than the minimum of 400 RU/s,  putting containers in a shared throughput database can help optimize cost.

For example, suppose your development or test account has four containers. If you create four containers with dedicated throughput (minimum of 400 RU/s), your total RU/s will be 1600 RU/s. In contrast, if you create a shared throughput database (minimum 400 RU/s) and put your containers there, your total RU/s will be just 400 RU/s. In general, shared throughput databases are great for scenarios where you don't need guaranteed throughput on any individual container.  Learn more about [shared throughput databases.](set-throughput.md#set-throughput-on-a-database)

## Next steps

You can get started with using the emulator or the free Azure Cosmos DB accounts with the following articles:

* Learn more about [Optimizing for development and testing](optimize-dev-test.md)
* Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
* Learn more about [Optimizing storage cost](optimize-cost-storage.md)
* Learn more about [Optimizing the cost of reads and writes](optimize-cost-reads-writes.md)
* Learn more about [Optimizing the cost of queries](optimize-cost-queries.md)
* Learn more about [Optimizing the cost of multi-region Azure Cosmos accounts](optimize-cost-regions.md)
