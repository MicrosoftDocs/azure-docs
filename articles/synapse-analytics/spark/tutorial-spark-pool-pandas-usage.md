---
title: 'Tutorial: Use Pandas to read/write ADLS data in serverless Apache Spark pool in Synapse Analytics'
description: Tutorial for how to use Pandas in PySpark notebook to read/write ADLS data in serverless Apache Spark pool.
services: synapse-analytics
ms.service: synapse-analytics 
ms.subservice: spark
ms.topic: tutorial
ms.reviewer: jrasnick, garye

ms.date: 11/02/2021
author: AjAgr
ms.author: ajagarw
---

# Tutorial: Use Pandas to read/write ADLS data in Synapse Analytics spark pool

Learn how to use Pandas to read/write data to Azure Data Lake Storage (ADLS) using a serverless Apache Spark pool in Azure Synapse Analytics.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> - Read/write ADLS data using Pandas in a Spark session.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

## Prerequisites

- [Azure Synapse Analytics workspace](../get-started-create-workspace.md) with an Azure Data Lake Storage Gen2 storage account configured as the default storage (or primary storage). You need to be the *Storage Blob Data Contributor* of the Data Lake Storage Gen2 file system that you work with.
- Serverless Apache Spark pool in your Azure Synapse Analytics workspace. For details, see [Create a Spark pool in Azure Synapse](../get-started-analyze-spark.md).
- Configure [Secondary Azure Data Lake Storage Gen2](https://docs.microsoft.com/en-us/azure/storage/blobs/create-data-lake-storage-account) account (which is not default to Synapse workspace). You need to be the *Storage Blob Data Contributor* of the Data Lake Storage Gen2 file system that you work with.
- Create linked services - In Azure Synapse Analytics, a linked service is where you define your connection information to other services. In this section, you'll add an Azure Synapse Analytics and Azure Data Lake Storage Gen2 linked service.

  1. Open the Azure Synapse Studio and select the **Manage** tab.
  1. Under **External connections**, select **Linked services**.
  1. To add a linked service, select **New**.
  1. Select the Azure Data Lake Storage Gen2 tile from the list and select **Continue**.
  1. Enter your authentication credentials. Account key, Service Principle (SP), Credentials and   Manged service identity (MSI) are currently supported authentication types. Please make sure   that *Storage Blob Data Contributor* is assigned on storage for SP and MSI before you choose it   for authentication. **Test connection** to verify your credentials are correct. Select   **Create**.

   :::image type="content" source="media/tutorial-spark-pool-pandas-usage/create-adls-linked-service.png" alt-text="Create Linked Service Using ADLS Gen2 Storage Access Key.":::


> [!NOTE]
> - Pandas feature is supported on **Python 3.8** and **Spark3** serverless Apache Spark pool in Azure Synapse Analytics. 
> - Support available for following versions: **pandas 1.2.3, fsspec 2021.10.0, adlfs 0.7.7**
> - Have capabilities to support both **Azure Data Lake Storage Gen2 URI** (abfs[s]://file_system_name@account_name.dfs.core.windows.net/file_path) and **FSSPEC short URL** (abfs[s]://container_name/file_path)


## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).


## Read/Write data using default Azure Data Lake Storage Gen2 of Synapse workspace

Pandas can read/write ADLS data by just specifying the file path directly.

Execute the below code.

   > [!NOTE]
   > Update the file URL in this script before running it.

   ```PYSPARK
   # Read data file using URI of default Azure Data Lake Storage Gen2

   import pandas

   # read csv file
   df = pandas.read_csv('abfs[s]://file_system_name@account_name.dfs.core.windows.net/file_path')
   print(df)

   # write csv file
   data = pandas.DataFrame({'Name':['A', 'B', 'C', 'D'], 'ID':[20, 21, 19, 18]})
   data.to_csv('abfs[s]://file_system_name@account_name.dfs.core.windows.net/file_path')
   ```

   ```PYSPARK
   # Read data file using FSSPEC short URL of default Azure Data Lake Storage Gen2

   import pandas

   # read csv file
   df = pandas.read_csv('abfs[s]://container_name/file_path')
   print(df)

   # write csv file
   data = pandas.DataFrame({'Name':['A', 'B', 'C', 'D'], 'ID':[20, 21, 19, 18]})
   data.to_csv('abfs[s]://container_name/file_path')
   ```

## Read/Write data using secondary Azure Data Lake Storage Gen2 account

Pandas can read/write secondary ADLS account data 
    - using linked service (having auth options - storage account key, service principle, manages service identity and credentials).
    - using storage options to directly pass client ID & Secret, SAS key, storage account key and connection string.

a) Using linked service

Execute the below code.

   > [!NOTE]
   > Update the file URL and linked service name in this script before running it.

   ```PYSPARK
   # Read data file using URI of secondary Azure Data Lake Storage Gen2

   import pandas
   
   # read data file
   df = pandas.read_csv('abfs[s]://file_system_name@account_name.dfs.core.windows.net/file_path', storage_options = {'linked_service' : 'linked_service_name'})
   print(df)
   
   # write data file
   data = pandas.DataFrame({'Name':['A', 'B', 'C', 'D'], 'ID':[20, 21, 19, 18]})
   data.to_csv('abfs[s]://file_system_name@account_name.dfs.core.windows.net/file_path', storage_options = {'linked_service' : 'linked_service_name'})
   ```

   ```PYSPARK
   # Read data file using FSSPEC short URL of default Azure Data Lake Storage Gen2

   import pandas
   
   # read data file
   df = pandas.read_csv('abfs[s]://container_name/file_path', storage_options =    {'linked_service' : 'linked_service_name'})
   print(df)
   
   # write data file
   data = pandas.DataFrame({'Name':['A', 'B', 'C', 'D'], 'ID':[20, 21, 19, 18]})
   data.to_csv('abfs[s]://container_name/file_path', storage_options = {'linked_service' : 'linked_service_name'})
   ```


b) Using storage options to directly pass client ID & Secret, SAS key, storage account key and connection string

