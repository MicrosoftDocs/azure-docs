---
title: SQL subqueries for Azure Cosmos DB
description: Learn about SQL subqueries in Azure Cosmos DB and common use cases
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/19/2019
ms.author: tsander26

---
# SQL subquery examples for Azure Cosmos DB

A subquery is a query nested within another query. A subquery is also called an inner query or inner select and the statement containing a subquery is typically called an outer query.
There are two types of subqueries: Correlated and Non-Correlated. A Correlated subquery is a subquery that references values from the outer query. The subquery is evaluated once for each row processed by the outer query. A Non-Correlated subquery is a subquery that is independent of the outer query and it can executed on its own without relying on main outer query.
Azure Cosmos DB supports correlated subqueries.

## Types of Subqueries

Subqueries can be further classified based on the number of rows and columns that they return. There are three different types:
1.	Table: Returns multiple rows and multiple columns
2.	Multi-Value: Returns multiple rows and a single column
3.	Scalar: Returns a single row and single column

In Azure Cosmos DB, we support Multi-Value subqueries and Scalar subqueries.

Cosmos DB SQL queries always return a single column (either a simple value or a complex document). Therefore, only Multi-Value and Scalar subqueries from above are applicable in Azure Cosmos DB. A Multi-Value subquery can only be used in the FROM clause as a relational expression, while a Scalar subquery can be used as a scalar expression in the SELECT or WHERE clause or as a relational expression in the FROM clause.


## <a id="Multi-Value Subqueries"></a>Multi-Value Subqueries

Multi-Value subqueries return a set of documents and are always used within the FROM clause. They are used for:

* Optimizing JOIN expressions 
* Evaluating expensive expressions once and referencing multiple times

### Optimize JOIN Expressions

Multi-Value subqueries can optimize JOIN expressions by pushing predicates after each select-many expression rather than after all cross-joins in the WHERE clause
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

For this query, the index will match any document that has a tag with the name ‘infant formula’, a nutrient item with a value between 0 and 10 and a serving item with an amount greater than 1. However, the JOIN expression here will perform the cross product of all items of tags, nutrients and servings arrays for each matching document before any filter is applied. The WHERE clause will then apply the filter predicate on each <c, t, n, s> tuple. For instance, if a matching document had 10 items in each of the 3 arrays, it will expand to 1 x 10 x 10 x 10 (i.e. 1,000) tuples. Using subqueries here, can help filtering out joined array items before joining with the next expression.

This query is equivalent to the one above but utilizes subqueries:

```sql
SELECT Count(1) AS Count
FROM c
JOIN (SELECT VALUE t FROM t IN c.tags WHERE t.name = 'infant formula')
JOIN (SELECT VALUE n FROM n IN c.nutrients WHERE n.nutritionValue > 0 AND n.nutritionValue < 10)
JOIN (SELECT VALUE s FROM s IN c.servings WHERE s.amount > 1)
```

Assuming only 1 item in the tags array matches the filter, and 5 items for both nutrients and servings arrays, the JOIN expressions will expand to 1 x 1 x 5 x 5 = 25 items as opposed to 1,000 items in the first query.

### Evaluate Once and Reference Many Times

Subqueries can help optimize queries with expensive expressions such as user-defined functions (UDF) or complex string or arithmetic expressions. You can use a subquery along with a JOIN expression to evaluate the expression once but reference it many times.

The following query executes the UDF GetMaxNutritionValue twice:

```sql
SELECT TOP 1000 c.id, udf.GetMaxNutritionValue(c.nutrients) AS MaxNutritionValue
FROM c
WHERE udf.GetMaxNutritionValue(c.nutrients) > 100
```

Here is an equivalent query that only executes the UDF once:

```sql
SELECT TOP 1000 c.id, MaxNutritionValue
FROM c
JOIN (SELECT VALUE udf.GetMaxNutritionValue(c.nutrients)) MaxNutritionValue
WHERE MaxNutritionValue > 100
``` 

> [!NOTE] 
> Given the cross-product behavior of JOIN expressions, if the UDF expression could evaluate to undefined, you should ensure that the JOIN expression always produces a single row by returning an object from
> the subquery rather than the value directly.
>

Here is a similar example that returns an object rather than a value:

```sql
SELECT TOP 1000 c.id, m.MaxNutritionValue
FROM c
JOIN (SELECT udf.GetMaxNutritionValue(c.nutrients) AS MaxNutritionValue) m
WHERE m.MaxNutritionValue > 100
```

