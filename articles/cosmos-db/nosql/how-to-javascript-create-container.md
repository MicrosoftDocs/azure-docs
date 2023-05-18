---
title: Create a container in Azure Cosmos DB for NoSQL using JavaScript
description: Learn how to create a container in your Azure Cosmos DB for NoSQL account using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: javascript
ms.topic: how-to
ms.date: 05/17/2023
ms.custom: devx-track-js, cosmos-db-dev-journey
---

# Create a container in Azure Cosmos DB for NoSQL using JavaScript

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

Get a [Database](how-to-javascript-create-database.md) object, then create a [Container](/javascript/api/@azure/cosmos/container):

* [createIfNotExists](/javascript/api/@azure/cosmos/containers#@azure-cosmos-containers-createifnotexists) - Creates a container if it doesn't exist. If it does exist, return container.
* [create](/javascript/api/@azure/cosmos/containers#@azure-cosmos-containers-create) - Creates a container if it doesn't already exist. If it does exist, return error statusCode.

```javascript
const containerName = 'myContainer';

// Create or get existing container
const { statusCode, container } = await database.containers.createIfNotExists({ id: containerName });

// Create or return error
const { statusCode, container} = await database.containers.create({ id: containerName });
```

The statusCode is an HTTP response code. A successful response is in the 200-299 range.

## Delete a container

Once you get the [Container](/javascript/api/@azure/cosmos/container) object, you can use the Container object to [delete](/javascript/api/@azure/cosmos/container#@azure-cosmos-container-delete) the container:

```javascript
const { statusCode } = await container.delete();
```

The statusCode is an HTTP response code. A successful response is in the 200-299 range.

## Next steps

Now that you've create a container, use the next guide to create items.

> [!div class="nextstepaction"]
> [Create an item](how-to-javascript-create-item.md)