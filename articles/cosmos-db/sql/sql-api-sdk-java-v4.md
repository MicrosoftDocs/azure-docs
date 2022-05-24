---
title: 'Azure Cosmos DB Java SDK v4 for SQL API release notes and resources'
description: Learn all about the Azure Cosmos DB Java SDK v4 for SQL API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: rothja
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 04/06/2021
ms.author: jroth
ms.custom: devx-track-java
---

# Azure Cosmos DB Java SDK v4 for Core (SQL) API: release notes and resources
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

[!INCLUDE[appliesto-sql-api](../includes/cosmos-db-sdk-list.md)]

The Azure Cosmos DB Java SDK v4 for Core (SQL) combines an Async API and a Sync API into one Maven artifact. The v4 SDK brings enhanced performance, new API features, and Async support based on Project Reactor and the [Netty library](https://netty.io/). Users can expect improved performance with Azure Cosmos DB Java SDK v4 versus the [Azure Cosmos DB Async Java SDK v2](sql-api-sdk-async-java.md) and the [Azure Cosmos DB Sync Java SDK v2](sql-api-sdk-java.md).

> [!IMPORTANT]  
> These Release Notes are for Azure Cosmos DB Java SDK v4 only. If you are currently using an older version than v4, see the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide for help upgrading to v4.
>
> Here are three steps to get going fast!
> 1. Install the [minimum supported Java runtime, JDK 8](/java/azure/jdk/) so you can use the SDK.
> 2. Work through the [Quickstart Guide for Azure Cosmos DB Java SDK v4](./create-sql-api-java.md) which gets you access to the Maven artifact and walks through basic Azure Cosmos DB requests.
> 3. Read the Azure Cosmos DB Java SDK v4 [performance tips](performance-tips-java-sdk-v4-sql.md) and [troubleshooting](troubleshoot-java-sdk-v4-sql.md) guides to optimize the SDK for your application.
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
| **Get started** | [Quickstart: Build a Java app to manage Azure Cosmos DB SQL API data](./create-sql-api-java.md) <br> [GitHub repo with quickstart code](https://github.com/Azure-Samples/azure-cosmos-java-getting-started) | 
| **Best Practices** | [Best Practices for Java SDK v4](best-practice-java.md) |
| **Basic code samples** | [Azure Cosmos DB: Java examples for the SQL API](sql-api-java-sdk-samples.md) <br> [GitHub repo with sample code](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples)|
| **Console app with Change Feed**| [Change feed - Java SDK v4 sample](create-sql-api-java-changefeed.md) <br> [GitHub repo with sample code](https://github.com/Azure-Samples/azure-cosmos-java-sql-app-example)| 
| **Web app sample**| [Build a web app with Java SDK v4](sql-api-java-application.md) <br> [GitHub repo with sample code](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-todo-app)|
| **Performance tips**| [Performance tips for Java SDK v4](performance-tips-java-sdk-v4-sql.md)| 
| **Troubleshooting** | [Troubleshoot Java SDK v4](troubleshoot-java-sdk-v4-sql.md) |
| **Migrate to v4 from an older SDK** | [Migrate to Java V4 SDK](migrate-java-v4-sdk.md) |
| **Minimum supported runtime**|[JDK 8](/java/azure/jdk/) | 
| **Azure Cosmos DB workshops and labs** |[Cosmos DB workshops home page](https://aka.ms/cosmosworkshop)

> [!IMPORTANT]
> * The 4.13.0 release updates `reactor-core` and `reactor-netty` major versions to `2020.0.4 (Europium)` release train.

## Release history
Release history is maintained in the azure-sdk-for-java repo, for detailed list of releases, see the [changelog file](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos/CHANGELOG.md).

## Recommended version

It's strongly recommended to use version 4.18.0 and above.

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../includes/cosmos-db-sdk-faq.md)] 

## Next steps
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.
