---
title: Manage conflicts between regions in Azure Cosmos DB
description: Learn how to manage conflicts in Azure Cosmos DB by creating the last-writer-wins or a custom conflict resolution policy
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 06/11/2020
ms.author: sidandrews
ms.reviewer: mjbrown
ms.devlang: csharp, java, javascript
ms.custom: devx-track-js, devx-track-csharp
---

# Manage conflict resolution policies in Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

With multi-region writes, when multiple clients write to the same item, conflicts may occur. When a conflict occurs, you can resolve the conflict by using different conflict resolution policies. This article describes how to manage conflict resolution policies.

> [!TIP]
> Conflict resolution policy can only be specified at container creation time and cannot be modified after container creation.

## Create a last-writer-wins conflict resolution policy

These samples show how to set up a container with a last-writer-wins conflict resolution policy. The default path for last-writer-wins is the timestamp field or the `_ts` property. For API for NoSQL, this may also be set to a user-defined path with a numeric type. In a conflict, the highest value wins. If the path isn't set or it's invalid, it defaults to `_ts`. Conflicts resolved with this policy do not show up in the conflict feed. This policy can be used by all APIs.

### <a id="create-custom-conflict-resolution-policy-lww-dotnet"></a>.NET SDK

# [.NET SDK V2](#tab/dotnetv2)

```csharp
DocumentCollection lwwCollection = await createClient.CreateDocumentCollectionIfNotExistsAsync(
  UriFactory.CreateDatabaseUri(this.databaseName), new DocumentCollection
  {
      Id = this.lwwCollectionName,
      ConflictResolutionPolicy = new ConflictResolutionPolicy
      {
          Mode = ConflictResolutionMode.LastWriterWins,
          ConflictResolutionPath = "/myCustomId",
      },
  });
```

# [.NET SDK V3](#tab/dotnetv3)

```csharp
Container container = await createClient.GetDatabase(this.databaseName)
    .CreateContainerIfNotExistsAsync(new ContainerProperties(this.lwwCollectionName, "/partitionKey")
    {
        ConflictResolutionPolicy = new ConflictResolutionPolicy()
        {
            Mode = ConflictResolutionMode.LastWriterWins,
            ResolutionPath = "/myCustomId",
        }
    });
```
---

### <a id="create-custom-conflict-resolution-policy-lww-javav4"></a> Java V4 SDK

# [Async](#tab/api-async)

   Java SDK V4 (Maven com.azure::azure-cosmos) Async API

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/async/SampleDocumentationSnippetsAsync.java?name=ManageConflictResolutionLWWAsync)]

# [Sync](#tab/api-sync)

   Java SDK V4 (Maven com.azure::azure-cosmos) Sync API

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/sync/SampleDocumentationSnippets.java?name=ManageConflictResolutionLWWSync)]

--- 

### <a id="create-custom-conflict-resolution-policy-lww-javav2"></a>Java V2 SDKs

# [Async Java V2 SDK](#tab/async)

[Async Java V2 SDK](sdk-java-async-v2.md) (Maven [com.microsoft.azure::azure-cosmosdb](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb))

```java
DocumentCollection collection = new DocumentCollection();
collection.setId(id);
ConflictResolutionPolicy policy = ConflictResolutionPolicy.createLastWriterWinsPolicy("/myCustomId");
collection.setConflictResolutionPolicy(policy);
DocumentCollection createdCollection = client.createCollection(databaseUri, collection, null).toBlocking().value();
```

# [Sync Java V2 SDK](#tab/sync)

