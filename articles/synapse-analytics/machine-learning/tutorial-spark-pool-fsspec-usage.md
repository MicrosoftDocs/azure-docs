---
title: 'Tutorial: ADLS read/write using FSSPEC and Linked Service in Synapse Analytics for dedicated Spark pools'
description: Tutorial for how to use FSSPEC for machine learning workloads to read/write ADLS data in dedicated Spark pools.
services: synapse-analytics
ms.service: synapse-analytics 
ms.subservice: machine-learning
ms.topic: tutorial
ms.reviewer: jrasnick, garye

ms.date: 06/07/2021
author: ajagarw
ms.author: ajagarw
---

# Tutorial: ADLS read/write using FSSPEC & Linked Service in Synapse Analytics for dedicated Spark pools

Learn how to read data in dedicated Spark pools using FSSPEC and Linked Service. A data professional in Azure Synapse Analytics can simply read/write data from ADLS and use it within Spark session.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> - Read/write ADLS data in a dedicated Spark session.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

## Prerequisites

- [Azure Synapse Analytics workspace](../get-started-create-workspace.md) with an Azure Data Lake Storage Gen2 storage account configured as the default storage. You need to be the *Storage Blob Data Contributor* of the Data Lake Storage Gen2 file system that you work with.
- Spark pool in your Azure Synapse Analytics workspace. For details, see [Create a Spark pool in Azure Synapse](../get-started-analyze-spark.md).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create linked services

In Azure Synapse Analytics, a linked service is where you define your connection information to other services. In this section, you'll add an Azure Synapse Analytics and Azure Data Lake Storage Gen2 linked service.

1. Open the Azure Synapse Analytics UX and go to the **Manage** tab.
1. Under **External connections**, select **Linked services**.
1. To add a linked service, select **New**.
1. Select the Azure Data Lake Storage Gen2 tile from the list and select **Continue**.
1. Enter your authentication credentials. Account key, service principal, and managed identity are currently supported authentication types. Select test connection to verify your credentials are correct. Select **Create** when finished.

   ![Create Linked Service Using ADLS Gen2 Storage Access Key](media/tutorial-spark-pool-fsspec-usage/tutorial-spark-pool-fsspec-usage-001a.png)


## Read/Write ADLS Gen2 data using FSSPEC through Storage Account key and name

1. Open the Azure Synapse workspace with Synapse Studio.

1. Go to **Data** > **Linked** > **Storage Accounts**. Upload data to the default storage account.

   > [!NOTE]
   > Update the file URL, ADLS Gen2 storage name and key in this script before running it.

   ```PYSPARK
   # To read data
   import fsspec
   import pandas

   adls_account_name = '' #Provide exact ADLS account name
   adls_account_key = '' #Provide exact ADLS account key

   fsspec_handle = fsspec.open('abfs://<container>/<path-to-file>', account_name=adls_account_name, account_key=adls_account_key)

   with fsspec_handle.open() as f:
       df = pandas.read_csv(f)

   # To write data
   import fsspec
   import pandas

   adls_account_name = '' #Provide exact ADLS account name 
   adls_account_key = '' #Provide exact ADLS account key 
   
   data = pandas.DataFrame({'Name':['Tom', 'nick', 'krish', 'jack'], 'Age':[20, 21, 19, 18]})
   
   fsspec_handle = fsspec.open('abfs://<container>/<path-to-file>', account_name=adls_account_name,    account_key=adls_account_key, mode="wt")
   
   with fsspec_handle.open() as f:
   	data.to_csv(f)
   ```

## Read/Write ADLS Gen2 data using FSSPEC through Linked Service

1. Open the Azure Synapse workspace with Synapse Studio.

1. Go to **Data** > **Linked** > **Storage Accounts**. Upload data to the default storage account.

   > [!NOTE]
   > Update the file URL, Linked Service Name and ADLS Gen2 storage name in this script before running it.

   ```PYSPARK
   # To read data
   import fsspec
   import pandas
   
   adls_account_name = '' #Provide exact ADLS account name
   sas_key = TokenLibrary.getConnectionString(<LinkedServiceName>)
   
   fsspec_handle = fsspec.open('abfs://<container>/<path-to-file>', account_name =    adls_account_name, sas_token=sas_key)
   
   with fsspec_handle.open() as f:
       df = pandas.read_csv(f)

   # To write data
   import fsspec
   import pandas
   
   adls_account_name = '' #Provide exact ADLS account name
   
   data = pandas.DataFrame({'Name':['Tom', 'nick', 'krish', 'jack'], 'Age':[20, 21, 19, 18]})
   sas_key = TokenLibrary.getConnectionString(<LinkedServiceName>) 
   
   fsspec_handle = fsspec.open('abfs://<container>/<path-to-file>', account_name =    adls_account_name, sas_token=sas_key, mode="wt") 
   
   with fsspec_handle.open() as f:
       data.to_csv(f) 
   ```

## Next steps

- [Quickstart: Create a new Azure Machine Learning linked service in Azure Synapse](quickstart-integrate-azure-machine-learning.md)
- [Machine Learning capabilities in Azure Synapse Analytics](what-is-machine-learning.md)