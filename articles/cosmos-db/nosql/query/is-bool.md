---
title: IS_BOOL
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a boolean indicating whether an expression is a boolean.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# IS_BOOL (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean value indicating if the type of the specified expression is a boolean.  
  
## Syntax
  
```sql
IS_BOOL(<expr>)  
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
    booleanIsBool: IS_BOOL(true),
    numberIsBool: IS_BOOL(65),  
    stringIsBool: IS_BOOL("AdventureWorks"),   
    nullIsBool: IS_BOOL(null),  
    objectIsBool: IS_BOOL({size: "small"}),   
    arrayIsBool: IS_BOOL([25344, 82947]),  
    arrayObjectPropertyIsBool: IS_BOOL({skus: [25344, 82947], vendors: null}.skus),
    invalidObjectPropertyIsBool: IS_BOOL({skus: [25344, 82947], vendors: null}.size),
    nullObjectPropertyIsBool: IS_BOOL({skus: [25344, 82947], vendors: null}.vendor)
}
```  
  
```json
[
  {
    "booleanIsBool": true,
    "numberIsBool": false,
    "stringIsBool": false,
    "nullIsBool": false,
    "objectIsBool": false,
    "arrayIsBool": false,
    "arrayObjectPropertyIsBool": false,
    "invalidObjectPropertyIsBool": false,
    "nullObjectPropertyIsBool": false
  }
]
```  

## Remarks

- This system function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`IS_NUMBER`](is-number.md)
