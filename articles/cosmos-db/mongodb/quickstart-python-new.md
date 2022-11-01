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

The sample code described in this article creates a database named ``adventureworks`` with a collection named ``products``. The ``products`` collection is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

For this procedure, the database won't use sharding.

