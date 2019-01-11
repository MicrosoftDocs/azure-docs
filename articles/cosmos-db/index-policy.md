---
title: Azure Cosmos DB indexing policies
description:  Understand how indexing works in Azure Cosmos DB. Learn how to configure and change the indexing policy for automatic indexing and greater performance.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/10/2018
ms.author: mjbrown
---

# Indexing policy in Azure Cosmos DB

You can override the default indexing policy on an Azure Cosmos container by configuring the following parameters:

* **Include or exclude items and paths from the index**: You can exclude or include specific items in the index when you insert or replace the items within a container. You can also include or exclude specific paths/properties to be indexed across containers. Paths may include wildcard patterns, for example, *.

* **Configure index types**: In addition to range indexed paths, you can add other types of indexes such as spatial.

* **Configure index modes**: By using the indexing policy on a container, you can configure different indexing modes such as *Consistent* or *None*.

## Indexing modes 

Azure Cosmos DB supports two indexing modes that you can configure on an Azure Cosmos container. You can configure the following two indexing modes through the indexing policy: 

* **Consistent**: If an Azure Cosmos container’s policy is set to Consistent, the queries on a specific container follow the same consistency level as the one specified for point-reads (for example, strong, bounded-staleness, session, or eventual). 

  The index is updated synchronously as you update the items. For example, insert, replace, update, and delete operations on an item will result in the index update. Consistent indexing supports consistent queries at the cost of impacting the write throughput. The reduction in write throughput depends on the "paths included in indexing" and the "consistency level." Consistent indexing mode is designed for write quickly, and query immediately workloads.

* **None**: A container that has a None index mode has no index associated with it. This is commonly used if Azure Cosmos database is used as a key-value storage, and items are accessed only by their ID property.

  > [!NOTE]
  > Configuring the indexing mode as a None has the side effect of dropping any existing indexes. You should use this option if your access patterns require ID or self-link only.

Query consistency levels are maintained similar to the regular read operations. Azure Cosmos database returns an error if you query the container that has a None indexing mode. You can execute the queries as scans through the explicit **x-ms-documentdb-enable-scan** header in the REST API or the **EnableScanInQuery** request option by using the .NET SDK. Some query features, like ORDER BY are currently not supported with **EnableScanInQuery**, because they mandate a corresponding index.

## Modifying the indexing policy

In Azure Cosmos DB, you can update the indexing policy of a container at any time. A change in indexing policy on an Azure Cosmos container can lead to a change in the shape of the index. This change affects the paths that can be indexed, their precision and the consistency model of the index itself. A change in indexing policy effectively requires a transformation of the old index into a new index.

### Index transformations

All index transformations are performed online. The items indexed per the old policy are efficiently transformed per the new policy without affecting the write availability or the throughput  provisioned to the container. The consistency of read and write operations that are performed by using the REST API, SDKs, or from stored procedures and triggers is not affected during index transformation.

Changing indexing policy is an asynchronous operation, and the time to complete the operation depends on the number of items, throughput provisioned, and the size of items. While reindexing is in progress, your query may not return all matching results, if the queries happen to use the index that is being modified, and queries will not return any errors/failures. While reindexing is in progress, queries are eventually consistent regardless of the indexing mode configuration. After the index transformation is complete, you will continue to see consistent results. This applies to queries issued by the interfaces such as REST API, SDKs, or stored procedures and triggers. Index transformation is performed asynchronously in the background on the replicas by using the spare resources that are available for a specific replica.

All index transformations are made in place. Azure Cosmos DB does not maintain two copies of the index. So no additional disk space is required or consumed in your containers while index transformation occurs.

When you change the indexing policy, changes are applied to move from the old index to the new index are primarily based on the indexing mode configurations. Indexing mode configurations play a major role when compared to other properties such as included/excluded paths, index kinds, and precision.

If both old and new indexing policies use **Consistent** indexing, Azure Cosmos database performs an online index transformation. You can't apply another indexing policy change that has Consistent indexing mode while the transformation is in progress. When you move to None indexing mode, the index is dropped immediately. Moving to None is useful when you want to cancel an in-progress transformation and start fresh with a different indexing policy.

For index transformation to successfully complete, ensure that the container has the sufficient storage space. If the container reaches its storage quota, the index transformation is paused. Index transformation automatically resumes when storage space is available, for example, when you delete some items.

## Modifying the indexing policy - Examples

The following are the most common use cases where you update an indexing policy:

* If you want to have consistent results during normal operation but fall back to the **None** indexing mode during bulk data imports.

* If you want to start using indexing features on your current Azure Cosmos containers. For example, you can use geospatial querying, which requires the Spatial index kind, or ORDER BY/string range queries, which require the string range index kind.

* If you want to manually select the properties to be indexed and change them over time to adjust to your workloads.

* If you want to tune the indexing precision to improve the query performance or to reduce the consumed storage.

## Next steps

Read more about the indexing in the following articles:

* [Indexing Overview](index-overview.md)
* [Index types](index-types.md)
* [Index paths](index-paths.md)
* [How to manage indexing policy](how-to-manage-indexing-policy.md)
