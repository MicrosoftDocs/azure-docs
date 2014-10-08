<properties urlDisplayName="Analyze flight delay data with Hadoop in HDInsight" pageTitle="Analyze flight delay data using Hadoop in HDInsight | Azure" metaKeywords="" description="Learn how to upload data to HDInsight, how to process the data using Hive, and how to export the results to SQL Database using Sqoop." metaCanonical="" services="hdinsight" documentationCenter="" title="Analyze flight delay data using Hadoop in HDInsight " authors="jgao" solutions="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="jgao" />

#Analyze flight delay data using Hadoop in HDInsight

Hive provides means of running Hadoop MapReduce jobs through an SQL-like scripting language, called *[HiveQL][hadoop-hiveql]*, which can be applied towards summarizing, querying, and analyzing large volumes of data. This tutorial shows you how to use Hive to calculate average delays at airports, and how to use Sqoop to export the results to an Azure SQL Database. 

One of the major benefits of HDInsight is the separation of data storage and compute. HDInsight use Azure Blob storage for data storage. A common HDInsight process can be broken into 3 parts:

1. Store data in Azure blob storage.  This can be a continuous process. For example, weather data, sensor data, web logs, and in this case, flight delays data are saved into blob storage.
2. Run jobs.  When it is time to process the data, you run a PowerShell script (or a client application) to provision an HDInsight cluster, run jobs, and delete the cluster.  The jobs save output data to Azure Blob storage. The output data retains even after the  the cluster is deleted. This way, you only pay for what you have consumed. 
3. Retrieve the output from blob storage, or in this case, export the data to an Azure SQL database.

The following diagram illustrate the scenario and the structure of this article:

![HDI.FlightDelays.flow][img-hdi-flightdelays-flow]


Note: The numbers in the diagram correspond to the section titles.


**Estimated time to complete:** 30 minutes

##In this tutorial

