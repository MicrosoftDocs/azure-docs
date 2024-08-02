---
title: Query data in a Basic and Auxiliary table in Azure Monitor Logs 
description: This article explains how to query data from Basic and Auxiliary logs tables.
author: guywi-ms
ms.author: guywild
ms.reviewer: adi.biran
ms.topic: conceptual
ms.date: 07/21/2024
---

# Query data in a Basic and Auxiliary table in Azure Monitor Logs
Basic and Auxiliary logs tables reduce the cost of ingesting high-volume verbose logs and let you query the data they store with some limitations. This article explains how to query data from Basic and Auxiliary logs tables. 

For more information about Basic and Auxiliary table plans, see [Azure Monitor Logs Overview: Table plans](data-platform-logs.md#table-plans). 

> [!NOTE]
> Other tools that use the Azure API for querying - for example, Grafana and Power BI - cannot access data in Basic and Auxiliary tables.

[!INCLUDE [log-analytics-query-permissions](../../../includes/log-analytics-query-permissions.md)]

## Limitations

Queries on data in Basic and Auxiliary tables are subject to the following limitations:

#### Kusto Query Language (KQL) language limitations

Queries of data in Basic or Auxiliary tables support all KQL [scalar](/azure/data-explorer/kusto/query/scalar-functions) and [aggregation](/azure/data-explorer/kusto/query/aggregation-functions) functions. However, Basic or Auxiliary table queries are limited to a single table. Therefore, these limitations apply:  

- Operators that join data from multiple tables are limited:
    - [join](/azure/data-explorer/kusto/query/join-operator?pivots=azuremonitor), [find](/azure/data-explorer/kusto/query/find-operator?pivots=azuremonitor), [search](/azure/data-explorer/kusto/query/search-operator), and [externaldata](/azure/data-explorer/kusto/query/externaldata-operator?pivots=azuremonitor) aren't supported.
    - [lookup](/azure/data-explorer/kusto/query/lookup-operator) and [union](/azure/data-explorer/kusto/query/union-operator?pivots=azuremonitor) are supported, but limited to up to five Analytics tables.
- [User-defined functions](/azure/data-explorer/kusto/query/functions/user-defined-functions) aren't supported.
- [Cross-service](/azure/azure-monitor/logs/cross-workspace-query) and [cross-resource](/azure/azure-monitor/logs/cross-workspace-query) queries aren't supported.


#### Time range
Specify the time range in the query header in Log Analytics or in the API call. You can't specify the time range in the query body using a **where** statement.

#### Query scope

Set the Log Analytics workspace as the scope of your query. You can't run queries using another resource for the scope. For more information about query scope, see [Log query scope and time range in Azure Monitor Log Analytics](scope.md).

#### Concurrent queries
You can run two concurrent queries per user. 

#### Auxiliary log query performance

Queries of data in Auxiliary tables are unoptimized and might take longer to return results than queries you run on Analytics and Basic tables.

#### Purge
You can’t [purge personal data](personal-data-mgmt.md#exporting-and-deleting-personal-data) from Basic and Auxiliary tables. 

## Run a query on a Basic or Auxiliary table
Running a query on Basic or Auxiliary tables is the same as querying any other table in Log Analytics. See [Get started with Azure Monitor Log Analytics](./log-analytics-tutorial.md) if you aren't familiar with this process.

# [Portal](#tab/portal-1)

In the Azure portal, select **Monitor** > **Logs** > **Tables**.

In the list of tables, you can identify Basic and Auxiliary tables by their unique icon: 

:::image type="content" source="./media/basic-logs-configure/table-icon.png" lightbox="./media/basic-logs-configure/table-icon.png" alt-text="Screenshot of the Basic Logs table icon in the table list." border="false":::

You can also hover over a table name for the table information view, which specifies that the table has the Basic or Auxiliary table plan:

:::image type="content" source="./media/basic-logs-configure/table-info.png" lightbox="./media/basic-logs-configure/table-info.png" alt-text="Screenshot of the Basic Logs table indicator in the table details." border="false":::

When you add a table to the query, Log Analytics identifies a Basic or Auxiliary table and aligns the authoring experience accordingly. 

:::image type="content" source="./media/basic-logs-query/query-validator.png" lightbox="./media/basic-logs-query/query-validator.png" alt-text="Screenshot of Query on Basic Logs limitations.":::

# [API](#tab/api-1)

Use **/search** from the [Log Analytics API](api/overview.md) to query data in a Basic or Auxiliary table using a REST API. This is similar to the [/query](api/request-format.md) API with the following differences:

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
The charge for a query on Basic and Auxiliary tables is based on the amount of data the query scans, which depends on the size of the table and the query's time range. For example, a query that scans three days of data in a table that ingests 100 GB each day, would be charged for 300 GB. 

For more information, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).


## Next steps

- [Learn more about Azure Monitor Logs table plans](data-platform-logs.md#table-plans).


