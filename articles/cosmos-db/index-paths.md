---
title: Working with index paths in Azure Cosmos DB
description: Overview of index paths in Azure Cosmos DB
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 3/13/2019
ms.author: mjbrown

---

# Index paths in Azure Cosmos DB

By using index paths in Azure Cosmos DB, you can choose to include or exclude a specific path from indexing. Choosing specific paths offers improved write performance and lower index storage for scenarios in which you know the query patterns. Index paths start with the root (`/`) wildcard operator and typically end with the `?` wildcard operator. This pattern denotes that there are multiple possible values for the prefix. For example, to serve the query `SELECT * FROM Families F WHERE F.familyName = "Andersen"`, you must include an index path for `/familyName/?` in the container’s index policy.

Index paths can also use the `*` wildcard operator to specify the behavior for paths recursively under the prefix. For example, `/payload/*` can be used to exclude everything under the payload property from indexing.

## Common patterns for index paths

Here are the common patterns for specifying index paths:

| **Path** | **Description/use case** |
| ---------- | ------- |
| /          | Default path for collection. Recursive and applies to the entire document tree.|
| /prop/?    | Index path required to serve queries like the following (with Range types, respectively): |
|            | SELECT FROM collection c WHERE c.prop = "value" |
|            | SELECT FROM collection c WHERE c.prop > 5 |
|            | SELECT FROM collection c ORDER BY c.prop  |
| /prop/*    | Index path for all paths under the specified label. Works with the following queries |
|            | SELECT FROM collection c WHERE c.prop = "value" |
|            | SELECT FROM collection c WHERE c.prop.subprop > 5 |
|            | SELECT FROM collection c WHERE c.prop.subprop.nextprop = "value" |
|            | SELECT FROM collection c ORDER BY c.prop |
| /props/[]/?| Index path required to serve iteration and JOIN queries against arrays of scalars like ["a", "b", "c"]: |
|            | SELECT tag FROM tag IN collection.props WHERE tag = "value" |
|            | SELECT tag FROM collection c JOIN tag IN c.props WHERE tag > 5  |
| /props/[]/subprop/? | Index path required to serve iteration and JOIN queries against arrays of objects like [{subprop: "a"}, {subprop: "b"}]:|
|            | SELECT tag FROM tag IN collection.props WHERE tag.subprop = "value" |
|            | SELECT tag FROM collection c JOIN tag IN c.props WHERE tag.subprop = "value" |
| /prop/subprop/? | Index path required to serve queries (with Range types, respectively): |
|            | SELECT FROM collection c WHERE c.prop.subprop = "value" |
|            | SELECT FROM collection c WHERE c.prop.subprop > 5  |

When you set custom index paths, you're required to specify the default indexing rule for the entire item, denoted by the special path `/*`.

## Next steps

Learn more about indexing in Azure Cosmos DB in the following articles:

- [Overview of indexing](index-overview.md)
- [Indexing policies in Azure Cosmos DB](indexing-policies.md)
- [Index types in Azure Cosmos DB](index-types.md)
