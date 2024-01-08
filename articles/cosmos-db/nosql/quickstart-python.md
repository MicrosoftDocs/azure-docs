---
title: Quickstart - Python client library
titleSuffix: Azure Cosmos DB for NoSQL
description: Deploy a Python Flask web application that uses the client library to interact with Azure Cosmos DB for NoSQL data in this quickstart.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: python
ms.topic: quickstart-sdk
ms.date: 01/08/2023
zone_pivot_groups: azure-cosmos-db-quickstart-env
# CustomerIntent: As a developer, I want to learn the basics of the Python library so that I can build applications with Azure Cosmos DB for NoSQL.
---

# Quickstart: Azure Cosmos DB for NoSQL library for Python

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Developer Quickstart selector](includes/quickstart/dev-selector.md)]

Get started with the Azure Cosmos DB for NoSQL client library for Python to query data in your containers and perform common operations on individual items. Follow these steps to deploy a minimal solution to your environment using the Azure Developer CLI.

[API reference documentation](/python/api/overview/azure/cosmos-readme) | [Library source code](https://github.com/azure/azure-sdk-for-python/tree/main/sdk/cosmos/azure-cosmos) | [Package (PyPI)](https://pypi.org/project/azure-cosmos) | [Azure Developer CLI](/azure/developer/azure-developer-cli/overview)

## Prerequisites

[!INCLUDE[Developer Quickstart prerequisites](includes/quickstart/dev-prereqs.md)]

## Setting up

Deploy this project's development container to your environment. Then, use the Azure Developer CLI (`azd`) to create an Azure Cosmos DB for NoSQL account and deploy a containerized sample application. The sample application uses the client library to manage, create, read, and query sample data.

::: zone pivot="devcontainer-codespace"

[![Open in GitHub Codespaces](https://img.shields.io/static/v1?style=for-the-badge&label=GitHub+Codespaces&message=Open&color=brightgreen&logo=github)](https://codespaces.new/azure-samples/cosmos-db-nosql-python-quickstart?template=false&quickstart=1&azure-portal=true)

::: zone-end

::: zone pivot="devcontainer-vscode"

[![Open in Dev Container](https://img.shields.io/static/v1?style=for-the-badge&label=Dev+Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/cosmos-db-nosql-python-quickstart)

::: zone-end

[!INCLUDE[Developer Quickstart setup](includes/quickstart/dev-setup.md)]

### Install the client library

TODO

## Object model

| Name | Description |
| --- | --- |
| [`CosmosClient`](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient) | This class is the primary client class and is used to manage account-wide metadata or databases. |
| [`DatabaseProxy`](/python/api/azure-cosmos/azure.cosmos.database.databaseproxy) | This class represents a database within the account. |
| [`CotnainerProxy`](/python/api/azure-cosmos/azure.cosmos.container.containerproxy) | This class is primarily used to perform read, update, and delete operations on either the container or the items stored within the container. |
| [`PartitionKey`](/python/api/azure-cosmos/azure.cosmos.partition_key.partitionkey) | This class represents a logical partition key. This class is required for many common operations and queries. |

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Get a database](#get-a-database)
- [Get a container](#get-a-container)
- [Create an item](#create-an-item)
- [Get an item](#read-an-item)
- [Query items](#query-items)

[!INCLUDE[Developer Quickstart sample explanation](includes/quickstart/dev-sample-primer.md)]

### Authenticate the client

[!INCLUDE[Developer Quickstart authentication explanation](includes/quickstart/dev-auth-primer.md)]

TODO

### Get a database

TODO

### Get a container

TODO

### Create an item

TODO

### Read an item

TODO

### Query items

TODO

## Related content

- [.NET Quickstart](quickstart-dotnet.md)
- [JavaScript/Node.js Quickstart](quickstart-nodejs.md)
- [Java Quickstart](quickstart-java.md)
- [Go Quickstart](quickstart-go.md)

## Next step

> [!div class="nextstepaction"]
> [PyPI package](https://pypi.org/project/azure-cosmos)
