---
title: Monitor Azure HDInsight
description: Start here to learn how to monitor Azure HDInsight.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: conceptual
ms.service: hdinsight
---

# Monitor Azure HDInsight

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## HDInsight monitoring options

The specific metrics and logs available for your HDInsight cluster depend on your cluster type and tools. Azure HDInsight offers Apache Hadoop, Spark, Kafka, HBase, and Interactive Query cluster types. You can monitor your cluster through the Apache Ambari web UI or in the Azure portal by enabling Azure Monitor integration.

### Apache Ambari monitoring

[Apache Ambari](https://ambari.apache.org) simplifies the management, configuration, and monitoring of HDInsight clusters by providing a web UI and a REST API. Ambari is included on all Linux-based HDInsight clusters. To use Ambari, select **Ambari home** on your HDInsight cluster's **Overview** page in the Azure portal.

For information about how to use Ambari for monitoring, see the following articles:

- [Monitor cluster performance in Azure HDInsight](hdinsight-key-scenarios-to-monitor.md)
- [How to monitor cluster availability with Apache Ambari in Azure HDInsight](hdinsight-cluster-availability.md)

### Azure Monitor integration

You can also monitor your HDInsight clusters directly in Azure. A new Azure Monitor integration, now in preview, lets you access **Insights**, **Logs**, and **Workbooks** from your HDInsight cluster without needing to invoke the Log Analytics workspace.

To use the new Azure Monitor integration, enable it by selecting **Monitor integration** from the **Monitoring** section in the left menu of your HDInsight Azure portal page. You can also use PowerShell or Azure CLI to enable and interact with the new monitoring integration. For more information, see the following articles:

- [Use Azure Monitor logs to monitor HDInsight clusters](hdinsight-hadoop-oms-log-analytics-tutorial.md)
- [Log Analytics migration guide for Azure HDInsight clusters](log-analytics-migration.md)

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

### Insights cluster portal integration

After enabling Azure Monitor integration, you can select **Insights (Preview)** in the left menu of your HDInsight Azure portal page to see an out-of-box, automatically populated logs and metrics visualization dashboard specific to your cluster's type. The insights dashboard uses a prebuilt [Azure Workbook](/azure/azure-monitor/visualize/workbooks-overview) that has sections for each cluster type, YARN, system metrics, and component logs.

:::image type="content" source="./media/log-analytics-migration/visualization-dashboard.png" lightbox="./media/log-analytics-migration/visualization-dashboard.png" alt-text="Screenshot that shows the visualization dashboard.":::

These detailed graphs and visualizations give you deep insights into your cluster's performance and health. For more information, see [Use HDInsight out-of-box Insights to monitor a single cluster](hdinsight-hadoop-oms-log-analytics-tutorial.md#use-hdinsight-out-of-box-insights-to-monitor-a-single-cluster).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure HDInsight, see [HDInsight monitoring data reference](monitor-hdinsight-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

HDInsight stores its log files both in the cluster file system and in Azure Storage. Due to the large number and size of log files, it's important to optimize log storage and archiving to help with cost management. For more information, see [Manage logs for an HDInsight cluster](hdinsight-log-management.md).

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of metrics automatically collected for HDInsight, see [HDInsight monitoring data reference](monitor-hdinsight-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

### Agent-collected logs

HDInsight doesn't produce resource logs by the usual method. Instead, it collects logs from inside the HDInsight cluster and sends them to Azure Monitor Logs / Log Analytics tables using the [Log Analytics Agent](/azure/azure-monitor/agents/log-analytics-agent).

An HDInsight cluster produces many log files, such as:

- Job execution logs
- YARN log Resource Manager files
- Script action logs
- Ambari cluster alerts status
- Ambari system metrics
- Security logs
- Hadoop activity logged to the controller, stderr, and syslog log files

The specific logs available depend on your cluster framework and tools. Once you enable Azure Monitor integration for your cluster, you can view and query on any of these logs.

- For more information about the logs collected, see [Manage logs for an HDInsight cluster](hdinsight-log-management.md).
- For available Log Analytics and Azure Monitor tables and logs schemas for HDInsight, see [HDInsight monitoring data reference](monitor-hdinsight-reference.md#resource-logs).

### Selective logging

HDInsight clusters can collect many verbose logs. To help save on monitoring and storage costs, you can enable the selective logging feature by using script actions for HDInsight in the Azure portal. Selective logging lets you turn on and off different logs and metric sources available through Log Analytics. With this feature, you only have to pay for what you use.

You can configure log collection and analysis to enable or disable tables in the Log Analytics workspace and adjust the source type for each table. For detailed instructions, see [Use selective logging with a script action in Azure HDInsight](selective-logging-analysis.md).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

Azure Monitor Logs collects data from your HDInsight cluster resources and from other monitoring tools, and uses the data to provide analysis across multiple sources.

- You must configure Azure Monitor integration to be able to view and analyze cluster logs directly from your cluster. For more information, see [How to monitor cluster availability with Azure Monitor logs in HDInsight](cluster-availability-monitor-logs.md).

- A new Azure Monitor integration (preview) for HDInsight is replacing Log Analytics. For more information, see [Log Analytics migration guide for Azure HDInsight clusters](log-analytics-migration.md).

- For basic scenarios using Azure Monitor logs to analyze HDInsight cluster metrics and create event alerts, see [Query Azure Monitor logs to monitor HDInsight clusters](hdinsight-hadoop-oms-log-analytics-use-queries.md).

- For detailed instructions on how to enable Azure Monitor logs and add a monitoring solution for Hadoop cluster operations, see [Use Azure Monitor logs to monitor HDInsight clusters](hdinsight-hadoop-oms-log-analytics-tutorial.md).

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

After you enable Azure Monitor integration, you can select **Logs (preview)** in the left navigation for your HDInsight portal page, and then select the **Queries** tab to see example queries for your cluster. For example, the following query lists all known computers that didn't send a heartbeat in the past five hours.

```kusto
// Unavailable computers 
Heartbeat
| summarize LastHeartbeat=max(TimeGenerated) by Computer
| where LastHeartbeat < ago(5h)
```

The following query gets the top 10 resource intensive queries, based on CPU consumption, in the past 24 hours.

```kusto
// Top 10 resource intensive queries 
LAQueryLogs
| top 10 by StatsCPUTimeMs desc nulls last
```

> [!IMPORTANT]
> The new Azure Monitor integration implements new tables in the Log Analytics workspace. To remove as much ambiguity as possible, there are fewer schemas, and the schema formatting is better organized and easier to understand.
> 
> The new monitoring integration in the Azure portal uses the new tables, but you must rework older queries and dashboards to use the new tables. For the log table mappings from the classic Azure Monitor integration to the new tables, see [Log table mapping](monitor-hdinsight-reference.md#log-table-mapping).

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### HDInsight alert rules

After you enable Azure Monitor integration, you can select **Alerts** in the left navigation for your HDInsight portal page, and then select **Create alert rule** to configure alerts. You can base an alert on any Log Analytics query, or use signals from metrics or the activity log.

The following table describes a couple of alert rules for HDInsight. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [HDInsight monitoring data reference](monitor-hdinsight-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| Metric| Pending CPU | Whenever the maximum pending CPU is greater or less than dynamic threshold|
| Activity log| Delete cluster | Whenever the Activity Log has an event with Category='Administrative', Signal name='Delete Cluster (HDInsight Cluster)'|

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [HDInsight monitoring data reference](monitor-hdinsight-reference.md) for a reference of the metrics, logs, and other important values created for HDInsight.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
