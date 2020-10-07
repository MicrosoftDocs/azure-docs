---
title: StringEquals in Azure Cosmos DB query language
description: Learn about how the StringEquals SQL system function in Azure Cosmos DB returns a Boolean indicating whether the first string expression matches the second
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/20/2020
ms.author: tisande
ms.custom: query-reference
---
# STRINGEQUALS (Azure Cosmos DB)

 Returns a Boolean indicating whether the first string expression matches the second.  
  
## Syntax
  
```sql
STRINGEQUALS(<str_expr1>, <str_expr2> [, <bool_expr>])  
```  
  
## Arguments
  
*str_expr1*  
   Is the first string expression to compare.  
  
*str_expr2*  
   Is the second string expression to compare.  

*bool_expr*
    Optional value for ignoring case. When set to true, StringEquals will do a case-insensitive search. When unspecified, this value is false.
  
## Return types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks if "abc" matches "abc" and if "abc" matches "ABC".  
  
```sql
SELECT STRINGEQUALS("abc", "abc", false) AS c1, STRINGEQUALS("abc", "ABC", false) AS c2,  STRINGEQUALS("abc", "ABC", true) AS c3
```  
  
 Here is the result set.  
  
```json
[
    {
        "c1": true,
        "c2": false,
        "c3": true
    }
]
```  

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy).

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
