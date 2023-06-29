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
ms.date: 07/01/2023
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
  
```sql
SELECT VALUE {
    absoluteNegativeOne: ABS(-1),
    absoluteZero: ABS(0),
    absoluteOne: ABS(1)
} 
```  
  
```json
[
  {
    "absoluteNegativeOne": 1,
    "absoluteZero": 0,
    "absoluteOne": 1
  }
]
```

## Remarks

- This function benefits from the use of a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`IS_NUMBER`](is-number.md)
