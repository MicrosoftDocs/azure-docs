---
title: Optimizing for development and testing in Azure Cosmos DB
description: This article explains how Cosmos DB offers multiple options for development and testing of the service for free.
author: rimman

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/20/2018
ms.author: rimman
---

# Optimizing for development and testing

Cosmos DB offers options for development and testing of the service for free.

## Cosmos DB Emulator (locally downloadable version)

[Cosmos DB emulator](local-emulator.md) is a local downloadable version of Cosmos DB that mimics the Cosmos DB cloud service. You can write and test code that uses the Cosmos DB APIs even if you have no network connection and without incurring any costs. You can write and test your code without any service charges. Cosmos DB emulator provides a local environment for development purposes with high fidelity to the Cosmos DB cloud service. You can develop and test your application locally, without creating an Azure subscription or incurring any costs, and when you're ready to deploy your application to the cloud, you simply instruct it to connect to the actual Cosmos DB endpoint in the cloud, and that’s it. No other modifications will be needed. You can also [set up a CI/CD pipeline with the Cosmos DB emulator](/tutorial-setup-ci-cd.md) build task in Azure DevOps to run tests. You can get started by visiting the [Cosmos DB emulator](local-emulator.md) documentation and downloading Cosmos DB emulator.

## Try Cosmos DB for Free

[Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) is a free of charge experience that allows you to try out, test and experiment with Cosmos DB in the cloud, with no Azure sign-up required and at no charge, for a limited time (currently 30 days free, which can be renewed at any time). Try Cosmos DB for Free makes it easy to evaluate Cosmos DB, build and test an app, do a hands-on-lab, a tutorial, create a demo or perform unit testing without incurring any costs. Using Try Cosmos DB for free, you can evaluate Cosmos DB’s premium capabilities for free, including turnkey global distribution, SLAs and consistency models, creating a database with up to 25 Cosmos containers and up to 10,000 Request Units (RU)/second of throughput, no Azure subscription or credit required. With Try Cosmos DB for free, you can stand up a multi-region Cosmos account and run an app on it literally in just a few minutes. You can get started by visiting [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/).

## Azure Free Account

Cosmos DB is included in the [Azure free account](https://azure.microsoft.com/free), which offers Azure credits and resources for free for a certain time period. Specifically, with Azure free account, you get first 5 GB in storage and 400 RUs on Cosmos DB free for the entire year. This experience enables any developer to easily test Cosmos DB and what it has to offer, become more comfortable and build expertise with Cosmos DB and integrate it with other Azure services at zero cost. Azure Free account starts free, and you get a $200 credit to spend in the first 30 days. You won’t be charged, even if you start using services until you choose to upgrade. To start, visit [Azure free account](https://azure.microsoft.com/free).

## Next steps

* Learn more about [Cosmos DB pricing](how-pricing-works.md)
* Learn more about [Cosmos DB Emulator](local-emulator.md)
* Learn more about [Try Cosmos DB for free](https://azure.microsoft.com/en-us/try/cosmosdb/)
* Learn more about [Azure Free account](https://azure.microsoft.com/free/)
* Learn more about [How Cosmos pricing works](how-pricing-works.md)
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
