---
title: Optimizing for development and testing in Azure Cosmos DB
description: This article explains how Azure Cosmos DB offers multiple options for development and testing of the service for free.
author: rimman
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/21/2019
ms.author: rimman
---

# Optimize development and testing cost in Azure Cosmos DB

This article describes the different options to use Azure Cosmos DB for development and testing for free of cost.

## Azure Cosmos DB emulator (locally downloadable version)

[Azure Cosmos DB emulator](local-emulator.md) is a local downloadable version that mimics the Azure Cosmos DB cloud service. You can write and test code that uses the Azure Cosmos DB APIs even if you have no network connection and without incurring any costs. Azure Cosmos DB emulator provides a local environment for development purposes with high fidelity to the cloud service. You can develop and test your application locally, without creating an Azure subscription. When you're ready to deploy your application to the cloud, update the connection string to connect to the Azure Cosmos DB endpoint in the cloud, no other modifications are needed. You can also [set up a CI/CD pipeline with the Azure Cosmos DB emulator](tutorial-setup-ci-cd.md) build task in Azure DevOps to run tests. You can get started by visiting the [Azure Cosmos DB emulator](local-emulator.md) article.

## Try Azure Cosmos DB for free

[Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) is a free of charge experience that allows you to create database and collections, and experiment with Azure Cosmos DB in the cloud. You don't have to sign-up for Azure or pay any cost. The try Azure Cosmos DB accounts are available for a limited time, currently 30 days. You can renew them at any time. Try Azure Cosmos DB accounts makes it easy to evaluate Azure Cosmos DB, build and test an application by using the Quickstarts or tutorials. You can create a demo or perform unit testing without incurring any costs. By using try Azure Cosmos DB for free accounts, you can evaluate Azure Cosmos DB’s premium capabilities for free, including turnkey global distribution, SLAs, and consistency models. You can create a database with a maximum of 25 Azure Cosmos containers and 10,000 RU/s of throughput. You can run the sample application without subscribing to an Azure account or using your credit card. With Try Azure Cosmos DB for free, you can create a multi-region Azure Cosmos account and run an app on it in just a few minutes. To get started, see [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) page.

## Azure Free Account

Azure Cosmos DB is included in the [Azure free account](https://azure.microsoft.com/free), which offers Azure credits and resources for free for a certain time period. Specifically for Azure Cosmos DB, this free account offers 5-GB storage and 400 RUs of provisioned throughput for the entire year. This experience enables any developer to easily test the features of Azure Cosmos DB or integrate it with other Azure services at zero cost. With Azure free account, you get a $200 credit to spend in the first 30 days. You won’t be charged, even if you start using the services until you choose to upgrade. To get started, visit [Azure free account](https://azure.microsoft.com/free) page.

## Next steps

You can get started with using the emulator or the free Azure Cosmos DB accounts with the following articles:

* Learn more about [Optimizing for development and testing](optimize-dev-test.md)
* Learn more about [Understanding your Azure Cosmos DB bill](understand-your-bill.md)
* Learn more about [Optimizing throughput cost](optimize-cost-throughput.md)
* Learn more about [Optimizing storage cost](optimize-cost-storage.md)
* Learn more about [Optimizing the cost of reads and writes](optimize-cost-reads-writes.md)
* Learn more about [Optimizing the cost of queries](optimize-cost-queries.md)
* Learn more about [Optimizing the cost of multi-region Azure Cosmos accounts](optimize-cost-regions.md)

