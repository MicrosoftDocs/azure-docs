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
* [create](/javascript/api/@azure/cosmos/databases#@azure-cosmos-databases-create) - Creates a database. If it does exist, return error statusCode.

```javascript
const databaseName = 'myDb';

// Possible results:
// Create then return database
// Return existing database
// Return error statusCode
const {statusCode, database } = await client.databases.createIfNotExists({ id: databaseName });

// Possible results: 
// Create then return database
// Return error statusCode, reason includes database already exists
const {statusCode, database } = await client.databases.create({ id: databaseName });
```

The statusCode is an HTTP response code. A successful response is in the 200-299 range.

## Access a database

A database is accessed from the [Database](/javascript/api/@azure/cosmos/database) object either directly or through a query result from the [CosmosClient](/javascript/api/@azure/cosmos/cosmosclient).

```javascript
const databaseName = 'myDb';

// Direct - assumes database already exists
const { database, statusCode } = await client.database(databaseName);

// Query - assumes database already exists   
const { resources } = await client.databases
.query({
    query: `SELECT * FROM root r where r.id =@dbId`,
    parameters: [
    {
        name: '@dbId',
        value: databaseName
    }
    ]
})
.fetchAll();
```

Access by object:
* [Databases](/javascript/api/@azure/cosmos/databases) (plural): Used for creating new databases, or querying/reading all databases.
* [Database](/javascript/api/@azure/cosmos/database) (singular): Used for reading, updating, or deleting an existing database by ID or accessing containers belonging to that database.

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
