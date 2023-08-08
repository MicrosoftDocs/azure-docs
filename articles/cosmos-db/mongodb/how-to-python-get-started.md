---
title: Get started with Azure Cosmos DB for MongoDB and Python
description: Get started developing a Python application that works with Azure Cosmos DB for MongoDB. This article helps you learn how to set up a project and configure access to an Azure Cosmos DB for MongoDB database.
author: diberry
ms.author: diberry
ms.service: cosmos-db
ms.reviewer: sidandrews
ms.subservice: mongodb
ms.devlang: python
ms.topic: how-to
ms.date: 11/18/2022
ms.custom: ignite-2022, devx-track-python
---

# Get started with Azure Cosmos DB for MongoDB and Python
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This article shows you how to connect to Azure Cosmos DB for MongoDB using the PyMongo driver package. Once connected, you can perform operations on databases, collections, and docs.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) are available on GitHub as a Python project.

This article shows you how to communicate with the Azure Cosmos DB’s API for MongoDB by using one of the open-source MongoDB client drivers for Python, [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* [Python 3.8+](https://www.python.org/downloads/)
* [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)
* [Azure Cosmos DB for MongoDB resource](quickstart-python.md#create-an-azure-cosmos-db-account)

## Create a new Python app

1. Create a new empty folder using your preferred terminal and change directory to the folder.

    > [!NOTE]
    > If you just want the finished code, download or fork and clone the [example code snippets](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) repo that has the full example. You can also `git clone` the repo in Azure Cloud Shell to walk through the steps shown in this quickstart.

2. Create a *requirements.txt* file that lists the [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/) and [python-dotenv](https://pypi.org/project/python-dotenv/) packages. The `dotenv` package is used to read the environment variables from a `.env` file during local development.

    ```text
    # requirements.txt
    pymongo
    python-dotenv
    ```

3. Create a virtual environment and install the packages.

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

## Connect with PyMongo driver to Azure Cosmos DB for MongoDB

To connect with the PyMongo driver to Azure Cosmos DB, create an instance of the  [MongoClient](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient) object. This class is the starting point to perform all operations against databases. 

The most common constructor for **MongoClient** requires just the `host` parameter, which in this article is set to the `COSMOS_CONNECTION_STRING` environment variable. There are other optional parameters and keyword parameters you can use in the constructor. Many of the optional parameters can also be specified with the `host` parameter. If the same option is passed in with `host` and as a parameter, the parameter takes precedence.

Refer to the [Troubleshooting guide](error-codes-solutions.md) for connection issues.

## Get resource name

In the commands below, we show *msdocs-cosmos* as the resource group name. Change the name as appropriate for your situation.

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI - get resource name](<./includes/azure-cli-get-resource-name.md>)]

### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - set resource name](<./includes/powershell-set-resource-name.md>)]

### [Portal](#tab/azure-portal)

Skip this step and use the information for the portal in the next step.

---
## Retrieve your connection string

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI - get connection string](<./includes/azure-cli-get-connection-string.md>)]

### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - get connection string](<./includes/powershell-get-connection-string.md>)]

### [Portal](#tab/azure-portal)

[!INCLUDE [Portal - get connection string](<./includes/portal-get-connection-string-from-sign-in.md>)]

---

## Configure environment variables

[!INCLUDE [Multitab - store connection string in environment variable](<./includes/environment-variables-connection-string.md>)]

## Create MongoClient with connection string

1. Add dependencies to reference the [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/) and [python-dotenv](https://pypi.org/project/python-dotenv/) packages.

    :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/101-client-connection-string/run.py" id="package_dependencies":::

2. Define a new instance of the `MongoClient` class using the constructor and the connection string read from an environment variable.

    :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/101-client-connection-string/run.py" id="client_credentials":::

For more information on different ways to create a ``MongoClient`` instance, see [Making a Connection with MongoClient](https://pymongo.readthedocs.io/en/stable/tutorial.html#making-a-connection-with-mongoclient).

## Close the MongoClient connection

When your application is finished with the connection, remember to close it. That `.close()` call should be after all database calls are made. 

```python
client.close()
```

## Use MongoDB client classes with Azure Cosmos DB for API for MongoDB

[!INCLUDE [Conceptual object model](<./includes/conceptual-object-model.md>)]

Each type of resource is represented by one or more associated Python classes. Here's a list of the most common classes:

* [MongoClient](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html) - The first step when working with PyMongo is to create a MongoClient to connect to Azure Cosmos DB's API for MongoDB. The client object is used to configure and execute requests against the service.

* [Database](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html) - Azure Cosmos DB's API for MongoDB can support one or more independent databases.

* [Collection](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html) - A database can contain one or more collections. A collection is a group of documents stored in MongoDB, and can be thought of as roughly the equivalent of a table in a relational database.

* [Document](https://pymongo.readthedocs.io/en/stable/tutorial.html#documents) - A document is a set of key-value pairs. Documents have dynamic schema. Dynamic schema means that documents in the same collection don't need to have the same set of fields or structure. And common fields in a collection's documents may hold different types of data.

To learn more about the hierarchy of entities, see the [Azure Cosmos DB resource model](../resource-model.md) article.

## See also

- [PyPI Package](https://pypi.org/project/azure-cosmos/)
- [API reference](https://www.mongodb.com/docs/drivers/python/)

## Next steps

Now that you've connected to an API for MongoDB account, use the next guide to create and manage databases.

> [!div class="nextstepaction"]
> [Create a database in Azure Cosmos DB for MongoDB using Python](how-to-python-manage-databases.md)
