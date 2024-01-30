---
title: 'Azure Cosmos DB Java SDK v4 for API for NoSQL release notes and resources'
description: Learn all about the Azure Cosmos DB Java SDK v4 for API for NoSQL and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: reference
ms.date: 04/06/2021
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: devx-track-java, ignite-2022, devx-track-extended-java
---

# Azure Cosmos DB Java SDK v4 for API for NoSQL: release notes and resources
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[SDK selector](../includes/cosmos-db-sdk-list.md)]

The Azure Cosmos DB Java SDK v4 for NoSQL combines an Async API and a Sync API into one Maven artifact. The v4 SDK brings enhanced performance, new API features, and Async support based on Project Reactor and the [Netty library](https://netty.io/). Users can expect improved performance with Azure Cosmos DB Java SDK v4 versus the [Azure Cosmos DB Async Java SDK v2](sdk-java-async-v2.md) and the [Azure Cosmos DB Sync Java SDK v2](sdk-java-v2.md).

> [!IMPORTANT]  
> These Release Notes are for Azure Cosmos DB Java SDK v4 only. If you are currently using an older version than v4, see the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide for help upgrading to v4.
>
> Here are three steps to get going fast!
> 1. Install the [minimum supported Java runtime, JDK 8](/java/azure/jdk/) so you can use the SDK.
> 2. Work through the [Quickstart Guide for Azure Cosmos DB Java SDK v4](./quickstart-java.md) which gets you access to the Maven artifact and walks through basic Azure Cosmos DB requests.
> 3. Read the Azure Cosmos DB Java SDK v4 [performance tips](performance-tips-java-sdk-v4.md) and [troubleshooting](troubleshoot-java-sdk-v4.md) guides to optimize the SDK for your application.
>
> The [Azure Cosmos DB workshops and labs](https://aka.ms/cosmosworkshop) are another great resource for learning how to use Azure Cosmos DB Java SDK v4!
>

## Helpful content

| Content | Link |
|---|---|
| **Release Notes** | [Release notes for Java SDK v4](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos/CHANGELOG.md) |
| **SDK download** | [Maven](https://mvnrepository.com/artifact/com.azure/azure-cosmos) |
| **API documentation** | [Java API reference documentation](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-cosmos/latest/index.html) |
| **Contribute to SDK** | [Azure SDK for Java Central Repo on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cosmos/azure-cosmos) | 
| **Get started** | [Quickstart: Build a Java app to manage Azure Cosmos DB for NoSQL data](./quickstart-java.md) <br> [GitHub repo with quickstart code](https://github.com/Azure-Samples/azure-cosmos-java-getting-started) | 
| **Best Practices** | [Best Practices for Java SDK v4](best-practice-java.md) |
| **Basic code samples** | [Azure Cosmos DB: Java examples for the API for NoSQL](samples-java.md) <br> [GitHub repo with sample code](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples)|
| **Console app with Change Feed**| [Change feed - Java SDK v4 sample](how-to-java-change-feed.md) <br> [GitHub repo with sample code](https://github.com/Azure-Samples/azure-cosmos-java-sql-app-example)| 
| **Web app sample**| [Build a web app with Java SDK v4](tutorial-java-web-app.md) <br> [GitHub repo with sample code](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-todo-app)|
| **Performance tips**| [Performance tips for Java SDK v4](performance-tips-java-sdk-v4.md)| 
| **Troubleshooting** | [Troubleshoot Java SDK v4](troubleshoot-java-sdk-v4.md) |
| **Migrate to v4 from an older SDK** | [Migrate to Java V4 SDK](migrate-java-v4-sdk.md) |
| **Minimum supported runtime**|[JDK 8](/java/azure/jdk/) | 
| **Azure Cosmos DB workshops and labs** |[Azure Cosmos DB workshops home page](https://aka.ms/cosmosworkshop)

> [!IMPORTANT]
> * The 4.13.0 release updates `reactor-core` and `reactor-netty` major versions to `2020.0.4 (Europium)` release train.

## Release history
Release history is maintained in the azure-sdk-for-java repo, for detailed list of releases, see the [changelog file](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos/CHANGELOG.md).

## Recommended version

It's strongly recommended to use version 4.48.2 and above.

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../includes/cosmos-db-sdk-faq.md)] 

## Next steps
To learn more about Azure Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.
