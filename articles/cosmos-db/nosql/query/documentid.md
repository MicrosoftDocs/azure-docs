---
title: DocumentId
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the partition-specific integer identifier for an item.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/19/2023
ms.custom: query-reference
---

# DocumentId (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Extracts the integer identifier corresponding to a specific item within a physical partition.

## Syntax

```sql
DOCUMENTID(<root_specifier>)
```

## Arguments

| | Description |
| --- | --- |
| **`root_specifier`** | Alias that identifies the root. |

## Return types

Integer identifying an item within a physical partition.

## Examples

For this example, consider a container with multiple items that exist in the same logical partition.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/documentid/seed.json" highlight="5,10":::

This example illustrates using this function as a filter to get specific items from a container.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/documentid/query.sql" highlight="9-10":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/documentid/result.json":::

## Remarks

- This function returns an integer value that is only unique within a single physical partition.

## See also

- [System functions](system-functions.yml)
- [`IS_OBJECT`](is-object.md)
