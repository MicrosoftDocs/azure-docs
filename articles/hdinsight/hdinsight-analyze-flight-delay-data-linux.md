---
title: Analyze flight delay data with Hive on HDInsight - Azure | Microsoft Docs
description: Learn how to use Hive to analyze flight data on Linux-based HDInsight, then export the data to SQL Database using Sqoop.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 0c23a079-981a-4079-b3f7-ad147b4609e5
ms.service: hdinsight
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/04/2017
ms.author: larryfr

ms.custom: H1Hack27Feb2017,hdinsightactive
---
# Analyze flight delay data by using Hive on Linux-based HDInsight

Learn how to analyze flight delay data using Hive on Linux-based HDInsight then export the data to Azure SQL Database using Sqoop.

> [!IMPORTANT]
> The steps in this document require an HDInsight cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement).

### Prerequisites

* **An HDInsight cluster**. See [Get started using Hadoop with Hive in HDInsight on Linux](hdinsight-hadoop-linux-tutorial-get-started.md) for steps on creating a new Linux-based HDInsight cluster.

* **Azure SQL Database**. You use an Azure SQL database as a destination data store. If you do not have a SQL Database already, see [SQL Database tutorial: Create a SQL database in minutes](../sql-database/sql-database-get-started.md).

* **Azure CLI**. If you have not installed the Azure CLI, see [Install and Configure the Azure CLI](../cli-install-nodejs.md) for more steps.

## Download the flight data

1. Browse to [Research and Innovative Technology Administration, Bureau of Transportation Statistics][rita-website].

2. On the page, select the following values:

   | Name | Value |
   | --- | --- |
   | Filter Year |2013 |
   | Filter Period |January |
   | Fields |Year, FlightDate, UniqueCarrier, Carrier, FlightNum, OriginAirportID, Origin, OriginCityName, OriginState, DestAirportID, Dest, DestCityName, DestState, DepDelayMinutes, ArrDelay, ArrDelayMinutes, CarrierDelay, WeatherDelay, NASDelay, SecurityDelay, LateAircraftDelay. Clear all other fields |

3. Click **Download**.

## Upload the data

1. Use the following command to upload the zip file to the HDInsight cluster head node:

    ```
    scp FILENAME.zip USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:
    ```

    Replace **FILENAME** with the name of the zip file. Replace **USERNAME** with the SSH login for the HDInsight cluster. Replace CLUSTERNAME with the name of the HDInsight cluster.

   > [!NOTE]
   > If you use a password to authenticate your SSH login, you are prompted for the password. If you used a public key, you may need to use the `-i` parameter and specify the path to the matching private key. For example, `scp -i ~/.ssh/id_rsa FILENAME.zip USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:`.

2. Once the upload has completed, connect to the cluster using SSH:

    ```ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net```

    For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

3. Once connected, use the following to unzip the .zip file:

    ```
    unzip FILENAME.zip
    ```

    This command extracts a .csv file that is roughly 60 MB.

4. Use the following command to create a directory on HDInsight storage, and then copy the file to the directory:

    ```
    hdfs dfs -mkdir -p /tutorials/flightdelays/data
    hdfs dfs -put FILENAME.csv /tutorials/flightdelays/data/
    ```

## Create and run the HiveQL

Use the following steps to import data from the CSV file into a Hive table named **Delays**.

1. Use the following command to create and edit a new file named **flightdelays.hql**:

    ```
    nano flightdelays.hql
    ```

    Use the following text as the contents of this file:

    ```hiveql
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
    ```

2. To save the file, use **Ctrl + X**, then **Y** .

3. To start Hive and run the **flightdelays.hql** file, use the following command:

    ```
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -n admin -f flightdelays.hql
    ```

   > [!NOTE]
   > In this example, `localhost` is used since you are connected to the head node of the HDInsight cluster, which is where HiveServer2 is running.

4. Once the __flightdelays.hql__ script finishes running, use the following command to open an interactive Beeline session:

    ```
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -n admin
    ```

5. When you receive the `jdbc:hive2://localhost:10001/>` prompt, use the following query to retrieve data from the imported flight delay data.

    ```hiveql
    INSERT OVERWRITE DIRECTORY '/tutorials/flightdelays/output'
    ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
    SELECT regexp_replace(origin_city_name, '''', ''),
        avg(weather_delay)
    FROM delays
    WHERE weather_delay IS NOT NULL
    GROUP BY origin_city_name;
    ```

    This query retrieves a list of cities that experienced weather delays, along with the average delay time, and save it to `/tutorials/flightdelays/output`. Later, Sqoop reads the data from this location and export it to Azure SQL Database.

