<properties 
	pageTitle="Analyze flight delay data with Hive on Linux-based HDInsight | Microsoft Azure" 
	description="Learn how to use Hive to analyze flight data on Linux-based HDInsight, then export the data to SQL Database using Sqoop." 
	services="hdinsight" 
	documentationCenter="" 
	authors="Blackmist" 
	manager="paulettm" 
	editor="cgronlun"
	tags="azure-portal"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/05/2016" 
	ms.author="larryfr"/>

#Analyze flight delay data by using Hive in HDInsight

Learn how to analyze flight delay data using Hive on Linux-based HDInsight then export the data to Azure SQL Database using using Sqoop.

> [AZURE.NOTE] While individual pieces of this document can be used with Windows-based HDInsight clusters (Python and Hive for example,) many steps are specific to Linux-based clusters. For steps that will work with a Windows-based cluster, see [Analyze flight delay data using Hive in HDInsight](hdinsight-analyze-flight-delay-data.md)

###Prerequisites

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

- __An HDInsight cluster__. See [Get started using Hadoop with Hive in HDInsight on Linux](hdinsight-hadoop-linux-tutorial-get-started.md) for steps on creating a new Linux-based HDInsight cluster.

- __Azure SQL Database__. You will use an Azure SQL database as a destination data store. If you do not have a SQL Database already, see [SQL Database tutorial: Create a SQL database in minutes](../sql-database/sql-database-get-started.md).

- __Azure CLI__. If you have not installed the Azure CLI, see [Install and Configure the Azure CLI](../xplat-cli-install.md) for more steps.

	[AZURE.INCLUDE [use-latest-version](../../includes/hdinsight-use-latest-cli.md)]


##Download the flight data

1. Browse to [Research and Innovative Technology Administration, Bureau of Transportation Statistics][rita-website].
2. On the page, select the following values:

    | Name | Value |
    | ---- | ---- |
    | Filter Year | 2013 |
    | Filter Period | January |
    | Fields | Year, FlightDate, UniqueCarrier, Carrier, FlightNum, OriginAirportID, Origin, OriginCityName, OriginState, DestAirportID, Dest, DestCityName, DestState, DepDelayMinutes, ArrDelay, ArrDelayMinutes, CarrierDelay, WeatherDelay, NASDelay, SecurityDelay, LateAircraftDelay. Clear all other fields |

3. Click **Download**. 

##Upload the data

1. Use the following command to upload the zip file to the HDInsight cluster head node:

		scp FILENAME.csv USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:

	Replace __FILENAME__ with the name of the zip file. Replace __USERNAME__ with the SSH login for the HDInsight cluster. Replace CLUSTERNAME with the name of the HDInsight cluster.
	
	> [AZURE.NOTE] If you use a password to authenticate your SSH login, you will be prompted for the password. If you used a public key, you may need to use the `-i` parameter and specify the path to the matching private key. For example `scp -i ~/.ssh/id_rsa FILENAME.csv USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:`.