The approach here is not limited to UDFs, but rather, to any potentially expensive expression. For instance example, we could take the same approach with the mathematical function avg:

```sql
SELECT TOP 1000 c.id, AvgNutritionValue
FROM c
JOIN (SELECT VALUE avg(n.nutritionValue) FROM n IN c.nutrients) AvgNutritionValue
WHERE AvgNutritionValue > 80
```

### Mimic Join with External Reference Data

We often need to reference static data that rarely changes, such as units of measurements or country codes. For such data, it’s preferable not to duplicate it for each document. This will save on storage and improve write performance by keeping document size smaller. A subquery can be used here to mimic inner-join semantics with a collection of reference data.
For instance, consider this set of reference data.

| **Unit** | **Name**            | **Multiplier** | **Base Unit** |
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


The following is a subquery that mimics joining with this data so that we add the name of the unit to the output:

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

## <a id="Scalar Subqueries"></a>Scalar Subqueries

A scalar subquery expression is a subquery that evaluates to a single value. The value of the scalar subquery expression is the value of the projection (SELECT clause) of the subquery.  A scalar subquery expression can be used in many places a scalar expression is valid. For instance, a scalar subquery can be used in any expression in both the SELECT and WHERE clauses.
However, using a scalar subquery does not always help optimize. For example, passing a scalar subquery as an argument to either a system or user-defined functions provides no benefit in RU consumption or latency.

Scalar subqueries can be further classified as:
* Simple-Expression Scalar Subqueries
* Aggregate Scalar Subqueries

### Simple-Expression Scalar Subqueries

A simple-expression scalar subquery is a correlated subquery which has a SELECT clause that does not contain any aggregate expressions. These subqueries provide no optimization benefits because the compiler converts them into one larger simple expression. There is no correlated context between the inner and outer query.

Here are few examples:

**Example 1**

```sql
SELECT 1 AS a, 2 AS b
```

This query could be re-written, using a simple-expression scalar subquery to:

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

This query could be re-written, using a simple-expression scalar subquery to:

```sql
SELECT TOP 5 (SELECT VALUE Concat('id_', f.id)) AS id
FROM food f
```

Query Output:

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

This query could be re-written, using a simple-expression scalar subquery to:

```sql
SELECT TOP 10 f.id, (SELECT f.description WHERE Contains(f.description, 'fruit')).description
FROM food f
```

Query Output:

```json
[
  { "id": "03230" },
  { "id": "03238", "description":"Babyfood, dessert, tropical fruit, junior" },
  { "id": "03229" },
  { "id": "03226", "description":"Babyfood, dessert, fruit pudding, orange, strained" },
  { "id": "03227" }
]
```

## Aggregate Scalar Subqueries

An aggregate scalar subquery is a subquery that has an aggregate function in its projection or filter which evaluates to a single value.

**Example 1:**

Here is a subquery with a single aggregate function expression in its projection:

```sql
SELECT TOP 5 
    f.id, 
    (SELECT VALUE Count(1) FROM n IN f.nutrients WHERE n.units = 'mg'
) AS count_mg
FROM food f
```

Query Output:

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

A subquery with multiple aggregate function expressions:

```sql
SELECT TOP 5 f.id, (
    SELECT Count(1) AS count, Sum(n.nutritionValue) AS sum 
    FROM n IN f.nutrients 
    WHERE n.units = 'mg'
) AS unit_mg
FROM food f
```

Query Output:

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

A query with an aggregate subquery in both the projection and the filter:

```sql
SELECT TOP 5 
    f.id, 
	(SELECT VALUE Count(1) FROM n IN f.nutrients WHERE n.units = 'mg') AS count_mg
FROM food f
WHERE (SELECT VALUE Count(1) FROM n IN f.nutrients WHERE n.units = 'mg') > 20
```

Query Output:

```json
[
  { "id": "03235", "count_mg": 27 },
  { "id": "03246", "count_mg": 21 },
  { "id": "03267", "count_mg": 21 },
  { "id": "03269", "count_mg": 21 },
  { "id": "03274", "count_mg": 21 }
]
```

A more optimal way to write this query is to join on the subquery and reference the subquery alias in both the SELECT and WHERE clauses. This query is more efficient because we will need to execute the subquery only within the join statement and not in both the projection and filter.

