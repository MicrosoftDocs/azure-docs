---
title: LOG10 in Azure Cosmos DB query language
description: Learn about the LOG10 SQL system function in Azure Cosmos DB to return the base-10 logarithm of the specified numeric expression
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# LOG10 (Azure Cosmos DB)
 Returns the base-10 logarithm of the specified numeric expression.  
  
## Syntax
  
```sql
LOG10 (<numeric_expr>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return types
  
  Returns a numeric expression.  
  
## Remarks
  
  The LOG10 and POWER functions are inversely related to one another. For example, 10 ^ LOG10(n) = n.  
  
## Examples
  
  The following example declares a variable and returns the LOG10 value of the specified variable (100).  
  
```sql
SELECT LOG10(100) AS log10 
```  
  
 Here is the result set.  
  
```json
[{log10: 2}]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
