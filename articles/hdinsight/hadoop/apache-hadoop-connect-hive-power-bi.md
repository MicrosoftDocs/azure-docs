---
title: Visualize Apache Hive data with Power BI - Azure HDInsight
description: Learn how to use Microsoft Power BI to visualize Hive data processed by Azure HDInsight.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,seoapr2020
ms.date: 06/26/2023
---

# Visualize Apache Hive data with Microsoft Power BI using ODBC in Azure HDInsight

Learn how to connect Microsoft Power BI Desktop to Azure HDInsight using ODBC and visualize Apache Hive data.

> [!IMPORTANT]
> You can leverage the Hive ODBC driver to do import via the generic ODBC connector in Power BI Desktop. However it is not recommended for BI workloads given non-interactive nature of the Hive query engine. [HDInsight Interactive Query connector](../interactive-query/apache-hadoop-connect-hive-power-bi-directquery.md) and [HDInsight Spark connector](/power-bi/spark-on-hdinsight-with-direct-connect) are better choices for their performance.

In this article, you load the data from a `hivesampletable` Hive table to Power BI. The Hive table contains some mobile phone usage data. Then you plot the usage data on a world map:

:::image type="content" source="./media/apache-hadoop-connect-hive-power-bi/hdinsight-power-bi-visualization.png" alt-text="HDInsight Power BI the map report" border="true":::

The information also applies to the new [Interactive Query](../interactive-query/apache-interactive-query-get-started.md) cluster type. For how to connect to HDInsight Interactive Query using direct query, see [Visualize Interactive Query Hive data with Microsoft Power BI using direct query in Azure HDInsight](../interactive-query/apache-hadoop-connect-hive-power-bi-directquery.md).

## Prerequisites

Before going through this article, you must have the following items:

* HDInsight cluster. The cluster can be either a HDInsight cluster with Hive or a newly released Interactive Query cluster. For creating clusters, see [Create cluster](apache-hadoop-linux-tutorial-get-started.md).

* [Microsoft Power BI Desktop](https://powerbi.microsoft.com/desktop/). You can download a copy from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=45331).

## Create Hive ODBC data source

See [Create Hive ODBC data source](apache-hadoop-connect-excel-hive-odbc-driver.md#create-apache-hive-odbc-data-source).

## Load data from HDInsight

The **hivesampletable** Hive table comes with all HDInsight clusters.

1. Start Power BI Desktop.

1. From the top menu, navigate to **Home** > **Get Data** > **More...**.

    :::image type="content" source="./media/apache-hadoop-connect-hive-power-bi/hdinsight-power-bi-open-odbc.png" alt-text="HDInsight Excel Power BI open data" border="true":::

1. From the **Get Data** dialog, select **Other** from the left, select **ODBC** from the right, and then select **Connect** on the bottom.

1. From the **From ODBC** dialog, select the data source name you created in the last section from the drop-down list. Then select **OK**.

1. For the first use, an **ODBC driver** dialog will open. Select **Default or Custom** from the left menu. Then select **Connect** to open **Navigator**.

1. From the **Navigator** dialog, expand **ODBC > HIVE > default**, select **hivesampletable**, and then select **Load**.

## Visualize data

Continue from the last procedure.

1. From the Visualizations pane, select **Map**, it's a globe icon.

    :::image type="content" source="./media/apache-hadoop-connect-hive-power-bi/hdinsight-power-bi-customize.png" alt-text="HDInsight Power BI customizes report" border="true":::

1. From the **Fields** pane, select **country** and **devicemake**. You can see the data plotted on the map.

1. Expand the map.

## Next steps

In this article, you learned how to visualize data from HDInsight using Power BI.  To learn more, see the following articles:

* [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver](./apache-hadoop-connect-excel-hive-odbc-driver.md).
* [Connect Excel to Apache Hadoop by using Power Query](apache-hadoop-connect-excel-power-query.md).
* [Visualize Interactive Query Apache Hive data with Microsoft Power BI using direct query](../interactive-query/apache-hadoop-connect-hive-power-bi-directquery.md)
