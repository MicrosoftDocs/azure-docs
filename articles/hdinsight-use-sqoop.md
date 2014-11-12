<properties urlDisplayName="Use Hadoo Sqoop in HDInsight" pageTitle="Use Hadoop Sqoop in HDInsight | Azure" metaKeywords="" description="Learn how to use Azure PowerShell from a workstation to run Sqoop import and export between an Hadoop cluster and an Azure SQL database." umbracoNaviHide="0" disqusComments="1" editor="cgronlun" manager="paulettm" services="hdinsight" documentationCenter="" title="Use Hadoop Sqoop in HDInsight" authors="jgao" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="jgao" />

# Use Sqoop with Hadoop in HDInsight
 
Learn how to use Azure PowerShell and HDInsight .NET SDK from a workstation to run Sqoop import and export between an HDInsight cluster and an Azure SQL database or SQL Server database.

**Estimated time to complete:** 30 minutes


##In this article

- [What is Sqoop?](#whatissqoop)
- [Prerequisites](#prerequisites)
- [Understand the tutorial scenario](#scenario)
- [Prepare the tutorial](#prepare)
- [Use PowerShell to run Sqoop export](#export)
- [Use HDInsight SDK to run Sqoop export](#export-sdk)
- [Use PowerShell to run Sqoop import](#import)
- [Next steps](#nextsteps)


## <a id="whatissqoop"></a> What is Sqoop?

While Hadoop is a natural choice for processing unstructured and semi-structured data, such as logs and files, there may also be a need to process structured data stored in relational databases.

[Sqoop][sqoop-user-guide-1.4.4] is a tool designed to transfer data between Hadoop clusters and relational databases. You can use it to import data from a relational database management system (RDBMS) such as SQL or MySQL or Oracle into the Hadoop Distributed File System (HDFS), transform the data in Hadoop with MapReduce or Hive, and then export the data back into an RDBMS. In this tutorial, you are using a SQL Database for your relational database.

For supported Sqoop versions on HDInsight clusters, see [What's new in the cluster versions provided by HDInsight?][hdinsight-versions].




##<a id="prerequisites"></a>Prerequisites

Before you begin this tutorial, you must have the following:

- **Workstation** - A computer with Azure PowerShell installed and configured. For instructions, see [Install and configure Azure PowerShell][powershell-install]. To execute PowerShell scripts, you must run Azure PowerShell as administrator and set the execution policy to *RemoteSigned*. See [Run Windows PowerShell scripts][powershell-script].

- **Azure HDInsight cluster**. For instructions on cluster provision, see [Get started using HDInsight][hdinsight-get-started] or [Provision HDInsight clusters][hdinsight-provision]. You will need the following data to go through the tutorial:

	<table border="1">
	<tr><th>Cluster property</th><th>PowerShell variable name</th><th>Value</th><th>Description</th></tr>
	<tr><td>HDInsight cluster name</td><td>$clusterName</td><td></td><td>This is your HDInsight cluster name.</td></tr>
	<tr><td>Azure storage account name</td><td>$storageAccountName</td><td></td><td>An Azure Storage account available to the HDInsight cluster. For this tutorial, use the default storage account specified during the cluster provision process.</td></tr>
	<tr><td>Azure Blob container name</td><td>$containerName</td><td></td><td>For this example, use the Azure Blob storage container used for the default HDInsight cluster file system. By default, it has the same name as the HDInsight cluster.</td></tr>
	</table>

- **Azure SQL Database**. You must configure a firewall rule for the SQL Database server to allow access from your workstation. For instructions on creating a SQL database and configuring firewall, see [Get started using Azure SQL database][sqldatabase-get-started]. This article provides a PowerShell script for creating the SQL database table needed for this tutorial. 

	<table border="1">
	<tr><th>SQL database property</th><th>PowerShell variable name</th><th>Value</th><th>Description</th></tr>
	<tr><td>SQL database server name</td><td>$sqlDatabaseServer</td><td></td><td>The SQL Database server to which Sqoop will export data to or import data from. </td></tr>
	<tr><td>SQL database login name</td><td>$sqlDatabaseLogin</td><td></td><td>SQL Database login name.</td></tr>
	<tr><td>SQL database login password</td><td>$sqlDatabasePassword</td><td></td><td>SQL Database login password.</td></tr>
	<tr><td>SQL database name</td><td>$sqlDatabaseName</td><td></td><td>The Azure SQL Database to which Sqoop will export data to or import data from. </td></tr>
	</table>

	> [WACOM.NOTE] By default an Azure SQL database allows connections from Azure services like Azure HDInsight. If this firewall setting is disabled, you must enabled it from Azure Management portal. For instruction on creating SQL database and configuring firewall rules, see [Create and Configure SQL Database][sqldatabase-create-configue]. 

* **SQL Server**. If your HDInsight cluster is on the same Azure Virtual Network as a SQL Server, you can use the steps in this article to import and export data to a SQL Server database. For more information, see the following articles.

	> [WACOM.NOTE] > Azure HDInsight only supports location-based Virtual Networks, and does not currently work with Affinity Group-based Virtual Networks.

	* To **create and configure a Virtual Network**, see [Virtual Network Configuration Tasks](http://msdn.microsoft.com/en-us/library/azure/jj156206.aspx).

		* When using SQL Server **in your datacenter**, you must configure the Virtual Network as either *site-to-site* or *point-to-site*.

			> [WACOM.NOTE] For **point-to-site** Virtual Networks, the SQL Server must be running the VPN client configuration application, which is available from the **Dashboard** of your Azure Virtual Network configuration.

		* When using SQL Server in an **Azure Virtual Machine**, any Virtual Network configuration may be used as long as the Virtual Machine hosting SQL Server is a member of the same Virtual Network as HDInsight.

	* To **provision an HDInsight cluster onto a Virtual Network**, see [Provision Hadoop clusters in HDInsight using custom options](/en-us/documentation/articles/hdinsight-provision-clusters/)

	> [WACOM.NOTE] The SQL Server must also allow SQL Authentication. You must use a SQL login for the steps in this article.

	<table border="1">
	<tr><th>SQL database property</th><th>PowerShell variable name</th><th>Value</th><th>Description</th></tr>
	<tr><td>SQL Server name</td><td>$sqlDatabaseServer</td><td></td><td>The SQL Server to which Sqoop will export data to or import data from. </td></tr>
	<tr><td>SQL Server login name</td><td>$sqlDatabaseLogin</td><td></td><td>A SQL login name.</td></tr>
	<tr><td>SQL login password</td><td>$sqlDatabasePassword</td><td></td><td>The SQL login password.</td></tr>
	<tr><td>SQL Server database name</td><td>$sqlDatabaseName</td><td></td><td>The database to which Sqoop will export data to or import data from. </td></tr>
	</table>


> [WACOM.NOTE] Fill the values into the tables above.  It will be helpful for going through this tutorial.

## <a id="scenario"></a>Understand the scenario
HDInsight cluster comes with some sample data. You will use the following two:

- A log4j log file located at */example/data/sample.log*. The following logs are extracted from the file:

		2012-02-03 18:35:34 SampleClass6 [INFO] everything normal for id 577725851
		2012-02-03 18:35:34 SampleClass4 [FATAL] system problem at id 1991281254
		2012-02-03 18:35:34 SampleClass3 [DEBUG] detail for id 1304807656
		...

- A Hive table named *hivesampletable* referencing the data file located at */hive/warehouse/hivesampletable*. The table contains some mobile device data. The Hive table schema is:

	<table border="1">
	<tr><th>Field</th><th>Data type</th></tr>
	<tr><td>clientid</td><td>string</td></tr>
	<tr><td>querytime</td><td>string</td></tr>
	<tr><td>market</td><td>string</td></tr>
	<tr><td>deviceplatform</td><td>string</td></tr>
	<tr><td>devicemake</td><td>string</td></tr>
	<tr><td>devicemodel</td><td>string</td></tr>
	<tr><td>state</td><td>string</td></tr>
	<tr><td>country</td><td>string</td></tr>
	<tr><td>querydwelltime</td><td>double</td></tr>
	<tr><td>sessionid</td><td>bigint</td></tr>
	<tr><td>sessionpagevieworder</td><td>bigint</td></tr>
	</table>

You will first export both sample.log and hivesampletable to SQL database or SQL Server, and then import the table containing the mobile device data back to HDInsight using the following path:

	/tutorials/usesqoop/importeddata

###Understand HDInsight storage

HDInsight uses Azure Blob Storage for data storage.  It is called *WASB* or *Azure Storage - Blob*. WASB is Microsoft's implementation of HDFS on Azure Blob storage. For more information see [Use Azure Blob storage with HDInsight][hdinsight-storage]. 

When you provision an HDInsight cluster, an Azure Storage account and a specific Blob storage container from that account is designated as the default file system, just like in HDFS. In addition to this storage account, you can add additional storage accounts from either the same Azure subscription or different Azure subscriptions during the provision process. For instructions on adding additional storage accounts, see [Provision HDInsight clusters][hdinsight-provision]. To simply the PowerShell script used in this tutorial, all of the files are stored in the default file system container, located at */tutorials/usesqoop*. By default this container has the same name as the HDInsight cluster name. 
The WASB syntax is:

	wasb[s]://<ContainerName>@<StorageAccountName>.blob.core.windows.net/<path>/<filename>

> [WACOM.NOTE] Only the *wasb://* syntax is supported in HDInsight cluster version 3.0. The older *asv://* syntax is supported in HDInsight 2.1 and 1.6 clusters, but it is not supported in HDInsight 3.0 clusters and it will not be supported in later versions.

> [WACOM.NOTE] The WASB path is a virtual path.  For more information see [Use Azure Blob storage with HDInsight][hdinsight-storage]. 

A file stored in the default file system container can be accessed from HDInsight using any of the following URIs (use sample.log as an example):

	wasb://mycontainer@mystorageaccount.blob.core.windows.net/example/data/sample.log
	wasb:///example/data/sample.log
	/example/data/sample.log

If you want to access the file directly from the storage account, the blob name for the file is:

	example/data/sample.log


##<a id="prepare"></a>Prepare the tutorial

You will create two tables in SQL Database or SQL Server. These are used by Sqoop export later in the tutorial. You will also need to pre-process the sample.log files before it can be processed by Sqoop.

###Create a SQL tables

**For Azure SQL Database**

1. Open Windows PowerShell ISE (On Windows 8 Start screen, type **PowerShell_ISE** and then click **Windows PowerShell ISE**. See [Start Windows PowerShell on Windows 8 and Windows][powershell-start]).

2. Copy the following script into the script pane, and then set the first four variables:
		
		#SQL database variables
		$sqlDatabaseServer = "<SQLDatabaseServerName>" 
		$sqlDatabaseLogin = "<SQLDatabaseUsername>"
		$sqlDatabasePassword = "<SQLDatabasePassword>"
		$sqlDatabaseName = "<SQLDatabaseName>" 

		$sqlDatabaseConnectionString = "Data Source=$sqlDatabaseServer.database.windows.net;Initial Catalog=$sqlDatabaseName;User ID=$sqlDatabaseLogin;Password=$sqlDatabasePassword;Encrypt=true;Trusted_Connection=false;"

	For more descriptions of the variables, see the [Prerequisites](#prerequisites) section in this tutorial. 

3. Append the following script into the script pane. These are the SQL statements defining the two tables and their clustered indexes.  SQL Database requires clustered index.

		# SQL query strings for creating tables and clustered indexes
		$cmdCreateLog4jTable = "CREATE TABLE [dbo].[log4jlogs](
		    [t1] [nvarchar](50), 
		    [t2] [nvarchar](50), 
		    [t3] [nvarchar](50), 
		    [t4] [nvarchar](50), 
		    [t5] [nvarchar](50), 
		    [t6] [nvarchar](50), 
		    [t7] [nvarchar](50))"
		
		$cmdCreateLog4jClusteredIndex = "CREATE CLUSTERED INDEX log4jlogs_clustered_index on log4jlogs(t1)"
		
		$cmdCreateMobileTable = " CREATE TABLE [dbo].[mobiledata](
		[clientid] [nvarchar](50), 
		[querytime] [nvarchar](50), 
		[market] [nvarchar](50), 
		[deviceplatform] [nvarchar](50), 
		[devicemake] [nvarchar](50), 
		[devicemodel] [nvarchar](50), 
		[state] [nvarchar](50), 
		[country] [nvarchar](50), 
		[querydwelltime] [float],
		[sessionid] [bigint],
		[sessionpagevieworder][bigint])"
		
		$cmdCreateMobileDataClusteredIndex = "CREATE CLUSTERED INDEX mobiledata_clustered_index on mobiledata(clientid)"

4. Append the following script into the script pane for running the SQL commands:

		Write-Host "Connect to the SQL Database ..." -ForegroundColor Green
		$conn = New-Object System.Data.SqlClient.SqlConnection
		$conn.ConnectionString = $sqlDatabaseConnectionString
		$conn.Open()
		
		Write-Host "Create log4j table and clustered index ..." -ForegroundColor Green
		$cmd = New-Object System.Data.SqlClient.SqlCommand
		$cmd.Connection = $conn
		$cmd.CommandText = $cmdCreateLog4jTable
		$ret = $cmd.ExecuteNonQuery()
		$cmd.CommandText = $cmdCreateLog4jClusteredIndex
		$cmd.ExecuteNonQuery()
		
		Write-Host "Create log4j table and clustered index ..." -ForegroundColor Green
		$cmd.CommandText = $cmdCreateMobileTable
		$cmd.ExecuteNonQuery()
		$cmd.CommandText = $cmdCreateMobileDataClusteredIndex
		$cmd.ExecuteNonQuery()
		
		Write-Host "Close connection ..." -ForegroundColor Green		
		$conn.close()
		
		Write-Host "Done" -ForegroundColor Green
	
5. Click **Run Script** or press **F5** to run the script. 
6. Use [Azure Management portal][azure-management-portal] to examine the tables and clustered indexes.

**For SQL Server**

1. Open **SQL Server Management Studio** and connect to the SQL Server.

2. Create a new database named **sqoopdb**.

3. Select the **sqoopdb** database, and then select **New query** from the ribbon at the top of SQL Server Management Studio.

4. Enter the following into the query window.

		CREATE TABLE [dbo].[log4jlogs](
		 [t1] [nvarchar](50), 
		 [t2] [nvarchar](50), 
		 [t3] [nvarchar](50), 
		 [t4] [nvarchar](50), 
		 [t5] [nvarchar](50), 
		 [t6] [nvarchar](50), 
		 [t7] [nvarchar](50))

		CREATE TABLE [dbo].[mobiledata](
		 [clientid] [nvarchar](50), 
		 [querytime] [nvarchar](50), 
		 [market] [nvarchar](50), 
		 [deviceplatform] [nvarchar](50), 
		 [devicemake] [nvarchar](50), 
		 [devicemodel] [nvarchar](50), 
		 [state] [nvarchar](50), 
		 [country] [nvarchar](50), 
		 [querydwelltime] [float],
		 [sessionid] [bigint],
		 [sessionpagevieworder][bigint])

5. Use the **F5** function key, or select **! Execute** on the ribbon to run the query. The following message should appear below the query.

		Command(s) completed successfully.

6. Close SQL Server Management Studio.

###Generate data

In this tutorial, you will export a log4j log file (a delimited file) and a Hive table to SQL Database.  The delimited file is */example/data/sample.log*. Earlier in the tutorial, you see a few samples of log4j logs. In the log file, there are some empty lines and some other lines similar to:

	java.lang.Exception: 2012-02-03 20:11:35 SampleClass2 [FATAL] unrecoverable system problem at id 609774657
		at com.osa.mocklogger.MockLogger$2.run(MockLogger.java:83)

This is fine for other examples that use this data, but we must remove these exceptions before we can import it into SQL Database or SQL Server. Sqoop export will fail if there is an empty string, or a line with fewer number of elements than the number of fields defined in the SQL database table. The log4jlogs table has 7 string-type fields.

**To pre-process the sample.log file**

1. Open Windows PowerShell ISE.
2. In the bottom pane, run the following command to connect to your Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Azure account credentials. This method of adding a subscription connection times out, and after 12 hours, you will have to log in again. 

	> [WACOM.NOTE] If you have multiple Azure subscriptions and the default subscription is not the one you want to use, use the <strong>Select-AzureSubscription</strong> cmdlet to select the current subscription.

3. Copy the following script into the script pane, and then set the first two variables:
		
		$storageAccountName = "<AzureStorageAccountName>"
		$containerName = "<BlobContainerName>"
		
		$sourceBlobName = "example/data/sample.log"
		$destBlobName = "tutorials/usesqoop/data/sample.log"

	For more descriptions of the variables, see the [Prerequisites](#prerequisites) section in this tutorial. 
 
4. Append the following script into the script pane:

		# Define the connection string
		$storageAccountKey = get-azurestoragekey $storageAccountName | %{$_.Primary}
		$storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=$storageAccountName;AccountKey=$storageAccountKey"
		
		# Create block blob objects referencing the source and destination blob.
		$storageAccount = [Microsoft.WindowsAzure.Storage.CloudStorageAccount]::Parse($storageConnectionString)
		$storageClient = $storageAccount.CreateCloudBlobClient();
		$storageContainer = $storageClient.GetContainerReference($containerName)
		$sourceBlob = $storageContainer.GetBlockBlobReference($sourceBlobName)
		$destBlob = $storageContainer.GetBlockBlobReference($destBlobName)
		
		# Define a MemoryStream and a StreamReader for reading from the source file
		$stream = New-Object System.IO.MemoryStream
		$stream = $sourceBlob.OpenRead()
		$sReader = New-Object System.IO.StreamReader($stream)
		
		# Define a MemoryStream and a StreamWriter for writing into the destination file
		$memStream = New-Object System.IO.MemoryStream
		$writeStream = New-Object System.IO.StreamWriter $memStream
		
		# process the source blob
		$exString = "java.lang.Exception:"
		while(-Not $sReader.EndOfStream){
		    $line = $sReader.ReadLine()
		    $split = $line.Split(" ")
		
		    # remove the "java.lang.Exception" from the first element of the array
		    # for example: java.lang.Exception: 2012-02-03 19:11:02 SampleClass8 [WARN] problem finding id 153454612
		    if ($split[0] -eq $exString){
		        #create a new ArrayList to remove $split[0]
		        $newArray = [System.Collections.ArrayList] $split
		        $newArray.Remove($exString)
		
		        # update $split and $line
		        $split = $newArray
		        $line = $newArray -join(" ")
		    }
		
		    # remove the lines that has less than 7 elements
		    if ($split.count -ge 7){
		        write-host $line
		        $writeStream.WriteLine($line)
		    }
		}
		
		# Write to the destination blob
		$writeStream.Flush()
		$memStream.Seek(0, "Begin")
		$destBlob.UploadFromStream($memStream)

5. Click **Run Script** or press **F5** to run the script.  
6. To examine the modified data file, you can use Azure Management portal, or an Azure Storage explorer tool, or Azure PowerShell.  [Get started with HDInsight][hdinsight-get-started] has a code sample on using PowerShell to download a file and display the file content.


##<a id="export"></a>Use PowerShell to run Sqoop export

In this section, you will use Azure PowerShell to run the Sqoop export command to export both a Hive table, and a data file to an Azure SQL database or SQL Server. The next section provides an HDInsight .NET sample.

> [WACOM.NOTE] Other than connection string information, the steps in this section should work for either Azure SQL Database or SQL Server. These steps were tested against the following configuration:
> 
> * **Azure Virtual Network point-to-site configuration** - A virtual network connecting the HDInsight cluster to a SQL Server in a private datacenter. See [Configure a Point-to-Site VPN in the Management Portal](http://msdn.microsoft.com/en-us/library/azure/dn133792.aspx) for more information.
> * **Azure HDInsight 3.1** - See [Provision Hadoop clusters in HDInsight using custom options](/en-us/documentation/articles/hdinsight-provision-clusters/) for information on creating a cluster on a Virtual Network
> * **SQL Server 2014** - Configured to allow SQL Authentication and running the VPN client configuration package to connect securely to the Virtual Network

**To export the log4j log file**

1. Open Windows PowerShell ISE.
2. In the bottom pane, run the following command to connect to your Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Azure account credentials.

3. Copy the following script into the script pane, and then set the first seven variables:

		# Define the cluster variables
		$clusterName = "<HDInsightClusterName>"
		$storageAccountName = "<AzureStorageAccount>"
		$containerName = "<BlobStorageContainerName>"
		
		# Define the SQL database variables
		$sqlDatabaseServerName = "<SQLDatabaseServerName>"
		$sqlDatabaseLogin = "<SQLDatabaseUsername>"
		$sqlDatabasePassword = "<SQLDatabasePassword>"
		$databaseName = "<SQLDatabaseName>"

		$tableName_log4j = "log4jlogs"
		
		# Connection string for Azure SQL Database.
		# Comment if using SQL Server
		$connectionString = "jdbc:sqlserver://$sqlDatabaseServerName.database.windows.net;user=$sqlDatabaseLogin@$sqlDatabaseServerName;password=$sqlDatabasePassword;database=$databaseName"
		# Connection string for SQL Server.
		# Uncomment if using SQL Server.
		#$connectionString = "jdbc:sqlserver://$sqlDatabaseServerName;user=$sqlDatabaseLogin;password=$sqlDatabasePassword;database=$databaseName"
		
		$exportDir_log4j = "/tutorials/usesqoop/data"
	
	For more descriptions of the variables, see the [Prerequisites](#prerequisites) section in this tutorial. 

	Notice $exportDir_log4j doesn't have the sample.log file file name specified. Sqoop will export the data from all of the files under that folder.

4. Append the following script into the script pane:

		# Submit a Sqoop job
		$sqoopDef = New-AzureHDInsightSqoopJobDefinition -Command "export --connect $connectionString --table $tableName_log4j --export-dir $exportDir_log4j --input-fields-terminated-by \0x20 -m 1"
		$sqoopJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $sqoopDef #-Debug -Verbose
		Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600 -Job $sqoopJob
		
		Write-Host "Standard Error" -BackgroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $sqoopJob.JobId -StandardError
		Write-Host "Standard Output" -BackgroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $sqoopJob.JobId -StandardOutput

	Notice the field delimiter is **\0x20**, which is space. The delimiter is defined in  the sample.log file pre-process PowerShell script. To find out about **-m 1**, see [Sqoop user guide][sqoop-user-guide-1.4.4].

5. Click **Run Script** or press **F5** to run the script.  
6. Use [Azure Management portal][azure-management-portal] to examine the exported data.

**To export the hivesampletable Hive table**

1. Open Windows PowerShell ISE.
2. In the bottom pane, run the following command to connect to your Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Azure account credentials.

3. Copy the following script into the script pane, and then set the first seven variables:

		# Define the cluster variables
		$clusterName = "<HDInsightClusterName>"
		$storageAccountName = "<AzureStorageAccount>"
		$containerName = "<BlobStorageContainerName>"
		
		# Define the SQL database variables
		$sqlDatabaseServerName = "<SQLDatabaseServerName>"
		$sqlDatabaseLogin = "<SQLDatabaseUsername>"
		$sqlDatabasePassword = "SQLDatabasePassword>"
		$databaseName = "SQLDatabaseName"

		$tableName_mobile = "mobiledata"
		
		# Connection string for Azure SQL Database.
		# Comment if using SQL Server
		$connectionString = "jdbc:sqlserver://$sqlDatabaseServerName.database.windows.net;user=$sqlDatabaseLogin@$sqlDatabaseServerName;password=$sqlDatabasePassword;database=$databaseName"
		# Connection string for SQL Server.
		# Uncomment if using SQL Server
		#$connectionString = "jdbc:sqlserver://$sqlDatabaseServerName;user=$sqlDatabaseLogin;password=$sqlDatabasePassword;database=$databaseName"
		
		$exportDir_mobile = "/hive/warehouse/hivesampletable"
	
	For more descriptions of the variables, see the [Prerequisites](#prerequisites) section in this tutorial. 

4. Append the following script into the script pane:
		
		$sqoopDef = New-AzureHDInsightSqoopJobDefinition -Command "export --connect $connectionString --table $tableName_mobile --export-dir $exportDir_mobile --fields-terminated-by \t -m 1"
		
		
		$sqoopJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $sqoopDef #-Debug -Verbose
		Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600 -Job $sqoopJob
		
		Write-Host "Standard Error" -BackgroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $sqoopJob.JobId -StandardError
		Write-Host "Standard Output" -BackgroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $sqoopJob.JobId -StandardOutput

5. Click **Run Script** or press **F5** to run the script.   
6. Use [Azure Management portal][azure-management-portal] to examine the exported data.



##<a id="export-sdk"></a>Use HDInsight .NET SDK to run Sqoop export

The following is a C# sample using HDInsight .NET SDK to run Sqoop export. For the general information on using HDInsight .NET SDK, see [Submit Hadoop jobs programmatically][hdinsight-submit-jobs].


	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Text;
	using System.Threading.Tasks;
	using System.IO;
	using System.Threading;
	using System.Security.Cryptography.X509Certificates;
	using Microsoft.WindowsAzure.Management.HDInsight;
	using Microsoft.Hadoop.Client;
	
	namespace sqoopSDKSample
	{
	    class Program
	    {
	        static void Main(string[] args)
	        {
	            // Set the variables
	            string subscriptionID = "<AzureSubscriptionID>";
	            string clusterName = "<HDInsightClusterName>";
	            string certFriendlyName = "<AzureCertificateFriendlyName>";
	            string sqlDatabaseServerName = "<SQLDatabaseServerName>";
	            string sqlDatabaseLogin = "<SQLDatabaseLogin>";
	            string sqlDatabaseLoginPassword = "<SQLDatabaseLoginPassword>";
	            string sqlDatabaseDatabaseName = "hdisqoop";
	            string sqlDatabaseTableName = "log4jlogs";
	
	            cmdExport = @"export";
				// Connection string for using Azure SQL Database.
				// Comment if using SQL Server
	            cmdExport = cmdExport + @" --connect jdbc:sqlserver://" + sqlDatabaseServerName + ".database.windows.net;user=" + sqlDatabaseLogin + "@" + sqlDatabaseServerName + ";password=" + sqlDatabaseLoginPassword + ";database=" + sqlDatabaseDatabaseName;
				// Connection string for using SQL Server.
				// Uncomment if using SQL Server
				//cmdExport = cmdExport + @" --connect jdbc:sqlserver://" + sqlDatabaseServerName + ";user=" + sqlDatabaseLogin + ";password=" + sqlDatabaseLoginPassword + ";database=" + sqlDatabaseDatabaseName;
	            cmdExport = cmdExport + @" --table " + sqlDatabaseTableName;
	            cmdExport = cmdExport + @" --export-dir /tutorials/usesqoop/data";
	            cmdExport = cmdExport + @" --input-fields-terminated-by \0x20 -m 1";
	
	            SqoopJobCreateParameters sqoopJobDefinition = new SqoopJobCreateParameters()
	            {
	                Command = cmdExport,
	                StatusFolder = "/tutorials/usesqoop/jobStatus"
	            };
	
	            // Get the certificate object from certificate store using the friendly name to identify it
	            X509Store store = new X509Store();
	            store.Open(OpenFlags.ReadOnly);
	            X509Certificate2 cert = store.Certificates.Cast<X509Certificate2>().First(item => item.FriendlyName == certFriendlyName);
	            JobSubmissionCertificateCredential creds = new JobSubmissionCertificateCredential(new Guid(subscriptionID), cert, clusterName);
	
	            // Submit the Hive job
	            var jobClient = JobSubmissionClientFactory.Connect(creds);
	            JobCreationResults jobResults = jobClient.CreateSqoopJob(sqoopJobDefinition);
	
	            // Wait for the job to complete
	            WaitForJobCompletion(jobResults, jobClient);
	
	            // Print the Hive job output
	            System.IO.Stream stream = jobClient.GetJobErrorLogs(jobResults.JobId);
	
	            StreamReader reader = new StreamReader(stream);
	            Console.WriteLine(reader.ReadToEnd());
	
	            Console.WriteLine("Press ENTER to continue.");
	            Console.ReadLine();
	        }
	
	        private static void WaitForJobCompletion(JobCreationResults jobResults, IJobSubmissionClient client)
	        {
	            JobDetails jobInProgress = client.GetJob(jobResults.JobId);
	            while (jobInProgress.StatusCode != JobStatusCode.Completed && jobInProgress.StatusCode != JobStatusCode.Failed)
	            {
	                jobInProgress = client.GetJob(jobInProgress.JobId);
	                Thread.Sleep(TimeSpan.FromSeconds(10));
	            }
	        }
	    }
	}

To execute a script file, you can replace:

	Command = cmdExport,

 with:

	File = "/tutorials/usesqoop/sqoopexport.txt",

The script file must be located on WASB.




##<a id="import"></a>Use PowerShell to run Sqoop import

In this section, you will import the log4j logs (that you exported to SQL Database) back to HDInsight.

1. Open Windows PowerShell ISE.
2. In the bottom pane, run the following command to connect to your Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Azure account credentials.

3. Copy the following script into the script pane, and then set the first seven variables:

		# Define the cluster variables
		$clusterName = "<HDInsightClusterName>"
		$storageAccountName = "<AzureStorageAccount>"
		$containerName = "<BlobStorageContainerName>"
		
		# Define the SQL database variables
		$sqlDatabaseServerName = "<SQLDatabaseServerName>"
		$sqlDatabaseLogin = "<SQLDatabaseUsername>"
		$sqlDatabasePassword = "SQLDatabasePassword>"
		$databaseName = "SQLDatabaseName"

		$tableName_log4j = "log4jlogs"
		
		# Connection string for Azure SQL Database
		# Comment if using SQL Server
		$connectionString = "jdbc:sqlserver://$sqlDatabaseServerName.database.windows.net;user=$sqlDatabaseLogin@$sqlDatabaseServerName;password=$sqlDatabasePassword;database=$databaseName"
		# Connection string for SQL Server
		# Uncomment if using SQL Server
		#$connectionString = "jdbc:sqlserver://$sqlDatabaseServerName;user=$sqlDatabaseLogin;password=$sqlDatabasePassword;database=$databaseName"
		
		$tableName_mobile = "mobiledata"
		$targetDir_mobile = "/tutorials/usesqoop/importeddata/"
	
	For more descriptions of the variables, see the [Prerequisites](#prerequisites) section in this tutorial. 

4. Append the following script into the script pane:
	
		$sqoopDef = New-AzureHDInsightSqoopJobDefinition -Command "import --connect $connectionString --table $tableName_mobile --target-dir $targetDir_mobile --fields-terminated-by \t --lines-terminated-by \n -m 1"
		
		$sqoopJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $sqoopDef #-Debug -Verbose
		Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600 -Job $sqoopJob
		
		Write-Host "Standard Error" -BackgroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $sqoopJob.JobId -StandardError
		Write-Host "Standard Output" -BackgroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $sqoopJob.JobId -StandardOutput

5. Click **Run Script** or press **F5** to run the script. 
6. To examine the modified data file, you can use Azure Management portal, or an Azure Storage explorer tool, or Azure PowerShell.  [Get started with HDInsight][hdinsight-get-started] has a code sample on using PowerShell to download a file and display the file content.

##<a id="nextsteps"></a>Next Steps

Now you have learned how to use Sqoop. To learn more, see:

- [Use Oozie with HDInsight][hdinsight-use-oozie]: use Sqoop action in Oozie workflow.
- [Analyze flight delay data using HDInsight][hdinsight-analyze-flight-data]: Use Hive to analyze flight delay data, and then use Sqoop to export data to SQL database.
- [Upload data to HDInsight][hdinsight-upload-data]: find other methods for uploading data to HDInsight/Azure Blob storage.


 

[azure-management-portal]: https://manage.windowsazure.com/

[hdinsight-versions]:  ../hdinsight-component-versioning/
[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-analyze-flight-data]: ../hdinsight-analyze-flight-delay-data/
[hdinsight-use-oozie]: ../hdinsight-use-oozie/
[hdinsight-upload-data]: ../hdinsight-upload-data/
[hdinsight-submit-jobs]: ../hdinsight-submit-hadoop-jobs-programmatically/

[sqldatabase-get-started]: ../sql-database-get-started/
[sqldatabase-create-configue]: ../sql-database-create-configure/

[powershell-start]: http://technet.microsoft.com/en-us/library/hh847889.aspx
[powershell-install]: ../install-configure-powershell
[powershell-script]: http://technet.microsoft.com/en-us/library/ee176949.aspx

[sqoop-user-guide-1.4.4]: https://sqoop.apache.org/docs/1.4.4/SqoopUserGuide.html
