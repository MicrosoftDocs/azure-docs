<properties 
	pageTitle="Use time-based Hadoop Oozie Coordinator in HDInsight | Azure" 
	description="Use time-based Hadoop Oozie Coordinator in HDInsight, a big data solution. Learn how to define Oozie workflows and coordinators, and submit coordinator jobs." 
	services="hdinsight" 
	documentationCenter="" 
	authors="mumian" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="jgao"/>


# Use time-based Oozie Coordinator with Hadoop in HDInsight

In this article, you'll learn how to define workflows and coordinators, and how to trigger the coordinator jobs, based on time. It is helpful to go through [Use Oozie with HDInsight][hdinsight-use-oozie] before you read this article. To learn Azure Data Factory, see [Use Pig and Hive with Data Factory][azure-data-factory-pig-hive].


##<a id="whatisoozie"></a>What is Oozie

Apache Oozie is a workflow/coordination system that manages Hadoop jobs. It is integrated with the Hadoop stack, and it supports Hadoop jobs for Apache MapReduce, Apache Pig, Apache Hive, and Apache Sqoop. It can also be used to schedule jobs that are specific to a system, such as Java programs or shell scripts.

The following image shows the workflow you will implement: 

![Workflow diagram][img-workflow-diagram]

The workflow contains two actions:

1. A Hive action runs a HiveQL script to count the occurrences of each log-level type in a log4j log file. Each log4j log consists of a line of fields that contains a [LOG LEVEL] field to show the type and the severity, for example:

		2012-02-03 18:35:34 SampleClass6 [INFO] everything normal for id 577725851
		2012-02-03 18:35:34 SampleClass4 [FATAL] system problem at id 1991281254
		2012-02-03 18:35:34 SampleClass3 [DEBUG] detail for id 1304807656
		...

	The Hive script output is similar to:
	
		[DEBUG] 434
		[ERROR] 3
		[FATAL] 1
		[INFO]  96
		[TRACE] 816
		[WARN]  4

	For more information about Hive, see [Use Hive with HDInsight][hdinsight-use-hive].
	
2.  A Sqoop action exports the HiveQL action output to a table in an Azure SQL database. For more information about Sqoop, see [Use Sqoop with HDInsight][hdinsight-use-sqoop].

> [AZURE.NOTE] For supported Oozie versions on HDInsight clusters, see [What's new in the cluster versions provided by HDInsight?][hdinsight-versions].

> [AZURE.NOTE] This tutorials works on HDInsight cluster version 2.1 and 3.0. This article has not been tested on HDInsight emulator.


##<a id="prerequisites"></a>Prerequisites

Before you begin this tutorial, you must have the following:

- **A workstation** with Azure PowerShell installed and configured. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure]. To execute Windows PowerShell scripts, you must run Azure PowerShell as an administrator and set the execution policy to *RemoteSigned*. For more information, see [Run Windows PowerShell scripts][powershell-script].
- **An HDInsight cluster**. For information about creating an HDInsight cluster, see [Provision HDInsight clusters][hdinsight-provision], or [Get started with HDInsight][hdinsight-get-started]. You will need the following data to go through the tutorial:

	<table border = "1">
	<tr><th>Cluster property</th><th>Windows PowerShell variable name</th><th>Value</th><th>Description</th></tr>
	<tr><td>HDInsight cluster name</td><td>$clusterName</td><td></td><td>The HDInsight cluster on which you will run this tutorial.</td></tr>
	<tr><td>HDInsight cluster username</td><td>$clusterUsername</td><td></td><td>The HDInsight cluster user name. </td></tr>
	<tr><td>HDInsight cluster user password </td><td>$clusterPassword</td><td></td><td>The HDInsight cluster user password.</td></tr>
	<tr><td>Azure storage account name</td><td>$storageAccountName</td><td></td><td>An Azure Storage account available to the HDInsight cluster. For this tutorial, use the default storage account that you specified during the cluster provision process.</td></tr>
	<tr><td>Azure Blob container name</td><td>$containerName</td><td></td><td>For this example, use the Azure Blob storage container that is used for the default HDInsight cluster file system. By default, it has the same name as the HDInsight cluster.</td></tr>
	</table>

