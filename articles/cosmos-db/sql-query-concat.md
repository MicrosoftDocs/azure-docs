---
title: CONCAT in Azure Cosmos DB query language
description: Learn about how the CONCAT SQL system function in Azure Cosmos DB returns a string that is the result of concatenating two or more string values
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference
---
# CONCAT (Azure Cosmos DB)
 Returns a string that is the result of concatenating two or more string values.  
  
## Syntax
  
```sql
CONCAT(<str_expr1>, <str_expr2> [, <str_exprN>])  
```  
  
## Arguments
  
*str_expr*  
   Is a string expression to concatenate to the other values. The `CONCAT` function requires at least two *str_expr* arguments.  
  
## Return types
  
  Returns a string expression.  
  
## Examples
  
  The following example returns the concatenated string of the specified values.  
  
```sql
SELECT CONCAT("abc", "def") AS concat  
```  
  
 Here is the result set.  
  
```json
[{"concat": "abcdef"}]  
```  
  
## Remarks

This system function will not utilize the index.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
