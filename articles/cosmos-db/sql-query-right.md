---
title: RIGHT in Azure Cosmos DB query language
description: Learn about SQL system function RIGHT in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference
---
# RIGHT (Azure Cosmos DB)
 Returns the right part of a string with the specified number of characters.  
  
## Syntax
  
```sql
RIGHT(<str_expr>, <num_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is the string expression to extract characters from.  
  
*num_expr*  
   Is a numeric expression which specifies the number of characters.  
  
## Return types
  
  Returns a string expression.  
  
## Examples
  
  The following example returns the right part of "abc" for various length values.  
  
```sql
SELECT RIGHT("abc", 1) AS r1, RIGHT("abc", 2) AS r2 
```  
  
 Here is the result set.  
  
```json
[{"r1": "c", "r2": "bc"}]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
