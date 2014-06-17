<properties linkid="manage-services-hdinsight-hbase-get-started-hdinsight-hadoop" urlDisplayName="Get Started" pageTitle="Get started using HBase with Hadoop in HDInsight | Azure" metaKeywords="" description="Get started using HBase with Hadoop in HDInsight. learn how to created HBase tables and query them with Hive." metaCanonical="" services="hdinsight" documentationCenter="" title="Get started using HBase with Hadoop in HDInsight" authors="bradsev" solutions="" manager="paulettm" editor="cgronlun" />



# Get started using HBase with Hadoop in HDInsight
HBase is a low-latency NoSQL database that allows online transactional processing of big data. HBase is offered as a managed cluster integrated into the Azure environment. The clusters are configured to store data directly in Azure Blob storage, which provides low latency and increased elasticity in performance/cost choices. This enables customers to build interactive websites that work with large datasets, to build services that store sensor and telemetry data from millions of end points, and to analyze this data with Hadoop jobs. 

In this tutorial, you learn how to create and query HBase tables with HDInsight. The following procedures are described:

- How to provision an HBase cluster using PowerShell.
- How to enable and use RDP to access the HBase shell and use the HBase shell to create an HBase sample table, add rows, and then list the rows in the table.
- How to create a Hive table that maps to an existing HBase table and use HiveQL to query the data in the HBase table.
- How to use HBase REST APIs to create a new HBase table, list the HBase tables in your account, and how to add and retrieve the rows from your tables.


> [WACOM.NOTE] HBase is currently only available in preview for use with HDInsight 3.0 clusters on HDInsight (based on Hadoop 2.2.0). For version information, see [What's new in the Hadoop cluster versions provided by HDInsight?][hdinsight-versions]

During preview period, it is recommended that a backup copy of the original version of any data used in the HBase cluster be stored outside of that cluster. This is because the format of the database files may be changed in future versions and the current data file formats used in the preview version may not be supported or upgradable to subsequent versions.

**Prerequisites:**

Before you begin this tutorial, you must have the following:

- An Azure subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].
- The latest version of Azure PowerShell installed and configured. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].

**Estimated time to complete:** 30 minutes

##In this tutorial

