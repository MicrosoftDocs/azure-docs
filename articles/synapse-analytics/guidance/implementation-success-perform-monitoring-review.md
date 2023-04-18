---
title: "Synapse implementation success methodology: Perform monitoring review"
description: "Learn how to perform monitoring of your Azure Synapse solution."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/31/2022
---

# Synapse implementation success methodology: Perform monitoring review

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Monitoring is a key part of the operationalization of any Azure solution. This article provides guidance on reviewing and configuring the monitoring of your Azure Synapse Analytics environment. Key to this activity is the identification of what needs to be monitored and who needs to review the monitoring results.

Using your solution requirements and other data collected during the [assessment stage](implementation-success-assess-environment.md) and [solution development](implementation-success-evaluate-solution-development-environment-design.md), build a list of important behaviors and activities that need to be monitored in your production environment. As you build this list, identify the groups of users that will need access to monitoring information and build the procedures they can follow to respond to monitoring results.

You can use [Azure Monitor](../../azure-monitor/overview.md) to provide base-level infrastructure metrics, alerts, and logs for most Azure services. Azure diagnostic logs are emitted by a resource to provide rich, frequent data about the operation of that resource. Azure Synapse can write diagnostic logs in Azure Monitor.

For more information, see [Use Azure Monitor with your Azure Synapse Analytics workspace](../monitoring/how-to-monitor-using-azure-monitor.md).

## Monitor dedicated SQL pools

You can monitor a dedicated SQL pool by using Azure Monitor, altering, dynamic management views (DMVs), and Log Analytics.

- **Alerts:** You can set up alerts that send you an email or call a webhook when a certain metric reaches a predefined threshold. For example, you can receive an alert email when the database size grows too large. For more information, see [Create alerts for Azure SQL Database and Azure Synapse Analytics using the Azure portal](/azure/azure-sql/database/alerts-insights-configure-portal).
- **DMVs:** You can use [DMVs](../sql-data-warehouse/sql-data-warehouse-manage-monitor.md) to monitor workloads to help investigate query executions in SQL pools.
- **Log Analytics:** [Log Analytics](../../azure-monitor/logs/log-analytics-tutorial.md) is a tool in the Azure portal that you can use to edit and run log queries from data collected by Azure Monitor. For more information, see [Monitor workload - Azure portal](../sql-data-warehouse/sql-data-warehouse-monitor-workload-portal.md).

## Monitor serverless SQL pools

You can monitor a serverless SQL pool by [monitoring your SQL requests](../monitoring/how-to-monitor-sql-requests.md) in Synapse Studio. That way, you can keep an eye on the status of running requests and review details of historical requests.

## Monitor Spark pools

You can [monitor your Apache Spark applications](../monitoring/apache-spark-applications.md) in Synapse Studio. That way, you can keep an eye on the latest status, issues, and progress.

You can enable the Synapse Studio connector that's built in to Log Analytics. You can then collect and send Apache Spark application metrics and logs to your Log Analytics workspace. You can also use an Azure Monitor workbook to visualize the metrics and logs. For more information, see [Monitor Apache Spark applications with Azure Log Analytics](../spark/apache-spark-azure-log-analytics.md).

## Monitor pipelines

 Azure Synapse allows you to create complex pipelines that automate and integrate your data movement, data transformation, and compute activities. You can author and monitor pipelines by using Synapse Studio to keep an eye on the latest status, issues, and progress of your pipelines. For more information, see [Use Synapse Studio to monitor your workspace pipeline runs](../monitoring/how-to-monitor-pipeline-runs.md).

## Next steps

For more information about this article, check out the following resources:

- [Synapse implementation success methodology](implementation-success-overview.md)
- [Use Azure Monitor with your Azure Synapse Analytics workspace](../monitoring/how-to-monitor-using-azure-monitor.md)