---
title: 'Tutorial to set up global distribution with Azure Cosmos DB for MongoDB'
description: Learn how to set up global distribution using Azure Cosmos DB's API for MongoDB.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: tutorial
ms.date: 08/26/2021
ms.reviewer: mjbrown
ms.devlang: csharp
ms.custom: devx-track-csharp, ignite-2022
---
# Set up global distributed database using Azure Cosmos DB's API for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

In this article, we show how to use the Azure portal to setup a global distributed database and connect to it using Azure Cosmos DB's API for MongoDB.

This article covers the following tasks: 

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the [Azure Cosmos DB's API for MongoDB](introduction.md)

[!INCLUDE [cosmos-db-tutorial-global-distribution-portal](../includes/cosmos-db-tutorial-global-distribution-portal.md)]

## Verifying your regional setup 
A simple way to check your global configuration with Azure Cosmos DB's API for MongoDB is to run the *isMaster()* command from the Mongo Shell.

From your Mongo Shell:

   ```
      db.isMaster()
   ```
   
Example results:

   ```JSON
      {
         "_t": "IsMasterResponse",
         "ok": 1,
         "ismaster": true,
         "maxMessageSizeBytes": 4194304,
         "maxWriteBatchSize": 1000,
         "minWireVersion": 0,
         "maxWireVersion": 2,
         "tags": {
            "region": "South India"
         },
         "hosts": [
            "vishi-api-for-mongodb-southcentralus.documents.azure.com:10255",
            "vishi-api-for-mongodb-westeurope.documents.azure.com:10255",
            "vishi-api-for-mongodb-southindia.documents.azure.com:10255"
         ],
         "setName": "globaldb",
         "setVersion": 1,
         "primary": "vishi-api-for-mongodb-southindia.documents.azure.com:10255",
         "me": "vishi-api-for-mongodb-southindia.documents.azure.com:10255"
      }
   ```

## Connecting to a preferred region 

The Azure Cosmos DB's API for MongoDB enables you to specify your collection's read preference for a globally distributed database. For both low latency reads and global high availability, we recommend setting your collection's read preference to *nearest*. A read preference of *nearest* is configured to read from the closest region.

```csharp
var collection = database.GetCollection<BsonDocument>(collectionName);
collection = collection.WithReadPreference(new ReadPreference(ReadPreferenceMode.Nearest));
```

For applications with a primary read/write region and a secondary region for disaster recovery (DR) scenarios, we recommend setting your collection's read preference to *primary preferred*. A read preference of *primary preferred* is configured to read from the secondary region when the primary region is unavailable.

```csharp
var collection = database.GetCollection<BsonDocument>(collectionName);
collection = collection.WithReadPreference(new ReadPreference(ReadPreferenceMode.SecondaryPreferred));
```

Lastly, if you would like to manually specify your read regions. You can set the region Tag within your read preference.

```csharp
var collection = database.GetCollection<BsonDocument>(collectionName);
var tag = new Tag("region", "Southeast Asia");
collection = collection.WithReadPreference(new ReadPreference(ReadPreferenceMode.Secondary, new[] { new TagSet(new[] { tag }) }));
```

That's it, that completes this tutorial. You can learn how to manage the consistency of your globally replicated account by reading [Consistency levels in Azure Cosmos DB](../consistency-levels.md). And for more information about how global database replication works in Azure Cosmos DB, see [Distribute data globally with Azure Cosmos DB](../distribute-data-globally.md).

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the Azure Cosmos DB's API for MongoDB

You can now proceed to the next tutorial to learn how to develop locally using the Azure Cosmos DB local emulator.

> [!div class="nextstepaction"]
> [Develop locally with the Azure Cosmos DB emulator](../emulator.md)

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
