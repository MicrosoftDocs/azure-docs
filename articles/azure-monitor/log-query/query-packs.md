---
title: Query packs in Log Analytics
description: This article describes how to use functions to call a query from another log query in Azure Monitor.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/07/2021

---

# Query packs in Log Analytics





## Query packs
A query pack holds a collection of log queries that can be used in Log Analytics. They provide the ability to export a collection of queries and import into another workspace. The set of log queries available in a workspace is the total set of queries in the query packs currently installed in the workspace.


## Save a query
To save a log query in a query pack, select **Save as Log Analytics Query** from Log Analytics.

If you check the option to **Save to the default query pack**, the query will be saved to a query pack called **DefaultQueryPack** in the same subscription and resource group as the workspace. Uncheck this box if you want to specify another query pack.

## Tags
Tags allow customers to locate queries they may be

**Resource type** specifies one or more resources types that the query should be associated with. 


## Using queries
Queries in the query packs that are installed in the workspace are listed in the **Queries** tab in the left pane of Log Analytics. You can organize or filter the queries by the following properties.

**Category:** Set of predefined categories to combine common queries. A query can have multiple resource categories. You can't create custom categories.
**Resource type:** Azure resource types that the query is associated with. A query can have multiple resource types.
**Label:** Custom labels that help to identify the query. A query can have multiple labels, and you can create your own custom labels.
**Solution:**




## Next steps
