---
title: 'Tutorial: Azure Data Lake Storage Gen2, Azure Synapse'
titleSuffix: Azure Storage
description: This tutorial shows how to run SQL queries on an Azure Synapse serverless SQL endpoint to access data in an Azure Data Lake Storage Gen2 enabled storage account.
author: jovanpop-msft

ms.service: azure-data-lake-storage
ms.topic: tutorial
ms.date: 03/07/2022
ms.author: normesta
ms.custom: devx-track-sql
#Customer intent: As an data engineer, I want to connect my data in Azure Storage so that I can easily run analytics on it.
---

# Tutorial: Query Azure Data Lake Storage Gen2 using SQL language in Synapse Analytics

This tutorial shows you how to connect your Azure Synapse serverless SQL pool to data stored in an Azure Storage account that has Azure Data Lake Storage Gen2 enabled.
This connection enables you to natively run SQL queries and analytics using SQL language on your data in Azure Storage.

In this tutorial, you will:

> [!div class="checklist"]
> - Ingest data into a storage account
> - Create a Synapse Analytics workspace (if you don't have one).
> - Run analytics on your data in Blob storage

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- Create a storage account that has a hierarchical namespace (Azure Data Lake Storage Gen2)

  See [Create a storage account to use with Azure Data Lake Storage Gen2](create-data-lake-storage-account.md).

- Make sure that your user account has the [Storage Blob Data Contributor role](assign-azure-role-data-access.md) assigned to it.

  > [!IMPORTANT]
  > Make sure to assign the role in the scope of the storage account. You can assign a role to the parent resource group or subscription, but you'll receive permissions-related errors until those role assignments propagate to the storage account.

### Download the flight data

This tutorial uses flight data from the Bureau of Transportation Statistics. You must download this data to complete the tutorial.

1. Download the [On_Time_Reporting_Carrier_On_Time_Performance_1987_present_2016_1.zip](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/tutorials/On_Time_Reporting_Carrier_On_Time_Performance_1987_present_2016_1.zip) file. This file contains the flight data.

2. Unzip the contents of the zipped file and make a note of the file name and the path of the file. You need this information in a later step.

### Copy source data into the storage account

1. Navigate to your new storage account in the Azure portal.

2. Select **Storage browser**->**Blob containers**->**Add container** and create a new container named **data**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of creating a folder in storage browser](./media/data-lake-storage-events/data-container.png)

6. In storage browser, upload the `On_Time_Reporting_Carrier_On_Time_Performance_1987_present_2016_1.csv` file to the **data** folder.

## Create an Azure Synapse workspace

[Create a Synapse workspace in the Azure portal](../../synapse-analytics/get-started-create-workspace.md#create-a-synapse-workspace-in-the-azure-portal). As you create the workspace, use these values:

- **Subscription**: Select the Azure subscription associated with your storage account.
- **Resource group**: Select the resource group where you placed your storage account.
- **Region**: Select the region of the storage account (for example, `Central US`).
- **Name**: Enter a name for your Synapse workspace.
- **SQL Administrator login**: Enter the administrator username for the SQL Server.
- **SQL Administrator password**: Enter the administrator password for the SQL Server.
- **Tag Values**: Accept the default.

#### Find your Synapse SQL endpoint name (optional) 

The serverless SQL endpoint name server name enables you to connect with any tool that can run T-SQL queries on SQL server or Azure SQL database (For example: [SQL Server Management Studio](../../synapse-analytics/sql/get-started-ssms.md),
[Azure Data Studio](../../synapse-analytics/sql/get-started-azure-data-studio.md), or [Power BI](../../synapse-analytics/sql/get-started-power-bi-professional.md)). 

To find the fully qualified server name:

1. Select on the workspace you want to connect to.
2. Go to overview.
3. Locate the full server name.

   ![Full server name serverless SQL pool](../../synapse-analytics/sql/media/connect-overview/server-connect-example-sqlod.png)

In this tutorial, you use Synapse Studio to query data from the CSV file that you uploaded to the storage account.

## Use Synapse Studio to explore data

1. Open Synapse Studio. See [Open Synapse Studio](../../synapse-analytics/quickstart-create-workspace.md#open-synapse-studio)

2. Create a SQL script and run this query to view the contents of the file: 

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

   For information about how to create a SQL script in Synapse Studio, see [Synapse Studio SQL scripts in Azure Synapse Analytics](../../synapse-analytics/sql/author-sql-script.md)

## Clean up resources

When they're no longer needed, delete the resource group and all related resources. To do so, select the resource group for the storage account and workspace, and then and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Azure Data Lake Storage Gen2, Azure Databricks & Spark](data-lake-storage-use-databricks-spark.md)
