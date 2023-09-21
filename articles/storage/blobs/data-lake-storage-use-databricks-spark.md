---
title: 'Tutorial: Azure Data Lake Storage Gen2, Azure Databricks & Spark'
titleSuffix: Azure Storage
description: This tutorial shows how to run Spark queries on an Azure Databricks cluster to access data in an Azure Data Lake Storage Gen2 storage account.
author: normesta

ms.service: azure-data-lake-storage
ms.topic: tutorial
ms.date: 02/07/2023
ms.author: normesta
ms.reviewer: dineshm
ms.custom: py-fresh-zinc
#Customer intent: As an data scientist, I want to connect my data in Azure Storage so that I can easily run analytics on it.
---

# Tutorial: Azure Data Lake Storage Gen2, Azure Databricks & Spark

This tutorial shows you how to connect your Azure Databricks cluster to data stored in an Azure storage account that has Azure Data Lake Storage Gen2 enabled. This connection enables you to natively run queries and analytics from your cluster on your data.

In this tutorial, you will:

> [!div class="checklist"]
> - Ingest unstructured data into a storage account
> - Run analytics on your data in Blob storage

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- Create a storage account that has a hierarchical namespace (Azure Data Lake Storage Gen2)

  See [Create a storage account to use with Azure Data Lake Storage Gen2](create-data-lake-storage-account.md).

- Make sure that your user account has the [Storage Blob Data Contributor role](assign-azure-role-data-access.md) assigned to it.

- Install AzCopy v10. See [Transfer data with AzCopy v10](../common/storage-use-azcopy-v10.md?toc=/azure/storage/blobs/toc.json)

- Create a service principal, create a client secret, and then grant the service principal access to the storage account.

  See [Tutorial: Connect to Azure Data Lake Storage Gen2](/azure/databricks/getting-started/connect-to-azure-storage) (Steps 1 through 3). After completing these steps, make sure to paste the tenant ID, app ID, and client secret values into a text file. You'll need those soon.

## Download the flight data

This tutorial uses flight data from the Bureau of Transportation Statistics to demonstrate how to perform an ETL operation. You must download this data to complete the tutorial.

1. Download the [On_Time_Reporting_Carrier_On_Time_Performance_1987_present_2016_1.zip](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/tutorials/On_Time_Reporting_Carrier_On_Time_Performance_1987_present_2016_1.zip) file. This file contains the flight data.

2. Unzip the contents of the zipped file and make a note of the file name and the path of the file. You need this information in a later step.

## Ingest data

### Copy source data into the storage account

Use AzCopy to copy data from your *.csv* file into your Data Lake Storage Gen2 account.

1. Open a command prompt window, and enter the following command to log into your storage account.

   ```bash
   azcopy login
   ```

   Follow the instructions that appear in the command prompt window to authenticate your user account.

2. To copy data from the *.csv* account, enter the following command.

   ```bash
   azcopy cp "<csv-folder-path>" https://<storage-account-name>.dfs.core.windows.net/<container-name>/folder1/On_Time.csv
   ```

   - Replace the `<csv-folder-path>` placeholder value with the path to the *.csv* file.

   - Replace the `<storage-account-name>` placeholder value with the name of your storage account.

   - Replace the `<container-name>` placeholder with the name of a container in your storage account.

## Create an Azure Databricks workspace, cluster, and notebook

