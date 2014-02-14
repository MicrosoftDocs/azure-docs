<properties linkid="hdinsight-use-oozie-with-hdinsight" urlDisplayName="Use Oozie with HDInsight" pageTitle="Use Oozie with HDInsight | Windows Azure" metaKeywords="" description="Use Oozie with HDInsight, a big data solution. Learn how to define an Oozie workflow, and submit an Oozie job." metaCanonical="" services="hdinsight" documentationCenter="" title="Use Oozie with HDInsight" authors=""  solutions="" writer="jgao" manager="paulettm" editor="cgronlun"  />


# Use Oozie with HDInsight

Apache Oozie is a workflow/coordination system that manages Hadoop jobs. It is integrated with the Hadoop stack and supports Hadoop jobs for Apache MapReduce, Apache Pig, Apache Hive, and Apache Sqoop. It can also be used to schedule jobs specific to a system, like Java programs or shell scripts.

In this tutorial, you will create and run an Oozie workflow that contains two actions: 

- A Hive action that run a HiveQL script to process a log4j log file and count the occurrences of each log level type. Each log4j log consists of a line of fields that contains a [LOG LEVEL] field to show the type and the severity. For example:

		2012-02-03 18:35:34 SampleClass6 [INFO] everything normal for id 577725851
		2012-02-03 18:35:34 SampleClass4 [FATAL] system problem at id 1991281254
		2012-02-03 18:35:34 SampleClass3 [DEBUG] detail for id 1304807656

	The Hive script output is similar to:
	
		[DEBUG] 434
		[ERROR] 3
		[FATAL] 1
		[INFO]  96
		[TRACE] 816
		[WARN]  4
	
- A Sqoop action to export the HiveQL script output to a Windows Azure SQL database table.

**Prerequisite**

Before you begin this tutorial, you must have the following:

- An HDInsight cluster. For information on creating an HDInsight cluster, see [Provision HDInsight clusters][hdinsight-provision], or [Get started with HDInsight][hdinsight-get-started].
- A workstation with Windows Azure PowerShell installed and configured.  For instructions, see [Install and configure Windows Azure PowerShell][powershell-install-configure].


**Estimated time to complete:** 30 minutes

##In this article

1. Define Oozie workflow file
2. Define Oozie coordinator file
3. Deploy the Oozie project and prepare the tutorial 
4. Run workflow

##Define Oozie workflow and the related HiveQL script

Oozie workflows definitions are written in hPDL (a XML Process Definition Language). The workflow file has to be named "workflow.xml".  You will save the file locally, and later deploy it to HDInsight cluster using Windows Azure PowerShell.

The Hive action in the workflow calls an HiveQL script file. This script file contains three HiveQL statements:

1. **The DROP TABLE statement** makes sure the log4j Hive table doesn't exist. 
2. **The CREATE TABLE statement** creates an Hive external table pointing to the WASB location of the log4j log file. The field delimiter is ",". The default line delimiter is "\n".  Hive external table is used to avoid the data file being removed from the original location(this file is used by several other tutorials).
3. **The INSERT OVERWRITE statement** counts the occurrences of each log level type from the log4j Hive table. The output is saved to WASB. 



**To define the HiveQL script file to be called by the workflow:**

1. Create a text file with the following content:

		DROP TABLE ${hiveTableName};
		CREATE EXTERNAL TABLE ${hiveTableName}(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) ROW FORMAT DELIMITED FIELDS TERMINATED BY ' ' STORED AS TEXTFILE LOCATION '${hiveDataFolder}';
		INSERT OVERWRITE DIRECTORY '${hiveOutputFolder}' SELECT t4 AS sev, COUNT(*) AS cnt FROM ${hiveTableName} WHERE t4 LIKE '[%' GROUP BY t4;

	There are three variables used in the script:

	- ${hiveTableName}
	- ${hiveDataFolder}
	- ${hiveOutputFolder}
			
	The workflow definition file will pass these values to the script.
		
