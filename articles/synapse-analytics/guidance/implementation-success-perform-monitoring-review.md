---
title: Perform monitoring review
description: TODO (post-golive)
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 02/28/2022
---

# Perform monitoring review

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Monitoring is a key part of the operationalizing of any Azure Solution. Below is some guidance on reviewing and configuring the monitoring of your Azure Synapse environment. Key to this activity will be the identification of what needs to be monitored and who needs to be able to review the results of active monitoring. Using your solution requirements and other data collected during the assessment and during solution development, build a list of important behaviors and activities that need to be monitored in your live environment. As you build this list identify the user groups that will need access to this monitoring information and build the procedures to be followed in reaction to monitoring results. A multitude of activities can be monitored within Azure and we will focus here on monitoring the data and pipeline components of Azure Synapse Analytics.

## Azure Monitor

[Azure Monitor](../../azure-monitor/overview.md) provides base-level infrastructure metrics, alerts, and logs for most Azure services. Azure diagnostic logs are emitted by a resource and provide rich, frequent data about the operation of that resource. Azure Synapse Analytics can write diagnostic logs in Azure Monitor.

## Workspaces

The following article explains [how to monitor](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/synapse-analytics/monitoring/how-to-monitor-using-azure-monitor.md) a Synapse Analytics workspace using Azure Monitor.

## SQL pools (Dedicated)

Monitoring a dedicated SQL Pool can be done in a number of ways:

- Azure Monitor
- TODO: Alerting?
- Dynamic Management Views (DMV)
- Log Analytics

### Azure Monitor

How to use [Azure Monitor](../monitoring/how-to-monitor-using-azure-monitor.md) to Monitor Azure Synapse SQL Pools.

### Alerting

Alerts can send you an email or call a webhook when some metric (for example database size or CPU usage) reaches the threshold. For more information, see [Create alerts for Azure SQL Database and Azure Synapse Analytics using the Azure portal](/azure/azure-sql/database/alerts-insights-configure-portal).

### Dynamic Management Views

Using [Dynamic Management Views](../sql-data-warehouse/sql-data-warehouse-manage-monitor.md) (DMVs) to monitor your workload including investigating query execution in SQL pool.

### Log Analytics

Log Analytics is a tool in the Azure Portal to edit and run log queries from data collected by Azure Monitor Logs and interactively analyze their results. You can use Log Analytics queries to retrieve records matching particular criteria, identify trends, analyze patterns, and provide a variety of insights into your data.

[Setup and configure Log Analytics](../sql-data-warehouse/sql-data-warehouse-monitor-workload-portal.md) for SQL pool.

[Log Analyitcs Tutorial](../../azure-monitor/logs/log-analytics-tutorial.md)

## SQL pools (Serverless)
  
### Monitoring SQL requests with Synapse Studio

This article explains how to [monitor your SQL requests](../monitoring/how-to-monitor-sql-requests.md), allowing you to keep an eye on the status of running requests and discover details of historical requests.

## Spark pools

This [article](../monitoring/apache-spark-applications.md) explains how to monitor your Apache Spark applications, allowing you to keep an eye on the latest status, issues, and progress.

In this [tutorial](../spark/apache-spark-azure-log-analytics.md), you will learn how to enable the Synapse built-in Azure Log Analytics connector for collecting and sending the Apache Spark application metrics and logs to your Azure Log Analytics workspace. You can then leverage an Azure monitor workbook to visualize the metrics and logs.

## Pipelines

With Azure Synapse Analytics, you can create complex pipelines that can automate and integrate your data movement, data transformation, and compute activities within your solution. You can author and monitor these pipelines using Synapse Studio.

This article explains how to [monitor your pipeline](../monitoring/how-to-monitor-pipeline-runs.md) runs, which allows you to keep an eye on the latest status, issues, and progress of your pipelines.

## Conclusion

Over time what you choose to monitor and how you choose to monitor will change as will the importance of different processes and systems.  Configuration of monitoring in Azure is not a one time activity and review of what is being monitored and the value of the data collected should be reevaluated periodically so that the most useful information is always available for review.

## Next steps

TODO
