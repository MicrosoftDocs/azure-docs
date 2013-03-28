<properties linkid="manage-services-hdinsight-excel-hiveodbc" urlDisplayName="HDInsight and Excel" pageTitle="How to Connect Excel to Windows Azure HDInsight with HiveODBC" metaKeywords="hdinsight, excel, hiveodbc, hive excel, hdinsight excel" metaDescription="How to use Excel to access data stored in Windows Azure HDInsight using HiveODBC" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

#How to Connect Excel to Windows Azure HDInsight via HiveODBC

One key feature of Microsoft’s Big Data Solution is the integration of  Microsoft Business Intelligence (BI) components with Apache Hadoop. A primary example of this integration is the ability to connect to the Hive data warehouse framework in an Hadoop cluster from Excel via the Hive ODBC driver. This topic walks you through how to set up and use Hive from Excel to query data in an Hadoop cluster. There are three parts to this procedure:

1. [Install the Hive ODBC Driver](#InstallHiveODBCDriver)
2. [Create a Hive ODBC Data Source](#CreateHiveODBCDataSource)
3. [Import data into Excel](#ImportData)


<h2><a id="InstallHiveODBCDriver"></a>Install the Hive ODBC Driver</h2>

Follow the steps below to install the Hive ODBC Driver.

**Prerequisites**:

* Ensure that Excel 2010 or Excel 2013 is already installed before installing the relevant (32-bit or 64-bit) HiveODBC Driver. 
* Download the  Hive ODBC driver MSI file from the Portal by clicking the **Download** tile from the cluster dashboard.

	![Hive ODBC Drivers](../media/HDI.HiveOdbcForExcel.Drivers.png)

* Note that currently this driver is only supported on Windows and is only supported against HDInsight Hive installations.

<div class="dev-callout">
<b>Note</b>
	<p>The Hive ODBC driver is in Preview only and should not be used for production workloads. Due to limitations in Hive Server 1, the Hive ODBC driver is supported in single user mode only and should not be used to run concurrent queries from concurrent connections. Attempting to run multiple queries at the same time may result in unexpected behavior. We are working on providing support for Hive Server 2 for the ODBC driver. Hive Server 2 provides support for concurrency for ODBC and JDBC. At that time, the existing ODBC driver will be deprecated. Please find more information about Hive Server 1 limitations at <a href="https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Thrift+API">https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Thrift+API</a> </p> 
</div>

After you have downloaded the driver, follow these steps to install the driver:	
 
1. Double click **HiveODBCSetupx64.msi** to start the installation. 

2. Read the license agreement. 

3. If you agree to the license agreement, click **I agree** and  **Install**. 
   
	![Accept the EULA](../media/EULA-accept.PNG)

4. Once the installation has completed, click **Finish** to exit the Setup Wizard. 


<h2><a id="CreateHiveODBCDataSource"></a>Create a Hive ODBC Data Source</h2>

The following steps show you how to create a Hive ODBC Data Source.

1. Click **Start** -> **Control Panel** to launch the Control Panel for Microsoft Windows. 

2. In the Control Panel, Click **System and Security**->**Administrative Tools**->**Data Sources (ODBC)**. This will launch the ODBC Data Source Administrator dialog. 
 
	![ODBCDSN](../media/ODBCDSN.PNG) 

3. In the ODBC Data Source Administrator dialog, click the **User DSN** tab. 

4. Click **Add** to add a new data source. 

5. Click the **HIVE** driver in the ODBC driver list.  

6. Click **Finish**. This will launch the ODBC Hive Setup dialog shown in the screenshot below. 

7. Enter a data source a name in the **Data Source Name** box. For Example, "MyHiveData". 

8. In the **Host** box , replace the cluster name to point to be the cluster that you created. For example, if your cluster name is "myhadoopcluster" then the final value for host should be "myhadoopcluster.azurehdinsight.net". 

9. Enter the username you used to authenticate on the portal. 

	![DSNconfig](../media/DSNconfig.png "DSN config")  

10. Click **OK** to save the new Hive data source. 

11. Click **OK** to close the ODBC Data Source Administrator dialog. 
	
 
<h2><a id="ImportData"></a>Import Data into Excel</h2>

The steps below describe the way to import data from a hive table into excel workbook using the ODBC data source that you  created in the steps above.

1. Open Excel.

2. In Excel, click the **Data** tab. 

3. Click **From Other Data Sources**.

4. Select **From Data Connection Wizard** to import data using the ODBC DSN that you created in the previous step. This will launch the **Data Connection Wizard**.

5. In **Data Connection Wizard**, select **ODBC DSN** as the data source and click **Next**.

	![Welcome to the Data Connection Wizard](../media/excelconn.png) 

6. In the **Connect to ODBC Data source** dialog, select the Data Source name that you created in the previous step (for example, "MyHive") and click **Next**.

7. In the **Hive Data Source Configuration** dialog, enter the password for the cluster and click **OK**.

8. In the **Data Link Properties** window, make sure that **Use connection string** is selected. Enter the username and password for the cluster, and select the **Initial catalog** that you wish to use. Click **OK**.

	![Data Link Properties](../media/excellink.png) 

9. When the **Select Database and Table** dialog opens, select the table that you want to import (for example, "HiveSamepletable") and click **Next**.

	![Select Database and Table](../media/exceltable.png "Excel Data Link") 

10. In the **Import Data** dialog, you can change or specify the query. To do so, click **Properties** to launch the **Connection Properties** dialog. Click on the **Defnition** tab and add "Limit 200" at the end of the query in the **command text** text box. You can also replace this query text with another query as needed.

	![Connection Properties](../media/linkproperties.png "Excel Data Link") 

11. Click **OK** again on the **Import Data** dialog.

12. In the **Data Connection** dialog, re-enter the password and click **OK**.

13. You will see the data from the hive table in the Excel workbook.

	![excelhive](../media/excelhive.png "Excel Hive")  

##Summary

By using components such as the HiveODBC adapter, it is easy to use Business Intelligence tools such as Excel to work with data from your HDInsight Service cluster.

## Next steps

In this article you learned how to use the HiveODBC adapter to retrieve data from the HDInsight Service. 

* For information on using Sqoop to copy data from an HDInsight Service to SQL Azure, see [Using HDInsight to process Blob Storage data and write the results to a SQL Database][blob-hdi-sql]. 
* For information on using Sqoop or Windows Azure Blob Storage to load data into an HDInsight Service, see [How to Upload Data to the HDInsight Service][upload-data] e.

[blob-hdi-sql]: /en-us/manage/services/hdinsight/process-blob-data-and-write-to-sql/
[upload-data]: /en-us/manage/services/hdinsight/howto-upload-data-to-hdinsight/