2. Save the file as **C:\Tutorials\UseOozie\useooziewf.hql** use the ANSI(ASCII) encoding. This script file will be deployed to HDInsight cluster later in the tutorial.



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
	<tr><td>${hiveTableName}</td><td>The Hive table for log level and count data.</td></tr>
	</table>

	**Sqoop action variables:**
	<table border="1">
	<tr><td>${sqlDatabaseConnectionString}</td><td>SQL database connection string.</td></tr>
	<tr><td>${sqlDatabaseTableName}</td><td>The SQL database table where the data will be exported to.</td></tr>
	<tr><td>${sqoopExportFolder}</td><td>The <i>--export-dir</i> for the Sqoop export command. In this tutorial, the path is <i>/hive/warehouse/lo4jlogs</i>, in which lo4jlogs is the Hive table name.</td></tr>
	</table>

	For more information on Oozie workflow and using workflow actions, see [Apache Oozie 4.0 documentation][apache-oozie-400] (for HDInsight cluster version 3.0 preview) or [Apache Oozie 3.22 documentation][apache-oozie-322] (for HDInsight cluster version 2.1).

2. Save the file as **C:\Tutorials\UseOozie\workflow.xml** using the ANSI (ASCII) encoding.
	
##Prepare Windows Azure SQL database and table

You will run a PowerShell script to perform the following:

- Copy the HiveQL script (useoozie.hql) to wasb:///tutorials/useoozie/useoozie.hql.
- Copy workflow.xml to wasb:///tutorials/useoozie/workflow.xml.
- Copy the data file (/example/data/sample.log) to wasb:///tutorials/useoozie/data/sample.log. 
- Create a SQL Database table for storing Sqoop export data.  The table name is *log4jLogCount*.

**To prepare the tutorial**

1. Open Windows Azure PowerShell. For instructions, see [Install and configure Windows Azure PowerShell][powershell-install-configure].
2. Run the following command to connect to your Windows Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Windows Azure account credentials.

2. Set the first three variables, and then run the commands.
	
		# Windows Azure subscription name
		$subscriptionName = "<WindowsAzureSubscriptionName>"
		
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

	<table border="1">
	<tr><td><strong>Variable Name</strong></td><td><strong>Note</strong></td></tr>
	<tr><td>$subscriptionName</td><td>Your Windows Azure subscription name.</td></tr>
	<tr><td>$storageAccountName</td><td>The Windows Azure Storage account used for the HDInsight cluster.</td></tr>
	<tr><td>$containerName</td><td>The Winodws Azure Blob storage container used for the default HDInsight cluster file system.  By default, it has the same name as the HDInsight cluster.</td></tr>
	<tr><td>$sqlDatabaseServer</td><td>The SQL Database server name used by Sqoop to export data to. If you leave it as it is, the script will create one for you. Otherwise, specify an existing SQL Datbase  or SQL Server.</td></tr>
	<tr><td>$sqlDatabaseAdminLogin</td><td>SQL Database/SQL Server user name.</td></tr>
	<tr><td>$sqlDatabaseAdminLoginPassword</td><td>SQL Database/SQL Server user password.</td></tr>
	<tr><td>$sqlDatabaseLocation</td><td>This is only used if you want the script to create a SQL Database server for you.</td></tr>
	<tr><td>$sqlDatabaseName</td><td>The SQL Database name used by Sqoop to export data to. If you leave it as it is, the script will create one for you. Otherwise, specify an existing SQL Datbase  or SQL Server.</td></tr>
	<tr><td>$sqlDatabaseMaxSizeGB</td><td>This is only used if you want the script to create a SQL Database for you.</td></tr>
	</table>