```sql
SELECT TOP 5 f.id, count_mg
FROM food f
JOIN (SELECT VALUE Count(1) FROM n IN f.nutrients WHERE n.units = 'mg') AS count_mg
WHERE count_mg > 20
```

### EXISTS Expression

Azure Cosmos DB supports EXISTS expressions. This is an aggregate scalar subquery built into the Azure Cosmos DB SQL API. EXISTS is a Boolean expression that takes a subquery expression and returns true if the subquery returns any rows; otherwise, it returns false.
Unlike T-SQL, where a Boolean expression (e.g. EXISTS, BETWEEN, and IN) is restricted to the filter, Azure Cosmos DB SQL API does not differentiate between Boolean expressions and any other scalar expressions. As such, EXISTS can be used in both SELECT and WHERE clauses. 

If the EXISTS subquery returns a single value that is undefined, then EXISTS will evaluate to false. For instance, consider the following query which evaluates to false:
```sql
SELECT EXISTS (SELECT VALUE undefined)
```   


However, if the VALUE keyword in the subquery above is omitted then the query will evaluate to true:
```sql
SELECT EXISTS (SELECT undefined) 
```

The subquery will enclose the list of values in the select list in an object. If the selected list has no values, the subquery will return the single value ‘{}’ which is defined and thus EXISTS evaluates to true.

### Example: Rewriting ARRAY_CONTAINS and JOIN as EXISTS

A very common use case of ARRAY_CONTAINS is to filter a document by the existence of an item in an array. In this case, we are checking to see if the tags array contains an item named orange.

```sql
SELECT TOP 5 f.id, f.tags
FROM food f
WHERE ARRAY_CONTAINS(f.tags, {name: 'orange'})
```

The same query could be rewritten to use EXISTS:

```sql
SELECT TOP 5 f.id, f.tags
FROM food f
WHERE EXISTS(SELECT VALUE t FROM t IN f.tags WHERE t.name = 'orange')
```

Additionally, ARRAY_CONTAINS is only able to check if a value is equal to any element within an array. If more complex filters are needed on array properties, a JOIN is required. 
Consider the following query which filters based on the units and nutritionValue properties in the array: 

```sql
SELECT VALUE c.description
FROM c
JOIN n IN c.nutrients
WHERE n.units= "mg" AND n.nutritionValue > 0
```

For each of the documents in the collection, a cross-product is performed with its array elements. This JOIN operation makes it possible to filter on properties within the array. However, this query’s RU consumption will be significant. For instance, if 1,000 documents had 100 items in each array, it will expand to 1,000 x 100 (i.e. 100,000) tuples.

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

In this case we filter on array elements within the EXISTS subquery. If an array element matches the filter, then we project it and EXISTS evaluates to true.

We can also alias EXISTS and reference it in the projection:

```sql
SELECT TOP 1 c.description, EXISTS(
    SELECT VALUE n
    FROM n IN c.nutrients
    WHERE n.units = "mg" AND n.nutritionValue > 0) as a
FROM c
```

Query Output:

```json
[
    {
        "description": "Babyfood, dessert, fruit pudding, orange, strained",
        "a": true
    }
]
```

## ARRAY Expression

The ARRAY expression can be used to project the results of a query as an array. This can only be used within the SELECT clause of the query.

```sql
SELECT TOP 1   f.id, ARRAY(SELECT VALUE t.name FROM t in f.tags) AS tagNames
FROM  food f
```

Query Output:

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

Query Output:

```sql
SELECT TOP 1 c.id, ARRAY(SELECT VALUE t FROM t in c.tags WHERE t.name != 'infant formula') AS tagNames
FROM c
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
SELECT TOP 5 c.id, n.name
FROM c
JOIN n IN (SELECT VALUE (SELECT VALUE(c.tags)))
```
Query Output:

```json## <a id="Multi-Value Subqueries"></a>Multi-Value Subqueries
 [
    {
        "id": "03226",
        "name": "babyfood"
    },
    {
        "id": "03226",
        "name": "dessert"
    },
    {
        "id": "03226",
        "name": "fruit pudding"
    },
    {
        "id": "03226",
        "name": "orange"
    },
    {
        "id": "03226",
        "name": "strained"
    }
]
```

## Next steps

- [Introduction to Azure Cosmos DB][introduction]
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Azure Cosmos DB consistency levels][consistency-levels]
