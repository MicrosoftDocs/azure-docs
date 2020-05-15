---
title: Conflict resolution types and resolution policies in Azure Cosmos DB 
description: This article describes the conflict categories and conflict resolution policies in Azure Cosmos DB.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/20/2020
ms.author: mjbrown
ms.reviewer: sngun
---

# Conflict types and resolution policies

Conflicts and conflict resolution policies are applicable if your Azure Cosmos DB account is configured with multiple write regions.

For Azure Cosmos accounts configured with multiple write regions, update conflicts can occur when writers concurrently update the same item in multiple regions. Update conflicts can be of the following three types:

* **Insert conflicts**: These conflicts can occur when an application simultaneously inserts two or more items with the same unique index in two or more regions. For example, this conflict might occur with an ID property.

* **Replace conflicts**: These conflicts can occur when an application updates the same item simultaneously in two or more regions.

* **Delete conflicts**: These conflicts can occur when an application simultaneously deletes an item in one region and updates it in another region.

## Conflict resolution policies

Azure Cosmos DB offers a flexible policy-driven mechanism to resolve write conflicts. You can select from two conflict resolution policies on an Azure Cosmos container:

* **Last Write Wins (LWW)**: This resolution policy, by default, uses a system-defined timestamp property. It's based on the time-synchronization clock protocol. If you use the SQL API, you can specify any other custom numerical property (e.g., your own notion of a timestamp) to be used for conflict resolution. A custom numerical property is also referred to as the *conflict resolution path*. 

  If two or more items conflict on insert or replace operations, the item with the highest value for the conflict resolution path becomes the winner. The system determines the winner if multiple items have the same numeric value for the conflict resolution path. All regions are guaranteed to converge to a single winner and end up with the same version of the committed item. When delete conflicts are involved, the deleted version always wins over either insert or replace conflicts. This outcome occurs no matter what the value of the conflict resolution path is.

  > [!NOTE]
  > Last Write Wins is the default conflict resolution policy and uses timestamp `_ts` for the following APIs: SQL, MongoDB, Cassandra, Gremlin and Table. Custom numerical property is available only for SQL API.

  To learn more, see [examples that use LWW conflict resolution policies](how-to-manage-conflicts.md).

* **Custom**: This resolution policy is designed for application-defined semantics for reconciliation of conflicts. When you set this policy on your Azure Cosmos container, you also need to register a *merge stored procedure*. This procedure is automatically invoked when conflicts are detected under a database transaction on the server. The system provides exactly once guarantee for the execution of a merge procedure as part of the commitment protocol.  

  If you configure your container with the custom resolution option, and you fail to register a merge procedure on the container or the merge procedure throws an exception at runtime, the conflicts are written to the *conflicts feed*. Your application then needs to manually resolve the conflicts in the conflicts feed. To learn more, see [examples of how to use the custom resolution policy and how to use the conflicts feed](how-to-manage-conflicts.md).

  > [!NOTE]
  > Custom conflict resolution policy is available only for SQL API accounts.

## Next steps

Learn how to configure conflict resolution policies:

* [How to configure multi-master in your applications](how-to-multi-master.md)
* [How to manage conflict resolution policies](how-to-manage-conflicts.md)
* [How to read from the conflicts feed](how-to-manage-conflicts.md#read-from-conflict-feed)
