---
title: Define unique keys for an Azure Cosmos container
description: Learn how to define unique keys for an Azure Cosmos container
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/23/2019
ms.author: thweiss
---

# Define unique keys for an Azure Cosmos container

This article presents the different ways to define [unique keys](unique-keys.md) when creating an Azure Cosmos container. It's currently possible to perform this operation either by using the Azure portal or through one of the SDKs.

## Use the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos account](create-sql-api-dotnet.md#create-account) or select an existing one.

1. Open the **Data Explorer** pane and select the container that you want to work on.

1. Click on **New Container**.

1. In the **Add Container** dialog, click on **+ Add unique key** to add a unique key entry.

1. Enter the path(s) of the unique key constraint

1. If needed, add more unique key entries by clicking on **+ Add unique key**

![Screenshot of unique key constraint entry on Azure portal](./media/how-to-define-unique-keys/unique-keys-portal.png)

## Use the .NET SDK V2

When creating a new container using the [.NET SDK v2](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/), a `UniqueKeyPolicy` object can be used to define unique key constraints.

```csharp
client.CreateDocumentCollectionAsync(UriFactory.CreateDatabaseUri("database"), new DocumentCollection
{
    Id = "container",
    UniqueKeyPolicy = new UniqueKeyPolicy
    {
        UniqueKeys = new Collection<UniqueKey>(new List<UniqueKey>
        {
            new UniqueKey { Paths = new Collection<string>(new List<string> { "/firstName", "/lastName", "emailAddress" }) },
            new UniqueKey { Paths = new Collection<string>(new List<string> { "/address/zipCode" }) }
        })
    }
});
```

## Use the Java SDK

When creating a new container using the [Java SDK](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb), a `UniqueKeyPolicy` object can be used to define unique key constraints.

```java
// create a new DocumentCollection object
DocumentCollection container = new DocumentCollection();
container.setId("container");
// create array of strings and populate them with the unique key paths
Collection<String> uniqueKey1Paths = new ArrayList<String>();
uniqueKey1Paths.add("/firstName");
uniqueKey1Paths.add("/lastName");
uniqueKey1Paths.add("/emailAddress");
Collection<String> uniqueKey2Paths = new ArrayList<String>();
uniqueKey2Paths.add("/address/zipCode");
// create UniqueKey objects and set their paths
UniqueKey uniqueKey1 = new UniqueKey();
UniqueKey uniqueKey2 = new UniqueKey();
uniqueKey1.setPaths(uniqueKey1Paths);
uniqueKey2.setPaths(uniqueKey2Paths);
// create a new UniqueKeyPolicy object and set its unique keys
UniqueKeyPolicy uniqueKeyPolicy = new UniqueKeyPolicy();
Collection<UniqueKey> uniqueKeys = new ArrayList<UniqueKey>();
uniqueKeys.add(uniqueKey1);
uniqueKeys.add(uniqueKey2);
uniqueKeyPolicy.setUniqueKeys(uniqueKeys);
// set the unique key policy
container.setUniqueKeyPolicy(uniqueKeyPolicy);
// create the container
client.createCollection(String.format("/dbs/%s", "database"), container, null);
```

## Use the Node.js SDK

When creating a new container using the [Node.js SDK](https://www.npmjs.com/package/@azure/cosmos), a `UniqueKeyPolicy` object can be used to define unique key constraints.

```javascript
client.database('database').containers.create({
    id: 'container',
    uniqueKeyPolicy: {
        uniqueKeys: [
            { paths: ['/firstName', '/lastName', '/emailAddress'] },
            { paths: ['/address/zipCode'] }
        ]
    }
});
```

## Use the Python SDK

When creating a new container using the [Python SDK](https://pypi.org/project/azure-cosmos/), unique key constraints can be specified as part of the dictionary passed as parameter.

```python
client.CreateContainer('dbs/' + config['DATABASE'], {
    'id': 'container',
    'uniqueKeyPolicy': {
        'uniqueKeys': [
            { 'paths': ['/firstName', '/lastName', '/emailAddress'] },
            { 'paths': ['/address/zipCode'] }
        ]
    }
})
```

## Next steps

- Learn more about [partitioning](partition-data.md)
- Explore [how indexing works](index-overview.md)