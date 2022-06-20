---
title: Create a collection in Azure Cosmos DB MongoDB API using JavaScript
description: Learn how to work with a collection in your Azure Cosmos DB MongoDB API database using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: csharp
ms.topic: how-to
ms.date: 06/08/2022
ms.custom: devx-track-csharp
---

# Manage a collection of documents in Azure Cosmos DB MongoDB API using JavaScript

[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Collections in Azure Cosmos DB store sets of documents. Use a collection to insert, update, delete or query for documents.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [mongodb Package (NuGet)](https://www.npmjs.com/package/mongodb)


## Name a collection

In Azure Cosmos DB, a collection is analogous to a table in a relational database. When you create a collection, the collection name forms a segment of the URI used to access the collection resource and any child docs.

Here are some quick rules when naming a collection:

* Keep collection names between 3 and 63 characters long
* Collection names can only contain lowercase letters, numbers, or the dash (-) character.
* Container names must start with a lowercase letter or number.

## Create a collection

To create a [collection](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html#collection), insert a document into the collection:

```javascript
const insertOneResult = await client.db("adventureworks").collection("products").insertOne(doc);
```

## Drop a collection

Drop the collection from the database to remove it permanently. However, the next insert or update operation that accesses the collection will create a new collection with that name.


:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/299-drop-collection/index.js" id="collection":::

The preceding code snippet displays the following example console output:

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/299-drop-collection/index.js" id="console_result":::

## Get collection indexes

An index is used by the MongoDB query engine to improve performance to database queries.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/225-get-collection-indexes/index.js" id="collection":::

The preceding code snippet displays the following example console output:

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/225-get-collection-indexes/index.js" id="console_result":::

## Insert a document

A document contains the information within a JSON schema. To insert a document, you can insert a single document.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/203-insert-doc/index.js" id="database_object":::

The preceding code snippet displays the following example console output for an **upsert**, when the document is new.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/203-insert-doc/index.js" id="console_result_insert":::

The preceding code snippet displays the following example console output for an **update**, when the document already exists.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/203-insert-doc/index.js" id="console_result_update":::

## Update a document

To update a document, specify the query used to find the document along with which properties of the document should be updated. You can choose to upsert the document, which inserts the document if it doesn't already exist. 

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/250-upsert-doc/index.js" id="upsert":::

The preceding code snippet displays the following example console output:

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/203-insert-doc/index.js" id="console_result":::

## Bulk updates to a collection

You can perform several operations with the **bulkWrite** operation. The following bulk operations are available:

* insertOne
* updateOne
* updateMany
* deleteOne
* deleteMany

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/251-bulk_write/index.js" id="upsert":::

The preceding code snippet displays the following example console output:

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/251-bulk_write/index.js" id="console_result_bulk_write":::

## Delete a document

To delete a document or several documents, use a query to define how the documents are found. 

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/290-delete-doc/index.js" id="delete":::

The preceding code snippet displays the following example console output:

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/290-delete-doc/index.js" id="console_result":::

## Query for documents

To find a document or several documents, use a query to define how the documents are found. 

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/275-find/index.js" id="read_doc":::

The preceding code snippet displays the following example console output:

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/275-find/index.js" id="console_result_findone":::

## See also

- [Get started with Azure Cosmos DB MongoDB API and JavaScript](how-to-javascript-get-started.md)
- [Create a database](how-to-javascript-manage-databases.md)
