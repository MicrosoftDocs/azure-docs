---
title: Troubleshoot Azure Cosmos DB not found exception
description: How to diagnose and fix not found exception
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Azure Cosmos DB not found
The HTTP status code 404 represents that the resource no longer exists.

## Expected behavior
There are many valid scenarios where an application is expecting a 404, and correctly handles the scenario.

## Not found was returned for an item that should exist or does exist
Below are the possible reason for a status code 404 to be returned if the item should or does exits.

### 1. Race condition
There are multiple SDK client instances and the read happened before the write.

#### Solution:
1. The default account consistency for Cosmos DB is Session consistency. When an item is created or updated, the response will return a session token that can be passed between SDK instances to guarantee that the read request is reading from a replica with that change.
2. Change the [consistency level](consistency-levels-choosing.md) to a [stronger level](consistency-levels-tradeoffs.md)

### 2. Invalid Partition Key and ID combination
The partition key and ID combination are not valid.

#### Solution:
Fix the application logic that is causing the incorrect combination. 

### 3. Invalid character in item ID
An item is inserted into Cosmos DB with an [invalid character](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.resource.id?view=azure-dotnet#remarks) in the item ID.

#### Solution:
It's recommended for users to change the ID to a different value that does not contain the special characters. If changing the ID is not an option you can Base64 encode the ID to escape the special characters.

Items already inserted in the container the ID can be replaced by using RID values instead of name based references.
```c#
// Get a container reference that use RID values
ContainerProperties containerProperties = await this.Container.ReadContainerAsync();
string[] selfLinkSegments = containerProperties.SelfLink.Split('/');
string databaseRid = selfLinkSegments[1];
string containerRid = selfLinkSegments[3];
Container containerByRid = this.cosmosClient.GetContainer(databaseRid, containerRid);

// List of invalid characters are listed here.
//https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.resource.id?view=azure-dotnet#remarks
FeedIterator<JObject> invalidItemsIterator = this.Container.GetItemQueryIterator<JObject>(
    @"select * from t where CONTAINS(t.id, ""/"") or CONTAINS(t.id, ""#"") or CONTAINS(t.id, ""?"") or CONTAINS(t.id, ""\\"") ");
while (invalidItemsIterator.HasMoreResults)
{
    foreach (JObject itemWithInvalidId in await invalidItemsIterator.ReadNextAsync())
    {
        // It recommend to chose a new ID that does not contain special characters, but
        // if that is not possible then it can be Base64 encoded to escape the special characters
        byte[] plainTextBytes = Encoding.UTF8.GetBytes(itemWithInvalidId["id"].ToString());
        itemWithInvalidId["id"] = Convert.ToBase64String(plainTextBytes);

        // Update the item with the new ID value using the rid based container reference
        JObject item = await containerByRid.ReplaceItemAsync<JObject>(
            item: itemWithInvalidId,
            ID: itemWithInvalidId["_rid"].ToString(),
            partitionKey: new Cosmos.PartitionKey(itemWithInvalidId["status"].ToString()));

        // Validate the new ID can be read using the original name based contianer reference
        await this.Container.ReadItemAsync<ToDoActivity>(
            item["id"].ToString(),
            new Cosmos.PartitionKey(item["status"].ToString())); ;
    }
}
```

### 4. Time To Live (TTL) purge
The item had the [Time To Live (TTL)](https://docs.microsoft.com/azure/cosmos-db/time-to-live) property set. The item was purged because the time to live had expired.

#### Solution:
Change the Time To Live to prevent the item from getting purged.

### 5. Lazy indexing
The [lazy indexing](index-policy.md#indexing-mode) has not caught up.

#### Solution:
Wait for the indexing to catch up or change the indexing policy

### 6. Parent resource deleted
The database and/or container that the item exists in has been deleted.

#### Solution:
1. [Restore](https://docs.microsoft.com/azure/cosmos-db/online-backup-and-restore#backup-retention-period) the parent resource or recreate the resources.
2. Create a new resource to replace the deleted resource

## Next steps
* [Diagnose and troubleshoot](troubleshoot-dot-net-sdk.md) issues when using Azure Cosmos DB .NET SDK
* Learn about performance guidelines for [.NET V3](performance-tips-dotnet-sdk-v3-sql.md) and [.NET V2](performance-tips.md)