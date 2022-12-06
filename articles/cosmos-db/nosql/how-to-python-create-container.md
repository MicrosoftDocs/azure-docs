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

``https://<cosmos-account-name>.documents.azure.com/dbs/<database-name>/colls/<container-name>``

## Create a container

To create a container, call one of the following methods:

- [``CreateContainerAsync``](#create-a-container-asynchronously)
- [``CreateContainerIfNotExistsAsync``](#create-a-container-asynchronously-if-it-doesnt-already-exist)

### Create a container asynchronously

The following example creates a container asynchronously:

```python
TBD
```
<!--
:::code language="python" source="~/cosmos-db-nosql-python-samples/005-create-container/app.py" id="create_container":::
-->
The [``DatabaseProxy.create_container``](/python/api/azure-cosmos/azure.cosmos.aio.databaseproxy#azure-cosmos-aio-databaseproxy-create-container) method will throw an exception if a database with the same name already exists.

### Create a container asynchronously if it doesn't already exist

The following example creates a container asynchronously only if it doesn't already exist on the account:

```python
TBD
```
<!--
:::code language="python" source="~/cosmos-db-nosql-python-samples/005-create-container/app.py" id="create_container_check":::
-->

The [``DatabaseProxy.create_container_if_not_exists``](/python/api/azure-cosmos/azure.cosmos.aio.databaseproxy#azure-cosmos-aio-databaseproxy-create-container-if-not-exists) method will only create a new container if it doesn't already exist. This method is useful for avoiding errors if you run the same code multiple times.

## Parsing the response

In tje examples above, the response from the asynchronous request is a [``ContainerProxy``](/python/api/azure-cosmos/azure.cosmos.aio.containerproxy), which is an interface to interact with a DB Container. From the proxy you can use the methods to perform operations on the container.

The following example shows the **create_container_if_not_exists** method returning a **container** object.

```python
TBD
```
<!--
:::code language="python" source="~/cosmos-db-nosql-python-samples/005-create-container/app.py" id="create_container_response":::
-->

## Next steps

Now that you've create a container, use the next guide to create items.

> [!div class="nextstepaction"]
> [Examples for Azure Cosmos DB for NoSQL SDK for Python](samples-python.md)
