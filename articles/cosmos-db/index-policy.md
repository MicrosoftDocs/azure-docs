---
title: Azure Cosmos DB indexing policies
description:  Learn how to configure and change the default indexing policy for automatic indexing and greater performance in Azure Cosmos DB.
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/14/2019
ms.author: thweiss
---

# Indexing policies in Azure Cosmos DB

In Azure Cosmos DB, every container has an indexing policy that dictates how the container's items should be indexed. The default indexing policy for newly created containers indexes every property of every item, enforcing range indexes for any string or number, and spatial indexes for any GeoJSON object of type Point. This allows you to get high query performance without having to think about indexing and index management upfront.

In some situations, you may want to override this automatic behavior to better suit your requirements. You can customize a container's indexing policy by setting its *indexing mode*, and include or exclude *property paths*.

> [!NOTE]
> The method of updating indexing policies described in this article only applies to Azure Cosmos DB's SQL (Core) API.

## Indexing mode

Azure Cosmos DB supports two indexing modes:

- **Consistent**: If a container's indexing policy is set to Consistent, the index is updated synchronously as you create, update or delete items. This means that the consistency of your read queries will be the [consistency configured for the account](consistency-levels.md).

- **None**: If a container's indexing policy is set to None, indexing is effectively disabled on that container. This is commonly used when a container is used as a pure key-value store without the need for secondary indexes. It can also help speeding up bulk insert operations.

## Including and excluding property paths

A custom indexing policy can specify property paths that are explicitly included or excluded from indexing. By optimizing the number of paths that are indexed, you can lower the amount of storage used by your container and improve the latency of write operations. These paths are defined following [the method described in the indexing overview section](index-overview.md#from-trees-to-property-paths) with the following additions:

- a path leading to a scalar value (string or number) ends with `/?`
- elements from an array are addressed together through the `/[]` notation (instead of `/0`, `/1` etc.)
- the `/*` wildcard can be used to match any elements below the node

Taking the same example again:

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

- the `headquarters`'s `employees` path is `/headquarters/employees/?`
- the `locations`' `country` path is `/locations/[]/country/?`
- the path to anything under `headquarters` is `/headquarters/*`

When a path is explicitly included in the indexing policy, it also has to define which index types should be applied to that path and for each index type, the data type this index applies to:

| Index type | Allowed target data types |
| --- | --- |
| Range | String or Number |
| Spatial | Point, LineString or Polygon |

For example, we could include the `/headquarters/employees/?` path and specify that a `Range` index should be applied on that path for both `String` and `Number` values.

### Include/exclude strategy

Any indexing policy has to include the root path `/*` as either an included or an excluded path.

- Include the root path to selectively exclude paths that don't need to be indexed. This is the recommended approach as it lets Azure Cosmos DB proactively index any new property that may be added to your model.
- Exclude the root path to selectively include paths that need to be indexed.

- For paths with regular characters that include: alphanumeric characters and _ (underscore), you don’t have to escape the path string around double quotes (for example, "/path/?"). For paths with other special characters, you need to escape the path string around double quotes (for example, "/\"path-abc\"/?"). If you expect special characters in your path, you can escape every path for safety. Functionally it doesn’t make any difference if you escape every path Vs just the ones that have special characters.

- The system property "etag" is excluded from indexing by default, unless the etag is added to the included path for indexing.

See [this section](how-to-manage-indexing-policy.md#indexing-policy-examples) for indexing policy examples.

## Composite indexes

Queries that `ORDER BY` two or more properties require a composite index. Currently, composite indexes are only utilized by Multi `ORDER BY` queries. By default, no composite indexes are defined so you should [add composite indexes](how-to-manage-indexing-policy.md#composite-indexing-policy-examples) as needed.

When defining a composite index, you specify:

- Two or more property paths. The sequence in which property paths are defined matters.
- The order (ascending or descending).

The following considerations are used when using composite indexes:

- If the composite index paths do not match the sequence of the properties in the ORDER BY clause, then the composite index can't support the query

- The order of composite index paths (ascending or descending) should also match the order in the ORDER BY clause.

- The composite index also supports an ORDER BY clause with the opposite order on all paths.

Consider the following example where a composite index is defined on properties a, b, and c:

| **Composite Index**     | **Sample `ORDER BY` Query**      | **Supported by Index?** |
| ----------------------- | -------------------------------- | -------------- |
| ```(a asc, b asc)```         | ```ORDER BY  a asc, b asc```        | ```Yes```            |
| ```(a asc, b asc)```          | ```ORDER BY  b asc, a asc```        | ```No```             |
| ```(a asc, b asc)```          | ```ORDER BY  a desc, b desc```      | ```Yes```            |
| ```(a asc, b asc)```          | ```ORDER BY  a asc, b desc```       | ```No```             |
| ```(a asc, b asc, c asc)``` | ```ORDER BY  a asc, b asc, c asc``` | ```Yes```            |
| ```(a asc, b asc, c asc)``` | ```ORDER BY  a asc, b asc```        | ```No```            |

You should customize your indexing policy so you can serve all necessary `ORDER BY` queries.

## Modifying the indexing policy

A container's indexing policy can be updated at any time [by using the Azure portal or one of the supported SDKs](how-to-manage-indexing-policy.md). An update to the indexing policy triggers a transformation from the old index to the new one, which is performed online and in place (so no additional storage space is consumed during the operation). The old policy's index is efficiently transformed to the new policy without affecting the write availability or the throughput provisioned on the container. Index transformation is an asynchronous operation, and the time it takes to complete depends on the provisioned throughput, the number of items and their size. 

> [!NOTE]
> While re-indexing is in progress, queries may not return all the matching results, and will do so without returning any errors. This means that query results may not be consistent until the index transformation is completed. It is possible to track the progress of index transformation [by using one of the SDKs](how-to-manage-indexing-policy.md).

If the new indexing policy's mode is set to Consistent, no other indexing policy change can be applied while the index transformation is in progress. A running index transformation can be canceled by setting the indexing policy's mode to None (which will immediately drop the index).

## Indexing policies and TTL

The [Time-to-Live (TTL) feature](time-to-live.md) requires indexing to be active on the container it is turned on. This means that:

- it is not possible to activate TTL on a container where the indexing mode is set to None,
- it is not possible to set the indexing mode to None on a container where TTL is activated.

For scenarios where no property path needs to be indexed, but TTL is required, you can use an indexing policy with:

- an indexing mode set to Consistent, and
- no included path, and
- `/*` as the only excluded path.

## Obsolete attributes

When working with indexing policies, you may encounter the following attributes that are now obsolete:

- `automatic` is a boolean defined at the root of an indexing policy. It is now ignored and can be set to `true`, when the tool you are using requires it.
- `precision` is a number defined at the index level for included paths. It is now ignored and can be set to `-1`, when the tool you are using requires it.
- `hash` is an index kind that is now replaced by the range kind.

## Next steps

Read more about the indexing in the following articles:

- [Indexing overview](index-overview.md)
- [How to manage indexing policy](how-to-manage-indexing-policy.md)
