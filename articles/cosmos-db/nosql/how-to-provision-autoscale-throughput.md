---
title: Provision autoscale throughput in Azure Cosmos DB for NoSQL
description: Learn how to provision autoscale throughput at the container and database level in Azure Cosmos DB for NoSQL using Azure portal, CLI, PowerShell, and various other SDKs. 
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 04/01/2022
ms.custom: devx-track-csharp, devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template, devx-track-dotnet, devx-track-extended-java
---

# Provision autoscale throughput on database or container in Azure Cosmos DB - API for NoSQL
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article explains how to provision autoscale throughput on a database or container (collection, graph, or table) in Azure Cosmos DB for NoSQL. You can enable autoscale on a single container, or provision autoscale throughput on a database and share it among all the containers in the database.

If you are using a different API, see [API for MongoDB](../mongodb/how-to-provision-throughput.md), [API for Cassandra](../cassandra/how-to-provision-throughput.md), [API for Gremlin](../gremlin/how-to-provision-throughput.md) articles to provision the throughput.

## Azure portal

### Create new database or container with autoscale

1. Sign in to the [Azure portal](https://portal.azure.com) or the [Azure Cosmos DB explorer.](https://cosmos.azure.com/)

1. Navigate to your Azure Cosmos DB account and open the **Data Explorer** tab.

1. Select **New Container.** Enter a name for your database, container, and a partition key. Under database or container throughput, select the **Autoscale** option, and set the [maximum throughput (RU/s)](../provision-throughput-autoscale.md#how-autoscale-provisioned-throughput-works) that you want the database or container to scale to.

   :::image type="content" source="./media/how-to-provision-autoscale-throughput/create-new-autoscale-container.png" alt-text="Creating a container and configuring autoscale provisioned throughput":::

1. Select **OK**.

To provision autoscale on shared throughput database, select the **Provision database throughput** option when creating a new database. 

### Enable autoscale on existing database or container

1. Sign in to the [Azure portal](https://portal.azure.com) or the [Azure Cosmos DB explorer.](https://cosmos.azure.com/)

1. Navigate to your Azure Cosmos DB account and open the **Data Explorer** tab.

1. Select **Scale and Settings** for your container, or **Scale** for your database.

1. Under **Scale**, select the **Autoscale** option and **Save**.

   :::image type="content" source="./media/how-to-provision-autoscale-throughput/autoscale-scale-and-settings.png" alt-text="Enabling autoscale on an existing container":::

> [!NOTE]
> When you enable autoscale on an existing database or container, the starting value for max RU/s is determined by the system, based on your current manual provisioned throughput settings and storage. After the operation completes, you can change the max RU/s if needed. [Learn more.](../autoscale-faq.yml#how-does-the-migration-between-autoscale-and-standard--manual--provisioned-throughput-work-) 

## Azure Cosmos DB .NET V3 SDK

Use [version 3.9 or higher](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) of the Azure Cosmos DB .NET SDK for API for NoSQL to manage autoscale resources. 

> [!IMPORTANT]
> You can use the .NET SDK to create new autoscale resources. The SDK does not support migrating between autoscale and standard (manual) throughput. The migration scenario is currently supported in only the [Azure portal](#enable-autoscale-on-existing-database-or-container), [CLI](#azure-cli), and [PowerShell](#azure-powershell).

### Create database with shared throughput

```csharp
// Create instance of CosmosClient
CosmosClient cosmosClient = new CosmosClient(Endpoint, PrimaryKey);
 
// Autoscale throughput settings
ThroughputProperties autoscaleThroughputProperties = ThroughputProperties.CreateAutoscaleThroughput(1000); //Set autoscale max RU/s

//Create the database with autoscale enabled
database = await cosmosClient.CreateDatabaseAsync(DatabaseName, throughputProperties: autoscaleThroughputProperties);
```

### Create container with dedicated throughput

```csharp
// Get reference to database that container will be created in
Database database = await cosmosClient.GetDatabase("DatabaseName");

// Container and autoscale throughput settings
ContainerProperties autoscaleContainerProperties = new ContainerProperties("ContainerName", "/partitionKey");
ThroughputProperties autoscaleThroughputProperties = ThroughputProperties.CreateAutoscaleThroughput(1000); //Set autoscale max RU/s

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

## Azure Cosmos DB Java V4 SDK

You can use [version 4.0 or higher](https://mvnrepository.com/artifact/com.azure/azure-cosmos) of the Azure Cosmos DB Java SDK for API for NoSQL to manage autoscale resources.

> [!IMPORTANT]
> You can use the Java SDK to create new autoscale resources. The SDK does not support migrating between autoscale and standard (manual) throughput. The migration scenario is currently supported in only the [Azure portal](#enable-autoscale-on-existing-database-or-container), [CLI](#azure-cli), and [PowerShell](#azure-powershell).
### Create database with shared throughput

# [Async](#tab/api-async)

```java
// Create instance of CosmosClient
CosmosAsyncClient client = new CosmosClientBuilder()
    .setEndpoint(HOST)
    .setKey(PRIMARYKEY)
    .setConnectionPolicy(CONNECTIONPOLICY)
    .buildAsyncClient();

// Autoscale throughput settings
ThroughputProperties autoscaleThroughputProperties = ThroughputProperties.createAutoscaledThroughput(1000); //Set autoscale max RU/s

//Create the database with autoscale enabled
CosmosAsyncDatabase database = client.createDatabase(databaseName, autoscaleThroughputProperties).block().getDatabase();
```

# [Sync](#tab/api-sync)

```java
// Create instance of CosmosClient
CosmosClient client = new CosmosClientBuilder()
    .setEndpoint(HOST)
    .setKey(PRIMARYKEY)
    .setConnectionPolicy(CONNECTIONPOLICY)
    .buildClient();

// Autoscale throughput settings
ThroughputProperties autoscaleThroughputProperties = ThroughputProperties.createAutoscaledThroughput(1000); //Set autoscale max RU/s

//Create the database with autoscale enabled
CosmosDatabase database = client.createDatabase(databaseName, autoscaleThroughputProperties).getDatabase();
```

--- 

### Create container with dedicated throughput

# [Async](#tab/api-async)

```java
// Get reference to database that container will be created in
CosmosAsyncDatabase database = client.createDatabase("DatabaseName").block().getDatabase();

// Container and autoscale throughput settings
CosmosContainerProperties autoscaleContainerProperties = new CosmosContainerProperties("ContainerName", "/partitionKey");
ThroughputProperties autoscaleThroughputProperties = ThroughputProperties.createAutoscaledThroughput(1000); //Set autoscale max RU/s

// Create the container with autoscale enabled
CosmosAsyncContainer container = database.createContainer(autoscaleContainerProperties, autoscaleThroughputProperties, new CosmosContainerRequestOptions())
                                .block()
                                .getContainer();
```

# [Sync](#tab/api-sync)

```java
// Get reference to database that container will be created in
CosmosDatabase database = client.createDatabase("DatabaseName").getDatabase();

// Container and autoscale throughput settings
CosmosContainerProperties autoscaleContainerProperties = new CosmosContainerProperties("ContainerName", "/partitionKey");
ThroughputProperties autoscaleThroughputProperties = ThroughputProperties.createAutoscaledThroughput(1000); //Set autoscale max RU/s

// Create the container with autoscale enabled
CosmosContainer container = database.createContainer(autoscaleContainerProperties, autoscaleThroughputProperties, new CosmosContainerRequestOptions())
                                .getContainer();
```

--- 

### Read the current throughput (RU/s)

# [Async](#tab/api-async)

```java
// Get a reference to the resource
CosmosAsyncContainer container = client.getDatabase("DatabaseName").getContainer("ContainerName");

// Read the throughput on a resource
ThroughputProperties autoscaleContainerThroughput = container.readThroughput().block().getProperties();

// The autoscale max throughput (RU/s) of the resource
int autoscaleMaxThroughput = autoscaleContainerThroughput.getAutoscaleMaxThroughput();

// The throughput (RU/s) the resource is currently scaled to
int currentThroughput = autoscaleContainerThroughput.Throughput;
```

# [Sync](#tab/api-sync)

```java
// Get a reference to the resource
CosmosContainer container = client.getDatabase("DatabaseName").getContainer("ContainerName");

// Read the throughput on a resource
ThroughputProperties autoscaleContainerThroughput = container.readThroughput().getProperties();

// The autoscale max throughput (RU/s) of the resource
int autoscaleMaxThroughput = autoscaleContainerThroughput.getAutoscaleMaxThroughput();

// The throughput (RU/s) the resource is currently scaled to
int currentThroughput = autoscaleContainerThroughput.Throughput;
```

--- 

### Change the autoscale max throughput (RU/s)

# [Async](#tab/api-async)

```java
// Change the autoscale max throughput (RU/s)
container.replaceThroughput(ThroughputProperties.createAutoscaledThroughput(newAutoscaleMaxThroughput)).block();
```

# [Sync](#tab/api-sync)

```java
// Change the autoscale max throughput (RU/s)
container.replaceThroughput(ThroughputProperties.createAutoscaledThroughput(newAutoscaleMaxThroughput));
```

---

## Azure Resource Manager

Azure Resource Manager templates can be used to provision autoscale throughput on a new database or container-level resource for all Azure Cosmos DB APIs. See [Azure Resource Manager templates for Azure Cosmos DB](./samples-resource-manager-templates.md) for samples. By design, Azure Resource Manager templates cannot be used to migrate between provisioned and autoscale throughput on an existing resource. 

## Azure CLI

Azure CLI can be used to provision autoscale throughput on a new database or container-level resource for all Azure Cosmos DB APIs, or enable autoscale on an existing resource. For samples see [Azure CLI Samples for Azure Cosmos DB](cli-samples.md).

## Azure PowerShell

Azure PowerShell can be used to provision autoscale throughput on a new database or container-level resource for all Azure Cosmos DB APIs, or enable autoscale on an existing resource. For samples see [Azure PowerShell samples for Azure Cosmos DB](powershell-samples.md).

## Next steps

* Learn about the [benefits of provisioned throughput with autoscale](../provision-throughput-autoscale.md#benefits-of-autoscale).
* Learn how to [choose between manual and autoscale throughput](../how-to-choose-offer.md).
* Review the [autoscale FAQ](../autoscale-faq.yml).
