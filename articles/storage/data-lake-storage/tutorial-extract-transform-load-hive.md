---
title: 'Tutorial: Perform extract, transform, load (ETL) operations using Hive on HDInsight - Azure'
description: Learn how to extract data from a raw CSV dataset, transform it using Hive on HDInsight, and then load the transformed data into Azure SQL database by using Sqoop.
services: storage
author: jamesbak
tags: azure-portal
ms.component: data-lake-storage-gen2
ms.service: storage
ms.topic: tutorial
ms.date: 06/27/2018
ms.author: jamesbak
ms.custom: H1Hack27Feb2017,hdinsightactive,mvc
---

# Tutorial: Extract, transform, and load data using Apache Hive on Azure HDInsight

In this tutorial, you take a raw CSV data file, import it into an HDInsight cluster, and then transform the data using Apache Hive on Azure HDInsight. Once the data is transformed, you load that data into an Azure SQL database using Apache Sqoop. This article, uses publicly available flight data.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Download the sample flight data
> * Upload data to an HDInsight cluster
> * Transform the data using Hive
> * Create a table in Azure SQL database
> * Use Sqoop to export data to Azure SQL database


The following illustration shows a typical ETL application flow.

![ETL operation using Apache Hive on Azure HDInsight](./media/tutorial-extract-transform-load-hive/hdinsight-etl-architecture.png "ETL operation using Apache Hive on Azure HDInsight")

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

* **A Linux-based Hadoop cluster on HDInsight**. See [Set up clusters in HDInsight with Hadoop, Spark, Kafka, and more](./quickstart-create-connect-hdi-cluster.md) for steps on how to create a new Linux-based HDInsight cluster.

* **Azure SQL Database**. You use an Azure SQL database as a destination data store. If you don't have a SQL database, see [Create an Azure SQL database in the Azure portal](../../sql-database/sql-database-get-started.md).

* **Azure CLI**. If you haven't installed the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) for more steps.

* **An SSH client**. For more information, see [Connect to HDInsight (Hadoop) using SSH](../../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md).

