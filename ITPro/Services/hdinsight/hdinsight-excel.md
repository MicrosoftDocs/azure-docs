<properties linkid="manage-hdinsight-excel-hiveodbc" urlDisplayName="HDInsight and Excel" pageTitle="How to Connect Excel to Windows Azure HDInsight with HiveODBC" metaKeywords="hdinsight, excel, hiveodbc, hive excel, hdinsight excel" metaDescription="How to use Excel to access data stored in Windows Azure HDInsight using HiveODBC" metaCanonical="http://www.windowsazure.com/en-us/manage/hdinsight/hdinsight-hiveodbc" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

#How to Connect Excel to Windows Azure HDInsight via HiveODBC

One key feature of Microsoft’s Big Data Solution is solid integration of Apache Hadoop with Microsoft Business Intelligence (BI) components. A good example of this is the ability for Excel to connect to the Hive data warehouse framework in the Hadoop cluster. This topic walks you through using Excel via the Hive ODBC driver. 

<font color='#FF0000'>(Need to call out that this is a Windows-only scenario.)</font>

##Install the Hive ODBC Driver

Prerequisites:

<font color='#FF0000'>(Need a description of what the Hive ODBC driver is and a link to the download.)</font>

* Ensure that Excel 2010 64-bit is already installed before installing the HiveODBC Driver. <font color='#FF0000'>(We don't support Excel 2012?)</font>
* Download the 64-bit Hive ODBC driver MSI file from the Portal by clicking the **Download** tile from the cluster dashboard

<div class="dev-callout"> 
<b>Note</b> 
<p>The Hive ODBC driver is in Preview only and should not be used for production workloads. Due to limitations in Hive Server 1, the Hive ODBC driver should not be used to run concurrent queries from concurrent connections. This may result in unexpected behavior. You can find more information about Hive Server 1 limitations at <a href='https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Thrift+API'>https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Thrift+API</a> We are working on providing support for Hive Server 2 for the ODBC driver. Hive Server 2 provides support for concurrency for ODBC and JDBC. At that time, the existing ODBC driver will be deprecated.</p> 
</div>

After you have downloaded the driver, follow these steps to install it:	
 
1. Double click **HiveODBCSetupx64.msi** to start the installation. 
2. Read the license agreement. 
3. If you agree to the license agreement, click **I agree** and  **Install**. 
   
	![Accept the EULA](./media/EULA-accept.PNG)

4. Once the installation has completed, click **Finish** to exit the Setup Wizard. 



##Create a Hive ODBC Data Source to use with Excel

<font color='#FF0000'>(Need a high-level description of what the following steps will do.)</font>

1. Click **Start**->**Control Panel** to launch the Control Panel for Microsoft Windows. 
2. In the Control Panel, Click **System and Security**->**Administrative Tools**->**Data Sources (ODBC)**. This will launch the ODBC Data Source Administrator dialog. 
 
	![ODBCDSN](./media/ODBCDSN.PNG) 

3. In the ODBC Data Source Administrator dialog, click the **System DSN** tab. 
4. Click **Add** to add a new data source. 
5. Click the **HIVE** driver in the ODBC driver list.  
6. Click **Finish**. This will launch the ODBC Hive Setup dialog shown in the screenshot below. 
7. Enter a data source a name in the **Data Source Name** box. For Example, `MyHiveData`. 
8. In the **Host** box , replace the cluster name to point to be the cluster that you created. For example, if your cluster name is `myhadoopcluster` then the final value for host should be `myhadoopcluster.azurehdinsight.net`. 
9. Enter the username you used to authenticate on the portal. 

	![DSNconfig](./media/DSNconfig.png "DSN config")  

10. Click **OK** to save the new Hive data source. 
11. Click **OK** to close the ODBC Data Source Administrator dialog. 
	
 
##Importing Data into Excel

<font color='#FF0000'>(Need a high-level description of what the following steps will do.)</font>

1. Open Microsoft Excel 2010 (64-bit).
3. In Microsoft Excel 2010, click the Data tab. 
4. Click **From Other Data Sources**.
5. Select **From Data Connection Wizard** to import data using the ODBC DSN that you created in the previous step. This will launch the **Data Connection Wizard**.
5. On Data Connection Wizard, select **ODBC DSN** as the data source and click **Next**.

	![excelconn](./media/excelconn.png "Excel Data Connection") 

6. On "**Connect to ODBC Data source**" window, select the Data Source name that you created in the previous step (for example, `MyHive`) and click **Next**. 
7. In the Hive Data Source Configuration window, enter the password for the cluster and click **OK**.
8. In the **Data Link Properties** window, make sure that **Use connection string** selected by default. Enter the username and password for the cluster, and select the **Initial catalog** that you wish to use and click **OK**.
7. In the **Select Database and Table** window, select the table that you want to import (for example, `HiveSamepletable`) and click **Next**.
8. In the **Import Data** window, you can change or specify the query. To do so, click **Properties** to launch the **Connection Properties** window.
9. Click on the **Definition** tab, edit the query (if necessary) in the **Command Text** text box. Click **Ok**. 
10. Click **OK** again on the **Import Data** window.
11. In the **Data Connection** window, re-enter the password and click **OK**.
11. You will see the excel spreadsheet populated with data.


