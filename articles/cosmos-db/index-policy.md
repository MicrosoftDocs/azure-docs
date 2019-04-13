---
title: Azure Cosmos DB indexing policies
description:  Learn how to configure and change the default indexing policy for automatic indexing and greater performance in Azure Cosmos DB.
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/08/2019
ms.author: thweiss
---

# Indexing policies in Azure Cosmos DB

In Azure Cosmos DB, every container has an indexing policy that dictates how the container's items should be indexed. The default indexing policy for newly created containers enforces range indexes for any string or number, and spatial indexes for any GeoJSON object of type Point. This allows you to get high query performance without having to think about indexing upfront.

In some situations, you may want to override this automatic behavior to better suit your requirements. You can customize a container's indexing policy by setting its indexing mode, and include or exclude property paths.

## Indexing mode

Azure Cosmos DB supports two indexing modes:

- **Consistent**: If a container's indexing policy is set to consistent, the index is updated synchronously as you create, update or delete items. This means that the consistency of your read queries will be the [consistency configured for the account](consistency-levels.md).

- **None**: If a container's indexing policy is set to none, indexing is effectively disabled on that container. This is commonly used when a container is used as a pure key-value store without the need for secondary indexes. It can also help speeding up bulk insert operations.

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

## Modifying the indexing policy

A container's indexing policy can be updated at any time [by using the Azure portal or one of the supported SDKs](how-to-manage-indexing-policy.md). An update to the indexing policy triggers a transformation from the old index to the new one, which is performed online and in place (so no additional storage space is consumed during the operation). The items indexed per the old policy are efficiently transformed per the new policy without affecting the write availability or the throughput provisioned on the container.

Index transformation is an asynchronous operation, and the time it takes to complete depends on the provisioned throughput, the number of items and their size. While re-indexing is in progress, queries may not return all matching results and will do so without returning any errors. This means that query results may not be consistent until the index transformation is completed.

If the new indexing policy's mode is set to consistent, no other indexing policy change can be applied while the index transformation is in progress. A running index transformation can be cancelled by setting the indexing policy's mode to none (which will immediately drop the index).

## Indexing policies and TTL

The [time-to-live (TTL) feature](time-to-live.md) requires indexing to be active on the container it is turned on. This means that:

- it is not possible to activate TTL on a container where the indexing mode is set to none,
- it is not possible to set the indexing mode to none on a container where TTL is activated.

For scenarios where no property path needs to be indexed but TTL is required, you can use an indexing policy with:

- an indexing mode set to `consistent`,
- no included path,
- `/*` as the only excluded path.

## Obsolete attributes

When working with indexing policies, you may encounter the following attributes that are now obsolete:

- `automatic` is a boolean defined at the root of an indexing policy. It is now ignored and can be set to `true` when the tool you are using requires it.
- `precision` is a number defined at the index level for included paths. It is now ignored and can be set to `-1` when the tool you are using requires it.

## Next steps

Read more about the indexing in the following articles:

- [Indexing Overview](index-overview.md)
- [How to manage indexing policy](how-to-manage-indexing-policy.md)
