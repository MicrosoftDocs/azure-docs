---
title: Type checking functions (Azure Cosmos DB)
description: Learn about type checking SQL system functions in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# Type checking functions

The type-checking functions let you check the type of an expression within a SQL query. You can use type-checking functions to determine the types of properties within items on the fly, when they're variable or unknown. Here’s a table of supported built-in type-checking functions:

The following functions support type checking against input values, and each return a Boolean value.  
  
||||  
|-|-|-|  
|[IS_ARRAY](sql-query-is-array.md)|[IS_BOOL](sql-query-is-bool.md)|[IS_DEFINED](sql-query-is-defined.md)|  
|[IS_NULL](sql-query-is-null.md)|[IS_NUMBER](sql-query-is-number.md)|[IS_OBJECT](sql-query-is-object.md)|  
|[IS_PRIMITIVE](sql-query-is-primitive.md)|[IS_STRING](sql-query-is-string.md)||  
  

## See Also

- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
- [UDFs](sql-query-udfs.md)
- [Aggregates](sql-query-aggregates.md)
