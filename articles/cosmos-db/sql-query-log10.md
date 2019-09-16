---
title: LOG10 (Azure Cosmos DB)
description: Learn about SQL system function LOG10 in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# LOG10 (Azure Cosmos DB)
 Returns the base-10 logarithm of the specified numeric expression.  
  
## Syntax
  
```  
LOG10 (<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Remarks
  
  The LOG10 and POWER functions are inversely related to one another. For example, 10 ^ LOG10(n) = n.  
  
## Examples
  
  The following example declares a variable and returns the LOG10 value of the specified variable (100).  
  
```  
SELECT LOG10(100) AS log10 
```  
  
 Here is the result set.  
  
```  
[{log10: 2}]  
```  
  

## See Also
