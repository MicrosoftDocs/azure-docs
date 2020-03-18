---
title: LEFT in Azure Cosmos DB query language
description: Learn about SQL system function LEFT in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# LEFT (Azure Cosmos DB)
 Returns the left part of a string with the specified number of characters.  
  
## Syntax
  
```sql
LEFT(<str_expr>, <num_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is the string expression to extract characters from.  
  
*num_expr*  
   Is a numeric expression which specifies the number of characters.  
  
## Return types
  
  Returns a string expression.  
  
## Examples
  
  The following example returns the left part of "abc" for various length values.  
  
```sql
SELECT LEFT("abc", 1) AS l1, LEFT("abc", 2) AS l2 
```  
  
 Here is the result set.  
  
```json
[{"l1": "a", "l2": "ab"}]  
```  

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy).

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
