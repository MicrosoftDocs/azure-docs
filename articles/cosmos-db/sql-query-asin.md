---
title: ASIN (Azure Cosmos DB)
description: Learn about SQL system function ASIN in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# ASIN (Azure Cosmos DB)
 Returns the angle, in radians, whose sine is the specified numeric expression. This is also called arcsine.  
  
## Syntax
  
```  
ASIN(<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example returns the ASIN of -1.  
  
```  
SELECT ASIN(-1) AS asin  
```  
  
 Here is the result set.  
  
```  
[{"asin": -1.5707963267948966}]  
```  
  

## See Also
