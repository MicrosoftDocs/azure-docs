---
title: Create a database in Azure Cosmos DB for NoSQL using JavaScript
description: Learn how to create a database in your Azure Cosmos DB for NoSQL account using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: javascript
ms.topic: how-to
ms.date: 05/17/2023
ms.custom: devx-track-js, cosmos-db-dev-journey
---

# Create a database in Azure Cosmos DB for NoSQL using JavaScript

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Databases in Azure Cosmos DB are units of management for one or more containers. Before you can create or manage containers, you must first create a database.

## Name a database

In Azure Cosmos DB, a database is analogous to a namespace. When you create a database, the database name forms a segment of the URI used to access the database resource and any child resources.

Here are some quick rules when naming a database:

- Keep database names between 3 and 63 characters long
- Database names can only contain lowercase letters, numbers, or the dash (-) character.
- Database names must start with a lowercase letter or number.

Once created, the URI for a database is in this format:

``https://<cosmos-account-name>.documents.azure.com/dbs/<database-name>``

## Create a database

Once you create the [CosmosClient](/javascript/api/@azure/cosmos/cosmosclient), use the client to create a [Database](/javascript/api/@azure/cosmos/database) from two different calls:

* [createIfNotExists](/javascript/api/@azure/cosmos/databases#@azure-cosmos-databases-createifnotexists) - Creates a database if it doesn't exist. If it does exist, return database.
* [create](/javascript/api/@azure/cosmos/databases#@azure-cosmos-databases-create) - Creates a database if it doesn't already exist. If it does exist, return error statusCode.

```javascript
const databaseName = 'myDb';

// Create or get existing database
const {statusCode, database } = await client.databases.createIfNotExists({ id: databaseName });

// Create or return error status code
const {statusCode, database } = await client.databases.create({ id: databaseName });
```

The statusCode is an HTTP response code. A successful response is in the 200-299 range.

## Delete a database

Once you get the [Database](/javascript/api/@azure/cosmos/database) object, you can use the Database object to [delete](/javascript/api/@azure/cosmos/database#@azure-cosmos-database-delete) the database:

```javascript
const {statusCode } = await database.delete();
```

The statusCode is an HTTP response code. A successful response is in the 200-299 range.

## Next steps

Now that you've created a database, use the next guide to create containers.

> [!div class="nextstepaction"]
> [Create a container](how-to-javascript-create-container.md)
