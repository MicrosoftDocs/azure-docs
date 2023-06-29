---
title: STARTSWITH
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a boolean indicating whether one string expression starts with another.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# STARTSWITH (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean value indicating whether the first string expression starts with the second.  
  
## Syntax
  
```sql
ENDSWITH(<str_expr_1>, <str_expr_2> [, <bool_expr>])
```  
  
## Arguments
  
| | Description |
| --- | --- |
| **`str_expr_1`** | A string expression. |
| **`str_expr_2`** | A string expression to be compared to the beginning of `str_expr_1`. |
| **`bool_expr`** *(Optional)* | Optional value for ignoring case. When set to `true`, `ENDSWITH` does a case-insensitive search. When unspecified, this default value is `false`. |

## Return types
  
Returns a boolean expression.  
  
## Examples
  
The following example checks if the string `abc` starts with `b` or `ab`.  
  
```sql
SELECT VALUE {
    endsWithWrongPrefix: STARTSWITH("abc", "b"),
    endsWithCorrectPrefix: STARTSWITH("abc", "ab"),
    endsWithPrefixWrongCase: STARTSWITH("abc", "Ab"),
    endsWithPrefixCaseInsensitive: STARTSWITH("abc", "Ab", true)
}
```  
  
```json
[
  {
    "endsWithWrongPrefix": false,
    "endsWithCorrectPrefix": true,
    "endsWithPrefixWrongCase": false,
    "endsWithPrefixCaseInsensitive": true
  }
]
```  

## Remarks

- This function performs a precise index scan.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`ENDSWITH`](endswith.md)
