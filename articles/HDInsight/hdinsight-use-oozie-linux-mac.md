<properties
	pageTitle="Use Hadoop Oozie in HDInsight | Microsoft Azure"
	description="Use Hadoop Oozie in HDInsight, a big data service. Learn how to define an Oozie workflow, and submit an Oozie job."
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/11/2015"
	ms.author="larryfr"/>


# Use Oozie with Hadoop to define and run a workflow on Linux-based HDInsight (Preview)

##Overview
Learn how to use Apache Oozie to define a workflow and run the workflow on HDInsight. To learn about the Oozie coordinator, see [Use time-based Hadoop Oozie Coordinator with HDInsight][hdinsight-oozie-coordinator-time].

> [AZURE.NOTE] Another option for defining workflows with HDInsight is Azure Data Factory. To learn more about Azure Data Factory, see [Use Pig and Hive with Data Factory][azure-data-factory-pig-hive].

##What is Oozie?

Apache Oozie is a workflow/coordination system that manages Hadoop jobs. It is integrated with the Hadoop stack, and it supports Hadoop jobs for Apache MapReduce, Apache Pig, Apache Hive, and Apache Sqoop. It can also be used to schedule jobs that are specific to a system, like Java programs or shell scripts.

The workflow you will implement by following the instructions in this tutorial contains two actions:

![Workflow diagram][img-workflow-diagram]

1. A Hive action runs a HiveQL script to extract records from the **hivesampletable** included with HDInsight. Each row of data describes a visit to a website from a specific mobile device. The record format appears similar to the following:

		8       18:54:20        en-US   Android Samsung SCH-i500        California     United States    13.9204007      0       0
		23      19:19:44        en-US   Android HTC     Incredible      Pennsylvania   United States    NULL    0       0
		23      19:19:46        en-US   Android HTC     Incredible      Pennsylvania   United States    1.4757422       0       1

	The Hive script extracts all rows for a specific mobile platform, such as 'Android'.

	For more information about Hive, see [Use Hive with HDInsight][hdinsight-use-hive].

2.  A Sqoop action exports the HiveQL output to a table in an Azure SQL database. For more information about Sqoop, see [Use Hadoop Sqoop with HDInsight][hdinsight-use-sqoop].

