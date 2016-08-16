<properties
	pageTitle="Use Hadoop Oozie in HDInsight | Microsoft Azure"
	description="Use Hadoop Oozie in HDInsight, a big data service. Learn how to define an Oozie workflow, and submit an Oozie job."
	services="hdinsight"
	documentationCenter=""
	tags="azure-portal"
	authors="mumian"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/25/2016"
	ms.author="jgao"/>


# Use Oozie with Hadoop to define and run a workflow in HDInsight

[AZURE.INCLUDE [oozie-selector](../../includes/hdinsight-oozie-selector.md)]

Learn how to use Apache Oozie to define a workflow and run the workflow on HDInsight. To learn about the Oozie coordinator, see [Use time-based Hadoop Oozie Coordinator with HDInsight][hdinsight-oozie-coordinator-time]. To learn Azure Data Factory, see [Use Pig and Hive with Data Factory][azure-data-factory-pig-hive].

Apache Oozie is a workflow/coordination system that manages Hadoop jobs. It is integrated with the Hadoop stack, and it supports Hadoop jobs for Apache MapReduce, Apache Pig, Apache Hive, and Apache Sqoop. It can also be used to schedule jobs that are specific to a system, like Java programs or shell scripts.

The workflow you will implement by following the instructions in this tutorial contains two actions:

![Workflow diagram][img-workflow-diagram]

1. A Hive action runs a HiveQL script to count the occurrences of each log-level type in a log4j file. Each log4j file consists of a line of fields that contains a [LOG LEVEL] field that shows the type and the severity, for example:

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

2.  A Sqoop action exports the HiveQL output to a table in an Azure SQL database. For more information about Sqoop, see [Use Hadoop Sqoop with HDInsight][hdinsight-use-sqoop].

