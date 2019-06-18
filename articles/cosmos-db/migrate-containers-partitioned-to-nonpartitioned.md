---
title: Migrate non-partitioned Azure Cosmos DB containers to partitioned containers
description: Learn how to migrate all the existing non-partitioned containers into partitioned containers.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: mjbrown
---

# Migrate non-partitioned containers to partitioned containers

Azure Cosmos DB supports creating containers without a partition key. Currently you can create non-partitioned containers by using Azure CLI and Azure Cosmos DB SDKs (.Net, Java, NodeJs) that have a version less than or equal to 2.x. You cannot create non-partitioned containers using the Azure portal. However, such non-partitioned containers aren’t elastic and have fixed storage capacity of 10 GB and throughput limit of 10K RU/s.

The non-partitioned containers are legacy and you should migrate your existing non-partitioned containers to partitioned containers to scale storage and throughput. Azure Cosmos DB provides a system defined mechanism to migrate your non-partitioned containers to partitioned containers. This document explains how all the existing non-partitioned containers are auto-migrated into partitioned containers. You can take advantage of the auto-migration feature only if you are using the V3 version of SDKs in all the languages.

> [!NOTE] 
> Currently, you cannot migrate Azure Cosmos DB MongoDB and Gremlin API accounts by using the steps described in this document. 

## Migrate container using the system defined partition key

To support the migration, Azure Cosmos DB defines a system defined partition key named `/_partitionkey` on all the containers that don’t have a partition key. You cannot change the partition key definition after the containers are migrated. For example, the definition of a container that is migrated to a partitioned container will be as follows: 

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

Choosing the right partition key is important to utilize the provisioned throughput optimally. For more information, see [how to choose a partition key](partitioning-overview.md) article. 

> [!NOTE]
> You can take advantage of system defined partition key only if you are using the latest/V3 version of SDKs in all the languages.

The following example shows a sample code to create a document with the system defined partition key and read that document:

**JSON representation of the document**

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

    [JsonProperty(PropertyName = "_partitionKey")]
    public string PartitionKey {get {return this.DeviceId; set; }
}

CosmosContainer migratedContainer = database.Containers["testContainer"];

DeviceInformationItem deviceItem = new DeviceInformationItem() {
  Id = "1234", 
  DeviceId = "3cf4c52d-cc67-4bb8-b02f-f6185007a808"
} 

CosmosItemResponse<DeviceInformationItem > response = 
  await migratedContainer.Items.CreateItemAsync(
    deviceItem.PartitionKey, 
    deviceItem
  );

// Read back the document providing the same partition key
CosmosItemResponse<DeviceInformationItem> readResponse = 
  await migratedContainer.Items.ReadItemAsync<DeviceInformationItem>( 
    partitionKey:deviceItem.PartitionKey, 
    id: device.Id
  ); 

```

For the complete sample, see the [.Net samples](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/CodeSamples) GitHub repository. 
                      
## Migrate the documents

While the container definition is enhanced with a partition key property, the documents within the container aren’t auto migrated. Which means the system partition key property `/_partitionKey` path is not automatically added to the existing documents. You need to repartition the existing documents by reading the documents that were created without a partition key and rewrite them back with `_partitionKey` property in the documents. 

## Access documents that don't have a partition key

Applications can access the existing documents that don’t have a partition key by using the special system property called "CosmosContainerSettings.NonePartitionKeyValue", this is the value of the non-migrated documents. You can use this property in all the CRUD and query operations. The following example shows a sample to read a single Document from the NonePartitionKey. 

```csharp
CosmosItemResponse<DeviceInformationItem> readResponse = 
await migratedContainer.Items.ReadItemAsync<DeviceInformationItem>( 
  partitionKey: CosmosContainerSettings.NonePartitionKeyValue, 
  id: device.Id
); 

```

For the complete sample on how to repartition the documents, see the [.Net samples](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/CodeSamples) GitHub repository. 

## Compatibility with SDKs

Older version of Azure Cosmos DB SDKs such as V2.x.x and V1.x.x don’t support the system defined partition key property. So, when you read the container definition from an older SDK, it doesn’t contain any partition key definition and these containers will behave exactly as before. Applications that are built with the older version of SDKs continue to work with non-partitioned as is without any changes. 

If a migrated container is consumed by the latest/V3 version of SDK and you start populating the system defined partition key within the new documents, you cannot access (read, update, delete, query) such documents from the older SDKs anymore.

## Next steps

* [Partitioning in Azure Cosmos DB](partitioning-overview.md)
* [Request Units in Azure Cosmos DB](request-units.md)
* [Provision throughput on containers and databases](set-throughput.md)
* [Work with Azure Cosmos account](account-overview.md)