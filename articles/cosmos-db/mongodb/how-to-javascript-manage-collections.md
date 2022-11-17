---
title: Create a collection in Azure Cosmos DB for MongoDB using JavaScript
description: Learn how to work with a collection in your Azure Cosmos DB for MongoDB database using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: javascript
ms.topic: how-to
ms.date: 06/23/2022
ms.custom: devx-track-js, ignite-2022, devguide-js, cosmos-db-dev-journey
---

# Manage a collection in Azure Cosmos DB for MongoDB using JavaScript

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Manage your MongoDB collection stored in Azure Cosmos DB with the native MongoDB client driver.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[API for MongoDB reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (npm)](https://www.npmjs.com/package/mongodb)

## Name a collection

In Azure Cosmos DB, a collection is analogous to a table in a relational database. When you create a collection, the collection name forms a segment of the URI used to access the collection resource and any child docs.

Here are some quick rules when naming a collection:

- Keep collection names between 3 and 63 characters long
- Collection names can only contain lowercase letters, numbers, or the dash (-) character.
- Container names must start with a lowercase letter or number.

## Get collection instance

Use an instance of the **Collection** class to access the collection on the server.

- [MongoClient.Db.Collection](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html)

The following code snippets assume you've already created your [client connection](how-to-javascript-get-started.md#create-mongoclient-with-connection-string) and that you [close your client connection](how-to-javascript-get-started.md#close-the-mongoclient-connection) after these code snippets.

## Create a collection

To create a collection, insert a document into the collection.

- [MongoClient.Db.Collection](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html#collection)
- [MongoClient.Db.Collection.insertOne](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#insertOne)
- [MongoClient.Db.Collection.insertMany](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#insertMany)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/203-insert-doc/index.js" id="database_object":::

## Drop a collection

- [MongoClient.Db.dropCollection](https://mongodb.github.io/node-mongodb-native/4.7/classes/Db.html#dropCollection)

Drop the collection from the database to remove it permanently. However, the next insert or update operation that accesses the collection will create a new collection with that name.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/299-drop-collection/index.js" id="drop_collection":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/299-drop-collection/index.js" id="console_result":::

## Get collection indexes

An index is used by the MongoDB query engine to improve performance to database queries.

- [MongoClient.Db.Collection.indexes](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#indexes)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/225-get-collection-indexes/index.js" id="collection":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/225-get-collection-indexes/index.js" id="console_result":::

## See also

- [Get started with Azure Cosmos DB for MongoDB and JavaScript](how-to-javascript-get-started.md)
- [Create a database](how-to-javascript-manage-databases.md)
