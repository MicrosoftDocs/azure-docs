---
title: Migrate nonpartitioned Azure Cosmos DB containers to partitioned containers
description: Learn how to migrate all the existing nonpartitioned containers into partitioned containers.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 08/26/2021
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: devx-track-csharp
---

# Migrate nonpartitioned containers to partitioned containers
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB supports creating containers without a partition key. Currently you can create nonpartitioned containers by using Azure CLI and Azure Cosmos DB SDKs (.NET, Java, NodeJs) that have a version less than or equal to 2.x. You can't create nonpartitioned containers using the Azure portal. However, such nonpartitioned containers aren’t elastic and have fixed storage capacity of 20 GB and throughput limit of 10K RU/s.

The nonpartitioned containers are legacy and you should migrate your existing nonpartitioned containers to partitioned containers to scale storage and throughput. Azure Cosmos DB provides a system defined mechanism to migrate your nonpartitioned containers to partitioned containers. This document explains how all the existing nonpartitioned containers are auto-migrated into partitioned containers. You can take advantage of the auto-migration feature only if you're using the V3 version of SDKs in all the languages.

> [!NOTE]
> Currently, you cannot migrate Azure Cosmos DB MongoDB and API for Gremlin accounts by using the steps described in this document.

## Migrate container using the system defined partition key

To support the migration, Azure Cosmos DB provides a system defined partition key named `/_partitionkey` on all the containers that don’t have a partition key. You can't change the partition key definition after the containers are migrated. For example, the definition of a container that is migrated to a partitioned container will be as follows:

```json
{
    "Id": "CollId"
  "partitionKey": {
    "paths": [
      "/_partitionKey"
    ],
    "kind": "Hash"
  },
}
```

After the container is migrated, you can create documents by populating the `_partitionKey` property along with the other properties of the document. The `_partitionKey` property represents the partition key of your documents.

Choosing the right partition key is important to utilize the provisioned throughput optimally. For more information, see [how to choose a partition key](../partitioning-overview.md) article.

> [!NOTE]
> You can take advantage of system defined partition key only if you are using the latest/V3 version of SDKs in all the languages.

The following example shows a sample code to create a document with the system defined partition key and read that document:

**JSON representation of the document**

### [.NET SDK V3](#tab/dotnetv3)

```csharp
DeviceInformationItem = new DeviceInformationItem
{
   "id": "elevator/PugetSound/Building44/Floor1/1",
   "deviceId": "3cf4c52d-cc67-4bb8-b02f-f6185007a808",
   "_partitionKey": "3cf4c52d-cc67-4bb8-b02f-f6185007a808"
}

public class DeviceInformationItem
{
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }

    [JsonProperty(PropertyName = "deviceId")]
    public string DeviceId { get; set; }

    [JsonProperty(PropertyName = "_partitionKey", NullValueHandling = NullValueHandling.Ignore)]
    public string PartitionKey { get {return this.DeviceId; set; }
}

CosmosContainer migratedContainer = database.Containers["testContainer"];

DeviceInformationItem deviceItem = new DeviceInformationItem() {
  Id = "1234",
  DeviceId = "3cf4c52d-cc67-4bb8-b02f-f6185007a808"
}

ItemResponse<DeviceInformationItem > response =
  await migratedContainer.CreateItemAsync<DeviceInformationItem>(
    deviceItem.PartitionKey,
    deviceItem
  );

// Read back the document providing the same partition key
ItemResponse<DeviceInformationItem> readResponse =
  await migratedContainer.ReadItemAsync<DeviceInformationItem>(
    partitionKey: deviceItem.PartitionKey,
    id: device.Id
  );

```

For the complete sample, see the [.NET samples][1] GitHub repository.

## Migrate the documents

While the container definition is enhanced with a partition key property, the documents within the container aren’t auto migrated. Which means the system partition key property `/_partitionKey` path isn't automatically added to the existing documents. You need to repartition the existing documents by reading the documents that were created without a partition key and rewrite them back with `_partitionKey` property in the documents.

## Access documents that don't have a partition key

