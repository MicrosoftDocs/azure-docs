<properties linkid="hdinsight-use-oozie-with-hdinsight" urlDisplayName="Use Oozie with HDInsight" pageTitle="Use Oozie with HDInsight | Windows Azure" metaKeywords="" description="Use Oozie with HDInsight, a big data solution. Learn how to define an Oozie workflow, and submit an Oozie job." metaCanonical="" services="hdinsight" documentationCenter="" title="Use Oozie with HDInsight" authors=""  solutions="" writer="jgao" manager="paulettm" editor="cgronlun"  />


# Use Oozie with HDInsight

Apache Oozie is a workflow/coordination system that manages Hadoop jobs. It is integrated with the Hadoop stack and supports Hadoop jobs for Apache MapReduce, Apache Pig, Apache Hive, and Apache Sqoop. It can also be used to schedule jobs specific to a system, like Java programs or shell scripts.

The workflow you will implement contains two actions: 

![Workflow diagram][img-workflow-diagram]

1. A Hive action runs a HiveQL script to count the occurrences of each log level type in a log4j log file. Each log4j log consists of a line of fields that contains a [LOG LEVEL] field to show the type and the severity. For example:

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
	
2.  A Sqoop action  export the HiveQL script output to a Windows Azure SQL database table.

> [WACOM.NOTE] For supported Oozie versions on HDInsight clusters, see [What's new in the cluster versions provided by HDInsight?][hdinsight-versions].

> [WACOM.NOTE] This tutorials works on HDInsight cluster version 2.1 and 3.0. This article has not been tested on HDInsight emulator.


**Prerequisite**

Before you begin this tutorial, you must have the following:

- An HDInsight cluster. For information on creating an HDInsight cluster, see [Provision HDInsight clusters][hdinsight-provision], or [Get started with HDInsight][hdinsight-get-started].
- A workstation with Windows Azure PowerShell installed and configured.  For instructions, see [Install and configure Windows Azure PowerShell][powershell-install-configure].


**Estimated time to complete:** 30 minutes

##In this article

1. [Define Oozie workflow file](#defineworkflow)
2. [Deploy the Oozie project and prepare the tutorial](#deploy)
3. [Run workflow](#run)
4. [Next steps](#nextsteps)

##<a id="defineworkflow"></a>Define Oozie workflow and the related HiveQL script

Oozie workflows definitions are written in hPDL (a XML Process Definition Language). The default workflow file name is *workflow.xml*.  You will save the workflow file locally, and deploy it to HDInsight cluster using Windows Azure PowerShell later in this tutorial.

The Hive action in the workflow calls a HiveQL script file. This script file contains three HiveQL statements:

1. **The DROP TABLE statement** deletes the log4j Hive table in case it exists.
2. **The CREATE TABLE statement** creates a log4j Hive external table pointing to the WASB location of the log4j log file. The field delimiter is ",". The default line delimiter is "\n".  Hive external table is used to avoid the data file being removed from the original location, in case you want to run the Oozie workflow multiple times.
3. **The INSERT OVERWRITE statement** counts the occurrences of each log level type from the log4j Hive table, and saves the output to a WASB location. 

**To define the HiveQL script file to be called by the workflow:**

1. Create a text file with the following content:

		DROP TABLE ${hiveTableName};
		CREATE EXTERNAL TABLE ${hiveTableName}(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) ROW FORMAT DELIMITED FIELDS TERMINATED BY ' ' STORED AS TEXTFILE LOCATION '${hiveDataFolder}';
		INSERT OVERWRITE DIRECTORY '${hiveOutputFolder}' SELECT t4 AS sev, COUNT(*) AS cnt FROM ${hiveTableName} WHERE t4 LIKE '[%' GROUP BY t4;

	There are three variables used in the script:

	- ${hiveTableName}
	- ${hiveDataFolder}
	- ${hiveOutputFolder}
			
	The workflow definition file (workflow.xml in this tutorial) will pass these values to this HiveQL script at run-time.
		
2. Save the file as **C:\Tutorials\UseOozie\useooziewf.hql** using the **ANSI(ASCII)** encoding. This script file will be deployed to HDInsight cluster later in the tutorial.



**To define a workflow**

1. Create a text file with the following content:

		<workflow-app name="useooziewf" xmlns="uri:oozie:workflow:0.1">
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

	There are two actions defined in the workflow. The start-to action is *RunHiveScript*. If the action runs *ok*, the next action is *RunSqoopExport*.

	The RunHiveScript has several variables. You will pass the values when you submit the Oozie job from your workstation using Windows Azure PowerShell.

	**Workflow variables:**
	<table border="1">
	<tr><td>Variable</td><td>Value</td></tr>
	<tr><td>${jobTracker}</td><td>jobtrackerhost:9010</td></tr>
	<tr><td>${nameNode}</td><td>wasb://&lt;containerName&gt;@&lt;storageAccountName&gt;.blob.core.windows.net</td></tr>
	<tr><td>${queueName}</td><td>default</td></tr>
	</table>

	**Hive action variables:**
	<table border="1">
	<tr><td>${hiveDataFolder}</td><td>The source data file for the Hive Create Table command.</td></tr>
	<tr><td>${hiveOutputFolder}</td><td>The output folder for the INSERT OVERWRITE statement.</td></tr>
	<tr><td>${hiveTableName}</td><td>The log4j Hive table name.</td></tr>
	</table>

	**Sqoop action variables:**
	<table border="1">
	<tr><td>${sqlDatabaseConnectionString}</td><td>SQL Database connection string.</td></tr>
	<tr><td>${sqlDatabaseTableName}</td><td>The SQL Database table where the data will be exported to.</td></tr>
	<tr><td>${hiveOutputFolder}</td><td>The output folder for the Hive INSERT OVERWRITE statement. This is the same folder for Sqoop Export export-dir.</td></tr>
	</table>

	For more information on Oozie workflow and using workflow actions, see [Apache Oozie 4.0 documentation][apache-oozie-400] (for HDInsight cluster version 3.0 preview) or [Apache Oozie 3.22 documentation][apache-oozie-322] (for HDInsight cluster version 2.1).

2. Save the file as **C:\Tutorials\UseOozie\workflow.xml** using the ANSI (ASCII) encoding.
	
##<a id="deploy"></a>Deploy the Oozie project and prepare the tutorial

You will run a Windows Azure PowerShell script to perform the following:

- Copy the HiveQL script (useoozie.hql) to wasb:///tutorials/useoozie/useoozie.hql.
- Copy workflow.xml to wasb:///tutorials/useoozie/workflow.xml.
- Copy the data file (/example/data/sample.log) to wasb:///tutorials/useoozie/data/sample.log. 
- Create a SQL Database table for storing Sqoop export data.  The table name is *log4jLogCount*.

**Understand HDInsight storage**

HDInsight uses Windows Azure Blob storage for data storage.  It is called *WASB* or *Windows Azure Storage - Blob*. WASB is Microsoft's implementation of HDFS on Windows Azure Blob storage. For more information see [Use Windows Azure Blob storage with HDInsight][hdinsight-storage]. 

When you provision an HDInsight cluster, a Blob storage container is designated as the default file system, just like in HDFS. In addition to this container, you can add additional containers from either the same Windows Azure storage account or different Windows Azure storage accounts during the provision process. To simply the PowerShell script used in this tutorial, all of the files are stored in the default file system container. By default this container has the same name as the HDInsight cluster name.

The WASB syntax is:

	wasb[s]://<ContainerName>@<StorageAccountName>.blob.core.windows.net/<path>/<filename>

> [WACOM.NOTE] Only the *wasb://* syntax is supported in HDInsight cluster version 3.0. The older *asv://* syntax is supported in HDInsight 2.1 and 1.6 clusters, but it is not supported in HDInsight 3.0 clusters and it will not be supported in later versions.

> [WACOM.NOTE] The WASB path is virtual path.  For more information see [Use Windows Azure Blob storage with HDInsight][hdinsight-storage]. 

For a file stored in the default file system container. it can be accessed from HDInsight using any of the following URIs (use workflow.xml as an example):

	wasb://mycontainer@mystorageaccount.blob.core.windows.net/tutorials/useoozie/workflow.xml
	wasb:///tutorials/useoozie/workflow.xml
	/tutorials/useoozie/workflow.xml

If you want to access the file directly from the storage account, the blob name for the file is:

	tutorials/useoozie/workflow.xml

The files used in this tutorial are stored in */tutorials/useoozie*.

**Understand Hive internal table and external table**

There are a few things you need to know about Hive internal table and external table:

- The CREATE TABLE command creates an internal table. The data file must be located in the default container.
- The CREATE TABLE command moves the data file to the /hive/warehouse/<TableName> folder.
- The CREATE EXTERNAL TABLE command creates an external table. The data file can be located outside the default container.
- The CREATE EXTERNAL TABLE command does not move the data file.
- The CREATE EXTERNAL TABLE command doesn't allow any folders in the LOCATION. This is the reason why the tutorial makes a copy of the sample.log file.

For more information, see [HDInsight: Hive Internal and External Tables Intro][cindygross-hive-tables].

**To prepare the tutorial**

1. Open Windows PowerShell ISE (On Windows 8 Start screen, type **PowerShell_ISE** and then click **Windows PowerShell ISE**. See [Start Windows PowerShell on Windows 8 and Windows][powershell-start]).
2. In the bottom pane, run the following command to connect to your Windows Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Windows Azure account credentials.

3. Copy the following script into the script pane.
			
		# WASB variables
		$storageAccountName = "<StorageAccountName>"
		$containerName = "<BlobStorageContainerName>"
		
		# SQL database server variables
		$sqlDatabaseServer = ""  # specify the Windows Azure SQL databse server name if you have one created. Otherwise use "".
		$sqlDatabaseAdminLogin = "<SQLDatabaseUserName>"
		$sqlDatabaseAdminLoginPassword = "SQLDatabasePassword>"
		$sqlDatabaseLocation = "<MicrosoftDataCenter>"
		
		# SQL database variables
		$sqlDatabaseName = ""  # specify the database name if you have one created.  Otherwise use "" to have the script create one for you.
		$sqlDatabaseMaxSizeGB = 10
		$sqlDatabaseTableName = "log4jLogsCount"
		
		# Oozie files for the tutorial	
		$workflowDefinition = "C:\Tutorials\UseOozie\workflow.xml"
		$hiveQLScript = "C:\Tutorials\UseOozie\useooziewf.hql"
		
		# WASB folder for storing the Oozie tutorial files.
		$destFolder = "wasb://$containerName@$storageAccountName.blob.core.windows.net/tutorials/useoozie/"

4. Set the first two or seven variables in the script. The following table shows the description for the variables:

	<table border="1">
	<tr><td><strong>Variable Name</strong></td><td><strong>Note</strong></td></tr>
	<tr><td>$storageAccountName</td><td>The Windows Azure Storage account used for the HDInsight cluster. This is the storage account you used during the cluster provision process.</td></tr>
	<tr><td>$containerName</td><td>The Winodws Azure Blob storage container used for the default HDInsight cluster file system.  By default, it has the same name as the HDInsight cluster.</td></tr>
	<tr><td>$sqlDatabaseServer</td><td>The SQL Database server name used by Sqoop to export data to. If you leave it as it is, the script will create one for you. Otherwise, specify an existing SQL Datbase  or SQL Server.</td></tr>
	<tr><td>$sqlDatabaseAdminLogin</td><td>SQL Database/SQL Server user name.</td></tr>
	<tr><td>$sqlDatabaseAdminLoginPassword</td><td>SQL Database/SQL Server user password.</td></tr>
	<tr><td>$sqlDatabaseLocation</td><td>This is only used if you want the script to create a SQL Database server for you.</td></tr>
	<tr><td>$sqlDatabaseName</td><td>The SQL Database name used by Sqoop to export data to. If you leave it as it is, the script will create one for you. Otherwise, specify an existing SQL Datbase.</td></tr>
	<tr><td>$sqlDatabaseMaxSizeGB</td><td>This is only used if you want the script to create a SQL Database for you.</td></tr>
	</table>

3. Append the following to the script in the script pane:
		
		# Create a storage context object
		$storageaccountkey = get-azurestoragekey $storageAccountName | %{$_.Primary}
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageaccountkey
		
		function uploadOozieFiles()
		{		
		    Write-Host "Copy workflow definition and HiveQL script file ..." -ForegroundColor Green
			Set-AzureStorageBlobContent -File $workflowDefinition -Container $containerName -Blob "$destFolder/workflow.xml" -Context $destContext
			Set-AzureStorageBlobContent -File $hiveQLScript -Container $containerName -Blob "$destFolder/useooziewf.hql" -Context $destContext
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
				
			# create a new Windows Azure SQL Database server if requested
			if ([string]::IsNullOrEmpty($sqlDatabaseServer))
			{
				$sqlDatabaseServer = New-AzureSqlDatabaseServer -AdministratorLogin $sqlDatabaseAdminLogin -AdministratorLoginPassword $sqlDatabaseAdminLoginPassword -Location $sqlDatabaseLocation 
				Write-Host "The new SQL Databse server is $sqlDatabaseServer."  -ForegroundColor Green
			}
			else
			{
				Write-Host "Use an existing SQL Database server: $sqlDatabaseServer" -ForegroundColor Green
			}
				
			# Create a new SQL database if requested
			if ([string]::IsNullOrEmpty($sqlDatabaseName))
			{
				$sqlDatabaseName = "HDISqoop"  
		
				$sqlDatabaseServerCredential = new-object System.Management.Automation.PSCredential($sqlDatabaseAdminLogin, ($sqlDatabaseAdminLoginPassword  | ConvertTo-SecureString -asPlainText -Force)) 
				$sqlDatabaseServerConnectionContext = New-AzureSqlDatabaseServerContext -ServerName $sqlDatabaseServer -Credential $sqlDatabaseServerCredential 
				
				$sqlDatabase = New-AzureSqlDatabase -ConnectionContext $sqlDatabaseServerConnectionContext -DatabaseName $sqlDatabaseName -MaxSizeGB $sqlDatabaseMaxSizeGB
				    
				Write-Host "The new SQL Databse is $sqlDatabaseName."  -ForegroundColor Green
			}
			else
			{
				Write-Host "Use an existing SQL Database : $sqlDatabaseName" -ForegroundColor Green
			}
				
			#Create the log4jLogsCount table
		    Write-Host "Create Log4jLogsCount table ..." -ForegroundColor Green
			$conn = New-Object System.Data.SqlClient.SqlConnection
			$conn.ConnectionString = "Data Source=$sqlDatabaseServer.database.windows.net;Initial Catalog=$sqlDatabaseName;User ID=$sqlDatabaseAdminLogin;Password=$sqlDatabaseAdminLoginPassword;Encrypt=true;Trusted_Connection=false;"
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

4. Click **Run Script** or press **F5** to run the script. The output shall be similar to:

	![Tutorial preparation output][img-preparation-output]

##<a id="run"></a>Run the Oozie project

Windows Azure PowerShell currently doesn't support an Oozie job definition. You can use 
the Invoke-RestMethod PowerShell cmdlet to invoke Oozie web services. The Oozie Web Services API is a HTTP REST JSON API. For more information on Oozie Web Services API, see [Apache Oozie 4.0 documentation][apache-oozie-400] (for HDInsight cluster version 3.0 preview) or [Apache Oozie 3.22 documentation][apache-oozie-322] (for HDInsight cluster version 2.1).

There is a known Hive path issue. The instructions for fixing the issue can be found at [TechNet Wiki][technetwiki-hive-error].

**To submit an Oozie job**

1. Open Windows PowerShell ISE (On Windows 8 Start screen, type **PowerShell_ISE** and then click **Windows PowerShell ISE**. See [Start Windows PowerShell on Windows 8 and Windows][powershell-start]).
2. In the bottom pane, run the following command to connect to your Windows Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Windows Azure account credentials.

3. Copy the following script into the script pane.

		#HDInsight cluster variables
		$clusterName = "<HDInsightClusterName>"
		$clusterUsername = "<HDInsightClusterUsername>"
		$clusterPassword = "<HDInsightClusterUserPassword>"
		
		#Windows Azure Blob storage (WASB) variables
		$storageAccountName = "<StorageAccountName>"
		$storageContainerName = "<BlobContainerName>"
		$storageUri="wasb://$storageContainerName@$storageAccountName.blob.core.windows.net"
		
		#Windows Azure SQL database variables
		$sqlDatabaseServer = "<SQLDatabaseServerName>"
		$sqlDatabaseUsername = "<SQLDatabaseUserName>"
		$sqlDatabasePassword = "<SQLDatabasePassword>"
		$sqlDatabaseName = "<SQLDatabaseName>"  # The default name is "HDISqoop"
		
		#Oozie WF variables
		$oozieWFPath="$storageUri/tutorials/useoozie"  # The default name is workflow.xml. And you don't need to specify the file name.
		$waitTimeBetweenOozieJobStatusCheck=10
		
		#Hive action variables
		$hiveScript = "$storageUri/tutorials/useoozie/useooziewf.hql"
		$hiveTableName = "log4jlogs"
		$hiveDataFolder = "$storageUri/tutorials/useoozie/data"
		$hiveOutputFolder = "$storageUri/tutorials/useoozie/output"
		
		#Sqoop action variables
		$sqlDatabaseConnectionString = "jdbc:sqlserver://$sqlDatabaseServer.database.windows.net;user=$sqlDatabaseUsername@$sqlDatabaseServer;password=$sqlDatabasePassword;database=$sqlDatabaseName"
		$sqlDatabaseTableName = "log4jLogsCount"

		$passwd = ConvertTo-SecureString $clusterPassword -AsPlainText -Force
		$creds = New-Object System.Management.Automation.PSCredential ($clusterUsername, $passwd)

2. Set the first ten variables. The following table shows the description of the variables:
	<table border="1">
	<tr><td><strong>Variable Name</strong></td><td><strong>Note</strong></td></tr>
	<tr><td>$clusterName</td><td>The HDInsight cluster where the Oozie job will run.</td></tr>
	<tr><td>$clusterUsername</td><td>The HDInsight cluster user username.</td></tr>
	<tr><td>$clusterPassword</td><td>The HDInsight cluster user password </td></tr>
	<tr><td>$storageAccountName</td><td>The Windows Azure Storage account used for the HDInsight</td></tr>
	<tr><td>$storageContainerName</td><td>The Winodws Azure Blob storage container used for the default HDInsight cluster file system.  By default, it has the same name as the HDInsight cluster.</td></tr>
	<tr><td>$storageUri</td><td>You don't need to configure this variable</td></tr>
	<tr><td>$sqlDatabaseServer</td><td>The SQL Database server name used by Sqoop to export data to.</td></tr>
	<tr><td>$sqlDatabaseUsername</td><td>SQL Database/SQL Server user name.</td></tr>
	<tr><td>$sqlDatabasePassword</td><td>SQL Database/SQL Server user password.</td></tr>
	<tr><td>$sqlDatabaseName</td><td>The SQL Database name used by Sqoop to export data to. The default name is <i>HDISqoop</i>.</td></tr>
	</table>

3. Append the following to the script. This part defines Oozie paylod:
		
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
		
		   <property>
		       <name>oozie.wf.application.path</name>
		       <value>$oozieWFPath</value>
		   </property>
		
		</configuration>
		"@
		
4. Append the following to the script. This part checks the Oozie web service status:	
			
	    Write-Host "Checking Oozie server status..." -ForegroundColor Green
	    $clusterUriStatus = "https://$clusterName.azurehdinsight.net:443/oozie/v1/admin/status"
	    $response = Invoke-RestMethod -Method Get -Uri $clusterUriStatus -Credential $creds -OutVariable $OozieServerStatus 
	    
	    $jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
	    $oozieServerSatus = $jsonResponse[0].("systemMode")
	    Write-Host "Oozie server status is $oozieServerSatus..."
	
5. Append the following to the script. This part creates and starts an Oozie job:	

	    # create Oozie job
	    Write-Host "Sending the following Payload to the cluster:" -ForegroundColor Green
	    Write-Host "`n--------`n$OoziePayload`n--------"
	    $clusterUriCreateJob = "https://$clusterName.azurehdinsight.net:443/oozie/v1/jobs"
	    $response = Invoke-RestMethod -Method Post -Uri $clusterUriCreateJob -Credential $creds -Body $OoziePayload -ContentType "application/xml" -OutVariable $OozieJobName #-debug
	
	    $jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
	    $oozieJobId = $jsonResponse[0].("id")
	    Write-Host "Oozie job id is $oozieJobId..."
	
	    # start Oozie job
	    Write-Host "Starting the Oozie job $oozieJobId..." -ForegroundColor Green
	    $clusterUriStartJob = "https://$clusterName.azurehdinsight.net:443/oozie/v1/job/" + $oozieJobId + "?action=start"
	    $response = Invoke-RestMethod -Method Put -Uri $clusterUriStartJob -Credential $creds | Format-Table -HideTableHeaders #-debug
		
6. Append the following to the script. This part checks the Oozie job status:		

	    # get job status
	    Write-Host "Sleeping for $waitTimeBetweenOozieJobStatusCheck seconds until the job metadata is populated in the Oozie metastore..." -ForegroundColor Green
	    Start-Sleep -Seconds $waitTimeBetweenOozieJobStatusCheck
	
	    Write-Host "Getting job status and waiting for the job to complete..." -ForegroundColor Green
	    $clusterUriGetJobStatus = "https://$clusterName.azurehdinsight.net:443/oozie/v1/job/" + $oozieJobId + "?show=info"
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
	
	    Write-Host "$(Get-Date -format 'G'): $oozieJobId is in $JobStatus state!" -ForegroundColor Green

7. Click **Run Script** or press **F5** to run the script. The output shall be similar to:

	![Tutorial run workflow output][img-runworkflow-output]

8. Connect to your SQL Database to see the exported data.

**To check the job error log**

To troubleshoot a workflow, the Oozie log file can be found at C:\apps\dist\oozie-3.3.2.1.3.2.0-05\oozie-win-distro\logs\Oozie.log from the cluster headnode. For information on RDP, see[Administering HDInsight clusters using Management portal][hdinsight-admin-portal].

**To re-run the tutorial**

To re-run the workflow, you must perform the following:

- delete the Hive script output file
- delete the data in the log4jLogsCount table

Here is a sample PowerShell script that you can use:

	$storageAccountName = "<WindowsAzureStorageAccountName>"
	$containerName = "<ContainerName>"
	
	#SQL database variables
	$sqlDatabaseServer = "<SQLDatabaseServerName>"
	$sqlDatabaseAdminLogin = "<SQLDatabaseUserName>"
	$sqlDatabaseAdminLoginPassword = "<SQLDatabasePassword>"
	$sqlDatabaseName = "<SQLDatabaseName>"
	$sqlDatabaseTableName = "log4jLogsCount"
	
	Write-host "Delete the Hive script output file ..." -ForegroundColor Green
	$storageaccountkey = get-azurestoragekey $storageAccountName | %{$_.Primary}
	$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageaccountkey
	Remove-AzureStorageBlob -Context $destContext -Blob "tutorials/useoozie/output/000000_0" -Container $containerName
	
	Write-host "Delete all the records from the log4jLogsCount table ..." -ForegroundColor Green
	$conn = New-Object System.Data.SqlClient.SqlConnection
	$conn.ConnectionString = "Data Source=$sqlDatabaseServer.database.windows.net;Initial Catalog=$sqlDatabaseName;User ID=$sqlDatabaseAdminLogin;Password=$sqlDatabaseAdminLoginPassword;Encrypt=true;Trusted_Connection=false;"
	$conn.open()
	$cmd = New-Object System.Data.SqlClient.SqlCommand
	$cmd.connection = $conn
	$cmd.commandtext = "delete from $sqlDatabaseTableName"
	$cmd.executenonquery()
	
	$conn.close()


##<a id="nextsteps"></a>Next steps
In this tutorial, you have learned how to define an Oozie workflow, and how to run an Oozie job using Windows Azure PowerShell. To learn more, see the following articles:

- [Get started with HDInsight][hdinsight-get-started]
- [Get started with the HDInsight Emulator][hdinsight-emulator]
- [Use Windows Azure Blob storage with HDInsight][hdinsight-storage]
- [Administer HDInsight using PowerShell][hdinsight-admin-powershell]
- [Upload data to HDInsight][hdinsight-upload-data]
- [Use Hive with HDInsight][hdinsight-hive]
- [Use Pig with HDInsight][hdinsight-pig]
- [Develop C# Hadoop streaming jobs for HDInsight][hdinsight-develop-streaming]
- [Develop Java MapReduce programs for HDInsight][hdinsight-develop-mapreduce]





[hdinsight-versions]:  /en-us/documentation/articles/hdinsight-component-versioning/
[hdinsight-storage]: /en-us/documentation/articles/hdinsight-use-blob-storage/
[hdinsight-get-started]: /en-us/documentation/articles/hdinsight-get-started/
[hdinsight-admin-portal]: /en-us/documentation/articles/hdinsight-administer-use-management-portal/


[hdinsight-provision]: /en-us/documentation/articles/hdinsight-provision-clusters/

[hdinsight-admin-powershell]: /en-us/documentation/articles/hdinsight-administer-use-powershell/

[hdinsight-upload-data]: /en-us/documentation/articles/hdinsight-upload-data/

[hdinsight-mapreduce]: /en-us/documentation/articles/hdinsight-use-mapreduce/
[hdinsight-hive]: /en-us/documentation/articles/hdinsight-use-hive/

[hdinsight-pig]: /en-us/documentation/articles/hdinsight-use-pig/

[hdinsight-cmdlets-download]: http://go.microsoft.com/fwlink/?LinkID=325563
[hdinsight-storage]: /en-us/documentation/articles/hdinsight-use-blob-storage/

[hdinsight-emulator]: /en-us/documentation/articles/hdinsight-get-started-emulator/

[hdinsight-develop-streaming]: /en-us/documentation/articles/hdinsight-hadoop-develop-deploy-streaming-jobs/
[hdinsight-develop-mapreduce]: /en-us/documentation/articles/hdinsight-develop-deploy-java-mapreduce/




[azure-purchase-options]: https://www.windowsazure.com/en-us/pricing/purchase-options/
[azure-member-offers]: https://www.windowsazure.com/en-us/pricing/member-offers/
[azure-free-trial]: https://www.windowsazure.com/en-us/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: /en-us/manage/services/storage/how-to-create-a-storage-account/ 

[apache-hadoop]: http://hadoop.apache.org/
[apache-oozie-400]: http://oozie.apache.org/docs/4.0.0/
[apache-oozie-322]: http://oozie.apache.org/docs/3.2.2/

[powershell-download]: http://www.windowsazure.com/en-us/manage/downloads/
[powershell-about-profiles]: http://go.microsoft.com/fwlink/?LinkID=113729
[powershell-install-configure]: /en-us/manage/install-and-configure-windows-powershell/
[powershell-start]: http://technet.microsoft.com/en-us/library/hh847889.aspx

[cindygross-hive-tables]: http://blogs.msdn.com/b/cindygross/archive/2013/02/06/hdinsight-hive-internal-and-external-tables-intro.aspx

[img-workflow-diagram]: ./media/hdinsight-use-oozie/HDI.UseOozie.Workflow.Diagram.png
[img-preparation-output]: ./media/hdinsight-use-oozie/HDI.UseOozie.Preparation.Output.png
[img-runworkflow-output]: ./media/hdinsight-use-oozie/HDI.UseOozie.RunWF.Output.png

[technetwiki-hive-error]: http://social.technet.microsoft.com/wiki/contents/articles/23047.hdinsight-hive-error-unable-to-rename.aspx