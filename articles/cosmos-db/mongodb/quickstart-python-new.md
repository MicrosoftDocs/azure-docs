---
title: Quickstart - Azure Cosmos DB for MongoDB for Python with MongoDB driver
description: Learn how to build a Python app to manage Azure Cosmos DB for MongoDB account resources in this quickstart.
author: diberry
ms.author: diberry
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: python
ms.topic: quickstart
ms.date: 10/31/2022
ms.custom: devx-track-js, ignite-2022
---

# Quickstart: Azure Cosmos DB for MongoDB for Python with MongoDB driver

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Get started with the PyMongo package to create databases, collections, and doc withing your Azure Cosmos DB resource. Follow these steps to install the package and try out example code for basic tasks.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) are available on GitHub as a Python project.

[API for PyMongo reference documentation](https://www.mongodb.com/docs/drivers/pymongo/) | [PyMongo Package](https://www.mongodb.com/docs/drivers/pymongo/)

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* [Python 3.8+](https://www.python.org/downloads/)
* [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

### Prerequisite check

* In a terminal or command window, run `python --version`  to check that you have a recent version of Python.
* Run ``az --version`` (Azure CLI) or `Get-Module -ListAvailable Az*` (Azure PowerShell) to check that you have the appropriate Azure command-line tools installed.

## Setting up

This section walks you through creating an Azure Cosmos DB account and setting up a project that uses the MongoDB npm package.

### Create an Azure Cosmos DB account

This quickstart will create a single Azure Cosmos DB account using the API for MongoDB.

#### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI - create resources](<./includes/azure-cli-create-resource-group-and-resource.md>)]

#### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - create resource group and resources](<./includes/powershell-create-resource-group-and-resource.md>)]

#### [Portal](#tab/azure-portal)

[!INCLUDE [Portal - create resource](<./includes/portal-create-resource.md>)]

---

### Get MongoDB connection string

#### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI - get connection string](<./includes/azure-cli-get-connection-string.md>)]

#### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - get connection string](<./includes/powershell-get-connection-string.md>)]

#### [Portal](#tab/azure-portal)

[!INCLUDE [Portal - get connection string](<./includes/portal-get-connection-string-from-resource.md>)]

---

### Create a new Python app

Create a new empty folder using your preferred terminal. Or, you can fork and clone the [example code snippets](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) from GitHub.

Change directory to the root of the project folder. Make sure there is a *requirements.txt* file with lines for the [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/) and the [python-dotenv](https://pypi.org/project/python-dotenv/) packages.

```text
# requirements.txt
pymongo
python-dotenv
```
### Install packages

Create a virtual environment and install the packages with:

#### [Windows](#tab/venv-windows)

```bash
# py -3 uses the global python interpreter. You can also use python3 -m venv .venv.
py -3 -m venv .venv
source .venv/Scripts/activate   
pip install -r requirements.txt
```

#### [Linux / macOS](#tab/venv-linux+macos)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

### Configure environment variables

[!INCLUDE [Multi-tab](<./includes/environment-variables-connection-string.md>)]

## Object model

Let's look at the hierarchy of resources in the API for MongoDB and the object model that's used to create and access these resources. The API for MongoDB creates resources in the following order:

* [MongoClient](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html) - The first step when working with PyMongo is to create a MongoClient to connect to a **mongod** instance. This class provides a client-side logical representation for the API for MongoDB layer on Azure Cosmos DB. The client object is used to configure and execute requests against the service.

* [Database](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html) - A MongoDB instance can support one or more independent databases.

* [Collection](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html) - A database can contain one or more collections. A collection is a group of documents stored in MongoDB, and can be thought of as roughly the equivalent of a table in a relational database.

* [Document](https://pymongo.readthedocs.io/en/stable/tutorial.html#documents) - A document is a set of key-value pairs. Documents have dynamic schema. Dynamic schema means that documents in the same collection do not need to have the same set of fields or structure, and common fields in a collection's documents may hold different types of data.

To learn more about the hierarchy of entities, see the [Azure Cosmos DB resource model](../account-databases-containers-items.md) article.

## Code examples

* [Authenticate the client](#authenticate-the-client)
* [Get database instance](#get-database-instance)
* [Get collection instance](#get-collection-instance)
* [Chained instances](#chained-instances)
* [Create an index](#create-an-index)
* [Create a doc](#create-a-doc)
* [Get an doc](#get-a-doc)
* [Query docs](#query-docs)

The sample code described in this article creates a database named ``adventureworks`` with a collection named ``products``. The ``products`` collection is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier. The complete sample code is at https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/.

For this procedure, the database won't use sharding.

### Authenticate the client

1. In the project directory, create an *run.py* file. In your editor, add require statements to reference packages you'll use, including the PyMongo and python-dotenv packages.

    ```python
    import os
    import pymongo
    from dotenv import load_dotenv
    from random import randint
    ```
    <!--- 
        :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="package_dependencies":::
    --->
    
2. Get the connection information from the environment variable defined in an *.env* file.

    ```python
    load_dotenv()
    CONNECTION_STRING = os.environ.get('COSMOS_CONNECTION_STRING')
    ```
    <!--
        :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="client_credentials":::
    --->

3. Define some constants you'll use through the code.

    ```python
    DB_NAME = "adventureworks"
    UNSHARDED_COLLECTION_NAME = "products"
    ```
    <!--
        :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="constant_values":::
    --->

### Set up asynchronous operations

TBD: is applicable to Python?

### Connect to the database

Use the [``MongoClient``](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient) object to connect to your Azure Cosmos DB for MongoDB resource. The connect method returns a reference to the database.

```python
client = pymongo.MongoClient(CONNECTION_STRING)
```
<!--- 
:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="connect_client":::
--->

### Get database instance

When working with PyMongo you access databases using attribute style access on MongoClient instances. The code below also shows that if the database doesn't exist, it is created.

```python
# Database reference with creation on first write if it does not already exist.
db = client[DB_NAME]
```
<!---
:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="new_database" :::
--->

You can check if a database exists with the [list_database_names()](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient.list_database_names) method.


### Get collection instance

The [``MongoClient.Db.collection``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html#collection) gets a reference to a collection.

```python
# Collection reference with creation on first write if it does not already exist.
collection = db[UNSHARDED_COLLECTION_NAME]
```
<!---
:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="new_collection":::
--->

### Chained instances

Does this apply to Python?

### Create an index

Use the [``Collection.createIndex``](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#createIndex) to create an index on the document's properties you intend to use for sorting with the MongoDB's [``FindCursor.sort``](https://mongodb.github.io/node-mongodb-native/4.7/classes/FindCursor.html#sort) method.

```python
result = collection.create_index([('name', pymongo.ASCENDING)], unique=True)
print("Indexes are: {}".format(sorted(collection.index_information())))
```
<!---
:::code language="python" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="create_index":::
--->

### Create a doc

Create a doc with the *product* properties for the `adventureworks` database:

* An _id property for the unique identifier of the product.
* A *category* property. This property can be used as the logical partition key.
* A *name* property.
* An inventory *quantity* property.
* A *sale* property, indicating whether the product is on sale.
