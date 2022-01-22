---
title: Query data from Basic Logs in Azure Monitor (Preview)
description: Create a log query using tables configured for Basic logs in Azure Monitor.
author: bwren
ms.author: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 01/13/2022

---

# Query Basic Logs in Azure Monitor (Preview)
Queries can be executed from the Log Analytics experience in the Azure portal, or from a dedicated REST API. 

### Cost

> [!NOTE]
> During the preview period, there is no cost for log queries on Basic Logs.

Log queries on Basic Logs are charged by the amount of data they scan. For example, If a query is scanning three days of data for a table that ingest 100 GB/day, it would be charged on 300 GB. Calculation is based on chunks of up to one day of data. For more details on billing, see **TODO:** add link to billing page.

## Limits

### KQL language limits
Only the following table operators are supported when running a query with a Basic Logs table. All functions and binary operators are supported when used within these operators.

- [where](/azure/data-explorer/kusto/query/whereoperator)
- [extend](/azure/data-explorer/kusto/query/extendoperator)
- [project](/azure/data-explorer/kusto/query/projectoperator)
- [project-away](/azure/data-explorer/kusto/query/projectawayoperator)
- [project-keep](/azure/data-explorer/kusto/query/projectkeepoperator)
- [project-rename](/azure/data-explorer/kusto/query/projectrenameoperator)
- [project-reorder](/azure/data-explorer/kusto/query/projectreorderoperator)
- [parse](/azure/data-explorer/kusto/query/parseoperator)
- [parse-where](/azure/data-explorer/kusto/query/parsewhereoperator)

### Time range
The time range must be specified in the query header in Log Analytics and not within the query body using a **where** statement.

### Query context
Queries can run only in the context of the relevant workspace. Queries cannot run in resource-context.

### Concurrent queries
Up to only 2 concurrent queries are supported per user. 

### Purge
Purge is not supported on Basic Logs tables. 


## Run a query from the Portal
Open Log Analytics in the Azure portal and open the **Tables** tab. (see [Get started with Azure Monitor Log Analytics](./log-analytics-tutorial.md) for detailed instructions).
On selecting a table, Log Analytics identifies which type of table it is and the UI is aligned to support the query specifications per the table configuration. On a Basic Logs table, the query authoring experience is aligned to the query limitations as explained above. 
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

```http
{
    "query": "ContainerLog | where LogEntry has \"some value\"\n",
}
```




## Next steps

- [Read more about Basic logs](basic-logs-overview.md)
- [Configure a table for Basic Logs.](basic-logs-query.md)