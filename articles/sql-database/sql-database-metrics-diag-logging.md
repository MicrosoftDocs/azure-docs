---
title: Azure SQL database metrics & diagnostics logging | Microsoft Docs
description: Learn about configuring Azure SQL Database resource to store resource usage, connectivity, and query execution statistics.
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: 

ms.assetid: 89c2a155-c2fb-4b67-bc19-9b4e03c6d3bc
ms.service: sql-database
ms.custom: secure and protect
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/30/2017
ms.author: carlrab

---
# Azure SQL Database metrics and diagnostics logging 
Azure SQL Database resources can emit metrics and diagnostic logs for easier monitoring. You can configure Azure SQL Database   resource to store resource usage, connectivity, and query execution statistics (Query Store ) into one of these Azure resources:
- **Azure Storage**: For archiving vast amounts of telemetry for a small price
- **Azure Event Hub**: For integrating Azure SQL Database telemetry with your custom monitoring solution or hot pipelines
- **Azure Log Analytics**: For out of the box monitoring solution with reporting, alerting, and mitigating capabilities 


    <img src="./media/sql-database-metrics-diag-logging/architecture.png" alt="architecture" style="width: 780px;" />

## Enable metrics and diagnostics logging

Metrics and diagnostics logging is not enabled by default. You can enable and manage metrics and diagnostics logging using one of the following methods:
- Azure portal
- PowerShell
- Azure CLI
- REST API 
- Resource Manager template

When you enable metrics and diagnostics logging, you need to specify the Azure resource where selected data will be collected. Options available:
- Log analytics
- Event Hub
- Azure Storage 

You can provision a new Azure resource or select an existing resource. After selecting the storage resource, you need to specify which data to collect. Options available include:

