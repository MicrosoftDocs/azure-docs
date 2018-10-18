---
title: Access Azure Data Lake Storage Gen2 Preview data with Azure Databricks using Spark | Microsoft Docs
description: Learn to run Spark queries on a Azure Databricks cluster to access data in an Azure Data Lake Storage Gen2 storage account.
services: hdinsight,storage

author: dineshm
ms.component: data-lake-storage-gen2
ms.service: storage
ms.topic: tutorial
ms.date: 6/27/2018
ms.author: dineshm
---

# Tutorial: Access Azure Data Lake Storage Gen2 Preview data with Azure Databricks using Spark

In this tutorial, you learn how to run Spark queries on an Azure Databricks cluster to query data in Azure Data Lake Storage Gen2 Preview capable account.

> [!div class="checklist"]
> * Create a Databricks cluster
> * Ingest unstructured data into a storage account
> * Running analytics on your data in Blob storage

## Prerequisites

This tutorial demonstrates how to consume and query airline flight data, which is available from the [United States Department of Transportation](https://transtats.bts.gov/Tables.asp?DB_ID=120&DB_Name=Airline%20On-Time%20Performance%20Data&DB_Short_Name=On-Time). Download at least two years worth of airline data (selecting all fields) and save the result to your machine. Make sure to take note of the file name and path of your download; you need this information in a later step.

> [!NOTE]
> Click on the **Prezipped file** checkbox to select all data fields. The download will be many gigabytes in size, but this amount of data is necessary for analysis.

## Create an Azure Data Lake Storage Gen2 account

To begin, create a new [Azure Data Lake Storage Gen2 account](quickstart-create-account.md) and give it a unique name. Then navigate to the storage account to retrieve configuration settings.

1. Under **Settings**, click  **Access keys**.
2. Click the **Copy** button next to **key1** to copy the key value.

Both the account name and key are required for later steps in this tutorial. Open a text editor and set aside the account name and key for future reference.

## Create a Databricks cluster

The next step is to create a [Databricks cluster](https://docs.azuredatabricks.net/) to create a data workspace.

1. Create a [Databricks service](https://ms.portal.azure.com/#create/Microsoft.Databricks) and name it **myFlightDataService** (make sure to check the *Pin to dashboard* checkbox as you create the service).
2. Click **Launch Workspace** to open the workspace in a new browser window.
3. Click **Clusters** in the left-hand nav bar.
4. Click **Create Cluster**.
5. Enter a **myFlightDataCluster** in the *Cluster name* field.
6. Select **Standard_D8s_v3** in the *Worker Type* field.
7. Change the **Min Workers** value to *4*.
8. Click **Create Cluster** at the top of the page (this process may take up to 5 minutes to complete).
9. When the process completes, select **Azure Databricks** on the top left of the nav bar.
10. Select **Notebook** under the **New** section on the bottom half of the page.
11. Enter a name of your choice in the **Name** field and select **Python** as the language.
12. All other fields can be left as default values.
13. Select **Create**.
14. Paste the following code into the **Cmd 1** cell, replace the values with the values you preserved from your storage account.

    ```bash
    spark.conf.set("fs.azure.account.key.<account_name>.dfs.core.windows.net", "<account_key>") 
    spark.conf.set("fs.azure.createRemoteFileSystemDuringInitialization", "true")
    dbutils.fs.ls("abfss://<file_system>@<account_name>.dfs.core.windows.net/")
    spark.conf.set("fs.azure.createRemoteFileSystemDuringInitialization", "false")
    ```

## Ingest data

### Copy source data into the storage account

The next task is to use AzCopy to copy data from the *.csv* file into Azure storage. Open a command prompt window and enter the following commands. Make sure you replace the placeholders `<DOWNLOAD_FILE_PATH>`,  , and `<ACCOUNT_KEY>` with the corresponding values you set aside in a previous step.

```bash
set ACCOUNT_NAME=<ACCOUNT_NAME>
set ACCOUNT_KEY=<ACCOUNT_KEY>
azcopy cp "<DOWNLOAD_FILE_PATH>" https://<ACCOUNT_NAME>.dfs.core.windows.net/dbricks/folder1/On_Time --recursive 
```

### Use Databricks Notebook to convert CSV to Parquet

Reopen Databricks in your browser and execute the following steps:

1. Select **Azure Databricks** on the top left of the nav bar.
2. Select **Notebook** under the **New** section on the bottom half of the page.
3. Enter **CSV2Parquet** in the **Name** field.
4. All other fields can be left as default values.
5. Select **Create**.
6. Paste the following code into the **Cmd 1** cell (this code auto-saves in the editor).

    ```python
    #mount Azure Blob Storage as an HDFS file system to your databricks cluster
    #you need to specify a storage account and container to connect to. 
    #use a SAS token or an account key to connect to Blob Storage.  
    accountname = "<insert account name>"
    accountkey = " <insert account key>"
    fullname = "fs.azure.account.key." +accountname+ ".dfs.core.windows.net"
    accountsource = "abfs://dbricks@" +accountname+ ".dfs.core.windows.net/folder1"
    #create a dataframe to read data
    flightDF = spark.read.format('csv').options(header='true', inferschema='true').load(accountsource + "/On_Time_On_Time*.csv")
    #read the all the airline csv files and write the output to parquet format for easy query
    flightDF.write.mode("append").parquet(accountsource + '/parquet/flights')

    #read the flight details parquet file 
    #flightDF = spark.read.format('parquet').options(header='true', inferschema='true').load(accountsource + "/parquet/flights")
    print("Done")
    ```

## Explore data using Hadoop Distributed File System

Return to the Databricks workspace and click on the **Recent** icon in the left navigation bar.

1. Click on the **Flight Data Analytics** notebook.
2. Press **Ctrl + Alt + N** to create a new cell.

Enter each of the following code blocks into **Cmd 1** and press **Cmd + Enter** to run the Python script.

To get a list of CSV files uploaded via AzCopy, run the following script:

```python
import os.path
import IPython
from pyspark.sql import SQLContext
source = "abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/"
dbutils.fs.ls(source + "/temp")
display(dbutils.fs.ls(source + "/temp/"))
```

To create a new file and list files in the *parquet/flights* folder, run this script:

```python
source = "abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/"

dbutils.fs.help()

dbutils.fs.put(source + "/temp/1.txt", "Hello, World!", True)
dbutils.fs.ls(source + "/temp/parquet/flights")
```
With these code samples, you have explored the hierarchical nature of HDFS using data stored in an Azure Data Lake Storage Gen2 capable account.

## Query the data

Next, you can begin to query the data you uploaded into Azure Data Lake Storage. Enter each of the following code blocks into **Cmd 1** and press **Cmd + Enter** to run the Python script.

### Simple queries

To create dataframes for your data sources, run the following script:

> [!IMPORTANT]
> Make sure to replace the **<YOUR_CSV_FILE_NAME>** placeholder with the file name you downloaded at the beginning of this tutorial.

```python
#Copy this into a Cmd cell in your notebook.
acDF = spark.read.format('csv').options(header='true', inferschema='true').load(accountsource + "/<YOUR_CSV_FILE_NAME>.csv")
acDF.write.parquet(accountsource + '/parquet/airlinecodes')

#read the existing parquet file for the flights database that was created earlier
flightDF = spark.read.format('parquet').options(header='true', inferschema='true').load(accountsource + "/parquet/flights")

#print the schema of the dataframes
acDF.printSchema()
flightDF.printSchema()

#print the flight database size
print("Number of flights in the database: ", flightDF.count())

#show the first 20 rows (20 is the default)
#to show the first n rows, run: df.show(n)
acDF.show(100, False)
flightDF.show(20, False)

#Display to run visualizations
#preferrably run this in a separate cmd cell
display(flightDF)
```

To run analysis queries against the data, run the following script:

```python
#Run each of these queries, preferrably in a separate cmd cell for separate analysis
#create a temporary sql view for querying flight information
FlightTable = spark.read.parquet(accountsource + '/parquet/flights')
FlightTable.createOrReplaceTempView('FlightTable')

#create a temporary sql view for querying airline code information
AirlineCodes = spark.read.parquet(accountsource + '/parquet/airlinecodes')
AirlineCodes.createOrReplaceTempView('AirlineCodes')

#using spark sql, query the parquet file to return total flights in January and February 2016
out1 = spark.sql("SELECT * FROM FlightTable WHERE Month=1 and Year= 2016")
NumJan2016Flights = out1.count()
out2 = spark.sql("SELECT * FROM FlightTable WHERE Month=2 and Year= 2016")
NumFeb2016Flights=out2.count()
print("Jan 2016: ", NumJan2016Flights," Feb 2016: ",NumFeb2016Flights)
Total= NumJan2016Flights+NumFeb2016Flights
print("Total flights combined: ", Total)

# List out all the airports in Texas
out = spark.sql("SELECT distinct(OriginCityName) FROM FlightTable where OriginStateName = 'Texas'") 
print('Airports in Texas: ', out.show(100))

#find all airlines that fly from Texas
out1 = spark.sql("SELECT distinct(Carrier) FROM FlightTable WHERE OriginStateName='Texas'")
print('Airlines that fly to/from Texas: ', out1.show(100, False))
```
### Complex queries

To execute the following more complex queries, run each segment at a time in the notebook and inspect the results.

```python
#find the airline with the most flights

#create a temporary view to hold the flight delay information aggregated by airline, then select the airline name from the Airlinecodes dataframe
spark.sql("DROP VIEW IF EXISTS v")
spark.sql("CREATE TEMPORARY VIEW v AS SELECT Carrier, count(*) as NumFlights from FlightTable group by Carrier, UniqueCarrier order by NumFlights desc LIMIT 10")
output = spark.sql("SELECT AirlineName FROM AirlineCodes WHERE AirlineCode in (select Carrier from v)")

#show the top row without truncation
output.show(1, False)

#show the top 10 airlines
output.show(10, False)

#Determine which is the least on time airline

#create a temporary view to hold the flight delay information aggregated by airline, then select the airline name from the Airlinecodes dataframe
spark.sql("DROP VIEW IF EXISTS v")
spark.sql("CREATE TEMPORARY VIEW v AS SELECT Carrier, count(*) as NumFlights from FlightTable WHERE DepDelay>60 or ArrDelay>60 group by Carrier, UniqueCarrier order by NumFlights desc LIMIT 10")
output = spark.sql("select * from v")
#output = spark.sql("SELECT AirlineName FROM AirlineCodes WHERE AirlineCode in (select Carrier from v)")
#show the top row without truncation
output.show(1, False)

#which airline improved its performance
#find the airline with the most improvement in delays
#create a temporary view to hold the flight delay information aggregated by airline, then select the airline name from the Airlinecodes dataframe
spark.sql("DROP VIEW IF EXISTS v1")
spark.sql("DROP VIEW IF EXISTS v2")
spark.sql("CREATE TEMPORARY VIEW v1 AS SELECT Carrier, count(*) as NumFlights from FlightTable WHERE (DepDelay>0 or ArrDelay>0) and Year=2016 group by Carrier order by NumFlights desc LIMIT 10")
spark.sql("CREATE TEMPORARY VIEW v2 AS SELECT Carrier, count(*) as NumFlights from FlightTable WHERE (DepDelay>0 or ArrDelay>0) and Year=2017 group by Carrier order by NumFlights desc LIMIT 10")
output = spark.sql("SELECT distinct ac.AirlineName, v1.Carrier, v1.NumFlights, v2.NumFlights from v1 INNER JOIN v2 ON v1.Carrier = v2.Carrier INNER JOIN AirlineCodes ac ON v2.Carrier = ac.AirlineCode WHERE v1.NumFlights > v2.NumFlights")
#show the top row without truncation
output.show(10, False)

#display for visual analysis
display(output)
```

## Next steps

* [Extract, transform, and load data using Apache Hive on Azure HDInsight](tutorial-extract-transform-load-hive.md)