6. To exit Beeline, enter `!quit` at the prompt.

## Create a SQL Database

If you already have a SQL Database, you must get the server name. You can find the server name in the [Azure portal](https://portal.azure.com) by selecting **SQL Databases**, and then filtering on the name of the database you wish to use. The server name is listed in the **SERVER** column.

If you do not already have a SQL Database, use the information in [SQL Database tutorial: Create a SQL database in minutes](../sql-database/sql-database-get-started.md) to create one. Save the server name used for the database.

## Create a SQL Database table

> [!NOTE]
> There are many ways to connect to SQL Database and create a table. The following steps use [FreeTDS](http://www.freetds.org/) from the HDInsight cluster.


1. Use SSH to connect to the Linux-based HDInsight cluster, and run the following steps from the SSH session.

2. Use the following command to install FreeTDS:

    ```
    sudo apt-get --assume-yes install freetds-dev freetds-bin
    ```

3. Once the install completes, use the following command to connect to the SQL Database server. Replace **serverName** with the SQL Database server name. Replace **adminLogin** and **adminPassword** with the login for SQL Database. Replace **databaseName** with the database name.

    ```
    TDSVER=8.0 tsql -H <serverName>.database.windows.net -U <adminLogin> -P <adminPassword> -p 1433 -D <databaseName>
    ```

    You receive output similar to the following text:

    ```
    locale is "en_US.UTF-8"
    locale charset is "UTF-8"
    using default charset "UTF-8"
    Default database being set to sqooptest
    1>
    ```

4. At the `1>` prompt, enter the following lines:

    ```
    CREATE TABLE [dbo].[delays](
    [origin_city_name] [nvarchar](50) NOT NULL,
    [weather_delay] float,
    CONSTRAINT [PK_delays] PRIMARY KEY CLUSTERED   
    ([origin_city_name] ASC))
    GO
    ```

    When the `GO` statement is entered, the previous statements are evaluated. This query creates a table named **delays**, with a clustered index.

    Use the following query to verify that the table has been created:

    ```
    SELECT * FROM information_schema.tables
    GO
    ```

    The output is similar to the following text:

    ```
    TABLE_CATALOG   TABLE_SCHEMA    TABLE_NAME      TABLE_TYPE
    databaseName       dbo     delays      BASE TABLE
    ```

5. Enter `exit` at the `1>` prompt to exit the tsql utility.

## Export data with Sqoop

1. Use the following command to verify that Sqoop can see your SQL Database:

    ```
    sqoop list-databases --connect jdbc:sqlserver://<serverName>.database.windows.net:1433 --username <adminLogin> --password <adminPassword>
    ```

    This command returns a list of databases, including the database that you created the delays table in earlier.

2. Use the following command to export data from hivesampletable to the mobiledata table:

    ```
    sqoop export --connect 'jdbc:sqlserver://<serverName>.database.windows.net:1433;database=<databaseName>' --username <adminLogin> --password <adminPassword> --table 'delays' --export-dir '/tutorials/flightdelays/output' --fields-terminated-by '\t' -m 1
    ```

    Sqoop connects to the database containing the delays table, and exports data from the `/tutorials/flightdelays/output` directory to the delays table.

3. After the command completes, use the following to connect to the database using TSQL:

    ```
    TDSVER=8.0 tsql -H <serverName>.database.windows.net -U <adminLogin> -P <adminPassword> -p 1433 -D <databaseName>
    ```

    Once connected, use the following statements to verify that the data was exported to the mobiledata table:

    ```
    SELECT * FROM delays
    GO
    ```

    You should see a listing of data in the table. Type `exit` to exit the tsql utility.

## <a id="nextsteps"></a> Next steps

To learn more ways to work with data in HDInsight, see the following documents:

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
[hdinsight-provision]: hdinsight-hadoop-provision-linux-clusters.md
[hdinsight-storage]: hdinsight-hadoop-use-blob-storage.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-get-started]: hdinsight-hadoop-linux-tutorial-get-started.md
[hdinsight-use-sqoop]: hdinsight-use-sqoop-mac-linux.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-develop-streaming]: hdinsight-hadoop-streaming-python.md
[hdinsight-develop-mapreduce]: hdinsight-develop-deploy-java-mapreduce-linux.md

[hadoop-hiveql]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL

[technetwiki-hive-error]: http://social.technet.microsoft.com/wiki/contents/articles/23047.hdinsight-hive-error-unable-to-rename.aspx
