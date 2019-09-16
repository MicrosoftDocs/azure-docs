---
title: POWER (Azure Cosmos DB)
description: Learn about SQL system function POWER in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# POWER (Azure Cosmos DB)
 Returns the value of the specified expression to the specified power.  
  
## Syntax
  
```  
POWER (<numeric_expression>, <y>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
*y*  
   Is the power to which to raise `numeric_expression`.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example demonstrates raising a number to the power of 3 (the cube of the number).  
  
```  
SELECT POWER(2, 3) AS pow1, POWER(2.5, 3) AS pow2  
```  
  
 Here is the result set.  
  
```  
[{pow1: 8, pow2: 15.625}]  
```  
  

## See Also

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
