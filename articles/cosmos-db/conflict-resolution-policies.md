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

Conflicts and conflict resolution policies are applicable if your Azure Cosmos DB account is configured with multiple write regions.

For Azure Cosmos DB accounts configured with multiple write regions, update conflicts can occur when writers concurrently update the same item in multiple regions. Update conflicts are classified into the following three types:

* **Insert conflicts**: These conflicts can occur when an application simultaneously inserts two or more items with the same unique index from two or more regions. As an example, this conflict might occur with an ID property. All the writes might succeed initially in their respective local regions. But based on the conflict resolution policy you choose, only one item with the original ID is finally committed.

* **Replace conflicts**: These conflicts can occur when an application updates a single item simultaneously from two or more regions.

* **Delete conflicts**: These conflicts can occur when an application simultaneously deletes an item from one region and updates it from another region.

## Conflict resolution policies

Azure Cosmos DB offers a flexible policy-driven mechanism to resolve update conflicts. You can select from two conflict resolution policies on an Azure Cosmos DB container:

- **Last Write Wins (LWW)**: This resolution policy, by default, uses a system-defined timestamp property. It's based on the time-synchronization clock protocol. If you use the Azure Cosmos DB SQL API, you can specify any other custom numerical property to be used for conflict resolution. A custom numerical property is also referred to as the conflict resolution path. 

  If two or more items conflict on insert or replace operations, the item with the highest value for the conflict resolution path becomes the winner. The system determines the winner if multiple items have the same numeric value for the conflict resolution path. All regions are guaranteed to converge to a single winner and end up with the same version of the committed item. When delete conflicts are involved, the deleted version always wins over either insert or replace conflicts. This outcome occurs no matter the value of the conflict resolution path.

  > [!NOTE]
  > Last Write Wins is the default conflict resolution policy. It's available for SQL, Azure Cosmos DB Table, MongoDB, Cassandra, and Gremlin API accounts.

  To learn more, see [examples that use LWW conflict resolution policies](how-to-manage-conflicts.md#create-a-last-writer-wins-conflict-resolution-policy).

- **Custom**: This resolution policy is designed for application-defined semantics for reconciliation of conflicts. When you set this policy on your Azure Cosmos DB container, you also need to register a merge stored procedure. This procedure is automatically invoked when conflicts are detected under a database transaction at the server. The system provides exactly once guarantee for the execution of a merge procedure as part of the commitment protocol.  

  There are two points to remember if you configure your container with the custom resolution option. If you fail to register a merge procedure on the container or the merge procedure throws an exception at runtime, the conflicts are written to the conflicts feed. Your application then needs to manually resolve the conflicts in the conflicts feed. To learn more, see [examples of how to use the custom resolution policy and how to use the conflicts feed](how-to-manage-conflicts.md#create-a-last-writer-wins-conflict-resolution-policy).

  > [!NOTE]
  > Custom conflict resolution policy is available only for SQL API accounts.

## Next steps

Learn how to configure conflict resolution policies. See the following articles:

* [Use the LWW conflict resolution policy](how-to-manage-conflicts.md#create-a-last-writer-wins-conflict-resolution-policy)
* [Use the custom conflict resolution policy](how-to-manage-conflicts.md#create-a-last-writer-wins-conflict-resolution-policy)
* [Use the conflicts feed](how-to-manage-conflicts.md#read-from-conflict-feed)
