---
title: Create a collection in Azure Cosmos DB MongoDB API using JavaScript
description: Learn how to work with a collection in your Azure Cosmos DB MongoDB API database using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: javascript
ms.topic: how-to
ms.date: 06/20/2022
ms.custom: devx-track-js
---

# Manage a collection of documents in Azure Cosmos DB MongoDB API using JavaScript

[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Manage you MongoDB collection store documents with the ability insert, update, delete or query for documents.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [mongodb Package (NuGet)](https://www.npmjs.com/package/mongodb)


## Name a collection

In Azure Cosmos DB, a collection is analogous to a table in a relational database. When you create a collection, the collection name forms a segment of the URI used to access the collection resource and any child docs.

Here are some quick rules when naming a collection:

* Keep collection names between 3 and 63 characters long
* Collection names can only contain lowercase letters, numbers, or the dash (-) character.
* Container names must start with a lowercase letter or number.

## Get collection instance

Use an instance of the **Collection** class to access the collection on the server.

* [MongoClient.Db.Collection](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html)

The following code snippets assume you've already created your [client connection](how-to-javascript-get-started.md#create-mongoclient-with-connection-string) and that you [close your client connection](how-to-javascript-get-started.md#close-the-mongoclient-connection) after these code snippets.

## Create a collection

To create a collection, insert a document into the collection.

* [MongoClient.Db.Collection](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html#collection)
* [MongoClient.Db.Collection.insertOne](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#insertOne)
* [MongoClient.Db.Collection.insertMany](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#insertMany)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/203-insert-doc/index.js" id="database_object":::

## Drop a collection

* [MongoClient.Db.dropCollection](https://mongodb.github.io/node-mongodb-native/4.7/classes/Db.html#dropCollection)

Drop the collection from the database to remove it permanently. However, the next insert or update operation that accesses the collection will create a new collection with that name.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/299-drop-collection/index.js" id="drop_collection":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/299-drop-collection/index.js" id="console_result":::

## Get collection indexes

An index is used by the MongoDB query engine to improve performance to database queries.

* [MongoClient.Db.Collection.indexes](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#indexes)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/225-get-collection-indexes/index.js" id="collection":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/225-get-collection-indexes/index.js" id="console_result":::

## Insert a document

Insert a document, defined with a JSON schema, into your collection.

* [MongoClient.Db.Collection.insertOne](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#insertOne)
* [MongoClient.Db.Collection.insertMany](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#insertMany)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/203-insert-doc/index.js" id="database_object":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/203-insert-doc/index.js" id="console_result":::

## Document Id

If you don't provide an ID, `_id`, for your document, one is created for you as a BSON object. The value of the provided ID is accessed with the ObjectId method.

* [ObjectId](https://mongodb.github.io/node-mongodb-native/4.7/classes/ObjectId.html)

Use the ID to query for documents:

```javascript
const query = { _id: ObjectId("62b1f43a9446918500c875c5")};
```

## Update a document

To update a document, specify the query used to find the document along with a set of properties of the document that should be updated. You can choose to upsert the document, which inserts the document if it doesn't already exist. 

* [MongoClient.Db.Collection.updateOne](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#updateOne)
* [MongoClient.Db.Collection.updateMany](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#updateMany)


:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/250-upsert-doc/index.js" id="upsert":::

The preceding code snippet displays the following example console output for an insert:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/250-upsert-doc/index.js" id="console_result_insert":::

The preceding code snippet displays the following example console output for an update:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/250-upsert-doc/index.js" id="console_result_update":::

## Bulk updates to a collection

You can perform several operations at once with the **bulkWrite** operation. Learn more about how to [optimize bulk writes for Cosmos DB](optimize-write-performance.md#tune-for-the-optimal-batch-size-and-thread-count). 

The following bulk operations are available:

* [MongoClient.Db.Collection.bulkWrite](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#bulkWrite)

    * insertOne
    * updateOne
    * updateMany
    * deleteOne
    * deleteMany

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/251-bulk_write/index.js" id="bulk_write":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/251-bulk_write/index.js" id="console_result_bulk_write":::

## Delete a document

To delete documents, use a query to define how the documents are found. 

* [MongoClient.Db.Collection.deleteOne](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#deleteOne)
* [MongoClient.Db.Collection.deleteMany](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#deleteMany)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/290-delete-doc/index.js" id="delete":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/290-delete-doc/index.js" id="console_result":::

## Query for documents

To find documents, use a query to define how the documents are found. 

* [MongoClient.Db.Collection.findOne](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#findOne)
* [MongoClient.Db.Collection.find](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#find)
* [FindCursor](https://mongodb.github.io/node-mongodb-native/4.7/classes/FindCursor.html)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/275-find/index.js" id="read_doc":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/275-find/index.js" id="console_result_findone":::

## See also

- [Get started with Azure Cosmos DB MongoDB API and JavaScript](how-to-javascript-get-started.md)
- [Create a database](how-to-javascript-manage-databases.md)
