---
title: COS
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the trigonometric cosine of the specified angle.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# COS (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the trigonometric cosine of the specified angle in radians.
  
## Syntax
  
```sql
COS(<numeric_expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.  

## Examples
  
The following example calculates the cosine of the specified angle using the function.
  
:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/cos/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/cos/result.json":::

## Remarks

- This system function doesn't use the index.

## Related content

- [System functions](system-functions.yml)
- [`SIN`](sin.md)
