---
title: Create an item in Azure Cosmos DB for NoSQL using JavaScript
description: Learn how to create an item in your Azure Cosmos DB for NoSQL account using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: javascript
ms.topic: how-to
ms.date: 05/17/2023
ms.custom: devx-track-js, cosmos-db-dev-journey
---

# Create an item in Azure Cosmos DB for NoSQL using JavaScript

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Items in Azure Cosmos DB represent a specific entity stored within a container. In the API for NoSQL, an item consists of JSON-formatted data with a unique identifier.

## Item, item definition, and item response

In the JavaScript SDK, the three objects related to an item have different purposes. 

|Name|Operations|
|--|--|
|[Item](/javascript/api/@azure/cosmos/item)|Functionality including **Read**, **Patch**, **Replace**, **Delete**.|
|[ItemDefinition](/javascript/api/@azure/cosmos/itemdefinition)|Your custom data object. Includes `id` and `ttl` properties automatically.|
|[ItemResponse](/javascript/api/@azure/cosmos/itemresponse)|Includes `statusCode`, `item`, and other properties.|

Use the properties of the **ItemResponse** object to understand the result of the operation.

* **statusCode**: HTTP status code. A successful response is in the 200-299 range.
* **activityId**: Unique identifier for the operation such as create, read, replace, or delete.
* **etag**: Entity tag associated with the data. Use for optimistic concurrency, caching, and conditional requests.
* **item**: [Item](/javascript/api/@azure/cosmos/item) object used to perform operations such as read, replace, delete.
* **resource**: Your custom data.

## Create a unique identifier for an item

The unique identifier is a distinct string that identifies an item within a container. The ``id`` property is the only required property when creating a new JSON document. For example, this JSON document is a valid item in Azure Cosmos DB:

```json
{
  "id": "unique-string-2309509"
}
```

Within the scope of a container, two items can't share the same unique identifier.

> [!IMPORTANT]
> The ``id`` property is case-sensitive. Properties named ``ID``, ``Id``, ``iD``, and ``_id`` will be treated as an arbitrary JSON property.

Once created, the URI for an item is in this format:

``https://<cosmos-account-name>.documents.azure.com/dbs/<database-name>/docs/<item-resource-identifier>``

When referencing the item using a URI, use the system-generated *resource identifier* instead of the ``id`` field. For more information about system-generated item properties in Azure Cosmos DB for NoSQL, see [properties of an item](../resource-model.md#properties-of-an-item)

## Create an item

Create an item with the container's [items](/javascript/api/@azure/cosmos/container#@azure-cosmos-container-items) object using the [create](/javascript/api/@azure/cosmos/items) method.

```javascript
const { statusCode, item, resource, activityId, etag} = await container.items.create({ 
        id: '2', 
        category: 'gear-surf-surfboards',
        name: 'Sunnox Surfboard',
        quantity: 8,
        sale: true 
    });
```

## Access an item

Access an item through the [Item](/javascript/api/@azure/cosmos/item) object. This can accessed from the [Container](/javascript/api/@azure/cosmos/container) object or changed from either the [Database](/javascript/api/@azure/cosmos/database) or [CosmosClient](/javascript/api/@azure/cosmos/cosmosclient) objects.

```javascript
// Chained, then use a method of the Item object such as `read`
const { statusCode, item, resource, activityId, etag} = await client.database(databaseId).container(containerId).item(itemId).read();
```

Access by object:
* [Items](/javascript/api/@azure/cosmos/items) (plural): Create, batch, watch change feed, read all, upsert, or query items.
* [Item](/javascript/api/@azure/cosmos/item) (singular): Read, patch, replace, or delete an item.

## Replace an item

Replace the data with the [Item](/javascript/api/@azure/cosmos/item) object with the [replace](/javascript/api/@azure/cosmos/item#@azure-cosmos-item-replace) method.

```javascript
const { statusCode, item, resource, activityId, etag} = await item.replace({ 
        id: '2', 
        category: 'gear-surf-surfboards-retro',
        name: 'Sunnox Surfboard Retro',
        quantity: 5,
        sale: false 
    });
```

## Read an item

Read the most current data with the [Item](/javascript/api/@azure/cosmos/item) object's [read](/javascript/api/@azure/cosmos/item#@azure-cosmos-item-read) method.

```javascript
const { statusCode, item, resource, activityId, etag} = await item.read();
```

## Delete an item

Delete the item with the [Item](/javascript/api/@azure/cosmos/item) object's' [delete](/javascript/api/@azure/cosmos/item#@azure-cosmos-item-read) method.

```javascript
const { statusCode, item, activityId, etag} = await item.delete();
```

## Next steps

Now that you've created various items, use the next guide to query for item.

> [!div class="nextstepaction"]
> [Read an item](how-to-javascript-query-items.md)