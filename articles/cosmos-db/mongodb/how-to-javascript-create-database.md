---
title: Create a database in Azure Cosmos DB MongoDB API using JavaScript
description: Learn how to create a database in your Azure Cosmos DB MongoDB API account using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: csharp
ms.topic: how-to
ms.date: 06/08/2022
ms.custom: devx-track-csharp
---

# Create a database in Azure Cosmos DB MongoDB API using JavaScript

[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Databases in Azure Cosmos DB are units of management for one or more collections. Before you can create or manage collections, you must first create a database.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [mongodb Package (NuGet)](https://www.npmjs.com/package/mongodb)


## Name a database

In Azure Cosmos DB, a database is analogous to a namespace. When you create a database, the database name forms a segment of the connection string used to access the database resource and any child resources.

Here are some quick rules when naming a database:

* Keep database names between 3 and 63 characters long
* Database names can only contain lowercase letters, numbers, or the dash (-) character.
* Database names must start with a lowercase letter or number.

Once created, the connection string for a database is in this format:

``mongodb://YOUR-RESOURCE-NAME:YOUR-PASSWORD@YOUR-END-POINT:10255/?<OPTIONS>``

The connection string includes the following options by default:
* ssl=true
* replicaSet=globaldb
* retrywrites=false
* maxIdleTimeMS=120000
* appName=YOUR-RESOURCE-NAME

## Create a database

To create a database, call the following method:

* [``Db``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html)

The following example creates a database:

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/200-create-database/index.js" id="new_database":::

## See also

- [Get started with Azure Cosmos DB MongoDB API and JavaScript](how-to-javascript-get-started.md)
- [Create a collection](how-to-javascript-create-collection.md)
