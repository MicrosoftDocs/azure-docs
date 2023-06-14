---
title: Create a database in Azure Cosmos DB for NoSQL using Python
description: Learn how to create a database in your Azure Cosmos DB for NoSQL account using the Python SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: python
ms.topic: how-to
ms.date: 12/06/2022
ms.custom: devx-track-python, devguide-python, cosmos-db-dev-journey
---

# Create a database in Azure Cosmos DB for NoSQL using Python

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Databases in Azure Cosmos DB are units of management for one or more containers. Before you can create or manage containers, you must first create a database.

## Name a database

In Azure Cosmos DB, a database is analogous to a namespace. When you create a database, the database name forms a segment of the URI used to access the database resource and any child resources.

Here are some quick rules when naming a database:

- Keep database names between 3 and 63 characters long
- Database names can only contain lowercase letters, numbers, or the dash (-) character.
- Database names must start with a lowercase letter or number.

Once created, the URI for a database is in this format:

`https://<cosmos-account-name>.documents.azure.com/dbs/<database-name>`

## Create a database

To create a database, call one of the following methods:

- [CreateDatabaseAsync](#create-a-database)
- [CreateDatabaseIfNotExistsAsync](#create-a-database-if-it-doesnt-already-exist)
- [Create a database asynchronously](#create-a-database-asynchronously)

### Create a database

The following example creates a database with the [`CosmosClient.create_database`](/python/api/azure-cosmos/azure.cosmos.cosmosclient#azure-cosmos-cosmosclient-create-database) method. This method throws an exception if a database with the same name exists.

:::code language="python" source="~/cosmos-db-nosql-python-samples/004-create-db/app.py" id="create_database":::

### Create a database if it doesn't already exist

The following example creates a database with the [`CosmosClient.create_database_if_not_exists`](/python/api/azure-cosmos/azure.cosmos.cosmosclient#azure-cosmos-cosmosclient-create-database-if-not-exists) method. If the database exists, this method returns the database settings. Compared to the previous create method, this method doesn't throw an exception if the database already exists. This method is useful for avoiding errors if you run the same code multiple times.

:::code language="python" source="~/cosmos-db-nosql-python-samples/004-create-db/app_exists.py" id="create_database":::

### Create a database asynchronously

You can also create a database asynchronously using similar object and methods in the [azure.cosmos.aio](/python/api/azure-cosmos/azure.cosmos.aio) namespace. For example, use the [`CosmosClient.create_database`](/python/api/azure-cosmos/azure.cosmos.aio.cosmosclient#azure-cosmos-aio-cosmosclient-create-database) method or the ['CosmoClient.create_database_if_not_exists](/python/api/azure-cosmos/azure.cosmos.aio.cosmosclient#azure-cosmos-aio-cosmosclient-create-database-if-not-exists) method.

Working asynchronously is useful when you want to perform multiple operations in parallel. For more information, see [Using the asynchronous client](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cosmos/azure-cosmos#using-the-asynchronous-client).

## Parsing the response

In the examples above, the response from the requests is a  [``DatabaseProxy``](/python/api/azure-cosmos/azure.cosmos.databaseproxy), which is an interface to interact with a specific database. From the proxy, you can access methods to perform operations on the database.

The following example shows the **create_database_if_not_exists** method returning a **database** object.

:::code language="python" source="~/cosmos-db-nosql-python-samples/004-create-db/app_exists.py" id="parse_response":::

## Next steps

Now that you've created a database, use the next guide to create containers.

> [!div class="nextstepaction"]
> [Create a container](how-to-python-create-container.md)
