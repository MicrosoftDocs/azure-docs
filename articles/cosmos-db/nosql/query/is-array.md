---
title: IS_ARRAY
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a boolean indicating whether an expression is an array.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# IS_ARRAY (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean value indicating if the type of the specified expression is an array.  
  
## Syntax
  
```sql
IS_ARRAY(<expr>)  
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
    booleanIsArray: IS_ARRAY(true),
    numberIsArray: IS_ARRAY(65),  
    stringIsArray: IS_ARRAY("AdventureWorks"),   
    nullIsArray: IS_ARRAY(null),  
    objectIsArray: IS_ARRAY({size: "small"}),   
    arrayIsArray: IS_ARRAY([25344, 82947]),  
    arrayObjectPropertyIsArray: IS_ARRAY({skus: [25344, 82947], vendors: null}.skus),
    invalidObjectPropertyIsArray: IS_ARRAY({skus: [25344, 82947], vendors: null}.size),
    nullObjectPropertyIsArray: IS_ARRAY({skus: [25344, 82947], vendors: null}.vendor)
}
```  
  
```json
[
  {
    "booleanIsArray": false,
    "numberIsArray": false,
    "stringIsArray": false,
    "nullIsArray": false,
    "objectIsArray": false,
    "arrayIsArray": true,
    "arrayObjectPropertyIsArray": true,
    "invalidObjectPropertyIsArray": false,
    "nullObjectPropertyIsArray": false
  }
]
```  

## Remarks

- This system function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`IS_OBJECT`](is-object.md)
