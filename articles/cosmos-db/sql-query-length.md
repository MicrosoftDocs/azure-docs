---
title: LENGTH in Azure Cosmos DB query language
description: Learn about SQL system function LENGTH in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# LENGTH (Azure Cosmos DB)
 Returns the number of characters of the specified string expression.  
  
## Syntax
  
```sql
LENGTH(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is the string expression to be evaluated.  
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example returns the length of a string.  
  
```sql
SELECT LENGTH("abc") AS len 
```  
  
 Here is the result set.  
  
```json
[{"len": 3}]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
