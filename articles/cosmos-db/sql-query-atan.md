---
title: ATAN (Azure Cosmos DB)
description: Learn about SQL system function ATAN in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# ATAN (Azure Cosmos DB)
 Returns the angle, in radians, whose tangent is the specified numeric expression. This is also called arctangent.  
  
## Syntax
  
```  
ATAN(<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example returns the ATAN of the specified value.  
  
```  
SELECT ATAN(-45.01) AS atan  
```  
  
 Here is the result set.  
  
```  
[{"atan": -1.5485826962062663}]  
```  
  

## See Also
