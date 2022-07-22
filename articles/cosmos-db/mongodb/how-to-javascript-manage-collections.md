---
title: Create a collection in Azure Cosmos DB MongoDB API using JavaScript
description: Learn how to work with a collection in your Azure Cosmos DB MongoDB API database using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: javascript
ms.topic: how-to
ms.date: 06/23/2022
ms.custom: devx-track-js
---

# Manage a collection in Azure Cosmos DB MongoDB API using JavaScript

[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Manage your MongoDB collection stored in Cosmos DB with the native MongoDB client driver.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (npm)](https://www.npmjs.com/package/mongodb)


## Name a collection

In Azure Cosmos DB, a collection is analogous to a table in a relational database. When you create a collection, the collection name forms a segment of the URI used to access the collection resource and any child docs.

Here are some quick rules when naming a collection:

* Keep collection names between 3 and 63 characters long
* Collection names can only contain lowercase letters, numbers, or the dash (-) character.
* Container names must start with a lowercase letter or number.

## Get collection instance

Use an instance of the **Collection** class to access the collection on the server.

* [MongoClient.Database.Collection](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/T_MongoDB_Driver_MongoCollection_1.htm)

The following code snippets assume you've already created your [client connection](how-to-dotnet-get-started.md#create-mongoclient-with-connection-string).

## Create a collection

To create a collection, insert a document into the collection.

* [MongoClient.Database.Collection](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/T_MongoDB_Driver_MongoCollection_1.htm)
* [MongoClient.Database.Collection.InsertOne](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/M_MongoDB_Driver_IMongoCollection_1_InsertOne_1.htm)
* [MongoClient.Database.Collection.InsertMany](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/M_MongoDB_Driver_IMongoCollection_1_InsertMany_1.htm)

:::code language="csharp" source="~/samples-cosmosdb-mongodb-dotnet/203-insert-doc/program.cs" id="database_object":::

## Drop a collection

* [MongoClient.Database.DropCollection](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/M_MongoDB_Driver_MongoDatabase_DropCollection.htm)

Drop the collection from the database to remove it permanently. However, the next insert or update operation that accesses the collection will create a new collection with that name.

:::code language="csharp" source="~/samples-cosmosdb-mongodb-dotnet/299-drop-collection/program.cs" id="drop_collection":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-dotnet/299-drop-collection/program.cs" id="console_result":::

## Get collection indexes

An index is used by the MongoDB query engine to improve performance to database queries.

* [MongoClient.Database.Collection.GetIndexes](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/M_MongoDB_Driver_MongoCollection_GetIndexes.htm)

:::code language="csharp" source="~/samples-cosmosdb-mongodb-dotnet/225-get-collection-indexes/program.cs" id="collection":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-dotnet/225-get-collection-indexes/program.cs" id="console_result":::

## See also

- [Get started with Azure Cosmos DB MongoDB API and .NET](how-to-dotnet-get-started.md)
- [Create a database](how-to-dotnet-manage-databases.md)
