---
title: 'Use events with Azure Data Lake Storage Gen2 | Microsoft Docs'
description: This tutorial shows you how to use an event.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: tutorial
ms.date: 08/06/2019
ms.author: normesta
ms.reviewer: sumameh
---

# Tutorial: Use events with Azure Data Lake Storage Gen2

This tutorial shows you how to blah.

In this tutorial, you will:

> [!div class="checklist"]
> * Task here.
> * Taske here.
> * Task here.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* Create a storage account that has a hierarchical namespace (Azure Data Lake Storage Gen2). This tutorial uses a storage account named `contosoorders`.

  See [Create an Azure Data Lake Storage Gen2 account](data-lake-storage-quickstart-create-account.md).

* Make sure that your user account has the [Storage Blob Data Contributor role](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac) assigned to it.

* Create a service principal. See [How to: Use the portal to create an Azure AD application and service principal that can access resources](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal).

  There's a couple of specific things that you'll have to do as you perform the steps in that article.

  :heavy_check_mark: When performing the steps in the [Assign the application to a role](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#assign-the-application-to-a-role) section of the article, make sure to assign the **Storage Blob Data Contributor** role to the service principal.

  > [!IMPORTANT]
  > Make sure to assign the role in the scope of the Data Lake Storage Gen2 storage account. You can assign a role to the parent resource group or subscription, but you'll receive permissions-related errors until those role assignments propagate to the storage account.

  :heavy_check_mark: When performing the steps in the [Get values for signing in](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in) section of the article, paste the tenant ID, app ID, and password values into a text file. You'll need those soon.

* Create an Azure Databricks service and cluster. This tutorial uses a service named `contoso-orders` and a cluster named `customer-order-cluster`.

  See [Quickstart: Analyze data in Azure Data Lake Storage Gen2 by using Azure Databricks](data-lake-storage-quickstart-create-databricks-account.md).

* Install AzCopy v10. See [Transfer data with AzCopy v10](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

## Add initial data to the storage account

1. Open Storage explorer.
2. Create a container named "data". Put screenshot here.
3. Create a folder named input and then a subfolder named full.
4. Create a csv file that contains this information:

   ```
   InvoiceNo,StockCode,Description,Quantity,InvoiceDate,UnitPrice,CustomerID,Country
   536365,85123A,WHITE HANGING HEART T-LIGHT HOLDER,6,12/1/2010 8:26,2.55,17850,United Kingdom
   ```
5. Open storage explorer and copy this file to the input/full directory.

## Create notebook to configure the customer table

In this section, you create a notebook in Azure Databricks workspace and then run code snippets to set up the customer table in the storage account.

1. In the [Azure portal](https://portal.azure.com), go to the Azure Databricks workspace you created, and then select **Launch Workspace**.

2. In the left pane, select **Workspace**. From the **Workspace** drop-down, select **Create** > **Notebook**.

    ![Create notebook in Databricks](./media/data-lake-storage-quickstart-create-databricks-account/databricks-create-notebook.png "Create notebook in Databricks")

3. In the **Create Notebook** dialog box, enter a name for the notebook. Select **Python** as the language, and then select the Spark cluster that you created earlier.

    ![Create notebook in Databricks](./media/data-lake-storage-events/new-databricks-notebook.png "Create notebook in Databricks")

    Select **Create**.

4. Copy and paste the following code block into the first cell, but don't run this code yet.

    ```Python
    configs = {"fs.azure.account.auth.type": "OAuth",
           "fs.azure.account.oauth.provider.type": "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider",
           "fs.azure.account.oauth2.client.id": "<appId>",
           "fs.azure.account.oauth2.client.secret": "<password>",
           "fs.azure.account.oauth2.client.endpoint": "https://login.microsoftonline.com/<tenant>/oauth2/token",
           "fs.azure.createRemoteFileSystemDuringInitialization": "true"}

    dbutils.fs.mount(
    source = "abfss://data@contosoorders.dfs.core.windows.net",
    mount_point = "/mnt/data",
    extra_configs = configs)
    ```

5. In this code block, replace the `appId`, `password`, `tenant` placeholder values in this code block with the values that you collected while completing the prerequisites of this tutorial.

6. Press the **SHIFT + ENTER** keys to run the code in this block.

6. Copy and paste the following code block into a different cell, then press the **SHIFT + ENTER** keys to run the code in this block. This code configures the structure of your databricks delta table and then loads some initial data from the csv file that you uploaded earlier.

   ```Python
   from pyspark.sql.types import StructType, StructField, DoubleType, IntegerType, StringType


   inputSchema = StructType([
      StructField("InvoiceNo", IntegerType(), True),
      StructField("StockCode", StringType(), True),
      StructField("Description", StringType(), True),
      StructField("Quantity", IntegerType(), True),
      StructField("InvoiceDate", StringType(), True),
      StructField("UnitPrice", DoubleType(), True),
      StructField("CustomerID", IntegerType(), True),
      StructField("Country", StringType(), True)
    ])

    rawDataDF = (spark.read
      .option("header", "true")
      .schema(inputSchema)
      .csv('/mnt/data/input/full')
    )

    customerTablePath = '/mnt/data/delta-tables/customers'


    (rawDataDF.write
       .mode("overwrite")
      .format("delta")
    ```

## Create notebook to upsert data into the table

Introduction

1. Step 1.
2. Step 2.

## Create the table structure in Databricks

Introduction

1. Step 1.
2. Step 2.

## Ingest starter data

Introduction

1. Step 1.
2. Step 2.

## Create a function

Introduction

1. Step 1.
2. Step 2.

## Create an event subscription

Introduction

1. Step 1.
2. Step 2.

## Test it all out

Introduction

1. Step 1.
2. Step 2.

## Clean up resources

When they're no longer needed, delete the resource group and all related resources. To do so, select the resource group for the storage account and select **Delete**.

## Next steps

> [!div class="nextstepaction"] 
> [Next step goes here](data-lake-storage-tutorial-extract-transform-load-hive.md)