- **An Azure SQL database**. You must configure a firewall rule for the SQL Database server to allow access from your workstation. For instructions about creating an Azure SQL database and configuring the firewall, see [Get started using Azure SQL database][sqldatabase-get-started]. This article provides a Windows PowerShell script for creating the Azure SQL database table that you need for this tutorial. 

	<table border = "1">
	<tr><th>SQL database property</th><th>Windows PowerShell variable name</th><th>Value</th><th>Description</th></tr>
	<tr><td>SQL database server name</td><td>$sqlDatabaseServer</td><td></td><td>The SQL database server to which Sqoop will export data. </td></tr>
	<tr><td>SQL database login name</td><td>$sqlDatabaseLogin</td><td></td><td>SQL Database login name.</td></tr>
	<tr><td>SQL database login password</td><td>$sqlDatabaseLoginPassword</td><td></td><td>SQL Database login password.</td></tr>
	<tr><td>SQL database name</td><td>$sqlDatabaseName</td><td></td><td>The Azure SQL database to which Sqoop will export data. </td></tr>
	</table>

	> [AZURE.NOTE] By default an Azure SQL database allows connections from Azure Services, such as Azure HDInsight. If this firewall setting is disabled, you must enable it from the Azure portal. For instruction about creating a SQL Database and configuring firewall rules, see [Create and Configure SQL Database][sqldatabase-create-configure]. 


> [AZURE.NOTE] Fill-in the values in the tables. It will be helpful for going through this tutorial.


##<a id="defineworkflow"></a>Define Oozie workflow and the related HiveQL script

Oozie workflows definitions are written in hPDL (an XML process definition language). The default workflow file name is *workflow.xml*.  You will save the workflow file locally, and then deploy it to the HDInsight cluster by using Azure PowerShell later in this tutorial.

The Hive action in the workflow calls a HiveQL script file. This script file contains three HiveQL statements:

1. **The DROP TABLE statement** deletes the log4j Hive table if it exists.
2. **The CREATE TABLE statement** creates a log4j Hive external table, which points to the location of the log4j log file;
3.  **The location of the log4j log file**. The field delimiter is ",". The default line delimiter is "\n". A Hive external table is used to avoid the data file being removed from the original location, in case you want to run the Oozie workflow multiple times.
3. **The INSERT OVERWRITE statement** counts the occurrences of each log-level type from the log4j Hive table, and it saves the output to an Azure Blob storage location. 

**Note**: There is a known Hive path issue. You will run into this problem when submitting an Oozie job. The instructions for fixing the issue can be found on the TechNet Wiki: [HDInsight Hive error: Unable to rename][technetwiki-hive-error].

**To define the HiveQL script file to be called by the workflow**

1. Create a text file with the following content:

		DROP TABLE ${hiveTableName};
		CREATE EXTERNAL TABLE ${hiveTableName}(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) ROW FORMAT DELIMITED FIELDS TERMINATED BY ' ' STORED AS TEXTFILE LOCATION '${hiveDataFolder}';
		INSERT OVERWRITE DIRECTORY '${hiveOutputFolder}' SELECT t4 AS sev, COUNT(*) AS cnt FROM ${hiveTableName} WHERE t4 LIKE '[%' GROUP BY t4;

	There are three variables used in the script:

	- ${hiveTableName}
	- ${hiveDataFolder}
	- ${hiveOutputFolder}
			
	The workflow definition file (workflow.xml in this tutorial) will pass these values to this HiveQL script at run time.
		
