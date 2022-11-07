---
title: Get started with Azure Cosmos DB for MongoDB and Python
description: Get started developing a Python application that works with Azure Cosmos DB for MongoDB. This article helps you learn how to set up a project and configure access to an Azure Cosmos DB for MongoDB database.
author: diberry
ms.author: diberry
ms.reviewer: seesharprun
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: python
ms.topic: how-to
ms.date: 11/07/2022
ms.custom: devx-track-js, ignite-2022
---

# Get started with Azure Cosmos DB for MongoDB and Python
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This article shows you how to connect to Azure Cosmos DB for MongoDB using the [PyMongo](https://pypi.org/project/pymongo/) driver for Python. Once connected, you can perform operations on databases, collections, and docs.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) are available on GitHub as a Python project.

In this quickstart, you'll communicate with the Azure Cosmos DB’s API for MongoDB by using any of the open-source MongoDB client drivers for Python. Here, we'll use the [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/) driver. Also, you'll use the [MongoDB extension commands](/azure/cosmos-db/mongodb/custom-commands), designed to help you create and obtain database resources that are specific to the [Azure Cosmos DB capacity model](/azure/cosmos-db/account-databases-containers-items).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* [Python 3.8+](https://www.python.org/downloads/)
* [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)
* [Azure Cosmos DB for MongoDB resource](quickstart-python#create-a-database-account)

## Create a new Python app

