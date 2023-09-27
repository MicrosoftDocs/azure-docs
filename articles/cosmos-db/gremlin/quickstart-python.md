---
title: 'Quickstart: Gremlin library for Python'
titleSuffix: Azure Cosmos DB for Apache Gremlin
description: In this quickstart, connect to Azure Cosmos DB for Apache Gremlin using Python. Then, create and traverse vertices and edges.
author: manishmsfte
ms.author: mansha
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.topic: quickstart-sdk
ms.date: 09/27/2023
# CustomerIntent: As a Python developer, I want to use a library for my programming language so that I can create and traverse vertices and edges in code.
---

# Quickstart: Azure Cosmos DB for Apache Gremlin library for Python

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

[!INCLUDE[Gremlin devlang](includes/quickstart-devlang.md)]

Azure Cosmos DB for Apache Gremlin is a fully managed graph database service implementing the popular [`Apache Tinkerpop`](https://tinkerpop.apache.org/), a graph computing framework using the Gremlin query language. The API for Gremlin gives you a low-friction way to get started using Gremlin with a service that can grow and scale out as much as you need with minimal management.

In this quickstart, you use the `gremlinpython` library to connect to a newly created Azure Cosmos DB for Gremlin account.

[Library source code](https://github.com/apache/tinkerpop/tree/master/gremlin-python/src/main/python) | [Package (PyPi)](https://pypi.org/project/gremlinpython/)

## Prerequisites

- An Azure account with an active subscription.
  - No Azure subscription? [Sign up for a free Azure account](https://azure.microsoft.com/free/).
  - Don't want an Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no subscription required.
- [Python (latest)](https://www.python.org/)
  - Don't have Python installed? Try this quickstart in [GitHub Codespaces](https://codespaces.new/github/codespaces-blank?quickstart=1).
- [Azure Command-Line Interface (CLI)](/cli/azure/)

[!INCLUDE[Cloud Shell](../../../includes/cloud-shell-try-it.md)]

## Setting up

This section walks you through creating an API for Gremlin account and setting up a .NET project to use the library to connect to the account.

### Create an API for Gremlin account

The API for Gremlin account should be created prior to using the Python library. Additionally, it helps to also have the database and graph in place.

[!INCLUDE[Create account, database, and graph](includes/create-account-database-graph-cli.md)]









## Clean up resources

When you no longer need the API for Gremlin account, delete the corresponding resource group.

[!INCLUDE[Delete account](includes/delete-account-cli.md)]

## Next step

> [!div class="nextstepaction"]
> [Create and query data using Azure Cosmos DB for Apache Gremlin](tutorial-query.md)
