---
title: ENDSWITH in Azure Cosmos DB query language
description: Learn about the ENDSWITH SQL system function in Azure Cosmos DB to return a Boolean indicating whether the first string expression ends with the second
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference
---
# ENDSWITH (Azure Cosmos DB)
 Returns a Boolean indicating whether the first string expression ends with the second.  
  
## Syntax
  
```sql
ENDSWITH(<str_expr1>, <str_expr2>)  
```  
  
## Arguments
  
*str_expr1*  
   Is a string expression.  
  
*str_expr2*  
   Is a string expression to be compared to the end of *str_expr1*.  
  
## Return types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example returns the "abc" ends with "b" and "bc".  
  
```sql
SELECT ENDSWITH("abc", "b") AS e1, ENDSWITH("abc", "bc") AS e2 
```  
  
 Here is the result set.  
  
```json
[{"e1": false, "e2": true}]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
