---
title: LEFT
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a substring from the left side of a string.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# LEFT (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the left part of a string up to the specified number of characters.  
  
## Syntax
  
```sql
LEFT(<string_expr>, <numeric_expr>)  
```  
  
## Arguments
  
| | Description |
| --- | --- |
| **`string_expr`** | A string expression. |
| **`numeric_expr`** | A numeric expression specifying the number of characters to extract from `string_expr`. |
  
## Return types
  
Returns a string expression.  
  
## Examples
  
The following example returns the left part of the string `Microsoft` for various length values.  
  
```sql
SELECT VALUE {
    firstZero: LEFT("AdventureWorks", 0),
    firstOne: LEFT("AdventureWorks", 1),
    firstFive: LEFT("AdventureWorks", 5),
    fullLength: LEFT("AdventureWorks", LENGTH("AdventureWorks")),
    beyondMaxLength: LEFT("AdventureWorks", 100)
}
```  
  
```json
[
  {
    "firstZero": "",
    "firstOne": "A",
    "firstFive": "Adven",
    "fullLength": "AdventureWorks",
    "beyondMaxLength": "AdventureWorks"
  }
]
```  

## Remarks

- This system function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`RIGHT`](right.md)
