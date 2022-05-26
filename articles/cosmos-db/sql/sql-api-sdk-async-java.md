---
title: 'Azure Cosmos DB: SQL Async Java API, SDK & resources'
description: Learn all about the SQL Async Java API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: rothja
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 11/11/2021
ms.author: jroth
ms.custom: devx-track-java
---

# Azure Cosmos DB Async Java SDK for SQL API (legacy): Release notes and resources
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

[!INCLUDE[appliesto-sql-api](../includes/cosmos-db-sdk-list.md)]

The SQL API Async Java SDK differs from the SQL API Java SDK by providing asynchronous operations with support of the [Netty library](https://netty.io/). The pre-existing [SQL API Java SDK](sql-api-sdk-java.md) does not support asynchronous operations. 

> [!IMPORTANT]  
> This is *not* the latest Java SDK for Azure Cosmos DB! Consider using [Azure Cosmos DB Java SDK v4](sql-api-sdk-java-v4.md) for your project. To upgrade, follow the instructions in the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide and the [Reactor vs RxJava](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/reactor-rxjava-guide.md) guide. 
>

> [!IMPORTANT]  
> On August 31, 2024 the Azure Cosmos DB Async Java SDK v2.x
> will be retired; the SDK and all applications using the SDK
> **will continue to function**; Azure Cosmos DB will simply cease
> to provide further maintenance and support for this SDK.
> We recommend following the instructions above to migrate to
> Azure Cosmos DB Java SDK v4.
>

| | Links |
|---|---|
| **Release Notes** | [Release notes for Async Java SDK](https://github.com/Azure/azure-cosmosdb-java/blob/master/changelog/README.md) |
| **SDK Download** | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb) |
| **API documentation** |[Java API reference documentation](/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient) | 
| **Contribute to SDK** | [GitHub](https://github.com/Azure/azure-cosmosdb-java) | 
| **Get started** | [Get started with the Async Java SDK](https://github.com/Azure-Samples/azure-cosmos-db-sql-api-async-java-getting-started) | 
| **Code sample** | [GitHub](https://github.com/Azure/azure-cosmosdb-java#usage-code-sample)| 
| **Performance tips**| [GitHub readme](https://github.com/Azure/azure-cosmosdb-java#guide-for-prod)| 
| **Minimum supported runtime**|[JDK 8](/java/azure/jdk/) | 

## Release history

Release history is maintained in the Azure Cosmos DB Java SDK source repo. For a detailed list of feature releases and bugs fixed in each release, see the [SDK changelog documentation](https://github.com/Azure/azure-cosmosdb-java/blob/master/changelog/README.md)

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../includes/cosmos-db-sdk-faq.md)]

## See also
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.
