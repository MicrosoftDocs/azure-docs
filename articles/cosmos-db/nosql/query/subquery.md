---
title: Subqueries
titleSuffix: Azure Cosmos DB for NoSQL
description: Use different types of subqueries for complex query statements in Azure Cosmos DB for NoSQL.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/31/2023
ms.custom: query-reference
---

# Subqueries in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

A subquery is a query nested within another query within Azure Cosmos DB for NoSQL. A subquery is also called an *inner query* or *inner ``SELECT``*. The statement that contains a subquery is typically called an *outer query*.

## Types of subqueries

There are two main types of subqueries:

- **Correlated**: A subquery that references values from the outer query. The subquery is evaluated once for each row that the outer query processes.
- **Non-correlated**: A subquery that's independent of the outer query. It can be run on its own without relying on the outer query.

> [!NOTE]
> Azure Cosmos DB supports only correlated subqueries.

Subqueries can be further classified based on the number of rows and columns that they return. There are three types:

- **Table**: Returns multiple rows and multiple columns.
- **Multi-value**: Returns multiple rows and a single column.
- **Scalar**: Returns a single row and a single column.

Queries in Azure Cosmos DB for NoSQL always return a single column (either a simple value or a complex item). Therefore, only multi-value and scalar subqueries are applicable. You can use a multi-value subquery only in the ``FROM`` clause as a relational expression. You can use a scalar subquery as a scalar expression in the ``SELECT`` or ``WHERE`` clause, or as a relational expression in the ``FROM`` clause.

## Multi-value subqueries

Multi-value subqueries return a set of items and are always used within the ``FROM`` clause. They're used for:

- Optimizing ``JOIN`` (self-join) expressions.
- Evaluating expensive expressions once and referencing multiple times.

## Optimize self-join expressions

Multi-value subqueries can optimize ``JOIN`` expressions by pushing predicates after each *select-many* expression rather than after all *cross-joins* in the ``WHERE`` clause.

Consider the following query:

```sql
SELECT VALUE
    COUNT(1)
FROM
    products p
JOIN 
    t in p.tags
JOIN 
    q in p.onHandQuantities
JOIN 
    s in p.warehouseStock
WHERE 
    t.name IN ("winter", "fall") AND
    (q.quantity BETWEEN 0 AND 10) AND
    NOT s.backstock
```

For this query, the index matches any item that has a tag with a ``name`` of either **"winter"** or **"fall"**, at least one ``quantity`` between **zero** and **ten**, and at least one warehouse where the ``backstock`` is ``false``. The ``JOIN`` expression here performs the *cross-product* of all items of ``tags``, ``onHandQuantities``, and ``warehouseStock`` arrays for each matching item before any filter is applied.

The ``WHERE`` clause then applies the filter predicate on each ``<c, t, n, s>`` tuple. For instance, if a matching item had **ten** items in each of the three arrays, it expands to ``1 x 10 x 10 x 10`` (that is, **1,000**) tuples. Using subqueries here can help in filtering out joined array items before joining with the next expression.

This query is equivalent to the preceding one but uses subqueries:

```sql
SELECT VALUE
    COUNT(1)
FROM
    products p
JOIN 
    (SELECT VALUE t FROM t IN p.tags WHERE t.name IN ("winter", "fall"))
JOIN 
    (SELECT VALUE q FROM q IN p.onHandQuantities WHERE q.quantity BETWEEN 0 AND 10)
JOIN 
    (SELECT VALUE s FROM s IN p.warehouseStock WHERE NOT s.backstock)
```

Assume that only one item in the tags array matches the filter, and there are five items for both nutrients and servings arrays. The ``JOIN`` expressions then expand to ``1 x 1 x 5 x 5`` (**25**) items, as opposed to **1,000** items in the first query.

## Evaluate once and reference many times

Subqueries can help optimize queries with expensive expressions such as user-defined functions (UDFs), complex strings, or arithmetic expressions. You can use a subquery along with a ``JOIN`` expression to evaluate the expression once but reference it many times.

Let's assume that you have the following UDF (`getTotalWithTax`) defined.

```javascript
function getTotalWithTax(subTotal){
  return subTotal * 1.25;
}
```

The following query runs the UDF `getTotalWithTax` multiple times:

```sql
SELECT VALUE {
    subtotal: p.price,
    total: udf.getTotalWithTax(p.price)
}
FROM
    products p
WHERE
    udf.getTotalWithTax(p.price) < 22.25
```

Here's an equivalent query that runs the UDF only once:

