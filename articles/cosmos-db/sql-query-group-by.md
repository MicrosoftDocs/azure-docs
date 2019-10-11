---
title: GROUP BY clause in Azure Cosmos DB
description: Learn about the GROUP BY clause for Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/10/2019
ms.author: tisande

---
# GROUP BY clause

The GROUP BY clause divides the query's results according to the values of one or more specified properties.

> [!NOTE]
> Azure Cosmos DB currently supports GROUP BY in [.NET SDK 3.3](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.3.0) or later. Support in additional SDK's 
> and the Azure Portal is not yet available but is planned.

## Syntax

```sql  
GROUP BY <group_by_specification>  

<group_by_specification> ::= {<group_by_expression>} [ ,...n ]
```  

## Arguments

- `<group_by_specification>`

   Specifies the expressions that will be used to divide query results.

- `<group_by_expression>`
  
   Specifies an item's property or a non-aggregate system function on a property. The property can be an array. The property may appear in the SELECT clause but is not required.  There is no limit to the number of individual expressions or the cardinality of each expression.

## Remarks
  
  When a query uses a GROUP BY clause, the SELECT clause can only contain the subset of properties and system functions included in the GROUP BY clause. One exception is aggregate system functions, which can appear in the SELECT clause without being included in the GROUP BY clause.

  The GROUP BY clause must be after the SELECT, FROM, and WHERE clause and before the OFFSET LIMIT clause. You cannot use GROUP BY with an ORDER BY clause.

  The GROUP BY clause does not allow any of the following:
  
- Aliasing properties or system functions
- Subqueries
- Aggregate system functions (these are only allowed in the SELECT clause)

## Examples

Below examples use the nutrition data set available through the [Azure Cosmos DB Query Playground](https://www.documentdb.com/sql/demo):

For example, here's a query which returns the total count of items in each foodGroup:

```sql
SELECT TOP 4 COUNT(1) as FoodGroupCount, f.foodGroup
FROM Food f
GROUP BY f.foodGroup
```

Some results are (TOP keyword is used to limit results):

```json
[{
  "foodGroup": "Fast Foods",
  "FoodGroupCount": 371
},
{
  "foodGroup": "Finfish and Shellfish Products",
  "FoodGroupCount": 267
},
{
  "foodGroup": "Meals, Entrees, and Side Dishes",
  "FoodGroupCount": 113
},
{
  "foodGroup": "Sausages and Luncheon Meats",
  "FoodGroupCount": 244
}]
```

This query has two expressions used to divide results:

```sql
SELECT TOP 4 COUNT(1) as FoodGroupCount, f.foodGroup, f.version
FROM Food f
GROUP BY f.foodGroup, f.version
```

Some results are:

```json
[{
  "version": 1,
  "foodGroup": "Nut and Seed Products",
  "FoodGroupCount": 133
},
{
  "version": 1,
  "foodGroup": "Finfish and Shellfish Products",
  "FoodGroupCount": 267
},
{
  "version": 1,
  "foodGroup": "Fast Foods",
  "FoodGroupCount": 371
},
{
  "version": 1,
  "foodGroup": "Sausages and Luncheon Meats",
  "FoodGroupCount": 244
}]
```

This query has a system function in the GROUP BY clause:

```sql
SELECT TOP 4 COUNT(1) as FoodGroupCount, UPPER(f.foodGroup) as UpperFoodGroup
FROM Food f
GROUP BY UPPER(f.foodGroup)
```

Some results are:

```json
[{
  "FoodGroupCount": 371,
  "UpperFoodGroup": "FAST FOODS"
},
{
  "FoodGroupCount": 267,
  "UpperFoodGroup": "FINFISH AND SHELLFISH PRODUCTS"
},
{
  "FoodGroupCount": 389,
  "UpperFoodGroup": "LEGUMES AND LEGUME PRODUCTS"
},
{
  "FoodGroupCount": 113,
  "UpperFoodGroup": "MEALS, ENTREES, AND SIDE DISHES"
}]
```

This query uses both keywords and system functions in the item property expression:

```sql
SELECT COUNT(1) as FoodGroupCount, ARRAY_CONTAINS(f.tags, {name: 'orange'}) AS ContainsOrangeTag,  f.version BETWEEN 0 AND 2 AS CorrectVersion
FROM Food f
GROUP BY ARRAY_CONTAINS(f.tags, {name: 'orange'}), f.version BETWEEN 0 AND 2
```

The results are:

```json
 [{
  "CorrectVersion": true,
  "ContainsOrangeTag": false,
  "FoodGroupCount": 8608
},
{
  "CorrectVersion": true,
  "ContainsOrangeTag": true,
  "FoodGroupCount": 10
}]
```

## Next steps

- [Getting started](sql-query-getting-started.md)
- [SELECT clause](sql-query-select.md)
- [Aggregate functions](sql-query-aggregates.md)
