---
title: IS_PRIMITIVE (Azure Cosmos DB)
description: Learn about SQL system function IS_PRIMITIVE in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# IS_PRIMITIVE (Azure Cosmos DB)
 Returns a Boolean value indicating if the type of the specified expression is a primitive (string, Boolean, numeric, or null).  
  
## Syntax
  
```  
IS_PRIMITIVE(<expression>)  
```  
  
## Arguments
  
*expression*  
   Is any valid expression.  
  
## Return Types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks objects of JSON Boolean, number, string, null, object, array and undefined types using the IS_PRIMITIVE function.  
  
```  
SELECT   
           IS_PRIMITIVE(true) AS isPrim1,   
           IS_PRIMITIVE(1) AS isPrim2,  
           IS_PRIMITIVE("value") AS isPrim3,   
           IS_PRIMITIVE(null) AS isPrim4,  
           IS_PRIMITIVE({prop: "value"}) AS isPrim5,   
           IS_PRIMITIVE([1, 2, 3]) AS isPrim6,  
           IS_PRIMITIVE({prop: "value"}.prop2) AS isPrim7  
```  
  
 Here is the result set.  
  
```  
[{"isPrim1": true, "isPrim2": true, "isPrim3": true, "isPrim4": true, "isPrim5": false, "isPrim6": false, "isPrim7": false}]  
```  
  

## See Also

- [Type checking functions Azure Cosmos DB](sql-query-type-checking-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