```sql
SELECT VALUE {
    subtotal: p.price,
    total: totalPrice
}
FROM
    products p
JOIN
    (SELECT VALUE udf.getTotalWithTax(p.price)) totalPrice
WHERE
    totalPrice < 22.25
```

> [!TIP]
> Keep in mind the cross-product behavior of ``JOIN`` expressions. If the UDF expression can evaluate to ``undefined``, you should ensure that the ``JOIN`` expression always produces a single row by returning an object from the subquery rather than the value directly.

## Mimic join with external reference data

You might often need to reference static data that rarely changes, such as *units of measurement*. It's ideal to not duplicate static data for each item in a query. Avoiding this duplication saves on storage and improve write performance by keeping the individual item size smaller. You can use a subquery to mimic inner-join semantics with a collection of static reference data.

For instance, consider this set of measurements:

| | **Name** | **Multiplier** | **Base unit** |
| --- | --- | --- | --- |
| **``ng``** | Nanogram | ``1.00E-09`` | Gram |
| **``µg``** | Microgram | ``1.00E-06`` | Gram |
| **``mg``** | Milligram | ``1.00E-03`` | Gram |
| **``g``** | Gram | ``1.00E+00`` | Gram |
| **``kg``** | Kilogram | ``1.00E+03`` | Gram |
| **``Mg``** | Megagram | ``1.00E+06`` | Gram |
| **``Gg``** | Gigagram | ``1.00E+09`` | Gram |

The following query mimics joining with this data so that you add the name of the unit to the output:

```sql
SELECT
    s.id,
    (s.weight.quantity * m.multiplier) AS calculatedWeight,
    m.unit AS unitOfWeight
FROM
    shipments s
JOIN m IN (
    SELECT VALUE [
        {unit: 'ng', name: 'nanogram', multiplier: 0.000000001, baseUnit: 'gram'},
        {unit: 'µg', name: 'microgram', multiplier: 0.000001, baseUnit: 'gram'},
        {unit: 'mg', name: 'milligram', multiplier: 0.001, baseUnit: 'gram'},
        {unit: 'g', name: 'gram', multiplier: 1, baseUnit: 'gram'},
        {unit: 'kg', name: 'kilogram', multiplier: 1000, baseUnit: 'gram'},
        {unit: 'Mg', name: 'megagram', multiplier: 1000000, baseUnit: 'gram'},
        {unit: 'Gg', name: 'gigagram', multiplier: 1000000000, baseUnit: 'gram'}
    ]
)
WHERE
    s.weight.units = m.unit
```

## Scalar subqueries

A scalar subquery expression is a subquery that evaluates to a single value. The value of the scalar subquery expression is the value of the projection (``SELECT`` clause) of the subquery.  You can use a scalar subquery expression in many places where a scalar expression is valid. For instance, you can use a scalar subquery in any expression in both the ``SELECT`` and ``WHERE`` clauses.

Using a scalar subquery doesn't always help optimize your query. For example, passing a scalar subquery as an argument to either a system or user-defined functions provides no benefit in reducing resource unit (RU) consumption or latency.

Scalar subqueries can be further classified as:

- Simple-expression scalar subqueries
- Aggregate scalar subqueries

### Simple-expression scalar subqueries

A simple-expression scalar subquery is a correlated subquery that has a ``SELECT`` clause that doesn't contain any aggregate expressions. These subqueries provide no optimization benefits because the compiler converts them into one larger simple expression. There's no correlated context between the inner and outer queries.

As a first example, consider this trivial query.

```sql
SELECT
    1 AS a,
    2 AS b
```

You can rewrite this query, by using a simple-expression scalar subquery.

```sql
SELECT
    (SELECT VALUE 1) AS a, 
    (SELECT VALUE 2) AS b
```

Both queries produce the same output.

```json
[
  {
    "a": 1,
    "b": 2
  }
]
```

This next example query concatenates the unique identifier with a prefix as a simple-expression scalar subquery.

```sql
SELECT 
    (SELECT VALUE Concat('ID-', p.id)) AS internalId
FROM
    products p
```

This example uses a simple-expression scalar subquery to only return the relevant fields for each item. The query outputs something for each item, but it only includes the projected field if it meets the filter within the subquery.

```sql
SELECT
    p.id,
    (SELECT p.name WHERE CONTAINS(p.name, "glove")).name
FROM
    products p
```

```json
[
  {
    "id": "03230",
    "name": "Winter glove"
  },
  {
    "id": "03238"
  },
  {
    "id": "03229"
  }
]
```

