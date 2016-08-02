<properties
   pageTitle="Connect Excel to Hadoop with the Hive ODBC Driver | Microsoft Azure"
   description="Learn how to set up and use the Microsoft Hive ODBC driver for Excel to query data in an HDInsight cluster."
   services="hdinsight"
   documentationCenter=""
   authors="mumian"
   manager="paulettm"
   tags="azure-portal"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="07/25/2016"
   ms.author="jgao"/>

#Connect Excel to Hadoop with the Microsoft Hive ODBC driver

[AZURE.INCLUDE [ODBC-JDBC-selector](../../includes/hdinsight-selector-odbc-jdbc.md)]

Microsoft's Big Data solution integrates  Microsoft Business Intelligence (BI) components with Apache Hadoop clusters that have been deployed by the Azure HDInsight. An example of this integration is the ability to connect Excel to the Hive data warehouse of an Hadoop cluster in HDInsight using the Microsoft Hive Open Database Connectivity (ODBC) Driver.

It is also possible to connect the data associated with an HDInsight cluster and other data sources, including other (non-HDInsight) Hadoop clusters, from Excel using the Microsoft Power Query add-in for Excel. For information on installing and using Power Query, see [Connect Excel to HDInsight with Power Query][hdinsight-power-query].

> [AZURE.NOTE] While the steps in this article can be used with either a Linux or Windows-based HDInsight cluster, Windows is required for the client workstation.

**Prerequisites**:

Before you begin this article, you must have the following:

- **An HDInsight cluster**. To create one, see [Get started with Azure HDInsight][hdinsight-get-started].
- **A workstation** with Office 2013 Professional Plus, Office 365 Pro Plus, Excel 2013 Standalone, or Office 2010 Professional Plus.


##Install Microsoft Hive ODBC driver

Download and install Microsoft Hive ODBC Driver from the [Download Center][hive-odbc-driver-download].

This driver can be installed on 32-bit or 64-bit versions of Windows 7, Windows 8, Windows 10, Windows Server 2008 R2 and Windows Server 2012 and will allow connection to Azure HDInsight (version 1.6 and later) and Azure HDInsight Emulator (v.1.0.0.0 and later). You should install the version that matches the version of the application where you will be using the ODBC driver. For this tutorial, the driver will be used from Office Excel.

##Create Hive ODBC data source

The following steps show you how to create a Hive ODBC Data Source.

1. From Windows 8 or Windows 10, press the Windows key to open the Start screen, and then type **data sources**.
2. Click **Set up ODBC Data sources (32-bit)** or **Set up ODBC Data Sources (64-bit)** depending on your Office version. If you are using Windows 7, choose **ODBC Data Sources (32 bit)** or **ODBC Data Sources (64 bit)** from **Administrative Tools**. This will launch the **ODBC Data Source Administrator** dialog.

	![OBDC data source administrator][img-hdi-simbahiveodbc-datasource-admin]

3. From User DNS, click **Add** to open the **Create New Data Source** wizard.
4. Select **Microsoft Hive ODBC Driver**, and then click **Finish**. This will launch the **Microsoft Hive ODBC Driver DNS Setup** dialog.

5. Type or select the following values:

    Property|Description
    ---|---
    Data Source Name|Give a name to your data source
    Host|Enter <HDInsightClusterName>.azurehdinsight.net. For example, myHDICluster.azurehdinsight.net
    Port|Use <strong>443</strong>. (This port has been changed from 563 to 443.)
    Database|Use <strong>Default</strong>.
    Hive Server Type|Select <strong>Hive Server 2</strong>
    Mechanism|Select <strong>Azure HDInsight Service</strong>
    HTTP Path|Leave it blank.
    User Name|Enter HDInsight cluster user username. This is the username created during the cluster provision process. If you used the quick create option, the default username is <strong>admin</strong>.
    Password|Enter HDInsight cluster user password.
    </table>

    There are some important parameters to be aware of when you click **Advanced Options**:

    Parameter|Description
    ---|---
    Use Native Query|When it is selected, the ODBC driver will NOT try to convert TSQL into HiveQL. You shall use it only if you are 100% sure you are submitting pure HiveQL statements. When connecting to SQL Server or Azure SQL Database, you should leave it unchecked.
    Rows fetched per block|When fetching a large amount of records, tuning this parameter may be required to ensure optimal performances.
    Default string column length, Binary column length, Decimal column scale|The data type lengths and precisions may affect how data is returned. They will cause incorrect information to be returned due to loss of precision and/or truncation.


	![Advanced options][img-HiveOdbc-DataSource-AdvancedOptions]

