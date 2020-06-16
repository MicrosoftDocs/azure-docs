---
title: POWER in Azure Cosmos DB query language
description: Learn about SQL system function POWER in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# POWER (Azure Cosmos DB)
 Returns the value of the specified expression to the specified power.  
  
## Syntax
  
```sql
POWER (<numeric_expr1>, <numeric_expr2>)  
```  
  
## Arguments
  
*numeric_expr1*  
   Is a numeric expression.  
  
*numeric_expr2*  
   Is the power to which to raise *numeric_expr1*.  
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example demonstrates raising a number to the power of 3 (the cube of the number).  
  
```sql
SELECT POWER(2, 3) AS pow1, POWER(2.5, 3) AS pow2  
```  
  
 Here is the result set.  
  
```json
[{pow1: 8, pow2: 15.625}]  
```  

## Next steps

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
