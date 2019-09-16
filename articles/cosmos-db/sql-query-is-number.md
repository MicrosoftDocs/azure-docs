---
title: IS_NUMBER (Azure Cosmos DB)
description: Learn about SQL system function IS_NUMBER in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# IS_NUMBER (Azure Cosmos DB)
 Returns a Boolean value indicating if the type of the specified expression is a number.  
  
## Syntax
  
```  
IS_NUMBER(<expression>)  
```  
  
## Arguments
  
*expression*  
   Is any valid expression.  
  
## Return Types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_NULL function.  
  
```  
SELECT   
    IS_NUMBER(true) AS isNum1,   
    IS_NUMBER(1) AS isNum2,  
    IS_NUMBER("value") AS isNum3,   
    IS_NUMBER(null) AS isNum4,  
    IS_NUMBER({prop: "value"}) AS isNum5,   
    IS_NUMBER([1, 2, 3]) AS isNum6,  
    IS_NUMBER({prop: "value"}.prop2) AS isNum7  
```  
  
 Here is the result set.  
  
```  
[{"isNum1":false,"isNum2":true,"isNum3":false,"isNum4":false,"isNum5":false,"isNum6":false,"isNum7":false}]  
```  
  

## See Also

- [Type checking functions Azure Cosmos DB](sql-query-type-checking-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