- **[1-minute metrics](sql-database-metrics-diag-logging.md#1-minute-metrics)** - contains DTU percentage, DTU limit, CPU percentage, Physical data read percentage, Log write percentage, Successful/Failed/Blocked by firewall connections, sessions percentage, workers percentage, storage, storage percentage, XTP storage percentage
- **[Query Store logs](sql-database-metrics-diag-logging.md#query-store-logs)** - contains query execution statistics in one-hour granularity

If you specify Event Hub or an AzureStorage account, you can specify the retention policy. This policy will delete the data that is older than a selected time period. If you specify Log Analytics, the retention policy depends on the selected pricing tier. Read more about [Log Analytics pricing](https://azure.microsoft.com/pricing/details/log-analytics/). 

We recommend that you read the both [Overview of metrics in Microsoft Azure](../monitoring-and-diagnostics/monitoring-overview-metrics.md) and [Overview of Azure Diagnostic Logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) articles to gain an understanding of not only how to enable logging, but the metrics and log categories supported by the various Azure services. For example, Azure SQL Database currently supports two log categories: Activity log and Query Store.

### Azure portal

To  enable metrics and diagnostic logs collection in the Azure Portal, go to the Azure portal page for your Azure SQL database or elastic pool and then click Diagnostic configuration.

   <img src="./media/sql-database-metrics-diag-logging/enable-portal.png" alt="enable in the Azure portal" style="width: 780px;" />

### PowerShell

To enable metrics and diagnostics logging using PowerShell, use the following commands:

- To enable storage of Diagnostic Logs in a Storage Account, use this command:

    ```Set-AzureRmDiagnosticSetting -ResourceId [your resource id] -StorageAccountId [your storage account id] -Enabled $true```

   The Storage Account ID is the resource id for the storage account to which you want to send the logs.

- To enable streaming of Diagnostic Logs to an Event Hub, use this command:

    ```Set-AzureRmDiagnosticSetting -ResourceId [your resource id] -ServiceBusRuleId [your service bus rule id] -Enabled $true```

   The Service Bus Rule ID is a string with this format:

    ```{service bus resource ID}/authorizationrules/{key name}``` 

- To enable sending of Diagnostic Logs to a Log Analytics workspace, use this command:

     ```Set-AzureRmDiagnosticSetting -ResourceId [your resource id] -WorkspaceId [resource id of the log analytics workspace] -Enabled $true```

- You can obtain the resource id of your Log Analytics workspace using the following command:

    ```(Get-AzureRmOperationalInsightsWorkspace).ResourceId```

   You can combine these parameters to enable multiple output options.


### CLI

To enable metrics and diagnostics logging using the Azure CLI, use the following commands:

- To enable storage of Diagnostic Logs in a Storage Account, use this command:

   ```azure insights diagnostic set --resourceId <resourceId> --storageId <storageAccountId> --enabled true```

   The Storage Account ID is the resource id for the storage account to which you want to send the logs.

- To enable streaming of Diagnostic Logs to an Event Hub, use this command:

   ```azure insights diagnostic set --resourceId <resourceId> --serviceBusRuleId <serviceBusRuleId> --enabled true```

   The Service Bus Rule ID is a string with this format:

   ```{service bus resource ID}/authorizationrules/{key name}```

- To enable sending of Diagnostic Logs to a Log Analytics workspace, use this command:

   ```azure insights diagnostic set --resourceId <resourceId> --workspaceId <resource id of the log analytics workspace> --enabled true```

   You can combine these parameters to enable multiple output options.

### REST API

Read about how to [change Diagnostic settings using the Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931931.aspx). 

### Resource Manager template

Read about how to [enable Diagnostic settings at resource creation using Resource Manager template](../monitoring-and-diagnostics/monitoring-enable-diagnostic-logs-using-template.md). 

## Streaming Azure SQL Database metrics and diagnostics log in Log Analytics 
Azure SQL Database metrics and diagnostic logs can be streamed into Log Analytics using the built-in “Export to Log Analytics” option in the portal, or by enabling Log Analytics in a diagnostic setting via Azure PowerShell cmdlets, Azure CLI or Azure Monitor REST API.

To enable metrics and diagnostic logs collection, see [Enable metrics and diagnostic logging](sql-database-metrics-diag-logging.md#enable-metrics-and-diagnostics-logging).

### Installation overview

Monitoring Azure SQL Database fleet is very simple with Log Analytics. Three steps are required:

1.	Create Log Analytics resource
2.	Configure databases to record metrics and diagnostic logs into the created Log Analytics
3.	Install **Azure SQL DB Monitoring** solution from gallery in Log Analytics

### Create Log Analytics resource

1. Click **New** in the left-hand menu.
2. Click **Monitoring + Management**
3. Click **Log Analytics**
4. Fill in the Log Analytics form with the additional information required: workspace name, subscription, resource group, location, and pricing tier.

   <img src="./media/sql-database-monitoring-log-analytics/log-analytics.png" alt="log analytics" style="width: 780px;" />

### Configure databases to record metrics and diagnostic logs

In the Azure portal, navigate to your Azure SQL Database resource and click **Diagnostics**. For more information, please read how to [Enable metrics and diagnostic logging](sql-database-metrics-diag-logging.md#enable-metrics-and-diagnostics-logging).

Install the Azure SQL DB Monitoring solution from gallery  

## 1-minute metrics

| |  |
|---|---|
|**Resource**|**Metrics**|
|Database|DTU percentage, DTU limit, CPU percentage, Physical data read percentage, Log write percentage, Successful/Failed/Blocked by firewall connections, sessions percentage, workers percentage, storage, storage percentage, XTP storage percentage|
|Elastic pool|eDTU percentage, eDTU limit, CPU percentage, Physical data read percentage, Log write percentage, Successful/Failed/Blocked by firewall connections, sessions percentage, workers percentage, storage, storage percentage, XTP storage percentage |
|||

## Query Store logs

Azure SQL Database Query Store Logs contain execution statistics of the queries executed in Azure SQL Database. Query execution statistics are aggregated for each unique query shape (based on query hash) in one hour intervals and stored into the selected storage in JSON format. 

| |  |  |
|---|---|---|
|**Column name**|**Data type**| **Description**|
|start_time|datetimeoffset|Start time of the interval.|
|end_time|datetimeoffset|End time of the interval.|
|batch_sql_handle|varbinary(64)|ID of the statement batch the query is part of| Populated only if query references temporary tables or table variables.|
|query_hash|binary(8)|MD5 hash of the individual query, based on the logical query tree. Includes optimizer hints.|
|statement_sql_handle|vabinary(64)|SQL handle of the individual query.|
|query_plan_hash|binary(8)|MD5 hash of the individual plan.|
|execution_type|tinyint|Determines type of query execution:|
|||0 – Regular execution (successfully finished)|
|||3 – Client initiated abort or time outs|
|||4 - Exception aborted execution|
|execution_type_desc|nvarchar(128)|Textual description of the execution type field:|
|||0 – Regular|
|||3 – Aborted or time outs|
|||4 - Exception|
|first_execution_time|datetimeoffset|First execution time for the query plan within the aggregation interval.|
|last_execution_time|datetimeoffset|Last execution time for the query plan within the aggregation interval.|
|count_executions|bigint|Total count of executions for the query plan within the aggregation interval.|
|avg_duration|float|Average duration for the query plan within the aggregation interval (reported in microseconds) .|
|last_duration|bigint|Last duration for the query plan within the aggregation interval (reported in microseconds).|
|min_duration|bigint|Minimum duration for the query plan within the aggregation interval (reported in microseconds).|
|max_duration|bigint|Maximum duration for the query plan within the aggregation interval (reported in microseconds).|
|stdev_duration|float|Duration standard deviation for the query plan within the aggregation interval (reported in microseconds).|
|avg_cpu_time|float|Average CPU time for the query plan within the aggregation interval (reported in microseconds).|
|last_cpu_time|bigint|Last CPU time for the query plan within the aggregation interval (reported in microseconds).|
|min_cpu_time|bigint|Minimum CPU time for the query plan within the aggregation interval (reported in microseconds).|
|max_cpu_time|bigint|Maximum CPU time for the query plan within the aggregation interval (reported in microseconds).|
|stdev_cpu_time|float|CPU time standard deviation for the query plan within the aggregation interval (reported in microseconds).|
|avg_logical_io_reads|float|Average number of logical IO reads for the query plan within the aggregation interval.|
|last_logical_io_reads|bigint|Last number of logical IO reads for the query plan within the aggregation interval.|
|min_logical_io_reads|bigint|Minimum number of logical IO reads for the query plan within the aggregation interval.|
|max_logical_io_reads|bigint|Maximum number of logical IO reads for the query plan within the aggregation interval.|
|stdev_logical_io_reads|float|Number of logical IO reads standard deviation for the query plan within the aggregation interval.|
|avg_logical_io_writes|float|Average number of logical IO writes for the query plan within the aggregation interval.|
|last_logical_io_writes|bigint|Last number of logical IO writes for the query plan within the aggregation interval.|
|min_logical_io_writes|bigint|Minimum number of logical IO writes for the query plan within the aggregation interval.|
|max_logical_io_writes|bigint|Maximum number of logical IO writes for the query plan within the aggregation interval.|
|stdev_logical_io_writes|float|Number of logical IO writes standard deviation for the query plan within the aggregation interval.|
|avg_physical_io_reads|float|Average number of physical IO reads for the query plan within the aggregation interval (expressed as a number of 8KB pages read).|
|last_physical_io_reads|bigint|Last number of physical IO reads for the query plan within the aggregation interval (expressed as a number of 8KB pages read).|
|min_physical_io_reads|bigint|Minimum number of physical IO reads for the query plan within the aggregation interval (expressed as a number of 8KB pages read).|
|max_physical_io_reads|bigint|Maximum number of physical IO reads for the query plan within the aggregation interval (expressed as a number of 8KB pages read).|
|stdev_physical_io_reads|float|Number of physical IO reads standard deviation for the query plan within the aggregation interval (expressed as a number of 8KB pages read).|
|avg_dop|float|Average DOP (degree of parallelism) for the query plan within the aggregation interval.|
|last_dop|bigint|Last DOP (degree of parallelism) for the query plan within the aggregation interval.|
|min_dop|bigint|Minimum DOP (degree of parallelism) for the query plan within the aggregation interval.|
|max_dop|bigint|Maximum DOP (degree of parallelism) for the query plan within the aggregation interval.|
|stdev_dop|float|DOP (degree of parallelism) standard deviation for the query plan within the aggregation interval.|
|avg_query_max_used_memory|float|Average memory grant (reported as the number of 8 KB pages) for the query plan within the aggregation interval. Always 0 for queries using natively compiled memory optimized procedures.|
|last_query_max_used_memory|bigint|Last memory grant (reported as the number of 8 KB pages) for the query plan within the aggregation interval. Always 0 for queries using natively compiled memory optimized procedures.|
|min_query_max_used_memory|bigint|Minimum memory grant (reported as the number of 8 KB pages) for the query plan within the aggregation interval. Always 0 for queries using natively compiled memory optimized procedures.|
|max_query_max_used_memory|bigint|Maximum memory grant (reported as the number of 8 KB pages) for the query plan within the aggregation interval. Always 0 for queries using natively compiled memory optimized procedures.|
|stdev_query_max_used_memory|float|Memory grant standard deviation (reported as the number of 8 KB pages) for the query plan within the aggregation interval. Always 0 for queries using natively compiled memory optimized procedures.|
|avg_rowcount|float|Average number of returned rows for the query plan within the aggregation interval.|
|last_rowcount|bigint|Number of returned rows by the last execution of the query plan within the aggregation interval.|
|min_rowcount|bigint|Minimum number of returned rows for the query plan within the aggregation interval.|
|max_rowcount|bigint|Maximum number of returned rows for the query plan within the aggregation interval.|
|stdev_rowcount|float|Number of returned rows standard deviation for the query plan within the aggregation interval.|
|avg_log_bytes_used|float|Average number of bytes in the database log used by the query plan, within the aggregation interval. Applies only to Azure SQL Database.|
|last_log_bytes_used|bigint|Number of bytes in the database log used by the last execution of the query plan, within the aggregation interval. Applies only to Azure SQL Database.|
|min_log_bytes_used|bigint|Minimum number of bytes in the database log used by the query plan, within the aggregation interval. Applies only to Azure SQL Database.|
|max_log_bytes_used|bigint|Maximum number of bytes in the database log used by the query plan, within the aggregation interval. Applies only to Azure SQL Database.|
|stdev_log_bytes_used|float|Standard deviation of the number of bytes in the database log used by a query plan, within the aggregation interval. Applies only to Azure SQL Database.|
||||

## Next steps
Take a look at the examples of how you can best use the different stores for you Azure SQL Database metrics and diagnostic logs.
-	Enable collection of metrics and diagnostic logs for Azure SQL Database [ADD LINK]
-	Monitor Azure SQL Database resources using Log Analytics [ADD LINK]
-	Streaming Azure SQL Database metrics and diagnostic logs into Azure Event Hub [ADD LINK]
-	Storing Azure SQL Database metrics and diagnostics into Azure Storage [ADD LINK]