Applications can access the existing documents that don’t have a partition key by using the special system property called "PartitionKey.None", this is the value of the non-migrated documents. You can use this property in all the CRUD and query operations. The following example shows a sample to read a single Document from the NonePartitionKey.

```csharp
CosmosItemResponse<DeviceInformationItem> readResponse =
await migratedContainer.Items.ReadItemAsync<DeviceInformationItem>(
  partitionKey: PartitionKey.None,
  id: device.Id
);

```

### [Java SDK V4](#tab/javav4)

```java
static class Family {
  public String id;
  public String firstName;
  public String lastName;
  public String _partitionKey;

  public Family(String id, String firstName, String lastName, String _partitionKey) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this._partitionKey = _partitionKey;
  }
}

...

CosmosDatabase cosmosDatabase = cosmosClient.getDatabase("testdb");
CosmosContainer cosmosContainer = cosmosDatabase.getContainer("testcontainer");

//  Create single item
Family family = new Family("id-1", "John", "Doe", "Doe");
cosmosContainer.createItem(family, new PartitionKey(family._partitionKey), new CosmosItemRequestOptions());

//  Create items through bulk operations
family = new Family("id-2", "Jane", "Doe", "Doe");
CosmosItemOperation createItemOperation = CosmosBulkOperations.getCreateItemOperation(family,
    new PartitionKey(family._partitionKey));
cosmosContainer.executeBulkOperations(Collections.singletonList(createItemOperation));
```

For the complete sample, see the [Java samples][2] GitHub repository.

## Migrate the documents

While the container definition is enhanced with a partition key property, the documents within the container aren’t auto migrated. Which means the system partition key property `/_partitionKey` path isn't automatically added to the existing documents. You need to repartition the existing documents by reading the documents that were created without a partition key and rewrite them back with `_partitionKey` property in the documents.

## Access documents that don't have a partition key

Applications can access the existing documents that don’t have a partition key by using the special system property called "PartitionKey.None", this is the value of the non-migrated documents. You can use this property in all the CRUD and query operations. The following example shows a sample to read a single Document from the NonePartitionKey.

```java
CosmosItemResponse<JsonNode> cosmosItemResponse =
  cosmosContainer.readItem("itemId", PartitionKey.NONE, JsonNode.class);
```

For the complete sample on how to repartition the documents, see the [Java samples][2] GitHub repository.

---

## Compatibility with SDKs

Older version of Azure Cosmos DB SDKs such as V2.x.x and V1.x.x don’t support the system defined partition key property. So, when you read the container definition from an older SDK, it doesn’t contain any partition key definition and these containers will behave exactly as before. Applications that are built with the older version of SDKs continue to work with nonpartitioned as is without any changes.

If a migrated container is consumed by the latest/V3 version of SDK and you start populating the system defined partition key within the new documents, you can't access (read, update, delete, query) such documents from the older SDKs anymore.

## Known issues

**Querying for the count of items that were inserted without a partition key by using V3 SDK may involve higher throughput consumption**

If you query from the V3 SDK for the items that are inserted by using V2 SDK, or the items inserted by using the V3 SDK with `PartitionKey.None` parameter, the count query may consume more RU/s if the `PartitionKey.None` parameter is supplied in the FeedOptions. We recommend that you don't supply the `PartitionKey.None` parameter if no other items are inserted with a partition key.

If new items are inserted with different values for the partition key, querying for such item counts by passing the appropriate key in `FeedOptions` won't have any issues. After inserting new documents with partition key, if you need to query just the document count without the partition key value, that query may again incur higher RU/s similar to the regular partitioned collections.

## Next steps

* [Partitioning in Azure Cosmos DB](../partitioning-overview.md)
* [Request Units in Azure Cosmos DB](../request-units.md)
* [Provision throughput on containers and databases](../set-throughput.md)
* [Work with Azure Cosmos DB account](../resource-model.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB?
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md)
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)

[1]: https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/NonPartitionContainerMigration
[2]: https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/tree/main/src/main/java/com/azure/cosmos/examples/nonpartitioncontainercrud
