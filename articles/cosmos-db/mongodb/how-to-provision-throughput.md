---
title: Provision throughput on Azure Cosmos DB for MongoDB resources
description: Learn how to provision container, database, and autoscale throughput in Azure Cosmos DB for MongoDB resources. You will use Azure portal, CLI, PowerShell and various other SDKs. 
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: how-to
ms.date: 11/17/2021
author: gahl-levy
ms.author: gahllevy
ms.devlang: csharp
ms.custom: devx-track-azurecli, devx-track-csharp, ignite-2022, devx-track-azurepowershell, devx-track-arm-template, devx-track-dotnet
---

# Provision database, container or autoscale throughput on Azure Cosmos DB for MongoDB resources
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This article explains how to provision throughput in Azure Cosmos DB for MongoDB. You can provision standard(manual) or autoscale throughput on a container, or a database and share it among the containers within the database. You can provision throughput using Azure portal, Azure CLI, or Azure Cosmos DB SDKs.

If you are using a different API, see [API for NoSQL](../how-to-provision-container-throughput.md), [API for Cassandra](../cassandra/how-to-provision-throughput.md), [API for Gremlin](../gremlin/how-to-provision-throughput.md) articles to provision the throughput.

## <a id="portal-mongodb"></a> Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos DB account](create-mongodb-dotnet.md#create-an-azure-cosmos-db-account), or select an existing Azure Cosmos DB account.

1. Open the **Data Explorer** pane, and select **New Collection**. Next, provide the following details:

   * Indicate whether you are creating a new database or using an existing one. Select the **Provision database throughput** option if you want to provision throughput at the database level.
   * Enter a collection ID.
   * Enter a partition key value (for example, `ItemID`).
   * Enter a throughput that you want to provision (for example, 1000 RUs).
   * Select **OK**.

    :::image type="content" source="media/how-to-provision-throughput/provision-database-throughput-portal-mongodb-api.png" alt-text="Screenshot of Data Explorer, when creating a new collection with database level throughput":::

> [!Note]
> If you are provisioning throughput on a container in an Azure Cosmos DB account configured with the Azure Cosmos DB for MongoDB, use `myShardKey` for the partition key path.

## <a id="dotnet-mongodb"></a> .NET SDK

```csharp
// refer to MongoDB .NET Driver
// https://docs.mongodb.com/drivers/csharp

// Create a new Client
String mongoConnectionString = "mongodb://DB AccountName:Password@DB AccountName.documents.azure.com:10255/?ssl=true&replicaSet=globaldb";
mongoUrl = new MongoUrl(mongoConnectionString);
mongoClientSettings = MongoClientSettings.FromUrl(mongoUrl);
mongoClient = new MongoClient(mongoClientSettings);

// Change the database name
mongoDatabase = mongoClient.GetDatabase("testdb");

// Change the collection name, throughput value then update via MongoDB extension commands
// https://learn.microsoft.com/azure/cosmos-db/mongodb-custom-commands#update-collection

var result = mongoDatabase.RunCommand<BsonDocument>(@"{customAction: ""UpdateCollection"", collection: ""testcollection"", offerThroughput: 400}");
```

## Azure Resource Manager

Azure Resource Manager templates can be used to provision autoscale throughput on database or container-level resources for all Azure Cosmos DB APIs. See [Azure Resource Manager templates for Azure Cosmos DB](resource-manager-template-samples.md) for samples.

## Azure CLI

Azure CLI can be used to provision autoscale throughput on a database or container-level resources for all Azure Cosmos DB APIs. For samples see [Azure CLI Samples for Azure Cosmos DB](cli-samples.md).

## Azure PowerShell

Azure PowerShell can be used to provision autoscale throughput on a database or container-level resources for all Azure Cosmos DB APIs. For samples see [Azure PowerShell samples for Azure Cosmos DB](powershell-samples.md).

## Next steps

See the following articles to learn about throughput provisioning in Azure Cosmos DB:

* [Request units and throughput in Azure Cosmos DB](../request-units.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
