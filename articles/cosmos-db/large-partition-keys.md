---
title: Create containers with large partition keys
description: Learn how to create a container with large partition key using Azure portal and different SDKs. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 12/11/2018
ms.author: mjbrown
---

# Create containers with large partition keys 

Partition keys that are formed by composing multiple paths in the document are referred to as large partition keys. Large partition keys are typically larger than 100 bytes in size. Azure Cosmos DB now supports large partition keys with values up to 2 KB. 

Large partition keys are supported by using the functionality of an enhanced version of hash function, which can generate unique hash from larger partition keys. This hash version is also recommended for scenarios with high partition key cardinality irrespective of the size of the partition key. A Partition key cardinality is defined as the number of unique logical partitions, for example in the order of ~30000 logical partitions in a container. This article describes how to create a container with large partition key using Azure portal and different SDKs. 

## Create a container with a large partition key 

### .Net SDK 

When using the .Net SDK to create a container with large partition key, you should specify the “PartitionKeyDefinitionVersion.V2” property. The following example shows how to specify the Version property within the PartitionKeyDefinition object and set it to PartitionKeyDefinitionVersion.V2:

```csharp
DocumentCollection collection = await newClient.CreateDocumentCollectionAsync(
database,
     new DocumentCollection
        {
           Id = Guid.NewGuid().ToString(),
           PartitionKey = new PartitionKeyDefinition
           {
             Paths = new Collection<string> {“/longpartitionkey" },
             Version = PartitionKeyDefinitionVersion.V2
           }
         },
      new RequestOptions { OfferThroughput = 400 });
```

### Azure portal 

When you create a container using Azure portal, checking the **My partition key is larger than 100-bytes** option will allow you to create a large partition key. By default, all the new containers are opted into using the large partition keys. Unselect the checkbox if you don’t need large partition keys or if you have applications running on SDKs' version older than 1.18.

![Create large partition key using Azure portal](./media/large-partition-keys/large-partition-key-with-portal.png)
 
## Next steps

* [Partitioning in Azure Cosmos DB](partitioning-overview.md)
* [Request Units in Azure Cosmos DB](request-units.md)
* [Provision throughput on containers and databases](set-throughput.md)
* [Work with Azure Cosmos account](account-overview.md)


