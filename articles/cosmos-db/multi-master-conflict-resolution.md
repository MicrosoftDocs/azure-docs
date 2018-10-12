---
title: Conflict resolution in Azure Cosmos DB 
description: This article describes the conflict categories and conflict resolution policies in Azure Cosmos DB multi-master.
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: mjbrown
ms.reviewer: sngun

---

# Conflict resolution in Azure Cosmos DB

Azure Cosmos DB provides global conflict resolution policies to ensure data is consistent across all regions where it is replicated. Conflicts and conflict resolution policies are applicable if your Cosmos account is configured with multiple write regions (multi-master).

## Conflict categories

For Cosmos DB accounts configured with multiple write regions, update conflicts can occur when multiple writers simultaneously update the same item in multiple regions. Update conflicts are classified into the following three types:

* **Insert conflicts** can occur when an application simultaneously inserts two or more items with the same unique index (for example, `ItemID` property) from two or more regions. In this case, all the writes may succeed initially in their respective local regions, but based on the conflict resolution policy you choose, only one item with the original `ItemID` is finally committed. 

* **Replace conflicts** can occur when an application simultaneously updates a single item from two or more regions.  

* **Delete conflicts** can occur when an application simultaneously deletes an item from one region and updates it from any other region. 

## Conflict resolution policies

Cosmos DB offers a flexible policy-driven mechanism for resolving update conflicts. You can select from the following conflict resolution policies on a Cosmos container:  

> [!NOTE]
> SQL API users can choose among the different conflict resolution policies. For all other API models (MongoDB, Cassandra, Graph and Table), conflicts are resolved using Last-Writer-Wins.

### Last-Writer-Wins

Last-Writer-Wins (LWW) is the default conflict resolution policy.  By default, it uses a system-defined timestamp property (based on the time-synchronization clock protocol). Alternatively, Cosmos DB allows you to specify any other numerical property (also referred to as the “conflict resolution path”) to be used for conflict resolution.  

If two or more items conflict on insert or replace operations, the item that contains the highest value for the “conflict resolution path” becomes the “winner”. If multiple items have same numeric value for the conflict resolution path, the selected “winner” version is determined by the system. All regions are guaranteed to converge to a single winner and end up with the identical version of the committed item. If there are delete conflicts involved, the deleted version always wins over either insert conflicts or replace conflicts, regardless of the value of the conflict resolution path.

### Custom

This policy is designed for application-defined semantics for reconciliation of conflicts. While setting this policy on your Cosmos container, you can optionally register a merge stored procedure.  This procedure is automatically invoked when update conflicts are detected under a database transaction on the server side. The system provides an exactly once guarantee for the execution of a merge procedure as part of the commitment protocol.  

However, if you configure your container with the custom resolution option, but either choose not to register a merge procedure on the container, or if the merge procedure throws an exception at runtime, the conflicts are written to the “conflicts feed”. Your application will then need to manually resolve the conflicts in the conflicts feed.

## Next steps

See [How-To configure LWW conflict resolution](TBD).

See [How-To configure custom conflict resolution](TBD).

Also, you can learn more about conflict resolution policies from the following samples.  Each sample generates conflicts within a Cosmos container and then shows how conflicts are resolved for each supported conflict resolution policy.

|API model  | SDK |Sample |
|---------|---------|---------|
|SQL  API    | .NET    |[azure-cosmos-db-sql-dotnet-multi-master](https://github.com/Azure-Samples/azure-cosmos-db-sql-dotnet-multi-master)  |
|SQL  API    | Node    |[azure-cosmos-js/samples/MultiRegionWrite/](https://github.com/Azure/azure-cosmos-js/tree/master/samples/MultiRegionWrite)  |
|SQL  API    | Java    |[azure-cosmos-db-sql-java-multi-master](https://github.com/Azure-Samples/azure-cosmos-db-sql-java-multi-master)  |
|MongoDB  | .NET    |[azure-cosmos-db-mongodb-dotnet-multi-master](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-dotnet-multi-master)   |
|Table  API  | .NET    |[azure-cosmos-db-table-dotnet-multi-master](https://github.com/Azure-Samples/azure-cosmos-db-table-dotnet-multi-master)       |
|Gremlin API | .NET | [azure-cosmos-db-gremlin-dontnet-multi-master](https://github.com/Azure-Samples/azure-cosmos-db-gremlin-dontnet-multi-master)|
