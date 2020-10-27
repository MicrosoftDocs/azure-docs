---
title: SUBSTRING in Azure Cosmos DB query language
description: Learn about SQL system function SUBSTRING in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# SUBSTRING (Azure Cosmos DB)
 Returns part of a string expression starting at the specified character zero-based position and continues to the specified length, or to the end of the string.  
  
## Syntax
  
```sql
SUBSTRING(<str_expr>, <num_expr1>, <num_expr2>)  
```  
  
## Arguments
  
*str_expr*  
   Is a string expression.
  
*num_expr1*  
   Is a numeric expression to denote the start character. A value of 0 is the first character of *str_expr*.
  
*num_expr2*  
   Is a numeric expression to denote the maximum number of characters of *str_expr* to be returned. A value of 0 or less results in empty string.

## Return types
  
  Returns a string expression.  
  
## Examples
  
  The following example returns the substring of "abc" starting at 1 and for a length of 1 character.  
  
```sql
SELECT SUBSTRING("abc", 1, 1) AS substring  
```  
  
 Here is the result set.  
  
```json
[{"substring": "b"}]  
```

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy) if the starting position is `0`.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
