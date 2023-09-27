---
title: 'Quickstart: Gremlin library for Node.js'
titleSuffix: Azure Cosmos DB for Apache Gremlin
description: In this quickstart, connect to Azure Cosmos DB for Apache Gremlin using Node.js. Then, create and traverse vertices and edges.
author: manishmsfte
ms.author: mansha
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.topic: quickstart
ms.date: 09/27/2023
# CustomerIntent: As a Node.js developer, I want to use a library for my programming language so that I can create and traverse vertices and edges in code.
---

# Quickstart: Azure Cosmos DB for Apache Gremlin library for Node.js

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

[!INCLUDE[Gremlin devlang](includes/quickstart-devlang.md)]

Azure Cosmos DB for Apache Gremlin is a fully managed graph database service implementing the popular [`Apache Tinkerpop`](https://tinkerpop.apache.org/), a graph computing framework using the Gremlin query language. The API for Gremlin gives you a low-friction way to get started using Gremlin with a service that can grow and scale out as much as you need with minimal management.

In this quickstart, you use the `gremlin` library to connect to a newly created Azure Cosmos DB for Gremlin account.

[Library source code](https://github.com/apache/tinkerpop/tree/master/gremlin-javascript/src/main/javascript/gremlin-javascript) | [Package (npm)](https://www.npmjs.com/package/gremlin)

## Prerequisites

- An Azure account with an active subscription.
  - No Azure subscription? [Sign up for a free Azure account](https://azure.microsoft.com/free/).
  - Don't want an Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no subscription required.
- [Node.js (LTS)](https://nodejs.org/)
  - Don't have Node.js installed? Try this quickstart in a devcontainer. [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/github/codespaces-blank?quickstart=1)
- [Azure Command-Line Interface (CLI)](/cli/azure/)

[!INCLUDE[Cloud Shell](../../../includes/cloud-shell-try-it.md)]

## Setting up

This section walks you through creating an API for Gremlin account an setting up a .NET project to use the library to connect to the account.

### Create an API for Gremlin account

The API for Gremlin account should be created prior to using the Node.js library. Additionally, it helps to also have the database and graph in place.

[!INCLUDE[Create account, database, and graph](includes/create-account-database-graph-cli.md)]







## Next step

> [!div class="nextstepaction"]
> [Create and query data using Azure Cosmos DB for Apache Gremlin](tutorial-query.md)