3. Run the following command:
		
		# Select the current Windows Azure subscription in case there are multiple subscriptions
		Select-AzureSubscription $subscriptionName
		
		# Create a storage context object
		$storageaccountkey = get-azurestoragekey $storageAccountName | %{$_.Primary}
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageaccountkey
		
		function uploadOozieFiles()
		{		
		    # Copy the files
		    Set-AzureStorageBlobContent -File $workflowDefinition -Container $containerName -Blob "$destFolder/workflow.xml" -Context $destContext
		    Set-AzureStorageBlobContent -File $hiveQLScript -Container $containerName -Blob "$destFolder/useooziewf.hql" -Context $destContext
		
		    # List the files on HDinsight
		    Get-AzureStorageBlob -Container $containerName -Context $destContext -Prefix $destFolder
		}
		
		function prepareHiveDataFile()
		{
		    # make a copy of the sample.log file
		    Start-CopyAzureStorageBlob -SrcContainer $containerName -SrcBlob "example/data/sample.log" -Context $destContext -DestContainer $containerName -DestBlob "$destFolder/data/sample.log" -DestContext $destContext
		
		    # List the files on HDinsight
		    Get-AzureStorageBlob -Container $containerName -Context $destContext -Prefix "$destFolder/data/"
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
		        Write-Host "The new SQL Databse server is $sqlDatabaseServer."  -BackgroundColor Green
		    }
		    else
		    {
		        Write-Host "Use an existing SQL Database server: $sqlDatabaseServer" -BackgroundColor Green
		    }
		
		    # Create a new SQL database if requested
		    if ([string]::IsNullOrEmpty($sqlDatabaseName))
		    {
		        $sqlDatabaseName = "HDISqoop"  

		        $sqlDatabaseServerCredential = new-object System.Management.Automation.PSCredential($sqlDatabaseAdminLogin, ($sqlDatabaseAdminLoginPassword  | ConvertTo-SecureString -asPlainText -Force)) 
		        $sqlDatabaseServerConnectionContext = New-AzureSqlDatabaseServerContext -ServerName $sqlDatabaseServer -Credential $sqlDatabaseServerCredential 
		
		        $sqlDatabase = New-AzureSqlDatabase -ConnectionContext $sqlDatabaseServerConnectionContext -DatabaseName $sqlDatabaseName -MaxSizeGB $sqlDatabaseMaxSizeGB
		    
		        Write-Host "The new SQL Databse is $sqlDatabaseName."  -BackgroundColor Green
		    }
		    else
		    {
		        Write-Host "Use an existing SQL Database : $sqlDatabaseName" -BackgroundColor Green
		    }
		
		    #Create the log4jLogsCount table
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

## Run the Oozie project

(Talk about Oozie web service API)

**To submit an Oozie job**

1. Open Windows Azure PowerShell. For instructions, see [Install and configure Windows Azure PowerShell][powershell-install-configure].
2. Run the following command to connect to your Windows Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Windows Azure account credentials.

2. Set the first ten variables, and then run the commands.

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

	There are the variables and description:
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

3. Run the following command to define Oozie paylod:
		
		#OoziePayload used for Oozie web service submission
		$OoziePayload = "<?xml version=`"1.0`" encoding=`"UTF-8`"?>"
		$OoziePayload += "<configuration>"
		
		$OoziePayload += "   <property>"
		$OoziePayload += "       <name>nameNode</name>"
		$OoziePayload += "       <value>$storageUri</value>"
		$OoziePayload += "   </property>"
		
		$OoziePayload += "   <property>"
		$OoziePayload += "       <name>jobTracker</name>"
		$OoziePayload += "       <value>jobtrackerhost:9010</value>"
		$OoziePayload += "   </property>"
		
		$OoziePayload += "   <property>"
		$OoziePayload += "       <name>queueName</name>"
		$OoziePayload += "       <value>default</value>"
		$OoziePayload += "   </property>"
		
		$OoziePayload += "   <property>"
		$OoziePayload += "       <name>oozie.use.system.libpath</name>"
		$OoziePayload += "       <value>true</value>"
		$OoziePayload += "   </property>"
		
		$OoziePayload += "   <property>"
		$OoziePayload += "       <name>hiveScript</name>"
		$OoziePayload += "       <value>$hiveScript</value>"
		$OoziePayload += "   </property>"
		
		$OoziePayload += "   <property>"
		$OoziePayload += "       <name>hiveTableName</name>"
		$OoziePayload += "       <value>$hiveTableName</value>"
		$OoziePayload += "   </property>"
		
		$OoziePayload += "   <property>"
		$OoziePayload += "       <name>hiveDataFolder</name>"
		$OoziePayload += "       <value>$hiveDataFolder</value>"
		$OoziePayload += "   </property>"
		
		$OoziePayload += "   <property>"
		$OoziePayload += "       <name>hiveOutputFolder</name>"
		$OoziePayload += "       <value>$hiveOutputFolder</value>"
		$OoziePayload += "   </property>"
		
		$OoziePayload += "   <property>"
		$OoziePayload += "       <name>sqlDatabaseConnectionString</name>"
		$OoziePayload += "       <value>&quot;$sqlDatabaseConnectionString&quot;</value>"
		$OoziePayload += "   </property>"
		
		$OoziePayload += "   <property>"
		$OoziePayload += "       <name>sqlDatabaseTableName</name>"
		$OoziePayload += "       <value>$SQLDatabaseTableName</value>"
		$OoziePayload += "   </property>"
		
		$OoziePayload += "   <property>"
		$OoziePayload += "       <name>user.name</name>"
		$OoziePayload += "       <value>admin</value>"
		$OoziePayload += "   </property>"
		
		$OoziePayload += "   <property>"
		$OoziePayload += "       <name>oozie.wf.application.path</name>"
		$OoziePayload += "       <value>$oozieWFPath</value>"
		$OoziePayload += "   </property>"
		
		$OoziePayload += "</configuration>"
		
