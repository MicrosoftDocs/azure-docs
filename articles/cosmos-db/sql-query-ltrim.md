---
title: LTRIM in Azure Cosmos DB query language
description: Learn about the LTRIM SQL system function in Azure Cosmos DB to return a string expression after it removes leading blanks
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# LTRIM (Azure Cosmos DB)
 Returns a string expression after it removes leading blanks.  
  
## Syntax
  
```sql
LTRIM(<str_expr>)  
```  
  
## Arguments
  
*str_expr*  
   Is a string expression.  
  
## Return types
  
  Returns a string expression.  
  
## Examples
  
  The following example shows how to use `LTRIM` inside a query.  
  
```sql
SELECT LTRIM("  abc") AS l1, LTRIM("abc") AS l2, LTRIM("abc   ") AS l3 
```  
  
 Here is the result set.  
  
```json
[{"l1": "abc", "l2": "abc", "l3": "abc   "}]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
