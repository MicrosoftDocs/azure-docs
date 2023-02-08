---
title: Updating Data into Cosmos DB for MongoDB
description: Learn how to get started with updating data in Cosmos DB for MongoDB.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: tutorial
ms.date: 01/24/2023
ms.reviewer: mjbrown
---

# Updating Data into Cosmos DB for MongoDB

One of the most basic operations is updating data into a collection. In this guide, we will cover everything you need to know about updating data using the Mongo Shell (Mongosh).

## Using updateOne() Method

The updateOne() method updates the first document that matches a specified filter. The method takes two parameters:

filter: A document that specifies the criteria for the update. The filter is used to match the documents in the collection that should be updated. The filter document must be a valid query document.

update: A document that specifies the update operations to perform on the matching documents. The update document must be a valid update document.

```javascript
db.collection.updateOne(
   <filter>,
   <update>
)
```

For example, to update the name of a customer with _id equal to 1, you can use the following command:

```javascript
db.customers.updateOne(
   { _id: 1 },
   { $set: { name: "Jane Smith" } }
)
```

In the above example, db.customers is the collection name, { _id: 1 } is the filter which matches the first document that has _id equal to 1 and { $set: { name: "Jane Smith" } } is the update operation which sets the name field of the matched document to "Jane Smith".

You can also use other update operators like $inc, $mul, $rename, $unset etc. to update the data.

## updateMany() Method

The updateMany() method updates all documents that match a specified filter. The method takes two parameters:

filter: A document that specifies the criteria for the update. The filter is used to match the documents in the collection that should be updated. The filter document must be a valid query document.
update: A document that specifies the update operations to perform on the matching documents. The update document must be a valid update document.

```javascript
db.collection.updateMany(
   <filter>,
   <update>
)
```

For example, to update the name of all customers that live in "New York", you can use the following command:

```javascript
db.customers.updateMany(
   { city: "New York" },
   { $set: { name: "Jane Smith" } }
)
```

In the above example, db.customers is the collection name, { city: "New York" } is the filter which matches all the documents that have city field equal to "New York" and { $set: { name: "Jane Smith" } } is the update operation which sets the name field of all the matched documents to "Jane Smith".

You can also use other update operators like $inc, $mul, $rename, $unset, etc. to update the data.

## Next steps

- Learn how to [use Studio 3T](connect-using-mongochef.md) with Azure Cosmos DB for MongoDB.
- Learn how to [use Robo 3T](connect-using-robomongo.md) with Azure Cosmos DB for MongoDB.
- Explore MongoDB [samples](nodejs-console-app.md) with Azure Cosmos DB for MongoDB.
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
  - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md).
  - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md).