[Sync Java V2 SDK](sdk-java-v2.md) (Maven [com.microsoft.azure::azure-documentdb](https://mvnrepository.com/artifact/com.microsoft.azure/azure-documentdb))

```java
DocumentCollection lwwCollection = new DocumentCollection();
lwwCollection.setId(this.lwwCollectionName);
ConflictResolutionPolicy lwwPolicy = ConflictResolutionPolicy.createLastWriterWinsPolicy("/myCustomId");
lwwCollection.setConflictResolutionPolicy(lwwPolicy);
DocumentCollection createdCollection = this.tryCreateDocumentCollection(createClient, database, lwwCollection);
```
---

### <a id="create-custom-conflict-resolution-policy-lww-javascript"></a>Node.js/JavaScript/TypeScript SDK

```javascript
const database = client.database(this.databaseName);
const { container: lwwContainer } = await database.containers.createIfNotExists(
  {
    id: this.lwwContainerName,
    conflictResolutionPolicy: {
      mode: "LastWriterWins",
      conflictResolutionPath: "/myCustomId"
    }
  }
);
```

### <a id="create-custom-conflict-resolution-policy-lww-python"></a>Python SDK

```python
database = client.get_database_client(database=database_id)
lww_conflict_resolution_policy = {'mode': 'LastWriterWins', 'conflictResolutionPath': '/regionId'}
lww_container = database.create_container(id=lww_container_id, partition_key=PartitionKey(path="/id"), 
    conflict_resolution_policy=lww_conflict_resolution_policy)
```

## Create a custom conflict resolution policy using a stored procedure

These samples show how to set up a container with a custom conflict resolution policy. This policy uses the logic in a stored procedure to resolve the conflict. If a stored procedure is designated to resolve conflicts, conflicts won't show up in the conflict feed unless there's an error in the designated stored procedure.

After the policy is created with the container, you need to create the stored procedure. The .NET SDK sample below shows an example of this workflow. This policy is supported in the API for NoSQL  only.

### Sample custom conflict resolution stored procedure

Custom conflict resolution stored procedures must be implemented using the function signature shown below. The function name does not need to match the name used when registering the stored procedure with the container but it does simplify naming. Here is a description of the parameters that must be implemented for this stored procedure.

- **incomingItem**: The item being inserted or updated in the commit that is generating the conflicts. Is null for delete operations.
- **existingItem**: The currently committed item. This value is non-null in an update and null for an insert or deletes.
- **isTombstone**: Boolean indicating if the incomingItem is conflicting with a previously deleted item. When true, existingItem is also null.
- **conflictingItems**: Array of the committed version of all items in the container that are conflicting with incomingItem on ID or any other unique index properties.

> [!IMPORTANT]
> Just as with any stored procedure, a custom conflict resolution procedure can access any data with the same partition key and can perform any insert, update or delete operation to resolve conflicts.

This sample stored procedure resolves conflicts by selecting the lowest value from the `/myCustomId` path.

```javascript
function resolver(incomingItem, existingItem, isTombstone, conflictingItems) {
  var collection = getContext().getCollection();

  if (!incomingItem) {
      if (existingItem) {

          collection.deleteDocument(existingItem._self, {}, function (err, responseOptions) {
              if (err) throw err;
          });
      }
  } else if (isTombstone) {
      // delete always wins.
  } else {
      if (existingItem) {
          if (incomingItem.myCustomId > existingItem.myCustomId) {
              return; // existing item wins
          }
      }

      var i;
      for (i = 0; i < conflictingItems.length; i++) {
          if (incomingItem.myCustomId > conflictingItems[i].myCustomId) {
              return; // existing conflict item wins
          }
      }

      // incoming item wins - clear conflicts and replace existing with incoming.
      tryDelete(conflictingItems, incomingItem, existingItem);
  }

  function tryDelete(documents, incoming, existing) {
      if (documents.length > 0) {
          collection.deleteDocument(documents[0]._self, {}, function (err, responseOptions) {
              if (err) throw err;

              documents.shift();
              tryDelete(documents, incoming, existing);
          });
      } else if (existing) {
          collection.replaceDocument(existing._self, incoming,
              function (err, documentCreated) {
                  if (err) throw err;
              });
      } else {
          collection.createDocument(collection.getSelfLink(), incoming,
              function (err, documentCreated) {
                  if (err) throw err;
              });
      }
  }
}
```

### <a id="create-custom-conflict-resolution-policy-stored-proc-dotnet"></a>.NET SDK

# [.NET SDK V2](#tab/dotnetv2)

```csharp
DocumentCollection udpCollection = await createClient.CreateDocumentCollectionIfNotExistsAsync(
  UriFactory.CreateDatabaseUri(this.databaseName), new DocumentCollection
  {
      Id = this.udpCollectionName,
      ConflictResolutionPolicy = new ConflictResolutionPolicy
      {
          Mode = ConflictResolutionMode.Custom,
          ConflictResolutionProcedure = string.Format("dbs/{0}/colls/{1}/sprocs/{2}", this.databaseName, this.udpCollectionName, "resolver"),
      },
  });

//Create the stored procedure
await clients[0].CreateStoredProcedureAsync(
UriFactory.CreateStoredProcedureUri(this.databaseName, this.udpCollectionName, "resolver"), new StoredProcedure
{
    Id = "resolver",
    Body = File.ReadAllText(@"resolver.js")
});
```

# [.NET SDK V3](#tab/dotnetv3)

```csharp
Container container = await createClient.GetDatabase(this.databaseName)
    .CreateContainerIfNotExistsAsync(new ContainerProperties(this.udpCollectionName, "/partitionKey")
    {
        ConflictResolutionPolicy = new ConflictResolutionPolicy()
        {
            Mode = ConflictResolutionMode.Custom,
            ResolutionProcedure = string.Format("dbs/{0}/colls/{1}/sprocs/{2}", this.databaseName, this.udpCollectionName, "resolver")
        }
    });

await container.Scripts.CreateStoredProcedureAsync(
    new StoredProcedureProperties("resolver", File.ReadAllText(@"resolver.js"))
);
```
---

### <a id="create-custom-conflict-resolution-policy-stored-proc-javav4"></a> Java V4 SDK

# [Async](#tab/api-async)

   Java SDK V4 (Maven com.azure::azure-cosmos) Async API

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/async/SampleDocumentationSnippetsAsync.java?name=ManageConflictResolutionSprocAsync)]