2. Once the upload has completed, connect to the cluster using SSH:

		ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net
		
	For more information on using SSH with Linux-based HDInsight, see the following articles:
	
	* [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

	* [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)
	
3. Once connected, use the following to unzip the .zip file:

		unzip FILENAME.zip
	
	This will extract a .csv file that is roughly 60MB in size.
	
4. Use the following to create a new directory on WASB (the distributed data store used by HDInsight,) and copy the file:

	hdfs dfs -mkdir -p /tutorials/flightdelays/data
	hdfs dfs -put FILENAME.csv /tutorials/flightdelays/data/
	
##Create and run the HiveQL

Use the following steps to import data from the CSV file into a Hive table named __Delays__.

1. Use the following to create and edit a new file named __flightdelays.hql__:

		nano flightdelays.hql
		
	Use the following as the contents of this file:
	
		DROP TABLE delays_raw;
		-- Creates an external table over the csv file
		CREATE EXTERNAL TABLE delays_raw (
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
			LATE_AIRCRAFT_DELAY float)
		-- The following lines describe the format and location of the file
		ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
		LINES TERMINATED BY '\n'
		STORED AS TEXTFILE
		LOCATION '/tutorials/flightdelays/data';
		
		-- Drop the delays table if it exists
		DROP TABLE delays;
		-- Create the delays table and populate it with data
		-- pulled in from the CSV file (via the external table defined previously)
		CREATE TABLE delays AS
		SELECT YEAR AS year,
		    FL_DATE AS flight_date,
		    substring(UNIQUE_CARRIER, 2, length(UNIQUE_CARRIER) -1) AS unique_carrier,
		    substring(CARRIER, 2, length(CARRIER) -1) AS carrier,
		    substring(FL_NUM, 2, length(FL_NUM) -1) AS flight_num,
		    ORIGIN_AIRPORT_ID AS origin_airport_id,
		    substring(ORIGIN, 2, length(ORIGIN) -1) AS origin_airport_code,
		    substring(ORIGIN_CITY_NAME, 2) AS origin_city_name,
		    substring(ORIGIN_STATE_ABR, 2, length(ORIGIN_STATE_ABR) -1)  AS origin_state_abr,
		    DEST_AIRPORT_ID AS dest_airport_id,
		    substring(DEST, 2, length(DEST) -1) AS dest_airport_code,
		    substring(DEST_CITY_NAME,2) AS dest_city_name,
		    substring(DEST_STATE_ABR, 2, length(DEST_STATE_ABR) -1) AS dest_state_abr,
		    DEP_DELAY_NEW AS dep_delay_new,
		    ARR_DELAY_NEW AS arr_delay_new,
		    CARRIER_DELAY AS carrier_delay,
		    WEATHER_DELAY AS weather_delay,
		    NAS_DELAY AS nas_delay,
		    SECURITY_DELAY AS security_delay,
		    LATE_AIRCRAFT_DELAY AS late_aircraft_delay
		FROM delays_raw;
		
2. Use __Ctrl + X__, then __Y__ to save the file.

3. Use the following to start Hive and run the __flightdelays.hql__ file:

        beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -n admin -f flightdelays.hql
		
	> [AZURE.NOTE] In this example, `localhost` is used since you are connected to the head node of the HDInsight cluster, which is where HiveServer2 is running.

4. Use the following command to open an interactive Beeline session:

        beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -n admin

5. When you receive the `jdbc:hive2://localhost:10001/>` prompt, use the following to retrieve data from the imported flight delay data.

		INSERT OVERWRITE DIRECTORY '/tutorials/flightdelays/output'
        ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
		SELECT regexp_replace(origin_city_name, '''', ''),
			avg(weather_delay)
		FROM delays
		WHERE weather_delay IS NOT NULL
		GROUP BY origin_city_name;

	This will retrieve a list of cities that experienced weather delays, along with the average delay time, and save it to `/tutorials/flightdelays/output`. Later, Sqoop will read the data from this location and export it to Azure SQL Database.

6. To exit Beeline, enter `!quit` at the prompt.

## Create a SQL Database

If you already have a SQL Database, you must get the server name. You can find this in the [Azure Portal](https://portal.azure.com) by selecting __SQL Databases__, and then filtering on the name of the database you wish to use. The server name is listed in the __SERVER__ column.

If you do not already have a SQL Database, use the information in [SQL Database tutorial: Create a SQL database in minutes](../sql-database/sql-database-get-started.md) to create one. You will need to save the server name used for the database.

##Create a SQL Database table

> [AZURE.NOTE] There are many ways to connect to SQL Database to create a table. The following steps use [FreeTDS](http://www.freetds.org/) from the HDInsight cluster.

1. Use SSH to connect to the Linux-based HDInsight cluster, and run the following steps from the SSH session.

3. Use the following command to install FreeTDS:

        sudo apt-get --assume-yes install freetds-dev freetds-bin

4. Once FreeTDS has been installed, use the following command to connect to the SQL Database server. Replace __serverName__ with the SQL Database server name. Replace __adminLogin__ and __adminPassword__ with the login for SQL Database. Replace __databaseName__ with the database name.

        TDSVER=8.0 tsql -H <serverName>.database.windows.net -U <adminLogin> -P <adminPassword> -p 1433 -D <databaseName>

    You will receive output similar to the following:

        locale is "en_US.UTF-8"
        locale charset is "UTF-8"
        using default charset "UTF-8"
        Default database being set to sqooptest
        1>

5. At the `1>` prompt, enter the following lines:

        CREATE TABLE [dbo].[delays](
		[origin_city_name] [nvarchar](50) NOT NULL,
		[weather_delay] float,
		CONSTRAINT [PK_delays] PRIMARY KEY CLUSTERED   
		([origin_city_name] ASC))
		GO

    When the `GO` statement is entered, the previous statements will be evaluated. This will create a new table named __delays__, with a clustered index (required by SQL Database.)

    Use the following to verify that the table has been created:

        SELECT * FROM information_schema.tables
        GO

    You should see output similar to the following:

        TABLE_CATALOG   TABLE_SCHEMA    TABLE_NAME      TABLE_TYPE
        databaseName       dbo     delays      BASE TABLE

8. Enter `exit` at the `1>` prompt to exit the tsql utility.
	
##Export data with Sqoop

2. Use the following command to verify that Sqoop can see your SQL Database:

		sqoop list-databases --connect jdbc:sqlserver://<serverName>.database.windows.net:1433 --username <adminLogin> --password <adminPassword>

	This should return a list of databases, including the database that you created the delays table in earlier.

3. Use the following command to export data from hivesampletable to the mobiledata table:

		sqoop export --connect 'jdbc:sqlserver://<serverName>.database.windows.net:1433;database=<databaseName>' --username <adminLogin> --password <adminPassword> --table 'delays' --export-dir 'wasb:///tutorials/flightdelays/output' --fields-terminated-by '\t' -m 1

	This instructs Sqoop to connect to SQL Database, to the database containing the delays table, and export data from the wasb:///tutorials/flightdelays/output (where we stored the output of the hive query earlier,) to the delays table.

4. After the command completes, use the following to connect to the database using TSQL:

		TDSVER=8.0 tsql -H <serverName>.database.windows.net -U <adminLogin> -P <adminPassword> -p 1433 -D sqooptest

	Once connected, use the following statements to verify that the data was exported to the mobiledata table:
	
		SELECT * FROM delays
		GO

	You should see a listing of data in the table. Type `exit` to exit the tsql utility.

##<a id="nextsteps"></a> Next steps

Now you understand how to upload a file to Azure Blob storage, how to populate a Hive table by using the data from Azure Blob storage, how to run Hive queries, and how to use Sqoop to export data from HDFS to an Azure SQL database. To learn more, see the following articles:

* [Getting started with HDInsight][hdinsight-get-started]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Oozie with HDInsight][hdinsight-use-oozie]
* [Use Sqoop with HDInsight][hdinsight-use-sqoop]
* [Use Pig with HDInsight][hdinsight-use-pig]
* [Develop Java MapReduce programs for HDInsight][hdinsight-develop-mapreduce]
* [Develop Python Hadoop streaming programs for HDInsight][hdinsight-develop-streaming]



[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/


[rita-website]: http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time
[cindygross-hive-tables]: http://blogs.msdn.com/b/cindygross/archive/2013/02/06/hdinsight-hive-internal-and-external-tables-intro.aspx

[hdinsight-use-oozie]: hdinsight-use-oozie-linux-mac.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-storage]: hdinsight-hadoop-use-blob-storage.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-get-started]: hdinsight-hadoop-linux-tutorial-get-started.md
[hdinsight-use-sqoop]: hdinsight-use-sqoop-mac-linux.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-develop-streaming]: hdinsight-hadoop-streaming-python.md
[hdinsight-develop-mapreduce]: hdinsight-develop-deploy-java-mapreduce-linux.md

[hadoop-hiveql]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL

[technetwiki-hive-error]: http://social.technet.microsoft.com/wiki/contents/articles/23047.hdinsight-hive-error-unable-to-rename.aspx


 
