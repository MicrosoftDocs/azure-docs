---
title: CreateIndexes API
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Use vector indexing and search to integrate AI-based applications in Azure Cosmos DB for MongoDB vCore.
author: khelanmodi
ms.author: khelanmodi
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 1/24/2024
---

# CreateIndexes API Enhancement in vCore-based Azure Cosmos DB for MongoDB

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

The `CreateIndexes` API in vCore-based Azure Cosmos DB for MongoDB has been enhanced with a new option to optimize index creation, especially beneficial for scenarios involving empty collections. This document outlines the usage and expected behavior of this new option while ensuring that the existing method remains effective for standard operations.

## Enhancement Overview: New "Blocking" Option

The `CreateIndexes` API now includes an option to control the blocking behavior during index creation.

### Option Syntax:
```json
{ "blocking": true }
```

## Default Setting:
By default, this option is set to false, maintaining the existing non-blocking behavior.

```
Database name: cosmicworks
Collection name: products
```

Collection products is an empty collection. 

## Usage and Expected Behavior
### Usage Example:
To create indexes on the "products" collection with the new blocking behavior:

```
use cosmicworks;
db.runCommand({ createIndexes: "products", indexes: [{"key":{"name":1}, "name":"name_1"}], blocking:true})
```

This code snippet demonstrates how to use the blocking option, which will temporarily block write operations to the specified collection during index creation.

## Expected Behavior:
Setting `{ "blocking": true }` blocks all write operations (delete, update, insert) to the collection until index creation is completed. This feature is particularly useful in scenarios such as migration utilities where indexes are created on empty collections before data writes commence.

## Advantages in Specific Scenarios:
- Efficiency in Migration Utilities: This option is ideal in migration contexts, reducing the time for index creation by preventing delays caused by waiting for transactions with pre-existing snapshots.
- Streamlined Index Creation Process: In PostgreSQL, this translates to a simpler process with a single table scan, enhancing efficiency.
- Enhanced Control: Users gain more control over the indexing process, crucial in environments balancing read and write operations during index creation.

## Conclusion
The introduction of the blocking option in the CreateIndexes API of Azure Cosmos DB for MongoDB vCore is a strategic enhancement for optimizing index creation in specific use cases. This feature complements the existing method, providing an additional tool for scenarios requiring efficient index creation on empty collections.

## Related content

## Next step