### Aggregate scalar subqueries

An aggregate scalar subquery is a subquery that has an aggregate function in its projection or filter that evaluates to a single value.

As a first example, consider an item with the following fields.

```json
{
  "name": "Snow coat",
  "inventory": [
    {
      "location": "Redmond, WA",
      "quantity": 50
    },
    {
      "location": "Seattle, WA",
      "quantity": 30
    },
    {
      "location": "Washington, DC",
      "quantity": 25
    }
  ]
}
```

Here's a subquery with a single aggregate function expression in its projection. This query counts all tags for each item.

```sql
SELECT
    p.name,
    (SELECT VALUE COUNT(1) FROM i IN p.inventory) AS locationCount
FROM
    products p
```

```json
[
  {
    "name": "Snow coat",
    "locationCount": 3
  }
]
```

Here's the same subquery with a filter.

```sql
SELECT
    p.name,
    (SELECT VALUE COUNT(1) FROM i IN p.inventory WHERE ENDSWITH(i.location, "WA")) AS washingtonLocationCount
FROM
    products p
```

```json
[
  {
    "name": "Snow coat",
    "washingtonLocationCount": 2
  }
]
```

Here's another subquery with multiple aggregate function expressions:

```sql
SELECT
    p.name,
    (SELECT
        COUNT(1) AS locationCount,
        SUM(i.quantity) AS totalQuantity
    FROM i IN p.inventory) AS inventoryData
FROM
    products p
```

```json
[
  {
    "name": "Snow coat",
    "inventoryData": {
      "locationCount": 2,
      "totalQuantity": 75
    }
  }
]
```

Finally, here's a query with an aggregate subquery in both the projection and the filter:

```sql
SELECT
    p.name,
    (SELECT VALUE AVG(q.quantity) FROM q IN p.inventory WHERE q.quantity > 10) AS averageInventory
FROM
    products p
WHERE
    (SELECT VALUE COUNT(1) FROM i IN p.inventory WHERE i.quantity > 10) >= 1
```

```json
[
  {
    "name": "Snow coat",
    "averageInventory": 35
  }
]
```

A more optimal way to write this query is to join on the subquery and reference the subquery alias in both the SELECT and WHERE clauses. This query is more efficient because you need to execute the subquery only within the join statement, and not in both the projection and filter.

```sql
SELECT
    p.name,
    inventoryData.inventoryAverage
FROM
    products p
JOIN
    (SELECT 
        COUNT(1) AS inventoryCount, 
        AVG(i.quantity) as inventoryAverage 
    FROM i IN p.inventory 
    WHERE i.quantity > 10) AS inventoryData
WHERE
    inventoryData.inventoryCount >= 1
```

## EXISTS expression

Azure Cosmos DB for NoSQL's query engine supports ``EXISTS`` expressions. This expression is an aggregate scalar subquery built into the Azure Cosmos DB for NoSQL. ``EXISTS`` takes a subquery expression and returns ``true`` if the subquery returns any rows. Otherwise, it returns ``false``.

Because the query engine doesn't differentiate between boolean expressions and any other scalar expressions, you can use ``EXISTS`` in both ``SELECT`` and ``WHERE`` clauses. This behavior is unlike T-SQL, where a boolean expression is restricted to only filters.

If the ``EXISTS`` subquery returns a single value that's ``undefined``, ``EXISTS`` evaluates to false. For example, consider the following query that returns nothing.

```sql
SELECT VALUE
    undefined
```

If you use the ``EXISTS`` expression and the preceding query as a subquery, the expression returns ``false``.

```sql
SELECT
    EXISTS (SELECT VALUE undefined)
```

```json
[
  {
    "$1": false
  }
]
```

If the VALUE keyword in the preceding subquery is omitted, the subquery evaluates to an array with a single empty object.

```sql
SELECT
    undefined
```

```json
[
  {}
]
```

At that point, the ``EXISTS`` expression evaluates to ``true`` since the object (``{}``) technically exits.

```sql
SELECT 
    EXISTS (SELECT undefined) 
```

```json
[
  {
    "$1": true
  }
]
```

A common use case of ``ARRAY_CONTAINS`` is to filter an item by the existence of an item in an array. In this case, we're checking to see if the ``tags`` array contains an item named **"outerwear."**

```sql
SELECT
    p.name,
    p.tags
FROM
    products p
WHERE
    ARRAY_CONTAINS(p.tags, "outerwear")
```

The same query can use ``EXISTS`` as an alternative option.

