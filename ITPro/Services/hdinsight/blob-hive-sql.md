<properties linkid="manage-services-hdinsight-process-blob-data-and-write-to-sql" urlDisplayName="Blob to SQL" pageTitle="Process Blob Storage data and write results to SQL | Windows Azure" metaKeywords="" description="Learn how to use the HDInsight service to process data stored in Windows Azure Blob storage and write the results to a SQL Database." metaCanonical="" services="sql-database,storage,hdinsight" documentationCenter="" title="Using Hive to Process Blob Storage Data and Write the Results to a SQL Database" authors=""  solutions="" writer="bswan" manager="" editor=""  />



<div chunk="../chunks/hdinsight-left-nav.md" />

#Using Hive to Process Blob Storage Data and Write the Results to a SQL Database

Hive provides a means of running MapReduce job through an SQL-like scripting language, called *[HiveQL][hadoop-hiveql]*, which can be applied towards summarization, querying, and analysis of large volumes of data. This tutorial will show you how to upload data to HDInsight cluster (HDInsight uses Windows Azure Blob Storage to store data), how to use HiveQL to process data stored in Windows Azure Blob Storage, and how to move the results to a Windows Azure SQL Database. 

**Prerequisites:**

Before you begin this tutorial, you must have the following:

* A Windows Azure account.
* A Windows Azure storage account.
* A Windows Azure HDInsight cluster. 
* Set up local environment for running PowerShell
	
The detail steps can be found at [Getting Started with Windows Azure HDInsight Service][hdinsight-get-started].

**Estimated time to complete:** 30 minutes

##In this tutorial

