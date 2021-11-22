---
title: 'Tutorial: Azure Data Lake Storage Gen2, Azure Synapse | Microsoft Docs'
description: This tutorial shows how to run SQL queries on an Azure Synapse serverless SQL endpoint to access data in an Azure Data Lake Storage Gen2 storage account.
author: jovanpop-msft
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: tutorial
ms.date: 11/22/2021
ms.author: jovanpop
ms.reviewer: jrasnic
ms.custom: devx-track-sql
#Customer intent: As an data engineer, I want to connect my data in Azure Storage so that I can easily run analytics on it.
---

# Tutorial: Query Azure Data Lake Storage Gen2 using SQL language in Synapse Analytics

This tutorial shows you how to connect your Azure Synapse serverless SQL pool to data stored in an Azure storage account that has Azure Data Lake Storage Gen2 enabled.
This connection enables you to natively run SQL queries and analytics using SQL language on your data.

In this tutorial, you will:

> [!div class="checklist"]
> - Create a Synapse Analytics workspace (if you don't have one).
> - Ingest data into a storage account
> - Run analytics on your data in Blob storage

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- Create an Azure Data Lake Storage Gen2 account.

  See [Create a storage account to use with Azure Data Lake Storage Gen2](create-data-lake-storage-account.md).

- Make sure that your user account has the [Storage Blob Data Contributor role](assign-azure-role-data-access.md) assigned to it.

- Install AzCopy v10. See [Transfer data with AzCopy v10](../common/storage-use-azcopy-v10.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

  There's a couple of specific things that you'll have to do as you perform the steps in that article.

  > [!IMPORTANT]
  > Make sure to assign the role in the scope of the Data Lake Storage Gen2 storage account. You can assign a role to the parent resource group or subscription, but you'll receive permissions-related errors until those role assignments propagate to the storage account.

### Download the flight data

This tutorial uses flight data from the Bureau of Transportation Statistics to demonstrate how to perform an ETL operation. You must download this data to complete the tutorial.

1. Go to [Research and Innovative Technology Administration, Bureau of Transportation Statistics](https://www.transtats.bts.gov/DL_SelectFields.asp?gnoyr_VQ=FGJ).

2. Select the **Prezipped File** check box to select all data fields.

3. Select the **Download** button and save the results to your computer.

4. Unzip the contents of the zipped file and make a note of the file name and the path of the file. You need this information in a later step.

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

## Create an Azure Synapse workspace

In this section, you create an Azure Workspace.

1. Select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FSynapse%2Fmaster%2FManage%2FDeployWorkspace%2Fazuredeploy.json)

2. Enter or update the following values:

   - **Subscription**: Select an Azure subscription.
   - **Resource group**: Select **Create new** and enter a unique name for the resource group and select **OK**. A new resource group will facilitate resource clean up.
   - **Region**: Select the region where you placed the your Azure Data Lake storage (for example, **Central US**).
   - **Name**: Enter a name for your workspace.
   - **SQL Administrator login**: Enter the administrator username for the SQL Server.
   - **SQL Administrator password**: Enter the administrator password for the SQL Server.
   - **Tag Values**: Accept the default.
   - **Review and Create**: Select.
   - **Create**: Select.

## Find your Synapse SQL endpoint name

The server name for the serverless SQL pool in the following example is: `showdemoweu-ondemand.sql.azuresynapse.net`. To find the fully qualified server name:

1. Select on the workspace you want to connect to.
2. Go to overview.
3. Locate the full server name.

![Full server name serverless SQL pool](../../synapse-analytics/sql/media/connect-overview/server-connect-example-sqlod.png)

### Connect ot Synapse SQL endpoint

Synapse SQL endpoint enables you to connnect with any tool that can run T-SQL queries on SQL server or Azure SQL database. 
The examples are [SQL Server Managemenet Studio](../../synapse-analytics/sql/get-started-ssms,md),
[Azure Data Studio](../../synapse-analytics/sql/get-started-azure-data-studio.md), or [Power BI](../../synapse-analytics/sql/get-started-power-bi-professional.md),

Use a tool that you prefer to use to connect to SQL endpooint, put the serverless SQL serverless endpoint name, and connect with Azure AD authentication to connect.

## Explore data

Create a new SQL query using the tool that you used to connect to your Synapse endpoint, put the following query, and set the path in

```sql
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK 'https://<storage-account-name>.dfs.core.windows.net/<container-name>/folder1/On_Time.csv',
        FORMAT='CSV',
        PARSER_VERSION='2.0'
    ) AS [result]
```


## Clean up resources

When they're no longer needed, delete the resource group and all related resources. To do so, select the resource group for the storage account and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Extract, transform, and load data using Apache Hive on Azure HDInsight](data-lake-storage-tutorial-extract-transform-load-hive.md)
