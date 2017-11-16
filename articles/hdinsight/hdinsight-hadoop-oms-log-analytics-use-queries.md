---
title: Query Azure Log Analytics to monitor Azure HDInsight clusters | Microsoft Docs
description: Learn how to run queries on Azure Log Analytics to monitor jobs running in an HDInsight cluster.
services: hdinsight
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/08/2017
ms.author: nitinme

---
# Query Azure Log Analytics to monitor HDInsight clusters

Learn some basic scenarios on how to use Azure Log Analytics to monitor Azure HDInsight clusters:

* [Analyze HDInsight cluster metrics](#analyze-hdinsight-cluster-metrics)
* [Search for specific log messages](#search-for-specific-log-messages)
* [Create event alerts](#create-alerts-for-tracking-events)

## Prerequisites

* You must have configured an HDInsight cluster to use Azure Log Analytics. For instructions, see [Use Azure Log Analytics with HDInsight clusters](hdinsight-hadoop-oms-log-analytics-tutorial.md).

* You must have added the HDInsight cluster-specific management solutions to the OMS workspace as described in [Add HDInsight cluster management solutions to Log Analytics](hdinsight-hadoop-oms-log-analytics-management-solutions.md).

## Analyze HDInsight cluster metrics

Learn how to look for specific metrics for your HDInsight cluster.

1. Open an HDInsight cluster that you have associated with Azure Log Analytics in the Azure portal.
2. Click **Monitoring**, and then click **Open OMS Dashboard**.

    ![Open OMS dashboard](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-open-oms-dashboard.png "Open OMS dashboard")

2. Click **Log Search** on the left menu.

    ![Open Log Search](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-click-log-search.png "Open Log Search")

3. Type the following query in the search box to search for all metrics for all available metrics for all HDInsight clusters configured to use Azure Log Analytics, and then press **ENTER**.

        `search *` 

    ![Search all metrics](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-search-all-metrics.png "Search all metrics")

    The output shall look like:

    ![Search all metrics output](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-search-all-metrics-output.png "Search all metrics output")

5. From the left pane, under **Type**, select a metric that you want to dig deep into, and then click **Apply**. The following screenshot shows the `metrics_resourcemanager_queue_root_default_CL` type is selected. 

    > [!NOTE]
    > You may need to click the **[+]More** button to find the metric you are looking for. Also, the **Apply** button is at the bottom of the list so you must scroll down to see it.
    > 
    >    

    Notice that the query in the text box changes to one shown in the highlighted box in the following screenshot:

    ![Search for specific metrics](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-search-specific-metrics.png "Search for specific metrics")

6. To dig deeper into this specific metric. For example, you can refine the existing output based on the average of resources used in a 10-minute interval, categorized by cluster name using the following query:

        search in (metrics_resourcemanager_queue_root_default_CL) * | summarize AggregatedValue = avg(UsedAMResourceMB_d) by ClusterName_s, bin(TimeGenerated, 10m)

7. Instead of refining based on the average of resources used, you can use the following query to refine the results based on when the maximum resources were used (as well as 90th and 95th percentile) in a 10-minute window:

        search in (metrics_resourcemanager_queue_root_default_CL) * | summarize ["max(UsedAMResourceMB_d)"] = max(UsedAMResourceMB_d), ["pct95(UsedAMResourceMB_d)"] = percentile(UsedAMResourceMB_d, 95), ["pct90(UsedAMResourceMB_d)"] = percentile(UsedAMResourceMB_d, 90) by ClusterName_s, bin(TimeGenerated, 10m)

## Search for specific log messages

Learn how to  look error messages during a specific time window. The steps here are just one example on how you can arrive at the error message you are interested in. You can use any property that is available to look for the errors you are trying to find.

1. Open an HDInsight cluster that you have associated with Azure Log Analytics in the Azure portal.
2. Click **Monitoring**, and the click **Open OMS Dashboard**.

    ![Open OMS dashboard](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-open-oms-dashboard.png "Open OMS dashboard")

2. In the OMS dashboard, from the home screen, click **Log Search**.

    ![Open Log Search](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-click-log-search.png "Open Log Search")

3. Type the following query to search for all error messages for all HDInsight clusters configured to use Azure Log Analytics, and then press **ENTER**. 

         search "Error"

    You shall see an output like the following output:

    ![Search all errors output](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-search-all-errors-output.png "Search all errors output")

5. From the left pane, under **Type** category, select an error type that you want to dig deep into, and then click **Apply**.  Notice the results are refined to only show the error of the type you selected.
7. You can dig deeper into this specific error list by using the options available in the left pane. For example, 

    - To see error messages from a specific worker node:

        ![Search for specific errors output](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-search-specific-error-refined.png "Search for specific errors output")

    - To see an error occurred at a certain time:

        ![Search for specific errors output](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-search-specific-error-time.png "Search for specific errors output")

9. To see the specific error. You can click **[+]show more** to look at the actual error message.

    ![Search for specific errors output](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-search-specific-error-arrived.png "Search for specific errors output")

## Create alerts for tracking events

The first step to create an alert is to arrive at a query based on which the alert is triggered. For simplicity, let's use the following query that provides list of failed applications running on HDInsight clusters.

    metrics_resourcemanager_queue_root_default_CL | where AppsFailed_d > 0

You can use any query that you want to create an alert.

1. Open an HDInsight cluster that you have associated with Azure Log Analytics in the Azure portal.
2. Click **Monitoring**, and then click **Open OMS Dashboard**.

    ![Open OMS dashboard](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-open-oms-dashboard.png "Open OMS dashboard")

2. In the OMS dashboard, from the home screen, click **Log Search**.

    ![Open Log Search](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-click-log-search.png "Open Log Search")

3. Run the following query on which you want to create an alert, and then press **ENTER**.

        metrics_resourcemanager_queue_root-default-CL | where AppsFailed_d > 0

4. Click **Alert** on the top of the page.

    ![Enter query to create an alert](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-create-alert-query.png "Enter query to create an alert")

4. In the **Add Alert Rule** window, enter the query and other details to create an alert, and then click **Save**.

    ![Enter query to create an alert](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-create-alert.png "Enter query to create an alert")

    The screenshot shows the configuration for sending an e-mail notification when the alert query returns an output.

5. You can also edit or delete an existing alert. To do so, from any page in the OMS portal, click the **Settings** icon.

    ![Enter query to create an alert](./media/hdinsight-hadoop-oms-log-analytics-use-queries/hdinsight-log-analytics-edit-alert.png "Enter query to create an alert")

6. From the **Settings** page, click **Alerts** to see the alerts you have created. You can also enable or disable an alert, edit it, or delete it. For more information, see [Working with alert rules in Log Analytics](../log-analytics/log-analytics-alerts-creating.md).

## See also

* [Working with OMS Log Analytics](https://blogs.msdn.microsoft.com/wei_out_there_with_system_center/2016/07/03/oms-log-analytics-create-tiles-drill-ins-and-dashboards-with-the-view-designer/)
* [Create alert rules in Log Analytics](../log-analytics/log-analytics-alerts-creating.md)
