---
title: IS_DEFINED
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns true if the property has been assigned a value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/20/2023
ms.custom: query-reference
---

# IS_DEFINED (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean indicating if the property has been assigned a value.  

## Syntax

```sql
IS_DEFINED(<expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`expr`** | Any expression. |
  
## Return types
  
Returns a boolean expression.

## Examples

The following example checks for the presence of a property within the specified JSON document. 

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/is-defined/query.sql" highlight="2-3":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/is-defined/result.json":::

## Remarks

- This function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [System functions](system-functions.yml)
- [`IS_NULL`](is-null.md)
