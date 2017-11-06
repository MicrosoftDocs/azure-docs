---
title: Use Interactive Query with Azure HDInsight | Microsoft Docs
description: Learn how to use Interactive Query (Hive LLAP) with HDInsight.
keywords: ''
services: hdinsight
documentationcenter: ''
tags: azure-portal
author: mumian
manager: jhubbard
editor: cgronlun

ms.assetid: 0957643c-4936-48a3-84a3-5dc83db4ab1a
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/11/2017
ms.author: jgao

---
# Use Interactive Query with HDInsight
Interactive Query (also called Hive LLAP, or [Live Long and Process](https://cwiki.apache.org/confluence/display/Hive/LLAP)) is an Azure HDInsight [cluster type](hdinsight-hadoop-provision-linux-clusters.md#cluster-types). Interactive Query supports in-memory caching, which makes Hive queries faster and much more interactive. 

An Interactive Query cluster is different from a Hadoop cluster. It contains only the Hive service. 

> [!NOTE]
> You can access the Hive service in the Interactive Query cluster only via Ambari Hive View, Beeline, and the Microsoft Hive Open Database Connectivity driver (Hive ODBC). You can’t access it via the Hive console, Templeton, the Azure command-line tool (Azure CLI), or Azure PowerShell. 
> 
> 

## Create an Interactive Query cluster
For information about creating a HDInsight cluster, see [Create Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md). Choose the Interactive Query cluster type.

## Execute Hive queries from Interactive Query
To execute Hive queries, you have the following options:

* Use Power BI

    See [Visualize big data with Power BI in Azure HDInsight](./hdinsight-connect-hive-power-bi.md).

* Use Zeppelin

    See [Use Zeppelin to run Hive queries in Azure HDInsight ](./hdinsight-connect-hive-zeppelin.md).

* Use Visual Studio

    See [Connect to Azure HDInsight and run Hive queries using Data Lake Tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md#run-a-hive-query).

* Use Visual Studio Code

    See [Use Visual Studio Code for Hive, LLAP or pySpark](hdinsight-for-vscode.md).
* Run Hive by using Ambari Hive View.
  
    See [Use Hive View with Hadoop in Azure HDInsight](hdinsight-hadoop-use-hive-ambari-view.md).
* Run Hive by using Beeline.
  
    See [Use Hive with Hadoop in HDInsight with Beeline](hdinsight-hadoop-use-hive-beeline.md).
  
    You can use Beeline from either the head node or from an empty edge node. We recommend using Beeline from an empty edge node. For information about creating an HDInsight cluster by using an empty edge node, see [Use empty edge nodes in HDInsight](hdinsight-apps-use-edge-node.md).
* Run Hive by using Hive ODBC.
  
    See [Connect Excel to Hadoop with the Microsoft Hive ODBC driver](hdinsight-connect-excel-hive-odbc-driver.md).

To find the Java Database Connectivity (JDBC) connection string:

1. Sign in to Ambari by using the following URL: https://\<cluster name\>.AzureHDInsight.net.
2. In the left menu, select **Hive**.
3. To copy the URL, select the clipboard icon:
   
   ![HDInsight Hadoop Interactive Query LLAP JDBC](./media/hdinsight-hadoop-use-interactive-hive/hdinsight-hadoop-use-interactive-hive-jdbc.png)

## Next steps

* Learn how to [create Interactive Query clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md).
* Learn how to [visualize big data with Power BI in Azure HDInsight](./hdinsight-connect-hive-power-bi.md).
* Learn how to [use Zeppelin to run Hive queries in Azure HDInsight ](./hdinsight-connect-hive-zeppelin.md).
* Learn how to [run Hive queries using Data Lake Tools for Visual Studio](./hdinsight-hadoop-visual-studio-tools-get-started.md#run-a-hive-query).
* Learn how to [use HDInsight Tools for Visual Studio Code](hdinsight-for-vscode.md).
* Learn how to [use Hive View with Hadoop in HDInsight](hdinsight-hadoop-use-hive-ambari-view.md)
* Learn how to [use Beeline to submit Hive queries in HDInsight](hdinsight-hadoop-use-hive-beeline.md).
* Learn how to [connect Excel to Hadoop with the Microsoft Hive ODBC driver](hdinsight-connect-excel-hive-odbc-driver.md).