2. Save the file as **C:\Tutorials\UseOozie\useooziewf.hql** by using ANSI (ASCII) encoding. (Use Notepad if your text editor doesn't provide this option.) This script file will be deployed to the HDInsight cluster later in the tutorial.



**To define a workflow**

1. Create a text file with the following content:

		<workflow-app name="useooziewf" xmlns="uri:oozie:workflow:0.2">
		    <start to = "RunHiveScript"/> 
			
		    <action name="RunHiveScript">
		        <hive xmlns="uri:oozie:hive-action:0.2">
		            <job-tracker>${jobTracker}</job-tracker>
		            <name-node>${nameNode}</name-node>
		            <configuration>
		                <property>
		                    <name>mapred.job.queue.name</name>
		                    <value>${queueName}</value>
		                </property>
		            </configuration>
		            <script>${hiveScript}</script>
			    	<param>hiveTableName=${hiveTableName}</param>
		            <param>hiveDataFolder=${hiveDataFolder}</param>
		            <param>hiveOutputFolder=${hiveOutputFolder}</param>
		        </hive>
		        <ok to="RunSqoopExport"/>
		        <error to="fail"/>
		    </action>
		
		    <action name="RunSqoopExport">
		        <sqoop xmlns="uri:oozie:sqoop-action:0.2">
		            <job-tracker>${jobTracker}</job-tracker>
		            <name-node>${nameNode}</name-node>
		            <configuration>
		                <property>
		                    <name>mapred.compress.map.output</name>
		                    <value>true</value>
		                </property>
		            </configuration>
			    <arg>export</arg>
			    <arg>--connect</arg> 
			    <arg>${sqlDatabaseConnectionString}</arg> 
			    <arg>--table</arg>
			    <arg>${sqlDatabaseTableName}</arg> 
			    <arg>--export-dir</arg> 
			    <arg>${hiveOutputFolder}</arg> 
			    <arg>-m</arg> 
			    <arg>1</arg>
			    <arg>--input-fields-terminated-by</arg>
			    <arg>"\001"</arg>
		        </sqoop>
		        <ok to="end"/>
		        <error to="fail"/>
		    </action>
		
		    <kill name="fail">
		        <message>Job failed, error message[${wf:errorMessage(wf:lastErrorNode())}] </message>
		    </kill>
		
		   <end name="end"/>
		</workflow-app>

	There are two actions defined in the workflow. The start-to action is *RunHiveScript*. If the action runs *OK*, the next action is *RunSqoopExport*.

	The RunHiveScript has several variables. You will pass the values when you submit the Oozie job from your workstation by using Azure PowerShell.

	<table border = "1">
	<tr><th>Workflow variables</th><th>Description</th></tr>
	<tr><td>${jobTracker}</td><td>Specify the URL of the Hadoop job tracker. Use <strong>jobtrackerhost:9010</strong> on HDInsight cluster version 3.0 and 2.0.</td></tr>
	<tr><td>${nameNode}</td><td>Specify the URL of the Hadoop name node. Use the default file system wasb:// address, for example, <i>wasb://&lt;containerName&gt;@&lt;storageAccountName&gt;.blob.core.windows.net</i>.</td></tr>
	<tr><td>${queueName}</td><td>Specifies the queue name that the job will be submitted to. Use <strong>default</strong>.</td></tr>
	</table>


	<table border = "1">
	<tr><th>Hive action variable</th><th>Description</th></tr>
	<tr><td>${hiveDataFolder}</td><td>The source directory for the Hive Create Table command.</td></tr>
	<tr><td>${hiveOutputFolder}</td><td>The output folder for the INSERT OVERWRITE statement.</td></tr>
	<tr><td>${hiveTableName}</td><td>The name of the Hive table that references the log4j data files.</td></tr>
	</table>


	<table border = "1">
	<tr><th>Sqoop action variable</th><th>Description</th></tr>
	<tr><td>${sqlDatabaseConnectionString}</td><td>SQL Database connection string.</td></tr>
	<tr><td>${sqlDatabaseTableName}</td><td>The Azure SQL database table to where the data will be exported.</td></tr>
	<tr><td>${hiveOutputFolder}</td><td>The output folder for the Hive INSERT OVERWRITE statement. This is the same folder for the Sqoop export (export-dir).</td></tr>
	</table>

	For more information about Oozie workflow and using the workflow actions, see [Apache Oozie 4.0 documentation][apache-oozie-400] (for HDInsight cluster version 3.0) or [Apache Oozie 3.3.2 documentation][apache-oozie-332] (for HDInsight cluster version 2.1).

2. Save the file as **C:\Tutorials\UseOozie\workflow.xml** by using ANSI (ASCII) encoding. (Use Notepad if your text editor doesn't provide this option.)

**To define coordinator**

1. Create a text file with the following content:

		<coordinator-app name="my_coord_app" frequency="${coordFrequency}" start="${coordStart}" end="${coordEnd}" timezone="${coordTimezone}" xmlns="uri:oozie:coordinator:0.4">
		   <action>
		      <workflow>
		         <app-path>${wfPath}</app-path>
		      </workflow>
		   </action>
		</coordinator-app>

	There are five variables used in the definition file:

	| Variable          | Description |
	| ------------------|------------ |
	| ${coordFrequency} | Job pause time. Frequency is always expressed in minutes. |
	| ${coordStart}     | Job start time. |
	| ${coordEnd}       | Job end time. |
    | ${coordTimezone}  | Oozie processes coordinator jobs in a fixed time zone with no daylight saving time (typically represented by using UTC). This time zone is referred as the "Oozie processing timezone." |
	| ${wfPath}         | The path for the workflow.xml.  If the workflow file name is not the default file name (workflow.xml), you must specify it. |
	
2. Save the file as **C:\Tutorials\UseOozie\coordinator.xml** by using the ANSI (ASCII) encoding. (Use Notepad if your text editor doesn't provide this option.)
	
##<a id="deploy"></a>Deploy the Oozie project and prepare the tutorial

You will run an Azure PowerShell script to perform the following:

- Copy the HiveQL script (useoozie.hql) to Azure Blob storage, wasb:///tutorials/useoozie/useoozie.hql.
- Copy workflow.xml to wasb:///tutorials/useoozie/workflow.xml.
- Copy coordinator.xml to wasb:///tutorials/useoozie/coordinator.xml.
- Copy the data file (/example/data/sample.log) to wasb:///tutorials/useoozie/data/sample.log. 
- Create an Azure SQL database table for storing Sqoop export data. The table name is *log4jLogCount*.

**Understand HDInsight storage**

HDInsight uses Azure Blob storage for data storage. wasb:// is Microsoft's implementation of the Hadoop distributed file system (HDFS) in Azure Blob storage. For more information, see [Use Azure Blob storage with HDInsight][hdinsight-storage]. 

When you provision an HDInsight cluster, an Azure Blob storage account and a specific container from that account is designated as the default file system, like in HDFS. In addition to this storage account, you can add additional storage accounts from the same Azure subscription or from different Azure subscriptions during the provisioning process. For instructions about adding additional storage accounts, see [Provision HDInsight clusters][hdinsight-provision]. To simplify the Azure PowerShell script used in this tutorial, all of the files are stored in the default file system container located at */tutorials/useoozie*. By default, this container has the same name as the HDInsight cluster name. 
The syntax is:

	wasb[s]://<ContainerName>@<StorageAccountName>.blob.core.windows.net/<path>/<filename>

> [AZURE.NOTE] Only the *wasb://* syntax is supported in HDInsight cluster version 3.0. The older *asv://* syntax is supported in HDInsight 2.1 and 1.6 clusters, but it is not supported in HDInsight 3.0 clusters.

> [AZURE.NOTE] The wasb:// path is a virtual path. For more information see [Use Azure Blob storage with HDInsight][hdinsight-storage]. 

A file that is stored in the default file system container can be accessed from HDInsight by using any of the following URIs (I am using workflow.xml as an example):

	wasb://mycontainer@mystorageaccount.blob.core.windows.net/tutorials/useoozie/workflow.xml
	wasb:///tutorials/useoozie/workflow.xml
	/tutorials/useoozie/workflow.xml

If you want to access the file directly from the storage account, the blob name for the file is:

	tutorials/useoozie/workflow.xml

**Understand Hive internal and external tables**

There are a few things you need to know about Hive internal and external tables:

- The CREATE TABLE command creates an internal table, also known as a managed table. The data file must be located in the default container.
- The CREATE TABLE command moves the data file to the /hive/warehouse/<TableName> folder in the default container.
- The CREATE EXTERNAL TABLE command creates an external table. The data file can be located outside the default container.
- The CREATE EXTERNAL TABLE command does not move the data file.
- The CREATE EXTERNAL TABLE command doesn't allow any subfolders under the folder that is specified in the LOCATION clause. This is the reason why the tutorial makes a copy of the sample.log file.

For more information, see [HDInsight: Hive Internal and External Tables Intro][cindygross-hive-tables].

**To prepare the tutorial**

1. Open the Windows PowerShell ISE (in the Windows 8 Start screen, type **PowerShell_ISE**, and then click **Windows PowerShell ISE**. For more information, see [Start Windows PowerShell on Windows 8 and Windows][powershell-start]).
2. In the bottom pane, run the following command to connect to your Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Azure account credentials. This method of adding a subscription connection times out, and after 12 hours, you will have to run the cmdlet again. 

	> [AZURE.NOTE] If you have multiple Azure subscriptions and the default subscription is not the one you want to use, use the <strong>Select-AzureSubscription</strong> cmdlet to select a subscription.

3. Copy the following script into the script pane, and then set the first six variables:
			
		# WASB variables
		$storageAccountName = "<StorageAccountName>"
		$containerName = "<BlobStorageContainerName>"
		
		# SQL database variables
		$sqlDatabaseServer = "<SQLDatabaseServerName>"  
		$sqlDatabaseLogin = "<SQLDatabaseLoginName>"
		$sqlDatabaseLoginPassword = "SQLDatabaseLoginPassword>"
		$sqlDatabaseName = "<SQLDatabaseName>"  
		$sqlDatabaseTableName = "log4jLogsCount"
		
		# Oozie files for the tutorial	
		$hiveQLScript = "C:\Tutorials\UseOozie\useooziewf.hql"
		$workflowDefinition = "C:\Tutorials\UseOozie\workflow.xml"
		$coordDefinition =  "C:\Tutorials\UseOozie\coordinator.xml"
		
		# WASB folder for storing the Oozie tutorial files.
		$destFolder = "tutorials/useoozie"  # Do NOT use the long path here


	For more descriptions of the variables, see the [Prerequisites](#prerequisites) section in this tutorial. 

3. Append the following to the script in the script pane:
		
		# Create a storage context object
		$storageaccountkey = get-azurestoragekey $storageAccountName | %{$_.Primary}
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageaccountkey
		
		function uploadOozieFiles()
		{		
		    Write-Host "Copy HiveQL script, workflow definition and coordinator definition ..." -ForegroundColor Green
			Set-AzureStorageBlobContent -File $hiveQLScript -Container $containerName -Blob "$destFolder/useooziewf.hql" -Context $destContext
			Set-AzureStorageBlobContent -File $workflowDefinition -Container $containerName -Blob "$destFolder/workflow.xml" -Context $destContext
			Set-AzureStorageBlobContent -File $coordDefinition -Container $containerName -Blob "$destFolder/coordinator.xml" -Context $destContext
		}
				
		function prepareHiveDataFile()
		{
			Write-Host "Make a copy of the sample.log file ... " -ForegroundColor Green
			Start-CopyAzureStorageBlob -SrcContainer $containerName -SrcBlob "example/data/sample.log" -Context $destContext -DestContainer $containerName -destBlob "$destFolder/data/sample.log" -DestContext $destContext
		}
				
		function prepareSQLDatabase()
		{
			# SQL query string for creating log4jLogsCount table
			$cmdCreateLog4jCountTable = " CREATE TABLE [dbo].[$sqlDatabaseTableName](
				    [Level] [nvarchar](10) NOT NULL,
				    [Total] float,
				CONSTRAINT [PK_$sqlDatabaseTableName] PRIMARY KEY CLUSTERED   
				(
				[Level] ASC
				)
				)"
				
			#Create the log4jLogsCount table
		    Write-Host "Create Log4jLogsCount table ..." -ForegroundColor Green
			$conn = New-Object System.Data.SqlClient.SqlConnection
			$conn.ConnectionString = "Data Source=$sqlDatabaseServer.database.windows.net;Initial Catalog=$sqlDatabaseName;User ID=$sqlDatabaseLogin;Password=$sqlDatabaseLoginPassword;Encrypt=true;Trusted_Connection=false;"
			$conn.open()
			$cmd = New-Object System.Data.SqlClient.SqlCommand
			$cmd.connection = $conn
			$cmd.commandtext = $cmdCreateLog4jCountTable
			$cmd.executenonquery()
				
			$conn.close()
		}
				
		# upload workflow.xml, coordinator.xml, and ooziewf.hql
		uploadOozieFiles;
				
		# make a copy of example/data/sample.log to example/data/log4j/sample.log
		prepareHiveDataFile;
		
		# create log4jlogsCount table on SQL database
		prepareSQLDatabase;

4. Click **Run Script** or press **F5** to run the script. The output will be similar to:

	![Tutorial preparation output][img-preparation-output]

##<a id="run"></a>Run the Oozie project

Azure PowerShell currently doesn't provide any cmdlets for defining Oozie jobs. You can use the **Invoke-RestMethod** cmdlet to invoke Oozie web services. The Oozie web services API is a HTTP REST JSON API. For more information about the Oozie web services API, see [Apache Oozie 4.0 documentation][apache-oozie-400] (for HDInsight cluster version 3.0) or [Apache Oozie 3.3.2 documentation][apache-oozie-332] (for HDInsight cluster version 2.1).

**To submit an Oozie job**

1. Open the Windows PowerShell ISE (in Windows 8 Start screen, type **PowerShell_ISE**, and then click **Windows PowerShell ISE**. For more information, see [Start Windows PowerShell on Windows 8 and Windows][powershell-start]).

3. Copy the following script into the script pane, and then set the first fourteen variables (however, skip **$storageUri**). 

		#HDInsight cluster variables
		$clusterName = "<HDInsightClusterName>"
		$clusterUsername = "<HDInsightClusterUsername>"
		$clusterPassword = "<HDInsightClusterUserPassword>"
		
		#Azure Blob storage (WASB) variables
		$storageAccountName = "<StorageAccountName>"
		$storageContainerName = "<BlobContainerName>"
		$storageUri="wasb://$storageContainerName@$storageAccountName.blob.core.windows.net"
		
		#Azure SQL database variables
		$sqlDatabaseServer = "<SQLDatabaseServerName>"
		$sqlDatabaseLogin = "<SQLDatabaseLoginName>"
		$sqlDatabaseLoginPassword = "<SQLDatabaseloginPassword>"
		$sqlDatabaseName = "<SQLDatabaseName>"  
		
		#Oozie WF/coordinator variables
		$coordStart = "2014-03-21T13:45Z"
		$coordEnd = "2014-03-21T13:45Z"
		$coordFrequency = "1440"	# in minutes, 24h x 60m = 1440m
		$coordTimezone = "UTC"	#UTC/GMT

		$oozieWFPath="$storageUri/tutorials/useoozie"  # The default name is workflow.xml. And you don't need to specify the file name.
		$waitTimeBetweenOozieJobStatusCheck=10

		#Hive action variables
		$hiveScript = "$storageUri/tutorials/useoozie/useooziewf.hql"
		$hiveTableName = "log4jlogs"
		$hiveDataFolder = "$storageUri/tutorials/useoozie/data"
		$hiveOutputFolder = "$storageUri/tutorials/useoozie/output"
		
		#Sqoop action variables
		$sqlDatabaseConnectionString = "jdbc:sqlserver://$sqlDatabaseServer.database.windows.net;user=$sqlDatabaseLogin@$sqlDatabaseServer;password=$sqlDatabaseLoginPassword;database=$sqlDatabaseName"
		$sqlDatabaseTableName = "log4jLogsCount"

		$passwd = ConvertTo-SecureString $clusterPassword -AsPlainText -Force
		$creds = New-Object System.Management.Automation.PSCredential ($clusterUsername, $passwd)

	For more descriptions of the variables, see the [Prerequisites](#prerequisites) section in this tutorial.

	$coordstart and $coordend are the workflow starting and ending time. To find out the UTC/GMT time, search "utc time" on bing.com. The $coordFrequency is how often in minutes you want to run the workflow. 

3. Append the following to the script. This part defines the Oozie payload:
		
		#OoziePayload used for Oozie web service submission
		$OoziePayload =  @"
		<?xml version="1.0" encoding="UTF-8"?>
		<configuration>
		
		   <property>
		       <name>nameNode</name>
		       <value>$storageUrI</value>
		   </property>
		
		   <property>
		       <name>jobTracker</name>
		       <value>jobtrackerhost:9010</value>
		   </property>
		
		   <property>
		       <name>queueName</name>
		       <value>default</value>
		   </property>
		
		   <property>
		       <name>oozie.use.system.libpath</name>
		       <value>true</value>
		   </property>

		   <property>
		       <name>oozie.coord.application.path</name>
		       <value>$oozieWFPath</value>
		   </property>

		   <property>
		       <name>wfPath</name>
		       <value>$oozieWFPath</value>
		   </property>

		   <property>
		       <name>coordStart</name>
		       <value>$coordStart</value>
		   </property>

		   <property>
		       <name>coordEnd</name>
		       <value>$coordEnd</value>
		   </property>

		   <property>
		       <name>coordFrequency</name>
		       <value>$coordFrequency</value>
		   </property>

		   <property>
		       <name>coordTimezone</name>
		       <value>$coordTimezone</value>
		   </property>

		   <property>
		       <name>hiveScript</name>
		       <value>$hiveScript</value>
		   </property>
		
		   <property>
		       <name>hiveTableName</name>
		       <value>$hiveTableName</value>
		   </property>
		
		   <property>
		       <name>hiveDataFolder</name>
		       <value>$hiveDataFolder</value>
		   </property>
		
		   <property>
		       <name>hiveOutputFolder</name>
		       <value>$hiveOutputFolder</value>
		   </property>
		
		   <property>
		       <name>sqlDatabaseConnectionString</name>
		       <value>&quot;$sqlDatabaseConnectionString&quot;</value>
		   </property>
		
		   <property>
		       <name>sqlDatabaseTableName</name>
		       <value>$SQLDatabaseTableName</value>
		   </property>
		
		   <property>
		       <name>user.name</name>
		       <value>admin</value>
		   </property>
		
		</configuration>
		"@

	>[AZURE.NOTE] The major difference compared to the workflow submission payload file is the variable **oozie.coord.application.path**. When you submit a workflow job, you use **oozie.wf.application.path** instead.

4. Append the following to the script. This part checks the Oozie web service status:	
			
		function checkOozieServerStatus()
		{
		    Write-Host "Checking Oozie server status..." -ForegroundColor Green
		    $clusterUriStatus = "https://$clusterName.azurehdinsight.net:443/oozie/v2/admin/status"
		    $response = Invoke-RestMethod -Method Get -Uri $clusterUriStatus -Credential $creds -OutVariable $OozieServerStatus 
		    
		    $jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
		    $oozieServerSatus = $jsonResponse[0].("systemMode")
		    Write-Host "Oozie server status is $oozieServerSatus..."
		
		    if($oozieServerSatus -notmatch "NORMAL")
		    {
		        Write-Host "Oozie server status is $oozieServerSatus...cannot submit Oozie jobs. Check the server status and re-run the job."
		        exit 1
		    }
		}
	
5. Append the following to the script. This part creates an Oozie job:	

		function createOozieJob()
		{
		    # create Oozie job
		    Write-Host "Sending the following Payload to the cluster:" -ForegroundColor Green
		    Write-Host "`n--------`n$OoziePayload`n--------"
		    $clusterUriCreateJob = "https://$clusterName.azurehdinsight.net:443/oozie/v2/jobs"
		    $response = Invoke-RestMethod -Method Post -Uri $clusterUriCreateJob -Credential $creds -Body $OoziePayload -ContentType "application/xml" -OutVariable $OozieJobName -debug -Verbose
		
		    $jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
		    $oozieJobId = $jsonResponse[0].("id")
		    Write-Host "Oozie job id is $oozieJobId..."
		
		    return $oozieJobId
		}

	> [AZURE.NOTE] When you submit a workflow job, you must make another web service call to start the job after the job is created. In this case, the coordinator job is triggered by time. The job will start automatically.

6. Append the following to the script. This part checks the Oozie job status:		

		function checkOozieJobStatus($oozieJobId)
		{
		    # get job status
		    Write-Host "Sleeping for $waitTimeBetweenOozieJobStatusCheck seconds until the job metadata is populated in the Oozie metastore..." -ForegroundColor Green
		    Start-Sleep -Seconds $waitTimeBetweenOozieJobStatusCheck
		
		    Write-Host "Getting job status and waiting for the job to complete..." -ForegroundColor Green
		    $clusterUriGetJobStatus = "https://$clusterName.azurehdinsight.net:443/oozie/v2/job/" + $oozieJobId + "?show=info"
		    $response = Invoke-RestMethod -Method Get -Uri $clusterUriGetJobStatus -Credential $creds 
		    $jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
		    $JobStatus = $jsonResponse[0].("status")
		
		    while($JobStatus -notmatch "SUCCEEDED|KILLED")
		    {
		        Write-Host "$(Get-Date -format 'G'): $oozieJobId is in $JobStatus state...waiting $waitTimeBetweenOozieJobStatusCheck seconds for the job to complete..."
		        Start-Sleep -Seconds $waitTimeBetweenOozieJobStatusCheck
		        $response = Invoke-RestMethod -Method Get -Uri $clusterUriGetJobStatus -Credential $creds 
		        $jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
		        $JobStatus = $jsonResponse[0].("status")
		    }
		
		    Write-Host "$(Get-Date -format 'G'): $oozieJobId is in $JobStatus state!"
		    if($JobStatus -notmatch "SUCCEEDED")
		    {
		        Write-Host "Check logs at http://headnode0:9014/cluster for detais."
		        exit -1
		    }
		}

7. (Optional) Append the following to the script. 

		function listOozieJobs()
		{
		    Write-Host "Listing Oozie jobs..." -ForegroundColor Green
		    $clusterUriStatus = "https://$clusterName.azurehdinsight.net:443/oozie/v2/jobs"
		    $response = Invoke-RestMethod -Method Get -Uri $clusterUriStatus -Credential $creds 
		    
		    write-host "Job ID                                   App Name        Status      Started                         Ended"
		    write-host "----------------------------------------------------------------------------------------------------------------------------------"
		    foreach($job in $response.workflows)
		    {
		        Write-Host $job.id "`t" $job.appName "`t" $job.status "`t" $job.startTime "`t" $job.endTime
		    }
		}

		function ShowOozieJobLog($oozieJobId)
		{
		    Write-Host "Showing Oozie job info..." -ForegroundColor Green
		    $clusterUriStatus = "https://$clusterName.azurehdinsight.net:443/oozie/v2/job/$oozieJobId" + "?show=log"
		    $response = Invoke-RestMethod -Method Get -Uri $clusterUriStatus -Credential $creds 
		    write-host $response
		}

		function killOozieJob($oozieJobId)
		{
		    Write-Host "Killing the Oozie job $oozieJobId..." -ForegroundColor Green
		    $clusterUriStartJob = "https://$clusterName.azurehdinsight.net:443/oozie/v2/job/" + $oozieJobId + "?action=kill" #Valid values for the 'action' parameter are 'start', 'suspend', 'resume', 'kill', 'dryrun', 'rerun', and 'change'.
		    $response = Invoke-RestMethod -Method Put -Uri $clusterUriStartJob -Credential $creds | Format-Table -HideTableHeaders -debug
		}
  
7. Append the following to the script:

		checkOozieServerStatus
		# listOozieJobs
		$oozieJobId = createOozieJob($oozieJobId)
		checkOozieJobStatus($oozieJobId)
		# ShowOozieJobLog($oozieJobId)
		# killOozieJob($oozieJobId)

	Remove the # signs if you want to run the additional functions.

7. If your HDinsight cluster is version 2.1, replace "https://$clusterName.azurehdinsight.net:443/oozie/v2/" with "https://$clusterName.azurehdinsight.net:443/oozie/v1/". HDInsight cluster version 2.1 does not supports version 2 of the web services.

7. Click **Run Script** or press **F5** to run the script. The output will be similar to:

	![Tutorial run workflow output][img-runworkflow-output]

8. Connect to your SQL Database to see the exported data.

**To check the job error log**

To troubleshoot a workflow, the Oozie log file can be found at C:\apps\dist\oozie-3.3.2.1.3.2.0-05\oozie-win-distro\logs\Oozie.log from the cluster headnode. For information on RDP, see [Administering HDInsight clusters using Management portal][hdinsight-admin-portal].

**To rerun the tutorial**

To rerun the workflow, you must perform the following tasks:

- Delete the Hive script output file.
- Delete the data in the log4jLogsCount table.

Here is a sample Windows PowerShell script that you can use:

	$storageAccountName = "<AzureStorageAccountName>"
	$containerName = "<ContainerName>"
	
	#SQL database variables
	$sqlDatabaseServer = "<SQLDatabaseServerName>"
	$sqlDatabaseLogin = "<SQLDatabaseLoginName>"
	$sqlDatabaseLoginPassword = "<SQLDatabaseLoginPassword>"
	$sqlDatabaseName = "<SQLDatabaseName>"
	$sqlDatabaseTableName = "log4jLogsCount"
	
	Write-host "Delete the Hive script output file ..." -ForegroundColor Green
	$storageaccountkey = get-azurestoragekey $storageAccountName | %{$_.Primary}
	$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageaccountkey
	Remove-AzureStorageBlob -Context $destContext -Blob "tutorials/useoozie/output/000000_0" -Container $containerName
	
	Write-host "Delete all the records from the log4jLogsCount table ..." -ForegroundColor Green
	$conn = New-Object System.Data.SqlClient.SqlConnection
	$conn.ConnectionString = "Data Source=$sqlDatabaseServer.database.windows.net;Initial Catalog=$sqlDatabaseName;User ID=$sqlDatabaseLogin;Password=$sqlDatabaseLoginPassword;Encrypt=true;Trusted_Connection=false;"
	$conn.open()
	$cmd = New-Object System.Data.SqlClient.SqlCommand
	$cmd.connection = $conn
	$cmd.commandtext = "delete from $sqlDatabaseTableName"
	$cmd.executenonquery()
	
	$conn.close()


##<a id="nextsteps"></a>Next steps
In this tutorial, you learned how to define an Oozie workflow and an Oozie coordinator, and how to run an Oozie coordinator job by using Azure PowerShell. To learn more, see the following articles:

- [Get started with HDInsight][hdinsight-get-started]
- [Get started with the HDInsight Emulator][hdinsight-get-started-emulator]
- [Use Azure Blob storage with HDInsight][hdinsight-storage]
- [Administer HDInsight by using Azure PowerShell][hdinsight-admin-powershell]
- [Upload data to HDInsight][hdinsight-upload-data]
- [Use Sqoop with HDInsight][hdinsight-use-sqoop]
- [Use Hive with HDInsight][hdinsight-use-hive]
- [Use Pig with HDInsight][hdinsight-use-pig]
- [Develop C# Hadoop streaming jobs for HDInsight][hdinsight-develop-streaming-jobs]
- [Develop Java MapReduce programs for HDInsight][hdinsight-develop-java-mapreduce]



[hdinsight-cmdlets-download]: http://go.microsoft.com/fwlink/?LinkID=325563


[hdinsight-versions]:  hdinsight-component-versioning.md
[hdinsight-storage]: hdinsight-use-blob-storage.md
[hdinsight-get-started]: hdinsight-get-started.md
[hdinsight-admin-portal]: hdinsight-administer-use-management-portal.md


[hdinsight-use-sqoop]: hdinsight-use-sqoop.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-storage]: hdinsight-use-blob-storage.md
[hdinsight-get-started-emulator]: hdinsight-get-started-emulator.md
[hdinsight-develop-streaming-jobs]: hdinsight-hadoop-develop-deploy-streaming-jobs.md
[hdinsight-develop-java-mapreduce]: hdinsight-develop-deploy-java-mapreduce.md
[hdinsight-use-oozie]: hdinsight-use-oozie.md

[sqldatabase-create-configue]: sql-database-create-configure.md
[sqldatabase-get-started]: sql-database-get-started.md

[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: storage-create-storage-account.md 

[apache-hadoop]: http://hadoop.apache.org/
[apache-oozie-400]: http://oozie.apache.org/docs/4.0.0/
[apache-oozie-332]: http://oozie.apache.org/docs/3.3.2/

[powershell-download]: http://azure.microsoft.com/downloads/
[powershell-about-profiles]: http://go.microsoft.com/fwlink/?LinkID=113729
[powershell-install-configure]: powershell-install-configure.md
[powershell-start]: http://technet.microsoft.com/library/hh847889.aspx
[powershell-script]: http://technet.microsoft.com/library/ee176949.aspx

[cindygross-hive-tables]: http://blogs.msdn.com/b/cindygross/archive/2013/02/06/hdinsight-hive-internal-and-external-tables-intro.aspx

[img-workflow-diagram]: ./media/hdinsight-use-oozie-coordinator-time/HDI.UseOozie.Workflow.Diagram.png
[img-preparation-output]: ./media/hdinsight-use-oozie-coordinator-time/HDI.UseOozie.Preparation.Output1.png  
[img-runworkflow-output]: ./media/hdinsight-use-oozie-coordinator-time/HDI.UseOozie.RunCoord.Output.png  

[technetwiki-hive-error]: http://social.technet.microsoft.com/wiki/contents/articles/23047.hdinsight-hive-error-unable-to-rename.aspx
