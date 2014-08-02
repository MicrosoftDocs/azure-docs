<properties linkid="manage-services-hdinsight-analyze-flight-delay-data" urlDisplayName="Analyze flight delay data with Hadoop in HDInsight" pageTitle="Analyze flight delay data using Hadoop in HDInsight | Azure" metaKeywords="" description="Learn how to upload data to HDInsight, how to process the data using Hive, and how to export the results to SQL Database using Sqoop." metaCanonical="" services="hdinsight" documentationCenter="" title="Analyze flight delay data using Hadoop in HDInsight " authors="jgao" solutions="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="jgao" />

#Analyze flight delay data using Hadoop in HDInsight

Hive provides a means of running Hadoop MapReduce jobs through an SQL-like scripting language, called *[HiveQL][hadoop-hiveql]*, which can be applied towards summarization, querying, and analysis of large volumes of data. This tutorial shows you how to use Hive to calculate average delays at airports, and how to use Sqoop to export the results to SQL Database. 

**Prerequisites:**

Before you begin this tutorial, you must have the following:

* An Azure HDInsight cluster. For information on provision HDInsight cluster, see [Get started with HDInsight][hdinsight-get-started] or [Provision HDInsight clusters][hdinsight-provision].
* A workstation with Azure PowerShell installed and configured. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].
	
**Estimated time to complete:** 30 minutes

##In this tutorial

