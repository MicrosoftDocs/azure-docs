---
title: 'Tutorial: Score machine learning models with PREDICT in Synapse Analytics spark pool'
description: Tutorial for how to use PREDICT functionality for predicting scores through machine learning models in dedicated Synapse spark pools.
services: synapse-analytics
ms.service: synapse-analytics 
ms.subservice: machine-learning
ms.topic: tutorial
ms.reviewer: jrasnick, garye

ms.date: 10/18/2021
author: AjAgr
ms.author: ajagarw
---

# Tutorial: Score machine learning models with PREDICT in Synapse Analytics spark pool

Learn how to use PREDICT functionality in dedicated spark pools in Azure Synapse Analytics, for score prediction if trained model is registered in Azure Machine Learning (AML) Or Synapse workspace default Azure Data Lake Storage (ADLS).

PREDICT in Synapse PySpark notebook provides you the capability to score machine learning models using the  SQL language, user defined functions (UDF) or Transformers. With PREDICT, you can bring your existing machine learning models trained outside Synapse with historical data and registered in Azure Data Lake Storage Gen2 or Azure Machine Learning to further score them within the secure boundaries of Azure Synapse Analytics. PREDICT function takes a model and data as inputs. This feature eliminates the step of moving valuable data outside Synapse for scoring. It aims to empower model consumers to easily infer machine learning models in Synapse as well as collaborate seamlessly with model producer working with the right framework for their task.


In this tutorial, you'll learn how to:

> [!div class="checklist"]
> - predict scores for data in Synapse spark pool using machine learning models which are trained outside Synapse and registered in Azure Machine Learning or Azure Data Lake Storage Gen2.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

## Prerequisites

- [Azure Synapse Analytics workspace](../get-started-create-workspace.md) with an Azure Data Lake Storage Gen2 storage account configured as the default storage. You need to be the *Storage Blob Data Contributor* of the Data Lake Storage Gen2 file system that you work with.
- Spark pool in your Azure Synapse Analytics workspace. For details, see [Create a Spark pool in Azure Synapse](../get-started-analyze-spark.md).
- Azure Machine Learning workspace is needed if you want to train or register model in Azure Machine Learning. For details, see [Manage Azure Machine Learning workspaces in the portal or with the Python SDK](articles/machine-learning/how-to-manage-workspace.md).
- If your model is registered in Azure Machine Learning then you need a linked service. In Azure Synapse Analytics, a linked service is where you define your connection information to other services. In this section, you'll add an Azure Synapse Analytics and Azure Machine Learning linked service. To learn more, see [Create a new Azure Machine Learning linked service in Synapse](quickstart-integrate-azure-machine-learning.md).
- The functionality requires that we already have trained model which is either registered in Azure Machine Learning OR uploaded in Azure Data Lake Storage Gen2.


## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).


## Read/Write data using storage account name and key

FSSPEC can read/write ADLS data by specifying the storage account name and key directly.

1. In Synapse studio, open **Data** > **Linked** > **Azure Data Lake Storage Gen2**. Upload data to the default storage account.

1. Run the following code.

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

- [Machine Learning capabilities in Azure Synapse Analytics](what-is-machine-learning.md)