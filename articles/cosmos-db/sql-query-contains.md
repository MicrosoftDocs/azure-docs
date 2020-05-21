---
title: CONTAINS in Azure Cosmos DB query language
description: Learn about how the CONTAINS SQL system function in Azure Cosmos DB returns a Boolean indicating whether the first string expression contains the second
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/20/2020
ms.author: girobins
ms.custom: query-reference
---
# CONTAINS (Azure Cosmos DB)

 Returns a Boolean indicating whether the first string expression contains the second.  
  
## Syntax
  
```sql
CONTAINS(<str_expr1>, <str_expr2> [, <bool_expr>])  
```  
  
## Arguments
  
*str_expr1*  
   Is the string expression to be searched.  
  
*str_expr2*  
   Is the string expression to find.  

*bool_expr*
    Optional value for ignoring case. When set to true, CONTAINS will do a case-insensitive search. When unspecified, this value is false.
  
## Return types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks if "abc" contains "ab" and if "abc" contains "d".  
  
```sql
SELECT CONTAINS("abc", "ab") AS c1, CONTAINS("abc", "d") AS c2
```  
  
 Here is the result set.  
  
```json
[{"c1": true, "c2": false}]  
```  

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy).

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
