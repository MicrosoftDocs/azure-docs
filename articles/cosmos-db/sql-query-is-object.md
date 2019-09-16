---
title: IS_OBJECT (Azure Cosmos DB)
description: Learn about SQL system function IS_OBJECT in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# IS_OBJECT (Azure Cosmos DB)
 Returns a Boolean value indicating if the type of the specified expression is a JSON object.  
  
## Syntax
  
```  
IS_OBJECT(<expression>)  
```  
  
## Arguments
  
*expression*  
   Is any valid expression.  
  
## Return Types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_OBJECT function.  
  
```  
SELECT   
    IS_OBJECT(true) AS isObj1,   
    IS_OBJECT(1) AS isObj2,  
    IS_OBJECT("value") AS isObj3,   
    IS_OBJECT(null) AS isObj4,  
    IS_OBJECT({prop: "value"}) AS isObj5,   
    IS_OBJECT([1, 2, 3]) AS isObj6,  
    IS_OBJECT({prop: "value"}.prop2) AS isObj7  
```  
  
 Here is the result set.  
  
```  
[{"isObj1":false,"isObj2":false,"isObj3":false,"isObj4":false,"isObj5":true,"isObj6":false,"isObj7":false}]
```  
  

## See Also
