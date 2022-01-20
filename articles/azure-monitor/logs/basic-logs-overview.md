---
title: Azure Monitor Basic Logs
description: Use Azure Monitor Basic Logs to quickly, or periodically investigate issues, troubleshoot code or configuration problems or address support cases.
author: bwren
ms.author: bwren
ms.reviewer: osalzberg
ms.topic: conceptual
ms.date: 01/20/2022

---

# Azure Monitor Basic Logs (Preview)
Basic Logs is a feature of Azure Monitor that reduces the cost for high-value verbose logs that don’t require analytics and alerts. Tables in a Log Analytics workspace that are configured as Basic logs have a reduced cost for ingestion with limitations on log queries and other Azure Monitor features. 


[Logs plans overview](media/basic-logs-overview/logs-plans-overview.png)

## Difference from standard logs
Specific differences between Basic Logs table and Standard Logs tables are listed in the following table.

| Category | Description |
|:---|:---|
| Ingestion | Ingestion for data in Basic Logs tables has a reduced cost for ingestion. |
| Log queries | Log queries using Basic Logs tables have a cost and support a subset of the query language. Log queries with Standard Logs tables have no cost and support the full query language. |
| Retention |  Retention for Basic Logs is always 8 days. Retention for Standard Logs tables can be configured. |
| Alerts | Log query alert rules cannot use Basic Logs tables. |


## Tables supporting basic logs
You configure particular tables your Log Analytics workspace to use Basic Logs. This does not affect other tables in the workspace. Not all tables can be configured for Basic Logs since other Azure Monitor features may rely on these tables.

The following tables can currently be configured as basic logs.

- All custom logs created with [direct ingestion](). Basic logs are not supported for tables craete with [Data Collector API](data-collector-api.md).
-	[ContainerLog](/azure/azure-monitor/reference/tables/containerlog) and [ContainerLogV2](/azure/azure-monitor/reference/tables/containerlogv2), which are tables used by [Container Insights](../containers/container-insights-overview.md) and include cases verbose text-based log records.
- [AppTraces](/azure/azure-monitor/reference/tables/apptraces), which contains freeform log records for application traces in Application Insights.

## When to use Basic Logs
Basic logs are intended to support data that you need to collect but only require infrequent access to. These are typically high value logs that you may need to retain for purposes such as compliance or infrequent troubleshooting.

## Extracting valuable data
You may have tables that you want to configure as Basic logs because you don't require regular access to the bulk of their data, but these tables may have some data that is valuable. For example, there may be scalar columns in the table or even scalar values embedded in the text of other columns.

There are two strategies to handle these kinds of logs:

-	Configure them as Basic Logs only query them occasionally for compliancy and troubleshooting. This pattern is usually used for low-value and highly verbose logs.
-	Create a transform in the DCR that collects the table or in the default DCR for the workspace that extracts the required data and stores it in a table.
Parse them and extract the scalars from the text. Once parsed, these logs can be used for analytics and every mechanism that Azure Monitor supports. This pattern is usually used for high-value logs.

Azure Monitor Logs provides tools for both strategies and the ability to apply both on the same data stream. Custom transforms (**TODO:** add link to transform documentation) can be used to parse logs as they are ingested to filter unnecessary logs. 




## Log queries with Basic Logs tables
Log queries using Basic Logs are expected to be infrequent and relatively simple.


### Limits
Only the following table operators are supported when running a query on Basic Logs. All functions and binary operators are supported when used within these operators.

- where
- extend
- project – including all its variants (project-away, project-rename, etc.)
- parse and parse-where


Some of the query execution parameters are different for queries over Basic Logs. When it comes to concurrent execution, it will support up to 2 concurrent queries per user. Purge will not be supported on these logs. The time range must be specified in the query header and not within the query body.

Queries can run only in the context of the relevant workspace. Queries cannot run in resource-context.

### Charges

> [!NOTE]
>During the preview period: 
>* Queries on Basic Logs will be free of charge.

Log queries on Basic Logs are charged by the amount of data they scan. For example, If a query is scanning three days of data for a table that ingest 100 GB/day, it would be charged on 300 GB. Calculation is based on chunks of up to one day of data. For more details on billing, see **TODO:** add link to billing page.

## Search jobs
If there is a need for more advanced processing on the results of these queries, customers can use Search Jobs that support Basic Logs. Search Jobs results are available as standard Analytics Log table and can be analyzed using standard queries. **TODO:** add link to Search Job documentation.

