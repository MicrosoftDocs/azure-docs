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

Access server info with the [server_info](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient.server_info) method of the MongoClient class. You don't need to specify the database name to get this information. The information returned is specific to MongoDB and doesn't represent the Azure Cosmos DB platform itself.

You can also list databases using the [MongoClient.list_database_names](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient.list_database_names) method and issue a [MongoDB command](https://www.mongodb.com/docs/manual/reference/command/nav-diagnostic/) to a database with the [MongoClient.db.command](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html#pymongo.database.Database.command) method.

```python
# Get server information
for k, v in client.server_info().items():
    print("Key: {} , Value: {}".format(k, v))

# Get server status of admin database
print("Server status {}".format(client.admin.command("serverStatus")))

# List databases
databases = client.list_database_names()
print("Databases: {}".format(databases))
```
<!--
:::code language="javascript" source="~/azure-cosmos-db-mongodb-python-getting-started/200-admin/run.py" id="server_info":::
-->

The preceding code snippet displays output similar to the following example console output:

```python
Key: version , Value: 3.6.0
Key: versionArray , Value: [3, 6, 0, 0]
Key: bits , Value: 64
Key: maxBsonObjectSize , Value: 16777216
Key: ok , Value: 1.0
Server status {'ok': 1.0}
Databases: ['adventureworks']
```
<!-- 
:::code language="console" source="~/azure-cosmos-db-mongodb-python-getting-started/200-admin/run.py" id="console_result":::
-->

## Does database exist?

The PyMongo driver for Python creates the database if it doesn't exist when you access it. However, we recommend that instead you use the [MongoDB extension commands](/azure/cosmos-db/mongodb/custom-commands) to manage data stored in Azure Cosmos DB’s API for MongoDB. To create a new database if it doesn't exist, use the [create database extension](/azure/cosmos-db/mongodb/custom-commands#create-database) as shown in the following code snippet.

To see if the database already exists before using it, get the list of current databases with the [list_database_names](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient.list_database_names) method.

```python
# Get list of databases
databases = client.list_database_names()
if not databases:
    print("No databases found")

# Does database exist?
DB_NAME_TO_FIND = "adventureworks"
if DB_NAME_TO_FIND in client.list_database_names():
    print("Database exists: {}".format(DB_NAME_TO_FIND))
```
<!--
:::code language="javascript" source="~/azure-cosmos-db-mongodb-python-getting-started/201-does-database-exist/run.py" id="does_database_exist":::
-->
The preceding code snippet displays output similar to the following example console output:

```python
Database exists: adventureworks
```
<!--
:::code language="console" source="~/azure-cosmos-db-mongodb-python-getting-started/201-does-database-exist/run.py" id="console_result":::
-->

## Get list of databases, collections, and document count

When you manage your MongoDB server programmatically, it's helpful to know what databases and collections are on the server and how many documents in each collection. For more information, see:

* [Getting a database](https://pymongo.readthedocs.io/en/stable/tutorial.html#getting-a-database)
* [Getting a collection](https://pymongo.readthedocs.io/en/stable/tutorial.html#getting-a-collection)
* [Counting documents](https://pymongo.readthedocs.io/en/stable/tutorial.html#counting)

```python
# Get list of databases
databases = client.list_database_names()

# Loop through databases
for db in databases:
    print("Database: {}".format(db))

    # Get list of collections
    collections = client[db].list_collection_names()

    # Loop through collections
    for col in collections:
        print("\tCollection: {}".format(col))

        # Get document count
        doc_count = client[db][col].count_documents({})
        print("\tDocument count: {}".format(doc_count))
```

<!--
:::code language="javascript" source="~/azure-cosmos-db-mongodb-python-getting-started/202-get-doc-count/run.py" id="database_object":::
-->

The preceding code snippet displays output similar to the following example console output:

```python
Database: adventureworks
        Collection: products_new
        Document count: 1
        Collection: products
        Document count: 3
Database: testdb
        Collection: mycoll
        Document count: 1
```
<!-- 
:::code language="console" source="~/azure-cosmos-db-mongodb-python-getting-started/202-get-doc-count/run.py" id="console_result":::
-->

## Get database object instance

TBD

## Drop a database

TBD

## See also

- [Get started with Azure Cosmos DB for MongoDB and Python](how-to-python-get-started.md)
