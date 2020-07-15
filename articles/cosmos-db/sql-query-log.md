---
title: LOG in Azure Cosmos DB query language
description: Learn about the LOG SQL system function in Azure Cosmos DB to return the natural logarithm of the specified numeric expression
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# LOG (Azure Cosmos DB)
 Returns the natural logarithm of the specified numeric expression.  
  
## Syntax
  
```sql
LOG (<numeric_expr> [, <base>])  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
*base*  
   Optional numeric argument that sets the base for the logarithm.  
  
## Return types
  
  Returns a numeric expression.  
  
## Remarks
  
  By default, LOG() returns the natural logarithm. You can change the base of the logarithm to another value by using the optional base parameter.  
  
  The natural logarithm is the logarithm to the base **e**, where **e** is an irrational constant approximately equal to 2.718281828.  
  
  The natural logarithm of the exponential of a number is the number itself: LOG( EXP( n ) ) = n. And the exponential of the natural logarithm of a number is the number itself: EXP( LOG( n ) ) = n.  
  
## Examples
  
  The following example declares a variable and returns the logarithm value of the specified variable (10).  
  
```sql
SELECT LOG(10) AS log  
```  
  
 Here is the result set.  
  
```json
[{log: 2.3025850929940459}]  
```  
  
 The following example calculates the `LOG` for the exponent of a number.  
  
```sql
SELECT EXP(LOG(10)) AS expLog  
```  
  
 Here is the result set.  
  
```json
[{expLog: 10.000000000000002}]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
