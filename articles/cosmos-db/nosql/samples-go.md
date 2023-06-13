---
title: API for NoSQL Go examples for Azure Cosmos DB
description: Find Go examples on GitHub for common tasks in Azure Cosmos DB, including CRUD operations.
author: soferreira
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: go
ms.custom: devx-track-go
ms.topic: sample
ms.date: 10/17/2022
ms.author: soferreira
---
# Azure Cosmos DB Go examples
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
> * [.NET SDK Examples](samples-dotnet.md)
> * [Java V4 SDK Examples](samples-java.md)
> * [Spring Data V3 SDK Examples](samples-java-spring-data.md)
> * [Node.js Examples](samples-nodejs.md)
> * [Python Examples](samples-python.md)
> * [Go Examples](samples-go.md)
> * [Azure Code Sample Gallery](https://azure.microsoft.com/resources/samples/?sort=0&service=cosmos-db)

Sample solutions that do CRUD operations and other common operations on Azure Cosmos DB resources are included in the [azure-documentdb-go](https://github.com/Azure/azure-sdk-for-go) GitHub repository. This article provides:

* Links to the tasks in each of the Go example project files.
* Links to the related API reference content.

## Prerequisites

- An Azure Cosmos DB Account. Your options are:
    * Within an Azure active subscription:
        * [Create an Azure free Account](https://azure.microsoft.com/free) or use your existing subscription 
        * [Visual Studio Monthly Credits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers)
        * [Azure Cosmos DB Free Tier](../free-tier.md)
    * Without an Azure active subscription:
        * [Try Azure Cosmos DB for free](../try-free.md), a tests environment that lasts for 30 days.
        * [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator) 
- [go](https://go.dev/) installed on your computer, and a working knowledge of Go.
- [Visual Studio Code](https://code.visualstudio.com/).
- The [Go extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=golang.Go).
- [Git](https://www.git-scm.com/downloads). 
- [Azure Cosmos DB for NoSQL SDK for Go](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/data/azcosmos)

## Database examples

To learn about the Azure Cosmos DB databases before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article.

| Task | API reference |
| --- | --- |
| [Create a database](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_client.go#L151) |Client.CreateDatabase |
| [Read a database by ID](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_client.go#L119) |Client.NewDatabase|
| [Delete a database](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_database.go#L155) |DatabaseClient.Delete|

## Container examples

To learn about the Azure Cosmos DB collections before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article.

| Task | API reference |
| --- | --- |
| [Create a container](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_database.go#L47) |DatabaseClient.CreateContainer |
| [Get a container by its ID](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_database.go#L35) |DatabaseClient.NewContainer |
| [Delete a container](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_container.go#L109) |ContainerClient.Delete |

## Item examples

The [cosmos_container.go](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_container.go) Go sample shows how to do the following tasks. To learn about the Azure Cosmos DB documents before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article.

| Task | API reference |
| --- | --- |
| [Create a item in a container](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_container.go#L184) |ContainerClient.CreateItem |
| [Read an item by its ID](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_container.go#L325) |ContainerClient.ReadItem |
| [Query items](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_container.go#L410) |ContainerClient.NewQueryItemsPager |
| [Replace an item](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_container.go#L279) |ContainerClient.ReplaceItem |
| [Upsert an item](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_container.go#L229) |ContainerClient.UpsertIitem |
| [Delete an item](https://github.com/Azure/azure-sdk-for-go/blob/sdk/data/azcosmos/v0.3.2/sdk/data/azcosmos/cosmos_container.go#L366) |ContainerClient.DeleteItem |


## Next steps

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
