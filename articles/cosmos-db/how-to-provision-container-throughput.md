---
title: Provision container throughput in Azure Cosmos DB SQL API
description: Learn how to provision throughput at the container level in Azure Cosmos DB SQL API using Azure portal, CLI, PowerShell and various other SDKs. 
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.date: 10/14/2020
ms.author: mjbrown
ms.custom: devx-track-js, devx-track-azurecli, devx-track-csharp
---

# Provision standard (manual) throughput on an Azure Cosmos container - SQL API
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

This article explains how to provision standard (manual) throughput on a container in Azure Cosmos DB SQL API. You can provision throughput on a single container, or [provision throughput on a database](how-to-provision-database-throughput.md) and share it among the containers within the database. You can provision throughput on a container using Azure portal, Azure CLI, or Azure Cosmos DB SDKs.

If you are using a different API, see [API for MongoDB](mongodb/how-to-provision-throughput-mongodb.md), [Cassandra API](cassandra/how-to-provision-throughput-cassandra.md), [Gremlin API](how-to-provision-throughput-gremlin.md) articles to provision the throughput.

## Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos account](create-sql-api-dotnet.md#create-account), or select an existing Azure Cosmos account.

1. Open the **Data Explorer** pane, and select **New Container**. Next, provide the following details:

   * Indicate whether you are creating a new database or using an existing one.
   * Enter a **Container Id**.
   * Enter a **Partition key** value (for example, `/ItemID`).
   * Select **Autoscale** or **Manual** throughput and enter the required **Container throughput** (for example, 1000 RU/s). Enter a throughput that you want to provision (for example, 1000 RUs).
   * Select **OK**.

    :::image type="content" source="./media/how-to-provision-container-throughput/provision-container-throughput-portal-sql-api.png" alt-text="Screenshot of Data Explorer, with New Collection highlighted":::

## Azure CLI or PowerShell

To create a container with dedicated throughput see,

* [Create a container using Azure CLI](manage-with-cli.md#create-a-container)
* [Create a container using PowerShell](manage-with-powershell.md#create-container)

## .NET SDK

> [!Note]
> Use the Cosmos SDKs for SQL API to provision throughput for all Cosmos DB APIs, except Cassandra and MongoDB API.

# [.NET SDK V2](#tab/dotnetv2)

```csharp
// Create a container with a partition key and provision throughput of 400 RU/s
DocumentCollection myCollection = new DocumentCollection();
myCollection.Id = "myContainerName";
myCollection.PartitionKey.Paths.Add("/myPartitionKey");

await client.CreateDocumentCollectionAsync(
    UriFactory.CreateDatabaseUri("myDatabaseName"),
    myCollection,
    new RequestOptions { OfferThroughput = 400 });
```

# [.NET SDK V3](#tab/dotnetv3)

[!code-csharp[](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos/tests/Microsoft.Azure.Cosmos.Tests/SampleCodeForDocs/ContainerDocsSampleCode.cs?name=ContainerCreateWithThroughput)]

---

## JavaScript SDK

```javascript
// Create a new Client
const client = new CosmosClient({ endpoint, key });

// Create a database
const { database } = await client.databases.createIfNotExists({ id: "databaseId" });

// Create a container with the specified throughput
const { resource } = await database.containers.createIfNotExists({
id: "containerId",
throughput: 1000
});

// To update an existing container or databases throughput, you need to user the offers API
// Get all the offers
const { resources: offers } = await client.offers.readAll().fetchAll();

// Find the offer associated with your container or the database
const offer = offers.find((_offer) => _offer.offerResourceId === resource._rid);

// Change the throughput value
offer.content.offerThroughput = 2000;

// Replace the offer.
await client.offer(offer.id).replace(offer);
```

## Next steps

See the following articles to learn about throughput provisioning in Azure Cosmos DB:

* [How to provision standard (manual) throughput on a database](how-to-provision-database-throughput.md)
* [How to provision autoscale throughput on a database](how-to-provision-autoscale-throughput.md)
* [Request units and throughput in Azure Cosmos DB](request-units.md)