* [Provision an HBase cluster with PowerShell](#create-hbase-cluster)
* [Create an HBase sample table from the HBase shell](#create-sample-table)
* [Use Hive to query an HBase table](#hive-query)
* [Use HBase REST APIs to create an HBase table and retrieve data from the table](#hbase-powershell)
* [Summary](#summary)
	
##<a name="create-hbase-cluster"></a>Provision an HBase cluster with PowerShell

This section describes how to provision an HBase cluster using PowerShell and  how to enable and use RDP to access the cluster.

**To provision an HDInsight cluster with PowerShell** 

1. Open the Windows PowerShell window on the windows machine.
 
2. To enter your cluster credentials, execute the following script in PowerShell to capture your cluster credentials in the PowerShell variable.

		$creds = Get-Credential

3. To create a cluster, execute the following script in PowerShell. You will need to retrieve your default storage account key from the portal and use it for the *DefaultStorageAccountKey* parameter value in this command.

		New-AzureHDInsightCluster -Name <YourClusterName> -ClusterType HBase -Version 3.0 -Location <YourAzureRegion, e.g. "West US"> -DefaultStorageAccountName   <YourStorageAccountName>.blob.core.windows.net -DefaultStorageAccountKey "<YourStorageKey>" -DefaultStorageContainerName <HBaseContainerName> -Credential $creds -ClusterSizeInNodes <NumberOfNodesHBaseCluster> 


##<a name="create-sample-table"></a>Create an HBase sample table from the HBase shell
This section describes how to enable and use the Remote Desktop Protocol (RDP) to access the HBase shell and then use it to create an HBase sample table, add rows, and then list the rows in the table.

It assumes you have completed the procedure outlined in the first section, and so have already successfully created an HBase cluster.

**Enable the RDP connection to the HBase cluster**

1. To enable a Remote Desktop Connection to the HDInsight cluster, select the HBase cluster you have created and click the **CONFIGURATION** tab. Click the **ENABLE REMOTE** button at the bottom of the page to enable the RDP connection to the cluster.
2. Provide the credentials and expiration date on the **CONFIGURE REMOTE DESKTOP** wizard and click the checked circle on the lower right. (It might take a few minutes for the operation to complete.)
3. To connect to the HDInsight cluster, click on the **CONNECT** button at the bottom of the **CONFIGURATION** tab.

 
**Open the HBase Shell**

1. Within your RDP session, click on the **Hadoop Command Prompt** shortcut located on the desktop.

2. Change the folder to the HBase home directory:
		
		cd %HBASE_HOME%\bin

3. Open the HBase shell:

		hbase shell


**Create a sample table, add data and retrieve the data**

1. Create a sample table:

		create 'sampletable', 'cf1'

2. Add a row to the sample table:

		put 'sampletable', 'row1', 'cf1:col1', 'value1'

3. List the rows in the sample table:
	
		scan 'sampletable'

##<a name="hive-query"></a>Use Hive to query an HBase table

Now you have an HBase cluster provisioned and have created a table, you can query it using Hive. This section creates a Hive table that maps to the HBase table and uses it to queries the data in your HBase table.

**To open cluster dashboard**

1. Sign in to the [Azure Management Portal][azure-management-portal]. 
2. Click **HDINSIGHT** from the left pane. You shall see a list of clusters created including the one you just created in the last section.
3. Click the cluster name where you want to run the Hive job.
4. Click **MANAGE CLUSTER** from the bottom of the page to open cluster dashboard. It opens a Web page on a different browser tab.   
5. Enter the Hadoop User account username and password.  The default username is **admin**, the password is what you entered during the provision process.  The dashboard looks like :

	![](http://i.imgur.com/tMwXlj9.jpg)


**To run an Hive query**

1. To create a Hive Table with a mapping to HBase table, enter HiveQL script below into Hive console window and click **SUBMIT** button. Make sure that you have created the sampletable referenced here in HBase using the HBase Shell before executing this statement.

	    SET hbase.zookeeper.quorum=zookeepernode0,zookeepernode1,zookeepernode2;  
    	CREATE EXTERNAL TABLE hbasesampletable(rowkey STRING, col1 STRING, col2 STRING)
    	STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
    	WITH SERDEPROPERTIES ('hbase.columns.mapping' = ':key,cf1:col1,cf1:col2')
    	TBLPROPERTIES ('hbase.table.name' = 'sampletable');

 
2. To execute a Hive Query Over the Data in HBase, enter the HiveQL script below into Hive console window and click **SUBMIT** button.

	    SET hbase.zookeeper.quorum=zookeepernode0,zookeepernode1,zookeepernode2;
    	SET hive.aux.jars.path=file:///C:/Apps/dist/hive-0.12.0.2.0.9.0-1677/lib/hive-hbase-handler-0.12.0.2.0.9.0-1677.jar,file:///C:/Apps/dist/hive-0.12.0.2.0.9.0-1677/lib/hbase-server-0.96.0.2.0.9.0-1677-hadoop2.jar,file:///C:/Apps/dist/hive-0.12.0.2.0.9.0-1677/lib/hbase-protocol-0.96.0.2.0.9.0-1677-hadoop2.jar,file:///C:/Apps/dist/hive-0.12.0.2.0.9.0-1677/lib/htrace-core-2.01.jar,file:///C:/Apps/dist/hive-0.12.0.2.0.9.0-1677/lib/hbase-client-0.96.0.2.0.9.0-1677-hadoop2.jar,file:///C:/Apps/dist/hive-0.12.0.2.0.9.0-1677/lib/guava-12.0.1.jar;
     	SELECT count(*) FROM hbasesampletable;
 
4. To retrieve the results of the Hive query, click on the **View Details** link in the **Job Session** window when the job finishes executing.


Note: The HBase shell link switches the tab to the **HBase Shell**.



**To browse the output file**

1. From the cluster dashboard, click **Files** from the top.
2. Click **Templeton-Job-Status**.
3. Click the GUID number which has the last Modified time a little after the Job Start Time you wrote down earlier. Make a note of this GUID.  You will need it in the next section.
4. The **stdout** file has the data you need in the next section. You can click **stdout** to download a copy of the data file if you want.

	
##<a name="hbase-powershell"></a>Use HBase REST APIs to create an HBase table and retrieve data from the table

1. Open the Windows PowerShell window on the windows machine.
 
2. To enter your cluster credentials, execute the following script in PowerShell to capture your cluster credentials in the PowerShell variable.

		$creds = Get-Credential

3. To get a list of HBase tables, execute an HTTP GET request against the HBase REST end-point.

		Invoke-RestMethod https://yourclustername.azurehdinsight.net/hbaserest -Credential $creds
 
4. To retrieve a row by its key, specify the table name and a row key in the URI to retrieve a row value using a GET request. Make sure that you have created the sampletable in HBase using the HBase shell before executing this statement.

	    $row = Invoke-RestMethod https://yourclustername.azurehdinsight.net/hbaserest/sampletable/row1 -Credential $creds
    	$row.CellSet.Row.Cell

 
5. To create a new HBase table, use an HTTP PUT request. (The schema of the table is specified by the JSON format.)

		Invoke-RestMethod "https://yourclustername.azurehdinsight.net/hbaserest/sampletable/schema" -Method Put -ContentType "application/json" -Credential $creds -Body '{"name":"sampletable2","ColumnSchema":[{"name":"cf1"},{"name":"cf2"}]}'

6. To create a new row with Base64 encoding, use the following PUT command.

		function Base64Encode()
		{
		    param(
		        [string]$str)
		    return [System.Convert]::ToBase64String([System.Text.Encoding]::Default.GetBytes($str))
		}


		// PUT Row
		$newrow = "row4"
		$newcolumn = "cf1:col1"
		$newvalue = "value4"
		Invoke-RestMethod "https://yourclustername.azurehdinsight.net/hbaserest/sampletable/$newrow" -Method Put -ContentType "application/json" -Credential $creds `
		-Body @"
		{
		   "Row":[
		      {
		         "key":"$(Base64Encode($newrow))",
		         "Cell":[
		            {
		               "column":"$(Base64Encode($newcolumn))",
		               "$":"$(Base64Encode($newvalue))"
		            }
		         ]
		      }
		   ]
		}
		"@ 

7. To retrieve a row with Base64 encoding, use the following GET command.

		function Base64Decode()
		{
		    param(
		        [string]$base64str)
		    return [System.Text.Encoding]::Default.GetString([System.Convert]::FromBase64String($base64str))
		}

		// GET Row
		$row = Invoke-RestMethod https://yourclustername.azurehdinsight.net/hbaserest/sampletable/row2 -Credential $creds
		"$(Base64Decode($row.CellSet.Row.Cell.column)) = $(Base64Decode($row.CellSet.Row.Cell.'#text'))"


8. To scan the rows in the table, use the following set of commands. Note that you must use the hbaserest0 type of URI where the end-point is assigned to a specific rest server. The scanner created in the first call keeps it’s state on the specific rest server therefore subsequent calls should be made to the same rest end-point.

	    $scanner = Invoke-WebRequest "https://yourclustername.azurehdinsight.net/hbaserest0/sampletable/scanner" -Method Put -ContentType "text/xml" -Credential $creds -Body '<Scanner batch="10"/>'	
    	$scannerparts = $scanner.Headers.Location.Split('/')	
    	$scannerid = $scannerparts[$scannerparts.Length-1]	
    	$rows = Invoke-RestMethod "https://yourclustername.azurehdinsight.net/hbaserest0/sampletable/scanner/	
    	$scannerid" -Credential $creds	
    	$rows.InnerXml 


##<a name="summary"></a>Summary
In this tutorial, you have learned how to provision an HBase cluster, create tables, and and view the data in those tables with PowerShell. You also learned how use Hive to query the data in HBase tables and how to use the HBase REST APIs to create an HBase table and retrieve data from the table.


[hdinsight-versions]: ../hdinsight-component-versioning/

[hdinsight-get-started-30]: ../hdinsight-get-started-30/

[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/

[hdinsight-use-hive]: ../hdinsight-use-hive/

[hdinsight-storage]: ../hdinsight-use-blob-storage/



[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: ../storage-create-storage-account/ 

[apache-hadoop]: http://hadoop.apache.org/

[powershell-download]: http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409
[powershell-install-configure]: ../install-configure-powershell/
[powershell-open]: ../install-configure-powershell/#Install


[img-hdi-dashboard]: ./media/hdinsight-get-started/HDI.dashboard.png
[img-hdi-dashboard-query-select]: ./media/hdinsight-get-started/HDI.dashboard.query.select.png
[img-hdi-dashboard-query-select-result]: ./media/hdinsight-get-started/HDI.dashboard.query.select.result.png






