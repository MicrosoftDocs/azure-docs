---
title: Create a container in Azure Cosmos DB for NoSQL using Python
description: Learn how to create a container in your Azure Cosmos DB for NoSQL database using the Python SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: python
ms.topic: how-to
ms.date: 12/06/2022
ms.custom: devx-track-python, devguide-python, cosmos-db-dev-journey
---

# Create a container in Azure Cosmos DB for NoSQL using Python

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Containers in Azure Cosmos DB store sets of items. Before you can create, query, or manage items, you must first create a container.

## Name a container

In Azure Cosmos DB, a container is analogous to a table in a relational database. When you create a container, the container name forms a segment of the URI used to access the container resource and any child items.

Here are some quick rules when naming a container:

- Keep container names between 3 and 63 characters long
- Container names can only contain lowercase letters, numbers, or the dash (-) character.
- Container names must start with a lowercase letter or number.

Once created, the URI for a container is in this format:

`https://<cosmos-account-name>.documents.azure.com/dbs/<database-name>/colls/<container-name>`

## Create a container

To create a container, call one of the following methods:

- [CreateContainerAsync](#create-a-container)
- [CreateContainerIfNotExistsAsync](#create-a-container-if-it-doesnt-already-exist)
- [Create a container asynchronously](#create-a-container-asynchronously)

### Create a container

The following example creates a container with the [``DatabaseProxy.create_container``](/python/api/azure-cosmos/azure.cosmos.databaseproxy#azure-cosmos-databaseproxy-create-container) method. This method throws an exception if the container with the same name already exists.

:::code language="python" source="~/cosmos-db-nosql-python-samples/005-create-container/app.py" id="create_container":::

### Create a container if it doesn't already exist

The following example creates a container with the [``DatabaseProxy.create_container_if_not_exists``](/python/api/azure-cosmos/azure.cosmos.databaseproxy#azure-cosmos-databaseproxy-create-container-if-not-exist) method. Compared to the previous create method, this method doesn't throw an exception if the database already exists. This method is useful for avoiding errors if you run the same code multiple times.

:::code language="python" source="~/cosmos-db-nosql-python-samples/005-create-container/app_exists.py" id="create_container":::

### Create a container asynchronously

You can also create a database asynchronously using similar object and methods in the [azure.cosmos.aio](/python/api/azure-cosmos/azure.cosmos.aio) namespace. For example, use the [DatabaseProxy.create_database](/python/api/azure-cosmos/azure.cosmos.aio.databaseproxy#azure-cosmos-aio-databaseproxy-create-container) method or the [CosmoClient.create_database_if_not_exists](/python/api/azure-cosmos/azure.cosmos.aio.databaseproxy#azure-cosmos-aio-databaseproxy-create-container-if-not-exists) method.

Working asynchronously is useful when you want to perform multiple operations in parallel. For more information, see [Using the asynchronous client](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cosmos/azure-cosmos#using-the-asynchronous-client).

## Parsing the response

In the examples above, the response from the requests is a [``ContainerProxy``](/python/api/azure-cosmos/azure.cosmos.containerproxy), which is an interface to interact with a DB Container. From the proxy, you can access methods to perform operations on the container.

The following example shows the **create_container_if_not_exists** method returning a **container** object.

:::code language="python" source="~/cosmos-db-nosql-python-samples/005-create-container/app_exists.py" id="parse_response":::

## Next steps

Now that you've create a container, use the next guide to create items.

> [!div class="nextstepaction"]
> [Examples for Azure Cosmos DB for NoSQL SDK for Python](samples-python.md)
