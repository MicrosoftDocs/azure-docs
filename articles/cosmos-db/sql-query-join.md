---
title: SQL JOIN queries for Azure Cosmos DB
description: Learn how to JOIN multiple tables in Azure Cosmos DB to query the data
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/17/2019
ms.author: mjbrown

---
# Joins in Azure Cosmos DB

In a relational database, joins across tables are the logical corollary to designing normalized schemas. In contrast, the SQL API uses the denormalized data model of schema-free items, which is the logical equivalent of a *self-join*.

Inner joins result in a complete cross product of the sets participating in the join. The result of an N-way join is a set of N-element tuples, where each value in the tuple is associated with the aliased set participating in the join and can be accessed by referencing that alias in other clauses.

## Syntax

The language supports the syntax `<from_source1> JOIN <from_source2> JOIN ... JOIN <from_sourceN>`. This query returns a set of tuples with `N` values. Each tuple has values produced by iterating all container aliases over their respective sets. 

Let's look at the following FROM clause: `<from_source1> JOIN <from_source2> JOIN ... JOIN <from_sourceN>`  
  
 Let each source define `input_alias1, input_alias2, …, input_aliasN`. This FROM clause returns a set of N-tuples (tuple with N values). Each tuple has values produced by iterating all container aliases over their respective sets.  
  
**Example 1** - 2 sources  
  
- Let `<from_source1>` be container-scoped and represent set {A, B, C}.  
  
- Let `<from_source2>` be document-scoped referencing input_alias1 and represent sets:  
  
    {1, 2} for `input_alias1 = A,`  
  
    {3} for `input_alias1 = B,`  
  
    {4, 5} for `input_alias1 = C,`  
  
- The FROM clause `<from_source1> JOIN <from_source2>` will result in the following tuples:  
  
    (`input_alias1, input_alias2`):  
  
    `(A, 1), (A, 2), (B, 3), (C, 4), (C, 5)`  
  
**Example 2** - 3 sources  
  
- Let `<from_source1>` be container-scoped and represent set {A, B, C}.  
  
- Let `<from_source2>` be document-scoped referencing `input_alias1` and represent sets:  
  
    {1, 2} for `input_alias1 = A,`  
  
    {3} for `input_alias1 = B,`  
  
    {4, 5} for `input_alias1 = C,`  
  
- Let `<from_source3>` be document-scoped referencing `input_alias2` and represent sets:  
  
    {100, 200} for `input_alias2 = 1,`  
  
    {300} for `input_alias2 = 3,`  
  
- The FROM clause `<from_source1> JOIN <from_source2> JOIN <from_source3>` will result in the following tuples:  
  
    (input_alias1, input_alias2, input_alias3):  
  
    (A, 1, 100), (A, 1, 200), (B, 3, 300)  
  
  > [!NOTE]
  > Lack of tuples for other values of `input_alias1`, `input_alias2`, for which the `<from_source3>` did not return any values.  
  
**Example 3** - 3 sources  
  
- Let <from_source1> be container-scoped and represent set {A, B, C}.  
  
- Let `<from_source1>` be container-scoped and represent set {A, B, C}.  
  
- Let <from_source2> be document-scoped referencing input_alias1 and represent sets:  
  
    {1, 2} for `input_alias1 = A,`  
  
    {3} for `input_alias1 = B,`  
  
    {4, 5} for `input_alias1 = C,`  
  
- Let `<from_source3>` be scoped to `input_alias1` and represent sets:  
  
    {100, 200} for `input_alias2 = A,`  
  
    {300} for `input_alias2 = C,`  
  
- The FROM clause `<from_source1> JOIN <from_source2> JOIN <from_source3>` will result in the following tuples:  
  
    (`input_alias1, input_alias2, input_alias3`):  
  
    (A, 1, 100), (A, 1, 200), (A, 2, 100), (A, 2, 200),  (C, 4, 300) ,  (C, 5, 300)  
  
  > [!NOTE]
  > This resulted in cross product between `<from_source2>` and `<from_source3>` because both are scoped to the same `<from_source1>`.  This resulted in 4 (2x2) tuples having value A, 0 tuples having value B (1x0) and 2 (2x1) tuples having value C.  
  
