---
title: ABS (Azure Cosmos DB)
description: Learn about SQL system function ABS in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# ABS (Azure Cosmos DB)
 Returns the absolute (positive) value of the specified numeric expression.  
  
## Syntax
  
```  
ABS (<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example shows the results of using the ABS function on three different numbers.  
  
```  
SELECT ABS(-1) AS abs1, ABS(0) AS abs2, ABS(1) AS abs3 
```  
  
 Here is the result set.  
  
```  
[{abs1: 1, abs2: 0, abs3: 1}]  
```  
  

## See Also
