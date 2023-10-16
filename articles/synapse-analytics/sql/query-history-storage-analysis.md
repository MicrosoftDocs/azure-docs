---
title: Historical query storage and analysis in Azure Synapse Analytics
description: Historic query analysis is one of the crucial needs of data engineers. Azure Synapse Analytics supports four main ways to analyze query history and performance. These include Query Store, DMVs, Azure Log Analytics, and Azure Data Explorer.
author: mariyaali
ms.author: mariyaali
ms.reviewer: wiassaf
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 10/28/2021
ms.custom: template-concept
---

# Historical query storage and analysis in Azure Synapse Analytics

Historic query analysis is one of the crucial needs of data engineers. Azure Synapse Analytics supports four main ways to analyze query history and performance. These include Query Store, DMVs, Azure Log Analytics, and Azure Data Explorer. 

This article will show you how to use each of these options for your needs. Review use cases when it comes to analyzing query history, and the best method for each.

| **Customer need** |  **Query Store** |  **DMVs**    | **Azure Log Analytics** | **Azure Data Explorer** |
|------------- | --- | ----- | ------------- |-------------------|
|**Out of the box solution** | Needs enabling | :heavy_check_mark: | Addition service required |    Addition service required|
|**Longer analysis periods** | 30 days |    Up to 10000 rows of history     | Customizable | Customizable|
|**Crucial metrics availability** |    Limited    | :heavy_check_mark: |    Limited    | Customizable|
|**Use SQL for analysis** | :heavy_check_mark: | :heavy_check_mark:| KQL needed | SQL support is limited|
|||||

## Query Store

The Query Store feature provides insight on query plan choice and performance. It simplifies performance troubleshooting by helping you quickly find performance differences caused by query plan changes. 

Query Store is not enabled by default for new Azure Synapse Analytics databases. To enable Query Store to run the following T-SQL command:

```sql
ALTER DATABASE <database_name>
SET QUERY_STORE = ON;
```

For example:

```sql
ALTER DATABASE [SQLPOOL1]
SET QUERY_STORE = ON;
```

You can run performance auditing and troubleshooting related tasks by finding last executed queries, execution counts, longest running queries, queries with maximum physical I/O leads. Please refer to [Monitoring Performance By Using the Query Store](/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store#performance) for sample queries.

Advantages:
* Up to 30 days of storage for query data. Default 7 days.
* Data can be consumed in the same tool that you'd run the query in.

Known Limitation:
* Default storage of historic query data is less.
* Scenarios for analysis are limited in Query Store for Azure Synapse when compared to using DMVs.

## DMVs

Dynamic Management Views (DMVs) are extremely useful when it comes to gathering information on query wait times, execution plans, memory, etc.
It is highly recommended to label your query of interest to track it down later. For example:

```sql
-- Query with Label
SELECT *
FROM sys.tables
OPTION (LABEL = 'My Query');
```

For more information on labeling your queries in Azure Synapse SQL, see [Use query labels in Synapse SQL](develop-label.md).

For more information on using DMVs to monitor your Azure Synapse Analytics workload, see [Monitor your dedicated SQL pool workload using DMVs](../sql-data-warehouse/sql-data-warehouse-manage-monitor.md?context=/azure/synapse-analytics/context/context). For documentation on catalog views specific to Azure Synapse Analytics, see [Azure Synapse Analytics Catalog Views](/sql/relational-databases/system-catalog-views/sql-data-warehouse-and-parallel-data-warehouse-catalog-views).

Advantages:
* Data can be consumed in the same querying tool.
* DMVs provide extensive options for analysis.

Known Limitations:
* DMVs are limited to 10,000 rows of historic entries. 
* Views are reset when pool is paused/resumed.

## Log Analytics
Log Analytics workspaces can be created easily in the Azure portal. For further instructions on how to connect Synapse with Log Analytics, see  [Monitor workload - Azure portal](../sql-data-warehouse/sql-data-warehouse-monitor-workload-portal.md).

Like Azure Data Explorer, Log Analytics uses the Kusto Query Language (KQL). For more information about Kusto syntax, see [Kusto query overview](/azure/data-explorer/kusto/query/). 

Along with configurable retention period, you choose the workspace you are specifically targeting to query in Log Analytics. Log Analytics gives you the flexibility to store data, run, and save queries.

Advantages:
* Azure Log Analytics has a customizable log retention policy

Known Limitations:
* Using KQL adds to the learning curve.
* Limited views can be logged out of the box.

## Azure Data Explorer (ADX)

Azure Data Explorer (ADX) is a leading data exploration service. This service can be used to analyze historic queries from Azure Synapse Analytics. To setup an Azure Data Factory (ADF) pipeline to copy and store logs to ADX, see [Copy data to or from Azure Data Explorer](../../data-factory/connector-azure-data-explorer.md). In ADX, you can run performant Kusto query to analyze your logs. You can combine other strategies here, for example to query and load DMV output to ADX via ADF.
  
Advantages:
* ADX provides a customizable log retention policy.
* Performant query execution against large amount of data, especially queries involving string search.

Known Limitation:
* Using KQL adds to the learning curve.

## Next steps

 - [Azure Data Explorer](/azure/data-explorer/)
 - [Azure Data Factory](../../data-factory/index.yml)
 - [Log Analytics in Azure Monitor](../../azure-monitor/logs/log-analytics-overview.md)
 - [Azure Synapse SQL architecture](overview-architecture.md)
 - [Get Started with Azure Synapse Analytics](../get-started.md)
