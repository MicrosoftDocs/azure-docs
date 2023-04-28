---
title: Type checking functions in Azure Cosmos DB query language
description: Learn about type checking SQL system functions in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 05/26/2021
ms.author: sidandrews
ms.reviewer: jucocchi
ms.custom: query-reference, ignite-2022
---
# Type checking functions (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

The type-checking functions let you check the type of an expression within a SQL query. You can use type-checking functions to determine the types of properties within items on the fly, when they're variable or unknown. 

## Functions

The following functions support type checking against input values, and each return a Boolean value. The **index usage** column assumes, where applicable, that you're comparing the type checking functions to another value with an equality filter.

| System function                           | Index usage | [Index usage in queries with scalar aggregate functions](../../index-overview.md#index-utilization-for-scalar-aggregate-functions) | Remarks |
| ----------------------------------------- | ----------- | ------------------------------------------------------------ | ------- |
| [IS_ARRAY](is-array.md)         | Full scan   | Full scan                                                    |         |
| [IS_BOOL](is-bool.md)           | Index seek  | Index seek                                                   |         |
| [IS_DEFINED](is-defined.md)     | Index seek  | Index seek                                                   |         |
| [IS_NULL](is-null.md)           | Index seek  | Index seek                                                   |         |
| [IS_NUMBER](is-number.md)       | Index seek  | Index seek                                                   |         |
| [IS_OBJECT](is-object.md)       | Full scan   | Full scan                                                    |         |
| [IS_PRIMITIVE](is-primitive.md) | Index seek  | Index seek                                                   |         |
| [IS_STRING](is-string.md)       | Index seek  | Index seek                                                   |         

## Next steps

- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
- [User Defined Functions](udfs.md)
- [Aggregates](aggregate-functions.md)
