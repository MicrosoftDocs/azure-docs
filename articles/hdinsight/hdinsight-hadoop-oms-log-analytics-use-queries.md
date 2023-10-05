---
title: Query Azure Monitor logs to monitor Azure HDInsight clusters 
description: Learn how to run queries on Azure Monitor logs to monitor jobs running in an HDInsight cluster.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 09/15/2023
---

# Query Azure Monitor logs to monitor HDInsight clusters

Learn some basic scenarios on how to use Azure Monitor logs to monitor Azure HDInsight clusters:

* [Analyze HDInsight cluster metrics](#analyze-hdinsight-cluster-metrics)
* [Create event alerts](#create-alerts-for-tracking-events)

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## Prerequisites

You must have configured an HDInsight cluster to use Azure Monitor logs, and added the HDInsight cluster-specific Azure Monitor logs monitoring solutions to the workspace. For instructions, see [Use Azure Monitor logs with HDInsight clusters](hdinsight-hadoop-oms-log-analytics-tutorial.md).

## Analyze HDInsight cluster metrics

Learn how to look for specific metrics for your HDInsight cluster.

1. Open the Log Analytics workspace that is associated to your HDInsight cluster from the Azure portal.
1. Under **General**, select **Logs**.
1. Type the following query in the search box to search for all metrics for all available metrics for all HDInsight clusters configured to use Azure Monitor logs, and then select **Run**. Review the results.

    ```kusto
    search *
    ```

    :::image type="content" source="./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-search-all-metrics.png" alt-text="Apache Ambari analytics search all metrics":::

1. From the left menu, select the **Filter** tab.

1. Under **Type**, select **Heartbeat**. Then select **Apply & Run**.

    :::image type="content" source="./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-search-specific-metrics.png" alt-text="log analytics search specific metrics":::

1. Notice that the query in the text box changes to:

    ```kusto
    search *
    | where Type == "Heartbeat"
    ```

1. You can dig deeper by using the options available in the left menu. For example:

   - To see logs from a specific node:

     :::image type="content" source="./media/hdinsight-hadoop-oms-log-analytics-use-queries/log-analytics-specific-node.png" alt-text="Search for specific errors output1":::

   - To see logs at certain times:

     :::image type="content" source="./media/hdinsight-hadoop-oms-log-analytics-use-queries/log-analytics-specific-time.png" alt-text="Search for specific errors output2":::

1. Select **Apply & Run** and review the results. Also note that the query was updated to:

    ```kusto
    search *
    | where Type == "Heartbeat"
    | where (Computer == "zk2-myhado") and (TimeGenerated == "2019-12-02T23:15:02.69Z" or TimeGenerated == "2019-12-02T23:15:08.07Z" or TimeGenerated == "2019-12-02T21:09:34.787Z")
    ```

### Additional sample queries

A sample query based on the average of resources used in a 10-minute interval, categorized by cluster name:

```kusto
search in (metrics_resourcemanager_queue_root_default_CL) * 
| summarize AggregatedValue = avg(UsedAMResourceMB_d) by ClusterName_s, bin(TimeGenerated, 10m)
```

Instead of refining based on the average of resources used, you can use the following query to refine the results based on when the maximum resources were used (as well as 90th and 95th percentile) in a 10-minute window:

```kusto
search in (metrics_resourcemanager_queue_root_default_CL) * 
| summarize ["max(UsedAMResourceMB_d)"] = max(UsedAMResourceMB_d), ["pct95(UsedAMResourceMB_d)"] = percentile(UsedAMResourceMB_d, 95), ["pct90(UsedAMResourceMB_d)"] = percentile(UsedAMResourceMB_d, 90) by ClusterName_s, bin(TimeGenerated, 10m)
```

## Create alerts for tracking events

The first step to create an alert is to arrive at a query based on which the alert is triggered. You can use any query that you want to create an alert.

1. Open the Log Analytics workspace that is associated to your HDInsight cluster from the Azure portal.
1. Under **General**, select **Logs**.
1. Run the following query on which you want to create an alert, and then select **Run**.

    ```kusto
    metrics_resourcemanager_queue_root_default_CL | where AppsFailed_d > 0
    ```

    The query provides list of failed applications running on HDInsight clusters.

1. Select **New alert rule** on the top of the page.

    :::image type="content" source="./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-create-alert-query.png" alt-text="New alert rule":::

1. In the **Create rule** window, enter the query and other details to create an alert, and then select **Create alert rule**.

    :::image type="content" source="./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-create-alert.png" alt-text="Define alert condition.":::

### Edit or delete an existing alert

1. Open the Log Analytics workspace from the Azure portal.

1. From the left menu, under **Monitoring**, select **Alerts**.

1. Towards the top, select **Manage alert rules**.

1. Select the alert you want to edit or delete.

1. You have the following options: **Save**, **Discard**, **Disable**, and **Delete**.

    :::image type="content" source="media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-edit-alert.png" alt-text="HDInsight Azure Monitor logs alert delete edit":::

For more information, see [Create, view, and manage metric alerts using Azure Monitor](../azure-monitor/alerts/alerts-metric.md).

## See also

* [Get started with log queries in Azure Monitor](../azure-monitor/logs/get-started-queries.md)
* [Create custom views by using View Designer in Azure Monitor](/previous-versions/azure/azure-monitor/visualize/view-designer)