> [AZURE.NOTE] For supported Oozie versions on HDInsight clusters, see [What's new in the Hadoop cluster versions provided by HDInsight?][hdinsight-versions].

##Prerequisites

Before you begin this tutorial, you must have the following:

- **Azure CLI**: See [install and configure the Azure CLI](xplat-cli.md)

- **An HDInsight cluster**.

- **An Azure SQL database**.

##Define the Hive query

Use the following steps to create a HiveQL script that defines a query, which will be used in an Oozie workflow later in this document.

1. Use SSH to connect to the Linux-based HDInsight cluster:

    * **Linux, Unix or OS X clients**: See [Use SSH with Linux-based Hadoop on HDInsight from Linux, OS X or Unix](hdinsight-hadoop-linux-use-ssh-unix.md)

    * **Windows clients**: See [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

2. Use the following command to create a new file:

        nano useooziewf.hql

1. Once the nano editor opens, use the following as the contents of the file:

		DROP TABLE ${hiveTableName};
		CREATE EXTERNAL TABLE ${hiveTableName}(clientid string, querytime string, market string, deviceplatform string, devicemake string, devicemodel string, state string, country string, querydwelltime double, sessionid bigint, sessionpagevieworder bigint) ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t' STORED AS TEXTFILE LOCATION '${hiveDataFolder}';

		INSERT INTO TABLE ${hiveTableName} SELECT * FROM hivesampletable WHERE deviceplatform LIKE ${devicePlatform}

	There are three variables used in the script:

	- **${hiveTableName}**: will contain the name of the table to be created
	- **${hiveDataFolder}**: will contain the location to store the data files for the table
	- **${devicePlatform}**: will contain the mobile platform to return data for. For example, 'Android'

	The workflow definition file (workflow.xml in this tutorial) passes these values to this HiveQL script at run time.

2. Press Ctrl-X to exit the editor. When prompted, select **Y** to save the file, then use **Enter** to use the **useooziewf.hql** file name.

3. Use the following commands to copy **useooziewf.hql** to **wasb:///tutorials/useoozie/useooziewf.hql**:

		hadoop fs -mkdir -p wasb:///tutorials/useoozie/data
		hadoop fs -copyFromLocal useooziewf.hql wasb:///tutorials/useoozie/useooziewf.hql

	> [AZURE.NOTE] The `-p` parameter caused all directories in the path to be created if they do not already exist. The **data** directory will be used to hold data used by the **useooziewf.hql** script.

	These commands store the **useooziewf.hql** file on the Azure Storage account associated with this cluster, which will preserve the file even if the cluster is deleted. This allows you to save money by deleting clusters when they aren't in use, while maintaining your jobs and workflows.

##Define the workflow

Oozie workflows definitions are written in hPDL (a XML Process Definition Language). Use the following steps to define the workflow:

1. Use the following statement to create and edit a new file:

        nano workflow.xml

1. Once the nano editor opens, enter the following as the file contents:

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
			    <arg>"\t"</arg>
		        </sqoop>
		        <ok to="end"/>
		        <error to="fail"/>
		    </action>

		    <kill name="fail">
		        <message>Job failed, error message[${wf:errorMessage(wf:lastErrorNode())}] </message>
		    </kill>

		   <end name="end"/>
		</workflow-app>

	There are two actions defined in the workflow:

	- **RunHiveScript**: This is the start action, and runs the **useooziewf.hql** Hive script

	- **RunSqoopExport**: This exports the data created from the Hive script to SQL Database using Sqoop. This will only run if the **RunHiveScript** action is successful.

		> [AZURE.NOTE] For more information about Oozie workflow and using workflow actions, see [Apache Oozie 4.0 documentation][apache-oozie-400] (for HDInsight version 3.0) or [Apache Oozie 3.3.2 documentation][apache-oozie-332] (for HDInsight version 2.1).

	Note that the workflow has several entries, such as `${jobTracker}`, that will be replaced by values you use in the job definition later in this document.

2. Use Ctrl-X, then **Y** and **Enter** to save the file.

3. Use the following command to copy the **workflow.xml** file to **wasb:///tutorials/useoozie/workflow.xml**:

		hadoop fs -copyFromLocal workflow.xml wasb:///tutorials/useoozie/workflow.xml

##Create the database

The following steps create the Azure SQL Database that data will be exported to.

> [AZURE.IMPORTANT] Before performing these steps you must [install and configure the Azure CLI](xplat-cli.md). Installing the CLI and following the steps to create a database can be performed either from the HDInsight cluster or your local workstation.

1. Use the following command to create a new Azure SQL Database server:

        azure sql server create <adminLogin> <adminPassword> <region>

    For exmaple, `azure sql server create admin password "West US"`.

    When the command completes, you will receive a response similar to the following:

        info:    Executing command sql server create
        + Creating SQL Server
        data:    Server Name i1qwc540ts
        info:    sql server create command OK

    > [AZURE.IMPORTANT] Note the server name returned by this command (**i1qwc540ts** in the example above.) This is the short name of the SQL Database server that was created. The fully qualified domain name (FQDN) is **&lt;shortname&gt;.database.windows.net**. For the example above, the FQDN would be **i1qwc540ts.database.windows.net**.

2. Use the following command to create a database named **oozietest** on the SQL Database server:

        sql db create [options] <serverName> oozietest <adminLogin> <adminPassword>

    This will return an "OK" message when it completes.

	> [AZURE.NOTE] If you receive an error indicating that you do not have access, you may need to add the system's IP address to the SQL Database firewall using the following command:
    >
    > `sql firewallrule create [options] <serverName> <ruleName> <startIPAddress> <endIPAddress>`

###Create the table

> [AZURE.NOTE] There are many ways to connect to SQL Database to create a table. The following steps use [FreeTDS](http://www.freetds.org/) from the HDInsight cluster.

3. Use the following command to install FreeTDS on the HDInsight cluster:

        sudo apt-get --assume-yes install freetds-dev freetds-bin

4. Once FreeTDS has been installed, use the following command to connect to the SQL Database server you created previously:

        TDSVER=8.0 tsql -H <serverName>.database.windows.net -U <adminLogin> -P <adminPassword> -p 1433 -D oozietest

    You will receive output similar to the following:

        locale is "en_US.UTF-8"
        locale charset is "UTF-8"
        using default charset "UTF-8"
        Default database being set to oozietest
        1>

5. At the `1>` prompt, enter the following lines:

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
		[sessionpagevieworder] [bigint])
		GO
		CREATE CLUSTERED INDEX mobiledata_clustered_index on mobiledata(clientid)
		GO

    When the `GO` statement is entered, the previous statements will be evaluated. This will create a new table named **mobiledata**.

    Use the following to verify that the table has been created:

        SELECT * FROM information_schema.tables
        GO

    You should see output similar to the following:

        TABLE_CATALOG   TABLE_SCHEMA    TABLE_NAME      TABLE_TYPE
        oozietest       dbo     mobiledata      BASE TABLE

8. Enter `exit` at the `1>` prompt to exit the tsql utility.

##Create the job definition

The job definition describes where to find the workflow.xml, as well as other files used by the workflow (such as useooziewf.hql.) It also defines the values for properties used within the workflow and associated files.

1. Use the following command to get the full WASB address to default storage. This will be used in the configuration file in a moment:

		sed -n '/<name>fs.default/,/<\/value>/p' /etc/hadoop/conf/core-site.xml

	This should return information similar to the following:

		<name>fs.defaultFS</name>
		<value>wasb://mycontainer@mystorageaccount.blob.core.windows.net</value>

	Save the `wasb://mycontainer@mystorageaccount.blob.core.windows.net` value, as it will be used in the next steps.

1. Use the following to create the Oozie job definition configuration:

		nano job.xml

2. Once the nano editor opens, use the following as the contents of the file:

		<?xml version="1.0" encoding="UTF-8"?>
		<configuration>

		   <property>
		       <name>nameNode</name>
		       <value>wasb:///mycontainer@mystorageaccount.blob.core.windows.net</value>
		   </property>

		   <property>
		       <name>jobTracker</name>
		       <value>headnode0:8050</value>
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
		       <value>wasb:///tutorials/useoozie/useooziewf.hql</value>
		   </property>

		   <property>
		       <name>hiveTableName</name>
		       <value>androiddevices</value>
		   </property>

		   <property>
		       <name>hiveDataFolder</name>
		       <value>wasb:///tutorials/useoozie/data</value>
		   </property>

		   <property>
		       <name>devicePlatform</name>
		       <value>Android</value>
		   </property>

		   <property>
		       <name>sqlDatabaseConnectionString</name>
		       <value>&quot;jdbc:sqlserver://serverName.database.windows.net;user=adminLogin;password=adminPassword;database=oozietest&quot;</value>
		   </property>

		   <property>
		       <name>sqlDatabaseTableName</name>
		       <value>mobiledata</value>
		   </property>

		   <property>
		       <name>user.name</name>
		       <value>YourName</value>
		   </property>

		   <property>
		       <name>oozie.wf.application.path</name>
		       <value>wasb:///tutorials/useoozie</value>
		   </property>

		</configuration>

	Replace `wasb:///mycontainer@mystorageaccount.blob.core.windows.net` with the value you received in step 1.

	Replace **YourName** with your login name for the HDInsight cluster.

	Replace **serverName**, **adminLogin**, and **adminPassword** with the information for your Azure SQL Database.

	Most of the information in this file is used to populate the values used in the workflow.xml or ooziewf.hql files (such as ${nameNode}.)

	> [AZURE.NOTE] The **oozie.wf.application.path** entry defines where to find the workflow.xml file, which contains the workflow ran by this job.

2. Use Ctrl-X, then **Y** and **Enter** to save the file.

4. Append the following to the script. This script checks the Oozie web service status.

	    Write-Host "Checking Oozie server status..." -ForegroundColor Green
	    $clusterUriStatus = "https://$clusterName.azurehdinsight.net:443/oozie/v2/admin/status"
	    $response = Invoke-RestMethod -Method Get -Uri $clusterUriStatus -Credential $creds -OutVariable $OozieServerStatus

	    $jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
	    $oozieServerSatus = $jsonResponse[0].("systemMode")
	    Write-Host "Oozie server status is $oozieServerSatus..."

5. Append the following to the script. This part creates and starts an Oozie job:

	    # create Oozie job
	    Write-Host "Sending the following Payload to the cluster:" -ForegroundColor Green
	    Write-Host "`n--------`n$OoziePayload`n--------"
	    $clusterUriCreateJob = "https://$clusterName.azurehdinsight.net:443/oozie/v2/jobs"
	    $response = Invoke-RestMethod -Method Post -Uri $clusterUriCreateJob -Credential $creds -Body $OoziePayload -ContentType "application/xml" -OutVariable $OozieJobName #-debug

	    $jsonResponse = ConvertFrom-Json (ConvertTo-Json -InputObject $response)
	    $oozieJobId = $jsonResponse[0].("id")
	    Write-Host "Oozie job id is $oozieJobId..."

	    # start Oozie job
	    Write-Host "Starting the Oozie job $oozieJobId..." -ForegroundColor Green
	    $clusterUriStartJob = "https://$clusterName.azurehdinsight.net:443/oozie/v2/job/" + $oozieJobId + "?action=start"
	    $response = Invoke-RestMethod -Method Put -Uri $clusterUriStartJob -Credential $creds | Format-Table -HideTableHeaders #-debug

6. Append the following to the script. This script checks the Oozie job status.

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

	    Write-Host "$(Get-Date -format 'G'): $oozieJobId is in $JobStatus state!" -ForegroundColor Green

7. If your HDinsight cluster is version 2.1, replace "https://$clusterName.azurehdinsight.net:443/oozie/v2/" with "https://$clusterName.azurehdinsight.net:443/oozie/v1/". HDInsight cluster version 2.1 does not supports version 2 of the web services.

8. Click **Run Script** or press **F5** to run the script. The output will be similar to this:

	![Tutorial run workflow output][img-runworkflow-output]

8. Connect to your Azure SQL database to see the exported data.

**To check the job error log**

To troubleshoot a workflow, the Oozie log file can be found at
*C:\apps\dist\oozie-3.3.2.1.3.2.0-05\oozie-win-distro\logs\Oozie.log* or *C:\apps\dist\oozie-4.0.0.2.0.7.0-1528\oozie-win-distro\logs\Oozie.log* from the cluster head node. For information about RDP, see [Manage Hadoop clusters in HDInsight using the Azure Management Portal][hdinsight-admin-portal].

**To re-run the tutorial**

To re-run the workflow, you must delete the following:

- The Hive script output file
- The data in the log4jLogsCount table

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


##Next steps
In this tutorial, you learned how to define an Oozie workflow and how to run an Oozie job by using Windows PowerShell. To learn more, see the following articles:

- [Use time-based Oozie Coordinator with HDInsight][hdinsight-oozie-coordinator-time]
- [Get started using Hadoop with Hive in HDInsight to analyze mobile handset use][hdinsight-get-started]
- [Get started with the HDInsight Emulator][hdinsight-get-started-emulator]
- [Use Azure Blob storage with HDInsight][hdinsight-storage]
- [Administer HDInsight using PowerShell][hdinsight-admin-powershell]
- [Upload data for Hadoop jobs in HDInsight][hdinsight-upload-data]
- [Use Sqoop with Hadoop in HDInsight][hdinsight-use-sqoop]
- [Use Hive with Hadoop on HDInsight][hdinsight-use-hive]
- [Use Pig with Hadoop on HDInsight][hdinsight-use-pig]
- [Develop C# Hadoop streaming jobs for HDInsight][hdinsight-develop-streaming-jobs]
- [Develop Java MapReduce programs for HDInsight][hdinsight-develop-mapreduce]


[hdinsight-cmdlets-download]: http://go.microsoft.com/fwlink/?LinkID=325563



[azure-data-factory-pig-hive]: data-factory-pig-hive-activities.md
[hdinsight-oozie-coordinator-time]: hdinsight-use-oozie-coordinator-time.md
[hdinsight-versions]:  hdinsight-component-versioning.md
[hdinsight-storage]: hdinsight-use-blob-storage.md
[hdinsight-get-started]: hdinsight-get-started.md
[hdinsight-admin-portal]: hdinsight-administer-use-management-portal.md


[hdinsight-use-sqoop]: hdinsight-use-sqoop.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-storage]: hdinsight-use-blob-storage.md
[hdinsight-get-started-emulator]: hdinsight-get-started-emulator.md

[hdinsight-develop-streaming-jobs]: hdinsight-hadoop-develop-deploy-streaming-jobs.md
[hdinsight-develop-mapreduce]: hdinsight-develop-deploy-java-mapreduce.md

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
[powershell-script]: https://technet.microsoft.com/en-us/library/ee176961.aspx

[cindygross-hive-tables]: http://blogs.msdn.com/b/cindygross/archive/2013/02/06/hdinsight-hive-internal-and-external-tables-intro.aspx

[img-workflow-diagram]: ./media/hdinsight-use-oozie/HDI.UseOozie.Workflow.Diagram.png
[img-preparation-output]: ./media/hdinsight-use-oozie/HDI.UseOozie.Preparation.Output1.png
[img-runworkflow-output]: ./media/hdinsight-use-oozie/HDI.UseOozie.RunWF.Output.png

[technetwiki-hive-error]: http://social.technet.microsoft.com/wiki/contents/articles/23047.hdinsight-hive-error-unable-to-rename.aspx
