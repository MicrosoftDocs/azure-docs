---
title: Provision autoscale throughput in Azure Cosmos DB
description: Learn how to provision autoscale throughput at the container and database level in Azure Cosmos DB using Azure portal, CLI, PowerShell, and various other SDKs. 
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.topic: how-to
ms.date: 05/05/2020
---

# Provision autoscale throughput on database or container in Azure Cosmos DB

This article explains how to provision autoscale throughput on a database or container (collection, graph, or table) in Azure Cosmos DB. You can enable autoscale on a single container, or provision autoscale throughput on a database and share it among all the containers in the database. You can configure autoscale for new databases and containers using Azure portal, Azure Resource Manager (ARM) template, or Azure Cosmos DB .NET V3 SDK.

## Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) or the [Azure Cosmos DB explorer.](https://cosmos.azure.com/)

1. Navigate to your Azure Cosmos DB account and open the **Data Explorer** tab.

1. Select **New Container.** Enter a name for your database, container, and a partition key. Under **Throughput**, select the **autoscale** option, and set the [maximum throughput (RU/s)](provision-throughput-autoscale.md#how-autoscale-provisioned-throughput-works) that you want the database or container to scale to.

   ![Creating a container and configuring autoscale provisioned throughput](./media/how-to-provision-autoscale-throughput/create-new-autoscale-container.png)


1. Select **OK**.

You can create a shared throughput database with autoscale by selecting the **Provision database throughput** option.

## Azure Cosmos DB .NET V3 SDK
You can use [version 3.9 or higher](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) of the Azure Cosmos DB .NET SDK for SQL API to manage autoscale resources.
### Create database
```csharp
// Create instance of CosmosClient
CosmosClient cosmosClient = new CosmosClient(Endpoint, PrimaryKey);
 
// Autoscale throughput settings
ThroughputProperties autoscaleThroughputProperties = ThroughputProperties.CreateAutoscaleThroughput(4000); //Set autoscale max RU/s

//Create the database with autoscale enabled
database = await cosmosClient.CreateDatabaseAsync(DatabaseName, throughputProperties: autoscaleThroughputProperties);
```

### Create container
```csharp
// Get reference to database that container will be created in
Database database = await cosmosClient.GetDatabase("DatabaseName");

// Container and autoscale throughput settings
ContainerProperties autoscaleContainerProperties = new ContainerProperties("ContainerName", "/partitionKey");
ThroughputProperties autoscaleThroughputProperties = ThroughputProperties.CreateAutoscaleThroughput(4000); //Set autoscale max RU/s

// Create the container with autoscale enabled
container = await database.CreateContainerAsync(autoscaleContainerProperties, autoscaleThroughputProperties);
```

### Read the current throughput (RU/s)
```csharp
// Get a reference to the resource
Container container = cosmosClient.GetDatabase("DatabaseName").GetContainer("ContainerName");

// Read the throughput on a resource
ThroughputProperties autoscaleContainerThroughput = await container.ReadThroughputAsync(requestOptions: null); 

// The autoscale max throughput (RU/s) of the resource
int? autoscaleMaxThroughput = autoscaleContainerThroughput.AutoscaleMaxThroughput;

// The throughput (RU/s) the resource is currently scaled to
int? currentThroughput = autoscaleContainerThroughput.Throughput;
```

### Change the autoscale max throughput (RU/s)
```csharp
// Change the autoscale max throughput (RU/s)
await container.ReplaceThroughputAsync(ThroughputProperties.CreateAutoscaleThroughput(newAutoscaleMaxThroughput));
```

## Azure Resource Manager (ARM)
You can use an ARM template to provision autoscale throughput on a database or container. See this [article](manage-sql-with-resource-manager.md#azure-cosmos-account-with-autoscale-throughput) for a sample.

## Next steps
* Learn about the [benefits of provisioned throughput with autoscale](provision-throughput-autoscale.md#benefits-of-autoscale).
* Review the [autoscale FAQ](autoscale-faq.md).
