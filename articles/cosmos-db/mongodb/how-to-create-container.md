---
title: Create a collection in Azure Cosmos DB for MongoDB
description: Learn how to create a collection in Azure Cosmos DB for MongoDB by using Azure portal, .NET, Java, Node.js, and other SDKs. 
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: how-to
ms.date: 04/07/2022
author: gahl-levy
ms.author: gahllevy
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-azurecli, ignite-2022, devx-track-arm-template, devx-track-dotnet, devx-track-extended-java
---

# Create a collection in Azure Cosmos DB for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This article explains the different ways to create a collection in Azure Cosmos DB for MongoDB. It shows how to create a collection using Azure portal, Azure CLI, PowerShell, or supported SDKs. This article demonstrates how to create a collection, specify the partition key, and provision throughput.

>[!NOTE]
> **Containers** and **collections** are similar to a table in a relational database. We refer to **containers** in the Azure Cosmos DB for NoSQL and throughout the Azure portal, while we use **collections** in the context of the Azure Cosmos DB for MongoDB to match the terminology used in MongoDB.

This article explains the different ways to create a collection in Azure Cosmos DB for MongoDB. If you are using a different API, see [API for NoSQL](../how-to-create-container.md), [API for Cassandra](../cassandra/how-to-create-container.md), [API for Gremlin](../gremlin/how-to-create-container.md), and [API for Table](../table/how-to-create-container.md) articles to create the collection.

> [!NOTE]
> When creating collections, make sure you don’t create two collections with the same name but different casing. That’s because some parts of the Azure platform are not case-sensitive, and this can result in confusion/collision of telemetry and actions on collections with such names.

## <a id="portal-mongodb"></a>Create using Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos DB account](create-mongodb-dotnet.md#create-an-azure-cosmos-db-account), or select an existing account.

1. Open the **Data Explorer** pane, and select **New Container**. Next, provide the following details:

   * Indicate whether you are creating a new database or using an existing one.
   * Enter a container ID.
   * Enter a shard key.
   * Enter a throughput to be provisioned (for example, 1000 RUs).
   * Select **OK**.

    :::image type="content" source="../media/how-to-create-container/partitioned-collection-create-mongodb.png" alt-text="Screenshot of Azure Cosmos DB for MongoDB, Add Container dialog box":::

## <a id="dotnet-mongodb"></a>Create using .NET SDK

```csharp
var bson = new BsonDocument
{
    { "customAction", "CreateCollection" },
    { "collection", "<CollectionName>" },//update CollectionName
    { "shardKey", "<ShardKeyName>" }, //update ShardKey
    { "offerThroughput", 400} //update Throughput
};
var shellCommand = new BsonDocumentCommand<BsonDocument>(bson);
// Create a collection with a partition key by using Mongo Driver:
db.RunCommand(shellCommand);
```

If you encounter timeout exception when creating a collection, do a read operation to validate if the collection was created successfully. The read operation throws an exception until the collection create operation is successful. For the list of status codes supported by the create operation see the [HTTP Status Codes for Azure Cosmos DB](/rest/api/cosmos-db/http-status-codes-for-cosmosdb) article.

## <a id="cli-mongodb"></a>Create using Azure CLI

[Create a collection for Azure Cosmos DB for API for MongoDB with Azure CLI](../scripts/cli/mongodb/create.md). For a listing of all Azure CLI samples across all Azure Cosmos DB APIs see, [Azure CLI samples for Azure Cosmos DB](cli-samples.md).

## Create using PowerShell

[Create a collection for Azure Cosmos DB for API for MongoDB with PowerShell](../scripts/powershell/mongodb/create.md). For a listing of all PowerShell samples across all Azure Cosmos DB APIs see, [PowerShell Samples](powershell-samples.md)

## Create a collection using Azure Resource Manager templates

[Create a collection for Azure Cosmos DB for API for MongoDB with Resource Manager template](../manage-with-templates.md#azure-cosmos-account-with-standard-provisioned-throughput).

## Next steps

* [Partitioning in Azure Cosmos DB](../partitioning-overview.md)
* [Request Units in Azure Cosmos DB](../request-units.md)
* [Provision throughput on containers and databases](../set-throughput.md)
* [Work with Azure Cosmos DB account](../resource-model.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
