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

This tutorial uses on-time performance flight data for January 2016 from the Bureau of Transportation Statistics to demonstrate how to perform an ETL operation. You must download this data to complete the tutorial.

1. Download the [On_Time_Reporting_Carrier_On_Time_Performance_1987_present_2016_1.zip](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/tutorials/On_Time_Reporting_Carrier_On_Time_Performance_1987_present_2016_1.zip) file. This file contains the flight data.

2. Unzip the contents of the zipped file and make a note of the file name and the path of the file. You need this information in a later step.

If you want to learn about the information captured in the on-time reporting performance data, you can see the [field descriptions](https://www.transtats.bts.gov/Fields.asp?gnoyr_VQ=FGJ) on the Bureau of Transportation Statistics website.  

## Create an Azure Databricks workspace, cluster, and notebook

1. Create an Azure Databricks workspace. See [Create an Azure Databricks workspace](/azure/databricks/getting-started/#--create-an-azure-databricks-workspace).

2. Create a cluster. See [Create a cluster](/azure/databricks/getting-started/quick-start#step-1-create-a-cluster).

3. Create a notebook. See [Create a notebook](/azure/databricks/notebooks/notebooks-manage#--create-a-notebook). Choose Python as the default language of the notebook.

Keep your notebook open. You use it in the following sections.

## Ingest data

### Upload the flight data into your storage account

Use AzCopy to copy data from your *.csv* file into your Data Lake Storage Gen2 account. You use the `azcopy make` command to create a container in your storage account. Then you use the `azcopy copy` command to copy the *csv* data you just downloaded to a directory in that container.

In the following steps, you need to enter names for the container you want to create, and the directory and blob that you want to upload the flight data to in the container. You can use the suggested names in each step or specify your own observing the [naming conventions for containers, directories, and blobs](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

1. Open a command prompt window, and enter the following command to log in Azure Active Directory to access your storage account.

   ```bash
   azcopy login
   ```

   Follow the instructions that appear in the command prompt window to authenticate your user account.

1. To create a container in your storage account to store the flight data, enter the following command:

   ```bash
   azcopy create  "https://<storage-account-name>.dfs.core.windows.net/<container-name>" 
   ```

   - Replace the `<storage-account-name>` placeholder value with the name of your storage account.

   - Replace the `<container-name>` placeholder with a name for the container you want to create to store the *csv* data; for example, *flight-data-container*.

1. To upload (copy) the *csv* data to your storage account, enter the following command.

   ```bash
   azcopy copy "<csv-folder-path>" https://<storage-account-name>.dfs.core.windows.net/<container-name>/<folder-name>/On_Time.csv
   ```

   - Replace the `<csv-folder-path>` placeholder value with the path to the *.csv* file.

   - Replace the `<storage-account-name>` placeholder value with the name of your storage account.

   - Replace the `<container-name>` placeholder with the name of the container in your storage account.

   - Replace the `<directory-name>` placeholder with the name of a directory to store your data in the container; for example, *jan2016*.

### Mount your Azure Datalake Gen2 storage account to your Databricks cluster

In this section, you mount your ADLS Gen 2 cloud object storage to the Databricks File System (DBFS). You use the Azure AD service principle you created previously for authentication with the storage account.

The commands in this section make the container and directory in your storage account accessible in your cluster through the mount point */mnt/flightdata*. For more information, see [Mounting cloud object storage on Azure Databricks](/azure/databricks/dbfs/mounts).

To run the commands, you need:

- The name of the storage account you created in the prerequisites.
- The application ID, tenant ID, and client secret you copied when you created the service principal and granted it access to your storage account in the prerequisites.
- The name of the container and the directory that you created when you uploaded the flight data to your storage account.

1. In the **Cluster** drop-down list, make sure that the cluster you created earlier is selected.

2. Click **Create**. The notebook opens with an empty cell at the top.

3. Copy and paste the following code block into the first cell, but don't run this code yet.

    ```python
    configs = {"fs.azure.account.auth.type": "OAuth",
           "fs.azure.account.oauth.provider.type": "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider",
           "fs.azure.account.oauth2.client.id": "<appId>",
           "fs.azure.account.oauth2.client.secret": "<clientSecret>",
           "fs.azure.account.oauth2.client.endpoint": "https://login.microsoftonline.com/<tenantId>/oauth2/token",
           "fs.azure.createRemoteFileSystemDuringInitialization": "true"}

    dbutils.fs.mount(
    source = "abfss://<container-name>@<storage-account-name>.dfs.core.windows.net/<directory-name>",
    mount_point = "/mnt/flightdata",
    extra_configs = configs)
    ```

4. In this code block, replace the `<appId>`, `<clientSecret>`, `<tenantId>`, and `<storage-account-name>` placeholder values in this code block with the values that you collected while completing the prerequisites of this tutorial. Replace the `<container-name>` and `<directory-name>` placeholder values with the name of the container and directory you specified when you uploaded the flight data to your storage account.

5. Press the **SHIFT + ENTER** keys to run the code in this block.

### Use Databricks Notebook to convert CSV to Parquet

Now that our *csv* flight data is accessible through a DBFS mount point, we'll use an Apache DataFrame to load it into our workspace and write it back to our ADLs Gen 2 object store in parquet format.

Apache Spark DataFrames provide a rich set of functions (select columns, filter, join, aggregate) that allow you to solve common data analysis problems efficiently. A DataFrame is a two-dimensional labeled data structure with columns of potentially different types. You can use a DataFrame to easily read and write data in a variety of supported formats. To learn more, see [What is a DataFrame?](/azure/databricks/getting-started/dataframes-python#what-is-a-dataframe).

In the notebook, add a new cell, and paste the following code into that cell.

```python
# Use the previously established DBFS mount point to read the data.
# create a DataFrame to read the csv data

flight_df = spark.read.format('csv').options(
    header='true', inferschema='true').load("/mnt/flightdata/*.csv")

# read the airline csv file and write the output to parquet format for easy query.
flight_df.write.mode("append").parquet("/mnt/flightdata/parquet/flights")
print("Done")
```

Press the **SHIFT + ENTER** keys to run the code in this block.

## Explore data

In a new cell, paste the following code to get a list of CSV files uploaded via AzCopy.

```python
import os.path
import IPython
from pyspark.sql import SQLContext
display(dbutils.fs.ls("/mnt/flightdata"))
```

Press the **SHIFT + ENTER** keys to run the code in this block.

To create a new file and list files in the *parquet/flights* folder, paste the following code into a new cell and run it:

```python
dbutils.fs.put("/mnt/flightdata/1.txt", "Hello, World!", True)
dbutils.fs.ls("/mnt/flightdata/parquet/flights")
```

Since you won't use the *1.txt* file in this tutorial, you can paste the following script into a cell and run it to delete the file:

```python
dbutils.fs.delete("/mnt/flightdata/1.txt")
dbutils.fs.ls("/mnt/flightdata")
```

With these code samples, you have explored the hierarchical nature of HDFS using data stored in a storage account with Data Lake Storage Gen2 enabled.

## Query the data

Next, you can begin to query the data you uploaded into your storage account. Enter each of the following code blocks into a new cell and press **SHIFT + ENTER** to run the Python script.

As stated previously, Apache Spark DataFrames provide a rich set of functions (select columns, filter, join, aggregate) that allow you to solve common data analysis problems efficiently.

To create DataFrames for your data sources, run the following script:

```python
# read the existing parquet file for the flights database that was created earlier
flight_df = spark.read.format('parquet').options(
    header='true', inferschema='true').load("/mnt/flightdata/parquet/flights")

# print the schema of the dataframe
flight_df.printSchema()

# print the flight database size
print("Number of flights in the database: ", flight_df.count())

# show the first 20 rows (20 is the default)
# to show the first n rows, run: df.show(n)
flight_df.show(100, False)

# Display to run visualizations
# preferably run this in a separate cmd cell
display(flight_df)
```

Enter this script to run some basic analysis queries against the data.

```python
# Run each of these queries, preferably in a separate cmd cell for separate analysis
# create a temporary sql view for querying flight information
flight_data = spark.read.parquet('/mnt/flightdata/parquet/flights')
flight_data.createOrReplaceTempView('FlightTable')

# using spark sql, query the parquet file to return total flights in January and February 2016
jan2016_flights = spark.sql("SELECT * FROM FlightTable WHERE Month=1 and Year= 2016")
num_jan2016_flights = jan2016_flights.count()
feb2016_flights = spark.sql("SELECT * FROM FlightTable WHERE Month=2 and Year= 2016")
num_feb2016_flights = feb2016_flights.count()
print("Jan 2016: ", num_jan2016_flights, " Feb 2016: ", num_feb2016_flights)
total = num_jan2016_flights+num_feb2016_flights
print("Total flights combined: ", total)

# List out all the airports in Texas
airports_in_texas = spark.sql(
    "SELECT distinct(OriginCityName) FROM FlightTable where OriginStateName = 'Texas'")
print('Airports in Texas: ', airports_in_texas.count())
airports_in_texas.show(100)

# find all airlines that fly from Texas
airlines_flying_from_texas = spark.sql(
    "SELECT distinct(Reporting_Airline) FROM FlightTable WHERE OriginStateName='Texas'")
print('Airlines that fly to/from Texas: ', airlines_flying_from_texas.count())
airlines_flying_from_texas.show(100, False)
```

## Clean up resources

When they're no longer needed, delete the resource group and all related resources. To do so, select the resource group for the storage account and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Extract, transform, and load data using Apache Hive on Azure HDInsight](data-lake-storage-tutorial-extract-transform-load-hive.md)