* [Download airline flights data](#downloaddata)
* [Upload data to Windows Azure Blob storage](#uploaddata)
* [Execute HiveQL queries](#executequeries)
* [Export data from HDInsight cluster to Windows Azure SQL Database](#exportdata)
* [Next steps](#nextsteps)

##<a id="downloaddata"></a>Download airline flights data
In this tutorial, you will download the on-time performance of airline flights data from [Research and Innovative Technology Administration, Bureau of Transportation Statistics][rita-website] (RITA) to your workstation. In the next section, you will upload the data to Windows Azure Blob Storage, so the data can be processed by a Hive job.

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
4. Unzip the file to the **C:\Tutorials** folder.  Each file is a CSV file and is approximately 60 GB in size.
5.	Rename the file to the name of the month that it contains data for. For example, the file containing the January data would be named *January.csv*.
6. Repeat step 2 and 5 to download a file for each of the 12 months in 2012.





##<a id="uploaddata"></a>Upload data to Windows Azure Blob storage
A HDInsight cluster uses a Windows Azure Blob storage container as the default file system. You can also add additional storage accounts during the provision process. For more information, see [Using Windows Azure Blob Storage with HDInsight][hdinsight-blob-storage]. The data file doesn't have to be on the default file system container. But the storage account must be one of the storage accounts that have been configured for the cluster. There are many methods for uploading files to Blob storage.  For more information, see [How to Upload Data to HDInsight][HDinsight-upload-data]. 

The following is a Windows Azure PowerShell script. For information on configuring and runing Windows Azure PowerShell script, see [How to Upload Data to HDInsight][HDinsight-upload-data].

	### Upload a set of files to a blob storage container
	$subscriptionname = "<SubscriptionName>"
	$storageaccountname = "<StorageAccountName>"

	$containername = "flightinfo"
	$folder = "C:\Tutorials"

	$month = "January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	
	Select-AzureSubscription $subscriptionname
	
	$storageaccountkey = get-azurestoragekey $storageaccountname | %{$_.Primary}
	$destcontext = New-AzureStorageContext -StorageAccountName $storageaccountname -StorageAccountKey $storageaccountkey
	
	foreach ($item in $month)
	{
	    write-host "Uploading $item.csv"
	    Set-AzureStorageBlobContent -File "$folder\$item.csv" -Container $containername -Blob "example\data\delays/$item.csv" -context $destcontext
	}
	
	write-host "Uploading file completed"

If you choose to use a different method for uploading the files, please make sure the file path is *example\data\delays*.

The syntax for accessing the files is:

	asv://flightinfo@<StorageAccountName>.blob.core.windows.net/example/data/delays/

*flightinfo* is the blog storage container where you uploaded the data files. *example/data/delays* is the virtual folder you created when you uploaded the files. Verify that there are 12 files, one for each month. For more HDFS commands, see [Hadoop Shell Commands][hadoop-shell-commands].





For a full list of the HiveQL commands, see [Hive Data Definition Language][hadoop-hiveql]. Each HiveQL command must terminate with a semicolon.




















##<a id="executequeries"></a>Execute HiveQL queries
In this section, you will create a powershell script to perform the following tasks:

- create a Hive table
- populate the airline flights delay data into the table
- run queries against the Hive table

In the script, two Windows Azure storage accounts and two storage account containers have been specified.  The $storageaccountname_data and $containername_data are for the Blob container that is used for storing the data file.  The $storageaccountname_cluster and $containername_cluster are for the Blob container that is used as the default HDInsight file system.

**To run the Hiver queries using PowerShell**

1. Open Notepad.
2. Copy and paste the following code into Notepad:

		# Import the management module 
		Import-Module "C:\Program Files (x86)\PowerShell tools for Windows Azure HDInsight\Microsoft.WindowsAzure.Management.HDInsight.Cmdlet" 
		
		$subscriptionname = "Azure-Irregulars_563702"	#Windows Azure subscription name
		$storageaccountname_data = "hdistorewestus"     #Windows Azure storage account name for data files
		$containername_data = "hdi0826"                 #Windows Azure Blob storage container name for data files
		
		$clustername = "hdi0917"                 		#Windows Azure HDInsight Service cluster name
		$username = "admin"                				#HDInsight cluster username
		$passwd = "Pass@word1"                			#HDInsight cluster password
		$storageaccountname_cluster = "hdistorewu"		#HDInsight default file system storage account
		$containername_cluster = "hdi0917"				#HDInsight default file system container
		
		$hivejobname = "HiveJob-FlightDelays"
		$outputstoragelocation = "user/$username/HiveJob-FlightDelays-output"
		
		$querystring = "drop table delays_raw;" +
		               "create external table delays_raw (YEAR string, FL_DATE string, UNIQUE_CARRIER string, CARRIER string, FL_NUM string, ORIGIN_AIRPORT_ID string, ORIGIN string, ORIGIN_CITY_NAME string, ORIGIN_CITY_NAME_TEMP string, ORIGIN_STATE_ABR string, DEST_AIRPORT_ID string, DEST string, DEST_CITY_NAME string, DEST_CITY_NAME_TEMP string, DEST_STATE_ABR string, DEP_DELAY_NEW float, ARR_DELAY_NEW float, CARRIER_DELAY float, WEATHER_DELAY float, NAS_DELAY float, SECURITY_DELAY float, LATE_AIRCRAFT_DELAY float) row format delimited fields terminated by ',' lines terminated by '\n' stored as textfile location 'asv://$containername_data@$storageaccountname_data.blob.core.windows.net/example/data/delays';" +
		               "drop table delays;" +
		               "create table delays as select YEAR as year, FL_DATE as flight_date, substring(UNIQUE_CARRIER, 2, length(UNIQUE_CARRIER) -1) as unique_carrier, substring(CARRIER, 2, length(CARRIER) -1) as carrier, substring(FL_NUM, 2, length(FL_NUM) -1) as flight_num, ORIGIN_AIRPORT_ID as origin_airport_id, substring(ORIGIN, 2, length(ORIGIN) -1) as origin_airport_code, substring(ORIGIN_CITY_NAME, 2) as origin_city_name, substring(ORIGIN_STATE_ABR, 2, length(ORIGIN_STATE_ABR) -1)  as origin_state_abr, DEST_AIRPORT_ID as dest_airport_id, substring(DEST, 2, length(DEST) -1) as dest_airport_code, substring(DEST_CITY_NAME,2) as dest_city_name, substring(DEST_STATE_ABR, 2, length(DEST_STATE_ABR) -1) as dest_state_abr, DEP_DELAY_NEW as dep_delay_new, ARR_DELAY_NEW as arr_delay_new, CARRIER_DELAY as carrier_delay, WEATHER_DELAY as weather_delay, NAS_DELAY as nas_delay, SECURITY_DELAY as security_delay, LATE_AIRCRAFT_DELAY as late_aircraft_delay from delays_raw;" +
		               "INSERT OVERWRITE DIRECTORY '/$outputstoragelocation' select regexp_replace(origin_city_name, '''', ''), avg(weather_delay) from delays where weather_delay is not null group by origin_city_name;"
		
		# Select subscription in case the default subscription is a different one
		Select-AzureSubscription $subscriptionname
		
		#Create a Hive job definition 
		$HiveJobDef = New-AzureHDInsightHiveJobDefinition -Query $querystring -JobName $hivejobname -OutputStorageLocation "/$outputstoragelocation"
		
		#Submit the job to the cluster 
		$password = ConvertTo-SecureString $passwd -AsPlainText -Force
		$creds = New-Object System.Management.Automation.PSCredential ($username, $password) 
		$HiveJob = Start-AzureHDInsightJob -Credentials $creds -Cluster $clustername -JobDefinition $HiveJobDef 
		
		#Wait until the job is completed
		while((Get-AzureHDInsightJob -Credentials $creds -Cluster $clustername -JobId $HiveJob.JobId | %{$_.State}) -ne "Completed") {Write-Host "Waiting for the job to finish..."; Start-Sleep -s 1;}
		
		# Create storage account context object
		$storageaccountkey = Get-AzureStorageKey $storageaccountname_cluster | %{ $_.Primary }
		$destContext = New-AzureStorageContext  –StorageAccountName $storageaccountname_cluster -StorageAccountKey $storageaccountkey  
		
		#Download and view the job results and output 
		Get-AzureStorageBlobContent -Container $containername_cluster -Blob "$outputstoragelocation/stderr" -Context $destContext -Force 
		Get-AzureStorageBlobContent -Container $containername_cluster -Blob "$outputstoragelocation/000000_0" -Context $destContext -Force 
		cat ".\$outputstoragelocation\stderr"
		cat ".\$outputstoragelocation\000000_0" | findstr "Seattle"

	The first query specifies that fields are delimited by commas and that lines are terminated by "\n". This poses a problem when field values *contain* commas because Hive cannot differentiate between a comma that is a field delimiter and a one that is part of a field value (which is the case in field values for ORIGIN\_CITY\_NAME and DEST\_CITY\_NAME). To address this, the query below creates TEMP columns to hold data that is incorrectly split into columns. The ASV location is specified in the last line. 

	It is helpful to clean up the data before further processing. The second query creates a new table, *delays*, from the *delays_raw* table. Note that the TEMP columns (as mentioned previously) are not copied, and that the *substring* function is used to remove quotation marks from the data. 
	
	The last query computes the average weather delay and groups the results by city name. It will also output the results to HDFS. Note that the query will remove apostrophes from the data and will exclude rows where the value for *weather_deal*y is *null*, which is necessary because Sqoop, used in the next step, doesn't handle those values gracefully by default.

3. Set the eight variables at the beginning of the script.
4. Open Windows Azure PowerShell.
5. Change directory to the current user's directory on C:\Users.  This is needed to avoid permission issues.
6. Copy and past the modified script from Notepad to the Windows Azure PowerShell windows. The end of the output shall look like:

		2013-09-18 20:23:09,674 Stage-1 map = 100%,  reduce = 0%, Cumulative CPU 23.625 sec
		2013-09-18 20:23:10,690 Stage-1 map = 100%,  reduce = 17%, Cumulative CPU 23.625 sec
		2013-09-18 20:23:11,690 Stage-1 map = 100%,  reduce = 17%, Cumulative CPU 23.625 sec
		2013-09-18 20:23:12,705 Stage-1 map = 100%,  reduce = 17%, Cumulative CPU 23.625 sec
		2013-09-18 20:23:13,705 Stage-1 map = 100%,  reduce = 17%, Cumulative CPU 23.625 sec
		2013-09-18 20:23:14,705 Stage-1 map = 100%,  reduce = 17%, Cumulative CPU 23.625 sec
		2013-09-18 20:23:15,705 Stage-1 map = 100%,  reduce = 17%, Cumulative CPU 23.625 sec
		2013-09-18 20:23:16,705 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 25.718 sec
		2013-09-18 20:23:17,721 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 25.718 sec
		2013-09-18 20:23:18,721 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 25.718 sec
		2013-09-18 20:23:19,736 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 25.718 sec
		MapReduce Total cumulative CPU time: 25 seconds 718 msec
		Ended Job = job_201309171512_0028
		Moving data to: /user/admin/HiveJob-FlightDelays-output
		298 Rows loaded to /user/admin/HiveJob-FlightDelays-output
		MapReduce Jobs Launched:
		Job 0: Map: 2  Reduce: 1   Cumulative CPU: 25.718 sec   HDFS Read: 556 HDFS Write: 0 SUCCESS
		Total MapReduce CPU Time Spent: 25 seconds 718 msec
		OK
		Time taken: 55.046 seconds
		PS C:\Users\JohnDole> cat ".\$outputstoragelocation\000000_0" | findstr "Seattle"
		Seattle☺16.85042954695646





##<a id="exportdata"></a>Export data to Windows Azure SQL Database

Before copying data from HDFS to a Windows Azure SQL Database, the SQL Database must exist. To create a database, follow the instructions here: [Getting started with Windows Azure SQL Database][azure-sql-database-getting-started]. Note that your table schema must match that of the data in HDFS and it must have a clustered index. To use the command below, create a database called **MyDatabase** and a table called **AvgDelays** with the following schema:

![Table schema][table-schema]

**To export data to SQL database**


1. Sign in to the [Management Portal][azure-management-portal].
2. Click **HDINSIGHT**. You will see a list of deployed Hadoop clusters.
3. Click the Hadoop cluster where you want to export data from.
4. Click **CONNECT** on the bottom of the page.
5. Click **Open**.
6. Click **Connect**.
7. Click **Yes**.
8. Enter **User name** and **Password** for the cluster, and then click the right button.
9. From the remote desktop window, double-click **Hadoop Command Line**.
12. Run the following command to change directory:

		cd %sqoop_home%\bin

13. Replacing **SERVER**, **USER**, **PASSWORD**, **DATABASE**, and **username** with the appropriate values, and the Execute the command:

		sqoop-export.cmd --connect "jdbc:sqlserver://SERVER.database.windows.net;username=USER@SERVER;password=PASSWORD;database=DATABASE" --table AvgDelays --export-dir user/admin/HiveJob-FlightDelays-output --fields-terminated-by \001 --lines-terminated-by '\r\n'
	
	The output of the query above should look similar to this:
	
		13/03/03 22:30:11 WARN sqoop.SqoopOptions: Character argument '\r\n' has multiple characters; only the first will be used.
		13/03/03 22:30:11 WARN sqoop.SqoopOptions: Character argument '\r\n' has multiple characters; only the first will be used.
		13/03/03 22:30:11 INFO SqlServer.MSSQLServerManagerFactory: Using Microsoft's SQL Server - Hadoop Connector
		13/03/03 22:30:12 INFO manager.SqlManager: Using default fetchSize of 1000
		13/03/03 22:30:12 INFO tool.CodeGenTool: Beginning code generation
		13/03/03 22:30:12 INFO manager.SqlManager: Executing SQL statement: SELECT TOP 1 * FROM [AvgDelays]
		13/03/03 22:30:12 INFO manager.SqlManager: Executing SQL statement: SELECT TOP 1 * FROM [AvgDelays]
		13/03/03 22:30:12 INFO orm.CompilationManager: HADOOP_HOME is c:\apps\dist\hadoop-1.1.0-SNAPSHOT
		Note: \tmp\sqoop-bswan\compile\9bbc0bc0c3446b2c3e8b55c1f91e113b\AvgDelays.java uses or overrides a deprecated API.
		Note: Recompile with -Xlint:deprecation for details.
		13/03/03 22:30:14 INFO orm.CompilationManager: Writing jar file: \tmp\sqoop-username\compile\9bbc0bc0c3446b2c3e8b55c1f91e113b\AvgDelays.jar
		13/03/03 22:30:14 INFO mapreduce.ExportJobBase: Beginning export of AvgDelays
		13/03/03 22:30:14 INFO manager.SqlManager: Executing SQL statement: SELECT TOP 1 * FROM [AvgDelays]
		13/03/03 22:30:16 INFO input.FileInputFormat: Total input paths to process : 1
		13/03/03 22:30:16 INFO input.FileInputFormat: Total input paths to process : 1
		13/03/03 22:30:16 INFO mapred.JobClient: Running job: job_201303032126_0004
		13/03/03 22:30:17 INFO mapred.JobClient:  map 0% reduce 0%
		13/03/03 22:30:37 INFO mapred.JobClient:  map 100% reduce 0%
		13/03/03 22:30:45 INFO mapred.JobClient: Job complete: job_201303032126_0004
		13/03/03 22:30:45 INFO mapred.JobClient: Counters: 18
		13/03/03 22:30:45 INFO mapred.JobClient:   Job Counters
		13/03/03 22:30:45 INFO mapred.JobClient:     SLOTS_MILLIS_MAPS=22235
		13/03/03 22:30:45 INFO mapred.JobClient:     Total time spent by all reduces waiting after reserving slots (ms)=0
		13/03/03 22:30:45 INFO mapred.JobClient:     Total time spent by all maps waiting after reserving slots (ms)=0
		13/03/03 22:30:45 INFO mapred.JobClient:     Launched map tasks=1
		13/03/03 22:30:45 INFO mapred.JobClient:     SLOTS_MILLIS_REDUCES=0
		13/03/03 22:30:45 INFO mapred.JobClient:   File Output Format Counters
		13/03/03 22:30:45 INFO mapred.JobClient:     Bytes Written=0
		13/03/03 22:30:45 INFO mapred.JobClient:   FileSystemCounters
		13/03/03 22:30:45 INFO mapred.JobClient:     FILE_BYTES_READ=152
		13/03/03 22:30:45 INFO mapred.JobClient:     HDFS_BYTES_READ=8460
		13/03/03 22:30:45 INFO mapred.JobClient:     FILE_BYTES_WRITTEN=31494
		13/03/03 22:30:45 INFO mapred.JobClient:   File Input Format Counters
		13/03/03 22:30:45 INFO mapred.JobClient:     Bytes Read=0
		13/03/03 22:30:45 INFO mapred.JobClient:   Map-Reduce Framework
		13/03/03 22:30:45 INFO mapred.JobClient:     Map input records=296
		13/03/03 22:30:45 INFO mapred.JobClient:     Physical memory (bytes) snapshot=96903168
		13/03/03 22:30:45 INFO mapred.JobClient:     Spilled Records=0
		13/03/03 22:30:45 INFO mapred.JobClient:     CPU time spent (ms)=1937
		13/03/03 22:30:45 INFO mapred.JobClient:     Total committed heap usage (bytes)=70975488
		13/03/03 22:30:45 INFO mapred.JobClient:     Virtual memory (bytes) snapshot=129306624
		13/03/03 22:30:45 INFO mapred.JobClient:     Map output records=296
		13/03/03 22:30:45 INFO mapred.JobClient:     SPLIT_RAW_BYTES=138
		13/03/03 22:30:45 INFO mapreduce.ExportJobBase: Transferred 8.2617 KB in 30.8208 seconds (274.4897 bytes/sec)
		13/03/03 22:30:45 INFO mapreduce.ExportJobBase: Exported 296 records.
	
14. Connect to your SQL Database and see average weather delays by city in the "AvgDelays" table:

	![SQL results][sql-results]


##<a id="nextsteps"></a> Next steps
Now that you understand how to upload file to Blob storage, how to populate a Hive table using the data from Blob storage, how to run Hive queries, and how to use Sqoop to export data from HDFS to Windows Azure SQL Database. To learn more, see the following articles:

* [Getting Started with Windows Azure HDInsight Service](/en-us/manage/services/hdinsight/get-started-hdinsight/)
* [Using MapReduce with HDInsight](/en-us/manage/services/hdinsight/using-mapreduce-with-hdinsight/)
* [Using Hive with HDInsight](/en-us/manage/services/hdinsight/using-hive-with-hdinsight/)
* [Using Pig with HDInsight](/en-us/manage/services/hdinsight/using-pig-with-hdinsight/)


[rita-website]: http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time
[start-dashboard]: ../media/start-dashboard.png
[remote-desktop]: ../media/remote-desktop.png
[asv-files]: ../media/ASV-files.png
[table-schema]: ../media/table-schema.png
[sql-results]: ../media/sql-results.png

[hdinsight-blob-storage]: /en-us/manage/services/hdinsight/howto-blob-store/
[hdinsight-upload-data]: /en-us/manage/services/hdinsight/howto-upload-data-to-hdinsight/
[hdinsight-get-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/

[azure-management-portal]: https://manage.windowsazure.com
[azure-sql-database-getting-started]: http://www.windowsazure.com/en-us/manage/services/sql-databases/getting-started-w-sql-databases/
[hadoop-hiveql]: https://cwiki.apache.org/Hive/languagemanual-ddl.html
[hadoop-shell-commands]: http://hadoop.apache.org/docs/r0.18.3/hdfs_shell.html

[image-hive-commands]: ../media/HDI.HiveInteractiveConsole.png
[image-hive-output]: ../media/HDI.Hive.Output.png
