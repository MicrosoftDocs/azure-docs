---
title: ENDSWITH
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a boolean indicating whether one string expression ends with another.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# ENDSWITH (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean value indicating whether the first string expression ends with the second.  
  
## Syntax
  
```sql
ENDSWITH(<str_expr_1>, <str_expr_2> [, <bool_expr>])
```  
  
## Arguments
  
| | Description |
| --- | --- |
| **`str_expr_1`** | A string expression. |
| **`str_expr_2`** | A string expression to be compared to the end of `str_expr_1`. |
| **`bool_expr`** *(Optional)* | Optional value for ignoring case. When set to `true`, `ENDSWITH` does a case-insensitive search. When unspecified, this default value is `false`. |
  
## Return types
  
Returns a boolean expression.  
  
## Examples
  
The following example checks if the string `abc` ends with `b` or `bC`.  
  
```sql
SELECT VALUE {
    endsWithWrongSuffix: ENDSWITH("abc", "b"),
    endsWithCorrectSuffix: ENDSWITH("abc", "bc"),
    endsWithSuffixWrongCase: ENDSWITH("abc", "bC"),
    endsWithSuffixCaseInsensitive: ENDSWITH("abc", "bC", true)
} 
```  
  
```json
[
  {
    "endsWithWrongSuffix": false,
    "endsWithCorrectSuffix": true,
    "endsWithSuffixWrongCase": false,
    "endsWithSuffixCaseInsensitive": true
  }
]
```  

## Remarks

- This function performs a full index scan.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`STARTSWITH`](startswith.md)
