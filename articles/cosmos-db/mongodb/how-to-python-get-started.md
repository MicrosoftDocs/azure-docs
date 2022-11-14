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
ms.date: 11/14/2022
ms.custom: devx-track-js, ignite-2022
---

# Get started with Azure Cosmos DB for MongoDB and Python
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This article shows you how to connect to Azure Cosmos DB for MongoDB using the PyMongo driver package. Once connected, you can perform operations on databases, collections, and docs.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) are available on GitHub as a Python project.

This article shows you how to communicate with the Azure Cosmos DB’s API for MongoDB by using one of the open-source MongoDB client drivers for Python, [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/). Also, you'll use the [MongoDB extension commands](/azure/cosmos-db/mongodb/custom-commands), which are designed to help you create and obtain database resources that are specific to the [Azure Cosmos DB capacity model](/azure/cosmos-db/account-databases-containers-items).

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

The most common constructor for **MongoClient** has two parameters:

| Parameter | Example value | Description |
| --- | --- | --- |
| `host` | `COSMOS_CONNECTION_STRING` environment variable | API for MongoDB connection string to use for all requests |
| *`kwargs`* | `connect=False` | Keyword arguments for the connection. Many of the keyword arguments can also be specified using a MongoDB URI. If the same option is passed in a URI and as a keyword argument the keyword argument takes precedence. |

Refer to the [Troubleshooting guide](error-codes-solutions.md) for connection issues.

## Get resource name

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

> [!TIP]
> For this guide, we recommend using the resource group name ``msdocs-cosmos``.

[!INCLUDE [Portal - get connection string](<./includes/portal-get-connection-string-from-sign-in.md>)]

---