# [Sync](#tab/api-sync)

   Java SDK V4 (Maven com.azure::azure-cosmos) Sync API

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/sync/SampleDocumentationSnippets.java?name=ManageConflictResolutionSprocSync)]

--- 

### <a id="create-custom-conflict-resolution-policy-stored-proc-javav2"></a>Java V2 SDKs

# [Async Java V2 SDK](#tab/async)

[Async Java V2 SDK](sdk-java-async-v2.md) (Maven [com.microsoft.azure::azure-cosmosdb](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb))

```java
DocumentCollection collection = new DocumentCollection();
collection.setId(id);
ConflictResolutionPolicy policy = ConflictResolutionPolicy.createCustomPolicy("resolver");
collection.setConflictResolutionPolicy(policy);
DocumentCollection createdCollection = client.createCollection(databaseUri, collection, null).toBlocking().value();
```

# [Sync Java V2 SDK](#tab/sync)

[Sync Java V2 SDK](sdk-java-v2.md) (Maven [com.microsoft.azure::azure-documentdb](https://mvnrepository.com/artifact/com.microsoft.azure/azure-documentdb))

```java
DocumentCollection udpCollection = new DocumentCollection();
udpCollection.setId(this.udpCollectionName);
ConflictResolutionPolicy udpPolicy = ConflictResolutionPolicy.createCustomPolicy(
        String.format("dbs/%s/colls/%s/sprocs/%s", this.databaseName, this.udpCollectionName, "resolver"));
udpCollection.setConflictResolutionPolicy(udpPolicy);
DocumentCollection createdCollection = this.tryCreateDocumentCollection(createClient, database, udpCollection);
```
---

After your container is created, you must create the `resolver` stored procedure.

### <a id="create-custom-conflict-resolution-policy-stored-proc-javascript"></a>Node.js/JavaScript/TypeScript SDK

```javascript
const database = client.database(this.databaseName);
const { container: udpContainer } = await database.containers.createIfNotExists(
  {
    id: this.udpContainerName,
    conflictResolutionPolicy: {
      mode: "Custom",
      conflictResolutionProcedure: `dbs/${this.databaseName}/colls/${
        this.udpContainerName
      }/sprocs/resolver`
    }
  }
);
```

After your container is created, you must create the `resolver` stored procedure.

### <a id="create-custom-conflict-resolution-policy-stored-proc-python"></a>Python SDK

```python
database = client.get_database_client(database=database_id)
udp_custom_resolution_policy = {'mode': 'Custom' }
udp_container = database.create_container(id=udp_container_id, partition_key=PartitionKey(path="/id"),
    conflict_resolution_policy=udp_custom_resolution_policy)
```

After your container is created, you must create the `resolver` stored procedure.

## Create a custom conflict resolution policy

These samples show how to set up a container with a custom conflict resolution policy. With this implementation, each conflict will show up in the conflict feed. It's up to you to handle the conflicts individually from the conflict feed.

### <a id="create-custom-conflict-resolution-policy-dotnet"></a>.NET SDK

# [.NET SDK V2](#tab/dotnetv2)

```csharp
DocumentCollection manualCollection = await createClient.CreateDocumentCollectionIfNotExistsAsync(
  UriFactory.CreateDatabaseUri(this.databaseName), new DocumentCollection
  {
      Id = this.manualCollectionName,
      ConflictResolutionPolicy = new ConflictResolutionPolicy
      {
          Mode = ConflictResolutionMode.Custom,
      },
  });
```

# [.NET SDK V3](#tab/dotnetv3)

```csharp
Container container = await createClient.GetDatabase(this.databaseName)
    .CreateContainerIfNotExistsAsync(new ContainerProperties(this.manualCollectionName, "/partitionKey")
    {
        ConflictResolutionPolicy = new ConflictResolutionPolicy()
        {
            Mode = ConflictResolutionMode.Custom
        }
    });
```
---

### <a id="create-custom-conflict-resolution-policy-javav4"></a> Java V4 SDK

# [Async](#tab/api-async)

   Java SDK V4 (Maven com.azure::azure-cosmos) Async API

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/async/SampleDocumentationSnippetsAsync.java?name=ManageConflictResolutionCustomAsync)]

