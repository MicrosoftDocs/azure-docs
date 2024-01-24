---
title: CreateIndexes API
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Use create Indexing for empty collections in Azure Cosmos DB for MongoDB vCore.
author: khelanmodi
ms.author: khelanmodi
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 1/24/2024
---

# CreateIndexes API Enhancement in Azure Cosmos DB for MongoDB (vCore)

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

The `CreateIndexes` API in vCore-based Azure Cosmos DB for MongoDB has been enhanced with a new option to optimize index creation, especially beneficial for scenarios involving empty collections. This document outlines the usage and expected behavior of this new option while ensuring that the existing method remains effective for standard operations.

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).

## New Feature: Blocking Option

The `CreateIndexes` API now includes a `{ "blocking": true }` option, designed to provide more control over the indexing process in specific scenarios.

## Default Setting

The default value of this option is `false`, ensuring backward compatibility and maintaining the existing behavior for users who do not opt-in for the new feature.

## Define a Create Index

For simplicity, let us consider an example of a blog application with the following setup:

- **Database name**: `cosmicworks`
- **Collection name**: `products`

To demonstrate the use of this new option in the `cosmicworks` database for an empty collection named `products`, consider the following code:

```javascript
use cosmicworks;
db.runCommand({
  createIndexes: "products",
  indexes: [{"key":{"name":1}, "name":"name_1"}],
  blocking: true
})

```

This code snippet demonstrates how to use the blocking option, which will temporarily block write operations to the specified collection during index creation in an empty collection.

## Expected Behavior

Setting `{ "blocking": true }` blocks all write operations (delete, update, insert) to the collection until index creation is completed. This feature is particularly useful in scenarios such as migration utilities where indexes are created on empty collections before data writes commence.

## Advantages in Specific Scenarios

- **Efficiency in Migration Utilities**: This option is ideal in migration contexts, reducing the time for index creation by preventing delays caused by waiting for transactions with pre-existing snapshots.
- **Streamlined Index Creation Process**: In MongoDB, this translates to a simpler process with a single table scan, enhancing efficiency.
- **Enhanced Control**: Users gain more control over the indexing process, crucial in environments balancing read and write operations during index creation.

## Summary

The introduction of the blocking option in the `CreateIndexes` API of Azure Cosmos DB for MongoDB (vCore) is a strategic enhancement for optimizing index creation for an empty collection. This feature complements the existing method, providing an additional tool for scenarios requiring efficient index creation on empty collections.

## Related content

Check out [text indexing](how-to-create-text-index.md), which allows for efficient searching and querying of text-based data.

## Next step

> [!div class="nextstepaction"]
> [Build a Node.js web application](tutorial-nodejs-web-app.md)
