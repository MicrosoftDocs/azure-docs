---
title: Create Azure Cosmos DB containers with large partition key
description: Learn how to create a container in Azure Cosmos DB with large partition key using Azure portal and different SDKs. 
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 12/8/2019
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: devx-track-csharp, ignite-2022, devx-track-dotnet
---

# Create containers with large partition key
[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

Azure Cosmos DB uses hash-based partitioning scheme to achieve horizontal scaling of data. All Azure Cosmos DB containers created before May 3, 2019 use a hash function that computes hash based on the first 101 bytes of the partition key. If there are multiple partition keys that have the same first 101 bytes, then those logical partitions are considered as the same logical partition by the service. This can lead to issues like partition size quota being incorrect, unique indexes being incorrectly applied across the partition keys, and uneven distribution of storage. Large partition keys are introduced to solve this issue. Azure Cosmos DB now supports large partition keys with values up to 2 KB.

Large partition keys are supported by enabling an enhanced version of the hash function, which can generate a unique hash from large partition keys up to 2 KB. 
As a best practice, unless you need support for an [older Azure Cosmos DB SDK or application that does not support this feature](#supported-sdk-versions), it is always recommended to configure your container with support for large partition keys. 

## Create a large partition key (Azure portal)

To create a large partition key, when you create a new container using the Azure portal, check the **My partition key is larger than 101-bytes** option. Unselect the checkbox if you don’t need large partition keys or if you have applications running on SDKs version older than 1.18.

:::image type="content" source="./media/large-partition-keys/large-partition-key-with-portal.png" alt-text="Create large partition keys using Azure portal":::

## Create a large partition key (PowerShell)

To create a container with large partition key support see,

* [Create an Azure Cosmos DB container with a large partition key size](manage-with-powershell.md#create-container-big-pk)

## Create a large partition key (.NET SDK)

To create a container with a large partition key using the .NET SDK, specify the `PartitionKeyDefinitionVersion.V2` property. The following example shows how to specify the Version property within the PartitionKeyDefinition object and set it to PartitionKeyDefinitionVersion.V2.

> [!NOTE]
> By default, all containers created using the .NET SDK V2 do not support large partition keys. By default, all containers created using the .NET SDK V3 support large partition keys.

# [.NET SDK V3](#tab/dotnetv3)

```csharp
await database.CreateContainerAsync(
    new ContainerProperties(collectionName, $"/longpartitionkey")
    {
        PartitionKeyDefinitionVersion = PartitionKeyDefinitionVersion.V2,
    })
```

# [.NET SDK V2](#tab/dotnetv2)

```csharp
DocumentCollection collection = await newClient.CreateDocumentCollectionAsync(
database,
     new DocumentCollection
        {
           Id = Guid.NewGuid().ToString(),
           PartitionKey = new PartitionKeyDefinition
           {
             Paths = new Collection<string> {"/longpartitionkey" },
             Version = PartitionKeyDefinitionVersion.V2
           }
         },
      new RequestOptions { OfferThroughput = 400 });
```
---

## Supported SDK versions

The Large partition keys are supported with the following minimum versions of SDKs:

|SDK type  | Minimum version   |
|---------|---------|
|.NET     |    1.18     |
|Java sync     |   2.4.0      |
|Java Async   |  2.5.0        |
| REST API | version higher than `2017-05-03` by using the `x-ms-version` request header.|
| Resource Manager template | version 2 by using the `"version":2` property within the `partitionKey` object. |

Currently, you cannot use containers with large partition key within in Power BI and Azure Logic Apps. You can use containers without a large partition key from these applications.

## Next steps

* [Partitioning in Azure Cosmos DB](partitioning-overview.md)
* [Request Units in Azure Cosmos DB](request-units.md)
* [Provision throughput on containers and databases](set-throughput.md)
* [Work with Azure Cosmos DB account](./resource-model.md)
