---
title: Create a container in Azure Cosmos DB for NoSQL
description: Learn how to create a container in Azure Cosmos DB for NoSQL by using Azure portal, .NET, Java, Python, Node.js, and other SDKs. 
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 01/03/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-azurecli, ignite-2022, devx-track-dotnet, devx-track-extended-java, devx-track-python
---

# Create a container in Azure Cosmos DB for NoSQL
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article explains the different ways to create an container in Azure Cosmos DB for NoSQL. It shows how to create a container using the Azure portal, Azure CLI, PowerShell, or supported SDKs. This article demonstrates how to create a container, specify the partition key, and provision throughput.

This article explains the different ways to create a container in Azure Cosmos DB for NoSQL. If you are using a different API, see [API for MongoDB](../mongodb/how-to-create-container.md), [API for Cassandra](../cassandra/how-to-create-container.md), [API for Gremlin](../gremlin/how-to-create-container.md), and [API for Table](../table/how-to-create-container.md) articles to create the container.

> [!NOTE]
> When creating containers, make sure you don’t create two containers with the same name but different casing. That’s because some parts of the Azure platform are not case-sensitive, and this can result in confusion/collision of telemetry and actions on containers with such names.

## <a id="portal-sql"></a>Create a container using Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos DB account](how-to-create-account.md), or select an existing account.

1. Open the **Data Explorer** pane, and select **New Container**. Next, provide the following details:

   * Indicate whether you are creating a new database or using an existing one.
   * Enter a **Container Id**.
   * Enter a **Partition key** value (for example, `/ItemID`).
   * Select **Autoscale** or **Manual** throughput and enter the required **Container throughput** (for example, 1000 RU/s). Enter a throughput that you want to provision (for example, 1000 RUs).
   * Select **OK**.

    :::image type="content" source="../media/how-to-provision-container-throughput/provision-container-throughput-portal-sql-api.png" alt-text="Screenshot of Data Explorer, with New Collection highlighted":::

## <a id="cli-sql"></a>Create a container using Azure CLI

[Create a container with Azure CLI](manage-with-cli.md#create-a-container). For a listing of all Azure CLI samples across all Azure Cosmos DB APIs see, [Azure CLI samples for Azure Cosmos DB](cli-samples.md).

## Create a container using PowerShell

[Create a container with PowerShell](manage-with-powershell.md#create-container). For a listing of all PowerShell samples across all Azure Cosmos DB APIs see, [PowerShell Samples](powershell-samples.md)

## <a id="dotnet-sql"></a>Create a container using .NET SDK

If you encounter timeout exception when creating a collection, do a read operation to validate if the collection was created successfully. The read operation throws an exception until the collection create operation is successful. For the list of status codes supported by the create operation see the [HTTP Status Codes for Azure Cosmos DB](/rest/api/cosmos-db/http-status-codes-for-cosmosdb) article.

```csharp
// Create a container with a partition key and provision 400 RU/s manual throughput.
CosmosClient client = new CosmosClient(connectionString, clientOptions);
Database database = await client.CreateDatabaseIfNotExistsAsync(databaseId);

ContainerProperties containerProperties = new ContainerProperties()
{
    Id = containerId,
    PartitionKeyPath = "/myPartitionKey"
};

var throughput = ThroughputProperties.CreateManualThroughput(400);
Container container = await database.CreateContainerIfNotExistsAsync(containerProperties, throughput);
```

## Next steps

* [Partitioning in Azure Cosmos DB](../partitioning-overview.md)
* [Request Units in Azure Cosmos DB](../request-units.md)
* [Provision throughput on containers and databases](../set-throughput.md)
* [Work with Azure Cosmos DB account](../resource-model.md)
