---
title: Query data from Basic Logs in Azure Monitor (Preview)
description: Create a log query using tables configured for Basic logs in Azure Monitor.
author: bwren
ms.author: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 01/27/2022

---

# Query Basic Logs in Azure Monitor (Preview)
Basic Logs is a feature of Azure Monitor that reduces the cost for high-volume verbose logs that don’t require analytics and alerts. Tables in a Log Analytics workspace that are configured as Basic logs have a reduced cost for ingestion with limitations on log queries and other Azure Monitor features. This article describes how to query data from tables configured for Basic Logs. This includes guidance for running queries from Log Analytics in the Azure portal and from the Log Analytics REST API.

### Cost
Log queries on Basic Logs are charged according to the amount of data they scan, not just the amount of data they return. For example, If a query is scanning three days of data for a table that ingests 100 GB/day, it would be charged on 300 GB. Calculation is based on chunks of up to one day of data. 

> [!NOTE]
> During the preview period, there is no cost for log queries on Basic Logs.


## Limits
Queries with Basic Logs are subject to the following limitations:
### KQL language limits
Log queries against Basic Logs are intended for simple data retrieval and use a subset of the KQL language, including the following operators: 

- [where](/azure/data-explorer/kusto/query/whereoperator)
- [extend](/azure/data-explorer/kusto/query/extendoperator)
- [project](/azure/data-explorer/kusto/query/projectoperator)
- [project-away](/azure/data-explorer/kusto/query/projectawayoperator)
- [project-keep](/azure/data-explorer/kusto/query/projectkeepoperator)
- [project-rename](/azure/data-explorer/kusto/query/projectrenameoperator)
- [project-reorder](/azure/data-explorer/kusto/query/projectreorderoperator)
- [parse](/azure/data-explorer/kusto/query/parseoperator)
- [parse-where](/azure/data-explorer/kusto/query/parsewhereoperator)

All functions and binary operators are supported when used within these operators.

### Time range
The time range must be specified in the query header in Log Analytics or in the API call. You can't specify the time range in the query body using a **where** statement.

### Query context
Queries with Basic Logs must use a workspace for the scope. You can't run queries using another resource for the scope. For more details, see [Log query scope and time range in Azure Monitor Log Analytics](scope.md).

### Concurrent queries
Up to only 2 concurrent queries are supported per user. 

### Purge
[Purge](personal-data-mgmt.md#how-to-export-and-delete-private-data) is not supported on Basic Logs tables. 


## Run a query from the Azure portal
Creating a query using Basic Logs is the same as any other query in Log Analytics. See [Get started with Azure Monitor Log Analytics](./log-analytics-tutorial.md) if you aren't familiar with this process.

Open Log Analytics in the Azure portal and open the **Tables** tab. When browsing the list of tables, Basic Logs tables are identified with a unique icon: 

![Screenshot of the Basic Logs table icon in the table list.](./media/basic-logs-configure/table-icon.png)

You can also hover over a table name for the table information view. This will specify that the table is configured as Basic Logs:

![Screenshot of the Basic Logs table indicator in the table details.](./media/basic-logs-configure/table-info.png)


When you add a table to the query, Log Analytics will identify a Basic Logs table an align the authoring experience accordingly. The following example shows when you attempt to use an operator that isn't supported by Basic Logs.

![Screenshot of Query on Basic Logs limitations.](./media/basic-logs-query/query-validator.png)

## Run a query from REST API
Use **/search** from the [Log Analytics API](api/overview.md) to run a query with Basic Logs using a REST API. This is similar to the [/query](api/request-format.md) API with the following differences:

- The query is subject to the language limitations described above.
- The time span must be specified in the header of the request and not in the query statement.

### Sample Request
```http
https://api.loganalytics.io/v1/workspaces/testWS/search?timespan=P1D
```

**Request body**

```json
{
    "query": "ContainerLog | where LogEntry has \"some value\"\n",
}
```


## Next steps

- [Learn more about Basic Logs and the different log plans.](log-analytics-workspace-overview.md#log-data-plans-preview)
- [Configure a table for Basic Logs.](basic-logs-configure.md)
- [Use a search job to retrieve data from Basic Logs into Analytics Logs where it can be queries multiple times.](search-jobs.md)