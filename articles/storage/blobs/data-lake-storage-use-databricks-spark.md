---
title: 'Tutorial: Azure Data Lake Storage Gen2, Azure Databricks & Spark'
titleSuffix: Azure Storage
description: This tutorial shows how to run Spark queries on an Azure Databricks cluster to access data in an Azure Data Lake Storage Gen2 storage account.
author: normesta

ms.service: azure-data-lake-storage
ms.topic: tutorial
ms.date: 10/10/2023
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

  See [Tutorial: Connect to Azure Data Lake Storage Gen2](/azure/databricks/getting-started/connect-to-azure-storage) (Steps 1 through 3). After completing these steps, make sure to paste the tenant ID, app ID, and client secret values into a text file. You use them later in this tutorial.

## Create an Azure Databricks workspace, cluster, and notebook

1. Create an Azure Databricks workspace. See [Create an Azure Databricks workspace](/azure/databricks/getting-started/#--create-an-azure-databricks-workspace).

2. Create a cluster. See [Create a cluster](/azure/databricks/getting-started/quick-start#step-1-create-a-cluster).

3. Create a notebook. See [Create a notebook](/azure/databricks/notebooks/notebooks-manage#--create-a-notebook). Choose Python as the default language of the notebook.

Keep your notebook open. You use it in the following sections.

## Download the flight data

This tutorial uses on-time performance flight data for January 2016 from the Bureau of Transportation Statistics to demonstrate how to perform an ETL operation. You must download this data to complete the tutorial.

1. Download the [On_Time_Reporting_Carrier_On_Time_Performance_1987_present_2016_1.zip](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/tutorials/On_Time_Reporting_Carrier_On_Time_Performance_1987_present_2016_1.zip) file. This file contains the flight data.

2. Unzip the contents of the zipped file and make a note of the file name and the path of the file. You need this information in a later step.

If you want to learn about the information captured in the on-time reporting performance data, you can see the [field descriptions](https://www.transtats.bts.gov/Fields.asp?gnoyr_VQ=FGJ) on the Bureau of Transportation Statistics website.  

## Ingest data

In this section, you upload the *.csv* flight data into your Azure Data Lake Storage Gen2 account and then mount the storage account to your Databricks cluster. Finally, you use Databricks to read the *.csv* flight data and write it back to storage in Apache parquet format.

### Upload the flight data into your storage account

Use AzCopy to copy your *.csv* file into your Azure Data Lake Storage Gen2 account. You use the `azcopy make` command to create a container in your storage account. Then you use the `azcopy copy` command to copy the *csv* data you just downloaded to a directory in that container.

In the following steps, you need to enter names for the container you want to create, and the directory and blob that you want to upload the flight data to in the container. You can use the suggested names in each step or specify your own observing the [naming conventions for containers, directories, and blobs](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

1. Open a command prompt window, and enter the following command to sign in to Azure Active Directory to access your storage account.

   ```bash
   azcopy login
   ```

   Follow the instructions that appear in the command prompt window to authenticate your user account.

1. To create a container in your storage account to store the flight data, enter the following command:

   ```bash
   azcopy make  "https://<storage-account-name>.dfs.core.windows.net/<container-name>" 
   ```

   - Replace the `<storage-account-name>` placeholder value with the name of your storage account.

   - Replace the `<container-name>` placeholder with a name for the container you want to create to store the *csv* data; for example, *flight-data-container*.

1. To upload (copy) the *csv* data to your storage account, enter the following command.

   ```bash
   azcopy copy "<csv-folder-path>" https://<storage-account-name>.dfs.core.windows.net/<container-name>/<directory-name>/On_Time.csv
   ```

   - Replace the `<csv-folder-path>` placeholder value with the path to the *.csv* file.

   - Replace the `<storage-account-name>` placeholder value with the name of your storage account.

   - Replace the `<container-name>` placeholder with the name of the container in your storage account.

   - Replace the `<directory-name>` placeholder with the name of a directory to store your data in the container; for example, *jan2016*.

### Mount your storage account to your Databricks cluster

In this section, you mount your Azure Data Lake Storage Gen2 cloud object storage to the Databricks File System (DBFS). You use the Azure AD service principle you created previously for authentication with the storage account. For more information, see [Mounting cloud object storage on Azure Databricks](/azure/databricks/dbfs/mounts).

1. Attach your notebook to your cluster.

   1. In the notebook you created previously, select the **Connect** button in the upper right corner of the [notebook toolbar](/azure/databricks/notebooks/notebook-ui#--notebook-toolbar-icons-and-buttons). This button opens the compute selector. (If you've already connected your notebook to a cluster, the name of that cluster is shown in the button text rather than **Connect**).

   1. In the cluster dropdown menu, select the cluster you previously created.

   1. Notice that the text in the cluster selector changes to *starting*. Wait for the cluster to finish starting and for the name of the cluster to appear in the button before continuing.

1. Copy and paste the following code block into the first cell, but don't run this code yet.

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

1. In this code block:
   - In `configs`, replace the `<appId>`, `<clientSecret>`, and `<tenantId>` placeholder values with the application ID, client secret, and tenant ID you copied when you created the service principal in the prerequisites.

   - In the `source` URI, replace the `<storage-account-name>`, `<container-name>`, and `<directory-name>` placeholder values with the name of your Azure Data Lake Storage Gen2 storage account and the name of the container and directory you specified when you uploaded the flight data to the storage account.

      > [!NOTE]
      > The scheme identifier in the URI, `abfss`, tells Databricks to use the Azure Blob File System driver with Transport Layer Security (TLS). To learn more about the URI, see [Use the Azure Data Lake Storage Gen2 URI](/azure/storage/blobs/data-lake-storage-introduction-abfs-uri#uri-syntax).

1. Make sure your cluster has finished starting up before proceeding.

1. Press the **SHIFT + ENTER** keys to run the code in this block.

The container and directory where you uploaded the flight data in your storage account is now accessible in your notebook through the mount point, */mnt/flightdata*.

### Use Databricks Notebook to convert CSV to Parquet

Now that the *csv* flight data is accessible through a DBFS mount point, you can use an Apache Spark DataFrame to load it into your workspace and write it back in Apache parquet format to your Azure Data Lake Storage Gen2 object storage.

- A Spark DataFrame is a two-dimensional labeled data structure with columns of potentially different types. You can use a DataFrame to easily read and write data in various supported formats. With a DataFrame, you can load data from cloud object storage and perform analysis and transformations on it inside your compute cluster without affecting the underlying data in cloud object storage. To learn more, see [Work with PySpark DataFrames on Azure Databricks](/azure/databricks/getting-started/dataframes-python).

- Apache parquet is a columnar file format with optimizations that speed up queries. It's a more efficient file format than CSV or JSON. To learn more, see [Parquet Files](https://spark.apache.org/docs/latest/sql-data-sources-parquet.html).

In the notebook, add a new cell, and paste the following code into it.

```python
# Use the previously established DBFS mount point to read the data.
# Create a DataFrame to read the csv data.
# The header option specifies that the first row of data should be used as the DataFrame column names
# The inferschema option specifies that the column data types should be inferred from the data in the file
flight_df = spark.read.format('csv').options(
    header='true', inferschema='true').load("/mnt/flightdata/*.csv")

# Read the airline csv file and write the output to parquet format for easy query.
flight_df.write.mode("append").parquet("/mnt/flightdata/parquet/flights")
print("Done")
```

Press the **SHIFT + ENTER** keys to run the code in this block.

Before proceeding to the next section, make sure that all of the parquet data has been written, and "Done" appears in the output.

## Explore data

In this section, you use the [Databricks file system utility](/azure/databricks/dev-tools/databricks-utils#--file-system-utility-dbutilsfs) to explore your Azure Data Lake Storage Gen2 object storage using the DBFS mount point you created in the previous section.

In a new cell, paste the following code to get a list of the files at the mount point. The first command outputs a list of files and directories. The second command displays the output in tabular format for easier reading.

```python
dbutils.fs.ls("/mnt/flightdata")
display(dbutils.fs.ls("/mnt/flightdata"))
```

Press the **SHIFT + ENTER** keys to run the code in this block.

Notice that the *parquet* directory appears in the listing. You saved the *.csv* flight data in parquet format to the *parquet/flights* directory in the previous section. To list files in the *parquet/flights* directory, paste the following code into a new cell and run it:

```python
display(dbutils.fs.ls("/mnt/flightdata/parquet/flights"))
```

To create a new file and list it, paste the following code into a new cell and run it:

```python
dbutils.fs.put("/mnt/flightdata/mydirectory/mysubdirectory/1.txt", "Hello, World!", True)
display(dbutils.fs.ls("/mnt/flightdata/mydirectory/mysubdirectory"))
```

Since you don't need the *1.txt* file in this tutorial, you can paste the following code into a cell and run it to recursively delete *mydirectory*. The `True` parameter indicates a recursive delete.

```python
dbutils.fs.rm("/mnt/flightdata/mydirectory", True)
```

As a convenience, you can use the help command to learn detail about other commands.

```python
dbutils.fs.help("rm")
```

With these code samples, you've explored the hierarchical nature of HDFS using data stored in a storage account with Azure Data Lake Storage Gen2 enabled.

## Query the data

Next, you can begin to query the data you uploaded into your storage account. Enter each of the following code blocks into a new cell and press **SHIFT + ENTER** to run the Python script.

DataFrames provide a rich set of functions (select columns, filter, join, aggregate) that allow you to solve common data analysis problems efficiently.

To load a DataFrame from your previously saved parquet flight data and explore some of the supported functionality, run the following script:

```python
# Read the existing parquet file for the flights database that was created earlier
flight_df = spark.read.parquet("/mnt/flightdata/parquet/flights")

# Print the schema of the dataframe
flight_df.printSchema()

# Print the flight database size
print("Number of flights in the database: ", flight_df.count())

# Show the first 25 rows (20 is the default)
# To show the first n rows, run: df.show(n)
# The second parameter indicates that column lengths shouldn't be truncated (default is 20 characters)
flight_df.show(25, False)

# You can also use the DataFrame to run simple queries. Results are returned in a DataFrame.
# Show the first 25 rows of the results of a query that returns selected colums for all flights originating from airports in Texas
flight_df.select("FlightDate", "Reporting_Airline", "Flight_Number_Reporting_Airline", "OriginCityName", "DepTime", "DestCityName", "ArrTime", "ArrDelay").filter("OriginState = 'TX'").show(258, False)

# Use display to run visualizations
# Preferably run this in a separate cmd cell
display(flight_df)
```

Enter this script to run some basic analysis queries against the data.

```python
# Run each of these queries, preferably in a separate cmd cell for separate analysis
# Create a temporary sql view for querying flight information
flight_data = spark.read.parquet('/mnt/flightdata/parquet/flights')
flight_data.createOrReplaceTempView('FlightTable')

# Using spark sql, query the parquet file to return total flights in January and February 2016
jan2016_flights = spark.sql("SELECT * FROM FlightTable WHERE Month=1 and Year= 2016")
num_jan2016_flights = jan2016_flights.count()
feb2016_flights = spark.sql("SELECT * FROM FlightTable WHERE Month=2 and Year= 2016")
num_feb2016_flights = feb2016_flights.count()
print("Jan 2016 flights: ", num_jan2016_flights, " Feb 2016 flights: ", num_feb2016_flights)
total = num_jan2016_flights+num_feb2016_flights
print("Total flights combined: ", total)
print() 

# List out all the airports in Texas
airports_in_texas = spark.sql(
    "SELECT distinct(OriginCityName) FROM FlightTable WHERE OriginStateName = 'Texas'")
print('Airports in Texas: ', airports_in_texas.count())
airports_in_texas.show(100, False)

# Find all airlines that fly from Texas
airlines_flying_from_texas = spark.sql(
    "SELECT distinct(Reporting_Airline) FROM FlightTable WHERE OriginStateName='Texas'")
print('Airlines that fly to/from Texas: ', airlines_flying_from_texas.count())
airlines_flying_from_texas.show(100)
```

## Summary

In this tutorial, you:

- Created Azure resources, including an Azure Data Lake Storage Gen2 storage account and Azure AD service principal, and assigned permissions to access the storage account.

- Created an Azure Databricks workspace, notebook, and compute cluster.

- Used AzCopy to upload unstructured *.csv* flight data to the Azure Data Lake Storage Gen2 storage account.

- Used Databricks File System utility functions to mount your Azure Data Lake Storage Gen2 storage account and explore its hierarchical file system.

- Used Apache Spark DataFrames to transform your *.csv* flight data to Apache parquet format and store it back to your Azure Data Lake Storage Gen2 storage account.

- Used DataFrames to explore the flight data and perform a simple query.

- Used Apache Spark SQL to query the flight data for the number of total flights in month, the airports in Texas, and the airlines that fly from Texas.

## Clean up resources

If you want to preserve the notebook and come back to it later, it's a good idea to shut down (terminate) your cluster to avoid charges. To terminate your cluster, select it in the compute selector located upper right of the notebook toolbar, select **Terminate** from the menu, and confirm your selection. (By default, the cluster will automatically terminate after 120 minutes of inactivity.)

If you want to delete individual workspace resources like notebooks and clusters, you can do so from the left sidebar of the workspace. For detailed instructions, see [Delete a cluster](/azure/databricks/clusters/clusters-manage#--delete-a-cluster) or [Delete a notebook](/azure/databricks/notebooks/notebooks-manage#delete-a-notebook).

When they're no longer needed, delete the resource group and all related resources. To do so in Azure portal, select the resource group for the storage account and workspace and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Extract, transform, and load data using Apache Hive on Azure HDInsight](data-lake-storage-tutorial-extract-transform-load-hive.md)
