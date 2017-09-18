---
title: Intelligent Insights performance diagnostics log for Azure SQL Database | Microsoft Docs
description: Intelligent Insights lets you know what is happening with your database performance.”
services: sql-database
documentationcenter: ''
author: danimir
manager: drasumic
editor: carlrab

ms.assetid: 
ms.service: sql-database
ms.custom: monitor & tune
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: NA
ms.date: 09/25/2017
ms.author: v-daljep

---
# Intelligent Insights

***&#8220;Intelligent Insights lets you know what is happening with your database performance.&#8221;***

Azure SQL Database built-in intelligence continuously monitors database usage through **artificial intelligence** and detects disruptive events that cause poor performance. Once detected, a detailed analysis is performed generating a diagnostic log with intelligent assessment of the issue. This assessment consists of a root cause analysis of the database performance issue and recommendations for performance improvements – that is ***&#8220;intelligent insights.&#8221;*** 

## What can Intelligent Insights do for you

Intelligent Insights is a unique capability of Azure’s built-in intelligence providing the following value:

- Proactive monitoring
- Tailored performance insights
- Early detection of database performance degradation
- Root Cause Analysis (RCA) of issues detected
- Performance improvement recommendations
- Scale out capability on hundreds of thousands of databases
- Positive impact to DevOps resources and the total cost of ownership

## How does Intelligent Insights work

Intelligent Insights analyzes database usage based on the previous 1-hour usage patterns and compares them with the last 7-days database performance baseline. The usage is composed of the queries from the workload determined to be the most significant to the database performance - such are, for example, most repeated and sizeable queries. Each database is unique based on its structure, data, usage, and application due to which each baseline generated is specific and unique to an individual instance. Intelligent Insights, independent of database usage baseline, also monitors absolute operational thresholds and detects issues with excessive wait times, critical exceptions, and issues with query parameterizations that might affect the performance. 

Once performance degradation issue is detected from multiple observed metrics using artificial intelligence, analysis is performed outputting a diagnostic log with an intelligent insight on what is happening with your database. Intelligent Insights makes it easy to track the database performance issue from its first appearance until resolution. This is achieved through tracking states of each detected issue through its lifecycle from initial issue detection, verification of performance improvement and its completion. Updates are provided in the diagnostic log every 15 minutes. 

![Server](./media/sql-database-intelligent-insights/intelligent-insights-concept.png)

