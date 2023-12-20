---
title: SQUARE
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the square of the specified numeric value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# SQUARE (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the square of the specified numeric value.  
  
## Syntax
  
```sql
SQUARE(<numeric_expr>)  
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.  
  
## Examples

The following example returns the squares of various numbers.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/square/query.sql" highlight="2-6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/square/result.json":::

## Remarks

- This function doesn't use the index.

## Related content

- [System functions](system-functions.yml)
- [`SQRT`](sqrt.md)
- [`POWER`](power.md)