Execute the below code.

   > [!NOTE]
   > Update the file URL in this script before running it.

   ```PYSPARK
   # Read data file using URI of default Azure Data Lake Storage Gen2

   import pandas

   # read csv file
   df = pandas.read_csv('abfs[s]://file_system_name@account_name.dfs.core.windows.net/file_path')
   print(df)

   # write csv file
   data = pandas.DataFrame({'Name':['A', 'B', 'C', 'D'], 'ID':[20, 21, 19, 18]})
   data.to_csv('abfs[s]://file_system_name@account_name.dfs.core.windows.net/file_path')
   ```

   ```PYSPARK
   # Read data file using FSSPEC short URL of default Azure Data Lake Storage Gen2

   import pandas

   # read csv file
   df = pandas.read_csv('abfs[s]://container_name/file_path')
   print(df)

   # write csv file
   data = pandas.DataFrame({'Name':['A', 'B', 'C', 'D'], 'ID':[20, 21, 19, 18]})
   data.to_csv('abfs[s]://container_name/file_path')
   ```


## Read/Write data using linked service

FSSPEC can read/write ADLS data by specifying the linked service name.


1. In Synapse studio, open **Data** > **Linked** > **Azure Data Lake Storage Gen2**. Upload data to the default storage account.

1. Run the following code.

   > [!NOTE]
   > Update the file URL, Linked Service Name and ADLS Gen2 storage name in this script before running it.

   ```PYSPARK
   # To read data
   import fsspec
   import pandas
   
   adls_account_name = '' #Provide exact ADLS account name
   sas_key = TokenLibrary.getConnectionString(<LinkedServiceName>)
   
   fsspec_handle = fsspec.open('abfs[s]://<container>/<path-to-file>', account_name =    adls_account_name, sas_token=sas_key)
   
   with fsspec_handle.open() as f:
       df = pandas.read_csv(f)

   # To write data
   import fsspec
   import pandas
   
   adls_account_name = '' #Provide exact ADLS account name
   
   data = pandas.DataFrame({'Name':['Tom', 'nick', 'krish', 'jack'], 'Age':[20, 21, 19, 18]})
   sas_key = TokenLibrary.getConnectionString(<LinkedServiceName>) 
   
   fsspec_handle = fsspec.open('abfs[s]://<container>/<path-to-file>', account_name =    adls_account_name, sas_token=sas_key, mode="wt") 
   
   with fsspec_handle.open() as f:
       data.to_csv(f) 
   ```

## Upload file from local file system to Synapse workspace default ADLS storage account 

FSSPEC can upload file from local file system to Synapse workspace default ADLS storage account.


Run the below code.

   > [!NOTE]
   > Update the file URL in this script before running it.

   ```PYSPARK
   # Import libraries
   import fsspec
   import os
   
   # Set variables
   local_file_name = "<local_file_name>"
   ADLS_Store_Path = "abfs[s]://<filesystemname>@<account name>.dfs.windows.cor.net/"+local_file_name
   
   # Generate local file for testing 
   with open(local_file_name, mode='w') as f:
       for i in range(1000):
           f.write("Testing local file functionality\n")
   print("Created: " + local_file_name)

   # Upload local file to ADLS 
   fs = fsspec.filesystem('abfs[s]')
   fs.upload(local_file_name, ADLS_Store_Path)
   ```

## Next steps

- [Azure Synapse Analytics](../index.yml)
- [FSSPEC official documentation](https://filesystem-spec.readthedocs.io/en/latest/)