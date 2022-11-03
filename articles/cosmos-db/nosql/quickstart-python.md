---
title: Quickstart - Azure Cosmos DB for NoSQL client library for Python
description: Learn how to build a .NET app to manage Azure Cosmos DB for NoSQL account resources and data in this quickstart.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: python
ms.topic: quickstart
ms.date: 11/03/2022
ms.custom: seodec18, seo-javascript-september2019, seo-python-october2019, devx-track-python, mode-api, ignite-2022, cosmos-dev-refresh, cosmos-dev-dotnet-path
---

# Quickstart: Azure Cosmos DB for NoSQL client library for Python

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Quickstart selector](includes/quickstart-selector.md)]

Get started with the Azure Cosmos DB client library for Python to create databases, containers, and items within your account. Follow these steps to install the package and try out example code for basic tasks.

> [!NOTE]
> The [example code snippets](https://github.com/azure-samples/cosmos-db-nosql-python-samples) are available on GitHub as a .NET project.

[API reference documentation](/python/api/azure-cosmos/azure.cosmos) | [Library source code](https://github.com/azure/azure-sdk-for-python/tree/main/sdk/cosmos/azure-cosmos) | [Package (PyPI)](https://pypi.org/project/azure-cosmos) | [Samples](samples-python.md)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://aka.ms/trycosmosdb).
- [Python 3.7 or later](https://www.python.org/downloads/)
  - Ensure the `python` executable is in your `PATH`.
- [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

### Prerequisite check

- In a terminal or command window, run ``python --version`` to check that the .NET SDK is version 3.7 or later.
- Run ``az --version`` (Azure CLI) or ``Get-Module -ListAvailable AzureRM`` (Azure PowerShell) to check that you have the appropriate Azure command-line tools installed.

## Setting up

This section walks you through creating an Azure Cosmos DB account and setting up a project that uses Azure Cosmos DB for NoSQL client library for .NET to manage resources.

### Create an Azure Cosmos DB account

> [!TIP]
> Alternatively, you can [try Azure Cosmos DB free](../try-free.md) before you commit. If you create an account using the free trial, you can safely skip this section.

[!INCLUDE [Create resource tabbed conceptual - ARM, Azure CLI, PowerShell, Portal](./includes/create-resources.md)]

### Create a new Python app

Create a new Python code file (*app.py*) in an empty folder using your preferred integrated development environment (IDE).

### Install the package

Add the [`azure-cosmos`](https://pypi.org/project/azure-cosmos) PyPI package to the Python app. Use the `pip install` command to install the package.

```bash
pip install azure-cosmos
```

### Configure environment variables

[!INCLUDE [Create environment variables for key and endpoint](./includes/environment-variables.md)]

## Object model

[!INCLUDE [Explain DOCUMENT DB object model](./includes/object-model.md)]

You'll use the following Python classes to interact with these resources:

- [``CosmosClient``](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient) - This class provides a client-side logical representation for the Azure Cosmos DB service. The client object is used to configure and execute requests against the service.
- [``DatabaseProxy``](/python/api/azure-cosmos/azure.cosmos.database.databaseproxy) - This class is a reference to a database that may, or may not, exist in the service yet. The database is validated server-side when you attempt to access it or perform an operation against it.
- [``ContainerProxy``](/python/api/azure-cosmos/azure.cosmos.container.containerproxy) - This class is a reference to a container that also may not exist in the service yet. The container is validated server-side when you attempt to work with it.

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Create a database](#create-a-database)
- [Create a container](#create-a-container)

The sample code described in this article creates a database named ``adventureworks`` with a container named ``products``. The ``products`` table is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

For this sample code, the container will use the category as a logical partition key.

### Authenticate the client

From the project directory, open the *app.py* file. In your editor, import the `CosmosClient` and `PartitionKey` classes from the `azure.cosmos` package.

```python
from azure.cosmos import CosmosClient, PartitionKey
```

Create variables for the `endpoint` and `key` environment variables using `os.environ`.

```python
import os
endpoint = os.environ['COSMOS_ENDPOINT']
key = os.environ['COSMOS_KEY']
```

Create a new client instance using the [`CosmosClient`](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient) class constructor and the two variables you created as parameters.

```python
client = CosmosClient(url=endpoint, credential=key)
```

### Create a database

Use the [`CosmosClient.create_database_if_not_exists`](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#azure-cosmos-cosmos-client-cosmosclient-create-database-if-not-exists) method to create a new database if it doesn't already exist. This method will return a [`DatabaseProxy`](/python/api/azure-cosmos/azure.cosmos.databaseproxy) reference to the existing or newly created database.

```python
database = client.create_database_if_not_exists(id='adventureworks')
```

### Create a container

The [`PartitionKey`](/python/api/azure-cosmos/azure.cosmos.partitionkey) class defines a partition key path that you can use when creating a container.

```python
partitionKeyPath = PartitionKey(path='/categoryId')
```

The [`Databaseproxy.create_container_if_not_exists`](/python/api/azure-cosmos/azure.cosmos.databaseproxy#azure-cosmos-databaseproxy-create-container-if-not-exists) method will create a new container if it doesn't already exist. This method will also return a [`ContainerProxy`](/python/api/azure-cosmos/azure.cosmos.containerproxy) reference to the container.

```python
container = database.create_container_if_not_exists(id='products', partition_key=partitionKeyPath,offer_throughput=400)
```

## Clean up resources

[!INCLUDE [Clean up resources - Azure CLI, PowerShell, Portal](./includes/clean-up-resources.md)]

## Next steps

In this quickstart,

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB for NoSQL](../import-data.md)
