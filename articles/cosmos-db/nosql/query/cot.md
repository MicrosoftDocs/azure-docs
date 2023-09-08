---
title: COT
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the trigonometric cotangent of the specified angle.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/19/2023
ms.custom: query-reference
---

# COT (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the trigonometric cotangent of the specified angle in radians.
  
## Syntax
  
```sql
COT(<numeric_expr>)  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |
  
## Return types
  
Returns a numeric expression.  
  
## Examples

The following example calculates the cotangent of the specified angle using the function.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/cot/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/cot/result.json":::

## Remarks

- This function doesn't use the index.

## Next steps

- [System functions](system-functions.yml)
- [`TAN`](tan.md)
