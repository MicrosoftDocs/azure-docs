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

Get started with the PyMongo package to create databases, collections, and doc withing your Azure CosmosDB resource. Follow these steps to install the package and try out example code for basic tasks.

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

Change directory to the root of the project folder. Create a *requirements.txt* file to include the [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/) and the [python-dotenv](https://pypi.org/project/python-dotenv/) packages.

```text
# requirements.txt
pymongo
python-dotenv
```
### Install packages

Create a virtual environment and install the packages with:

#### [Windows](#tab/windows-venv)

```bash
# py -3 uses the global python interpreter. You can also use python3 -m venv .venv.
py -3 -m venv .venv
source .venv/Scripts/activate   
pip install -r requirements.txt
```

#### [Linux / macOS](#tab/linux+macos-venv)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

### Configure environment variables

[!INCLUDE [Multi-tab](<./includes/environment-variables-connection-string.md>)]

## Object model

Before you continue building the application, let's look into the hierarchy of resources in the API for MongoDB and the object model that's used to create and access these resources. The API for MongoDB creates resources in the following order:

* Azure Cosmos DB for MongoDB account
* Databases 
* Collections 
* Documents

To learn more about the hierarchy of entities, see the [Azure Cosmos DB resource model](../account-databases-containers-items.md) article.