## Examples

The following examples show how the JOIN clause works. Before you run these examples, upload the sample [family data](sql-query-getting-started.md#upload-sample-data). In the following example, the result is empty, since the cross product of each item from source and an empty set is empty:

```sql
    SELECT f.id
    FROM Families f
    JOIN f.NonExistent
```

The result is:

```json
    [{
    }]
```

In the following example, the join is a cross product between two JSON objects, the item root `id` and the `children` subroot. The fact that `children` is an array isn't effective in the join, because it deals with a single root that is the `children` array. The result contains only two results, because the cross product of each item with the array yields exactly only one item.

```sql
    SELECT f.id
    FROM Families f
    JOIN f.children
```

The results are:

```json
    [
      {
        "id": "AndersenFamily"
      },
      {
        "id": "WakefieldFamily"
      }
    ]
```

The following example shows a more conventional join:

```sql
    SELECT f.id
    FROM Families f
    JOIN c IN f.children
```

The results are:

```json
    [
      {
        "id": "AndersenFamily"
      },
      {
        "id": "WakefieldFamily"
      },
      {
        "id": "WakefieldFamily"
      }
    ]
```

The FROM source of the JOIN clause is an iterator. So, the flow in the preceding example is:  

1. Expand each child element `c` in the array.
2. Apply a cross product with the root of the item `f` with each child element `c` that the first step flattened.
3. Finally, project the root object `f` `id` property alone.

The first item, `AndersenFamily`, contains only one `children` element, so the result set contains only a single object. The second item, `WakefieldFamily`, contains two `children`, so the cross product produces two objects, one for each `children` element. The root fields in both these items are the same, just as you would expect in a cross product.

The real utility of the JOIN clause is to form tuples from the cross product in a shape that's otherwise difficult to project. The example below filters on the combination of a tuple that lets the user choose a condition satisfied by the tuples overall.

```sql
    SELECT 
        f.id AS familyName,
        c.givenName AS childGivenName,
        c.firstName AS childFirstName,
        p.givenName AS petName
    FROM Families f
    JOIN c IN f.children
    JOIN p IN c.pets
```

The results are:

```json
    [
      {
        "familyName": "AndersenFamily",
        "childFirstName": "Henriette Thaulow",
        "petName": "Fluffy"
      },
      {
        "familyName": "WakefieldFamily",
        "childGivenName": "Jesse",
        "petName": "Goofy"
      }, 
      {
       "familyName": "WakefieldFamily",
       "childGivenName": "Jesse",
       "petName": "Shadow"
      }
    ]
```

The following extension of the preceding example performs a double join. You could view the cross product as the following pseudo-code:

```
    for-each(Family f in Families)
    {
        for-each(Child c in f.children)
        {
            for-each(Pet p in c.pets)
            {
                return (Tuple(f.id AS familyName,
                  c.givenName AS childGivenName,
                  c.firstName AS childFirstName,
                  p.givenName AS petName));
            }
        }
    }
```

`AndersenFamily` has one child who has one pet, so the cross product yields one row (1\*1\*1) from this family. `WakefieldFamily` has two children, only one of whom has pets, but that child has two pets. The cross product for this family yields 1\*1\*2 = 2 rows.

In the next example, there is an additional filter on `pet`, which excludes all the tuples where the pet name is not `Shadow`. You can build tuples from arrays, filter on any of the elements of the tuple, and project any combination of the elements.

```sql
    SELECT 
        f.id AS familyName,
        c.givenName AS childGivenName,
        c.firstName AS childFirstName,
        p.givenName AS petName
    FROM Families f
    JOIN c IN f.children
    JOIN p IN c.pets
    WHERE p.givenName = "Shadow"
```

The results are:

```json
    [
      {
       "familyName": "WakefieldFamily",
       "childGivenName": "Jesse",
       "petName": "Shadow"
      }
    ]
```

## Next steps

- [Getting started](sql-query-getting-started.md)
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Subqueries](sql-query-subquery.md)