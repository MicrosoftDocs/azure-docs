---
title: ABS
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the positive value of the specified numeric expression
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# ABS (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the absolute (positive) value of the specified numeric expression.  
  
## Syntax
  
```sql
ABS(<numeric_expr>)  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |
  
## Return types
  
Returns a numeric expression.  
  
## Examples
  
The following example shows the results of using this function on three different numbers.  

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/absolute-value/query.sql" highlight="2-4":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/absolute-value/result.json":::

## Remarks

- This function benefits from the use of a [range index](../../index-policy.md#includeexclude-strategy).

## Related content

- [System functions](system-functions.yml)
- [`IS_NUMBER`](is-number.md)
