---
title: SQL subqueries for Azure Cosmos DB
description: Learn about SQL subqueries and their common use cases in Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: tisande

---
# SQL subquery examples for Azure Cosmos DB

A subquery is a query nested within another query. A subquery is also called an inner query or inner select. The statement that contains a subquery is typically called an outer query.

This article describes SQL subqueries and their common use cases in Azure Cosmos DB. All sample queries in this doc can be run against a nutrition dataset that is preloaded on the [Azure Cosmos DB Query Playground](https://www.documentdb.com/sql/demo).

## Types of subqueries

There are two main types of subqueries:

* **Correlated**: A subquery that references values from the outer query. The subquery is evaluated once for each row that the outer query processes.
* **Non-correlated**: A subquery that's independent of the outer query. It can be run on its own without relying on the outer query.

> [!NOTE]
> Azure Cosmos DB supports only correlated subqueries.

Subqueries can be further classified based on the number of rows and columns that they return. There are three types:
* **Table**: Returns multiple rows and multiple columns.
* **Multi-value**: Returns multiple rows and a single column.
* **Scalar**: Returns a single row and a single column.

SQL queries in Azure Cosmos DB always return a single column (either a simple value or a complex document). Therefore, only multi-value and scalar subqueries are applicable in Azure Cosmos DB. You can use a multi-value subquery only in the FROM clause as a relational expression. You can use a scalar subquery as a scalar expression in the SELECT or WHERE clause, or as a relational expression in the FROM clause.

## Multi-value subqueries

Multi-value subqueries return a set of documents and are always used within the FROM clause. They're used for:

* Optimizing JOIN expressions. 
* Evaluating expensive expressions once and referencing multiple times.

## Optimize JOIN expressions

Multi-value subqueries can optimize JOIN expressions by pushing predicates after each select-many expression rather than after all cross-joins in the WHERE clause.

Consider the following query:

```sql
SELECT Count(1) AS Count
FROM c
JOIN t IN c.tags
JOIN n IN c.nutrients
JOIN s IN c.servings
WHERE t.name = 'infant formula' AND (n.nutritionValue > 0 
AND n.nutritionValue < 10) AND s.amount > 1
```

For this query, the index will match any document that has a tag with the name "infant formula." It's a nutrient item with a value between 0 and 10, and a serving item with an amount greater than 1. The JOIN expression here will perform the cross-product of all items of tags, nutrients, and servings arrays for each matching document before any filter is applied. 

The WHERE clause will then apply the filter predicate on each <c, t, n, s> tuple. For instance, if a matching document had 10 items in each of the three arrays, it will expand to 1 x 10 x 10 x 10 (that is, 1,000) tuples. Using subqueries here can help in filtering out joined array items before joining with the next expression.

This query is equivalent to the preceding one but uses subqueries:

```sql
SELECT Count(1) AS Count
FROM c
JOIN (SELECT VALUE t FROM t IN c.tags WHERE t.name = 'infant formula')
JOIN (SELECT VALUE n FROM n IN c.nutrients WHERE n.nutritionValue > 0 AND n.nutritionValue < 10)
JOIN (SELECT VALUE s FROM s IN c.servings WHERE s.amount > 1)
```

Assume that only one item in the tags array matches the filter, and there are five items for both nutrients and servings arrays. The JOIN expressions will then expand to 1 x 1 x 5 x 5 = 25 items, as opposed to 1,000 items in the first query.

## Evaluate once and reference many times

Subqueries can help optimize queries with expensive expressions such as user-defined functions (UDFs), complex strings, or arithmetic expressions. You can use a subquery along with a JOIN expression to evaluate the expression once but reference it many times.

The following query runs the UDF `GetMaxNutritionValue` twice:

```sql
SELECT c.id, udf.GetMaxNutritionValue(c.nutrients) AS MaxNutritionValue
FROM c
WHERE udf.GetMaxNutritionValue(c.nutrients) > 100
```

Here's an equivalent query that runs the UDF only once:

```sql
SELECT TOP 1000 c.id, MaxNutritionValue
FROM c
JOIN (SELECT VALUE udf.GetMaxNutritionValue(c.nutrients)) MaxNutritionValue
WHERE MaxNutritionValue > 100
``` 

> [!NOTE] 
> Keep in mind the cross-product behavior of JOIN expressions. If the UDF expression can evaluate to undefined, you should ensure that the JOIN expression always produces a single row by returning an object from the subquery rather than the value directly.
>

Here's a similar example that returns an object rather than a value:

```sql
SELECT TOP 1000 c.id, m.MaxNutritionValue
FROM c
JOIN (SELECT udf.GetMaxNutritionValue(c.nutrients) AS MaxNutritionValue) m
WHERE m.MaxNutritionValue > 100
```

The approach is not limited to UDFs. It applies to any potentially expensive expression. For example, you can take the same approach with the mathematical function `avg`:

```sql
SELECT TOP 1000 c.id, AvgNutritionValue
FROM c
JOIN (SELECT VALUE avg(n.nutritionValue) FROM n IN c.nutrients) AvgNutritionValue
WHERE AvgNutritionValue > 80
```

## Mimic join with external reference data

You might often need to reference static data that rarely changes, such as units of measurement or country codes. It’s better not to duplicate such data for each document. Avoiding this duplication will save on storage and improve write performance by keeping the document size smaller. You can use a subquery to mimic inner-join semantics with a collection of reference data.

For instance, consider this set of reference data:

| **Unit** | **Name**            | **Multiplier** | **Base unit** |
| -------- | ------------------- | -------------- | ------------- |
| ng       | Nanogram            | 1.00E-09       | Gram          |
| µg       | Microgram           | 1.00E-06       | Gram          |
| mg       | Milligram           | 1.00E-03       | Gram          |
| g        | Gram                | 1.00E+00       | Gram          |
| kg       | Kilogram            | 1.00E+03       | Gram          |
| Mg       | Megagram            | 1.00E+06       | Gram          |
| Gg       | Gigagram            | 1.00E+09       | Gram          |
| nJ       | Nanojoule           | 1.00E-09       | Joule         |
| µJ       | Microjoule          | 1.00E-06       | Joule         |
| mJ       | Millijoule          | 1.00E-03       | Joule         |
| J        | Joule               | 1.00E+00       | Joule         |
| kJ       | Kilojoule           | 1.00E+03       | Joule         |
| MJ       | Megajoule           | 1.00E+06       | Joule         |
| GJ       | Gigajoule           | 1.00E+09       | Joule         |
| cal      | Calorie             | 1.00E+00       | calorie       |
| kcal     | Calorie             | 1.00E+03       | calorie       |
| IU       | International units |                |               |


The following query mimics joining with this data so that you add the name of the unit to the output:

```sql
SELECT TOP 10 n.id, n.description, n.nutritionValue, n.units, r.name
FROM food
JOIN n IN food.nutrients
JOIN r IN (
    SELECT VALUE [
        {unit: 'ng', name: 'nanogram', multiplier: 0.000000001, baseUnit: 'gram'},
        {unit: 'µg', name: 'microgram', multiplier: 0.000001, baseUnit: 'gram'},
        {unit: 'mg', name: 'milligram', multiplier: 0.001, baseUnit: 'gram'},
        {unit: 'g', name: 'gram', multiplier: 1, baseUnit: 'gram'},
        {unit: 'kg', name: 'kilogram', multiplier: 1000, baseUnit: 'gram'},
        {unit: 'Mg', name: 'megagram', multiplier: 1000000, baseUnit: 'gram'},
        {unit: 'Gg', name: 'gigagram', multiplier: 1000000000, baseUnit: 'gram'},
        {unit: 'nJ', name: 'nanojoule', multiplier: 0.000000001, baseUnit: 'joule'},
        {unit: 'µJ', name: 'microjoule', multiplier: 0.000001, baseUnit: 'joule'},
        {unit: 'mJ', name: 'millijoule', multiplier: 0.001, baseUnit: 'joule'},
        {unit: 'J', name: 'joule', multiplier: 1, baseUnit: 'joule'},
        {unit: 'kJ', name: 'kilojoule', multiplier: 1000, baseUnit: 'joule'},
        {unit: 'MJ', name: 'megajoule', multiplier: 1000000, baseUnit: 'joule'},
        {unit: 'GJ', name: 'gigajoule', multiplier: 1000000000, baseUnit: 'joule'},
        {unit: 'cal', name: 'calorie', multiplier: 1, baseUnit: 'calorie'},
        {unit: 'kcal', name: 'Calorie', multiplier: 1000, baseUnit: 'calorie'},
        {unit: 'IU', name: 'International units'}
    ]
)
WHERE n.units = r.unit
```

## Scalar subqueries

A scalar subquery expression is a subquery that evaluates to a single value. The value of the scalar subquery expression is the value of the projection (SELECT clause) of the subquery.  You can use a scalar subquery expression in many places where a scalar expression is valid. For instance, you can use a scalar subquery in any expression in both the SELECT and WHERE clauses.

Using a scalar subquery doesn't always help optimize, though. For example, passing a scalar subquery as an argument to either a system or user-defined functions provides no benefit in resource unit (RU) consumption or latency.

Scalar subqueries can be further classified as:
* Simple-expression scalar subqueries
* Aggregate scalar subqueries

## Simple-expression scalar subqueries

A simple-expression scalar subquery is a correlated subquery that has a SELECT clause that doesn't contain any aggregate expressions. These subqueries provide no optimization benefits because the compiler converts them into one larger simple expression. There's no correlated context between the inner and outer queries.

Here are few examples:

**Example 1**

```sql
SELECT 1 AS a, 2 AS b
```

You can rewrite this query, by using a simple-expression scalar subquery, to:

```sql
SELECT (SELECT VALUE 1) AS a, (SELECT VALUE 2) AS b
```

Both queries produce this output:

```json
[
  { "a": 1, "b": 2 }
]
```

**Example 2**

```sql
SELECT TOP 5 Concat('id_', f.id) AS id
FROM food f
```

You can rewrite this query, by using a simple-expression scalar subquery, to:

```sql
SELECT TOP 5 (SELECT VALUE Concat('id_', f.id)) AS id
FROM food f
```

Query output:

```json
[
  { "id": "id_03226" },
  { "id": "id_03227" },
  { "id": "id_03228" },
  { "id": "id_03229" },
  { "id": "id_03230" }
]
```

**Example 3**

```sql
SELECT TOP 5 f.id, Contains(f.description, 'fruit') = true ? f.description : undefined
FROM food f
```

You can rewrite this query, by using a simple-expression scalar subquery, to:

```sql
SELECT TOP 10 f.id, (SELECT f.description WHERE Contains(f.description, 'fruit')).description
FROM food f
```

Query output:

```json
[
  { "id": "03230" },
  { "id": "03238", "description":"Babyfood, dessert, tropical fruit, junior" },
  { "id": "03229" },
  { "id": "03226", "description":"Babyfood, dessert, fruit pudding, orange, strained" },
  { "id": "03227" }
]
```

### Aggregate scalar subqueries

An aggregate scalar subquery is a subquery that has an aggregate function in its projection or filter that evaluates to a single value.

**Example 1:**

Here's a subquery with a single aggregate function expression in its projection:

```sql
SELECT TOP 5 
    f.id, 
    (SELECT VALUE Count(1) FROM n IN f.nutrients WHERE n.units = 'mg'
) AS count_mg
FROM food f
```

Query output:

```json
[
  { "id": "03230", "count_mg": 13 },
  { "id": "03238", "count_mg": 14 },
  { "id": "03229", "count_mg": 13 },
  { "id": "03226", "count_mg": 15 },
  { "id": "03227", "count_mg": 19 }
]
```

**Example 2**

Here's a subquery with multiple aggregate function expressions:

```sql
SELECT TOP 5 f.id, (
    SELECT Count(1) AS count, Sum(n.nutritionValue) AS sum 
    FROM n IN f.nutrients 
    WHERE n.units = 'mg'
) AS unit_mg
FROM food f
```

Query output:

```json
[
  { "id": "03230","unit_mg": { "count": 13,"sum": 147.072 } },
  { "id": "03238","unit_mg": { "count": 14,"sum": 107.385 } },
  { "id": "03229","unit_mg": { "count": 13,"sum": 141.579 } },
  { "id": "03226","unit_mg": { "count": 15,"sum": 183.91399999999996 } },
  { "id": "03227","unit_mg": { "count": 19,"sum": 94.788999999999987 } }
]
```

**Example 3**

Here's a query with an aggregate subquery in both the projection and the filter:

```sql
SELECT TOP 5 
    f.id, 
	(SELECT VALUE Count(1) FROM n IN f.nutrients WHERE n.units = 'mg') AS count_mg
FROM food f
WHERE (SELECT VALUE Count(1) FROM n IN f.nutrients WHERE n.units = 'mg') > 20
```

Query output:

```json
[
  { "id": "03235", "count_mg": 27 },
  { "id": "03246", "count_mg": 21 },
  { "id": "03267", "count_mg": 21 },
  { "id": "03269", "count_mg": 21 },
  { "id": "03274", "count_mg": 21 }
]
```

A more optimal way to write this query is to join on the subquery and reference the subquery alias in both the SELECT and WHERE clauses. This query is more efficient because you need to execute the subquery only within the join statement, and not in both the projection and filter.

```sql
SELECT TOP 5 f.id, count_mg
FROM food f
JOIN (SELECT VALUE Count(1) FROM n IN f.nutrients WHERE n.units = 'mg') AS count_mg
WHERE count_mg > 20
```

## EXISTS expression

Azure Cosmos DB supports EXISTS expressions. This is an aggregate scalar subquery built into the Azure Cosmos DB SQL API. EXISTS is a Boolean expression that takes a subquery expression and returns true if the subquery returns any rows. Otherwise, it returns false.

Because the Azure Cosmos DB SQL API doesn't differentiate between Boolean expressions and any other scalar expressions, you can use EXISTS in both SELECT and WHERE clauses. This is unlike T-SQL, where a Boolean expression (for example, EXISTS, BETWEEN, and IN) is restricted to the filter.

If the EXISTS subquery returns a single value that's undefined, EXISTS will evaluate to false. For instance, consider the following query that evaluates to false:
```sql
SELECT EXISTS (SELECT VALUE undefined)
```   


If the VALUE keyword in the preceding subquery is omitted, the query will evaluate to true:
```sql
SELECT EXISTS (SELECT undefined) 
```

The subquery will enclose the list of values in the selected list in an object. If the selected list has no values, the subquery will return the single value ‘{}’. This value is defined, so EXISTS evaluates to true.

### Example: Rewriting ARRAY_CONTAINS and JOIN as EXISTS

A common use case of ARRAY_CONTAINS is to filter a document by the existence of an item in an array. In this case, we're checking to see if the tags array contains an item named "orange."

```sql
SELECT TOP 5 f.id, f.tags
FROM food f
WHERE ARRAY_CONTAINS(f.tags, {name: 'orange'})
```

You can rewrite the same query to use EXISTS:

```sql
SELECT TOP 5 f.id, f.tags
FROM food f
WHERE EXISTS(SELECT VALUE t FROM t IN f.tags WHERE t.name = 'orange')
```

Additionally, ARRAY_CONTAINS can only check if a value is equal to any element within an array. If you need more complex filters on array properties, use JOIN.

Consider the following query that filters based on the units and `nutritionValue` properties in the array: 

```sql
SELECT VALUE c.description
FROM c
JOIN n IN c.nutrients
WHERE n.units= "mg" AND n.nutritionValue > 0
```

For each of the documents in the collection, a cross-product is performed with its array elements. This JOIN operation makes it possible to filter on properties within the array. However, this query’s RU consumption will be significant. For instance, if 1,000 documents had 100 items in each array, it will expand to 1,000 x 100 (that is, 100,000) tuples.

Using EXISTS can help to avoid this expensive cross-product:

```sql
SELECT VALUE c.description
FROM c
WHERE EXISTS(
    SELECT VALUE n
    FROM n IN c.nutrients
    WHERE n.units = "mg" AND n.nutritionValue > 0
)
```

In this case, you filter on array elements within the EXISTS subquery. If an array element matches the filter, then you project it and EXISTS evaluates to true.

You can also alias EXISTS and reference it in the projection:

```sql
SELECT TOP 1 c.description, EXISTS(
    SELECT VALUE n
    FROM n IN c.nutrients
    WHERE n.units = "mg" AND n.nutritionValue > 0) as a
FROM c
```

Query output:

```json
[
    {
        "description": "Babyfood, dessert, fruit pudding, orange, strained",
        "a": true
    }
]
```

## ARRAY expression

You can use the ARRAY expression to project the results of a query as an array. You can use this expression only within the SELECT clause of the query.

```sql
SELECT TOP 1   f.id, ARRAY(SELECT VALUE t.name FROM t in f.tags) AS tagNames
FROM  food f
```

Query output:

```json
[
    {
        "id": "03238",
        "tagNames": [
            "babyfood",
            "dessert",
            "tropical fruit",
            "junior"
        ]
    }
]
```

As with other subqueries, filters with the ARRAY expression are possible.

```sql
SELECT TOP 1 c.id, ARRAY(SELECT VALUE t FROM t in c.tags WHERE t.name != 'infant formula') AS tagNames
FROM c
```

Query output:

```json
[
    {
        "id": "03226",
        "tagNames": [
            {
                "name": "babyfood"
            },
            {
                "name": "dessert"
            },
            {
                "name": "fruit pudding"
            },
            {
                "name": "orange"
            },
            {
                "name": "strained"
            }
        ]
    }
]
```

Array expressions can also come after the FROM clause in subqueries.

```sql
SELECT TOP 1 c.id, ARRAY(SELECT VALUE t.name FROM t in c.tags) as tagNames
FROM c
JOIN n IN (SELECT VALUE ARRAY(SELECT t FROM t in c.tags WHERE t.name != 'infant formula'))
```

Query output:

```json
[
    {
        "id": "03238",
        "tagNames": [
            "babyfood",
            "dessert",
            "tropical fruit",
            "junior"
        ]
    }
]
```

## Next steps

- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Model document data](modeling-data.md)
