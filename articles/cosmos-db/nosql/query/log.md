---
title: LOG
description: An Azure Cosmos DB for NoSQL system function that returns the natural logarithm of the specified numeric expression
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# LOG (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the natural logarithm of the specified numeric expression.  

## Syntax

```sql
LOG(<numeric_expr> [, <numeric_base>])  
```  

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |
| **`numeric_base` *(Optional)*** | An optional numeric value that sets the base for the logarithm. If not set, the default value is the natural logarithm approximately equal to `2.718281828``. |

## Return types

Returns a numeric expression.

## Examples

The following example returns the logarithm value of various values.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/log-base/query.sql" highlight="2-3":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/log-base/result.json":::

## Remarks

- This function doesn't use the index.
- The natural logarithm of the exponential of a number is the number itself: `LOG( EXP( n ) ) = n`. And the exponential of the natural logarithm of a number is the number itself: `EXP( LOG( n ) ) = n`.

## Related content

- [System functions](system-functions.yml)
- [`LOG10`](log10.md)
