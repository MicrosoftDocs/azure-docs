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

[API for MongoDB reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (npm)](https://www.npmjs.com/package/mongodb)


## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* [Node.js LTS](https://nodejs.org/en/download/)
* [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)
* [Azure Cosmos DB for MongoDB resource](quickstart-nodejs.md#create-an-azure-cosmos-db-account)
