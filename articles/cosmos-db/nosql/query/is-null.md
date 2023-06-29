---
title: IS_NULL
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a boolean indicating whether an expression evaluates to null.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# IS_NULL (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean value indicating if the type of the specified expression is `null`.  
  
## Syntax
  
```sql
IS_NULL(<expr>)  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`expr`** | Any expression. |
  
## Return types
  
Returns a boolean expression.  
  
## Examples

The following example checks objects of various types using the function.  
  
```sql
SELECT VALUE {
    booleanIsNull: IS_NULL(true),
    numberIsNull: IS_NULL(15),  
    stringIsNull: IS_NULL("AdventureWorks"),   
    nullIsNull: IS_NULL(null),  
    objectIsNull: IS_NULL({price: 85.23}),   
    arrayIsNull: IS_NULL(["red", "blue", "yellow"]),  
    populatedObjectPropertyIsNull: IS_NULL({quantity: 25, vendor: null}.quantity),
    invalidObjectPropertyIsNull: IS_NULL({quantity: 25, vendor: null}.size),
    nullObjectPropertyIsNull: IS_NULL({quantity: 25, vendor: null}.vendor)
}
```  
  
```json
[
  {
    "booleanIsNull": false,
    "numberIsNull": false,
    "stringIsNull": false,
    "nullIsNull": true,
    "objectIsNull": false,
    "arrayIsNull": false,
    "populatedObjectPropertyIsNull": false,
    "invalidObjectPropertyIsNull": false,
    "nullObjectPropertyIsNull": true
  }
]
```  

## Remarks

- This system function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`IS_OBJECT`](is-object.md)
