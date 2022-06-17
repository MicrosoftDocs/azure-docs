---
title: Get server information in Azure Cosmos DB MongoDB API using JavaScript
description: Learn how to get server information in your Azure Cosmos DB MongoDB API account using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: javascript
ms.topic: how-to
ms.date: 06/08/2022
ms.custom: devx-track-js
---

# Get server information in Azure Cosmos DB MongoDB API using JavaScript

[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Get server information such as status or a list of databases.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [mongodb Package (NuGet)](https://www.npmjs.com/package/mongodb)


## Get server information

The native MongoDB driver provides server information such as build information and the list of databases. 

To get server information, call the following method:

* [``MongoClient.db().admin()``](https://mongodb.github.io/node-mongodb-native/4.7/classes/Admin.html)

The following example gets server information.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/200-admin/index.js" id="server_info":::

## See also

- [Get started with Azure Cosmos DB MongoDB API and JavaScript](how-to-javascript-get-started.md)
- [Create a database](how-to-javascript-create-database.md)
- [Create a collection](how-to-javascript-create-collection.md)
