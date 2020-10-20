---
title: 'Tutorial: ETL operations with Interactive Query - Azure HDInsight'
description: Tutorial - Learn how to extract data from a raw CSV dataset. Transform it using Interactive Query on HDInsight. Then load the transformed data into Azure SQL Database by using Apache Sqoop.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: tutorial
ms.custom: hdinsightactive,mvc
ms.date: 07/02/2019
#Customer intent: As a data analyst, I need to load some data using Interactive Query, transform, and then export it to an Azure SQL database
---

# Tutorial: Extract, transform, and load data using Interactive Query in Azure HDInsight

In this tutorial, you download a raw CSV data file of publicly available flight data. Import it into HDInsight cluster storage, and then transform the data using Interactive Query in Azure HDInsight. Once the data is transformed, you load that data into a database in Azure SQL Database using [Apache Sqoop](https://sqoop.apache.org/).

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Download the sample flight data
> * Upload data to an HDInsight cluster
> * Transform the data using Interactive Query
> * Create a table in a database in Azure SQL Database
> * Use Sqoop to export data to a database in Azure SQL Database

## Prerequisites

* An Interactive Query cluster on HDInsight. See [Create Apache Hadoop clusters using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md) and select **Interactive Query** for **Cluster type**.

* A database in Azure SQL Database. You use the database as a destination data store. If you don't have a database in Azure SQL Database, see [Create a database in Azure SQL Database in the Azure portal](/azure/sql-database/sql-database-single-database-get-started).

* An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

## Download the flight data

1. Browse to [Research and Innovative Technology Administration, Bureau of Transportation Statistics](https://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time).

2. On the page, clear all fields, and then select the following values:

   | Name | Value |
   | --- | --- |
   | Filter Year |2019 |
   | Filter Period |January |
   | Fields |`Year, FlightDate, Reporting_Airline, DOT_ID_Reporting_Airline, Flight_Number_Reporting_Airline, OriginAirportID, Origin, OriginCityName, OriginState, DestAirportID, Dest, DestCityName, DestState, DepDelayMinutes, ArrDelay, ArrDelayMinutes, CarrierDelay, WeatherDelay, NASDelay, SecurityDelay, LateAircraftDelay`. |

3. Select **Download**. You get a .zip file with the data fields you selected.

## Upload data to an HDInsight cluster

There are many ways to upload data to the storage associated with an HDInsight cluster. In this section, you use `scp` to upload data. To learn about other ways to upload data, see [Upload data to HDInsight](../hdinsight-upload-data.md).

1. Upload the .zip file to the HDInsight cluster head node. Edit the command below by replacing `FILENAME` with the name of the .zip file, and `CLUSTERNAME` with the name of the HDInsight cluster. Then open a command prompt, set your working directory to the file location, and then enter the command.

    ```cmd
    scp FILENAME.zip sshuser@CLUSTERNAME-ssh.azurehdinsight.net:FILENAME.zip
    ```

    Enter yes or no to continue if prompted. The text isn't visible in the window as you type.

2. After the upload has finished, connect to the cluster by using SSH. Edit the command below by replacing `CLUSTERNAME` with the name of the HDInsight cluster. Then enter the following command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

3. Set up environment variable once an SSH connection has been established. Replace `FILE_NAME`, `SQL_SERVERNAME`, `SQL_DATABASE`, `SQL_USER`, and `SQL_PASWORD` with the appropriate values. Then enter the command:

    ```bash
    export FILENAME=FILE_NAME
    export SQLSERVERNAME=SQL_SERVERNAME
    export DATABASE=SQL_DATABASE
    export SQLUSER=SQL_USER
    export SQLPASWORD='SQL_PASWORD'
    ```

4. Unzip the .zip file by entering the command below:

    ```bash
    unzip $FILENAME.zip
    ```

5. Create a directory on HDInsight storage, and then copy the .csv file to the directory by entering the command below:

    ```bash
    hdfs dfs -mkdir -p /tutorials/flightdelays/data
    hdfs dfs -put $FILENAME.csv /tutorials/flightdelays/data/
    ```

## Transform data using a Hive query

There are many ways to run a Hive job on an HDInsight cluster. In this section, you use [Beeline](https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Clients#HiveServer2Clients-Beeline%E2%80%93CommandLineShell)
 to run a Hive job. For information on other methods of running a Hive job, see [Use Apache Hive on HDInsight](../hadoop/hdinsight-use-hive.md).

As part of the Hive job, you import the data from the .csv file into a Hive table named **Delays**.

1. From the SSH prompt that you already have for the HDInsight cluster, use the following command to create, and edit a new file named **flightdelays.hql**:

    ```bash
    nano flightdelays.hql
    ```

2. Use the following text as the contents of this file:

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

3. To save the file, press **Ctrl + X**, then **y**, then enter.

4. To start Hive and run the **flightdelays.hql** file, use the following command:

    ```bash
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -f flightdelays.hql
    ```

5. After the **flightdelays.hql** script finishes running, use the following command to open an interactive Beeline session:

    ```bash
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http'
    ```

6. When you receive the `jdbc:hive2://localhost:10001/>` prompt, use the following query to retrieve data from the imported flight delay data:

    ```hiveql
    INSERT OVERWRITE DIRECTORY '/tutorials/flightdelays/output'
    ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
    SELECT regexp_replace(origin_city_name, '''', ''),
        avg(weather_delay)
    FROM delays
    WHERE weather_delay IS NOT NULL
    GROUP BY origin_city_name;
    ```

    This query retrieves a list of cities that experienced weather delays, along with the average delay time, and saves it to `/tutorials/flightdelays/output`. Later, Sqoop reads the data from this location and exports it to Azure SQL Database.

7. To exit Beeline, enter `!quit` at the prompt.

## Create a SQL database table

There are many ways to connect to SQL Database and create a table. The following steps use [FreeTDS](http://www.freetds.org/) from the HDInsight cluster.

1. To install FreeTDS, use the following command from the open SSH connection to the cluster:

    ```bash
    sudo apt-get --assume-yes install freetds-dev freetds-bin
    ```

2. After the installation finishes, use the following command to connect to SQL Database.

    ```bash
    TDSVER=8.0 tsql -H $SQLSERVERNAME.database.windows.net -U $SQLUSER -p 1433 -D $DATABASE -P $SQLPASWORD
    ```

    You receive output similar to the following text:

    ```
    locale is "en_US.UTF-8"
    locale charset is "UTF-8"
    using default charset "UTF-8"
    Default database being set to <yourdatabase>
    1>
    ```

3. At the `1>` prompt, enter the following lines:

    ```hiveql
    CREATE TABLE [dbo].[delays](
    [origin_city_name] [nvarchar](50) NOT NULL,
    [weather_delay] float,
    CONSTRAINT [PK_delays] PRIMARY KEY CLUSTERED
    ([origin_city_name] ASC))
    GO
    ```

    When the `GO` statement is entered, the previous statements are evaluated. This statement creates a table named **delays**, with a clustered index.

    Use the following query to verify that the table has been created:

    ```hiveql
    SELECT * FROM information_schema.tables
    GO
    ```

    The output is similar to the following text:

    ```
    TABLE_CATALOG   TABLE_SCHEMA    TABLE_NAME      TABLE_TYPE
    databaseName       dbo             delays        BASE TABLE
    ```

4. Enter `exit` at the `1>` prompt to exit the tsql utility.

## Export data to SQL Database using Apache Sqoop

In the previous sections, you copied the transformed data at `/tutorials/flightdelays/output`. In this section, you use Sqoop to export the data from `/tutorials/flightdelays/output` to the table you created in Azure SQL Database.

1. Verify that Sqoop can see your SQL database by entering the command below:

    ```bash
    sqoop list-databases --connect jdbc:sqlserver://$SQLSERVERNAME.database.windows.net:1433 --username $SQLUSER --password $SQLPASWORD
    ```

    This command returns a list of databases, including the database in which you created the `delays` table earlier.

2. Export data from `/tutorials/flightdelays/output` to the `delays` table by entering the command below:

    ```bash
    sqoop export --connect "jdbc:sqlserver://$SQLSERVERNAME.database.windows.net:1433;database=$DATABASE" --username $SQLUSER --password $SQLPASWORD --table 'delays' --export-dir '/tutorials/flightdelays/output' --fields-terminated-by '\t' -m 1
    ```

    Sqoop connects to the database that contains the `delays` table, and exports data from the `/tutorials/flightdelays/output` directory to the `delays` table.

3. After the sqoop command finishes, use the tsql utility to connect to the database by entering the command below:

    ```bash
    TDSVER=8.0 tsql -H $SQLSERVERNAME.database.windows.net -U $SQLUSER -p 1433 -D $DATABASE -P $SQLPASWORD
    ```

    Use the following statements to verify that the data was exported to the delays table:

    ```sql
    SELECT * FROM delays
    GO
    ```

    You should see a listing of data in the table. The table includes the city name and the average flight delay time for that city.

    Type `exit` to exit the tsql utility.

## Clean up resources

After you complete the tutorial, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it isn't in use. You're also charged for an HDInsight cluster, even when it isn't in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they aren't in use.

To delete a cluster, see [Delete an HDInsight cluster using your browser, PowerShell, or the Azure CLI](../hdinsight-delete-cluster.md).

## Next steps

In this tutorial, you took a raw CSV data file, imported it into an HDInsight cluster storage, and then transformed the data using Interactive Query in Azure HDInsight.  Advance to the next tutorial to learn about the Apache Hive Warehouse Connector.

> [!div class="nextstepaction"]
> [Integrate Apache Spark and Apache Hive with the Hive Warehouse Connector](./apache-hive-warehouse-connector.md)