4. Run the following commands to check Oozie web service status:				

	    Write-Host "Checking Oozie server status..." -ForegroundColor Green
	    $clusterUriStatus = "https://$clusterName.azurehdinsight.net:443/oozie/v1/admin/status"
	    $response = Invoke-RestMethod -Method Get -Uri $clusterUriStatus -Credential $creds -OutVariable $OozieServerStatus 
	    
	    $jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
	    $oozieServerSatus = $jsonResponse[0].("systemMode")
	    Write-Host "Oozie server status is $oozieServerSatus..."
	
	Verify the status is *NORMAL*.
	
5. Run the following commands to create and start an Oozie job:	

	    # create Oozie job
	    Write-Host "Sending the following Payload to the cluster:" -ForegroundColor Green
	    Write-Host "`n--------`n$OoziePayload`n--------"
	    $clusterUriCreateJob = "https://$clusterName.azurehdinsight.net:443/oozie/v1/jobs"
	    $response = Invoke-RestMethod -Method Post -Uri $clusterUriCreateJob -Credential $creds -Body $OoziePayload -ContentType "application/xml" -OutVariable $OozieJobName -debug
	
	    $jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
	    $oozieJobId = $jsonResponse[0].("id")
	    Write-Host "Oozie job id is $oozieJobId..."
	
	    # start Oozie job
	    Write-Host "Starting the Oozie job $oozieJobId..." -ForegroundColor Green
	    $clusterUriStartJob = "https://$clusterName.azurehdinsight.net:443/oozie/v1/job/" + $oozieJobId + "?action=start"
	    $response = Invoke-RestMethod -Method Put -Uri $clusterUriStartJob -Credential $creds | Format-Table -HideTableHeaders -debug
		
6. Run the following commands to check the Oozie job status:		

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





##<a name="nextsteps"></a>Next steps
In this tutorial, you have learned how to define an Oozie workflow, and how to run an Oozie job using Windows Azure PowerShell. To learn more, see the following articles:

- [Get started with the HDInsight Emulator][hdinsight-emulator]
- [Use Windows Azure Blob storage with HDInsight][hdinsight-storage]
- [Administer HDInsight using PowerShell][hdinsight-admin-powershell]
- [Upload data to HDInsight][hdinsight-upload-data]
- [Use Hive with HDInsight][hdinsight-hive]
- [Use Pig with HDInsight][hdinsight-pig]
- [Develop and deploy Hadoop streaming jobs to HDInsight][hdinsight-develop-deploy-streaming]






[hdinsight-get-started]: /en-us/documentation/articles/hdinsight-get-started/
[hdinsight-provision]: /en-us/manage/services/hdinsight/provision-hdinsight-clusters/
[hdinsight-admin-powershell]: /en-us/manage/services/hdinsight/administer-hdinsight-using-powershell/
[hdinsight-upload-data]: /en-us/manage/services/hdinsight/howto-upload-data-to-hdinsight/
[hdinsight-mapreduce]: /en-us/manage/services/hdinsight/using-mapreduce-with-hdinsight/
[hdinsight-hive]:/en-us/manage/services/hdinsight/using-hive-with-hdinsight/
[hdinsight-pig]: /en-us/manage/services/hdinsight/using-pig-with-hdinsight/
[hdinsight-cmdlets-download]: http://go.microsoft.com/fwlink/?LinkID=325563
[hdinsight-storage]: /en-us/manage/services/hdinsight/howto-blob-store/
[hdinsight-emulator]: /en-us/manage/services/hdinsight/get-started-with-windows-azure-hdinsight-emulator/
[hdinsight-develop-deploy-streaming]: /en-us/manage/services/hdinsight/develop-deploy-hadoop-streaming-jobs/



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
