---
title: LOG10
description: An Azure Cosmos DB for NoSQL system function that returns the base-10 logarithm of the specified numeric expression
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# LOG10 (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the base-10 logarithm of the specified numeric expression.  
  
## Syntax

```sql
LOG10(<numeric_expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.  

## Examples

The following example returns the logarithm value of various values.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/log10/query.sql" highlight="2-4":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/log10/result.json":::

## Remarks

- This function doesn't use the index.
- The `LOG10` and `POWER` functions are inversely related to one another.

## Related content

- [System functions](system-functions.yml)
- [`LOG`](log.md)
