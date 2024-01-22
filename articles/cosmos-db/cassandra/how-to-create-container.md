---
title: Create a container in Azure Cosmos DB for Apache Cassandra
description: Learn how to create a container in Azure Cosmos DB for Apache Cassandra by using Azure portal, .NET, Java, Python, Node.js, and other SDKs. 
author: TheovanKraay
ms.author: thvankra
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: how-to
ms.date: 10/16/2020
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-azurecli, ignite-2022, devx-track-dotnet, devx-track-extended-java, devx-track-python
---

# Create a container in Azure Cosmos DB for Apache Cassandra
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

This article explains the different ways to create a container in Azure Cosmos DB for Apache Cassandra. It shows how to create a container using Azure portal, Azure CLI, PowerShell, or supported SDKs. This article demonstrates how to create a container, specify the partition key, and provision throughput.

This article explains the different ways to create a container in Azure Cosmos DB for Apache Cassandra. If you are using a different API, see [API for MongoDB](../mongodb/how-to-create-container.md), [API for Gremlin](../gremlin/how-to-create-container.md), [API for Table](../table/how-to-create-container.md), and [API for NoSQL](../how-to-create-container.md) articles to create the container.

> [!NOTE]
> When creating containers, make sure you don’t create two containers with the same name but different casing. That’s because some parts of the Azure platform are not case-sensitive, and this can result in confusion/collision of telemetry and actions on containers with such names.

## <a id="portal-cassandra"></a>Create using Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos DB account](manage-data-dotnet.md#create-a-database-account), or select an existing account.

1. Open the **Data Explorer** pane, and select **New Table**. Next, provide the following details:

   * Indicate whether you are creating a new keyspace, or using an existing one.
   * Enter a table name.
   * Enter the properties and specify a primary key.
   * Enter a throughput to be provisioned (for example, 1000 RUs).
   * Select **OK**.

    :::image type="content" source="../media/how-to-create-container/partitioned-collection-create-cassandra.png" alt-text="Screenshot of API for Cassandra, Add Table dialog box":::

> [!NOTE]
> For API for Cassandra, the primary key is used as the partition key.

## <a id="dotnet-cassandra"></a>Create using .NET SDK

```csharp
// Create a Cassandra table with a partition/primary key and provision 1000 RU/s throughput.
session.Execute(CREATE TABLE myKeySpace.myTable(
    user_id int PRIMARY KEY,
    firstName text,
    lastName text) WITH cosmosdb_provisioned_throughput=1000);
```

If you encounter timeout exception when creating a collection, do a read operation to validate if the collection was created successfully. The read operation throws an exception until the collection create operation is successful. For the list of status codes supported by the create operation see the [HTTP Status Codes for Azure Cosmos DB](/rest/api/cosmos-db/http-status-codes-for-cosmosdb) article.

## <a id="cli-mongodb"></a>Create using Azure CLI

[Create a Cassandra table with Azure CLI](../scripts/cli/cassandra/create.md). For a listing of all Azure CLI samples across all Azure Cosmos DB APIs see, [Azure CLI samples for Azure Cosmos DB](cli-samples.md).

## Create using PowerShell

[Create a Cassandra table with PowerShell](../scripts/powershell/cassandra/create.md). For a listing of all PowerShell samples across all Azure Cosmos DB APIs see, [PowerShell Samples](powershell-samples.md)

## Next steps

* [Partitioning in Azure Cosmos DB](../partitioning-overview.md)
* [Request Units in Azure Cosmos DB](../request-units.md)
* [Provision throughput on containers and databases](../set-throughput.md)
* [Work with Azure Cosmos DB account](../resource-model.md)
