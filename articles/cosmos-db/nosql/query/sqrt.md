---
title: SQRT
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the square root of the specified numeric value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# SQRT (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the square root of the specified numeric value.  

## Syntax

```sql
SQRT(<numeric_expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **``numeric_expr``** | A numeric expression. |

## Return types

Returns a numeric expression.  
  
## Examples
  
The following example returns the square roots of various numeric values.
  
:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/sqrt/query.sql" highlight="2-6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/sqrt/result.json":::

## Remarks

- This function doesn't use the index.
- If you attempt to find the square root value that results in an imaginary number, you get an error that the value can't be represented in JSON. For example, ``SQRT(-25)`` gives this error.

## Related content

- [System functions](system-functions.yml)
- [``POWER``](power.md)
