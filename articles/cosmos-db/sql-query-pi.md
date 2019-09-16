---
title: PI (Azure Cosmos DB)
description: Learn about SQL system function PI in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# PI (Azure Cosmos DB)
 Returns the constant value of PI.  
  
## Syntax
  
```  
PI ()  
```  
   
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example returns the value of PI.  
  
```  
SELECT PI() AS pi 
```  
  
 Here is the result set.  
  
```  
[{"pi": 3.1415926535897931}]  
```  
  

## See Also
