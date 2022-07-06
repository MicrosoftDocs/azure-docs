---
title: Use a query in Azure Cosmos DB MongoDB API using JavaScript
description: Learn how to use a query in your Azure Cosmos DB MongoDB API database using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: javascript
ms.topic: how-to
ms.date: 06/23/2022
ms.custom: devx-track-js
---

# Use a query in Azure Cosmos DB MongoDB API using JavaScript

[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Use queries to find documents in a collection.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (npm)](https://www.npmjs.com/package/mongodb)


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
