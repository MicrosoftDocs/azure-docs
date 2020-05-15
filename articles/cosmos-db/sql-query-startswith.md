---
title: STARTSWITH in Azure Cosmos DB query language
description: Learn about SQL system function STARTSWITH in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# STARTSWITH (Azure Cosmos DB)
 Returns a Boolean indicating whether the first string expression starts with the second.  
  
## Syntax
  
```sql
STARTSWITH(<str_expr1>, <str_expr2>)  
```  
  
## Arguments
  
*str_expr1*  
   Is a string expression.
  
*str_expr2*  
   Is a string expression to be compared to the beginning of *str_expr1*.

## Return types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks if the string "abc" begins with "b" and "a".  
  
```sql
SELECT STARTSWITH("abc", "b") AS s1, STARTSWITH("abc", "a") AS s2  
```  
  
 Here is the result set.  
  
```json
[{"s1": false, "s2": true}]  
```  

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy).

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
