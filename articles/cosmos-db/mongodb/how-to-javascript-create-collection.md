---
title: Create a collection in Azure Cosmos DB MongoDB API using JavaScript
description: Learn how to create a collection in your Azure Cosmos DB MongoDB API database using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: csharp
ms.topic: how-to
ms.date: 06/08/2022
ms.custom: devx-track-csharp
---

# Create a collection in Azure Cosmos DB MongoDB API using JavaScript

[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Collections in Azure Cosmos DB store sets of docss. Before you can create, query, or manage docss, you must first create a collection.

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

To create a collection, call the following method:

* [``Collection``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html#collection)

The following example creates a collection. If the collection already exists, a connection to the existing collection is returned.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/225-create-collection/index.js" id="new_collection":::

## See also

- [Get started with Azure Cosmos DB MongoDB API and JavaScript](how-to-javascript-get-started.md)
- [Create a database](how-to-javascript-create-database.md)
