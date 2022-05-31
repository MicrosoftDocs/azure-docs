---
title: Bitwise operators in Azure Cosmos DB
description: Learn about SQL bitwise operators supported by Azure Cosmos DB.
author: seesharprun
ms.author: sidandrews
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 05/31/2022
---

# Bitwise operators in Azure Cosmos DB
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]


This article details the bitwise operators supported by Azure Cosmos DB. Bitwise operators are useful for constructing JSON result-sets on the fly. The bitwise operators work similarly to higher-level programming languages like C# and JavaScript. For examples of C# bitwise operators, see [Bitwise and shift operators](/dotnet/csharp/language-reference/operators/bitwise-and-shift-operators).

## Understanding bitwise operations

The following table shows the explanations and examples of bitwise operations in the SQL API between two values.

| Operation | Operator | Description |
| --- | --- | --- |
| **Left shift** | ``<<`` | Shift left-hand value *left* by the specified number of bits. |
| **Right shift** | ``>>`` | Shift left-hand value *right* by the specified number of bits. |
| **Zero-fill (unsigned) right shift** | ``>>>`` | Shift left-hand value *right* by the specified number of bits without filling left-most bits. |
| **AND** | ``&`` |  Computes bitwise logical AND. |
| **OR** | ``\|`` | Computes bitwise logical OR. |
| **XOR** | ``^`` | Computes bitwise logical exclusive OR. |


For example, the following query uses each of the bitwise operators and renders a result.

```sql
SELECT 
    (100 >> 2) AS rightShift,
    (100 << 2) AS leftShift,
    (100 >>> 0) AS zeroFillRightShift,
    (100 & 1000) AS logicalAnd,
    (100 | 1000) AS logicalOr,
    (100 ^ 1000) AS logicalExclusiveOr
```

The example query's results as a JSON object.

```json
[
    {
        "rightShift": 25,
        "leftShift": 400,
        "zeroFillRightShift": 100,
        "logicalAnd": 96,
        "logicalOr": 1004,
        "logicalExclusiveOr": 908
    }
]
```

> [!IMPORTANT]
> In this example, the values on the left and right side of the operands are 32-bit integer values.

## Next steps

- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmos-dotnet-v3)
- [Keywords](sql-query-keywords.md)
- [SELECT clause](sql-query-select.md)
