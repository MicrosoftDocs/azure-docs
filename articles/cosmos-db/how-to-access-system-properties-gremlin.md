---
title: Access system document properties via Azure Cosmos DB Graph
description: Learn how read and write Cosmos DB system document properties via Gremlin API
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: how-to
ms.date: 09/10/2019
author: luisbosquez
ms.author: lbosq
---

# System document properties

Azure Cosmos DB has [system properties](/rest/api/cosmos-db/databases) such as ```_ts```, ```_self```, ```_attachments```, ```_rid```, and ```_etag``` on every document. Additionally, Gremlin engine adds ```inVPartition``` and ```outVPartition``` properties on edges. By default, these properties are available for traversal. However, it's possible to include specific properties, or all of them, in Gremlin traversal.

```
g.withStrategies(ProjectionStrategy.build().IncludeSystemProperties('_ts').create())
```

## E-Tag

This property is used for optimistic concurrency control. If application needs to break operation into a few separate traversals, it can use eTag property to avoid data loss in concurrent writes.

```
g.withStrategies(ProjectionStrategy.build().IncludeSystemProperties('_etag').create()).V('1').has('_etag', '"00000100-0000-0800-0000-5d03edac0000"').property('test', '1')
```

## Time-to-live (TTL)

If collection has document expiration enabled and documents have ```ttl``` property set on them, then this property will be available in Gremlin traversal as a regular vertex or edge property. ```ProjectionStrategy``` isn't necessary to enable time-to-live property exposure.

Vertex created with the traversal below will be automatically deleted in **123 seconds**.

```
g.addV('vertex-one').property('ttl', 123)
```

## Next steps
* [Cosmos DB Optimistic Concurrency](faq.md#how-does-the-sql-api-provide-concurrency)
* [Time to Live (TTL)](time-to-live.md) in Azure Cosmos DB
