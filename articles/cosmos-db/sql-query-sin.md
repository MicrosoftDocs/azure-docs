---
title: SIN (Azure Cosmos DB)
description: Learn about SQL system function SIN in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# SIN (Azure Cosmos DB)
 Returns the trigonometric sine of the specified angle, in radians, in the specified expression.  
  
## Syntax
  
```  
SIN(<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example calculates the SIN of the specified angle.  
  
```  
SELECT SIN(45.175643) AS sin  
```  
  
 Here is the result set.  
  
```  
[{"sin": 0.929607286611012}]  
```  
  

## See Also

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
