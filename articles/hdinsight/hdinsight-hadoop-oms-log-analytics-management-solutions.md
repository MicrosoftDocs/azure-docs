---
title: Add HDInsight cluster management solutions to Azure Log Analytics | Microsoft Docs
description: Learn how to use Azure Log Analytics to create custom views for HDInsight clusters.
services: hdinsight
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: conceptual
ms.date: 06/14/2018
ms.author: nitinme

---
# Add HDInsight cluster management solutions to Log Analytics

HDInsight provides cluster-specific management solutions that you can add for Azure Log Analytics. [Management solutions](../log-analytics/log-analytics-add-solutions.md) add functionality to Log Analytics, providing additional data and analysis tools. These solutions collect important performance metrics from your HDInsight clusters and provide the tools to search the metrics. These solutions also provide visualizations and dashboards for most cluster types supported in HDInsight. By using the metrics that you collect with the solution, you can create custom monitoring rules and alerts. 

In this article, you learn how to add cluster-specific management solutions to a Log Analytics workspace.

## Prerequisites

* You must have configured an HDInsight cluster to use Azure Log Analytics. For instructions, see [Use Azure Log Analytics with HDInsight clusters](hdinsight-hadoop-oms-log-analytics-tutorial.md).

## Add cluster-specific management solutions

The following procedure demonstrates how to add a Hadoop cluster management solution to an existing Log Analytics workspace.

1. Open the OMS dashboard that you have configured for your HDInsight cluster. For the instructions, see [Open the OMS dashboard](./hdinsight-hadoop-oms-log-analytics-tutorial.md#open-the-oms-dashboard).

1. On the dashboard, select **Solutions Gallery** and then select **HDInsight Hadoop Monitoring**:

    ![Add management solution in Log Analytics](./media/hdinsight-hadoop-oms-log-analytics-management-solutions/hdinsight-add-management-solution-oms-portal.png "Add management solution in Operations Management Suite")

    These are the available HDInsight solutions:

    - HDInsight Hadoop Monitoring
    - HDInsight HBase Monitoring (Preview)
    - HDInsight Kafka Monitoring
    - HDInsight Storm Monitoring
    - HDInsight Spark Monitoring
    - HDInsight InteractiveQueryMonitoring

3. In the next screen, select **Add**. It takes a few moments to add the solution. When it is done, you can see a tile on the dashboard for the Hadoop management solution. 

    ![Hadoop management solution added](./media/hdinsight-hadoop-oms-log-analytics-management-solutions/added-Hadoop-management-solution.png "Hadoop management solution added")

## Next steps

* [Query Azure Log Analytics to monitor HDInsight clusters](hdinsight-hadoop-oms-log-analytics-use-queries.md)

## See also

* [Working with Log Analytics](https://blogs.msdn.microsoft.com/wei_out_there_with_system_center/2016/07/03/oms-log-analytics-create-tiles-drill-ins-and-dashboards-with-the-view-designer/)
* [Create alert rules in Log Analytics](../log-analytics/log-analytics-alerts-creating.md)