* [Prerequisites](#prerequisite)
* [Run an Hive job on a new or existing HDInsight cluster (M1)](#runjob)
* [Use Sqoop to export the output to Azure SQL Database (M2)](#exportdata)
* [Next steps](#nextsteps)
* [Appendix A: Upload flight delay data to Azure Blob storage (A1)](#appdendix-a)
* [Appendix B: Create and upload HiveQL script (A2)](#appendix-b)

##<a id="prerequisite"></a>Prerequisites

Before you begin this tutorial, you must have the following:

* A workstation with Azure PowerShell installed and configured. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].
* An Azure subscription. ***

**Understand HDInsight storage**

Hadoop clusters in HDInsight use Azure Blob storage for data storage.  It is called *WASB* or *Azure Storage - Blob*. WASB is Microsoft's implementation of *HDFS* on Azure Blob storage. For more information see [Use Azure Blob storage with HDInsight][hdinsight-storage]. 

When provisioning an HDInsight cluster, a Blob storage container of an Azure storage account is designated as the default file system, just like HDFS. This storage account is referred as the *default storage account*, and the Blob container is referred as the *default Blob container* or *default container*. The default storage account must co-locate in the same data center as the HDInsight cluster. Deleting an HDInsight cluster does not delete the default container or the default storage account.

In addition to the default storage account, other Azure storage accounts can be bound to an HDInsight cluster during the provision process. The binding is to add the storage account and storage account key to the configuration file. So the cluster can access those storage accounts at run-time. For instructions on adding additional storage accounts, see [Provision Hadoop clusters in HDInsight][hdinsight-provision]. 

The WASB syntax is:

	wasb[s]://<ContainerName>@<StorageAccountName>.blob.core.windows.net/<path>/<filename>

>[WACOM.NOTE] The WASB path is virtual path.  For more information see [Use Azure Blob storage with HDInsight][hdinsight-storage]. 

For files stored in the default container. it can be accessed from HDInsight using any of the following URIs (using flightdelays.hql as an example):

	wasb://mycontainer@mystorageaccount.blob.core.windows.net/tutorials/flightdelays/flightdelays.hql
	wasb:///tutorials/flightdelays/flightdelays.hql
	/tutorials/flightdelays/flightdelays.hql

To access the file directly from the storage account, the blob name for the file is:

	tutorials/flightdelays/flightdelays.hql

Notice there is no "/" in the front of the blob name.

**Files used in this tutorial**

The following table lists the files used in this tutorial:

<table border="1">
<tr><th>Files</th><th>Description</th></tr>
<tr><td>wasb://flightdelay@hditutorialdata.blob.core.windows.net/flightdelays.hql</td><td>The HiveQL script file needed by the Hive job that you will run.</td></tr>
<tr><td>wasb://flightdelay@hditutorialdata.blob.core.windows.net/2013Data</td><td>Input data for the Hive jobs.</td></tr>
<tr><td>\tutorials\flightdelays\output</td><td>Output path for the Hive job. The default container is used for storing the output data.</td></tr>
<tr><td>\tutorials\flightdelays\jobstatus</td><td>The Hive job status folder</td></tr>
</table>

This tutorial uses the on-time performance of airline flights data from [Research and Innovative Technology Administration, Bureau of Transportation Statistics][rita-website] (RITA). The data has been uploaded to an Azure Blob storage container with the Public Blob access permission. Because it is a public blob container, you do not need to bind this storage account to the HDInsight cluster. The HiveQL script is also uploaded to the same Blob container. If you want to learn how to get/upload the data to your own storage account, and how to create/upload the HiveQL script file, see the [appendix](#appendix).

**Understand Hive internal table and external table**

There are a few things you need to know about Hive internal table and external table:

- The CREATE TABLE command creates an internal table. The data file must be located in the default container.
- The CREATE TABLE command moves the data file to the /hive/warehouse/<TableName> folder.
- The CREATE EXTERNAL TABLE command creates an external table. The data file can be located outside the default container.
- The CREATE EXTERNAL TABLE command does not move the data file.
- The CREATE EXTERNAL TABLE command doesn't allow any folders in the LOCATION. This is the reason why the tutorial makes a copy of the sample.log file.

For more information, see [HDInsight: Hive Internal and External Tables Intro][cindygross-hive-tables].

> [WACOM.NOTE] One of the HiveQL statements creates an Hive external table. Hive external table keeps the data file in the original location. Hive internal table moves the data file to hive\warehouse. Hive internal table requires the data file to be located in the default container. For data stored outside default Blob container, you must use Hive external tables.









##<a id="runjob"></a>Run the Hive job on a new or existing HDInsight cluster 

Hadoop is batch processing. The most cost-effective way to run an Hive job is to provision a cluster for the job, and delete the job after the job is completed. The following script covers the whole process. For more information on provision HDInsight cluster and running Hive jobs, see [Provision Hadoop clusters in HDInsight][hdinsight-provision] and  [Use Hive with HDInsight][hdinsight-use-hive]. 

**To run the Hive queries using PowerShell**

1. Open PowerShell ISE.
2. Copy and paste the following script into the script pane:

		*** add script here


4. Press **F5** to run the script. The output shall be similar to:

	![HDI.FlightDelays.RunHiveJob.output][img-hdi-flightdelays-run-hive-job-output]
	
	Between each city and delay time, there is a delimiter that is not visible in the PowerShell output window. It is "\001". You will use this delimiter when you run Sqoop export.

		
##<a id="exportdata"></a>Export the Hive job output to Azure SQL Database
The last steps is to run Sqoop export to export the data to SQL Database. You have create the SQL Database and the AvgDelays table earlier in the tutorial.

**To export data to SQL Database**

1. Open Azure PowerShell.
2. Run the following command to connect to your Azure subscription:

		Add-AzureAccount

3. Set the first five variables, and then run the commands:

		$clusterName = "<HDInsightClusterName>"
		
		$sqlDatabaseServerName = "<SQLDatabaseServerName>"
		$sqlDatabaseUserName = "<SQLDatabaseUsername>"
		$sqlDatabasePassword = "<SQLDatabasePassword>"
		
		$sqlDatabaseName = "<SQLDatabaseName>" # The default name is "HDISqoop"
		$sqlDatabaseTableName = "AvgDelays" 

		$exportDir = "wasb://$containerName@$storageAccountName.blob.core.windows.net/tutorials/flightdelays/output"
		
		$sqlDatabaseConnectionString = "jdbc:sqlserver://$sqlDatabaseServerName.database.windows.net;user=$sqlDatabaseUserName@$sqlDatabaseServerName;password=$sqlDatabasePassword;database=$sqlDatabaseName"

	These are the variables and their description:
	<table border="1">
	<tr><td><strong>Variable Name</strong></td><td><strong>Note</strong></td></tr>
	<tr><td>$clusterName</td><td>HDInsight cluster name.</td></tr>
	<tr><td>$sqlDatabaseServer</td><td>The SQL Database server where Sqoop will export data to.</td></tr>
	<tr><td>$sqlDatabaseUsername</td><td>SQL Database username.</td></tr>
	<tr><td>$sqlDatabasePassword</td><td>SQL Database user password.</td></tr>
	<tr><td>$sqlDatabaseName</td><td>The SQL Database where Sqoop will export data to. The default name is *HDISqoop". </td></tr>
	<tr><td>$sqlDatabaseTableName</td><td>SQL Database where Sqoop will export data to. The default name is AvgDelays. This is the table you created earlier in the tutorial.</td></tr>
	<tr><td>$exportDir</td><td>This is the Hive output file location. Sqoop will export the files in this location to SQL Database.</td></tr>
	</table>
	
4. Run the following command to export data:

		$sqoopDef = New-AzureHDInsightSqoopJobDefinition -Command "export --connect $sqlDatabaseConnectionString --table $sqlDatabaseTableName --export-dir $exportDir --fields-terminated-by \001 "
		
		$sqoopJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $sqoopDef #-Debug -Verbose
		Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600 -Job $sqoopJob
		
		Write-Host "Standard Error" -BackgroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $sqoopJob.JobId -StandardError
		Write-Host "Standard Output" -BackgroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $sqoopJob.JobId -StandardOutput
		
5. Connect to your SQL Database and see average flight delays by city in the *AvgDelays* table:

	![HDI.FlightDelays.AvgDelays.Dataset][image-hdi-flightdelays-avgdelays-dataset]


##<a id="nextsteps"></a> Next steps
Now that you understand how to upload file to Blob storage, how to populate a Hive table using the data from Blob storage, how to run Hive queries, and how to use Sqoop to export data from HDFS to Azure SQL Database. To learn more, see the following articles:

* [Getting Started with HDInsight][hdinsight-get-started]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Oozie with HDInsight][hdinsight-use-oozie]
* [Use Sqoop with HDInsight][hdinsight-use-sqoop]
* [Use Pig with HDInsight][hdinsight-use-pig]
* [Develop Java MapReduce programs for HDInsight][hdinsight-develop-mapreduce]
* [Develop C# Hadoop streaming programs for HDInsight][hdinsight-develop-streaming]



##<a id="appendix-a"></a>Appendix A - Upload flight delay data to Azure Blob storage

**To download the flight data**

1. Browse to [Research and Innovative Technology Administration, Bureau of Transportation Statistics][rita-website] (RITA).
2. On the page, select the following values:

	<table border="1">
	<tr><th>Name</th><th>Value</th></tr>
	<tr><td>Filter Year</td><td>2013 </td></tr>
	<tr><td>Filter Period</td><td>January</td></tr>
	<tr><td>Fields:</td><td>*Year*, *FlightDate*, *UniqueCarrier*, *Carrier*, *FlightNum*, *OriginAirportID*, *Origin*, *OriginCityName*, *OriginState*, *DestAirportID*, *Dest*, *DestCityName*, *DestState*, *DepDelayMinutes*, *ArrDelay*, *ArrDelayMinutes*, *CarrierDelay*, *WeatherDelay*, *NASDelay*, *SecurityDelay*, *LateAircraftDelay* (clear all other fields)</td></tr>
	</table>

3. Click **Download**. 
4. Unzip the file to the **C:\Tutorials\FlightDelays\Data** folder.  Each file is a CSV file and is approximately 60 GB in size.
5.	Rename the file to the name of the month that it contains data for. For example, the file containing the January data would be named *January.csv*.
6. Repeat step 2 and 5 to download a file for each of the 12 months in 2013. You will need minimum one file to run the tutorial.  

**To upload the flight delay data to Azure Blob storage**

1. Open PowerShell ISE.
2. Paste the following script into the script pane:

		[CmdletBinding()]
		Param(
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure storage account name for creating a new HDInsight cluster. If the account doesn't exist, the script will create one.")]
		    [String]$storageAccountName,
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure blob container name for creating a new HDInsight cluster. If not specified, the HDInsight cluster name will be used.")]
		    [String]$blobContainerName
		)
		
		#Region - Variables
		$localFolder = "C:\Tutorials\FlightDelays\2014Data"  # the source folder
		$destFolder = "tutorials/flightdelays/data"     #the blob name prefix for the files to be uploaded
		#EndRegion
		
		#Region - Connect to Azure subscription
		Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
		if (-not (Get-AzureAccount)){ Add-AzureAccount}
		#EndRegion
		
		#Region - Validate user inpute
		# Validate the storage account
		if (-not (Get-AzureStorageAccount|Where-Object{$_.Label -eq $storageAccountName}))
		{
		    Write-Host "The storage account, $storageAccountName, doesn't exist." -ForegroundColor Red
		    exit
		}
		
		# Validate the container
		$storageAccountKey = get-azurestoragekey -StorageAccountName $storageAccountName | %{$_.Primary}
		$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
		
		if (-not (Get-AzureStorageContainer -Context $storageContext |Where-Object{$_.Name -eq $blobContainerName}))
		{
		    Write-Host "The Blob container, $blobContainerName, doesn't exist" -ForegroundColor Red
		    Exit
		}
		#EngRegion
		
		#Region - Copy the file from local workstation to Azure Blob storage  
		if (test-path -Path $localFolder)
		{
		    foreach ($item in Get-ChildItem -Path $localFolder){
		        $fileName = "$localFolder\$item"
		        $blobName = "$destFolder/$item"
		
		        Write-Host "Copying $fileName to $blobName" -ForegroundColor Green
		
		        Set-AzureStorageBlobContent -File $fileName -Container $blobContainerName -Blob $blobName -Context $storageContext
		    }
		}
		else
		{
		    Write-Host "The source folder on the workstation doesn't exist" -ForegroundColor Red
		}
		
		# List the uploaded files on HDinsight
		Get-AzureStorageBlob -Container $blobContainerName  -Context $storageContext -Prefix $destFolder
		#EndRegion

3. Press **F5** to run the script.


##<a id="appendix-b"></a>Appendix B - Create and upload HiveQL script

Using Azure PowerShell, you can run multiple HiveQL statements one at a time, or package the HiveQL statement into a script file. The section shows you how to create a HiveQL script and upload the script to Azure Blob storage using PowerShell. Hive requires the HiveQL scripts to be stored on WASB.

The HiveQL script will perform the following:

1. **Drop the delays_raw table**, in case the table already exists.
2. **Create the delays_raw external Hive table** pointing to the WASB location with the flight delay files. This query specifies that fields are delimited by "," and that lines are terminated by "\n". This poses a problem when field values *contain* commas because Hive cannot differentiate between a comma that is a field delimiter and a one that is part of a field value (which is the case in field values for ORIGIN\_CITY\_NAME and DEST\_CITY\_NAME). To address this, the query creates TEMP columns to hold data that is incorrectly split into columns.  
3. **Drop the delays table**, in case the table already exists;
4. **Create the delays table**. It is helpful to clean up the data before further processing. This query creates a new table, *delays* from the *delays_raw* table. Note that the TEMP columns (as mentioned previously) are not copied, and that the *substring* function is used to remove quotation marks from the data. 
5. **Computes the average weather delay and groups the results by city name.** It will also output the results to WASB. Note that the query will remove apostrophes from the data and will exclude rows where the value for *weather_deal*y is *null*, which is necessary because Sqoop, used later in this tutorial, doesn't handle those values gracefully by default.

For a full list of the HiveQL commands, see [Hive Data Definition Language][hadoop-hiveql]. Each HiveQL command must terminate with a semicolon.

**To create an HiveQL script file**

1. Open Azure PowerShell ISE.
2. Copy and paste the following script into the script pane:

		[CmdletBinding()]
		Param(
		
		    # Azure blob storage variables
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the HDInsight cluster name.")]
		    [String]$HDInsightClusterName
		)
		
		#--------------------------------------------------------------------
		# Constants used in the script
		#--------------------------------------------------------------------
		# the HQL script file is exported as this file before uploaded to WASB
		$hqlLocalFileName = "C:\tutorials\flightdelays\flightdelays.hql" 
		# the HQL script file will be upload to WASB as this blob name
		$hqlBlobName = "tutorials/flightdelays/flightdelays.hql" 
		
		# this two constants are used by the HQL scrpit file
		$srcDataFolder = "tutorials/flightdelays/data" 
		$dstDataFolder = "tutorials/flightdelays/output"
		
		#--------------------------------------------------------------------
		# Validate the file and file path
		#--------------------------------------------------------------------
		
		# check if a file with the same file name already exist on the workstation
		Write-Host "`nvalidating the folder structure on the workstation for saving the HQL script file ..."  -ForegroundColor Green
		if (test-path $hqlLocalFileName){
		
		    $yes = New-Object System.Management.Automation.Host.ChoiceDescription "&Yes", `
		        "Overwrite the existing file."
		
		    $no = New-Object System.Management.Automation.Host.ChoiceDescription "&No", `
		        "Not overwrite the existing file."
		
		    $options = [System.Management.Automation.Host.ChoiceDescription[]]($yes, $no)
		
		    $result = $Host.UI.PromptForChoice("Write file", 
		                                        "Overwrite the existing script file, 
		                                        $hqlLocalFileName?", 
		                                        $options, 
		                                        0)
		
		    switch ($result)
		    {
		    0 {
		        # create the folder if it doesn't exist
		        $folder = split-path $hqlLocalFileName
		        if (-not (test-path $folder))
		        {
		            Write-Host "`nCreating folder, $folder ..." -ForegroundColor Green
		
		            new-item $folder -ItemType directory  
		        }
		    }
		    1 { throw "User cancelled the operation."}
		    }
		}
		
		#--------------------------------------------------------------------
		# Add the Azure account 
		#--------------------------------------------------------------------
		Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
		Add-AzureAccount
		
		
		#--------------------------------------------------------------------
		# Retrieve the default storage account and the default container name
		#--------------------------------------------------------------------
		Write-Host "`nRetrieving the HDInsight cluster default storage account information ..." `
		            -ForegroundColor Green
		
		$hdi = Get-AzureHDInsightCluster -Name $HDInsightClusterName
		
		if (-not $hdi){
		    throw "The HDInsight cluster, $HDInsightClusterName, doesn't exist!" 
		}
		else{
		    $storageAccountName = $hdi.DefaultStorageAccount.StorageAccountName `
		                            -replace ".blob.core.windows.net"
		    $containerName = $hdi.DefaultStorageAccount.StorageContainerName
		
		    Write-Host "`tThe default storage account for the cluster is $storageAccountName." `
		                -ForegroundColor Cyan
		    Write-host "`tThe default Blob container for the cluster is $containerName." `
		                -ForegroundColor Cyan
		}
		
		#--------------------------------------------------------------------
		# Write the Hive script into a local file
		#--------------------------------------------------------------------
		Write-Host "Writing the Hive script into a file on your workstation ..." `
		            -ForegroundColor Green
		
		$hqlDropDelaysRaw = "DROP TABLE delays_raw;"
		
		$hqlCreateDelaysRaw = "CREATE EXTERNAL TABLE delays_raw (" +
		        "YEAR string, " +
		        "FL_DATE string, " +
		        "UNIQUE_CARRIER string, " +
		        "CARRIER string, " +
		        "FL_NUM string, " +
		        "ORIGIN_AIRPORT_ID string, " +
		        "ORIGIN string, " +
		        "ORIGIN_CITY_NAME string, " +
		        "ORIGIN_CITY_NAME_TEMP string, " +
		        "ORIGIN_STATE_ABR string, " +
		        "DEST_AIRPORT_ID string, " +
		        "DEST string, " +
		        "DEST_CITY_NAME string, " +
		        "DEST_CITY_NAME_TEMP string, " +
		        "DEST_STATE_ABR string, " +
		        "DEP_DELAY_NEW float, " +
		        "ARR_DELAY_NEW float, " +
		        "CARRIER_DELAY float, " +
		        "WEATHER_DELAY float, " +
		        "NAS_DELAY float, " +
		        "SECURITY_DELAY float, " +
		        "LATE_AIRCRAFT_DELAY float) " +
		    "ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' " +
		    "LINES TERMINATED BY '\n' " +
		    "STORED AS TEXTFILE " +
		    "LOCATION 'wasb://$containerName@$storageAccountName.blob.core.windows.net/$srcDataFolder';" 
		
		$hqlDropDelays = "DROP TABLE delays;"
		
		$hqlCreateDelays = "CREATE TABLE delays AS " +
		    "SELECT YEAR AS year, " +
		        "FL_DATE AS flight_date, " +
		        "substring(UNIQUE_CARRIER, 2, length(UNIQUE_CARRIER) -1) AS unique_carrier, " +
		        "substring(CARRIER, 2, length(CARRIER) -1) AS carrier, " +
		        "substring(FL_NUM, 2, length(FL_NUM) -1) AS flight_num, " +
		        "ORIGIN_AIRPORT_ID AS origin_airport_id, " +
		        "substring(ORIGIN, 2, length(ORIGIN) -1) AS origin_airport_code, " +
		        "substring(ORIGIN_CITY_NAME, 2) AS origin_city_name, " +
		        "substring(ORIGIN_STATE_ABR, 2, length(ORIGIN_STATE_ABR) -1)  AS origin_state_abr, " +
		        "DEST_AIRPORT_ID AS dest_airport_id, " +
		        "substring(DEST, 2, length(DEST) -1) AS dest_airport_code, " +
		        "substring(DEST_CITY_NAME,2) AS dest_city_name, " +
		        "substring(DEST_STATE_ABR, 2, length(DEST_STATE_ABR) -1) AS dest_state_abr, " +
		        "DEP_DELAY_NEW AS dep_delay_new, " +
		        "ARR_DELAY_NEW AS arr_delay_new, " +
		        "CARRIER_DELAY AS carrier_delay, " +
		        "WEATHER_DELAY AS weather_delay, " +
		        "NAS_DELAY AS nas_delay, " +
		        "SECURITY_DELAY AS security_delay, " +
		        "LATE_AIRCRAFT_DELAY AS late_aircraft_delay " +
		    "FROM delays_raw;" 
		
		$hqlInsertLocal = "INSERT OVERWRITE DIRECTORY 'wasb://$containerName@$storageAccountName.blob.core.windows.net/$dstDataFolder' " +
		    "SELECT regexp_replace(origin_city_name, '''', ''), " +
		        "avg(weather_delay) " +
		    "FROM delays " +
		    "WHERE weather_delay IS NOT NULL " +
		    "GROUP BY origin_city_name;"
		
		$hqlScript = $hqlDropDelaysRaw + $hqlCreateDelaysRaw + $hqlDropDelays + $hqlCreateDelays + $hqlInsertLocal
		
		$hqlScript | Out-File $hqlLocalFileName -Encoding ascii -Force 
		
		#--------------------------------------------------------------------
		# Upload the Hive script to the default Blob container
		#--------------------------------------------------------------------
		Write-Host "Uploading the Hive script to the default Blob container ..." -ForegroundColor Green
		
		# Create a storage context object
		$storageaccountkey = get-azurestoragekey $storageAccountName | %{$_.Primary}
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageaccountkey
		
		# Upload the file from local workstation to WASB
		Set-AzureStorageBlobContent -File $hqlLocalFileName -Container $containerName -Blob $hqlBlobName -Context $destContext 
		
		Write-host "`nEnd of the PowerShell script" -ForegroundColor Green


	Here are the constants used in the script:

	- **$hqlLocalFileName**: The script saves the HiveQL script file locally before uploading it to WASB. This is the file name. The default values is <u>C:\tutorials\flightdelays\flightdelays.hql</u>.
	- **$hqlBlobName**: This is the HiveQL script file blob name used in the Azure Blob storage. The default values is <u>tutorials/flightdelays/flightdelays.hql</u>. Because the file will be written directly to Azure Blob storage, there is NOT a "/" at the beginning of the blob name. If you want to access the file from WASB, you will need to add a "/" at the beginning of the file name.
	- **$srcDataFolder** and **$dstDataFolder**:  = "tutorials/flightdelays/data" 
 = "tutorials/flightdelays/output"



2. Run the following command to connect to your Azure subscription:

		Add-AzureAccount

2. Set the first two variables, and then run the commands.

		$storageAccountName = "<AzureStorageAccountName>"
		$containerName ="<BlobStorageContainerName>"

		$hqlLocalFileName = "C:\tutorials\flightdelays\flightdelays.hql"  
		$hqlBlobName = "tutorials/flightdelays/flightdelays.hql" 
		
		$srcDataFolder = "tutorials/flightdelays/data" 
		$dstDataFolder = "tutorials/flightdelays/output"


	These are the variables and their description: 
	<table border="1">
	<tr><td><strong>Variable Name</strong></td><td><strong>Description</strong></td></tr>
	<tr><td>$storageAccountName</td><td>The Azure Storage account used for storing the HiveQL script file. The PowerShell scripts provided in this tutorial require both the flight data files and the script file located in the same Azure Storage account and Blob storage container.</td></tr>
	<tr><td>$containerName</td><td>The Azure Blob storage container used for storing the HiveQL script file. The PowerShell scripts provided in this tutorial require both the flight data files and the script file located in the same Azure Storage account and Blob storage container.</td></tr>
	<tr><td>$hqlLocalFileName</td><td>The local files name for the HiveQL script before it is upload to WASB. To simplify the PowerShell script, you will write the file locally and then use the Set-AzureStorageBlobContent cmdlet to upload the script file to HDInsight.</td></tr>
	<tr><td>$hqlBlobName</td><td>This is the script file name with path on WASB</td></tr>
	<tr><td>$srcDataFolder</td><td>This is the folder on WASB where the HiveQL script pulls data from.</td></tr>
	<tr><td>$dstDataFolder </td><td>This is the folder on WASB where the HiveQL script sends the output to. Later in the tutorial, you will use Sqoop to export the data on this folder to Azure SQL Database.</td></tr>
	</table>

3. Run the following commands to define the HiveQL statements:
		
		$hqlDropDelaysRaw = "DROP TABLE delays_raw;"
		
		$hqlCreateDelaysRaw = "CREATE EXTERNAL TABLE delays_raw (" +
				"YEAR string, " +
				"FL_DATE string, " +
				"UNIQUE_CARRIER string, " +
				"CARRIER string, " +
				"FL_NUM string, " +
				"ORIGIN_AIRPORT_ID string, " +
				"ORIGIN string, " +
				"ORIGIN_CITY_NAME string, " +
				"ORIGIN_CITY_NAME_TEMP string, " +
				"ORIGIN_STATE_ABR string, " +
				"DEST_AIRPORT_ID string, " +
				"DEST string, " +
				"DEST_CITY_NAME string, " +
				"DEST_CITY_NAME_TEMP string, " +
				"DEST_STATE_ABR string, " +
				"DEP_DELAY_NEW float, " +
				"ARR_DELAY_NEW float, " +
				"CARRIER_DELAY float, " +
				"WEATHER_DELAY float, " +
				"NAS_DELAY float, " +
				"SECURITY_DELAY float, " +
				"LATE_AIRCRAFT_DELAY float) " +
			"ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' " +
			"LINES TERMINATED BY '\n' " +
			"STORED AS TEXTFILE " +
			"LOCATION 'wasb://$containerName@$storageAccountName.blob.core.windows.net/$srcDataFolder';" 
		
		$hqlDropDelays = "DROP TABLE delays;"
		
		$hqlCreateDelays = "CREATE TABLE delays AS " +
			"SELECT YEAR AS year, " +
				"FL_DATE AS flight_date, " +
				"substring(UNIQUE_CARRIER, 2, length(UNIQUE_CARRIER) -1) AS unique_carrier, " +
				"substring(CARRIER, 2, length(CARRIER) -1) AS carrier, " +
				"substring(FL_NUM, 2, length(FL_NUM) -1) AS flight_num, " +
				"ORIGIN_AIRPORT_ID AS origin_airport_id, " +
				"substring(ORIGIN, 2, length(ORIGIN) -1) AS origin_airport_code, " +
				"substring(ORIGIN_CITY_NAME, 2) AS origin_city_name, " +
				"substring(ORIGIN_STATE_ABR, 2, length(ORIGIN_STATE_ABR) -1)  AS origin_state_abr, " +
				"DEST_AIRPORT_ID AS dest_airport_id, " +
				"substring(DEST, 2, length(DEST) -1) AS dest_airport_code, " +
				"substring(DEST_CITY_NAME,2) AS dest_city_name, " +
				"substring(DEST_STATE_ABR, 2, length(DEST_STATE_ABR) -1) AS dest_state_abr, " +
				"DEP_DELAY_NEW AS dep_delay_new, " +
				"ARR_DELAY_NEW AS arr_delay_new, " +
				"CARRIER_DELAY AS carrier_delay, " +
				"WEATHER_DELAY AS weather_delay, " +
				"NAS_DELAY AS nas_delay, " +
				"SECURITY_DELAY AS security_delay, " +
				"LATE_AIRCRAFT_DELAY AS late_aircraft_delay " +
			"FROM delays_raw;" 
		
		$hqlInsertLocal = "INSERT OVERWRITE DIRECTORY 'wasb://$containerName@$storageAccountName.blob.core.windows.net/$dstDataFolder' " +
			"SELECT regexp_replace(origin_city_name, '''', ''), " +
		        "avg(weather_delay) " +
			"FROM delays " +
			"WHERE weather_delay IS NOT NULL " +
			"GROUP BY origin_city_name;"
		
		$hqlScript = $hqlDropDelaysRaw + $hqlCreateDelaysRaw + $hqlDropDelays + $hqlCreateDelays + $hqlInsertLocal

4. Run the following commands to write the Hive script file to workstation and upload it to WASB:

		# Write the Hive script into a local file
		$hqlScript | Out-File $hqlLocalFileName -Encoding ascii
		
		# Create a storage context object
		$storageaccountkey = get-azurestoragekey $storageAccountName | %{$_.Primary}
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageaccountkey
		
		# Copy the file from local workstation to WASB
		Set-AzureStorageBlobContent -File $hqlLocalFileName -Container $containerName -Blob $hqlBlobName -Context $destContext
		
		# List the script file from WASB
		Get-AzureStorageBlob -Container $containerName  -Context $destContext -Prefix $hqlBlobName

	The output shall be similar to :
				
		Container Uri: https://xxxxxxxx.blob.core.windows.net/hdi0212v3
		
		Name                              BlobType   Length                            ContentType                       LastModified                      SnapshotTime
		----                              --------   ------                            -----------                       ------------                      ------------
		tutorials/flightdelays/flightd... BlockBlob  1938                              application/octet-stream          2/12/2014 9:57:28 PM +00:00











## prepare SQL database
**To prepare the SQL database (merge this with the Sqoop script)**

1. Open PowerShell ISE. 
2. Copy and paste the following script into the script pane:
	
		[CmdletBinding()]
		Param(
		
		    # SQL database server variables
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure SQL Database Server Name to use an existing one. Enter nothing to create a new one.")]
		    [AllowEmptyString()]
		    [String]$sqlDatabaseServer,  # specify the Azure SQL database server name if you have one created. Otherwise use "".
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure SQL Database admin user.")]
		    [String]$sqlDatabaseUsername,
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure SQL Database admin user password.")]
		    [String]$sqlDatabasePassword,
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the region to create the Database in.")]
		    [String]$sqlDatabaseLocation,   #For example, West US.
		
		    # SQL database variables
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the database name if you have created one. Enter nothing to create one.")]
		    [AllowEmptyString()]
		    [String]$sqlDatabaseName # specify the database name if you have one created.  Otherwise use "" to have the script create one for you.
		)
		
		#--------------------------------------------------------------------
		# Constants used in the script
		#--------------------------------------------------------------------
		# IP address REST service used for retrieving external IP address and creating firewall rules
		[String]$ipAddressRestService = "http://bot.whatismyipaddress.com"
		[String]$fireWallRuleName = "FlightDelay"
		
		# SQL database variables
		[String]$sqlDatabaseMaxSizeGB = 10
		
		#SQL query string for creating AvgDelays table
		[String]$sqlDatabaseTableName = "AvgDelays"
		[String]$sqlCreateAvgDelaysTable = " CREATE TABLE [dbo].[$sqlDatabaseTableName](
		            [origin_city_name] [nvarchar](50) NOT NULL,
		            [weather_delay] float,
		        CONSTRAINT [PK_$sqlDatabaseTableName] PRIMARY KEY CLUSTERED   
		        (
		            [origin_city_name] ASC
		        )
		        )"

		#--------------------------------------------------------------------
		# Add the Azure account 
		#--------------------------------------------------------------------
		Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
		Add-AzureAccount
		
		#--------------------------------------------------------------------
		# Create and validate Azure SQL Database server
		#--------------------------------------------------------------------
		if ([string]::IsNullOrEmpty($sqlDatabaseServer))
		{
			Write-Host "`nCreating SQL Database server ..."  -ForegroundColor Green
			$sqlDatabaseServer = (New-AzureSqlDatabaseServer -AdministratorLogin $sqlDatabaseUsername -AdministratorLoginPassword $sqlDatabasePassword -Location $sqlDatabaseLocation).ServerName
		    Write-Host "`tThe new SQL database server name is $sqlDatabaseServer." -ForegroundColor Cyan
		
		    Write-Host "`nCreating firewall rule, $fireWallRuleName ..." -ForegroundColor Green
		    $workstationIPAddress = Invoke-RestMethod $ipAddressRestService
		    New-AzureSqlDatabaseServerFirewallRule -ServerName $sqlDatabaseServer -RuleName "$fireWallRuleName-workstation" -StartIpAddress $workstationIPAddress -EndIpAddress $workstationIPAddress	
		    New-AzureSqlDatabaseServerFirewallRule -ServerName $sqlDatabaseServer -RuleName "$fireWallRuleName-Azureservices" -AllowAllAzureServices 
		}
		else
		{
		    $dbServer = Get-AzureSqlDatabaseServer -ServerName $sqlDatabaseServer
		    if (! $dbServer)
		    {
		        throw "The Azure SQL database server, $sqlDatabaseServer, doesn't exist!" 
		    }
		    else
		    {
			    Write-Host "`nUse an existing SQL Database server, $sqlDatabaseServer" -ForegroundColor Green
		    }
		}
		
		#--------------------------------------------------------------------
		# Create and validate Azure SQL database
		#--------------------------------------------------------------------	
		if ([string]::IsNullOrEmpty($sqlDatabaseName))
		{
			Write-Host "`nCreating SQL Database, HDISqoop ..."  -ForegroundColor Green
		
			$sqlDatabaseName = "HDISqoop"
			$sqlDatabaseServerCredential = new-object System.Management.Automation.PSCredential($sqlDatabaseUsername, ($sqlDatabasePassword  | ConvertTo-SecureString -asPlainText -Force)) 
		
		    $sqlDatabaseServerConnectionContext = New-AzureSqlDatabaseServerContext -ServerName $sqlDatabaseServer -Credential $sqlDatabaseServerCredential 
			
			$sqlDatabase = New-AzureSqlDatabase -ConnectionContext $sqlDatabaseServerConnectionContext -DatabaseName $sqlDatabaseName -MaxSizeGB $sqlDatabaseMaxSizeGB
		}
		else
		{
		    $db = Get-AzureSqlDatabase -ServerName $sqlDatabaseServer -DatabaseName $sqlDatabaseName
		    if (! $db)
		    {
		        throw "The Azure SQL database server, $sqlDatabaseServer, doesn't exist!" 
		    }
		    else
		    {
			    Write-Host "`nUse an existing SQL Database, $sqlDatabaseName" -ForegroundColor Green
		    }
		}
			
		#--------------------------------------------------------------------
		# Excute a SQL command to create the AvgDelays table
		#--------------------------------------------------------------------	
		Write-Host "`nCreating SQL Database table ..."  -ForegroundColor Green
		$conn = New-Object System.Data.SqlClient.SqlConnection
		$conn.ConnectionString = "Data Source=$sqlDatabaseServer.database.windows.net;Initial Catalog=$sqlDatabaseName;User ID=$sqlDatabaseUsername;Password=$sqlDatabasePassword;Encrypt=true;Trusted_Connection=false;"
		$conn.open()
		$cmd = New-Object System.Data.SqlClient.SqlCommand
		$cmd.connection = $conn
		$cmd.commandtext = $sqlCreateAvgDelaysTable
		$cmd.executenonquery()
			
		$conn.close()
		
		Write-host "`nEnd of the PowerShell script" -ForegroundColor Green


	> WACOM.NOTE The script uses a REST service, http://bot.whatismyipaddress.com, to retrieve your external IP address. The IP address is used for creating a firewall rule for your SQL Database server.  

	Here are some constants used in the script:

	- **$ipAddressRestService**: The default value is <u>http://bot.whatismyipaddress.com</u>. It is a public IP address Rest service for getting your external IP address. You can use other services if you want. The external IP address retrieved using the service will be used to create a firewall rule for your Azure SQL database server, so that you can access the database from your workstation (using PowerShell script).
	- **$fireWallRuleName**: This is the Azure SQL database server firewall rule name. The default name is <u>FlightDelay</u>. You can rename it if you want.
	- **$sqlDatabaseMaxSizeGB**: This value is only used when creating a new Azure SQL database server. The default value is <u>10GB</u>. 10GB is sufficient for this tutorial.
	- **$sqlDatabaseName**: This value is used only when creating a new Azure SQL database. The default value is <u>HDISqoop</u>. If you rename it, you must update the Sqoop PowerShell script accordingly. 

4. Press **F5** to run the script. You need to enter your Azure subscription credentials and the following values:

	- **sqlDatabaseServer**: Enter the Azure SQL database server name where you want to export the Hive output to. Enter nothing to create one.
	- **sqlDatabaseUsername**: Enter the database login. You must specify it either you want to create a new database server or use an existing one. 
	- **sqlDatabasePassword**: Enter the database login password. You must specify it either you want to create a new database server or use an existing one. 
	- **sqlDatabaseLocation**: Enter the region.  This is used only when you want to create a new database server. 
	- **sqlDatabaseName**: Enter the Azure SQL database name. Enter nothing to create a new one. The default database name is **HDISqoop**.

5. Validate the script output. Make sure the script ran successfully.	



If you choose to use a different method for uploading the files, please make sure the file path is *tutorials/flightdelays/data*. The syntax for accessing the files is:

	wasb://<ContainerName>@<StorageAccountName>.blob.core.windows.net/tutorials/flightdelays/data

*tutorials/flightdelays/data* is the virtual folder you created when you uploaded the files. Verify that there are 12 files, one for each month.


[rita-website]: http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time
[cindygross-hive-tables]: http://blogs.msdn.com/b/cindygross/archive/2013/02/06/hdinsight-hive-internal-and-external-tables-intro.aspx
[Powershell-install-configure]: ../install-configure-powershell/

[hdinsight-use-oozie]: ../hdinsight-use-oozie/
[hdinsight-use-hive]: ../hdinsight-use-hive/
[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-upload-data]: ../hdinsight-upload-data/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-use-sqoop]: ../hdinsight-use-sqoop/
[hdinsight-use-pig]: ../hdinsight-use-pig/
[hdinsight-develop-streaming]: ../hdinsight-hadoop-develop-deploy-streaming-jobs/
[hdinsight-develop-mapreduce]: ../hdinsight-develop-deploy-java-mapreduce/

[hadoop-hiveql]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL
[hadoop-shell-commands]: http://hadoop.apache.org/docs/r0.18.3/hdfs_shell.html

[technetwiki-hive-error]: http://social.technet.microsoft.com/wiki/contents/articles/23047.hdinsight-hive-error-unable-to-rename.aspx

[image-hdi-flightdelays-avgdelays-dataset]: ./media/hdinsight-analyze-flight-delay-data/HDI.FlightDelays.AvgDelays.DataSet.png
[img-hdi-flightdelays-run-hive-job-output]: ./media/hdinsight-analyze-flight-delay-data/HDI.FlightDelays.RunHiveJob.Output.png
[img-hdi-flightdelays-flow]: ./media/hdinsight-analyze-flight-delay-data/HDI.FlightDelays.Flow.png
