<properties linkid="manage-services-hdinsight-process-blob-data-and-write-to-sql" urlDisplayName="Hadoop with SQL Database" pageTitle="Using HDInsight to process data and store to SQL Database - Windows Azure" metaKeywords="Azure blob hdinsight, hdinsight blob, hdinsight sql database" metaDescription="How to use HDInsight to retrieve data from Windows Azure Blob Storage, process it, and store the results into a SQL Database." disqusComments="1" umbracoNaviHide="1" writer="bswan"/>

<div chunk="../chunks/hdinsight-left-nav.md" />

#Using HDInsight to process Blob Storage data and write the results to a SQL Database

This tutorial will show you how to use the HDInsight service to process data stored in Windows Azure Blob Storage and move the results to a Windows Azure SQL Database. At a high level, these are the steps:

* [Upload data to Windows Azure Blob Storage](#Upload)
* [Create a HDInsight cluster](#CreateCluster)
* [Create a Hive table from the data in ASV](#CreateHiveTable)
* [Execute a HiveQL query and write the results to HDFS](#ExecuteHiveQuery)
* [Use Sqoop to copy data from HDFS to your SQL Database](#HDFStoSQL)  

This tutorial assumes you have a [Windows Azure subscription][free-trial], that you have [created a Windows Azure Storage Account][create-storage-account], and that you have enabled the [HDInsight Preview](https://account.windowsazure.com/PreviewFeatures).

Before preceding, note that the data used in this tutorial comes from RITA, the [Research and Innovative Technology Administration, Bureau of Transportation Statistics][rita-website]. From the [RITA website][rita-website], you can download information about on-time performance of airline flights across the United States. To get the data used for this tutorial, download files for each month of 2012 with the following field names selected: Year, FlightDate, UniqueCarrier, Carrier, FlightNum, OriginAirportID, Origin, OriginCityName, OriginState, DestAirportID, Dest, DestCityName, DestState, DepDelayMinutes, ArrDelay, ArrDelayMinutes, CarrierDelay, WeatherDelay, NASDelay, SecurityDelay, LateAircraftDelay. Each file is a CSV file and is approximately 60 GB in size.

<h2 id="Upload">Upload data to Windows Azure Blob Storage</h2> 
There are a number of ways to upload data to Windows Azure Blob Storage. Here, we will use the Windows Azure Storage Explorer, which can be downloaded for free from Codeplex: [http://azurestorageexplorer.codeplex.com/](http://azurestorageexplorer.codeplex.com/). Documentation for using the tool can be downloaded from here: [http://azurestorageexplorer.codeplex.com/documentation](http://azurestorageexplorer.codeplex.com/documentation).

First, create a container called **flightinfo** and upload the data files to this container. Next, rename each file by prefixing the existing name with `delays/`. (You can rename a file by selecting it and using the **Rename** option in Azure Storage Explorer.) This is necessary because, in order to create Hive tables from data in blob storage (which we will do later), files that will be loaded into a table must all have the same prefix in this form: `prefix/filename.csv`. When you are finished, you should have file names that look like this:

![ASV files][asv-files]

<h2 id="CreateCluster">Create a Hadoop cluster</h2>

To create a HDInsight cluster, login to the [Windows Azure Management Portal](https://windows.azure.com/), select **HDInsight** in the left column, then click **CREATE A HDINSIGHT CLUSTER**.

![Select HDInsight][create-cluster-1]

Provide the cluster name, select the number of data nodes, provide a password for the **admin** user, and select the storage account you created earlier.

![Fill in cluster information][create-cluster-2]

<div class="dev-callout"> 
<b>Note</b> 
<p>When you specify a storage account in the step above, the account is automatically configured as an Azure Storage Vault (ASV) file system. ASV is optimized to work with HDInsight by providing durable storage and fast access to data for map reduce jobs.</p> 
</div>

Cluster creation will take several minutes.

<h2 id="CreateHiveTable">Create a Hive table</h2>
The next step is to create a Hive table from the data in Azure Storage Vault (ASV). 

<div class="dev-callout"> 
<b>Note</b> 
<p>Many of the steps in this tutorial can be done from the interactive consoles that are available in the Windows Azure management portal. However, not all of them can and therefore must be done from a command-line shell after logging into the head node of the cluster. For the sake of being consistent in this tutorial, all commands will be shown in this way here.</p> 
</div>

Back in the management portal, click on the name of your cluster to go to the cluster dashboard.

![Go to cluster dashboard][create-cluster-3]

Next, click **START DASHBOARD** at the bottom of the page. You will be prompted for your cluster credentials.

![Start dashboard][start-dashboard]

In the cluster dashboard, click on **Remote Desktop**, open the RDP file, and login to the head node of your cluster by providing your cluster credentials.

![Remote desktop][remote-desktop]

After you have logged in, open a command-line shell and change directories to the `hive-0.9.0\bin` directory (typically here: `C:\apps\dist\hive-0.9.0\bin`). Type `hive` and press enter to begin a Hive session, then copy and paste the query below (replacing `storageaccountname` with the name of your storage account) which will create a Hive table from the files in ASV. Note that this query specifies that fields are delimited by commas and that lines are terminated by `\n`. This poses a problem when field values *contain* commas because Hive cannot differentiate between a comma that is a field delimiter and a one that is part of a field value (which is the case in field values for ORIGIN\_CITY\_NAME and DEST\_CITY\_NAME). To address this, the query below creates TEMP columns to hold data that is incorrectly split into columns. 

The ASV location is specified in the last line (the table will be created from all files with the `/delays` prefix). 

	create external table delays_raw (
		YEAR string, 
		FL_DATE string, 
		UNIQUE_CARRIER string, 
		CARRIER string, 
		FL_NUM string, 
		ORIGIN_AIRPORT_ID string, 
		ORIGIN string, 
		ORIGIN_CITY_NAME string,
		ORIGIN_CITY_NAME_TEMP string,
		ORIGIN_STATE_ABR string, 
		DEST_AIRPORT_ID string, 
		DEST string, 
		DEST_CITY_NAME string,
		DEST_CITY_NAME_TEMP string, 
		DEST_STATE_ABR string, 
		DEP_DELAY_NEW float, 
		ARR_DELAY_NEW float, 
		CARRIER_DELAY float, 
		WEATHER_DELAY float, 
		NAS_DELAY float, 
		SECURITY_DELAY float, 
		LATE_AIRCRAFT_DELAY float
	)
	row format delimited 
	fields terminated by ',' 
	lines terminated by '\n' 
	stored as textfile 
	location 'asv://flightinfo@storageaccountname/delays';

After executing the query above, you should see output similar to this:

	OK
	Time taken: 5.339 seconds 

Before executing queries on the raw data imported from ASV, it will be helpful to clean up some of the data. This can be done by executing the query below, which creates a new table, `delays`, from the `delays_raw` table. Note that the TEMP columns (as mentioned above) are not copied, and that the `substring` function is used to remove quotation marks from the data:

	create table delays as 
		select 
		YEAR as year, 
		FL_DATE as flight_date, 
		substring(UNIQUE_CARRIER, 2, length(UNIQUE_CARRIER) -1) as unique_carrier, 
		substring(CARRIER, 2, length(CARRIER) -1) as carrier, 
		substring(FL_NUM, 2, length(FL_NUM) -1) as flight_num, 
		ORIGIN_AIRPORT_ID as origin_airport_id, 
		substring(ORIGIN, 2, length(ORIGIN) -1) as origin_airport_code, 
		substring(ORIGIN_CITY_NAME, 2) as origin_city_name,
		substring(ORIGIN_STATE_ABR, 2, length(ORIGIN_STATE_ABR) -1)  as origin_state_abr, 
		DEST_AIRPORT_ID as dest_airport_id, 
		substring(DEST, 2, length(DEST) -1) as dest_airport_code,
		substring(DEST_CITY_NAME,2) as dest_city_name,
		substring(DEST_STATE_ABR, 2, length(DEST_STATE_ABR) -1) as dest_state_abr, 
		DEP_DELAY_NEW as dep_delay_new, 
		ARR_DELAY_NEW as arr_delay_new, 
		CARRIER_DELAY as carrier_delay, 
		WEATHER_DELAY as weather_delay, 
		NAS_DELAY as nas_delay, 
		SECURITY_DELAY as security_delay, 
		LATE_AIRCRAFT_DELAY as late_aircraft_delay
	from delays_raw;

After executing the query above, you should see output similar to this:

	Total MapReduce jobs = 2
	Launching Job 1 out of 2
	Number of reduce tasks is set to 0 since there's no reduce operator
	Starting Job = job_201303032126_0001, Tracking URL = http://10.114.250.84:50030/jobdetails.jsp?jobid=job_201303032126_0001
	Kill Command = c:\apps\dist\hadoop-1.1.0-SNAPSHOT\bin\hadoop.cmd job  -Dmapred.job.tracker=10.114.250.84:9010 -kill job_201303032126_0001
	Hadoop job information for Stage-1: number of mappers: 3; number of reducers: 0
	2013-03-03 21:39:37,050 Stage-1 map = 0%,  reduce = 0%
	
	2013-03-03 21:40:32,771 Stage-1 map = 7%,  reduce = 0%, Cumulative CPU 11.015 sec
	2013-03-03 21:40:34,822 Stage-1 map = 40%,  reduce = 0%, Cumulative CPU 35.729 sec
	2013-03-03 21:40:45,016 Stage-1 map = 47%,  reduce = 0%, Cumulative CPU 35.729 sec
	2013-03-03 21:40:56,229 Stage-1 map = 54%,  reduce = 0%, Cumulative CPU 86.83 sec
	2013-03-03 21:41:07,477 Stage-1 map = 61%,  reduce = 0%, Cumulative CPU 130.747 sec
	2013-03-03 21:41:22,755 Stage-1 map = 67%,  reduce = 0%, Cumulative CPU 130.747 sec
	2013-03-03 21:41:34,953 Stage-1 map = 73%,  reduce = 0%, Cumulative CPU 130.747 sec
	2013-03-03 21:41:41,063 Stage-1 map = 80%,  reduce = 0%, Cumulative CPU 130.747 sec
	2013-03-03 21:41:53,322 Stage-1 map = 86%,  reduce = 0%, Cumulative CPU 130.747 sec
	2013-03-03 21:42:02,459 Stage-1 map = 93%,  reduce = 0%, Cumulative CPU 234.074 sec
	2013-03-03 21:42:12,632 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 236.589 sec
	MapReduce Total cumulative CPU time: 3 minutes 56 seconds 589 msec
	Ended Job = job_201303032126_0001
	Ended Job = 1468405594, job is filtered out (removed at runtime).
	Moving data to: hdfs://10.114.250.84:9000/tmp/hive-bswan/hive_2013-03-03_21-39-08_999_6136066034719422332/-ext-10001
	Moving data to: hdfs://10.114.250.84:9000/hive/warehouse/delays
	Table default.delays stats: [num_partitions: 0, num_files: 3, num_rows: 0, total_size: 584155812, raw_data_size: 0]
	5602556 Rows loaded to hdfs://10.114.250.84:9000/tmp/hive-bswan/hive_2013-03-03_21-39-08_999_6136066034719422332/-ext-10000
	MapReduce Jobs Launched:
	Job 0: Map: 3   Cumulative CPU: 236.589 sec   HDFS Read: 1131 HDFS Write: 584155812 SUCCESS
	Total MapReduce CPU Time Spent: 3 minutes 56 seconds 589 msec
	OK
	Time taken: 184.254 seconds

After the `delays` table has been created, you are now ready to run queries over it.

<h2 id="ExecuteHiveQuery">Execute a HiveQL query</h2>

In the query below, change `username` to the name of the logged in user, then copy/paste the query below into your Hive command-line session. This query will compute the average weather delay and group the results by city name. It will also output the results to HDFS. Note that the query is removing apostrophes from the data and is excluding rows where the value for `weather_dealy` is `null` (which is necessary because Sqoop, used in the next step, doesn't handle those values gracefully by default):

	INSERT OVERWRITE DIRECTORY '/user/username/queryoutput' select regexp_replace(origin_city_name, "'", ""), avg(weather_delay) from delays where weather_delay is not null group by origin_city_name;

Output from the query above should look similar to this:

	Total MapReduce jobs = 1
	Launching Job 1 out of 1
	Number of reduce tasks not specified. Estimated from input data size: 1
	In order to change the average load for a reducer (in bytes):
	  set hive.exec.reducers.bytes.per.reducer=<number>
	In order to limit the maximum number of reducers:
	  set hive.exec.reducers.max=<number>
	In order to set a constant number of reducers:
	  set mapred.reduce.tasks=<number>
	Starting Job = job_201303032126_0003, Tracking URL = http://10.114.250.84:50030/jobdetails.jsp?jobid=job_201303032126_0003
	Kill Command = c:\apps\dist\hadoop-1.1.0-SNAPSHOT\bin\hadoop.cmd job  -Dmapred.job.tracker=10.114.250.84:9010 -kill job_201303032126_0003
	Hadoop job information for Stage-1: number of mappers: 3; number of reducers: 1
	2013-03-03 21:55:29,553 Stage-1 map = 0%,  reduce = 0%
	2013-03-03 21:55:44,726 Stage-1 map = 33%,  reduce = 0%, Cumulative CPU 8.17 sec
	2013-03-03 21:55:45,743 Stage-1 map = 33%,  reduce = 0%, Cumulative CPU 8.17 sec
	2013-03-03 21:55:46,771 Stage-1 map = 33%,  reduce = 0%, Cumulative CPU 8.17 sec
	2013-03-03 21:55:47,778 Stage-1 map = 33%,  reduce = 0%, Cumulative CPU 8.17 sec
	2013-03-03 21:55:48,793 Stage-1 map = 67%,  reduce = 0%, Cumulative CPU 11.95 sec
	2013-03-03 21:55:49,805 Stage-1 map = 67%,  reduce = 0%, Cumulative CPU 11.95 sec
	2013-03-03 21:55:50,828 Stage-1 map = 100%,  reduce = 0%, Cumulative CPU 20.417 sec
	2013-03-03 21:55:51,865 Stage-1 map = 100%,  reduce = 0%, Cumulative CPU 20.417 sec
	2013-03-03 21:55:52,901 Stage-1 map = 100%,  reduce = 0%, Cumulative CPU 20.417 sec
	2013-03-03 21:55:53,915 Stage-1 map = 100%,  reduce = 33%, Cumulative CPU 20.417 sec
	2013-03-03 21:55:54,931 Stage-1 map = 100%,  reduce = 33%, Cumulative CPU 20.417 sec
	2013-03-03 21:55:55,942 Stage-1 map = 100%,  reduce = 33%, Cumulative CPU 20.417 sec
	2013-03-03 21:55:56,953 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 20.417 sec
	2013-03-03 21:55:57,962 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 20.417 sec
	2013-03-03 21:55:58,976 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 20.417 sec
	2013-03-03 21:55:59,997 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 22.54 sec
	2013-03-03 21:56:01,026 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 22.54 sec
	2013-03-03 21:56:02,041 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 22.54 sec
	2013-03-03 21:56:03,056 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 22.54 sec
	2013-03-03 21:56:04,073 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 22.54 sec
	2013-03-03 21:56:05,093 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 22.54 sec
	2013-03-03 21:56:06,105 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 22.54 sec
	2013-03-03 21:56:07,121 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 22.54 sec
	2013-03-03 21:56:08,153 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 22.54 sec
	2013-03-03 21:56:09,171 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 22.54 sec
	MapReduce Total cumulative CPU time: 22 seconds 540 msec
	Ended Job = job_201303032126_0003
	Moving data to: /user/username/queryoutput
	296 Rows loaded to /user/username/queryoutput
	MapReduce Jobs Launched:
	Job 0: Map: 3  Reduce: 1   Cumulative CPU: 22.54 sec   HDFS Read: 584156442 HDFS Write: 8316 SUCCESS
	Total MapReduce CPU Time Spent: 22 seconds 540 msec
	OK
	Time taken: 57.119 seconds

<div class="dev-callout"> 
<b>Note</b> 
<p>If you want to see the results of the query before the results are written to HDFS, simply omit <code>INSERT OVERWRITE DIRECTORY '/user/username/queryoutput'</code>. The resulting query will output the results to the console.</p> 
</div>

After your Hive query results have been written to HDFS, you can import them to a Windows Azure SQL Database using Sqoop.

<h2 id="HDFStoSQL">Copy Data from HDFS to a SQL Database</h2>
Before copying data from HDFS to a Windows Azure SQL Database, the SQL Database must exist. To create a database, follow the instructions here: [Getting started with Windows Azure SQL Database](http://www.windowsazure.com/en-us/manage/services/sql-databases/getting-started-w-sql-databases/). Note that your table schema must match that of the data in HDFS and it must have a clustered index. To use the command below, create a database called **MyDatabase** and a table called **AvgDelays** with the following schema:

![Table schema][table-schema]

Next, you will use the Sqoop command line tool to copy HDFS data to your SQL Database. To do this, return to your remote desktop session, quit your Hive session by entering `quit;` and change directories to the sqoop directory (typically `C:\apps\dist\sqoop-1.4.2\bin`). Execute the following command (replacing `SERVER`, `USER`, `PASSWORD`, `DATABASE`, and `username` with the appropriate values):

	sqoop-export.cmd --connect "jdbc:sqlserver://SERVER.database.windows.net;username=USER@SERVER;password=PASSWORD;database=DATABASE" --table AvgDelays --export-dir /user/username/queryoutput --fields-terminated-by \001 --lines-terminated-by '\r\n'

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
	
You should now be able to connect to your SQL Database and see average weather delays by city in the `AvgDelays` table:

![SQL results][sql-results]

[free-trial]: http://www.windowsazure.com/en-us/pricing/free-trial/
[create-storage-account]: http://www.windowsazure.com/en-us/manage/services/storage/how-to-create-a-storage-account/
[rita-website]: http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time
[create-cluster-1]: ../media/create-cluster-1.png
[create-cluster-2]: ../media/create-cluster-2.png
[create-cluster-3]: ../media/create-cluster-3.png
[start-dashboard]: ../media/start-dashboard.png
[remote-desktop]: ../media/remote-desktop.png
[asv-files]: ../media/ASV-files.png
[table-schema]: ../media/table-schema.png
[sql-results]: ../media/sql-results.png

