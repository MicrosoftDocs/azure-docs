---
title: Create a container in Azure Cosmos DB Gremlin API
description: Learn how to create a container in Azure Cosmos DB Gremlin API by using Azure portal, .NET and other SDKs. 
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: how-to
ms.date: 10/16/2020
author: manishmsfte
ms.author: mansha 
ms.custom: devx-track-csharp
---

# Create a container in Azure Cosmos DB Gremlin API
[!INCLUDE[appliesto-gremlin-api](includes/appliesto-gremlin-api.md)]

This article explains the different ways to create a container in Azure Cosmos DB Gremlin API. It shows how to create a container using Azure portal, Azure CLI, PowerShell, or supported SDKs. This article demonstrates how to create a container, specify the partition key, and provision throughput.

This article explains the different ways to create a container in Azure Cosmos DB Gremlin API. If you are using a different API, see [API for MongoDB](how-to-create-container-mongodb.md), [Cassandra API](cassandra/how-to-create-container-cassandra.md), [Table API](table/how-to-create-container.md), and [SQL API](how-to-create-container.md) articles to create the container.

> [!NOTE]
> When creating containers, make sure you don’t create two containers with the same name but different casing. That’s because some parts of the Azure platform are not case-sensitive, and this can result in confusion/collision of telemetry and actions on containers with such names.

## <a id="portal-gremlin"></a>Create using Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos account](create-graph-dotnet.md#create-a-database-account), or select an existing account.

1. Open the **Data Explorer** pane, and select **New Graph**. Next, provide the following details:

   * Indicate whether you are creating a new database, or using an existing one.
   * Enter a Graph ID.
   * Select **Unlimited** storage capacity.
   * Enter a partition key for vertices.
   * Enter a throughput to be provisioned (for example, 1000 RUs).
   * Select **OK**.

    :::image type="content" source="./media/how-to-create-container/partitioned-collection-create-gremlin.png" alt-text="Screenshot of Gremlin API, Add Graph dialog box":::

## <a id="dotnet-sql-graph"></a>Create using .NET SDK

If you encounter timeout exception when creating a collection, do a read operation to validate if the collection was created successfully. The read operation throws an exception until the collection create operation is successful. For the list of status codes supported by the create operation see the [HTTP Status Codes for Azure Cosmos DB](/rest/api/cosmos-db/http-status-codes-for-cosmosdb) article.

```csharp
// Create a container with a partition key and provision 1000 RU/s throughput.
DocumentCollection myCollection = new DocumentCollection();
myCollection.Id = "myContainerName";
myCollection.PartitionKey.Paths.Add("/myPartitionKey");

await client.CreateDocumentCollectionAsync(
    UriFactory.CreateDatabaseUri("myDatabaseName"),
    myCollection,
    new RequestOptions { OfferThroughput = 1000 });
```

## <a id="cli-mongodb"></a>Create using Azure CLI

[Create a Gremlin graph with Azure CLI](./scripts/cli/gremlin/create.md). For a listing of all Azure CLI samples across all Azure Cosmos DB APIs see, [Azure CLI samples for Azure Cosmos DB](cli-samples.md).

## Create using PowerShell

[Create a Gremlin graph with PowerShell](./scripts/powershell/gremlin/create.md). For a listing of all PowerShell samples across all Azure Cosmos DB APIs see, [PowerShell Samples](powershell-samples.md)

## Next steps

* [Partitioning in Azure Cosmos DB](partitioning-overview.md)
* [Request Units in Azure Cosmos DB](request-units.md)
* [Provision throughput on containers and databases](set-throughput.md)
* [Work with Azure Cosmos account](./account-databases-containers-items.md)