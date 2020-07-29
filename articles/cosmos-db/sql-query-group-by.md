---
title: GROUP BY clause in Azure Cosmos DB
description: Learn about the GROUP BY clause for Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/19/2020
ms.author: tisande

---
# GROUP BY clause in Azure Cosmos DB

The GROUP BY clause divides the query's results according to the values of one or more specified properties.

## Syntax

```sql  
<group_by_clause> ::= GROUP BY <scalar_expression_list>

<scalar_expression_list> ::=
          <scalar_expression>
        | <scalar_expression_list>, <scalar_expression>
```  

## Arguments

- `<scalar_expression_list>`

   Specifies the expressions that will be used to divide query results.

- `<scalar_expression>`
  
   Any scalar expression is allowed except for scalar subqueries and scalar aggregates. Each scalar expression must contain at least one property reference. There is no limit to the number of individual expressions or the cardinality of each expression.

## Remarks
  
  When a query uses a GROUP BY clause, the SELECT clause can only contain the subset of properties and system functions included in the GROUP BY clause. One exception is [aggregate system functions](sql-query-aggregates.md), which can appear in the SELECT clause without being included in the GROUP BY clause. You can also always include literal values in the SELECT clause.

  The GROUP BY clause must be after the SELECT, FROM, and WHERE clause and before the OFFSET LIMIT clause. You currently cannot use GROUP BY with an ORDER BY clause but this is planned.

  The GROUP BY clause does not allow any of the following:
  
- Aliasing properties or aliasing system functions (aliasing is still allowed within the SELECT clause)
- Subqueries
- Aggregate system functions (these are only allowed in the SELECT clause)

Queries with an aggregate system function and a subquery with `GROUP BY` are not supported. For example, the following query is not supported:

```sql
SELECT COUNT(UniqueLastNames)
FROM (
SELECT AVG(f.age)
FROM f
GROUP BY f.lastName
) AS UniqueLastNames
```

## Examples

These examples use the nutrition data set available through the [Azure Cosmos DB Query Playground](https://www.documentdb.com/sql/demo).

For example, here's a query which returns the total count of items in each foodGroup:

```sql
SELECT TOP 4 COUNT(1) AS foodGroupCount, f.foodGroup
FROM Food f
GROUP BY f.foodGroup
```

Some results are (TOP keyword is used to limit results):

```json
[
    {
        "foodGroupCount": 183,
        "foodGroup": "Cereal Grains and Pasta"
    },
    {
        "foodGroupCount": 133,
        "foodGroup": "Nut and Seed Products"
    },
    {
        "foodGroupCount": 113,
        "foodGroup": "Meals, Entrees, and Side Dishes"
    },
    {
        "foodGroupCount": 64,
        "foodGroup": "Spices and Herbs"
    }
]
```

This query has two expressions used to divide results:

```sql
SELECT TOP 4 COUNT(1) AS foodGroupCount, f.foodGroup, f.version
FROM Food f
GROUP BY f.foodGroup, f.version
```

Some results are:

```json
[
    {
        "foodGroupCount": 183,
        "foodGroup": "Cereal Grains and Pasta",
        "version": 1
    },
    {
        "foodGroupCount": 133,
        "foodGroup": "Nut and Seed Products",
        "version": 1
    },
    {
        "foodGroupCount": 113,
        "foodGroup": "Meals, Entrees, and Side Dishes",
        "version": 1
    },
    {
        "foodGroupCount": 64,
        "foodGroup": "Spices and Herbs",
        "version": 1
    }
]
```

This query has a system function in the GROUP BY clause:

```sql
SELECT TOP 4 COUNT(1) AS foodGroupCount, UPPER(f.foodGroup) AS upperFoodGroup
FROM Food f
GROUP BY UPPER(f.foodGroup)
```

Some results are:

```json
[
    {
        "foodGroupCount": 183,
        "upperFoodGroup": "CEREAL GRAINS AND PASTA"
    },
    {
        "foodGroupCount": 133,
        "upperFoodGroup": "NUT AND SEED PRODUCTS"
    },
    {
        "foodGroupCount": 113,
        "upperFoodGroup": "MEALS, ENTREES, AND SIDE DISHES"
    },
    {
        "foodGroupCount": 64,
        "upperFoodGroup": "SPICES AND HERBS"
    }
]
```

This query uses both keywords and system functions in the item property expression:

```sql
SELECT COUNT(1) AS foodGroupCount, ARRAY_CONTAINS(f.tags, {name: 'orange'}) AS containsOrangeTag,  f.version BETWEEN 0 AND 2 AS correctVersion
FROM Food f
GROUP BY ARRAY_CONTAINS(f.tags, {name: 'orange'}), f.version BETWEEN 0 AND 2
```

The results are:

```json
[
    {
        "foodGroupCount": 10,
        "containsOrangeTag": true,
        "correctVersion": true
    },
    {
        "foodGroupCount": 8608,
        "containsOrangeTag": false,
        "correctVersion": true
    }
]
```

## Next steps

- [Getting started](sql-query-getting-started.md)
- [SELECT clause](sql-query-select.md)
- [Aggregate functions](sql-query-aggregates.md)
