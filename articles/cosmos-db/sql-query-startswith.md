---
title: StartsWith in Azure Cosmos DB query language
description: Learn about SQL system function STARTSWITH in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/20/2020
ms.author: girobins
ms.custom: query-reference
---
# STARTSWITH (Azure Cosmos DB)

 Returns a Boolean indicating whether the first string expression starts with the second.  
  
## Syntax
  
```sql
STARTSWITH(<str_expr1>, <str_expr2> [, <bool_expr>])  
```  
  
## Arguments
  
*str_expr1*  
   Is a string expression.
  
*str_expr2*  
   Is a string expression to be compared to the beginning of *str_expr1*.

*bool_expr*
    Optional value for ignoring case. When set to true, STARTSWITH will do a case-insensitive search. When unspecified, this value is false.

## Return types
  
  Returns a Boolean expression.  
  
## Examples
  
The following example checks if the string "abc" begins with "b" and "A".  
  
```sql
SELECT STARTSWITH("abc", "b", false) AS s1, STARTSWITH("abc", "A", false) AS s2, STARTSWITH("abc", "A", true) AS s3
```  
  
 Here is the result set.  
  
```json
[
    {
        "s1": false,
        "s2": false,
        "s3": true
    }
]
```  

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy).

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
