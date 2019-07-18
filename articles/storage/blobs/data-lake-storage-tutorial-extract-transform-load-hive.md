---
title: 'Tutorial: Perform extract, transform, load (ETL) operations by using Apache Hive on Azure HDInsight'
description: In this tutorial, you learn how to extract data from a raw CSV dataset, transform it by using Apache Hive on Azure HDInsight, and then load the transformed data into Azure SQL Database by using Sqoop.
services: storage
author: normesta

ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: tutorial
ms.date: 02/21/2019
ms.author: normesta
ms.reviewer: jamesbak
#Customer intent: As an analytics user, I want to perform an ETL operation so that I can work with my data in my preferred environment.
---

# Tutorial: Extract, transform, and load data by using Apache Hive on Azure HDInsight

In this tutorial, you perform an ETL operation: extract, transform, and load data. You take a raw CSV data file, import it into an Azure HDInsight cluster, transform it with Apache Hive, and load it into an Azure SQL database with Apache Sqoop.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Extract and upload the data to an HDInsight cluster.
> * Transform the data by using Apache Hive.
> * Load the data to an Azure SQL database by using Sqoop.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

* **An Azure Data Lake Storage Gen2 storage account that is configured for HDInsight**

    See [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2).

* **A Linux-based Hadoop cluster on HDInsight**

    See [Quickstart: Get started with Apache Hadoop and Apache Hive in Azure HDInsight using the Azure portal](https://docs.microsoft.com/azure/hdinsight/hadoop/apache-hadoop-linux-create-cluster-get-started-portal).

* **Azure SQL Database**: You use an Azure SQL database as a destination data store. If you don't have a SQL database, see [Create an Azure SQL database in the Azure portal](../../sql-database/sql-database-get-started.md).

* **Azure CLI**: If you haven't installed the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

* **A Secure Shell (SSH) client**: For more information, see [Connect to HDInsight (Hadoop) by using SSH](../../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md).

## Download the flight data

1. Browse to [Research and Innovative Technology Administration, Bureau of Transportation Statistics](https://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time).

2. On the page, select the following values:

   | Name | Value |
   | --- | --- |
   | Filter Year |2013 |
   | Filter Period |January |
   | Fields |Year, FlightDate, Reporting_Airline, IATA_CODE_Reporting_Airline, Flight_Number_Reporting_Airline, OriginAirportID, Origin, OriginCityName, OriginState, DestAirportID, Dest, DestCityName, DestState, DepDelayMinutes, ArrDelay, ArrDelayMinutes, CarrierDelay, WeatherDelay, NASDelay, SecurityDelay, LateAircraftDelay. |
   
   Clear all other fields.

3. Select **Download**. You get a .zip file with the data fields you selected.

## Extract and upload the data

In this section, you'll upload data to your HDInsight cluster and then copy that data to your Data Lake Storage Gen2 account.

1. Open a command prompt and use the following Secure Copy (Scp) command to upload the .zip file to the HDInsight cluster head node:

   ```bash
   scp <file-name>.zip <ssh-user-name>@<cluster-name>-ssh.azurehdinsight.net:<file-name.zip>
   ```

   * Replace the `<file-name>` placeholder with the name of the .zip file.
   * Replace the `<ssh-user-name>` placeholder with the SSH login for the HDInsight cluster.
   * Replace the `<cluster-name>` placeholder with the name of the HDInsight cluster.

   If you use a password to authenticate your SSH login, you're prompted for the password.

   If you use a public key, you might need to use the `-i` parameter and specify the path to the matching private key. For example, `scp -i ~/.ssh/id_rsa <file_name>.zip <user-name>@<cluster-name>-ssh.azurehdinsight.net:`.

2. After the upload has finished, connect to the cluster by using SSH. On the command prompt, enter the following command:

   ```bash
   ssh <ssh-user-name>@<cluster-name>-ssh.azurehdinsight.net
   ```

3. Use the following command to unzip the .zip file:

   ```bash
   unzip <file-name>.zip
   ```

   The command extracts a **.csv** file.

4. Use the following command to create the Data Lake Storage Gen2 file system.

   ```bash
   hadoop fs -D "fs.azure.createRemoteFileSystemDuringInitialization=true" -ls abfs://<file-system-name>@<storage-account-name>.dfs.core.windows.net/
   ```

   Replace the `<file-system-name>` placeholder with the name that you want to give your file system.

   Replace the `<storage-account-name>` placeholder with the name of your storage account.

5. Use the following command to create a directory.

   ```bash
   hdfs dfs -mkdir -p abfs://<file-system-name>@<storage-account-name>.dfs.core.windows.net/tutorials/flightdelays/data
   ```

6. Use the following command to copy the *.csv* file to the directory:

   ```bash
   hdfs dfs -put "<file-name>.csv" abfs://<file-system-name>@<storage-account-name>.dfs.core.windows.net/tutorials/flightdelays/data/
   ```

   Use quotes around the file name if the file name contains spaces or special characters.

## Transform the data

In this section, you use Beeline to run an Apache Hive job.

As part of the Apache Hive job, you import the data from the .csv file into an Apache Hive table named **delays**.

1. From the SSH prompt that you already have for the HDInsight cluster, use the following command to create and edit a new file named     **flightdelays.hql**:

   ```bash
   nano flightdelays.hql
   ```

2. Modify the following text by replace the `<file-system-name>` and `<storage-account-name>` placeholders with your file system and storage account name. Then copy and paste the text into the nano console by using pressing the SHIFT key along with the right-mouse click button.

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
    LOCATION 'abfs://<file-system-name>@<storage-account-name>.dfs.core.windows.net/tutorials/flightdelays/data';

    -- Drop the delays table if it exists
    DROP TABLE delays;
    -- Create the delays table and populate it with data
    -- pulled in from the CSV file (via the external table defined previously)
    CREATE TABLE delays
    LOCATION 'abfs://<file-system-name>@<storage-account-name>.dfs.core.windows.net/tutorials/flightdelays/processed'
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

3. Save the file by using use CTRL+X and then type `Y` when prompted.

4. To start Hive and run the **flightdelays.hql** file, use the following command:

   ```bash
   beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -f flightdelays.hql
   ```

5. After the __flightdelays.hql__ script finishes running, use the following command to open an interactive Beeline session:

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

   This query retrieves a list of cities that experienced weather delays, along with the average delay time, and saves it to `abfs://<file-system-name>@<storage-account-name>.dfs.core.windows.net/tutorials/flightdelays/output`. Later, Sqoop reads the data from this location and exports it to Azure SQL Database.

7. To exit Beeline, enter `!quit` at the prompt.

## Create a SQL database table

You need the server name from your SQL database for this operation. Complete these steps to find your server name.

1. Go to the [Azure portal](https://portal.azure.com).

2. Select **SQL Databases**.

3. Filter on the name of the database that you choose to use. The server name is listed in the **Server name** column.

4. Filter on the name of the database that you want to use. The server name is listed in the **Server name** column.

    ![Get Azure SQL server details](./media/data-lake-storage-tutorial-extract-transform-load-hive/get-azure-sql-server-details.png "Get Azure SQL server details")

    There are many ways to connect to SQL Database and create a table. The following steps use [FreeTDS](https://www.freetds.org/) from the HDInsight cluster.

5. To install FreeTDS, use the following command from an SSH connection to the cluster:

   ```bash
   sudo apt-get --assume-yes install freetds-dev freetds-bin
   ```

6. After the installation completes, use the following command to connect to the SQL Database server.

   ```bash
   TDSVER=8.0 tsql -H '<server-name>.database.windows.net' -U '<admin-login>' -p 1433 -D '<database-name>'
    ```
   * Replace the `<server-name>` placeholder with the SQL Database server name.

   * Replace the `<admin-login>` placeholder with the admin login for SQL Database.

   * Replace the `<database-name>` placeholder with the database name

   When you're prompted, enter the password for the SQL Database admin login.

   You receive output similar to the following text:

   ```
   locale is "en_US.UTF-8"
   locale charset is "UTF-8"
   using default charset "UTF-8"
   Default database being set to sqooptest
   1>
   ```

7. At the `1>` prompt, enter the following statements:

   ```hiveql
   CREATE TABLE [dbo].[delays](
   [OriginCityName] [nvarchar](50) NOT NULL,
   [WeatherDelay] float,
   CONSTRAINT [PK_delays] PRIMARY KEY CLUSTERED
   ([OriginCityName] ASC))
   GO
   ```

8. When the `GO` statement is entered, the previous statements are evaluated.

   The query creates a table named **delays**, which has a clustered index.

9. Use the following query to verify that the table is created:

   ```hiveql
   SELECT * FROM information_schema.tables
   GO
   ```

   The output is similar to the following text:

   ```
   TABLE_CATALOG   TABLE_SCHEMA    TABLE_NAME      TABLE_TYPE
   databaseName       dbo             delays        BASE TABLE
   ```

10. Enter `exit` at the `1>` prompt to exit the tsql utility.

## Export and load the data

In the previous sections, you copied the transformed data at the location  `abfs://<file-system-name>@<storage-account-name>.dfs.core.windows.net/tutorials/flightdelays/output`. In this section, you use Sqoop to export the data from `abfs://<file-system-name>@<storage-account-name>.dfs.core.windows.net/tutorials/flightdelays/output` to the table you created in the Azure SQL database.

1. Use the following command to verify that Sqoop can see your SQL database:

   ```bash
   sqoop list-databases --connect jdbc:sqlserver://<SERVER_NAME>.database.windows.net:1433 --username <ADMIN_LOGIN> --password <ADMIN_PASSWORD>
   ```

   The command returns a list of databases, including the database in which you created the **delays** table.

2. Use the following command to export data from the **hivesampletable** table to the **delays** table:

   ```bash
   sqoop export --connect 'jdbc:sqlserver://<SERVER_NAME>.database.windows.net:1433;database=<DATABASE_NAME>' --username <ADMIN_LOGIN> --password <ADMIN_PASSWORD> --table 'delays' --export-dir 'abfs://<file-system-name>@.dfs.core.windows.net/tutorials/flightdelays/output' --fields-terminated-by '\t' -m 1
   ```

   Sqoop connects to the database that contains the **delays** table, and exports data from the `/tutorials/flightdelays/output` directory to the **delays** table.

3. After the `sqoop` command finishes, use the tsql utility to connect to the database:

   ```bash
   TDSVER=8.0 tsql -H <SERVER_NAME>.database.windows.net -U <ADMIN_LOGIN> -P <ADMIN_PASSWORD> -p 1433 -D <DATABASE_NAME>
   ```

4. Use the following statements to verify that the data was exported to the **delays** table:

   ```sql
   SELECT * FROM delays
   GO
   ```

   You should see a listing of data in the table. The table includes the city name and the average flight delay time for that city.

5. Enter `exit` to exit the tsql utility.

## Clean up resources

All resources used in this tutorial are preexisting. No cleanup is necessary.

## Next steps

To learn more ways to work with data in HDInsight, see the following article:

> [!div class="nextstepaction"]
> [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
