---
title: Query data in a Basic and Auxiliary logs table in Azure Monitor Logs 
description: This article explains how to query data from Basic and Auxiliary logs tables.
author: guywi-ms
ms.author: guywild
ms.reviewer: adi.biran
ms.topic: conceptual
ms.date: 07/17/2024
---

# Query data in a Basic and Auxiliary logs table in Azure Monitor Logs
Basic and Auxiliary logs tables reduce the cost of ingesting high-volume verbose logs and let you query the data they store with some limitations. This article explains how to query data from Basic and Auxiliary logs tables. 

For more information about Basic and Auxiliary table plans, see [Azure Monitor Logs Overview: Table plans](data-platform-logs.md#table-plans). 

> [!NOTE]
> Other tools that use the Azure API for querying - for example, Grafana and Power BI - cannot access Basic Logs.

[!INCLUDE [log-analytics-query-permissions](../../../includes/log-analytics-query-permissions.md)]

## Limitations

Queries on data in Basic and Auxiliary tables are subject to the following limitations:

### Kusto Query Language (KQL) language limitations

Queries of data in Basic or Auxiliary tables support all KQL [scalar](/azure/data-explorer/kusto/query/scalar-functions) and [aggregation](azure/data-explorer/kusto/query/aggregation-functions) functions. However, Basic or Auxiliary table queries are limited to a single table. Therefore, these limitations apply:  

- Operators that join data from multiple tables are limited:
    - [join](/azure/data-explorer/kusto/query/join-operator?pivots=azuremonitor), [find](/azure/data-explorer/kusto/query/find-operator?pivots=azuremonitor), [search](/azure/data-explorer/kusto/query/search-operator), and [externaldata](/azure/data-explorer/kusto/query/externaldata-operator?pivots=azuremonitor) aren't supported.
    - [lookup](/azure/data-explorer/kusto/query/lookup-operator) and [union](/azure/data-explorer/kusto/query/union-operator?pivots=azuremonitor) are supported, but limited to up to five Analytics tables.
- [User-defined functions](/azure/data-explorer/kusto/query/functions/user-defined-functions) aren't supported.
- [Cross-service](/azure/azure-monitor/logs/cross-workspace-query) and [cross-resource](/azure-monitor/logs/azure-monitor-data-explorer-proxy) queries aren't supported.


### Time range
Specify the time range in the query header in Log Analytics or in the API call. You can't specify the time range in the query body using a **where** statement.

### Query context
Queries with Basic Logs must use a workspace for the scope. You can't run queries using another resource for the scope. For more information, see [Log query scope and time range in Azure Monitor Log Analytics](scope.md).

### Concurrent queries
You can run two concurrent queries per user. 

### Purge
You can’t [purge personal data](personal-data-mgmt.md#exporting-and-deleting-personal-data) from Basic Logs tables. 

## Run a query on a Basic Logs table
Creating a query using Basic Logs is the same as any other query in Log Analytics. See [Get started with Azure Monitor Log Analytics](./log-analytics-tutorial.md) if you aren't familiar with this process.

# [Portal](#tab/portal-1)

In the Azure portal, select **Monitor** > **Logs** > **Tables**.

In the list of tables, you can identify Basic Logs tables by their unique icon: 

:::image type="content" source="./media/basic-logs-configure/table-icon.png" lightbox="./media/basic-logs-configure/table-icon.png" alt-text="Screenshot of the Basic Logs table icon in the table list." border="false":::

You can also hover over a table name for the table information view, which specifies that the table has the Basic or Auxiliary table plan:

:::image type="content" source="./media/basic-logs-configure/table-info.png" lightbox="./media/basic-logs-configure/table-info.png" alt-text="Screenshot of the Basic Logs table indicator in the table details." border="false":::

When you add a table to the query, Log Analytics identifies a Basic or Auxiliary logs table and aligns the authoring experience accordingly. 

:::image type="content" source="./media/basic-logs-query/query-validator.png" lightbox="./media/basic-logs-query/query-validator.png" alt-text="Screenshot of Query on Basic Logs limitations.":::

# [API](#tab/api-1)

Use **/search** from the [Log Analytics API](api/overview.md) to query data in a Basic or Auxiliary logs table using a REST API. This is similar to the [/query](api/request-format.md) API with the following differences:

- The query is subject to the language limitations described in [KQL language limitations](#kusto-query-language-kql-language-limitations).
- The time span must be specified in the header of the request and not in the query statement.

**Sample Request**

```http
https://api.loganalytics.io/v1/workspaces/{workspaceId}/search?timespan=P1D
```

**Request body**

```json
{
    "query": "ContainerLogV2 | where Computer ==  \"some value\"\n",
}
```


---
## Pricing model
The charge for a query on Basic and Auxiliary logs tables is based on the amount of data the query scans, which depends on the size of the table and the query's time range. For example, a query that scans three days of data in a table that ingests 100 GB each day, would be charged for 300 GB. 

For more information, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).


## Next steps

- [Learn more about the Basic Logs and Analytics log plans](basic-logs-configure.md).
- [Use a search job to retrieve data from Basic Logs into Analytics Logs where it can be queries multiple times](search-jobs.md).

