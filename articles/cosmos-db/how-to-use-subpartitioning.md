---
title: Use subpartitioned containers in Azure Cosmos DB SQL API
description: Learn how to create and perform operations on a subpartitioned container in Azure Cosmos DB SQL API using the .NET and Java SDK
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.date: 02/19/2021
ms.custom: 
---

# Work with subpartitioned containers in Azure Cosmos DB - SQL API (private preview)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

This article explains how to create and perform operations against a container with subpartitioning enabled. 

> [!IMPORTANT]
> This feature is currently in private preview. Please contact **Elasticity@service.microsoft.com** with your Azure Cosmos DB account name(s) to be onboarded to the preview. Currently, subpartitioning is supported in the .NET and Java SDK. Support for Portal, RP, PowerShell, and CLI, and other SDKs is planned and not yet available. 

## Azure Cosmos DB .NET and Java SDK
> [!NOTE]
> In the private preview, subpartitioning can only be enabled on new containers. The desired partition key paths must be specified at the time of container creation and cannot be changed later. 

Use [version 3.TBD](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) of the Azure Cosmos DB .NET SDK or [version 4.TBD](https://mvnrepository.com/artifact/com.azure/azure-cosmos) of the Java SDK for SQL API to work with subpartitioned containers. 


### Create new container with hierarchical partition keys


#### [.NET](#tab/dotnet-example)

```csharp
// List of partition keys, in hierarchical order. You can have up to three levels of keys.
List<string> subpartitionKeyPaths = new List<string> { "/TenantId", "/UserId", "/TransactionId" };

// Get reference to database that container will be created in
Database database = await cosmosClient.GetDatabase("DatabaseName");

// Create container - Subpartitioned by TenantId -> UserId 
ContainerProperties containerProperties = new ContainerProperties(id: "ContainerName", partitionKeyPaths: subpartitionKeyPaths);
container = await database.CreateContainerAsync(containerProperties, throughput: 400);
```

#### [Java](#tab/java-example)

```java
//TBD
```
--- 



### Add an item to a container 
#### [.NET](#tab/dotnet-example)
```csharp
public class PaymentEvent
{
    public string id { get; set; }
    public string TenantId { get; set; }
    public string UserId { get; set; }
    public string Status { get; set; }

}

// Get a reference to the container
Container container = cosmosClient.GetDatabase("DatabaseName").GetContainer("ContainerSubpartitionByTenantId_UserId");

// Create new item
PaymentEvent sampleEvent = new PaymentEvent()
{
    id = Guid.NewGuid().ToString(),
    TenantId = "Contoso",
    UserId = "Alice",
    Status = "Complete"
};

// Option 1: Specify the full partition key path when creating the item (recommended for best performance)
PartitionKey partitionKey = new PartitionKeyBuilder()
            .Add(sampleEvent.TenantId)
            .Add(sampleEvent.UserId)
            .Build();
ItemResponse<PaymentEvent> itemResponse1 = await container.CreateItemAsync(sampleEvent, partitionKey);

// Option 2: Pass in the object and the SDK will automatically extract the full partition key path
ItemResponse<PaymentEvent> itemResponse2 = await container.CreateItemAsync(sampleEvent);

```

#### [Java](#tab/java-example)

```java
//TBD
```
--- 

### Perform a key/value lookup (point read) of an item
Suppose we partition by TenantId -> UserId. The Id property is a Guid that represents a unique document transaction Id. To do a key value lookup (point read) on a single item, pass in the id of the item and the full value of the partition key path.  

#### [.NET](#tab/dotnet-example)

```csharp
// Get the full partition key path
var id = "0a70accf-ec5d-4c2b-99a7-af6e2ea33d3d"; 
var fullPartitionkeyPath = new PartitionKeyBuilder()
        .Add("Contoso") //TenantId
        .Add("Alice") //UserId
        .Build();
var itemResponse = await containerSubpartitionByTenantId_UserId.ReadItemAsync<dynamic>(id, fullPartitionkeyPath);
```

#### [Java](#tab/java-example)

```java
//TBD
```
--- 


### Run a query
The SDK code to run a query on a subpartitioned container is identical to running a query on a non-subpartitioned container. 

When the query specifies all values of the partition keys in the `WHERE` filter or a prefix of the key hierarchy, the SDK automatically routes the query to the corresponding physical partitions.  Queries that provide only the "middle" of the hierarchy will be cross partition queries. 

For example, suppose we subpartition by `TenantId` -> `UserId`. 
- The query, `"SELECT * FROM c WHERE c.TenantId = 'Contoso' AND c.UserId = 'Alice'"` will be routed to the single logical and physical partition that contains the data for the specified values of `TenantId` and `UserId`. 
- The query, `"SELECT * FROM c WHERE c.TenantId = 'Contoso'"` will be routed to only the subset of logical and physical partition(s) that contain data for the specified value of `TenantId`. This is a targeted cross-partition query and return data for all users in a tenant.
- The query, `"SELECT * FROM c WHERE c.UserId = 'Alice'"` will be routed to all physical partitions, resulting in a fanout cross-partition query. 

#### [.NET](#tab/dotnet-example)

```csharp
// This query will be a single-partition query, as it specifies the full partition key path (TenantId and UserId)
QueryDefinition query1 = new QueryDefinition(
    "SELECT * from c WHERE c.TenantId = @TenantIdInput AND c.UserId = @UserIdInput")
    .WithParameter("@TenantIdInput", "Contoso")
    .WithParameter("@UserIdInput", "Alice");

// This query will be a targeted-partition query, as it specifies the prefix path (TenantId).
QueryDefinition query2 = new QueryDefinition(
    "SELECT * from c WHERE c.TenantId = @TenantIdInput")
    .WithParameter("@TenantIdInput", "Contoso")


List<PaymentEvent> allPaymentEvents = new List<PaymentEvent>();
using (FeedIterator<PaymentEvent> resultSet = container.GetItemQueryIterator<PaymentEvent>(query1))
{
    while (resultSet.HasMoreResults)
    {
        FeedResponse<PaymentEvent> response = await resultSet.ReadNextAsync();
        PaymentEvent resultEvent = response.First();
        Console.WriteLine($"\nFound item with TenantId: {resultEvent.TenantId}; UserId: {resultEvent.UserId};");
        allPaymentEvents.AddRange(response);
    }
}
```

#### [Java](#tab/java-example)

```java
//TBD
```

--- 

## Azure portal
The Azure portal is not yet supported with subpartitioning.

## Azure Resource Manager

Azure Resource Manager templates are not yet supported with subpartitioning. 
## Azure CLI

Azure CLI is not yet supported with subpartitioning. 

## Azure PowerShell

Azure PowerShell is not yet supported with subpartitioning

## Next steps

* TBD

