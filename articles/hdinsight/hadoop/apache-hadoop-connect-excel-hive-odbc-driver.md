---
title: Excel & Apache Hadoop with Open Database Connectivity (ODBC) Driver - Azure HDInsight
description: Learn how to set up and use the Microsoft Hive ODBC driver for Excel to query data in HDInsight clusters from Microsoft Excel.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,hdiseo17may2017,seoapr2020
ms.date: 05/23/2023
---

# Connect Excel to Apache Hadoop in Azure HDInsight with the Microsoft Hive ODBC driver

[!INCLUDE [ODBC-JDBC-selector](../includes/hdinsight-selector-odbc-jdbc.md)]

Microsoft's Big Data solution integrates Microsoft Business Intelligence (BI) components with Apache Hadoop clusters  deployed in  HDInsight. An example is the ability to connect Excel to the Hive data warehouse of a Hadoop cluster. Connect using the Microsoft Hive Open Database Connectivity (ODBC) Driver.

You can connect the data associated with an HDInsight cluster from Excel with Microsoft Power Query add-in for Excel. For more information, see [Connect Excel to HDInsight with Power Query](./apache-hadoop-connect-excel-power-query.md).

## Prerequisites

Before you begin this article, you must have the following items:

* An HDInsight Hadoop cluster. To create one, see [Get started with Azure HDInsight](apache-hadoop-linux-tutorial-get-started.md).
* A workstation with Office 2010 Professional Plus or later, or Excel 2010 or later.

## Install Microsoft Hive ODBC driver

Download and install [Microsoft Hive ODBC Driver](https://www.microsoft.com/download/details.aspx?id=40886). Choose the version that matches the version of the application where you'll be using the ODBC driver.  For this article, the driver is used for Office Excel.

## Create Apache Hive ODBC data source

The following steps show you how to create a Hive ODBC Data Source.

1. From Windows, navigate to **Start > Windows Administrative Tools > ODBC Data Sources (32-bit)/(64-bit)**.  This action opens the **ODBC Data Source Administrator** window.

   :::image type="content" source="./media/apache-hadoop-connect-excel-hive-odbc-driver/simbahiveodbc-datasourceadmin1.png" alt-text="OBDC data source administrator" border="true":::

1. From the **User DSN** tab, select **Add** to open the **Create New Data Source** window.

1. Select **Microsoft Hive ODBC Driver**, and then select **Finish** to open the **Microsoft Hive ODBC Driver DSN Setup** window.

1. Type or select the following values:

   | Property | Description |
   | --- | --- |
   |  Data Source Name |Give a name to your data source |
   |  Host(s) |Enter `HDInsightClusterName.azurehdinsight.net`. For example, `myHDICluster.azurehdinsight.net`. Note: `HDInsightClusterName-int.azurehdinsight.net` is supported so long as the client VM is peered to the same virtual network. |
   |  Port |Use **443**. (This port has been changed from 563 to 443.) |
   |  Database |Use **default**. |
   |  Mechanism |Select **Windows Azure HDInsight Service** |
   |  User Name |Enter HDInsight cluster HTTP user username. The default username is `admin`. |
   |  Password |Enter HDInsight cluster user password. Select the checkbox **Save Password (Encrypted)**.|

1. Optional: Select **Advanced Options...**  

   | Parameter | Description |
   | --- | --- |
   |  Use Native Query |When it's selected, the ODBC driver does NOT try to convert TSQL into HiveQL. You shall use it only if you're 100% sure you're submitting pure HiveQL statements. When connecting to SQL Server or Azure SQL Database, you should leave it unchecked. |
   |  Rows fetched per block |When fetching a large number of records, tuning this parameter may be required to ensure optimal performances. |
   |  Default string column length, Binary column length, Decimal column scale |The data type lengths and precisions may affect how data is returned. They cause incorrect information to be returned because of loss of precision and, or truncation. |

    :::image type="content" source="./media/apache-hadoop-connect-excel-hive-odbc-driver/hiveodbc-datasource-advancedoptions1.png" alt-text="Advanced DSN configuration options" border="true":::

1. Select **Test** to test the data source. When the data source is configured correctly, the test result shows **SUCCESS!**

1. Select **OK** to close the Test window.  

1. Select **OK** to close the **Microsoft Hive ODBC Driver DSN Setup** window.  

1. Select **OK** to close the **ODBC Data Source Administrator** window.  

## Import data into Excel from HDInsight

The following steps describe the way to import data from a Hive table into an Excel workbook using the ODBC data source that you created in the previous section.

1. Open a new or existing workbook in Excel.

2. From the **Data** tab, navigate to **Get Data** > **From Other Sources** > **From ODBC** to launch the **From ODBC** window.

   :::image type="content" source="./media/apache-hadoop-connect-excel-hive-odbc-driver/simbahiveodbc-excel-dataconnection1.png" alt-text="Open Excel data connection wizard" border="true":::

3. From the drop-down list, select the data source name that you created in the last section and then select **OK**.

4. For the first use, an **ODBC driver** dialog will open. Select **Windows** from the left menu. Then select **Connect** to open the **Navigator** window.

5. From **Navigator**, navigate to **HIVE** > **default** > **hivesampletable**, and then select **Load**. It takes a few moments before data gets imported to Excel.

   :::image type="content" source="./media/apache-hadoop-connect-excel-hive-odbc-driver/hdinsight-hive-odbc-navigator.png" alt-text="HDInsight Excel Hive ODBC navigator" border="true":::

## Next steps

In this article, you learned how to use the Microsoft Hive ODBC driver to retrieve data from the HDInsight Service into Excel. Similarly, you can retrieve data from the HDInsight Service into SQL Database. It's also possible to upload data into an HDInsight Service. To learn more, see:

* [Visualize Apache Hive data with Microsoft Power BI in Azure HDInsight](apache-hadoop-connect-hive-power-bi.md).
* [Visualize Interactive Query Hive data with Power BI in Azure HDInsight](../interactive-query/apache-hadoop-connect-hive-power-bi-directquery.md).
* [Connect Excel to Apache Hadoop by using Power Query](apache-hadoop-connect-excel-power-query.md).
* [Connect to Azure HDInsight and run Apache Hive queries using Data Lake Tools for Visual Studio](apache-hadoop-visual-studio-tools-get-started.md).
