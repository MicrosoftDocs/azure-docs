---
title: Deleting Data into Cosmos DB for MongoDB
description: Learn how to get started with deleting data in Cosmos DB for MongoDB.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: tutorial
ms.date: 01/24/2023
ms.reviewer: mjbrown
---

# Deleting Data into Cosmos DB for MongoDB

One of the most basic operations is deleting data in a collection. In this guide, we will cover everything you need to know about deleting data using the Mongo Shell (Mongosh).

## Understanding the deleteOne() and deleteMany() Methods

The most common way to delete data in MongoDB is to delete individual documents from a collection. You can do this using the deleteOne() or deleteMany() method.

The deleteOne() method is used to delete a single document from a collection that matches a specific filter. For example, if you wanted to delete a user with the name "John Doe" from the "users" collection, you would use the following command:

```javascript
db.users.deleteOne({ "name": "John Doe" })
```

The deleteMany() method, on the other hand, is used to delete multiple documents from a collection that match a specific filter. For example, if you wanted to delete all users with an age less than 30 from the "users" collection, you would use the following command:

```javascript
db.users.deleteMany({ "age": { $lt: 30 } })
```

It's important to note that both of these methods return an object with the following properties:

deletedCount: The number of documents deleted.
acknowledged: This property will be true.

## Deleting a Collection

To delete an entire collection, use the drop() method. For example, if you wanted to delete the "users" collection, you would use the following command:

```javascript
db.users.drop()
This will delete the "users" collection and all of its documents permanently.
```

## Next steps

- Learn how to [use Studio 3T](connect-using-mongochef.md) with Azure Cosmos DB for MongoDB.
- Learn how to [use Robo 3T](connect-using-robomongo.md) with Azure Cosmos DB for MongoDB.
- Explore MongoDB [samples](nodejs-console-app.md) with Azure Cosmos DB for MongoDB.
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
  - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md).
  - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md).
