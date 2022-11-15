---
title: Manage a MongoDB database using Python
description: Learn how to manage your Azure Cosmos DB resource when it provides the API for MongoDB with a Python SDK.
author: diberry
ms.author: diberry
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: python
ms.topic: how-to
ms.date: 11/15/2022
ms.custom: devx-track-js, ignite-2022
---

# Manage a MongoDB database using Python

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Your MongoDB server in Azure Cosmos DB is available from the common Python packages for MongoDB such as:

* [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/) for synchronous Python applications.
* [Motor](https://www.mongodb.com/docs/drivers/motor/) for asynchronous Python applications.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) are available on GitHub as a Python project.

## Name a database

In Azure Cosmos DB, a database is analogous to a namespace. When you create a database, the database name forms a segment of the URI used to access the database resource and any child resources.

Here are some quick rules when naming a database:

* Keep database names between 3 and 63 characters long
* Database names can only contain lowercase letters, numbers, or the dash (-) character.
* Database names must start with a lowercase letter or number.

Once created, the URI for a database is in this format:

`https://<cosmos-account-name>.documents.azure.com/dbs/<database-name>`

## Get database instance

The database holds the collections and their documents. To access a database, use attribute style access or dictionary style access of the MongoClient. For more information, see [Getting a Database](https://pymongo.readthedocs.io/en/stable/tutorial.html#getting-a-database).

The following code snippets assume you've already created your [client connection](how-to-python-get-started.md#create-mongoclient-with-connection-string) and that you [close your client connection](how-to-python-get-started.md#close-the-mongoclient-connection) after these code snippets.

## Get server information

Access the **Admin** class to retrieve server information. You don't need to specify the database name in the `db` method. The information returned is specific to MongoDB and doesn't represent the Azure Cosmos DB platform itself.

* [MongoClient.Db.Admin](https://mongodb.github.io/node-mongodb-native/4.7/classes/Admin.html)

<!--
:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/200-admin/index.js" id="server_info":::
-->

The preceding code snippet displays the following example console output:

<!-- 
:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/200-admin/index.js" id="console_result":::
-->