* [Prepare the tutorial](#prepare)
* [Create and upload HiveQL script](#createscript)
* [Execute HiveQL script](#executehqlscript)
* [Export the output to Azure SQL Database](#exportdata)
* [Next steps](#nextsteps)

##<a id="prepare"></a>Prepare the tutorial
This tutorial uses the on-time performance of airline flights data from [Research and Innovative Technology Administration, Bureau of Transportation Statistics][rita-website] (RITA) to your workstation. You will perform the following:

1. download on-time performance data from RITA to your workstation using a Web browser
2. upload the data to HDInsight using Azure PowerShell
3. prepare the SQL Database for data export using Azure PowerShell

**Understand HDInsight storage**

HDInsight uses Azure Blob storage for data storage.  It is called *WASB* or *Azure Storage - Blob*. WASB is Microsoft's implementation of HDFS on Azure Blob storage. For more information see [Use Azure Blob storage with HDInsight][hdinsight-storage]. 

When you provision an HDInsight cluster, a Blob storage container is designated as the default file system, just like in HDFS. In addition to this container, you can add additional containers from either the same Azure storage account or different Azure storage accounts during the provision process. For instructions on adding additional storage accounts, see [Provision HDInsight clusters][hdinsight-provision]. 

To simply the PowerShell script used in this tutorial, all of the files are stored in the default file system container, located at */tutorials/flightdelays*. By default this container has the same name as the HDInsight cluster name. 

The WASB syntax is:

	wasb[s]://<ContainerName>@<StorageAccountName>.blob.core.windows.net/<path>/<filename>

> [WACOM.NOTE] Only the *wasb://* syntax is supported in HDInsight cluster version 3.0. The older *asv://* syntax is supported in HDInsight 2.1 and 1.6 clusters, but it is not supported in HDInsight 3.0 clusters and it will not be supported in later versions.

> The WASB path is virtual path.  For more information see [Use Azure Blob storage with HDInsight][hdinsight-storage]. 

For a file stored in the default file system container. it can be accessed from HDInsight using any of the following URIs (use flightdelays.hql as an example):

	wasb://mycontainer@mystorageaccount.blob.core.windows.net/tutorials/flightdelays/flightdelays.hql
	wasb:///tutorials/flightdelays/flightdelays.hql
	/tutorials/flightdelays/flightdelays.hql

If you want to access the file directly from the storage account, the blob name for the file is:

	tutorials/flightdelays/flightdelays.hql

The following table lists the files used in this tutorial:

<table border="1">
<tr><td><strong>Files</strong></td><td><strong>Description</strong></td></tr>
<tr><td>\tutotirals\flightdelays\data</td><td>input flights data for Hive</td></tr>
<tr><td>\tutorials\flightdelays\output</td><td>output for Hive</td></tr>
<tr><td>\tutorials\flightdelays\flightdelays.hql</td><td>HiveQL script file</td></tr>
<tr><td>\tutorials\flightdelays\jobstatus</td><td>Hadoop job status</td></tr>
</table>

**Understand Hive internal table and external table**

There are a few things you need to know about Hive internal table and external table:

- The CREATE TABLE command creates an internal table. The data file must be located in the default container.
- The CREATE TABLE command moves the data file to the /hive/warehouse/<TableName> folder.
- The CREATE EXTERNAL TABLE command creates an external table. The data file can be located outside the default container.
- The CREATE EXTERNAL TABLE command does not move the data file.
- The CREATE EXTERNAL TABLE command doesn't allow any folders in the LOCATION. This is the reason why the tutorial makes a copy of the sample.log file.

For more information, see [HDInsight: Hive Internal and External Tables Intro][cindygross-hive-tables].

> [WACOM.NOTE] One of the HiveQL statements creates an Hive external table. Hive external table keeps the data file in the original location. Hive internal table moves the data file to hive\warehouse. Hive external table requires the data file to be located in the default file system WASB container. If you choose to store the flight data files in a container other than the default Blob container, you must use the Hive internal tables.


**To download the flight data**

1. Browse to [Research and Innovative Technology Administration, Bureau of Transportation Statistics][rita-website] (RITA).
2. On the page, select the following values:

	<table border="1">
	<tr><th>Name</th><th>Value</th></tr>
	<tr><td>Filter Year</td><td>2012</td></tr>
	<tr><td>Filter Period</td><td>January</td></tr>
	<tr><td>Fields:</td><td>*Year*, *FlightDate*, *UniqueCarrier*, *Carrier*, *FlightNum*, *OriginAirportID*, *Origin*, *OriginCityName*, *OriginState*, *DestAirportID*, *Dest*, *DestCityName*, *DestState*, *DepDelayMinutes*, *ArrDelay*, *ArrDelayMinutes*, *CarrierDelay*, *WeatherDelay*, *NASDelay*, *SecurityDelay*, *LateAircraftDelay* (clear all other fields)</td></tr>
	</table>

3. Click **Download**. Each file could take up to 15 minutes to download.
4. Unzip the file to the **C:\Tutorials\FlightDelays\Data** folder.  Each file is a CSV file and is approximately 60 GB in size.
5.	Rename the file to the name of the month that it contains data for. For example, the file containing the January data would be named *January.csv*.
6. Repeat step 2 and 5 to download a file for each of the 12 months in 2012. You will need minimum one file to run the tutorial.  

**To upload the flight delay data to Azure Blob storage**

1. Open Azure PowerShell. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].
2. Run the following command to connect to your Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Azure account credentials.

2. Set the first three variables, and then run the commands.

		$subscriptionName = "<AzureSubscriptionName>"
		$storageAccountName = "<AzureStorageAccountName>"
		$ContainerName = "<BlobStorageContainerName>"
		
		$localFolder = "C:\Tutorials\FlightDelays\Data"
		$destFolder = "tutorials/flightdelays/data"
		
		$month = "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"

	These are the variables and their description: 
	<table border="1">
	<tr><td><strong>Variable Name</strong></td><td><strong>Description</strong></td></tr>
	<tr><td>$subscriptionName</td><td>Your Azure subscription name.</td></tr>
	<tr><td>$storageAccountName</td><td>The Azure Storage account used for storing the flight data files. It is recommended to use the default storage account.</td></tr>
	<tr><td>$containerName</td><td>The Azure Blob storage container used for storing the flight data files. It is recommended to use the default HDInsight cluster file system Blob container.  By default, it has the same name as the HDInsight cluster.</td></tr>
	<tr><td>$localFolder</td><td>This is the folder on your workstation where the flight delay files are stored.</td></tr>
	<tr><td>$destFolder</td><td>This is the WASB path where the flight delay data will be uploaded to. Hadoop (HDInsight) path is case sensitive.</td></tr>
	<tr><td>$month</td><td>If you didn't download all 12 files, you need to update this variable</td></tr>
	</table>

3. Run the following commands to upload and list the files:		
		
		# Create a storage context object
		Select-AzureSubscription $subscriptionName
		$storageaccountkey = get-azurestoragekey $storageAccountName | %{$_.Primary}
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageaccountkey
		
		# Copy the file from local workstation to WASB        
		foreach ($item in $month){
		    $fileName = "$localFolder\$item.csv"
		    $blobName = "$destFolder/$item.csv"
		
		    Write-Host "Copying $fileName to $blobName" -BackgroundColor Green
		
		    Set-AzureStorageBlobContent -File $fileName -Container $dataContainerName -Blob $blobName -Context $destContext
		}
		
		# List the uploaded files on HDinsight
		Get-AzureStorageBlob -Container $dataContainerName  -Context $destContext -Prefix $destFolder






If you choose to use a different method for uploading the files, please make sure the file path is *tutorials/flightdelays/data*. The syntax for accessing the files is:

	wasb://<ContainerName>@<StorageAccountName>.blob.core.windows.net/tutorials/flightdelays/data

*tutorials/flightdelays/data* is the virtual folder you created when you uploaded the files. Verify that there are 12 files, one for each month.

**To prepare the SQL database**

1. Open Azure PowerShell. 
2. Run the following command to connect to your Azure subscription:

		Add-AzureAccount

	You will be prompted to enter your Azure account credentials.

3. Set the first six variables in the following script, and then run the commands:
	
		# Azure subscription name
		$subscriptionName = "<AzureSubscriptionName>"
				
		# SQL database server variables
		$sqlDatabaseServer = ""  # specify the Azure SQL database server name if you have one created. Otherwise use "".
		$sqlDatabaseUsername = "<SQLDatabaseUserName>"
		$sqlDatabasePassword = "<SQLDatabasePassword>"
		$sqlDatabaseLocation = "<MicrosoftDataCenter>"   #For example, West US.
		
		# SQL database variables
		$sqlDatabaseName = ""  # specify the database name if you have one created.  Otherwise use "" to have the script create one for you.
		$sqlDatabaseMaxSizeGB = 10

	    #SQL query string for creating AvgDelays table
		$sqlDatabaseTableName = "AvgDelays"
	    $sqlCreateAvgDelaysTable = " CREATE TABLE [dbo].[$sqlDatabaseTableName](
	            [origin_city_name] [nvarchar](50) NOT NULL,
	            [weather_delay] float,
	        CONSTRAINT [PK_$sqlDatabaseTableName] PRIMARY KEY CLUSTERED   
	        (
	            [origin_city_name] ASC
	        )
	        )"

	These are the variables and their descriptions:
	<table border="1">
	<tr><td><strong>Variable Name</strong></td><td><strong>Description</strong></td></tr>
	<tr><td>$subscriptionName</td><td>Your Azure subscription name.</td></tr>
	<tr><td>$sqlDatabaseServer</td><td>The SQL Database server name used by Sqoop to export data to. If you leave it as it is, the script will create one for you. Otherwise, specify an existing SQL Datbase  or SQL Server.</td></tr>
	<tr><td>$sqlDatabaseUsername</td><td>SQL Database/SQL Server user name.</td></tr>
	<tr><td>$sqlDatabasePassword</td><td>SQL Database/SQL Server user password.</td></tr>
	<tr><td>$sqlDatabaseLocation</td><td>This is only used if you want the script to create a SQL Database server for you.</td></tr>
	<tr><td>$sqlDatabaseName</td><td>The SQL Database name used by Sqoop to export data to. If you leave it as it is, the script will create one for you. Otherwise, specify an existing SQL Datbase  or SQL Server.</td></tr>
	<tr><td>$sqlDatabaseMaxSizeGB</td><td>This is only used if you want the script to create a SQL Database for you.</td></tr>
	</table>

4. Run the following commands to create SQL Database server/database/table.
				
		# Select the current Azure subscription in case there are multiple subscriptions
		Select-AzureSubscription $subscriptionName

	    # create a new Azure SQL Database if requested
	    if ([string]::IsNullOrEmpty($sqlDatabaseServer))
	    {
	        $sqlDatabaseServer = New-AzureSqlDatabaseServer -AdministratorLogin $sqlDatabaseUsername -AdministratorLoginPassword $sqlDatabasePassword -Location $sqlDatabaseLocation 
	        Write-Host "The new SQL Database server is $sqlDatabaseServer."  -BackgroundColor Green
	
	    }
	    else
	    {
	        Write-Host "Use an existing SQL Database server: $sqlDatabaseServer" -BackgroundColor Green
	    }
	
	    # Create a new SQL database if requested
	    if ([string]::IsNullOrEmpty($sqlDatabaseName))
	    {
	        $sqlDatabaseName = "HDISqoop"
	        $sqlDatabaseServerCredential = new-object System.Management.Automation.PSCredential($sqlDatabaseUsername, ($sqlDatabasePassword  | ConvertTo-SecureString -asPlainText -Force)) 
	        $sqlDatabaseServerConnectionContext = New-AzureSqlDatabaseServerContext -ServerName $sqlDatabaseServer -Credential $sqlDatabaseServerCredential 
	
	        $sqlDatabase = New-AzureSqlDatabase -ConnectionContext $sqlDatabaseServerConnectionContext -DatabaseName $sqlDatabaseName -MaxSizeGB $sqlDatabaseMaxSizeGB
	    
	        Write-Host "The new SQL Database is $sqlDatabaseName."  -BackgroundColor Green
	
	    }
	    else
	    {
	        Write-Host "Use an existing SQL Database : $sqlDatabaseName" -BackgroundColor Green
	    }
	
	    #Create AvgDelays table
	    $conn = New-Object System.Data.SqlClient.SqlConnection
	    $conn.ConnectionString = "Data Source=$sqlDatabaseServer.database.windows.net;Initial Catalog=$sqlDatabaseName;User ID=$sqlDatabaseUsername;Password=$sqlDatabasePassword;Encrypt=true;Trusted_Connection=false;"
	    $conn.open()
	    $cmd = New-Object System.Data.SqlClient.SqlCommand
	    $cmd.connection = $conn
	    $cmd.commandtext = $sqlCreateAvgDelaysTable
	    $cmd.executenonquery()
	
	    $conn.close()












##<a id="createscript"></a>Create and upload HiveQL script

Using Azure PowerShell, you can run multiple HiveQL statements one at a time, or package the HiveQL statement into a script file. In this tutorial, you will create a HiveQL script. The script file must be uploaded to WASB. In the next section, you will run the script file using Azure PowerShell.

The HiveQL script will perform the following:

1. **Drop the delays_raw table**, in case the table already exists.
2. **Create the delays_raw external Hive table** pointing to the WASB location with the flight delay files. This query specifies that fields are delimited by "," and that lines are terminated by "\n". This poses a problem when field values *contain* commas because Hive cannot differentiate between a comma that is a field delimiter and a one that is part of a field value (which is the case in field values for ORIGIN\_CITY\_NAME and DEST\_CITY\_NAME). To address this, the query creates TEMP columns to hold data that is incorrectly split into columns.  
3. **Drop the delays table**, in case the table already exists;
4. **Create the delays table**. It is helpful to clean up the data before further processing. This query creates a new table, *delays* from the *delays_raw* table. Note that the TEMP columns (as mentioned previously) are not copied, and that the *substring* function is used to remove quotation marks from the data. 
5. **Computes the average weather delay and groups the results by city name.** It will also output the results to WASB. Note that the query will remove apostrophes from the data and will exclude rows where the value for *weather_deal*y is *null*, which is necessary because Sqoop, used later in this tutorial, doesn't handle those values gracefully by default.





For a full list of the HiveQL commands, see [Hive Data Definition Language][hadoop-hiveql]. Each HiveQL command must terminate with a semicolon.


**To create an HiveQL script file**

1. Open Azure PowerShell.
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

















##<a id="executehqlscript"></a>Execute HiveQL script 

There are several Azure PowerShell cmdlets you can use to run Hive. This tutorial uses Invoke-Hive. For other methods, see [Use Hive with HDInsight][hdinsight-use-hive]. Using Invoke-Hive, you can run either a HiveQL statement or a HiveQL script. You will use the HiveQL script you have created and uploaded to Azure Blob storage.

There is a known Hive path issue. The instructions for fixing the issue can be found at [TechNet Wiki][technetwiki-hive-error].

**To run the Hive queries using PowerShell**

1. Open Azure PowerShell.
2. Run the following command to change the current directory:

	cd \Tutorials\FlightDelays\

	This step is necessory because you will download a copy of the Hive output to your workstation. By default, you don't have write permission on the PowerShell folder. 

2. Run the following command to connect to your Azure subscription:

		Add-AzureAccount
 
2. Set the first three variables, and then run them:
		
		$clusterName = "<HDInsightClusterName>"
		$storageAccountName = "<AzureStorageAccountName>"
		$containerName = "<AzureBlobStorageContainerName>"
		$hqlScriptFile = "wasb://$containerName@$storageAccountName.blob.core.windows.net/tutorials/flightdelays/flightdelays.hql"
		$outputBlobName = "tutorials/flightdelays/output/000000_0"

	These are the variables and their description: 
	<table border="1">
	<tr><td><strong>Variable Name</strong></td><td><strong>Description</strong></td></tr>
	<tr><td>$clusterName</td><td>The HDInsight cluster that will run the Hive script and Sqoop export.</td></tr>
	<tr><td>$storageAccountName</td><td>The Azure Storage account used for storing the HiveQL script. See <a href = "#createScript">Create and upload HiveQL script</a>.</td></tr>
	<tr><td>$containerName</td><td>The Azure Blob storage container used for storing the HiveQL script. See <a href = "#createScript">Create and upload HiveQL script</a>.</td></tr>
	<tr><td>$hqlScriptFile</td><td>This is the URI for the HiveQL script file.</td></tr>
	<tr><td>$outputBlobName</td><td>This is HiveQL script output file. The default name is *000000_0*.</td></tr>
	</table>

3. Run the following command to invoke hive
		
		Use-AzureHDInsightCluster $clusterName
				
		Invoke-Hive –File $hqlScriptFile

4. Run the following command to verify the results:

		$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
		$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  
		
		Get-AzureStorageBlobContent -Container $ContainerName -Blob $outputBlobName -Context $storageContext 
		
		cat ".\$outputBlobName" | findstr /B "Ch"

	The output shall be similar to:

		Champaign/Urbana 19.023255813953487
		Charleston 24.93975903614458
		Charleston/Dunbar 16.954545454545453
		Charlotte 16.88616981831665
		Charlotte Amalie 12.88888888888889
		Charlottesville 25.444444444444443
		Chattanooga 19.883561643835616
		Cheyenne 9.875
		Chicago 16.77321649680922
		Chico 12.340909090909092
		Christiansted 12.318181818181818

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

[rita-website]: http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time

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
