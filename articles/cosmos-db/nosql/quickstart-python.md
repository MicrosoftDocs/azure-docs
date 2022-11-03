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

Create a new Python code file (**app.py**) in an empty folder using your preferred integrated development environment (IDE).

### Install the package

Add the [`azure-cosmos`](https://pypi.org/project/azure-cosmos) PyPI package to the Python app. Use the `pip install` command to install the package.

```bash
pip install azure-cosmos
```
