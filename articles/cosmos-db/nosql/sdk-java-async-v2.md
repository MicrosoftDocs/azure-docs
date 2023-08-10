---
title: 'Azure Cosmos DB: SQL Async Java API, SDK & resources'
description: Learn all about the SQL Async Java API and SDK including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: reference
ms.date: 11/11/2021
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: devx-track-java, ignite-2022, devx-track-extended-java
---

# Azure Cosmos DB Async Java SDK for API for NoSQL (legacy): Release notes and resources
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[SDK selector](../includes/cosmos-db-sdk-list.md)]

The API for NoSQL Async Java SDK differs from the API for NoSQL Java SDK by providing asynchronous operations with support of the [Netty library](https://netty.io/). The pre-existing [API for NoSQL Java SDK](sdk-java-v2.md) does not support asynchronous operations. 

> [!IMPORTANT]  
> This is *not* the latest Java SDK for Azure Cosmos DB! We **strongly recommend** using [Azure Cosmos DB Java SDK v4](sdk-java-v4.md) for your project. To upgrade, follow the instructions in the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide and the [Reactor vs RxJava](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/reactor-rxjava-guide.md) guide. 
>

> [!IMPORTANT]  
> On August 31, 2024 the Azure Cosmos DB Async Java SDK v2.x
> will be retired. Azure Cosmos DB will cease
> to provide further maintenance and support for this SDK after retirement.
> Please follow the instructions above to migrate to
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
To learn more about Azure Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.
