---
title: Azure Cosmos DB indexing policies | Microsoft Docs
description:  Understand how indexing works in Azure Cosmos DB. Learn how to configure and change the indexing policy for automatic indexing and greater performance.
keywords: indexing, azure cosmos db, azure, Microsoft azure
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/10/2018
ms.author: mjbrown
---

# Indexing policy

You can override the default indexing policy on a Cosmos container by configuring the following parameters:

- **Include or exclude items and paths to and from the index**: You can exclude or include specific items in the index when you insert or replace the items in the container. You can also include or exclude specific properties, also called *paths*, to be indexed across containers that are included in an index. Paths may include wildcard patterns, e.g., *.
- **Configure various index types**: In addition to range indexed paths, you can add other types of indexes such as spatial.
- **Configure index update modes**: You can configure the indexing modes, e.g., *Consistent* or *None* via the indexing policy on a container.

## Container indexing modes

Cosmos DB supports two indexing modes that you can configure via the indexing policy on an Cosmos DB container: *Consistent* and *None*.

- **Consistent**: If a Cosmos DB container’s policy is Consistent, the queries on a specific container follow the same consistency level as specified for the point-reads (e.g., strong, bounded-staleness, session, or eventual). The index is updated synchronously as part of the items update (e.g., insert, replace, update, and delete an item in a Cosmos DB container). Consistent indexing supports consistent queries at the cost of impacting write throughput. The reduction in write throughput is a function of the included paths that need to be indexed and the "consistency level." Consistent indexing mode is designed for "write quickly, query immediately" workloads.
- **None**: A container that has a None index mode has no index associated with it. This is commonly used if Cosmos DB is used as a key-value storage, and items are accessed only by their ID property.

> [!Note:]
> Configuring the indexing policy as a None index mode has the side effect of dropping any existing index. Use this if your access patterns require only ID or self-link.

Query consistency levels are maintained similar to regular read operations.

Cosmos DB returns an error for queries made on container that has a None indexing mode. Queries can still be executed as scans via the explicit **x-ms-documentdb-enable-scan** header in the REST API or the **EnableScanInQuery** request option by using the .NET SDK. Some query features, like ORDER BY are currently not supported as scans with **EnableScanInQuery**, as they mandate a corresponding index.

## Modifying the indexing policy

In Cosmos DB, you can make changes to the indexing policy of a container at any time. A change in indexing policy on a Cosmos DB container can lead to a change in the shape of the index. The change affects the paths that can be indexed, their precision and the consistency model of the index itself. A change in indexing policy effectively requires a transformation of the old index into a new index.

### Online index transformations

All index transformations are performed online. The items indexed per the old policy are efficiently transformed per the new policy *without affecting the write availability or the provisioned throughput* of the container. The consistency of read and write operations made by using the REST API, SDKs or from stored procedures and triggers is not affected during index transformation.

Changing indexing policy is an asynchronous operation, and the time to complete the operation depends on the number of items, provisioned RUs and size of items. While re-indexing is in progress, your query may not return all matching results, if the query happen to use the index that is being modified, and queries will not return any errors/failures. While re-indexing is in progress, queries are eventually consistent regardless of the indexing mode configuration. After the index transformation is complete, you will continue to see consistent results. This applies to queries issued via any of these interfaces - REST API, SDKs or stored procedures and triggers. Index transformation is performed asynchronously in the background on the replicas by using the spare resources that are available for a specific replica.

All index transformations are also made in place. Cosmos DB does not maintain two copies of the index and swap out the old index with the new one. This means that no additional disk space is required or consumed in your containers while index transformations occur.

When you change indexing policy, changes are applied to move from the old index to the new index are primarily based on the indexing mode configurations. Indexing mode configurations play a larger role than other values like included/excluded paths, index kinds, and precision.

If your old and new policies both use *Consistent* indexing, Azure Cosmos DB performs an online index transformation. You can't apply another indexing policy change that has Consistent indexing mode while the transformation is in progress. When you move to None, the index is dropped immediately. Moving to None is useful when you want to cancel an in-progress transformation and start fresh with a different indexing policy.

For index transformation to successfully finish, ensure that there is sufficient free storage space available on the collection. If the container reaches its storage quota, the index transformation is paused. Index transformation automatically resumes when storage space is available, for example, if you delete some items.

### When should you make changes to indexing policy

The following are the most common use cases:

- Serve consistent results during normal operation but fall back to None indexing mode during bulk data imports.
- Start using indexing features on your current Cosmos DB containers. For example, you can use geospatial querying, which requires the Spatial index kind, or ORDER BY/string range queries, which require the string Range index kind.
- Hand-select the properties to be indexed and change them over time to adjust to your workloads.
- Tune indexing precision to improve query performance or to reduce storage consumed.

## Next steps

Read more about the indexing in the following articles:

- [Indexing Overview](indexing-overview.md)
- [Index types](index-types.md)
- [Index paths](index-paths.md)
- [Indexing examples](indexing-examples.md)
- [How to manage indexing policy](how-to-manage-indexing-policy.md)