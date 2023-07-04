---
title: LENGTH
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the numeric length of a string expression.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# LENGTH (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the number of characters in the specified string expression.  
  
## Syntax
  
```sql
LENGTH(<string_expr>)  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`string_expr`** | A string expression. |
  
## Return types
  
Returns a numeric expression.  
  
## Examples
  
The following example returns the length of a static string.  
  
```sql
SELECT VALUE {
    stringValue: LENGTH("AdventureWorks"),
    emptyString: LENGTH(""),
    nullValue: LENGTH(null),
    numberValue: LENGTH(0),
    arrayValue: LENGTH(["Adventure", "Works"])
}
```  
  
```json
[
  {
    "stringValue": 14,
    "emptyString": 0
  }
] 
```  

## Remarks

- This system function doesn't use the index.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`REVERSE`](reverse.md)
