---
title: Learn how to manage conflicts between regions in Azure Cosmos DB
description: Learn how to manage conflicts in Azure Cosmos DB
services: cosmos-db
author: christopheranderson

ms.service: cosmos-db
ms.topic: sample
ms.date: 10/17/2018
ms.author: chrande
---

# Manage conflicts between regions

## Create a custom conflict resolution policy

### <a id="create-custom-conflict-resolution-policy-dotnet">#.NET</a>

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

### <a id="create-custom-conflict-resolution-policy-java-async">Java Async</a>

```java
DocumentCollection collection = new DocumentCollection();
collection.setId(id);
ConflictResolutionPolicy policy = ConflictResolutionPolicy.createCustomPolicy();
collection.setConflictResolutionPolicy(policy);
DocumentCollection createdCollection = client.createCollection(databaseUri, collection, null).toBlocking().value();
```

### <a id="create-custom-conflict-resolution-policy-java-sync">Java Sync</a>

```java
DocumentCollection manualCollection = new DocumentCollection();
manualCollection.setId(this.manualCollectionName);
ConflictResolutionPolicy customPolicy = ConflictResolutionPolicy.createCustomPolicy(null);
manualCollection.setConflictResolutionPolicy(customPolicy);
DocumentCollection createdCollection = client.createCollection(database.getSelfLink(), collection, null).getResource();
```

### <a id="create-custom-conflict-resolution-policy-javascript">Node.js/JavaScript/TypeScript</a>

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

### <a id="create-custom-conflict-resolution-policy-python">Python</a>

```python
database = client.ReadDatabase("dbs/" + self.database_name)
manual_collection = {
                    'id': self.manual_collection_name,
                    'conflictResolutionPolicy': {
                          'mode': 'Custom'
                        }
                    }
manual_collection = client.CreateContainer(database['_self'], collection)
```

## Create a custom conflict resolution policy with stored procedure

### <a id="create-custom-conflict-resolution-policy-stored-proc-dotnet">.NET</a>

### <a id="create-custom-conflict-resolution-policy-stored-proc-java-async">Java Async</a>

### <a id="create-custom-conflict-resolution-policy-stored-proc-java-sync">Java Sync</a>

### <a id="create-custom-conflict-resolution-policy-stored-proc-javascript">Node.js/JavaScript/TypeScript</a>

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

You'll need to create the `resolver` stored procedure after the creation of your container.

### <a id="create-custom-conflict-resolution-policy-stored-proc-python">Python</a>

## Create a last writer wins conflict resolution policy

### <a id="create-custom-conflict-resolution-policy-lww-dotnet">.NET</a>

### <a id="create-custom-conflict-resolution-policy-lww-java-async">Java Async</a>

### <a id="create-custom-conflict-resolution-policy-lww-java-sync">Java Sync</a>

### <a id="create-custom-conflict-resolution-policy-lww-javascript">Node.js/JavaScript/TypeScript</a>

```javascript
const database = client.database(this.databaseName);
const { container: lwwContainer } = await database.containers.createIfNotExists(
  {
    id: this.lwwContainerName,
    conflictResolutionPolicy: {
      mode: "LastWriterWins",
      conflictResolutionPath: "/regionId"
    }
  }
);
```

If you omit the `conflictResolutionPath` property, it will default to the `_ts` property.

### <a id="create-custom-conflict-resolution-policy-lww-python">Python</a>

## Read from conflict feed

### <a id="read-from-conflict-feed-dotnet">.NET</a>

### <a id="read-from-conflict-feed-java-async">Java Async</a>

### <a id="read-from-conflict-feed-java-sync">Java Sync</a>

### <a id="read-from-conflict-feed-javascript">Node.js/JavaScript/TypeScript</a>

```javascript
const container = client
  .database(this.databaseName)
  .container(this.lwwContainerName);

const { result: conflicts } = await container.conflicts.readAll().toArray();
```

### <a id="read-from-conflict-feed-python">Python</a>
