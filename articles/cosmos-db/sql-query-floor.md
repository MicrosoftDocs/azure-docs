---
title: FLOOR (Azure Cosmos DB)
description: Learn about SQL system function FLOOR in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# FLOOR (Azure Cosmos DB)
 Returns the largest integer less than or equal to the specified numeric expression.  
  
## Syntax
  
```sql
FLOOR (<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example shows positive numeric, negative, and zero values with the FLOOR function.  
  
```sql
SELECT FLOOR(123.45) AS fl1, FLOOR(-123.45) AS fl2, FLOOR(0.0) AS fl3  
```  
  
 Here is the result set.  
  
```json
[{fl1: 123, fl2: -124, fl3: 0}]  
```  

## See Also

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
