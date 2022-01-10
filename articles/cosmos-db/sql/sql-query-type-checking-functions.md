---
title: Type checking functions in Azure Cosmos DB query language
description: Learn about type checking SQL system functions in Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 05/26/2021
ms.author: tisande
ms.custom: query-reference
---
# Type checking functions (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

The type-checking functions let you check the type of an expression within a SQL query. You can use type-checking functions to determine the types of properties within items on the fly, when they're variable or unknown. 

## Functions

The following functions support type checking against input values, and each return a Boolean value. The **index usage** column assumes, where applicable, that you're comparing the type checking functions to another value with an equality filter.

| System function                           | Index usage | [Index usage in queries with scalar aggregate functions](../index-overview.md#index-utilization-for-scalar-aggregate-functions) | Remarks |
| ----------------------------------------- | ----------- | ------------------------------------------------------------ | ------- |
| [IS_ARRAY](sql-query-is-array.md)         | Full scan   | Full scan                                                    |         |
| [IS_BOOL](sql-query-is-bool.md)           | Index seek  | Index seek                                                   |         |
| [IS_DEFINED](sql-query-is-defined.md)     | Index seek  | Index seek                                                   |         |
| [IS_NULL](sql-query-is-null.md)           | Index seek  | Index seek                                                   |         |
| [IS_NUMBER](sql-query-is-number.md)       | Index seek  | Index seek                                                   |         |
| [IS_OBJECT](sql-query-is-object.md)       | Full scan   | Full scan                                                    |         |
| [IS_PRIMITIVE](sql-query-is-primitive.md) | Index seek  | Index seek                                                   |         |
| [IS_STRING](sql-query-is-string.md)       | Index seek  | Index seek                                                   |         

## Next steps

- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](../introduction.md)
- [User Defined Functions](sql-query-udfs.md)
- [Aggregates](sql-query-aggregate-functions.md)