6. Click **Test** to test the data source. When the data source is configured correctly, it shows *TESTS COMPLETED SUCCESSFULLY!*.
7. Click **OK** to close the Test dialog. The new data source should now be listed on the **ODBC Data Source Administrator**.
8. Click **OK** to exit the wizard.

##Import data into Excel from HDInsight

The steps below describe the way to import data from a hive table into an Excel workbook using the ODBC data source that you created in the steps above.

1. Open a new or existing workbook in Excel.
2. From the **Data** tab, click **From Other Data Sources**, and then click **From Data Connection Wizard** to launch the **Data Connection Wizard**.

	![Open data connection wizard][img-hdi-simbahiveodbc.excel.dataconnection]

3. Select **ODBC DSN** as the data source, and then click **Next**.
4. From ODBC data sources, select the data source name that you created in the previous step, and then  click **Next**.
5. Re-enter the password for the cluster in the wizard, and then click **Test** to verify the configuration once again, if required.
6. Click **OK** to close the test dialog.
7. Click **OK**. Wait for the **Select Database and Table** dialog to open. This can take a few seconds.
8. Select the table that you want to import, and then click **Next**. The *hivesampletable* is a sample hive table that comes with HDInsight clusters.  You can choose it if you haven't created one. For more information on run Hive queries and create Hive tables, see [Use Hive with HDInsight][hdinsight-use-hive].
8. Click **Finish**.
9. In the **Import Data** dialog, you can change or specify the query. To do so, click **Properties**. This can take a few seconds.
10. Click on the **Definition** tab,  and then append **LIMIT 200** to the Hive select statement in the **Command text** textbox. The modification will limit the returned record set to 200.

	![Connection Properties][img-hdi-simbahiveodbc-excel-connectionproperties]

11. Click **OK** to close the Connection Properties dialog.
12. Click **OK** to close the **Import Data** dialog.  
13. Re-enter the password, and then click **OK**. It takes a few seconds before data gets imported to Excel.

##Next steps

In this article you learned how to use the Microsoft Hive ODBC driver to retrieve data from the HDInsight Service into Excel. Similarly, you can retrieve data from the HDInsight Service into SQL Database. It is also possible to upload data into an HDInsight Service. To learn more, see:

- [Analyze flight delay data using HDInsight][hdinsight-analyze-flight-data]
- [Upload Data to HDInsight][hdinsight-upload-data]
- [Use Sqoop with HDInsight] [hdinsight-use-sqoop]


[hdinsight-use-sqoop]: hdinsight-use-sqoop.md
[hdinsight-analyze-flight-data]: hdinsight-analyze-flight-delay-data.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-power-query]: hdinsight-connect-excel-power-query.md
[hdinsight-get-started]: hdinsight-hadoop-tutorial-get-started-windows.md

[hive-odbc-driver-download]: http://go.microsoft.com/fwlink/?LinkID=286698

[img-hdi-simbahiveodbc-datasource-admin]: ./media/hdinsight-connect-excel-hive-ODBC-driver/HDI.SimbaHiveOdbc.DataSourceAdmin1.png
[img-HiveOdbc-DataSource-AdvancedOptions]: ./media/hdinsight-connect-excel-hive-ODBC-driver/HDI.HiveOdbc.DataSource.AdvancedOptions1.png
[img-hdi-simbahiveodbc-excel-connectionproperties]: ./media/hdinsight-connect-excel-hive-ODBC-driver/HDI.SimbaHiveODBC.Excel.ConnectionProperties1.png
[img-hdi-simbahiveodbc.excel.dataconnection]: ./media/hdinsight-connect-excel-hive-ODBC-driver/HDI.SimbaHiveOdbc.Excel.DataConnection1.png
