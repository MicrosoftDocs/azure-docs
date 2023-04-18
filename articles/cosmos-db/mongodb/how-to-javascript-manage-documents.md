---
title: Create a document in Azure Cosmos DB for MongoDB using JavaScript
description: Learn how to work with a document in your Azure Cosmos DB for MongoDB database using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: javascript
ms.topic: how-to
ms.date: 06/23/2022
ms.custom: devx-track-js, ignite-2022, devguide-js, cosmos-db-dev-journey
---

# Manage a document in Azure Cosmos DB for MongoDB using JavaScript

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Manage your MongoDB documents with the ability to insert, update, and delete documents.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[API for MongoDB reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (npm)](https://www.npmjs.com/package/mongodb)

## Insert a document

Insert a document, defined with a JSON schema, into your collection.

- [MongoClient.Db.Collection.insertOne](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#insertOne)
- [MongoClient.Db.Collection.insertMany](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#insertMany)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/203-insert-doc/index.js" id="database_object":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/203-insert-doc/index.js" id="console_result":::

## Document ID

If you don't provide an ID, `_id`, for your document, one is created for you as a BSON object. The value of the provided ID is accessed with the ObjectId method.

- [ObjectId](https://mongodb.github.io/node-mongodb-native/4.7/classes/ObjectId.html)

Use the ID to query for documents:

```javascript
const query = { _id: ObjectId("62b1f43a9446918500c875c5")};
```

## Update a document

To update a document, specify the query used to find the document along with a set of properties of the document that should be updated. You can choose to upsert the document, which inserts the document if it doesn't already exist.

- [MongoClient.Db.Collection.updateOne](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#updateOne)
- [MongoClient.Db.Collection.updateMany](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#updateMany)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/250-upsert-doc/index.js" id="upsert":::

The preceding code snippet displays the following example console output for an insert:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/250-upsert-doc/index.js" id="console_result_insert":::

The preceding code snippet displays the following example console output for an update:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/250-upsert-doc/index.js" id="console_result_update":::

## Bulk updates to a collection

You can perform several operations at once with the **bulkWrite** operation. Learn more about how to [optimize bulk writes for Azure Cosmos DB](optimize-write-performance.md#tune-for-the-optimal-batch-size-and-thread-count).

The following bulk operations are available:

- [MongoClient.Db.Collection.bulkWrite](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#bulkWrite)

  - insertOne

  - updateOne

  - updateMany

  - deleteOne

  - deleteMany

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/251-bulk_write/index.js" id="bulk_write":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/251-bulk_write/index.js" id="console_result_bulk_write":::

## Delete a document

To delete documents, use a query to define how the documents are found.

- [MongoClient.Db.Collection.deleteOne](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#deleteOne)
- [MongoClient.Db.Collection.deleteMany](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#deleteMany)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/290-delete-doc/index.js" id="delete":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/290-delete-doc/index.js" id="console_result":::

## See also

- [Get started with Azure Cosmos DB for MongoDB and JavaScript](how-to-javascript-get-started.md)
- [Create a database](how-to-javascript-manage-databases.md)
