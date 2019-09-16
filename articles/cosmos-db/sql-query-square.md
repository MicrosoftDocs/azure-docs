---
title: SQUARE (Azure Cosmos DB)
description: Learn about SQL system function SQUARE in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# SQUARE (Azure Cosmos DB)
 Returns the square of the specified numeric value.  
  
## Syntax
  
```  
SQUARE(<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example returns the squares of numbers 1-3.  
  
```  
SELECT SQUARE(1) AS s1, SQUARE(2.0) AS s2, SQUARE(3) AS s3  
```  
  
 Here is the result set.  
  
```  
[{s1: 1, s2: 4, s3: 9}]  
```  
  

## See Also