> [!IMPORTANT]
> The steps in this document require an HDInsight cluster that uses Linux. Linux is the only operating system used on Azure HDInsight version 3.4 or later. For more information, see [HDInsight retirement on Windows](../../hdinsight/hdinsight-component-versioning.md#hdinsight-windows-retirement).

## Download the flight data

1. Browse to [Research and Innovative Technology Administration, Bureau of Transportation Statistics][rita-website].

2. On the page, select the following values:

   | Name | Value |
   | --- | --- |
   | Filter Year |2013 |
   | Filter Period |January |
   | Fields |Year, FlightDate, UniqueCarrier, Carrier, FlightNum, OriginAirportID, Origin, OriginCityName, OriginState, DestAirportID, Dest, DestCityName, DestState, DepDelayMinutes, ArrDelay, ArrDelayMinutes, CarrierDelay, WeatherDelay, NASDelay, SecurityDelay, LateAircraftDelay. |
   Clear all other fields

3. Select **Download**. You get a .zip file with the data fields you selected.

## Upload data to an HDInsight cluster

There are many ways to upload data to the storage associated with an HDInsight cluster. In this section, you use `scp` to upload data. To learn about other ways to upload data, see [Use Distcp to copy data between Azure Storage Blobs and Data Lake Storage Gen2 Preview](use-distcp.md).

1. Open a command prompt and use the following command to upload the .zip file to the HDInsight cluster head node:

    ```bash
    scp <FILE_NAME>.zip <SSH_USER_NAME>@<CLUSTER_NAME>-ssh.azurehdinsight.net:<FILE_NAME.zip>
    ```

    Replace *FILE_NAME* with the name of the .zip file. Replace *SSH_USER_NAME* with the SSH login for the HDInsight cluster. Replace *CLUSTER_NAME* with the name of the HDInsight cluster.

   > [!NOTE]
   > If you use a password to authenticate your SSH login, you're prompted for the password. If you use a public key, you might need to use the `-i` parameter and specify the path to the matching private key. For example, `scp -i ~/.ssh/id_rsa FILE_NAME.zip USER_NAME@CLUSTER_NAME-ssh.azurehdinsight.net:`.

2. After the upload has finished, connect to the cluster by using SSH. On the command prompt, enter the following command:

    ```bash
    ssh <SSH_USER_NAME>@<CLUSTER_NAME>-ssh.azurehdinsight.net
    ```

3. Use the following command to unzip the .zip file:

    ```bash
    unzip <FILE_NAME>.zip
    ```

    This command extracts a *.csv* file that is roughly 60 MB.

4. Use the following commands to create a directory, and copy the *.csv* file to the directory:

    ```bash
    hdfs dfs -mkdir -p abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/tutorials/flightdelays/data
    hdfs dfs -put <FILE_NAME>.csv abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/tutorials/flightdelays/data/
    ```

5. Create the Data Lake Storage Gen2 file system.

    ```bash
    hadoop fs -D "fs.azure.createRemoteFileSystemDuringInitialization=true" -ls abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/
    ```

## Transform data using a Hive query

There are many ways to run a Hive job on an HDInsight cluster. In this section, you use Beeline to run a Hive job. For information on other methods of running a Hive job, see [Use Hive on HDInsight](../../hdinsight/hadoop/hdinsight-use-hive.md).

As part of the Hive job, you import the data from the .csv file into a Hive table named **Delays**.

1. From the SSH prompt that you already have for the HDInsight cluster, use the following command to create and edit a new file named **flightdelays.hql**:

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
    LOCATION 'abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/tutorials/flightdelays/data';

    -- Drop the delays table if it exists
    DROP TABLE delays;
    -- Create the delays table and populate it with data
    -- pulled in from the CSV file (via the external table defined previously)
    CREATE TABLE delays
    LOCATION abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/tutorials/flightdelays/processed
    AS
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

2. To save the file, press **Esc** and then enter `:x`.

3. To start Hive and run the **flightdelays.hql** file, use the following command:

    ```bash
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -f flightdelays.hql
    ```

4. After the __flightdelays.hql__ script finishes running, use the following command to open an interactive Beeline session:

    ```bash
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http'
    ```

5. When you receive the `jdbc:hive2://localhost:10001/>` prompt, use the following query to retrieve data from the imported flight delay data:

    ```hiveql
    INSERT OVERWRITE DIRECTORY 'abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/tutorials/flightdelays/output'
    ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
    SELECT regexp_replace(origin_city_name, '''', ''),
        avg(weather_delay)
    FROM delays
    WHERE weather_delay IS NOT NULL
    GROUP BY origin_city_name;
    ```

    This query retrieves a list of cities that experienced weather delays, along with the average delay time, and saves it to `abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/tutorials/flightdelays/output`. Later, Sqoop reads the data from this location and exports it to Azure SQL Database.

6. To exit Beeline, enter `!quit` at the prompt.

## Create a SQL database table

This section assumes that you have already created an Azure SQL database. If you don't already have a SQL database, use the information in [Create an Azure SQL database in the Azure portal](../../sql-database/sql-database-get-started.md) to create one.

If you already have a SQL database, you must get the server name. To find the server, name in the [Azure portal](https://portal.azure.com), select **SQL Databases**, and then filter on the name of the database that you choose to use. The server name is listed in the **Server name** column.

![Get Azure SQL server details](./media/tutorial-extract-transform-load-hive/get-azure-sql-server-details.png "Get Azure SQL server details")

> [!NOTE]
> There are many ways to connect to SQL Database and create a table. The following steps use [FreeTDS](http://www.freetds.org/) from the HDInsight cluster.


1. To install FreeTDS, use the following command from an SSH connection to the cluster:

    ```bash
    sudo apt-get --assume-yes install freetds-dev freetds-bin
    ```

3. After the installation finishes, use the following command to connect to the SQL Database server. Replace **serverName** with the SQL Database server name. Replace **adminLogin** and **adminPassword** with the login for SQL Database. Replace **databaseName** with the database name.

    ```bash
    TDSVER=8.0 tsql -H <SERVER_NAME>.database.windows.net -U <ADMIN_LOGIN> -p 1433 -D <DATABASE_NAME>
    ```

    When prompted, enter the password for the SQL Database admin login.

    You receive output similar to the following text:

    ```
    locale is "en_US.UTF-8"
    locale charset is "UTF-8"
    using default charset "UTF-8"
    Default database being set to sqooptest
    1>
    ```

4. At the `1>` prompt, enter the following lines:

    ```hiveql
    CREATE TABLE [dbo].[delays](
    [origin_city_name] [nvarchar](50) NOT NULL,
    [weather_delay] float,
    CONSTRAINT [PK_delays] PRIMARY KEY CLUSTERED   
    ([origin_city_name] ASC))
    GO
    ```

    When the `GO` statement is entered, the previous statements are evaluated. This query creates a table named **delays**, with a clustered index.

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

5. Enter `exit` at the `1>` prompt to exit the tsql utility.


## Export data to SQL database using Sqoop

In the previous sections, you copied the transformed data at `abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/tutorials/flightdelays/output`. In this section, you use Sqoop to export the data from `abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/tutorials/flightdelays/output` to the table you created in Azure SQL database. 

1. Use the following command to verify that Sqoop can see your SQL database:

    ```bash
    sqoop list-databases --connect jdbc:sqlserver://<SERVER_NAME>.database.windows.net:1433 --username <ADMIN_LOGIN> --password <ADMIN_PASSWORD>
    ```

    This command returns a list of databases, including the database in which you created the delays table earlier.

2. Use the following command to export data from hivesampletable to the delays table:

    ```bash
    sqoop export --connect 'jdbc:sqlserver://<SERVER_NAME>.database.windows.net:1433;database=<DATABASE_NAME>' --username <ADMIN_LOGIN> --password <ADMIN_PASSWORD> --table 'delays' --export-dir 'abfs://<FILE_SYSTEM_NAME>@.dfs.core.windows.net/tutorials/flightdelays/output' 
    --fields-terminated-by '\t' -m 1
    ```

    Sqoop connects to the database that contains the delays table, and exports data from the `/tutorials/flightdelays/output` directory to the delays table.

3. After the sqoop command finishes, use the tsql utility to connect to the database:

    ```bash
    TDSVER=8.0 tsql -H <SERVER_NAME>.database.windows.net -U <ADMIN_LOGIN> -P <ADMIN_PASSWORD> -p 1433 -D <DATABASE_NAME>
    ```

    Use the following statements to verify that the data was exported to the delays table:

    ```sql
    SELECT * FROM delays
    GO
    ```

    You should see a listing of data in the table. The table includes the city name and the average flight delay time for that city. 

    Type `exit` to exit the tsql utility.

## Next steps

To learn more ways to work with data in HDInsight, see the following articles:

* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Pig with HDInsight][hdinsight-use-pig]
* [Develop Java MapReduce programs for Hadoop on HDInsight][hdinsight-develop-mapreduce]
* [Develop Python streaming MapReduce programs for HDInsight][hdinsight-develop-streaming]
* [Use Oozie with HDInsight][hdinsight-use-oozie]
* [Use Sqoop with HDInsight][hdinsight-use-sqoop]

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[rita-website]: http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time
[cindygross-hive-tables]: http://blogs.msdn.com/b/cindygross/archive/2013/02/06/hdinsight-hive-internal-and-external-tables-intro.aspx

[hdinsight-use-oozie]: ../../hdinsight/hdinsight-use-oozie-linux-mac.md
[hdinsight-use-hive]:../../hdinsight/hadoop/hdinsight-use-hive.md
[hdinsight-provision]: ../../hdinsight/hdinsight-hadoop-provision-linux-clusters.md
[hdinsight-storage]: ../../hdinsight/hdinsight-hadoop-use-blob-storage.md
[hdinsight-upload-data]: ../../hdinsight/hdinsight-upload-data.md
[hdinsight-get-started]: ../../hdinsight/hadoop/apache-hadoop-linux-tutorial-get-started.md
[hdinsight-use-sqoop]:../../hdinsight/hadoop/apache-hadoop-use-sqoop-mac-linux.md
[hdinsight-use-pig]:../../hdinsight/hadoop/hdinsight-use-pig.md
[hdinsight-develop-streaming]:../../hdinsight/hadoop/apache-hadoop-streaming-python.md
[hdinsight-develop-mapreduce]:../../hdinsight/hadoop/apache-hadoop-develop-deploy-java-mapreduce-linux.md

[hadoop-hiveql]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL

[technetwiki-hive-error]: http://social.technet.microsoft.com/wiki/contents/articles/23047.hdinsight-hive-error-unable-to-rename.aspx
