---
title: Get MongoDB server info using JavaScript
description: Learn how to get server information in your Azure Cosmos DB MongoDB API account using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: csharp
ms.topic: how-to
ms.date: 06/08/2022
ms.custom: devx-track-csharp
---

# Get MongoDB server information

[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Your MongoDB server in Azure Cosmos DB is available from the common npm packages for MongoDB such as:

* [MongoDB](https://www.npmjs.com/package/mongodb)

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [mongodb Package (NuGet)](https://www.npmjs.com/package/mongodb)

## Get database instance

The database holds the collections and their documents. 

* [Db](https://mongodb.github.io/node-mongodb-native/4.7/classes/Db.html)

## Get server information

Access the **Admin** class to retrieve server information. You don't need to specify the database name in the db method. The information returned is specific to MongoDB and doesn't represent the Azure Cosmos DB platform itself.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/200-admin/index.js" id="server_info":::

The preceding code snippet displays the following example console output:

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/200-admin/index.js" id="console_result":::

## Does database exist?

The native MongoDB driver for JavaScript creates the database if it doesn't exist when you access it. If you would prefer to know if the database already exists before using it, get the list of current databases and filter for the name:

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/201-does-database-exist/index.js" id="does_database_exist":::

The preceding code snippet displays the following example console output:

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/201-does-database-exist/index.js" id="console_result":::

## Get list of databases, collections, and document count

When you manage your MongoDB server programmatically, its helpful to know what databases and collections are on the server and how many documents in each collection.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/202-get-doc-count/index.js" id="database_object":::

The preceding code snippet displays the following example console output:

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/202-get-doc-count/index.js" id="console_result":::

## Get database object instance

To get a database object instance, call the following method. This method accepts an optional database name and can be part of a chain.

* [``MongoClient.db()``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html)

## Create a database

A database is created when it is accessed. The most common way to access a new database is to add a document to a collection. In one line of code using chained objects, the database, collection, and doc are created.

```javascript
const insertOneResult = await client.db("adventureworks").collection("products").insertOne(doc);
```

Learn more about working with [collections](how-to-javascript-manage-collections.md) and [documents](how-to-javascript-manage-documents.md).

## Drop a database

A database is removed from the server using the dropDatabase method on the DB class. 

* [DB.dropDatabase](https://mongodb.github.io/node-mongodb-native/4.7/classes/Db.html#dropDatabase)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/300-drop-database/index.js" id="drop_database":::

The preceding code snippet displays the following example console output:

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/300-drop-database/index.js" id="console_result":::

## See also

- [Get started with Azure Cosmos DB MongoDB API and JavaScript](how-to-javascript-get-started.md)
- Work with a collection](how-to-javascript-manage-collections.md)