```sql
SELECT
    p.name,
    p.tags
FROM
    products p
WHERE
    EXISTS (SELECT VALUE t FROM t IN p.tags WHERE t = "outerwear")
```

Additionally, ``ARRAY_CONTAINS`` can only check if a value is equal to any element within an array. If you need more complex filters on array properties, use ``JOIN`` instead.

Consider this example item in a set with multiple items each containing an ``accessories`` array.

```json
{
  "name": "Unobtani road bike",
  "accessories": [
    {
      "name": "Front/rear tire",
      "type": "tire",
      "quantityOnHand": 5
    },
    {
      "name": "9-speed chain",
      "type": "chains",
      "quantityOnHand": 25
    },
    {
      "name": "Clip-in pedals",
      "type": "pedals",
      "quantityOnHand": 15
    }
  ]
}
```

Now, consider the following query that filters based on the ``type`` and ``quantityOnHand`` properties in the array within each item.

```sql
SELECT
    p.name,
    a.name AS accessoryName
FROM
    products p
JOIN
    a IN p.accessories
WHERE
    a.type = "chains" AND
    a.quantityOnHand >= 10
```

```json
[
  {
    "name": "Unobtani road bike",
    "accessoryName": "9-speed chain"
  }
]
```

For each of the items in the collection, a cross-product is performed with its array elements. This ``JOIN`` operation makes it possible to filter on properties within the array. However, this query's RU consumption is significant. For instance, if **1,000** items had **100** items in each array, it expands to ``1,000 x 100`` (that is, **100,000**) tuples.

Using ``EXISTS`` can help to avoid this expensive cross-product. In this next example, the query filters on array elements within the ``EXISTS`` subquery. If an array element matches the filter, then you project it and ``EXISTS`` evaluates to true.

```sql
SELECT VALUE
    p.name
FROM
    products p
WHERE
    EXISTS (SELECT VALUE 
        a 
    FROM 
        a IN p.accessories
    WHERE
        a.type = "chains" AND
        a.quantityOnHand >= 10)
```

```json
[
  "Unobtani road bike"
]
```

Queries can also alias ``EXISTS`` and reference the alias in the projection:

```sql
SELECT
    p.name,
    EXISTS (SELECT VALUE
        a 
    FROM 
        a IN p.accessories
    WHERE
        a.type = "chains" AND
        a.quantityOnHand >= 10) AS chainAccessoryAvailable
FROM
    products p
```

```json
[
  {
    "name": "Unobtani road bike",
    "chainAccessoryAvailable": true
  }
]
```

## ARRAY expression

You can use the ``ARRAY`` expression to project the results of a query as an array. You can use this expression only within the ``SELECT`` clause of the query.

For these examples, let's assume there's a container with at least this item.

```json
{
  "name": "Radimer mountain bike",
  "tags": [
    {
      "name": "road"
    },
    {
      "name": "bike"
    },
    {
      "name": "competitive"
    }
  ]
}
```

In this first example, the expression is used within the ``SELECT`` clause.

```sql
SELECT
    p.name,
    ARRAY (SELECT VALUE t.name FROM t in p.tags) AS tagNames
FROM
    products p
```

```json
[
  {
    "name": "Radimer mountain bike",
    "tagNames": [
      "road",
      "bike",
      "competitive"
    ]
  }
]
```

As with other subqueries, filters with the ``ARRAY`` expression are possible.

```sql
SELECT
    p.name,
    ARRAY (SELECT VALUE t.name FROM t in p.tags) AS tagNames,
    ARRAY (SELECT VALUE t.name FROM t in p.tags WHERE CONTAINS(t.name, "bike")) AS bikeTagNames
FROM
    products p
```

```json
[
  {
    "name": "Radimer mountain bike",
    "tagNames": [
      "road",
      "bike",
      "competitive"
    ],
    "bikeTagNames": [
      "bike"
    ]
  }
]
```

Array expressions can also come after the ``FROM`` clause in subqueries.

```sql
SELECT
    p.name,
    n.t.name AS nonBikeTagName
FROM
    products p
JOIN
    n IN (SELECT VALUE ARRAY(SELECT t FROM t in p.tags WHERE t.name NOT LIKE "%bike%"))
```

```json
[
  {
    "name": "Radimer mountain bike",
    "nonBikeTagName": "road"
  },
  {
    "name": "Radimer mountain bike",
    "nonBikeTagName": "competitive"
  }
]
```

## Next steps

- [``JOIN`` clause](join.md)
- [Constants](constants.md)
- [Keywords](keywords.md)
