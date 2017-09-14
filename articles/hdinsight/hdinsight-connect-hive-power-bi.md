---
title: Visualize big data with Power BI in Azure HDInsight  | Microsoft Docs
description: Learn how to use Microsoft Power BI to visualize Hive data processed by Azure HDInsight.
keywords: hdinsight,hadoop,hive,interactive query,LLAP,odbc 
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
ms.date: 09/14/2017
ms.author: jgao

---
# Visualize Hive data with Microsoft Power BI in Azure HDInsight

Learn how to connect Microsoft Power BI to Azure HDInsight and visualize the data. Currently, Power BI only supports ODBC connection to HDInsight.

The information also applies to the new Interactive Query cluster type.


## Prerequisites
Before going through this article, you must have the following items:

* **HDInsight cluster**. The cluster can be either a HDInsight cluster with Hive or the newly released Interactive Query cluster. For creating clusters, see [Create cluster](hdinsight-hadoop-linux-tutorial-get-started.md#create-cluster) and create an Interactive Query type cluster.
* **[Microsoft Power BI Desktop](https://www.microsoft.com/download/details.aspx?id=45331). 

## Create Hive ODBC data source

See [Create Hive ODBC data source](hdinsight-connect-excel-hive-odbc-driver.md#create-hive-odbc-data-source).

## Load data from HDInsight




1. Sign in to Power BI Desktop.
2. Click the **Home** tab, click **Get Data** from the **External data** ribbon, and then select **More**.

    ![HDInsight Power BI open data](./media/hdinsight-connect-power-bi/hdinsight-power-bi-open-odbc.png)
3. From the **Get Data** pane, click **Other** from the left, click **ODBC** from the right, and then click **Connect** on the bottom.
4. From the **From ODBC** pane, select the data source name you created in the last section, and then click **OK**.
5. From the **Navigetor** pane, expand **ODBC->HIVE->default**, select **hivesampletable**, and then click **Load**.


## Visualize date

Continue from the last procedure.

1. From the Visualizations pane, select **Map**.  It is an globe icon.

    ![HDInsight Power BI customize report](./media/hdinsight-connect-power-bi/hdinsight-power-bi-customize.png)
2. From the Fields pane, select **country** and **devicemake**.

    ![HDInsight Power BI the map report](./media/hdinsight-connect-power-bi/hdinsight-power-bi-visualization.png)


## Next steps
In this article, you learned how to visualize data from HDInsight using Power BI.  To learn more, see the following articles:

* [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver](./hdinsight-connect-excel-hive-odbc-driver.md)
* [Connect Excel to Hadoop by using Power Query](./hdinsight-connect-excel-power-query.md)
* [Upload Data to HDInsight][hdinsight-upload-data]