1. Create an Azure Databricks workspace. See [Create an Azure Databricks workspace](/azure/databricks/getting-started/#--create-an-azure-databricks-workspace).

2. Create a cluster. See [Create a cluster](/azure/databricks/getting-started/quick-start#step-1-create-a-cluster).

3. Create a notebook. See [Create a notebook](/azure/databricks/notebooks/notebooks-manage#--create-a-notebook). Choose Python as the default language of the notebook.

## Create a container and mount it

1. In the **Cluster** drop-down list, make sure that the cluster you created earlier is selected.

2. Click **Create**. The notebook opens with an empty cell at the top.

3. Copy and paste the following code block into the first cell, but don't run this code yet.

    ```python
    configs = {"fs.azure.account.auth.type": "OAuth",
           "fs.azure.account.oauth.provider.type": "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider",
           "fs.azure.account.oauth2.client.id": "<appId>",
           "fs.azure.account.oauth2.client.secret": "<clientSecret>",
           "fs.azure.account.oauth2.client.endpoint": "https://login.microsoftonline.com/<tenant>/oauth2/token",
           "fs.azure.createRemoteFileSystemDuringInitialization": "true"}

    dbutils.fs.mount(
    source = "abfss://<container-name>@<storage-account-name>.dfs.core.windows.net/folder1",
    mount_point = "/mnt/flightdata",
    extra_configs = configs)
    ```

4. In this code block, replace the `appId`, `clientSecret`, `tenant`, and `storage-account-name` placeholder values in this code block with the values that you collected while completing the prerequisites of this tutorial. Replace the `container-name` placeholder value with the name of the container.

5. Press the **SHIFT + ENTER** keys to run the code in this block.

   Keep this notebook open as you will add commands to it later.

### Use Databricks Notebook to convert CSV to Parquet

In the notebook that you previously created, add a new cell, and paste the following code into that cell.

```python
# Use the previously established DBFS mount point to read the data.
# create a data frame to read data.

flightDF = spark.read.format('csv').options(
    header='true', inferschema='true').load("/mnt/flightdata/*.csv")

# read the airline csv file and write the output to parquet format for easy query.
flightDF.write.mode("append").parquet("/mnt/flightdata/parquet/flights")
print("Done")
```

## Explore data

In a new cell, paste the following code to get a list of CSV files uploaded via AzCopy.

```python
import os.path
import IPython
from pyspark.sql import SQLContext
display(dbutils.fs.ls("/mnt/flightdata"))
```

To create a new file and list files in the *parquet/flights* folder, run this script:

```python
dbutils.fs.put("/mnt/flightdata/1.txt", "Hello, World!", True)
dbutils.fs.ls("/mnt/flightdata/parquet/flights")
```

With these code samples, you have explored the hierarchical nature of HDFS using data stored in a storage account with Data Lake Storage Gen2 enabled.

## Query the data

Next, you can begin to query the data you uploaded into your storage account. Enter each of the following code blocks into **Cmd 1** and press **Cmd + Enter** to run the Python script.

To create data frames for your data sources, run the following script:

- Replace the `<csv-folder-path>` placeholder value with the path to the *.csv* file.

```python
# Copy this into a Cmd cell in your notebook.
acDF = spark.read.format('csv').options(
    header='true', inferschema='true').load("/mnt/flightdata/On_Time.csv")
acDF.write.parquet('/mnt/flightdata/parquet/airlinecodes')

# read the existing parquet file for the flights database that was created earlier
flightDF = spark.read.format('parquet').options(
    header='true', inferschema='true').load("/mnt/flightdata/parquet/flights")

# print the schema of the dataframes
acDF.printSchema()
flightDF.printSchema()

# print the flight database size
print("Number of flights in the database: ", flightDF.count())

# show the first 20 rows (20 is the default)
# to show the first n rows, run: df.show(n)
acDF.show(100, False)
flightDF.show(20, False)

# Display to run visualizations
# preferably run this in a separate cmd cell
display(flightDF)
```

Enter this script to run some basic analysis queries against the data.

```python
# Run each of these queries, preferably in a separate cmd cell for separate analysis
# create a temporary sql view for querying flight information
FlightTable = spark.read.parquet('/mnt/flightdata/parquet/flights')
FlightTable.createOrReplaceTempView('FlightTable')

# create a temporary sql view for querying airline code information
AirlineCodes = spark.read.parquet('/mnt/flightdata/parquet/airlinecodes')
AirlineCodes.createOrReplaceTempView('AirlineCodes')

# using spark sql, query the parquet file to return total flights in January and February 2016
out1 = spark.sql("SELECT * FROM FlightTable WHERE Month=1 and Year= 2016")
NumJan2016Flights = out1.count()
out2 = spark.sql("SELECT * FROM FlightTable WHERE Month=2 and Year= 2016")
NumFeb2016Flights = out2.count()
print("Jan 2016: ", NumJan2016Flights, " Feb 2016: ", NumFeb2016Flights)
Total = NumJan2016Flights+NumFeb2016Flights
print("Total flights combined: ", Total)

# List out all the airports in Texas
out = spark.sql(
    "SELECT distinct(OriginCityName) FROM FlightTable where OriginStateName = 'Texas'")
print('Airports in Texas: ', out.show(100))

# find all airlines that fly from Texas
out1 = spark.sql(
    "SELECT distinct(Reporting_Airline) FROM FlightTable WHERE OriginStateName='Texas'")
print('Airlines that fly to/from Texas: ', out1.show(100, False))
```

## Clean up resources

When they're no longer needed, delete the resource group and all related resources. To do so, select the resource group for the storage account and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Extract, transform, and load data using Apache Hive on Azure HDInsight](data-lake-storage-tutorial-extract-transform-load-hive.md)
