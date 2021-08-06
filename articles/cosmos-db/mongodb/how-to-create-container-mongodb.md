---
title: Create a container in Azure Cosmos DB API for MongoDB
description: Learn how to create a container in Azure Cosmos DB API for MongoDB by using Azure portal, .NET, Java, Node.js, and other SDKs. 
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: how-to
ms.date: 10/16/2020
author: gahl-levy
ms.author: gahllevy
ms.custom: devx-track-csharp
---

# Create a container in Azure Cosmos DB API for MongoDB
[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

This article explains the different ways to create a container in Azure Cosmos DB API for MongoDB. It shows how to create a container using Azure portal, Azure CLI, PowerShell, or supported SDKs. This article demonstrates how to create a container, specify the partition key, and provision throughput.

This article explains the different ways to create a container in Azure Cosmos DB API for MongoDB. If you are using a different API, see [SQL API](../how-to-create-container.md), [Cassandra API](../cassandra/how-to-create-container-cassandra.md), [Gremlin API](../how-to-create-container-gremlin.md), and [Table API](../table/how-to-create-container.md) articles to create the container.

> [!NOTE]
> When creating containers, make sure you don’t create two containers with the same name but different casing. That’s because some parts of the Azure platform are not case-sensitive, and this can result in confusion/collision of telemetry and actions on containers with such names.

## <a id="portal-mongodb"></a>Create using Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos account](create-mongodb-dotnet.md#create-a-database-account), or select an existing account.

1. Open the **Data Explorer** pane, and select **New Container**. Next, provide the following details:

   * Indicate whether you are creating a new database or using an existing one.
   * Enter a container ID.
   * Enter a shard key.
   * Enter a throughput to be provisioned (for example, 1000 RUs).
   * Select **OK**.

    :::image type="content" source="../media/how-to-create-container/partitioned-collection-create-mongodb.png" alt-text="Screenshot of Azure Cosmos DB API for MongoDB, Add Container dialog box":::

## <a id="dotnet-mongodb"></a>Create using .NET SDK

```csharp
// Create a collection with a partition key by using Mongo Shell:
db.runCommand( { shardCollection: "myDatabase.myCollection", key: { myShardKey: "hashed" } } )
```

> [!Note]
> MongoDB wire protocol does not understand the concept of [Request Units](../request-units.md). To create a new collection with provisioned throughput on it, use the Azure portal or Cosmos DB SDKs for SQL API.

If you encounter timeout exception when creating a collection, do a read operation to validate if the collection was created successfully. The read operation throws an exception until the collection create operation is successful. For the list of status codes supported by the create operation see the [HTTP Status Codes for Azure Cosmos DB](/rest/api/cosmos-db/http-status-codes-for-cosmosdb) article.

## <a id="cli-mongodb"></a>Create using Azure CLI

[Create a collection for Azure Cosmos DB for MongoDB API with Azure CLI](../scripts/cli/mongodb/create.md). For a listing of all Azure CLI samples across all Azure Cosmos DB APIs see, [Azure CLI samples for Azure Cosmos DB](cli-samples.md).

## Create using PowerShell

[Create a collection for Azure Cosmos DB for MongoDB API with PowerShell](../scripts/powershell/mongodb/create.md). For a listing of all PowerShell samples across all Azure Cosmos DB APIs see, [PowerShell Samples](powershell-samples.md)

## Create a container using Azure Resource Manager templates

[Create a collection for Azure Cosmos DB for MongoDB API with Resource Manager template](../manage-with-templates.md#azure-cosmos-account-with-standard-provisioned-throughput).

## Next steps

* [Partitioning in Azure Cosmos DB](../partitioning-overview.md)
* [Request Units in Azure Cosmos DB](../request-units.md)
* [Provision throughput on containers and databases](../set-throughput.md)
* [Work with Azure Cosmos account](../account-databases-containers-items.md)