---
title: Access system document properties vian Azure Cosmos DB Graph
description: Learn how read and write Azure Cosmos DB system document properties via API for Gremlin
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 09/16/2021
author: manishmsfte
ms.author: mansha
---

# System document properties
[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

Azure Cosmos DB has [system properties](/rest/api/cosmos-db/databases) such as ```_ts```, ```_self```, ```_attachments```, ```_rid```, and ```_etag``` on every document. Additionally, Gremlin engine adds ```inVPartition``` and ```outVPartition``` properties on edges. By default, these properties are available for traversal. However, it's possible to include specific properties, or all of them, in Gremlin traversal.

```console
g.withStrategies(ProjectionStrategy.build().IncludeSystemProperties('_ts').create())
```

## E-Tag

This property is used for optimistic concurrency control. If application needs to break operation into a few separate traversals, it can use eTag property to avoid data loss in concurrent writes.

```console
g.withStrategies(ProjectionStrategy.build().IncludeSystemProperties('_etag').create()).V('1').has('_etag', '"00000100-0000-0800-0000-5d03edac0000"').property('test', '1')
```

## Time-to-live (TTL)

If collection has document expiration enabled and documents have `ttl` property set on them, then this property will be available in Gremlin traversal as a regular vertex or edge property. `ProjectionStrategy` isn't necessary to enable time-to-live property exposure.

* Use the following command to set time-to-live on a new vertex:

  ```console
  g.addV(<ID>).property('ttl', <expirationTime>)
  ```

  For example, a vertex created with the following traversal is automatically deleted after *123 seconds*:

  ```console
  g.addV('vertex-one').property('ttl', 123)
  ```

* Use the following command to set time-to-live on an existing vertex:

  ```console
  g.V().hasId(<ID>).has('pk', <pk>).property('ttl', <expirationTime>)
  ```

* Applying time-to-live property on vertices does not automatically apply it to edges. Because edges are independent records in the database store. Use the following command to set time-to-live on vertices and all the incoming and outgoing edges of the vertex:

  ```console
  g.V().hasId(<ID>).has('pk', <pk>).as('v').bothE().hasNot('ttl').property('ttl', <expirationTime>)
  ```

You can set TTL on the container to -1 or set it to **On (no default)** from Azure portal, then the TTL is infinite for any item unless the item has TTL value explicitly set.

## Next steps
* [Azure Cosmos DB Optimistic Concurrency](../faq.yml#how-does-the-api-for-nosql-provide-concurrency-)
* [Time to Live (TTL)](../time-to-live.md) in Azure Cosmos DB