# [Sync](#tab/api-sync)

   Java SDK V4 (Maven com.azure::azure-cosmos) Sync API

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/sync/SampleDocumentationSnippets.java?name=ManageConflictResolutionCustomSync)]

--- 

### <a id="create-custom-conflict-resolution-policy-javav2"></a>Java V2 SDKs

# [Async Java V2 SDK](#tab/async)

[Async Java V2 SDK](sdk-java-async-v2.md) (Maven [com.microsoft.azure::azure-cosmosdb](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb))

```java
DocumentCollection collection = new DocumentCollection();
collection.setId(id);
ConflictResolutionPolicy policy = ConflictResolutionPolicy.createCustomPolicy();
collection.setConflictResolutionPolicy(policy);
DocumentCollection createdCollection = client.createCollection(databaseUri, collection, null).toBlocking().value();
```

# [Sync Java V2 SDK](#tab/sync)

[Sync Java V2 SDK](sdk-java-v2.md) (Maven [com.microsoft.azure::azure-documentdb](https://mvnrepository.com/artifact/com.microsoft.azure/azure-documentdb))

```java
DocumentCollection manualCollection = new DocumentCollection();
manualCollection.setId(this.manualCollectionName);
ConflictResolutionPolicy customPolicy = ConflictResolutionPolicy.createCustomPolicy(null);
manualCollection.setConflictResolutionPolicy(customPolicy);
DocumentCollection createdCollection = client.createCollection(database.getSelfLink(), collection, null).getResource();
```
---

### <a id="create-custom-conflict-resolution-policy-javascript"></a>Node.js/JavaScript/TypeScript SDK

```javascript
const database = client.database(this.databaseName);
const {
  container: manualContainer
} = await database.containers.createIfNotExists({
  id: this.manualContainerName,
  conflictResolutionPolicy: {
    mode: "Custom"
  }
});
```

### <a id="create-custom-conflict-resolution-policy-python"></a>Python SDK

```python
database = client.get_database_client(database=database_id)
manual_resolution_policy = {'mode': 'Custom'}
manual_container = database.create_container(id=manual_container_id, partition_key=PartitionKey(path="/id"), 
    conflict_resolution_policy=manual_resolution_policy)
```

## Read from conflict feed

These samples show how to read from a container's conflict feed. Conflicts may show up in the conflict feed only for a couple of reasons:

- The conflict was not resolved automatically
- The conflict caused an error with the designated stored procedure
- The conflict resolution policy is set to **custom** and does not designate a stored procedure to handle conflicts

### <a id="read-from-conflict-feed-dotnet"></a>.NET SDK

# [.NET SDK V2](#tab/dotnetv2)

```csharp
FeedResponse<Conflict> conflicts = await delClient.ReadConflictFeedAsync(this.collectionUri);
```

# [.NET SDK V3](#tab/dotnetv3)

```csharp
FeedIterator<ConflictProperties> conflictFeed = container.Conflicts.GetConflictQueryIterator();
while (conflictFeed.HasMoreResults)
{
    FeedResponse<ConflictProperties> conflicts = await conflictFeed.ReadNextAsync();
    foreach (ConflictProperties conflict in conflicts)
    {
        // Read the conflicted content
        MyClass intendedChanges = container.Conflicts.ReadConflictContent<MyClass>(conflict);
        MyClass currentState = await container.Conflicts.ReadCurrentAsync<MyClass>(conflict, new PartitionKey(intendedChanges.MyPartitionKey));

        // Do manual merge among documents
        await container.ReplaceItemAsync<MyClass>(intendedChanges, intendedChanges.Id, new PartitionKey(intendedChanges.MyPartitionKey));

        // Delete the conflict
        await container.Conflicts.DeleteAsync(conflict, new PartitionKey(intendedChanges.MyPartitionKey));
    }
}
```
---

### <a id="read-from-conflict-feed-javav2"></a>Java V2 SDKs

# [Async Java V2 SDK](#tab/async)

[Async Java V2 SDK](sdk-java-async-v2.md) (Maven [com.microsoft.azure::azure-cosmosdb](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb))

```java
FeedResponse<Conflict> response = client.readConflicts(this.manualCollectionUri, null)
                    .first().toBlocking().single();
for (Conflict conflict : response.getResults()) {
    /* Do something with conflict */
}
```
# [Sync Java V2 SDK](#tab/sync)

[Sync Java V2 SDK](sdk-java-v2.md) (Maven [com.microsoft.azure::azure-documentdb](https://mvnrepository.com/artifact/com.microsoft.azure/azure-documentdb))

```java
Iterator<Conflict> conflictsIterator = client.readConflicts(this.collectionLink, null).getQueryIterator();
while (conflictsIterator.hasNext()) {
    Conflict conflict = conflictsIterator.next();
    /* Do something with conflict */
}
```
---

### <a id="read-from-conflict-feed-javascript"></a>Node.js/JavaScript/TypeScript SDK

```javascript
const container = client
  .database(this.databaseName)
  .container(this.lwwContainerName);

const { result: conflicts } = await container.conflicts.readAll().toArray();
```

### <a id="read-from-conflict-feed-python"></a>Python

```python
conflicts_iterator = iter(container.list_conflicts())
conflict = next(conflicts_iterator, None)
while conflict:
    # Do something with conflict
    conflict = next(conflicts_iterator, None)
```

## Next steps

Learn about the following Azure Cosmos DB concepts:

- [Global distribution - under the hood](../global-dist-under-the-hood.md)
- [How to configure multi-region writes in your applications](how-to-multi-master.md)
- [Configure clients for multihoming](../how-to-manage-database-account.md#configure-multiple-write-regions)
- [Add or remove regions from your Azure Cosmos DB account](../how-to-manage-database-account.md#addremove-regions-from-your-database-account)
- [How to configuremulti-region writes in your applications](how-to-multi-master.md).
- [Partitioning and data distribution](../partitioning-overview.md)
- [Indexing in Azure Cosmos DB](../index-policy.md)