> [AZURE.NOTE] For supported Oozie versions on HDInsight clusters, see [What's new in the Hadoop cluster versions provided by HDInsight?][hdinsight-versions].

###Prerequisites

Before you begin this tutorial, you must have the following:

- **A workstation with Azure PowerShell**. 

    [AZURE.INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]
    
    To execute Windows PowerShell scripts, you must run as an administrator and set the execution policy to *RemoteSigned*. For more information, see [Run Windows PowerShell scripts][powershell-script].

##Define Oozie workflow and the related HiveQL script

Oozie workflows definitions are written in hPDL (a XML Process Definition Language). The default workflow file name is *workflow.xml*. The following is the workflow file you will use in this tutorial.

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

There are two actions defined in the workflow. The start-to action is *RunHiveScript*. If the action runs successfully, the next action is *RunSqoopExport*.

The RunHiveScript has several variables. You will pass the values when you submit the Oozie job from your workstation by using Azure PowerShell.

<table border = "1">
<tr><th>Workflow variables</th><th>Description</th></tr>
<tr><td>${jobTracker}</td><td>Specifies the URL of the Hadoop job tracker. Use <strong>jobtrackerhost:9010</strong> in HDInsight version 3.0 and 2.1.</td></tr>
<tr><td>${nameNode}</td><td>Specifies the URL of the Hadoop name node. Use the default file system address, for example, <i>wasbs://&lt;containerName&gt;@&lt;storageAccountName&gt;.blob.core.windows.net</i>.</td></tr>
<tr><td>${queueName}</td><td>Specifies the queue name that the job will be submitted to. Use the <strong>default</strong>.</td></tr>
</table>

<table border = "1">
<tr><th>Hive action variable</th><th>Description</th></tr>
<tr><td>${hiveDataFolder}</td><td>Specifies the source directory for the Hive Create Table command.</td></tr>
<tr><td>${hiveOutputFolder}</td><td>Specifies the output folder for the INSERT OVERWRITE statement.</td></tr>
<tr><td>${hiveTableName}</td><td>Specifies the name of the Hive table that references the log4j data files.</td></tr>
</table>

<table border = "1">
<tr><th>Sqoop action variable</th><th>Description</th></tr>
<tr><td>${sqlDatabaseConnectionString}</td><td>Specifies the Azure SQL database connection string.</td></tr>
<tr><td>${sqlDatabaseTableName}</td><td>Specifies the Azure SQL database table where the data will be exported to.</td></tr>
<tr><td>${hiveOutputFolder}</td><td>Specifies the output folder for the Hive INSERT OVERWRITE statement. This is the same folder for the Sqoop export (export-dir).</td></tr>
</table>

For more information about Oozie workflow and using workflow actions, see [Apache Oozie 4.0 documentation][apache-oozie-400] (for HDInsight version 3.0) or [Apache Oozie 3.3.2 documentation][apache-oozie-332] (for HDInsight version 2.1).


The Hive action in the workflow calls a HiveQL script file. This script file contains three HiveQL statements:

	DROP TABLE ${hiveTableName};
	CREATE EXTERNAL TABLE ${hiveTableName}(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) ROW FORMAT DELIMITED FIELDS TERMINATED BY ' ' STORED AS TEXTFILE LOCATION '${hiveDataFolder}';
	INSERT OVERWRITE DIRECTORY '${hiveOutputFolder}' SELECT t4 AS sev, COUNT(*) AS cnt FROM ${hiveTableName} WHERE t4 LIKE '[%' GROUP BY t4;

1. **The DROP TABLE statement** deletes the log4j Hive table if it exists.
2. **The CREATE TABLE statement** creates a log4j Hive external table that points to the location of the log4j log file. The field delimiter is ",". The default line delimiter is "\n". A Hive external table is used to avoid the data file being removed from the original location if you want to run the Oozie workflow multiple times.
3. **The INSERT OVERWRITE statement** counts the occurrences of each log-level type from the log4j Hive table, and saves the output to a blob in Azure Storage.


There are three variables used in the script:

- ${hiveTableName}
- ${hiveDataFolder}
- ${hiveOutputFolder}

The workflow definition file (workflow.xml in this tutorial) passes these values to this HiveQL script at run time.

Both the workflow file and the HiveQL file are stored in a blob container.  The PowerShell script you will use later in this tutorial will copy both files to the default Storage account. 

##Submit Oozie jobs using PowerShell

Azure PowerShell currently doesn't provide any cmdlets for defining Oozie jobs. You can use the **Invoke-RestMethod** cmdlet to invoke Oozie web services. The Oozie web services API is a HTTP REST JSON API. For more information about the Oozie web services API, see [Apache Oozie 4.0 documentation][apache-oozie-400] (for HDInsight version 3.0) or [Apache Oozie 3.3.2 documentation][apache-oozie-332] (for HDInsight version 2.1).

The PowerShell script in this section performs the following steps:

1. Connect to Azure.
2. Create an Azure resource group. For more information, see [Use Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md).
3. Create an Azure SQL Database server, an Azure SQL database, and two tables. These are used by the Sqoop action in the workflow.

	The table name is *log4jLogCount*.

4. Create an HDInsight cluster used to run Oozie jobs.

	To examine the cluster, you can use the Azure portal or Azure PowerShell.

5. Copy the oozie workflow file and the HiveQL script file to the default file system.

	Both files are stored in a public Blob container.
	
	- Copy the HiveQL script (useoozie.hql) to Azure Storage (wasbs:///tutorials/useoozie/useoozie.hql).
	- Copy workflow.xml to wasbs:///tutorials/useoozie/workflow.xml.
	- Copy the data file (/example/data/sample.log) to wasbs:///tutorials/useoozie/data/sample.log.
	 
6. Submit an Oozie job.

	To examine the OOzie job results, use Visual Studio or other tools to connect to the Azure SQL Database.

Here is the script.  You can run the script from Windows PowerShell ISE. You only need to configure the first 7 variables.

	#region - provide the following values
	
	$subscriptionID = "<Enter your Azure subscription ID>"
	
	# SQL Database server login credentials used for creating and connecting
	$sqlDatabaseLogin = "<Enter SQL Database Login Name>"
	$sqlDatabasePassword = "<Enter SQL Database Login Password>"
	
	# HDInsight cluster HTTP user credential used for creating and connectin
	$httpUserName = "admin"  # The default name is "admin"
	$httpPassword = "<Enter HDInsight Cluster HTTP User Password>"
	
	# Used for creating Azure service names
	$nameToken = "<Enter an Alias>"
	$namePrefix = $nameToken.ToLower() + (Get-Date -Format "MMdd")
	#endregion
	
	#region - variables
	
	# Resource group variables
	$resourceGroupName = $namePrefix + "rg"
	$location = "East US 2" # used by all Azure services defined in this tutorial
	
	# SQL database varialbes
	$sqlDatabaseServerName = $namePrefix + "sqldbserver"
	$sqlDatabaseName = $namePrefix + "sqldb"
	$sqlDatabaseConnectionString = "Data Source=$sqlDatabaseServerName.database.windows.net;Initial Catalog=$sqlDatabaseName;User ID=$sqlDatabaseLogin;Password=$sqlDatabasePassword;Encrypt=true;Trusted_Connection=false;"
	$sqlDatabaseMaxSizeGB = 10
	
	# Used for retrieving external IP address and creating firewall rules
	$ipAddressRestService = "http://bot.whatismyipaddress.com"
	$fireWallRuleName = "UseSqoop"
	
	# HDInsight variables
	$hdinsightClusterName = $namePrefix + "hdi"
	$defaultStorageAccountName = $namePrefix + "store"
	$defaultBlobContainerName = $hdinsightClusterName
	#endregion
	
	# Treat all errors as terminating
	$ErrorActionPreference = "Stop"
	
	#region - Connect to Azure subscription
	Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
	try{Get-AzureRmContext}
	catch{
		Login-AzureRmAccount
		Select-AzureRmSubscription -SubscriptionId $subscriptionID
	}
	#endregion
	
	#region - Create Azure resouce group
	Write-Host "`nCreating an Azure resource group ..." -ForegroundColor Green
	try{
		Get-AzureRmResourceGroup -Name $resourceGroupName
	}
	catch{
		New-AzureRmResourceGroup -Name $resourceGroupName -Location $location
	}
	#endregion
	
	#region - Create Azure SQL database server
	Write-Host "`nCreating an Azure SQL Database server ..." -ForegroundColor Green
	try{
		Get-AzureRmSqlServer -ServerName $sqlDatabaseServerName -ResourceGroupName $resourceGroupName}
	catch{
		Write-Host "`nCreating SQL Database server ..."  -ForegroundColor Green
	
		$sqlDatabasePW = ConvertTo-SecureString -String $sqlDatabasePassword -AsPlainText -Force
		$sqlLoginCredentials = New-Object System.Management.Automation.PSCredential($sqlDatabaseLogin,$sqlDatabasePW)
	
		$sqlDatabaseServerName = (New-AzureRmSqlServer `
									-ResourceGroupName $resourceGroupName `
									-ServerName $sqlDatabaseServerName `
									-SqlAdministratorCredentials $sqlLoginCredentials `
									-Location $location).ServerName
		Write-Host "`tThe new SQL database server name is $sqlDatabaseServerName." -ForegroundColor Cyan
	
		Write-Host "`nCreating firewall rule, $fireWallRuleName ..." -ForegroundColor Green
		$workstationIPAddress = Invoke-RestMethod $ipAddressRestService
		New-AzureRmSqlServerFirewallRule `
			-ResourceGroupName $resourceGroupName `
			-ServerName $sqlDatabaseServerName `
			-FirewallRuleName "$fireWallRuleName-workstation" `
			-StartIpAddress $workstationIPAddress `
			-EndIpAddress $workstationIPAddress
	
		#To allow other Azure services to access the server add a firewall rule and set both the StartIpAddress and EndIpAddress to 0.0.0.0. 
		#Note that this allows Azure traffic from any Azure subscription to access the server.
		New-AzureRmSqlServerFirewallRule `
			-ResourceGroupName $resourceGroupName `
			-ServerName $sqlDatabaseServerName `
			-FirewallRuleName "$fireWallRuleName-Azureservices" `
			-StartIpAddress "0.0.0.0" `
			-EndIpAddress "0.0.0.0"
	}
	#endregion
	
	#region - Create and validate Azure SQL database
	Write-Host "`nCreating SQL Database, $sqlDatabaseName ..."  -ForegroundColor Green
	
	try {
		Get-AzureRmSqlDatabase `
			-ResourceGroupName $resourceGroupName `
			-ServerName $sqlDatabaseServerName `
			-DatabaseName $sqlDatabaseName
	}
	catch {
		New-AzureRMSqlDatabase `
			-ResourceGroupName $resourceGroupName `
			-ServerName $sqlDatabaseServerName `
			-DatabaseName $sqlDatabaseName `
			-Edition "Standard" `
			-RequestedServiceObjectiveName "S1"
	}
	#endregion
	
	#region - Create SQL database tables
	Write-Host "Creating the log4jlogs table  ..." -ForegroundColor Green
	
	$sqlDatabaseTableName = "log4jLogsCount"
	$cmdCreateLog4jCountTable = " CREATE TABLE [dbo].[$sqlDatabaseTableName](
			[Level] [nvarchar](10) NOT NULL,
			[Total] float,
		CONSTRAINT [PK_$sqlDatabaseTableName] PRIMARY KEY CLUSTERED
		(
		[Level] ASC
		)
		)"
	
	$conn = New-Object System.Data.SqlClient.SqlConnection
	$conn.ConnectionString = $sqlDatabaseConnectionString
	$conn.Open()
	
	# Create the log4jlogs table and index
	$cmd = New-Object System.Data.SqlClient.SqlCommand
	$cmd.Connection = $conn
	$cmd.CommandText = $cmdCreateLog4jCountTable
	$cmd.ExecuteNonQuery()
	
	$conn.close()
	#endregion
	
	#region - Create HDInsight cluster
	
	Write-Host "Creating the HDInsight cluster and the dependent services ..." -ForegroundColor Green
	
	# Create the default storage account
	New-AzureRmStorageAccount `
		-ResourceGroupName $resourceGroupName `
		-Name $defaultStorageAccountName `
		-Location $location `
		-Type Standard_LRS
	
	# Create the default Blob container
	$defaultStorageAccountKey = (Get-AzureRmStorageAccountKey `
									-ResourceGroupName $resourceGroupName `
									-Name $defaultStorageAccountName)[0].Value
	$defaultStorageAccountContext = New-AzureStorageContext `
										-StorageAccountName $defaultStorageAccountName `
										-StorageAccountKey $defaultStorageAccountKey 
	New-AzureStorageContainer `
		-Name $defaultBlobContainerName `
		-Context $defaultStorageAccountContext 
	
	# Create the HDInsight cluster
	$pw = ConvertTo-SecureString -String $httpPassword -AsPlainText -Force
	$httpCredential = New-Object System.Management.Automation.PSCredential($httpUserName,$pw)
	
	New-AzureRmHDInsightCluster `
		-ResourceGroupName $resourceGroupName `
		-ClusterName $HDInsightClusterName `
		-Location $location `
		-ClusterType Hadoop `
		-OSType Windows `
		-ClusterSizeInNodes 2 `
		-HttpCredential $httpCredential `
		-DefaultStorageAccountName "$defaultStorageAccountName.blob.core.windows.net" `
		-DefaultStorageAccountKey $defaultStorageAccountKey `
		-DefaultStorageContainer $defaultBlobContainerName 
	
	# Validate the cluster
	Get-AzureRmHDInsightCluster -ClusterName $hdinsightClusterName
	#endregion
	
	#region - copy Oozie workflow and HiveQL files
	
	Write-Host "Copy workflow definition and HiveQL script file ..." -ForegroundColor Green
	
	# Both files are stored in a public Blob
	$publicBlobContext = New-AzureStorageContext -StorageAccountName "hditutorialdata" -Anonymous
	
	# WASB folder for storing the Oozie tutorial files.
	$destFolder = "tutorials/useoozie"  # Do NOT use the long path here
	
	Start-CopyAzureStorageBlob `
		-Context $publicBlobContext `
		-SrcContainer "useoozie" `
		-SrcBlob "useooziewf.hql"  `
		-DestContext $defaultStorageAccountContext `
		-DestContainer $defaultBlobContainerName `
		-DestBlob "$destFolder/useooziewf.hql" `
		-Force
	
	Start-CopyAzureStorageBlob `
		-Context $publicBlobContext `
		-SrcContainer "useoozie" `
		-SrcBlob "workflow.xml"  `
		-DestContext $defaultStorageAccountContext `
		-DestContainer $defaultBlobContainerName `
		-DestBlob "$destFolder/workflow.xml" `
		-Force
	
	#validate the copy
	Get-AzureStorageBlob `
		-Context $defaultStorageAccountContext `
		-Container $defaultBlobContainerName `
		-Blob $destFolder/workflow.xml
	
	Get-AzureStorageBlob `
		-Context $defaultStorageAccountContext `
		-Container $defaultBlobContainerName `
		-Blob $destFolder/useooziewf.hql
	
	#endregion
	
	#region - copy the sample.log file
	
	Write-Host "Make a copy of the sample.log file ... " -ForegroundColor Green
	
	Start-CopyAzureStorageBlob `
		-Context $defaultStorageAccountContext `
		-SrcContainer $defaultBlobContainerName `
		-SrcBlob "example/data/sample.log"  `
		-DestContext $defaultStorageAccountContext `
		-DestContainer $defaultBlobContainerName `
		-destBlob "$destFolder/data/sample.log" 
	
	#validate the copy
	Get-AzureStorageBlob `
		-Context $defaultStorageAccountContext `
		-Container $defaultBlobContainerName `
		-Blob $destFolder/data/sample.log
	
	#endregion
	
	#region - submit Oozie job
	
	$storageUri="wasbs://$defaultBlobContainerName@$defaultStorageAccountName.blob.core.windows.net"
	
	$oozieJobName = $namePrefix + "OozieJob"
	
	#Oozie WF variables
	$oozieWFPath="$storageUri/tutorials/useoozie"  # The default name is workflow.xml. And you don't need to specify the file name.
	$waitTimeBetweenOozieJobStatusCheck=10
	
	#Hive action variables
	$hiveScript = "$storageUri/tutorials/useoozie/useooziewf.hql"
	$hiveTableName = "log4jlogs"
	$hiveDataFolder = "$storageUri/tutorials/useoozie/data"
	$hiveOutputFolder = "$storageUri/tutorials/useoozie/output"
	
	#Sqoop action variables
	$sqlDatabaseConnectionString = "jdbc:sqlserver://$sqlDatabaseServerName.database.windows.net;user=$sqlDatabaseLogin@$sqlDatabaseServerName;password=$sqlDatabasePassword;database=$sqlDatabaseName"
	
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
		<value>$httpUserName</value>
	</property>
	
	<property>
		<name>oozie.wf.application.path</name>
		<value>$oozieWFPath</value>
	</property>
	
	</configuration>
	"@
	
	Write-Host "Checking Oozie server status..." -ForegroundColor Green
	$clusterUriStatus = "https://$hdinsightClusterName.azurehdinsight.net:443/oozie/v2/admin/status"
	$response = Invoke-RestMethod -Method Get -Uri $clusterUriStatus -Credential $httpCredential -OutVariable $OozieServerStatus
	
	$jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
	$oozieServerSatus = $jsonResponse[0].("systemMode")
	Write-Host "Oozie server status is $oozieServerSatus."
	
	# create Oozie job
	Write-Host "Sending the following Payload to the cluster:" -ForegroundColor Green
	Write-Host "`n--------`n$OoziePayload`n--------"
	$clusterUriCreateJob = "https://$hdinsightClusterName.azurehdinsight.net:443/oozie/v2/jobs"
	$response = Invoke-RestMethod -Method Post -Uri $clusterUriCreateJob -Credential $httpCredential -Body $OoziePayload -ContentType "application/xml" -OutVariable $OozieJobName #-debug
	
	$jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
	$oozieJobId = $jsonResponse[0].("id")
	Write-Host "Oozie job id is $oozieJobId..."
	
	# start Oozie job
	Write-Host "Starting the Oozie job $oozieJobId..." -ForegroundColor Green
	$clusterUriStartJob = "https://$hdinsightClusterName.azurehdinsight.net:443/oozie/v2/job/" + $oozieJobId + "?action=start"
	$response = Invoke-RestMethod -Method Put -Uri $clusterUriStartJob -Credential $httpCredential | Format-Table -HideTableHeaders #-debug
	
	# get job status
	Write-Host "Sleeping for $waitTimeBetweenOozieJobStatusCheck seconds until the job metadata is populated in the Oozie metastore..." -ForegroundColor Green
	Start-Sleep -Seconds $waitTimeBetweenOozieJobStatusCheck
	
	Write-Host "Getting job status and waiting for the job to complete..." -ForegroundColor Green
	$clusterUriGetJobStatus = "https://$hdinsightClusterName.azurehdinsight.net:443/oozie/v2/job/" + $oozieJobId + "?show=info"
	$response = Invoke-RestMethod -Method Get -Uri $clusterUriGetJobStatus -Credential $httpCredential
	$jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
	$JobStatus = $jsonResponse[0].("status")
	
	while($JobStatus -notmatch "SUCCEEDED|KILLED")
	{
		Write-Host "$(Get-Date -format 'G'): $oozieJobId is in $JobStatus state...waiting $waitTimeBetweenOozieJobStatusCheck seconds for the job to complete..."
		Start-Sleep -Seconds $waitTimeBetweenOozieJobStatusCheck
		$response = Invoke-RestMethod -Method Get -Uri $clusterUriGetJobStatus -Credential $httpCredential
		$jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
		$JobStatus = $jsonResponse[0].("status")
		$jobStatus
	}
	
	Write-Host "$(Get-Date -format 'G'): $oozieJobId is in $JobStatus state!" -ForegroundColor Green
	
	#endregion


**To re-run the tutorial**

To re-run the workflow, you must delete the following:

- The Hive script output file
- The data in the log4jLogsCount table

Here is a sample PowerShell script that you can use:

	$resourceGroupName = "<AzureResourceGroupName>"
	
	$defaultStorageAccountName = "<AzureStorageAccountName>"
	$defaultBlobContainerName = "<ContainerName>"

	#SQL database variables
	$sqlDatabaseServerName = "<SQLDatabaseServerName>"
	$sqlDatabaseLogin = "<SQLDatabaseLoginName>"
	$sqlDatabasePassword = "<SQLDatabaseLoginPassword>"
	$sqlDatabaseName = "<SQLDatabaseName>"
	$sqlDatabaseTableName = "log4jLogsCount"

	Write-host "Delete the Hive script output file ..." -ForegroundColor Green
	$defaultStorageAccountKey = (Get-AzureRmStorageAccountKey `
                                -ResourceGroupName $resourceGroupName `
                                -Name $defaultStorageAccountName)[0].Value
	$destContext = New-AzureStorageContext -StorageAccountName $defaultStorageAccountName -StorageAccountKey $defaultStorageAccountKey
	Remove-AzureStorageBlob -Context $destContext -Blob "tutorials/useoozie/output/000000_0" -Container $defaultBlobContainerName

	Write-host "Delete all the records from the log4jLogsCount table ..." -ForegroundColor Green
	$conn = New-Object System.Data.SqlClient.SqlConnection
	$conn.ConnectionString = "Data Source=$sqlDatabaseServerName.database.windows.net;Initial Catalog=$sqlDatabaseName;User ID=$sqlDatabaseLogin;Password=$sqlDatabasePassword;Encrypt=true;Trusted_Connection=false;"
	$conn.open()
	$cmd = New-Object System.Data.SqlClient.SqlCommand
	$cmd.connection = $conn
	$cmd.commandtext = "delete from $sqlDatabaseTableName"
	$cmd.executenonquery()

	$conn.close()

##Next steps
In this tutorial, you learned how to define an Oozie workflow and how to run an Oozie job by using PowerShell. To learn more, see the following articles:

- [Use time-based Oozie Coordinator with HDInsight][hdinsight-oozie-coordinator-time]
- [Get started using Hadoop with Hive in HDInsight to analyze mobile handset use][hdinsight-get-started]
- [Use Azure Blob storage with HDInsight][hdinsight-storage]
- [Administer HDInsight using PowerShell][hdinsight-admin-powershell]
- [Upload data for Hadoop jobs in HDInsight][hdinsight-upload-data]
- [Use Sqoop with Hadoop in HDInsight][hdinsight-use-sqoop]
- [Use Hive with Hadoop on HDInsight][hdinsight-use-hive]
- [Use Pig with Hadoop on HDInsight][hdinsight-use-pig]
- [Develop Java MapReduce programs for HDInsight][hdinsight-develop-mapreduce]


[hdinsight-cmdlets-download]: http://go.microsoft.com/fwlink/?LinkID=325563



[azure-data-factory-pig-hive]: ../data-factory/data-factory-data-transformation-activities.md
[hdinsight-oozie-coordinator-time]: hdinsight-use-oozie-coordinator-time.md
[hdinsight-versions]:  hdinsight-component-versioning.md
[hdinsight-storage]: hdinsight-hadoop-use-blob-storage.md
[hdinsight-get-started]: hdinsight-hadoop-linux-tutorial-get-started.md
[hdinsight-admin-portal]: hdinsight-administer-use-management-portal.md


[hdinsight-use-sqoop]: hdinsight-use-sqoop.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-storage]: hdinsight-hadoop-use-blob-storage.md

