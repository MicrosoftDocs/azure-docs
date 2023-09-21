---
title: FLOOR
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns return the largest integer less than or equal to the specified numeric expression
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/19/2023
ms.custom: query-reference
---

# FLOOR (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the largest integer less than or equal to the specified numeric expression.  
  
## Syntax
  
```sql
FLOOR(<numeric_expr>)  
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.  
  
## Examples

The following example shows positive numeric, negative, and zero values evaluated with this function.  

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/floor/query.sql" highlight="2-6":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/floor/result.json":::

## Remarks

- This system function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [System functions](system-functions.yml)
- [Introduction to Azure Cosmos DB](../../introduction.md)
