---
title: Azure Cosmos DB indexing policies
description:  Learn how to configure and change the default indexing policy for automatic indexing and greater performance in Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/09/2020
ms.author: tisande
---

# Indexing policies in Azure Cosmos DB

In Azure Cosmos DB, every container has an indexing policy that dictates how the container's items should be indexed. The default indexing policy for newly created containers indexes every property of every item, enforcing range indexes for any string or number, and spatial indexes for any GeoJSON object of type Point. This allows you to get high query performance without having to think about indexing and index management upfront.

In some situations, you may want to override this automatic behavior to better suit your requirements. You can customize a container's indexing policy by setting its *indexing mode*, and include or exclude *property paths*.

> [!NOTE]
> The method of updating indexing policies described in this article only applies to Azure Cosmos DB's SQL (Core) API.

## Indexing mode

Azure Cosmos DB supports two indexing modes:

- **Consistent**: The index is updated synchronously as you create, update or delete items. This means that the consistency of your read queries will be the [consistency configured for the account](consistency-levels.md).
- **None**: Indexing is disabled on the container. This is commonly used when a container is used as a pure key-value store without the need for secondary indexes. It can also be used to improve the performance of bulk operations. After the bulk operations are complete, the index mode can be set to Consistent and then monitored using the [IndexTransformationProgress](how-to-manage-indexing-policy.md#dotnet-sdk) until complete.

> [!NOTE]
> Azure Cosmos DB also supports a Lazy indexing mode. Lazy indexing performs updates to the index at a much lower priority level when the engine is not doing any other work. This can result in **inconsistent or incomplete** query results. If you plan to query a Cosmos container, you should not select lazy indexing. In June 2020, we introduced a change that no longer allows new containers to be set to Lazy indexing mode. If your Azure Cosmos DB account already contains at least one container with lazy indexing, this account is automatically exempt from the change. You can also request an exemption by contacting [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

By default, indexing policy is set to `automatic`. It's achieved by setting the `automatic` property in the indexing policy to `true`. Setting this property to `true` allows Azure CosmosDB to automatically index documents as they are written.

## <a id="include-exclude-paths"></a> Including and excluding property paths

A custom indexing policy can specify property paths that are explicitly included or excluded from indexing. By optimizing the number of paths that are indexed, you can lower the amount of storage used by your container and improve the latency of write operations. These paths are defined following [the method described in the indexing overview section](index-overview.md#from-trees-to-property-paths) with the following additions:

- a path leading to a scalar value (string or number) ends with `/?`
- elements from an array are addressed together through the `/[]` notation (instead of `/0`, `/1` etc.)
- the `/*` wildcard can be used to match any elements below the node

Taking the same example again:

```
    {
        "locations": [
            { "country": "Germany", "city": "Berlin" },
            { "country": "France", "city": "Paris" }
        ],
        "headquarters": { "country": "Belgium", "employees": 250 }
        "exports": [
            { "city": "Moscow" },
            { "city": "Athens" }
        ]
    }
```

- the `headquarters`'s `employees` path is `/headquarters/employees/?`

- the `locations`' `country` path is `/locations/[]/country/?`

- the path to anything under `headquarters` is `/headquarters/*`

For example, we could include the `/headquarters/employees/?` path. This path would ensure that we index the employees property but would not index additional nested JSON within this property.

## Include/exclude strategy

Any indexing policy has to include the root path `/*` as either an included or an excluded path.

- Include the root path to selectively exclude paths that don't need to be indexed. This is the recommended approach as it lets Azure Cosmos DB proactively index any new property that may be added to your model.
- Exclude the root path to selectively include paths that need to be indexed.

- For paths with regular characters that include: alphanumeric characters and _ (underscore), you don't have to escape the path string around double quotes (for example, "/path/?"). For paths with other special characters, you need to escape the path string around double quotes (for example, "/\"path-abc\"/?"). If you expect special characters in your path, you can escape every path for safety. Functionally it doesn't make any difference if you escape every path Vs just the ones that have special characters.

- The system property `_etag` is excluded from indexing by default, unless the etag is added to the included path for indexing.

- If the indexing mode is set to **consistent**, the system properties `id` and `_ts` are automatically indexed.

When including and excluding paths, you may encounter the following attributes:

- `kind` can be either `range` or `hash`. Range index functionality provides all of the functionality of a hash index, so we recommend using a range index.

- `precision` is a number defined at the index level for included paths. A value of `-1` indicates maximum precision. We recommend always setting this value to `-1`.

- `dataType` can be either `String` or `Number`. This indicates the types of JSON properties which will be indexed.

When not specified, these properties will have the following default values:

| **Property Name**     | **Default Value** |
| ----------------------- | -------------------------------- |
| `kind`   | `range` |
| `precision`   | `-1`  |
| `dataType`    | `String` and `Number` |

See [this section](how-to-manage-indexing-policy.md#indexing-policy-examples) for indexing policy examples for including and excluding paths.

## Include/exclude precedence

If your included paths and excluded paths have a conflict, the more precise path takes precedence.

Here's an example:

**Included Path**: `/food/ingredients/nutrition/*`

**Excluded Path**: `/food/ingredients/*`

In this case, the included path takes precedence over the excluded path because it is more precise. Based on these paths, any data in the `food/ingredients` path or nested within would be excluded from the index. The exception would be data within the included path: `/food/ingredients/nutrition/*`, which would be indexed.

Here are some rules for included and excluded paths precedence in Azure Cosmos DB:

- Deeper paths are more precise than narrower paths. for example: `/a/b/?` is more precise than `/a/?`.

- The `/?` is more precise than `/*`. For example `/a/?` is more precise than `/a/*` so `/a/?` takes precedence.

- The path `/*` must be either an included path or excluded path.

## Spatial indexes

When you define a spatial path in the indexing policy, you should define which index ```type``` should be applied to that path. Possible types for spatial indexes include:

* Point

* Polygon

* MultiPolygon

* LineString

Azure Cosmos DB, by default, will not create any spatial indexes. If you would like to use spatial SQL built-in functions, you should create a spatial index on the required properties. See [this section](geospatial.md) for indexing policy examples for adding spatial indexes.

## Composite indexes

Queries that have an `ORDER BY` clause with two or more properties require a composite index. You can also define a composite index to improve the performance of many equality and range queries. By default, no composite indexes are defined so you should [add composite indexes](how-to-manage-indexing-policy.md#composite-indexing-policy-examples) as needed.

Unlike with included or excluded paths, you can't create a path with the `/*` wildcard. Every composite path has an implicit `/?` at the end of the path that you don't need to specify. Composite paths lead to a scalar value and this is the only value that is included in the composite index.

When defining a composite index, you specify:

- Two or more property paths. The sequence in which property paths are defined matters.

- The order (ascending or descending).

> [!NOTE]
> When you add a composite index, the query will utilize existing range indexes until the new composite index addition is complete. Therefore, when you add a composite index, you may not immediately observe performance improvements. It is possible to track the progress of index transformation [by using one of the SDKs](how-to-manage-indexing-policy.md).

### ORDER BY queries on multiple properties:

The following considerations are used when using composite indexes for queries with an `ORDER BY` clause with two or more properties:

- If the composite index paths do not match the sequence of the properties in the `ORDER BY` clause, then the composite index can't support the query.

- The order of composite index paths (ascending or descending) should also match the `order` in the `ORDER BY` clause.

- The composite index also supports an `ORDER BY` clause with the opposite order on all paths.

Consider the following example where a composite index is defined on properties name, age, and _ts:

| **Composite Index**     | **Sample `ORDER BY` Query**      | **Supported by Composite Index?** |
| ----------------------- | -------------------------------- | -------------- |
| ```(name ASC, age ASC)```   | ```SELECT * FROM c ORDER BY c.name ASC, c.age asc``` | ```Yes```            |
| ```(name ASC, age ASC)```   | ```SELECT * FROM c ORDER BY c.age ASC, c.name asc```   | ```No```             |
| ```(name ASC, age ASC)```    | ```SELECT * FROM c ORDER BY c.name DESC, c.age DESC``` | ```Yes```            |
| ```(name ASC, age ASC)```     | ```SELECT * FROM c ORDER BY c.name ASC, c.age DESC``` | ```No```             |
| ```(name ASC, age ASC, timestamp ASC)``` | ```SELECT * FROM c ORDER BY c.name ASC, c.age ASC, timestamp ASC``` | ```Yes```            |
| ```(name ASC, age ASC, timestamp ASC)``` | ```SELECT * FROM c ORDER BY c.name ASC, c.age ASC``` | ```No```            |

You should customize your indexing policy so you can serve all necessary `ORDER BY` queries.

### Queries with filters on multiple properties

If a query has filters on two or more properties, it may be helpful to create a composite index for these properties.

For example, consider the following query which has an equality filter on two properties:

```sql
SELECT * FROM c WHERE c.name = "John" AND c.age = 18
```

This query will be more efficient, taking less time and consuming fewer RU's, if it is able to leverage a composite index on (name ASC, age ASC).

Queries with range filters can also be optimized with a composite index. However, the query can only have a single range filter. Range filters include `>`, `<`, `<=`, `>=`, and `!=`. The range filter should be defined last in the composite index.

Consider the following query with both equality and range filters:

```sql
SELECT * FROM c WHERE c.name = "John" AND c.age > 18
```

This query will be more efficient with a composite index on (name ASC, age ASC). However, the query would not utilize a composite index on (age ASC, name ASC) because the equality filters must be defined first in the composite index.

The following considerations are used when creating composite indexes for queries with filters on multiple properties

- The properties in the query's filter should match those in composite index. If a property is in the composite index but is not included in the query as a filter, the query will not utilize the composite index.
- If a query has additional properties in the filter that were not defined in a composite index, then a combination of composite and range indexes will be used to evaluate the query. This will require fewer RU's than exclusively using range indexes.
- If a property has a range filter (`>`, `<`, `<=`, `>=`, or `!=`), then this property should be defined last in the composite index. If a query has more than one range filter, it will not utilize the composite index.
- When creating a composite index to optimize queries with multiple filters, the `ORDER` of the composite index will have no impact on the results. This property is optional.
- If you do not define a composite index for a query with filters on multiple properties, the query will still succeed. However, the RU cost of the query can be reduced with a composite index.

Consider the following examples where a composite index is defined on properties name, age, and timestamp:

| **Composite Index**     | **Sample Query**      | **Supported by Composite Index?** |
| ----------------------- | -------------------------------- | -------------- |
| ```(name ASC, age ASC)```   | ```SELECT * FROM c WHERE c.name = "John" AND c.age = 18``` | ```Yes```            |
| ```(name ASC, age ASC)```   | ```SELECT * FROM c WHERE c.name = "John" AND c.age > 18```   | ```Yes```             |
| ```(name DESC, age ASC)```    | ```SELECT * FROM c WHERE c.name = "John" AND c.age > 18``` | ```Yes```            |
| ```(name ASC, age ASC)```     | ```SELECT * FROM c WHERE c.name != "John" AND c.age > 18``` | ```No```             |
| ```(name ASC, age ASC, timestamp ASC)``` | ```SELECT * FROM c WHERE c.name = "John" AND c.age = 18 AND c.timestamp > 123049923``` | ```Yes```            |
| ```(name ASC, age ASC, timestamp ASC)``` | ```SELECT * FROM c WHERE c.name = "John" AND c.age < 18 AND c.timestamp = 123049923``` | ```No```            |

### Queries with a filter as well as an ORDER BY clause

If a query filters on one or more properties and has different properties in the ORDER BY clause, it may be helpful to add the properties in the filter to the `ORDER BY` clause.

For example, by adding the properties in the filter to the ORDER BY clause, the following query could be rewritten to leverage a composite index:

Query using range index:

```sql
SELECT * FROM c WHERE c.name = "John" ORDER BY c.timestamp
```

Query using composite index:

```sql
SELECT * FROM c WHERE c.name = "John" ORDER BY c.name, c.timestamp
```

The same pattern and query optimizations can be generalized for queries with multiple equality filters:

Query using range index:

```sql
SELECT * FROM c WHERE c.name = "John", c.age = 18 ORDER BY c.timestamp
```

Query using composite index:

```sql
SELECT * FROM c WHERE c.name = "John", c.age = 18 ORDER BY c.name, c.age, c.timestamp
```

The following considerations are used when creating composite indexes to optimize a query with a filter and `ORDER BY` clause:

* If the query filters on properties, these should be included first in the `ORDER BY` clause.
* If you do not define a composite index on a query with a filter on one property and a separate `ORDER BY` clause using a different property, the query will still succeed. However, the RU cost of the query can be reduced with a composite index, particularly if the property in the `ORDER BY` clause has a high cardinality.
* All considerations for creating composite indexes for `ORDER BY` queries with multiple properties as well as queries with filters on multiple properties still apply.


| **Composite Index**                      | **Sample `ORDER BY` Query**                                  | **Supported by Composite Index?** |
| ---------------------------------------- | ------------------------------------------------------------ | --------------------------------- |
| ```(name ASC, timestamp ASC)```          | ```SELECT * FROM c WHERE c.name = "John" ORDER BY c.name ASC, c.timestamp ASC``` | `Yes` |
| ```(name ASC, timestamp ASC)```          | ```SELECT * FROM c WHERE c.name = "John" ORDER BY c.timestamp ASC, c.name ASC``` | `No`  |
| ```(name ASC, timestamp ASC)```          | ```SELECT * FROM c WHERE c.name = "John" ORDER BY c.timestamp ASC``` | ```No```   |
| ```(age ASC, name ASC, timestamp ASC)``` | ```SELECT * FROM c WHERE c.age = 18 and c.name = "John" ORDER BY c.age ASC, c.name ASC,c.timestamp ASC``` | `Yes` |
| ```(age ASC, name ASC, timestamp ASC)``` | ```SELECT * FROM c WHERE c.age = 18 and c.name = "John" ORDER BY c.timestamp ASC``` | `No` |

## Modifying the indexing policy

A container's indexing policy can be updated at any time [by using the Azure portal or one of the supported SDKs](how-to-manage-indexing-policy.md). An update to the indexing policy triggers a transformation from the old index to the new one, which is performed online and in place (so no additional storage space is consumed during the operation). The old policy's index is efficiently transformed to the new policy without affecting the write availability or the throughput provisioned on the container. Index transformation is an asynchronous operation, and the time it takes to complete depends on the provisioned throughput, the number of items and their size.

> [!NOTE]
> While adding a range or spatial index, queries may not return all the matching results, and will do so without returning any errors. This means that query results may not be consistent until the index transformation is completed. It is possible to track the progress of index transformation [by using one of the SDKs](how-to-manage-indexing-policy.md).

If the new indexing policy's mode is set to Consistent, no other indexing policy change can be applied while the index transformation is in progress. A running index transformation can be canceled by setting the indexing policy's mode to None (which will immediately drop the index).

## Indexing policies and TTL

The [Time-to-Live (TTL) feature](time-to-live.md) requires indexing to be active on the container it is turned on. This means that:

- it is not possible to activate TTL on a container where the indexing mode is set to None,
- it is not possible to set the indexing mode to None on a container where TTL is activated.

For scenarios where no property path needs to be indexed, but TTL is required, you can use an indexing policy with:

- an indexing mode set to Consistent, and
- no included path, and
- `/*` as the only excluded path.

## Next steps

Read more about the indexing in the following articles:

- [Indexing overview](index-overview.md)
- [How to manage indexing policy](how-to-manage-indexing-policy.md)
