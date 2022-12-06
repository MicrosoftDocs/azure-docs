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

``https://<cosmos-account-name>.documents.azure.com/dbs/<database-name>``

## Create a database

To create a database, call one of the following methods:

- [``CreateDatabaseAsync``](#create-a-database-asynchronously)
- [``CreateDatabaseIfNotExistsAsync``](#create-a-database-asynchronously-if-it-doesnt-already-exist)

### Create a database asynchronously

The following example creates a database asynchronously:

```python
TBD
```
<!--
:::code language="python" source="~/cosmos-db-nosql-python-samples/004-create-db/app.py" id="create_database":::
-->

The [`CosmosClient.create_database`](/python/api/azure-cosmos/azure.cosmos.aio.cosmosclient#azure-cosmos-aio-cosmosclient-create-database) method will throw an exception if a database with the same name already exists.

### Create a database asynchronously if it doesn't already exist

The following example creates a database asynchronously only if it doesn't already exist on the account:

```python
TBD
```
<!--
:::code language="python" source="~/cosmos-db-nosql-python-samples/004-create-db/app.py" id="create_database_check":::
-->

The [`CosmosClient.create_database_if_not_exists`](/python/api/azure-cosmos/azure.cosmos.aio.cosmosclient#azure-cosmos-aio-cosmosclient-create-database-if-not-exists) method will only create a new database if it doesn't already exist. This method is useful for avoiding errors if you run the same code multiple times.

## Parsing the response

In the examples above, the response from the asynchronous request is a  [``DatabaseProxy``](/python/api/azure-cosmos/azure.cosmos.databaseproxy), which is an interface to interact with a specific database. From the proxy you can use the methods to perform operations on the database.

The following example shows the **create_database_if_not_exsits** method returning a **database** object.

```python
TBD
```
<!--
:::code language="python" source="~/cosmos-db-nosql-python-samples/004-create-db/app.py" id="create_database_response":::
-->

## Next steps

Now that you've created a database, use the next guide to create containers.

> [!div class="nextstepaction"]
> [Create a container](how-to-python-create-container.md)
