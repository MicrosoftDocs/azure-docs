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
ms.custom: devx-track-python, devx-track-extended-azdevcli
ms.topic: quickstart-sdk
ms.date: 01/08/2024
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

The client library is available through the Python Package Index, as the `azure-cosmos` library.

1. Open a terminal and navigate to the `/src` folder.

    ```bash
    cd ./src
    ```

1. If not already installed, install the `azure-cosmos` package using `pip install`.

    ```bash
    pip install azure-cosmos
    ```

1. Also, install the `azure-identity` package if not already installed.

    ```bash
    pip install azure-identity
    ```

1. Open and review the **src/requirements.txt** file to validate that the `azure-cosmos` and `azure-identity` entries both exist.

## Object model

| Name | Description |
| --- | --- |
| [`CosmosClient`](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient) | This class is the primary client class and is used to manage account-wide metadata or databases. |
| [`DatabaseProxy`](/python/api/azure-cosmos/azure.cosmos.database.databaseproxy) | This class represents a database within the account. |
| [`ContainerProxy`](/python/api/azure-cosmos/azure.cosmos.container.containerproxy) | This class is primarily used to perform read, update, and delete operations on either the container or the items stored within the container. |
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

This sample creates a new instance of the `CosmosClient` type and authenticates using a `DefaultAzureCredential` instance.

:::code language="python" source="~/cosmos-db-nosql-python-quickstart/src/cosmos.py" id="create_client" highlight="2":::

### Get a database

Use `client.get_database_client` to retrieve the existing database named *`cosmicworks`*.

:::code language="python" source="~/cosmos-db-nosql-python-quickstart/src/cosmos.py" id="get_database":::

### Get a container

Retrieve the existing *`products`* container using `database.get_container_client`.

:::code language="python" source="~/cosmos-db-nosql-python-quickstart/src/cosmos.py" id="get_container":::

### Create an item

Build a new object with all of the members you want to serialize into JSON. In this example, the type has a unique identifier, and fields for category, name, quantity, price, and sale. Create an item in the container using `container.upsert_item`. This method "upserts" the item effectively replacing the item if it already exists.

:::code language="python" source="~/cosmos-db-nosql-python-quickstart/src/cosmos.py" id="create_item" highlight="8":::

### Read an item

Perform a point read operation by using both the unique identifier (`id`) and partition key fields. Use `container.read_item` to efficiently retrieve the specific item.

:::code language="python" source="~/cosmos-db-nosql-python-quickstart/src/cosmos.py" id="read_item" highlight="1":::

### Query items

Perform a query over multiple items in a container using `container.GetItemQueryIterator`. Find all items within a specified category using this parameterized query:

```nosql
SELECT * FROM products p WHERE p.category = @category
```

:::code language="python" source="~/cosmos-db-nosql-python-quickstart/src/cosmos.py" id="query_items" highlight="1,2":::

Loop through the results of the query.

:::code language="python" source="~/cosmos-db-nosql-python-quickstart/src/cosmos.py" id="parse_results" highlight="1":::

## Related content

- [.NET Quickstart](quickstart-dotnet.md)
- [JavaScript/Node.js Quickstart](quickstart-nodejs.md)
- [Java Quickstart](quickstart-java.md)
- [Go Quickstart](quickstart-go.md)

## Next step

> [!div class="nextstepaction"]
> [PyPI package](https://pypi.org/project/azure-cosmos)
