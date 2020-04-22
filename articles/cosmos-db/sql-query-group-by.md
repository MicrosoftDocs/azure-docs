---
title: GROUP BY clause in Azure Cosmos DB
description: Learn about the GROUP BY clause for Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/10/2020
ms.author: tisande

---
# GROUP BY clause in Azure Cosmos DB

The GROUP BY clause divides the query's results according to the values of one or more specified properties.

> [!NOTE]
> Azure Cosmos DB currently supports GROUP BY in .NET SDK 3.3 and above as well as JavaScript SDK 3.4 and above.
> Support for other language SDK's is not currently available but is planned.

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
SELECT COUNT(UniqueLastNames) FROM (SELECT AVG(f.age) FROM f GROUP BY f.lastName) AS UniqueLastNames
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
[{
  "foodGroup": "Fast Foods",
  "foodGroupCount": 371
},
{
  "foodGroup": "Finfish and Shellfish Products",
  "foodGroupCount": 267
},
{
  "foodGroup": "Meals, Entrees, and Side Dishes",
  "foodGroupCount": 113
},
{
  "foodGroup": "Sausages and Luncheon Meats",
  "foodGroupCount": 244
}]
```

This query has two expressions used to divide results:

```sql
SELECT TOP 4 COUNT(1) AS foodGroupCount, f.foodGroup, f.version
FROM Food f
GROUP BY f.foodGroup, f.version
```

Some results are:

```json
[{
  "version": 1,
  "foodGroup": "Nut and Seed Products",
  "foodGroupCount": 133
},
{
  "version": 1,
  "foodGroup": "Finfish and Shellfish Products",
  "foodGroupCount": 267
},
{
  "version": 1,
  "foodGroup": "Fast Foods",
  "foodGroupCount": 371
},
{
  "version": 1,
  "foodGroup": "Sausages and Luncheon Meats",
  "foodGroupCount": 244
}]
```

This query has a system function in the GROUP BY clause:

```sql
SELECT TOP 4 COUNT(1) AS foodGroupCount, UPPER(f.foodGroup) AS upperFoodGroup
FROM Food f
GROUP BY UPPER(f.foodGroup)
```

Some results are:

```json
[{
  "foodGroupCount": 371,
  "upperFoodGroup": "FAST FOODS"
},
{
  "foodGroupCount": 267,
  "upperFoodGroup": "FINFISH AND SHELLFISH PRODUCTS"
},
{
  "foodGroupCount": 389,
  "upperFoodGroup": "LEGUMES AND LEGUME PRODUCTS"
},
{
  "foodGroupCount": 113,
  "upperFoodGroup": "MEALS, ENTREES, AND SIDE DISHES"
}]
```

This query uses both keywords and system functions in the item property expression:

```sql
SELECT COUNT(1) AS foodGroupCount, ARRAY_CONTAINS(f.tags, {name: 'orange'}) AS containsOrangeTag,  f.version BETWEEN 0 AND 2 AS correctVersion
FROM Food f
GROUP BY ARRAY_CONTAINS(f.tags, {name: 'orange'}), f.version BETWEEN 0 AND 2
```

The results are:

```json
[{
  "correctVersion": true,
  "containsOrangeTag": false,
  "foodGroupCount": 8608
},
{
  "correctVersion": true,
  "containsOrangeTag": true,
  "foodGroupCount": 10
}]
```

## Next steps

- [Getting started](sql-query-getting-started.md)
- [SELECT clause](sql-query-select.md)
- [Aggregate functions](sql-query-aggregates.md)
