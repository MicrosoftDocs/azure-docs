---
title: EXP (Azure Cosmos DB)
description: Learn about SQL system function EXP in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# EXP (Azure Cosmos DB)
 Returns the exponential value of the specified numeric expression.  
  
## Syntax
  
```  
EXP (<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Remarks
  
  The constant **e** (2.718281…), is the base of natural logarithms.  
  
  The exponent of a number is the constant **e** raised to the power of the number. For example, EXP(1.0) = e^1.0 = 2.71828182845905 and EXP(10) = e^10 = 22026.4657948067.  
  
  The exponential of the natural logarithm of a number is the number itself: EXP (LOG (n)) = n. And the natural logarithm of the exponential of a number is the number itself: LOG (EXP (n)) = n.  
  
## Examples
  
  The following example declares a variable and returns the exponential value of the specified variable (10).  
  
```  
SELECT EXP(10) AS exp  
```  
  
 Here is the result set.  
  
```  
[{exp: 22026.465794806718}]  
```  
  
 The following example returns the exponential value of the natural logarithm of 20 and the natural logarithm of the exponential of 20. Because these functions are inverse functions of one another, the return value with rounding for floating point math in both cases is 20.  
  
```  
SELECT EXP(LOG(20)) AS exp1, LOG(EXP(20)) AS exp2  
```  
  
 Here is the result set.  
  
```  
[{exp1: 19.999999999999996, exp2: 20}]  
```  
  

## See Also
