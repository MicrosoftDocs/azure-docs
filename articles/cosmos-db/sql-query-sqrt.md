---
title: SQRT (Azure Cosmos DB)
description: Learn about SQL system function SQRT in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# SQRT (Azure Cosmos DB)
 Returns the square root of the specified numeric value.  
  
## Syntax
  
```  
SQRT(<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example returns the square roots of numbers 1-3.  
  
```  
SELECT SQRT(1) AS s1, SQRT(2.0) AS s2, SQRT(3) AS s3  
```  
  
 Here is the result set.  
  
```  
[{s1: 1, s2: 1.4142135623730952, s3: 1.7320508075688772}]  
```  
  

## See Also

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
