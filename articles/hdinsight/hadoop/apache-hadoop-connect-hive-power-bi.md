---
title: Visualize big data with Power BI in Azure HDInsight  
description: Learn how to use Microsoft Power BI to visualize Hive data processed by Azure HDInsight.
keywords: hdinsight,hadoop,hive,interactive query,interactive hive,LLAP,odbc 
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive,
ms.topic: conceptual
ms.date: 05/16/2018
ms.author: jasonh

---
# Visualize Hive data with Microsoft Power BI using ODBC in Azure HDInsight

Learn how to connect Microsoft Power BI to Azure HDInsight using ODBC and visualize the Hive data. 

>[!IMPORTANT]
> You can leverage the Hive ODBC driver to do import via the generic ODBC connector in Power BI Desktop. However it is not recommended for BI workloads given non-interactive nature of the Hive query engine. [HDInsight Interactive Query connector](../interactive-query/apache-hadoop-connect-hive-power-bi-directquery.md) and 
[HDInsight Spark connector](https://docs.microsoft.com/power-bi/spark-on-hdinsight-with-direct-connect) are better choices for their performance.

In this tutorial, you load the data from a hivesampletable Hive table to Power BI. The Hive table contains some mobile phone usage data. Then you plot the usage data on a world map:

![HDInsight Power BI the map report](./media/apache-hadoop-connect-hive-power-bi/hdinsight-power-bi-visualization.png)

The information also applies to the new [Interactive Query](../interactive-query/apache-interactive-query-get-started.md) cluster type. For how to connect to HDInsight Interactive Query using direct query, see [Visualize Interactive Query Hive data with Microsoft Power BI using direct query in Azure HDInsight](../interactive-query/apache-hadoop-connect-hive-power-bi-directquery.md).



## Prerequisites
Before going through this article, you must have the following items:

* **HDInsight cluster**. The cluster can be either a HDInsight cluster with Hive or a newly released Interactive Query cluster. For creating clusters, see [Create cluster](apache-hadoop-linux-tutorial-get-started.md#create-cluster).
* **[Microsoft Power BI Desktop](https://powerbi.microsoft.com/desktop/)**. You can download a copy from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=45331).

## Create Hive ODBC data source

See [Create Hive ODBC data source](apache-hadoop-connect-excel-hive-odbc-driver.md#create-hive-odbc-data-source).

## Load data from HDInsight

The hivesampletable Hive table comes with all HDInsight clusters.

1. Sign in to Power BI Desktop.
2. Click the **Home** tab, click **Get Data** from the **External data** ribbon, and then select **More**.

    ![HDInsight Power BI open data](./media/apache-hadoop-connect-hive-power-bi/hdinsight-power-bi-open-odbc.png)
3. From the **Get Data** pane, click **Other** from the left, click **ODBC** from the right, and then click **Connect** on the bottom.
4. From the **From ODBC** pane, select the data source name you created in the last section, and then click **OK**.
5. From the **Navigator** pane, expand **ODBC->HIVE->default**, select **hivesampletable**, and then click **Load**.

## Visualize data

Continue from the last procedure.

1. From the Visualizations pane, select **Map**.  It is a globe icon.

    ![HDInsight Power BI customizes report](./media/apache-hadoop-connect-hive-power-bi/hdinsight-power-bi-customize.png)
2. From the Fields pane, select **country** and **devicemake**. You can see the data plotted on the map.
3. Expand the map.

## Next steps
In this article, you learned how to visualize data from HDInsight using Power BI.  To learn more, see the following articles:

* [Use Zeppelin to run Hive queries in Azure HDInsight](./../hdinsight-connect-hive-zeppelin.md).
* [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver](./apache-hadoop-connect-excel-hive-odbc-driver.md).
* [Connect Excel to Hadoop by using Power Query](apache-hadoop-connect-excel-power-query.md).
* [Connect to Azure HDInsight and run Hive queries using Data Lake Tools for Visual Studio](apache-hadoop-visual-studio-tools-get-started.md).
* [Use Azure HDInsight Tool for Visual Studio Code](../hdinsight-for-vscode.md).
* [Upload Data to HDInsight](./../hdinsight-upload-data.md).
