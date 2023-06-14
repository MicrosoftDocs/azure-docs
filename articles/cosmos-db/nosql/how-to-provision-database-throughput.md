---
title: Provision database throughput in Azure Cosmos DB for NoSQL
description: Learn how to provision throughput at the database level in Azure Cosmos DB for NoSQL using Azure portal, CLI, PowerShell and various other SDKs. 
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 10/15/2020
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: devx-track-azurecli, devx-track-csharp, ignite-2022, devx-track-dotnet
---

# Provision standard (manual) throughput on a database in Azure Cosmos DB - API for NoSQL
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article explains how to provision standard (manual) throughput on a database in Azure Cosmos DB for NoSQL. You can provision throughput for a single [container](how-to-provision-container-throughput.md), or for a database and share the throughput among the containers within it. To learn when to use container level and database level throughput, see the [Use cases for provisioning throughput on containers and databases](../set-throughput.md) article. You can provision database level throughput by using the Azure portal or Azure Cosmos DB SDKs.

If you are using a different API, see [API for MongoDB](../mongodb/how-to-provision-throughput.md), [API for Cassandra](../cassandra/how-to-provision-throughput.md), [API for Gremlin](../gremlin/how-to-provision-throughput.md) articles to provision the throughput.

## Provision throughput using Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos DB account](quickstart-dotnet.md#create-account), or select an existing Azure Cosmos DB account.

1. Open the **Data Explorer** pane, and select **New Database**. Provide the following details:

   * Enter a database ID.
   * Select the **Share throughput across containers** option.
   * Select **Autoscale** or **Manual** throughput and enter the required **Database throughput** (for example, 1000 RU/s).
   * Enter a name for your container under **Container ID**
   * Enter a **Partition key**
   * Select **OK**.

    :::image type="content" source="../media/how-to-provision-database-throughput/provision-database-throughput-portal-sql-api.png" alt-text="Screenshot of New Database dialog box":::

## Provision throughput using Azure CLI or PowerShell

To create a database with shared throughput see,

* [Create a database using Azure CLI](manage-with-cli.md#create-a-database-with-shared-throughput)
* [Create a database using PowerShell](manage-with-powershell.md#create-db-ru)

## Provision throughput using .NET SDK

> [!Note]
> You can use Azure Cosmos DB SDKs for API for NoSQL to provision throughput for all APIs. You can optionally use the following example for API for Cassandra as well.

# [.NET SDK V2](#tab/dotnetv2)

```csharp
//set the throughput for the database
RequestOptions options = new RequestOptions
{
    OfferThroughput = 500
};

//create the database
await client.CreateDatabaseIfNotExistsAsync(
    new Database {Id = databaseName},  
    options);
```

# [.NET SDK V3](#tab/dotnetv3)

[!code-csharp[](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos/tests/Microsoft.Azure.Cosmos.Tests/SampleCodeForDocs/DatabaseDocsSampleCode.cs?name=DatabaseCreateWithThroughput)]

---

## Next steps

See the following articles to learn about provisioned throughput in Azure Cosmos DB:

* [Globally scale provisioned throughput](../request-units.md)
* [Provision throughput on containers and databases](../set-throughput.md)
* [How to provision standard (manual) throughput for a container](how-to-provision-container-throughput.md)
* [How to provision autoscale throughput for a container](how-to-provision-autoscale-throughput.md)
* [Request units and throughput in Azure Cosmos DB](../request-units.md)
