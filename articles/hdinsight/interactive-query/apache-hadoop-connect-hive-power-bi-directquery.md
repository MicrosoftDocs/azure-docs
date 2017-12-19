---
title: Visualize Interactive Query Hive data with Power BI in Azure HDInsight  | Microsoft Docs
description: Learn how to use Microsoft Power BI to visualize Interacive Query Hive data processed by Azure HDInsight.
keywords: hdinsight,hadoop,hive,interactive query,interactive hive,LLAP,directquery 
services: hdinsight
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: hdinsight
ms.custom: hdinsightactive,
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/19/2017
ms.author: jgao

---
# Visualize Interactive Query Hive data with Microsoft Power BI using direct query in Azure HDInsight

Learn how to connect Microsoft Power BI to Azure HDInsight Interactive Query clusters and visualize the Hive data using direct query. In this tutorial, you load the data from a hivesampletable Hive table to Power BI. The Hive table contains some mobile phone usage data. Then you plot the usage data on a world map:

![HDInsight Power BI the map report](./media/apache-hadoop-connect-hive-power-bi-directquery/hdinsight-power-bi-visualization.png)

For how to connect to Hive using ODBC, see [Visualize Hive data with Microsoft Power BI using ODBC in Azure HDInsight](../hadoop/apache-hadoop-connect-hive-power-bi.md). 

## Prerequisites
Before going through this article, you must have the following items:

* **HDInsight cluster**. The cluster can be either a HDInsight cluster with Hive or a newly released Interactive Query cluster. For creating clusters, see [Create cluster](apache-hadoop-linux-tutorial-get-started.md#create-cluster).
* **[Microsoft Power BI Desktop](https://powerbi.microsoft.com/desktop/)**. You can download a copy from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=45331).

## Load data from HDInsight

The hivesampletable Hive table comes with all HDInsight clusters.

1. Sign in to Power BI Desktop.
2. Click the **Home** tab, click **Get Data** from the **External data** ribbon, and then select **More**.

    ![HDInsight Power BI open data](./media/apache-hadoop-connect-hive-power-bi-directquery/hdinsight-power-bi-open-odbc.png)
3. From the **Get Data** pane, type **hdinsight** in the search box. If you don't see **HDInsight Interactive Query (Beta)**, you need to update your Power Bi Desktop to the latest version.
4. Click **HDInsight Interactive Query (Beta)**, and then click **Connect**.
5. Click **Continue** to close the **Preview connector** warning dialog.
6. From **HDInsight Interactive Query**, select or enter the following information:

    - **Server**: Enter the Interactive Query cluster name, for example *myiqcluster.azurehdinsight.net*.
    - **Database**: For this tutorial, enter **default**.
    - **Data Connectivity mode**: For this tutorial, select **DirectQuery**.

    ![HDInsight interactive query power bi directquery connect](./media/apache-hadoop-connect-hive-power-bi-directquery/hdinsight-interactive-query-power-bi-connect.png)
7. Click **OK**.
8. Enter the HTTP user credential, and then click **OK**.  The default username is **admin**
9. From the left pane, select **hivesampletale**, and then click **Load**.

    ![HDInsight interactive query power bi hivesampletable](./media/apache-hadoop-connect-hive-power-bi-directquery/hdinsight-interactive-query-power-bi-hivesampletable.png)

## Visualize date

Continue from the last procedure.

1. From the Visualizations pane, select **Map**.  It is a globe icon.

    ![HDInsight Power BI customizes report](./media/apache-hadoop-connect-hive-power-bi-directquery/hdinsight-power-bi-customize.png)
2. From the Fields pane, select **country** and **devicemake**. You can see the data plotted on the map.
3. Expand the map.

## Next steps
In this article, you learned how to visualize data from HDInsight using Power BI.  To learn more, see the following articles:

* [Visualize Hive data with Microsoft Power BI using ODBC in Azure HDInsight](../hadoop/apache-hadoop-connect-hive-power-bi.md). 
* [Use Zeppelin to run Hive queries in Azure HDInsight](./../hdinsight-connect-hive-zeppelin.md).
* [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver](./apache-hadoop-connect-excel-hive-odbc-driver.md).
* [Connect Excel to Hadoop by using Power Query](apache-hadoop-connect-excel-power-query.md).
* [Connect to Azure HDInsight and run Hive queries using Data Lake Tools for Visual Studio](apache-hadoop-visual-studio-tools-get-started.md).
* [Use Azure HDInsight Tool for Visual Studio Code](../hdinsight-for-vscode.md).
* [Upload Data to HDInsight](./../hdinsight-upload-data.md).
