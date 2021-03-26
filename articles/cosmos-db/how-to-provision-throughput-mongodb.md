---
title: Provision throughput on Azure Cosmos DB API for MongoDB resources
description: Learn how to provision container, database, and autoscale throughput in Azure Cosmos DB API for MongoDB resources. You will use Azure portal, CLI, PowerShell and various other SDKs. 
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: how-to
ms.date: 10/15/2020
ms.author: mjbrown
ms.custom: devx-track-js, devx-track-azurecli, devx-track-csharp
---

# Provision database, container or autoscale throughput on Azure Cosmos DB API for MongoDB resources
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

This article explains how to provision throughput in Azure Cosmos DB API for MongoDB. You can provision standard(manual) or autoscale throughput on a container, or a database and share it among the containers within the database. You can provision throughput using Azure portal, Azure CLI, or Azure Cosmos DB SDKs.

If you are using a different API, see [SQL API](how-to-provision-container-throughput.md), [Cassandra API](how-to-provision-throughput-cassandra.md), [Gremlin API](how-to-provision-throughput-gremlin.md) articles to provision the throughput.

## <a id="portal-mongodb"></a> Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos account](create-mongodb-dotnet.md#create-a-database-account), or select an existing Azure Cosmos account.

1. Open the **Data Explorer** pane, and select **New Collection**. Next, provide the following details:

   * Indicate whether you are creating a new database or using an existing one. Select the **Provision database throughput** option if you want to provision throughput at the database level.
   * Enter a collection ID.
   * Enter a partition key value (for example, `/ItemID`).
   * Enter a throughput that you want to provision (for example, 1000 RUs).
   * Select **OK**.

    :::image type="content" source="./media/how-to-provision-throughput-mongodb/provision-database-throughput-portal-mongodb-api.png" alt-text="Screenshot of Data Explorer, when creating a new collection with database level throughput":::

> [!Note]
> If you are provisioning throughput on a container in an Azure Cosmos account configured with the Azure Cosmos DB API for MongoDB, use `/myShardKey` for the partition key path.

## <a id="dotnet-mongodb"></a> .NET SDK

```csharp
// refer to MongoDB .NET Driver
// https://docs.mongodb.com/drivers/csharp

// Create a new Client
String mongoConnectionString = "mongodb://DBAccountName:Password@DBAccountName.documents.azure.com:10255/?ssl=true&replicaSet=globaldb";
mongoUrl = new MongoUrl(mongoConnectionString);
mongoClientSettings = MongoClientSettings.FromUrl(mongoUrl);
mongoClient = new MongoClient(mongoClientSettings);

// Change the database name
mongoDatabase = mongoClient.GetDatabase("testdb");

// Change the collection name, throughput value then update via MongoDB extension commands
// https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-custom-commands#update-collection

var result = mongoDatabase.RunCommand<BsonDocument>(@"{customAction: ""UpdateCollection"", collection: ""testcollection"", offerThroughput: 400}");
```

## Azure Resource Manager

Azure Resource Manager templates can be used to provision autoscale throughput on database or container-level resources for all Azure Cosmos DB APIs. See [Azure Resource Manager templates for Azure Cosmos DB](templates-samples-mongodb.md) for samples.

## Azure CLI

Azure CLI can be used to provision autoscale throughput on a database or container-level resources for all Azure Cosmos DB APIs. For samples see [Azure CLI Samples for Azure Cosmos DB](cli-samples-mongodb.md).

## Azure PowerShell

Azure PowerShell can be used to provision autoscale throughput on a database or container-level resources for all Azure Cosmos DB APIs. For samples see [Azure PowerShell samples for Azure Cosmos DB](powershell-samples-mongodb.md).

## Next steps

See the following articles to learn about throughput provisioning in Azure Cosmos DB:

* [Request units and throughput in Azure Cosmos DB](request-units.md)