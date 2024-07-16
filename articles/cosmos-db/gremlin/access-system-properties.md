---
title: Access system document properties
titleSuffix: Azure Cosmos DB for Apache Gremlin
description: Learn how to read and write system document properties using Azure Cosmos DB for Apache Gremlin.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mansha
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.topic: how-to
ms.date: 02/08/2024
---

# Access system document properties using Azure Cosmos DB for Apache Gremlin

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

Azure Cosmos DB for Gremlin has [system properties](/rest/api/cosmos-db/databases) such as `_ts`, `_self`, `_attachments`, `_rid`, and `_etag` on every item. Additionally, Gremlin engine adds `inVPartition` and `outVPartition` properties on edges. By default, these properties are available for traversal. However, it's possible to include specific properties, or all of them, in Gremlin traversal.

```gremlin
g.withStrategies(ProjectionStrategy.build().IncludeSystemProperties('_ts').create())
```

## E-Tag

This property is used for optimistic concurrency control. If an application needs to break an operation into separate traversals, use the eTag property to avoid data loss in concurrent writes.

```gremlin
g.withStrategies(ProjectionStrategy.build().IncludeSystemProperties('_etag').create()).V('1').has('_etag', '"00000100-0000-0800-0000-5d03edac0000"').property('test', '1')
```

## Time-to-live (TTL)

If a graph has document expiration enabled and documents have `ttl` property set on them, then this property is available in Gremlin traversal as a regular vertex or edge property. `ProjectionStrategy` isn't necessary to enable time-to-live property exposure.

- Use the following command to set time-to-live on a new vertex:

    ```gremlin
    g.addV(<ID>).property('ttl', <expirationTime>)
    ```

    For example, a vertex created with the following traversal is automatically deleted after *123 seconds*:

    ```gremlin
    g.addV('vertex-one').property('ttl', 123)
    ```

- Use the following command to set time-to-live on an existing vertex:

    ```gremlin
    g.V().hasId(<ID>).has('pk', <pk>).property('ttl', <expirationTime>)
    ```

- Applying the time-to-live property on vertices doesn't automatically apply it to associated edges. This behavior occurs because edges are independent records in the database store. Use the following command to set time-to-live on vertices and all the incoming and outgoing edges of the vertex:

    ```gremlin
    g.V().hasId(<ID>).has('pk', <pk>).as('v').bothE().hasNot('ttl').property('ttl', <expirationTime>)
    ```

> [!NOTE]
> You can set time to Live (TTL) on the container to `-1` or to **On (no default)** from the Azure portal. Then, the TTL is infinite for any item unless the item has a TTL value explicitly set.

## Next step

> [!div class="nextstepaction"]
> [Time to Live (TTL) in Azure Cosmos DB](../time-to-live.md)
