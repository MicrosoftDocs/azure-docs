---
title: LOG (Azure Cosmos DB)
description: Learn about SQL system function LOG in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# LOG (Azure Cosmos DB)
 Returns the natural logarithm of the specified numeric expression.  
  
## Syntax
  
```  
LOG (<numeric_expression> [, <base>])  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
*base*  
   Optional numeric argument that sets the base for the logarithm.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Remarks
  
  By default, LOG() returns the natural logarithm. You can change the base of the logarithm to another value by using the optional base parameter.  
  
  The natural logarithm is the logarithm to the base **e**, where **e** is an irrational constant approximately equal to 2.718281828.  
  
  The natural logarithm of the exponential of a number is the number itself: LOG( EXP( n ) ) = n. And the exponential of the natural logarithm of a number is the number itself: EXP( LOG( n ) ) = n.  
  
## Examples
  
  The following example declares a variable and returns the logarithm value of the specified variable (10).  
  
```  
SELECT LOG(10) AS log  
```  
  
 Here is the result set.  
  
```  
[{log: 2.3025850929940459}]  
```  
  
 The following example calculates the LOG for the exponent of a number.  
  
```  
SELECT EXP(LOG(10)) AS expLog  
```  
  
 Here is the result set.  
  
```  
[{expLog: 10.000000000000002}]  
```  
  

## See Also
