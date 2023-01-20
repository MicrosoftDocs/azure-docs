---
title: Manage a MongoDB database using JavaScript
description: Learn how to manage your Azure Cosmos DB resource when it provides the API for MongoDB with a JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: javascript
ms.topic: how-to
ms.date: 06/23/2022
ms.custom: devx-track-js, ignite-2022, devguide-js, cosmos-db-dev-journey
---

# Manage a MongoDB database using JavaScript

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Your MongoDB server in Azure Cosmos DB is available from the common npm packages for MongoDB such as:

- [MongoDB](https://www.npmjs.com/package/mongodb)

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[API for MongoDB reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (npm)](https://www.npmjs.com/package/mongodb)

## Name a database

In Azure Cosmos DB, a database is analogous to a namespace. When you create a database, the database name forms a segment of the URI used to access the database resource and any child resources.

Here are some quick rules when naming a database:

- Keep database names between 3 and 63 characters long
- Database names can only contain lowercase letters, numbers, or the dash (-) character.
- Database names must start with a lowercase letter or number.

Once created, the URI for a database is in this format:

``https://<cosmos-account-name>.documents.azure.com/dbs/<database-name>``

## Get database instance

The database holds the collections and their documents. Use an instance of the `Db` class to access the databases on the server.

- [MongoClient.Db](https://mongodb.github.io/node-mongodb-native/4.7/classes/Db.html)

The following code snippets assume you've already created your [client connection](how-to-javascript-get-started.md#create-mongoclient-with-connection-string) and that you [close your client connection](how-to-javascript-get-started.md#close-the-mongoclient-connection) after these code snippets.

## Get server information

Access the **Admin** class to retrieve server information. You don't need to specify the database name in the `db` method. The information returned is specific to MongoDB and doesn't represent the Azure Cosmos DB platform itself.

- [MongoClient.Db.Admin](https://mongodb.github.io/node-mongodb-native/4.7/classes/Admin.html)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/200-admin/index.js" id="server_info":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/200-admin/index.js" id="console_result":::

## Does database exist?

The native MongoDB driver for JavaScript creates the database if it doesn't exist when you access it. If you would prefer to know if the database already exists before using it, get the list of current databases and filter for the name:

- [MongoClient.Db.Admin.listDatabases](https://mongodb.github.io/node-mongodb-native/4.7/classes/Db.html)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/201-does-database-exist/index.js" id="does_database_exist":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/201-does-database-exist/index.js" id="console_result":::

## Get list of databases, collections, and document count

When you manage your MongoDB server programmatically, it's helpful to know what databases and collections are on the server and how many documents in each collection.

- [MongoClient.Db.Admin.listDatabases](https://mongodb.github.io/node-mongodb-native/4.7/classes/Db.html)
- [MongoClient.Db.listCollections](https://mongodb.github.io/node-mongodb-native/4.7/classes/Db.html#listCollections)
- [MongoClient.Db.Collection](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html)
- [MongoClient.Db.Collection.countDocuments](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#countDocuments)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/202-get-doc-count/index.js" id="database_object":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/202-get-doc-count/index.js" id="console_result":::

## Get database object instance

To get a database object instance, call the following method. This method accepts an optional database name and can be part of a chain.

- [``MongoClient.Db``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html)

A database is created when it's accessed. The most common way to access a new database is to add a document to a collection. In one line of code using chained objects, the database, collection, and doc are created.

```javascript
const insertOneResult = await client.db("adventureworks").collection("products").insertOne(doc);
```

Learn more about working with [collections](how-to-javascript-manage-collections.md) and documents.

## Drop a database

A database is removed from the server using the dropDatabase method on the DB class.

- [DB.dropDatabase](https://mongodb.github.io/node-mongodb-native/4.7/classes/Db.html#dropDatabase)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/300-drop-database/index.js" id="drop_database":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/300-drop-database/index.js" id="console_result":::

## See also

- [Get started with Azure Cosmos DB for MongoDB and JavaScript](how-to-javascript-get-started.md)
- [Work with a collection](how-to-javascript-manage-collections.md)
