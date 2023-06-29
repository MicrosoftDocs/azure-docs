---
title: ARRAY_CONTAINS
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a boolean indicating whether the array contains the specified value
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# ARRAY_CONTAINS (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean indicating whether the array contains the specified value. You can check for a partial or full match of an object by using a boolean expression within the function.

## Syntax
  
```sql
ARRAY_CONTAINS (<array_expr>, <expr> [, <bool_expr>])  
```  
  
## Arguments
  
| | Description |
| --- | --- |
| **`arr_expr`** | An array expression. |
| **`expr`** | Expression to search for within the array. |
| **`bool_expr`** | A boolean expression indicating whether the search should check for a partial match (`true`) or a full match (`false`). If not specified, the default value is `false`. |
  
## Return types
  
Returns a boolean value.  
  
## Examples
  
The following example illustrates how to check for specific values or objects in an array using this function.  
  
```sql
SELECT VALUE {
    containsItem: ARRAY_CONTAINS(["coats", "jackets", "sweatshirts"], "coats"),
    missingItem: ARRAY_CONTAINS(["coats", "jackets", "sweatshirts"], "hoodies"),
    containsFullMatchObject: ARRAY_CONTAINS([{ category: "shirts", color: "blue" }], { category: "shirts", color: "blue" }),
    missingFullMatchObject: ARRAY_CONTAINS([{ category: "shirts", color: "blue" }], { category: "shirts" }),
    containsPartialMatchObject: ARRAY_CONTAINS([{ category: "shirts", color: "blue" }], { category: "shirts" }, true),
    missingPartialMatchObject: ARRAY_CONTAINS([{ category: "shirts", color: "blue" }], { category: "shorts", color: "blue" }, true)
}
```
  
```json
[
  {
    "containsItem": true,
    "missingItem": false,
    "containsFullMatchObject": true,
    "missingFullMatchObject": false,
    "containsPartialMatchObject": true,
    "missingPartialMatchObject": false
  }
]
```

## Remarks

- This system function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`ARRAY_CONCAT`](array-concat.md)
