---
title: CEILING (Azure Cosmos DB)
description: Learn about SQL system function CEILING in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# CEILING (Azure Cosmos DB)
 Returns the smallest integer value greater than, or equal to, the specified numeric expression.  
  
## Syntax
  
```  
CEILING (<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example shows positive numeric, negative, and zero values with the CEILING function.  
  
```  
SELECT CEILING(123.45) AS c1, CEILING(-123.45) AS c2, CEILING(0.0) AS c3  
```  
  
 Here is the result set.  
  
```  
[{c1: 124, c2: -123, c3: 0}]  
```  
  

## See Also

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
