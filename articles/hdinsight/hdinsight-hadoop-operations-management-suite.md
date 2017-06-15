---
title: Use Log Analytics with with Azure HDInsight clusters | Microsoft Docs
description: Learn how to use Azure Log Analytics to monitor jobs running in an HDInsight cluster.
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
ms.date: 06/30/2017
ms.author: nitinme

---
# Use Azure Log Analytics with HDInsight clusters 

Learn how to use the Log Analytics service, which is part of Azure Operations Management Suite (OMS), with HDInsight Hadoop clusters to monitor cluster operations.

   
## Prerequisites

* **An Azure subscription**. Before you begin this tutorial, you must have an Azure subscription. See [Create your free Azure account today](https://azure.microsoft.com/free).

* **An Azure HDInsight cluster**. Currently, you can use Azure OMS with Hadoop, Spark, etc. For instructions on how to create an HDInsight cluster, see [Get started with Azure HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md).
>>>> TBD >>>>. Add the cluster support matrix.

* **A Log Analytics workspace**. For instructions, see [Create a Log Analytics workspace](../log-analytics/log-analytics-get-started.md#2-create-a-workspace).

## Configure HDInsight cluster to use Azure Log Analytics

In this section, you configure an existing HDInsight Hadoop cluster to use an Azure Log Analytics workspace to monitor jobs, debug logs, etc.

1. In the Azure Portal, from the left pane, click **HDInsight clusters**, and then click the name of the cluster you want to configure with Azure Log Analytics.

2. In the cluster blade, from the left pane, click **Monitoring**.

3. In the right pane, click **Enable**, and then select an existing Log Analytics workspace. Click **Save**.

    ![Enable monitoring for HDInsight clusters](./media/hdinsight-hadoop-operations-management-suite/hdinsight-enable-monitoring.png "Enable monitoring for HDInsight clusters")

4. Once the cluster is configured to use Log Analytics for monitoring, you will see an **Open OMS Dashboard** option at the top of the tab. Click the button.

    ![Open OMS dashboard](./media/hdinsight-hadoop-operations-management-suite/hdinsight-enable-monitoring-open-workspace.png "Open OMS dashboard")

5. Enter your Azure credentials if prompted. You will be directed to the Microsoft Operations Management Suite.

    ![Operations Management Suite portal](./media/hdinsight-hadoop-operations-management-suite/hdinsight-enable-monitoring-oms-portal.png "Operations Management Suite portal")

## See also
* [Overview: Apache Spark on Azure HDInsight](hdinsight-apache-spark-overview.md)
