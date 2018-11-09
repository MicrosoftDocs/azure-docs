---
title: Conflict resolution types and resolution policies in Azure Cosmos DB 
description: This article describes the conflict categories and conflict resolution policies in Azure Cosmos DB.
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/26/2018
ms.author: mjbrown

---

# Conflict types and resolution policies

Conflicts and conflict resolution policies are applicable if your Cosmos account is configured with multiple write regions.

For Cosmos accounts configured with multiple write regions, update conflicts can occur when multiple writers concurrently update the same item in multiple regions. Update conflicts are classified into the following three types:

1. **Insert conflicts:** These conflicts can occur when an application simultaneously inserts two or more items with the same unique index (for example, ID property) from two or more regions. In this case, all the writes may succeed initially in their respective local regions, but based on the conflict resolution policy you choose, only one item with the original ID is finally committed.

1. **Replace conflicts:** These conflicts can occur when an application updates a single item simultaneously from two or more regions.

1. **Delete conflicts:** These conflicts can occur when an application simultaneously deletes an item from one region and updates it from other region.

## Conflict resolution policies

Cosmos DB offers a flexible policy-driven mechanism to resolve update conflicts. You can select from the following two conflict resolution policies on a Cosmos container:

- **Last-Write-Wins (LWW):** This resolution policy by default, uses a system-defined timestamp property (based on the time-synchronization clock protocol). Alternatively, when using the SQL API, Cosmos DB allows you to specify any other custom numerical property (also referred to as the “conflict resolution path”) to be used for conflict resolution.  

  If two or more items conflict on insert or replace operations, the item that contains the highest value for the “conflict resolution path” becomes the “winner”. If multiple items have same numeric value for the conflict resolution path, the selected “winner” version is determined by the system. All regions are guaranteed to converge to a single winner and end up with the identical version of the committed item. If there are delete conflicts involved, the deleted version always wins over either insert or replace conflicts, regardless of the value of the conflict resolution path.

  > [!NOTE]
  > Last-Write-Wins is the default conflict resolution policy and it is available for SQL, Table, MongoDB, Cassandra and Gremlin API accounts.

  To learn more, see [examples using LWW conflict resolution policies](how-to-manage-conflicts.md#create-a-last-writer-wins-conflict-resolution-policy).

- **Custom:** This resolution policy is designed for application-defined semantics for reconciliation of conflicts. While setting this policy on your Cosmos container, you also need to register a merge stored procedure, which is automatically invoked when update conflicts are detected under a database transaction at the server. The system provides exactly once guarantee for the execution of a merge procedure as part of the commitment protocol.  

  However, if you configure your container with the custom resolution option, but either fail to register a merge procedure on the container, or if the merge procedure throws an exception at runtime, the conflicts are written to the conflicts feed. Your application will then need to manually resolve the conflicts in the conflicts-feed. To learn more, see [examples of using custom resolution policy and how to use conflicts feed](how-to-manage-conflicts.md#create-a-last-writer-wins-conflict-resolution-policy).

  > [!NOTE]
  > Custom conflict resolution policy is only available for SQL API accounts.

## Next steps

Next you can learn how to configure conflict resolution policies by using the following articles:

* [How to use the LWW conflict resolution policy](how-to-manage-conflicts.md#create-a-last-writer-wins-conflict-resolution-policy)
* [How to use the custom conflict resolution policy](how-to-manage-conflicts.md#create-a-last-writer-wins-conflict-resolution-policy)
* [How to use the conflicts-feed](how-to-manage-conflicts.md#read-from-conflict-feed)
