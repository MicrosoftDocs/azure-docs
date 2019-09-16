---
title: ATN2 (Azure Cosmos DB)
description: Learn about SQL system function ATN2 in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# ATN2 (Azure Cosmos DB)
 Returns the principal value of the arc tangent of y/x, expressed in radians.  
  
## Syntax
  
```  
ATN2(<numeric_expression>, <numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example calculates the ATN2 for the specified x and y components.  
  
```  
SELECT ATN2(35.175643, 129.44) AS atn2  
```  
  
 Here is the result set.  
  
```  
[{"atn2": 1.3054517947300646}]  
```  
  

## See Also