[hdinsight-develop-mapreduce]: hdinsight-develop-deploy-java-mapreduce-linux.md

[sqldatabase-create-configue]: ../sql-database-create-configure.md
[sqldatabase-get-started]: ../sql-database-get-started.md

[azure-management-portal]: https://portal.azure.com/
[azure-create-storageaccount]: ../storage-create-storage-account.md

[apache-hadoop]: http://hadoop.apache.org/
[apache-oozie-400]: http://oozie.apache.org/docs/4.0.0/
[apache-oozie-332]: http://oozie.apache.org/docs/3.3.2/

[powershell-download]: http://azure.microsoft.com/downloads/
[powershell-about-profiles]: http://go.microsoft.com/fwlink/?LinkID=113729
[powershell-install-configure]: ../powershell-install-configure.md
[powershell-start]: http://technet.microsoft.com/library/hh847889.aspx
[powershell-script]: https://technet.microsoft.com/en-us/library/ee176961.aspx

[cindygross-hive-tables]: http://blogs.msdn.com/b/cindygross/archive/2013/02/06/hdinsight-hive-internal-and-external-tables-intro.aspx

[img-workflow-diagram]: ./media/hdinsight-use-oozie/HDI.UseOozie.Workflow.Diagram.png
[img-preparation-output]: ./media/hdinsight-use-oozie/HDI.UseOozie.Preparation.Output1.png  
[img-runworkflow-output]: ./media/hdinsight-use-oozie/HDI.UseOozie.RunWF.Output.png

[technetwiki-hive-error]: http://social.technet.microsoft.com/wiki/contents/articles/23047.hdinsight-hive-error-unable-to-rename.aspx