Metrics used to measure and detect database performance issues are based on query duration, timeout requests, excessive wait times, and errored request and are further elaborated in [Detection Metrics](sql-database-intelligent-insights.md#Detection%20Metrics) section of this document.

## Degradations detected

Identified Azure SQL Database performance degradations are recorded in the diagnostics log with intelligent entries consisting of the following properties:

| Property             | Details              |
| :------------------- | ------------------- |
| Database information  | Metadata about a database on which an insight was detected, such as resource URI |
| Observed time range | Start and end time for the period of detected insight |
| Impacted metrics | Particular metrics causing an insight to be generated: |
||- Query duration increase [sec]|
||- Excessive waiting [sec]|
||- Timed out requests [%]|
||- Errored out requests [%] |
| Impact value | Value of a metric measured |
| Impacted queries and error codes | Query hash or error code. These can be used to easily correlate to a particular query impacted. Metric of an impact to the query with specific values is provided consisting of either query duration increase, waiting time, timeout counts, or error codes. |
| Detections | Detection identified at the database during the time of an event. There are 15 detection patterns. See [Troubleshoot database performance issues with Intelligent Insights](sql-database-intelligent-insights-troubleshoot-performance.md). |
| Root-cause analysis | Root Cause Analysis (RCA) of the issue identified in a humanly readable format. Some insights might contain a performance improvement recommendation where possible. |
|||

## Issues state lifecycle: Active, Verifying, and Completed

Performance issues recorded in the diagnostic log are flagged with one of the three states of an issue lifecycle: Active, Verifying and Completed. Once a performance issue is detected, and as long it is deemed by Azure SQL built-in intelligence as present, the issue is flagged as ***&#8220;Active.&#8221;*** At the point in time when the issue is considered as mitigated, it is verified and the issue status is changed to ***&#8220;Verifying&#8221;***. Once Azure SQL built-in intelligence considers the issue as resolved, the issue status is flagged to ***&#8220;Completed.&#8221;***

## Using Intelligent Insights

Intelligent Insights diagnostics log can be sent to [Azure Log Analytics](https://azure.microsoft.com/services/log-analytics/), [Azure Event Hub](https://azure.microsoft.com/services/event-hubs/), and [Azure Storage](https://azure.microsoft.com/services/storage/) as described at [Azure SQL Database metrics and diagnostics logging](sql-database-metrics-diag-logging.md). Once the log is sent to one of these targets, the log can be used for custom alerting and monitoring development using Microsoft or third-party tools.

## Built in Intelligent Insights analytics with Azure Log Analytics 

Azure Log Analytics solution provides reporting and alerting capabilities on top of the Intelligent Insights diagnostics log data. The following is an example of the Intelligent Insights report in Azure SQL Analytics.

![Server](./media/sql-database-intelligent-insights/intelligent-insights-azure-sql-analytics.png)

Once Intelligent Insights diagnostics log has been configured to stream data to Azure SQL Analytics, you can [Monitor Azure SQL Database using Azure SQL Analytics](../log-analytics/log-analytics-azure-sql.md).

## Custom integrations of Intelligent Insights Log

For custom alerting and monitoring development, using Microsoft or third-party tools, see [Use Intelligent Insights database performance diagnostics log document](sql-database-intelligent-insights-use-diagnostics-log.md)

## How to set up Intelligent Insights with Azure Event Hub

- Configure Intelligent Insights to stream the log events in to the Azure Event Hub through [Stream Azure Diagnostic Logs to Event Hubs](../monitoring-and-diagnostics/monitoring-stream-diagnostic-logs-to-event-hubs.md).
- Use Azure Event Hub for custom monitoring and alerting through [What to do with metrics and diagnostics logs in Event Hub](sql-database-metrics-diag-logging.md#stream-into-azure-storage). 

## How to set up Intelligent Insights with Azure Storage

- Configure Intelligent Insights to be stored with Azure Storage through [Stream into Azure Storage](sql-database-metrics-diag-logging.md#stream-into-azure-storage).

## Detection metrics

Metrics used for detection models that generate intelligent insights are based on measuring the following metrics:

- Query duration
- Timeout requests
- Excessive wait time 
- Errored out requests

The preceding metrics are continuously collected as an independent measurement. Query duration and timeout requests are used as primary models used to detect issues with database workload performance as they directly measure what is happening with the workload performance. In order to detect all cases of possible workload performance degradation, excessive wait time and errored out requests are additional models used to indicate issue affecting the workload performance.

Multiple metrics collected are used in various relationships through a scientifically derived data model categorizing each performance issue detected. Information provided through an intelligent insight includes details of the performance issue detected, a root cause analysis of the issue occurrence, and recommendations on how to improve the performance of Azure SQL Database monitored in cases where possible.

## Query duration

Query duration degradation model analyzes individual queries and detects increase in time it takes to compile and execute a query compared to the past performance baseline. 

When Azure SQL Database built-in intelligence detects an increase in a query compile or query execution time with sufficient significance to have a relevant impact to the overall performance, these queries are flagged to have the query duration performance degradation issue.

The Intelligent Insights diagnostics log outputs the query hash of the query detected to have degraded in performance, indication if the performance degradation was related to query compile or execution time increase, and measured time of increased query duration.

## Timeout requests

Timeout requests degradation model analyzes individual queries and detects increase in timeouts at the query execution level, and the overall request timeouts at the database level compared to the past measured performance period. 

Since some of the queries might time out even before reaching the execution stage, Azure SQL Database built-in intelligence also measures and analyzes, through the means of aborted workers versus requests made, all queries that have reached the database regardless of having reached the execution stage or not. 

Once the number of timeouts for executed queries, or the number of aborted request workers has increased above the system-managed threshold, a diagnostic log is populated with intelligent insights.

The insights generated contain the number of timed out requests, number of timed out queries and indication if the performance degradation was related to timeout increase at the execution stage, or the overall database level. When the increase in timeouts is deemed as statistically significant to database performance, these queries are flagged to have a timeout performance degradation issue. 

The system automatically takes into consideration changes to the workload and changes in the number of query requests made to the database to dynamically determine the normal and out of the ordinary database performance thresholds.

## Excessive wait times

Excessive wait time model monitors individual database queries and it detects unusually high query wait stats above the system-managed absolute thresholds. The following query excessive wait time metrics are observed utilizing the new SQL Server engine Server Query Store Wait Stats (sys.query_store_wait_stats) feature:

- Reaching resource limits
- Reaching elastic pool resource limits
- Excessive number of worker or session threads
- Excessive database locking
- Memory pressure
- Other wait stats

Reaching resource limits or elastic pool resource limits denotes that consumption of available resources on a subscription, or in the elastic pool has increased above absolute thresholds indicating workload performance degradation. Excessive number of worker or session threads denotes a detection in which number of worker threads or sessions initiated has reached above absolute thresholds indicating workload performance degradation.

Excessive database locking denotes a detection in which the count of locks on a database has reached over an absolute threshold indicating a workload performance degradation. Memory pressure detection denotes a detection through which the number of threads requesting memory grants has increased above an absolute threshold indicating a workload performance degradation.

Other wait stats indicate a detection of miscellaneous other wait stats measured through the Server Query Store Wait Stats that are reaching above an measured absolute threshold indicating a workload performance degradation.

Once excessive wait times are detected, the Intelligent Insights diagnostics log outputs, depending on the data available, hashes of affecting and affected queries degraded in performance, particular details of the metrics causing queries to wait in execution and measured wait time affecting the performance.

## Errored requests

Errored requests degradation monitors individual queries and detects an increase in the number of queries that have errored out compared to the last measured period. This model also monitors critical exceptions that have reached absolute thresholds managed by Azure Database built-in intelligence. The system automatically takes into consideration the number of query requests made to the database and accounts for any workload changes in the monitored period.

When the measured increase in errored requests in relationship with the number of requests made in the measured period is deemed as statistically significant to have a relevant impact to the database workload, these queries are flagged to have the errored requests workload degradation issue. 

The Intelligent insights log outputs the count of errored requests, indication if the performance degradation was related to increase in errored requests compared to the last measured period or through reaching one of the monitored critical exception thresholds, measured time of the performance degradation, and cumulative time of degradation since the issue was initially detected.

In case any of the measured critical exceptions that have reached above the absolute thresholds managed by the system, an intelligent insight is generated with critical exception details.

## Next steps
* [Troubleshoot Azure SQL Database performance issues with Intelligent Insights](sql-database-intelligent-insights-troubleshoot-performance.md)
* [Use Intelligent Insights Azure SQL Database performance diagnostics log](sql-database-intelligent-insights-use-diagnostics-log.md)
* [Monitor Azure SQL Database using Azure SQL Analytics](../log-analytics/log-analytics-azure-sql.md)
* [Collect and consume log data from your Azure resources](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md)
* [Troubleshoot Azure SQL Database performance issues](sql-database-troubleshoot-performance.md)

