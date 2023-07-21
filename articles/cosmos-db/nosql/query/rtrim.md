---
title: RTRIM
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a string expression with trailing whitespace or specified characters removed.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# RTRIM (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a string expression after it removes trailing whitespace or specified characters.  
  
## Syntax
  
```sql
RTRIM(<string_expr_1> [, <string_expr_2>])  
```  
  
## Arguments
  
| | Description |
| --- | --- |
| **`string_expr_1`** | A string expression. |
| **`string_expr_2` *(Optional)*** | An optional string expression to be trimmed from `string_expr_1`. If not set, the default is to trim whitespace. | 
  
## Return types

Returns a string expression.  
  
## Examples

The following example shows how to use this function with various parameters inside a query.  
  
```sql
SELECT VALUE {
    whitespaceStart: RTRIM("  AdventureWorks"), 
    whitespaceStartEnd: RTRIM("  AdventureWorks  "), 
    whitespaceEnd: RTRIM("AdventureWorks  "), 
    noWhitespace: RTRIM("AdventureWorks"),
    trimSuffix: RTRIM("AdventureWorks", "Works"),
    trimPrefix: RTRIM("AdventureWorks", "Adventure"),
    trimEntireTerm: RTRIM("AdventureWorks", "AdventureWorks"),
    trimEmptyString: RTRIM("AdventureWorks", "")
}
```  
  
```json
[
  {
    "whitespaceStart": "  AdventureWorks",
    "whitespaceStartEnd": "  AdventureWorks",
    "whitespaceEnd": "AdventureWorks",
    "noWhitespace": "AdventureWorks",
    "trimSuffix": "Adventure",
    "trimPrefix": "AdventureWorks",
    "trimEntireTerm": "",
    "trimEmptyString": "AdventureWorks"
  }
]
```

## Remarks

- This system function doesn't use the index.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`LTRIM`](ltrim.md)
