---
title: Use Redgate to load data to your Azure data warehouse | Microsoft Docs
description: Learn how to use Redgate's Data Platform Studio for data warehousing scenarios.
services: sql-data-warehouse
documentationcenter: NA
author: twounder
manager: jhubbard
editor: ''

ms.assetid: 670aef98-31f7-4436-86c0-cc989a39fe7f
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: loading
ms.date: 10/31/2016
ms.author: mausher;barbkess


---
# Load data with Redgate Data Platform Studio
> [!div class="op_single_selector"]
> * [Redgate](sql-data-warehouse-load-with-redgate.md)
> * [Data Factory](sql-data-warehouse-get-started-load-with-azure-data-factory.md)
> * [PolyBase](sql-data-warehouse-get-started-load-with-polybase.md)
> * [BCP](sql-data-warehouse-load-with-bcp.md)
> 
> 

This tutorial shows you how to use [Redgate's Data Platform Studio](http://www.red-gate.com/products/azure-development/data-platform-studio/) (DPS) to move data from an on-premise SQL Server to Azure SQL Data Warehouse. Data Platform Studio applies the most appropriate compatibility fixes and optimizations, so it's the quickest way to get started with SQL Data Warehouse.

> [!NOTE]
> [Redgate](http://www.red-gate.com) is a long-time Microsoft partner that delivers various SQL Server tools. This feature in Data Platform Studio has been made available freely for both commercial and non-commercial use.
> 
> 

## Before you begin
### Create or identify resources
Before starting this tutorial, you need to have:

* **On-premise SQL Server Database**: The data you want to import to SQL Data Warehouse needs to come from an on-premise SQL Server (version 2008R2 or above). Data Platform Studio cannot import data directly from an Azure SQL Database or from text files.
* **Azure Storage Account**: Data Platform Studio stages the data in Azure Blob Storage before loading it into SQL Data Warehouse. The storage account must be using the “Resource Manager” deployment model (the default) rather than the “Classic” deployment model. If you don't have a storage account, learn how to Create a storage account. 
* **SQL Data Warehouse**: This tutorial moves the data from on-premise SQL Server to SQL Data Warehouse, so you need to have a data warehouse online. If you do not already have a data warehouse, learn how to Create an Azure SQL Data Warehouse.

> [!NOTE]
> Performance is improved if the storage account and the data warehouse are created in the same region.
> 
> 

## Step 1: Sign in to Data Platform Studio with your Azure account
Open your web browser and navigate to the [Data Platform Studio](https://www.dataplatformstudio.com/) website. Sign in with the same Azure account that you used to create the storage account and data warehouse. If your email address is associated with both a work or school account and a Microsoft account, be sure to choose the account that has access to your resources.

> [!NOTE]
> If this is your first time using Data Platform Studio, you are asked to grant the application permission to manage your Azure resources.
> 
> 

## Step 2: Start the Import Wizard
From the DPS main screen, select the Import to Azure SQL Data Warehouse link to start the import wizard.

![][1]

## Step 3: Install the Data Platform Studio Gateway
To connect to your on-premise SQL Server database, you need to install the DPS Gateway. The gateway is a client agent that provides access to your on-premise environment, extracts the data, and uploads it to your storage account. Your data never passes through Redgate’s servers. To install the Gateway:

1. Click the **Create Gateway** link
2. Download and install the Gateway using the provided installer

![][2]

> [!NOTE]
> The Gateway can be installed on any machine with network access to the source SQL Server database. It accesses the SQL Server database using Windows authentication with the credentials of the current user.
> 
> 

Once installed, the Gateway status changes to Connected and you can select Next.

## Step 4: Identify the source database
In the *Enter Server Name* textbox, enter the name of the server that hosts your database and select **Next**. Then, from the drop-down menu, select the database you want to import data from.

![][3]

DPS inspects the selected database for tables to import. By default, DPS imports all the tables in the database. You can select or deselect tables by expanding the All Tables link. Select the Next button to move forward.

## Step 5: Choose a storage account to stage the data
DPS prompts you for a location to stage the data. Choose an existing storage account from your subscription and select **Next**.

> [!NOTE]
> DPS will create a new blob container in the chosen storage account and use a distinct folder for each import.
> 
> 

![][4]

## Step 6: Select a data warehouse
Next, you select an online [Azure SQL Data Warehouse](http://aka.ms/sqldw) database to import the data into. Once you've selected your database, you need to enter the credentials to connect to the database and select **Next**.

![][5]

> [!NOTE]
> DPS merges the source data tables into the data warehouse. DPS warns you if the table name requires it to overwrite existing tables in the data warehouse. You may optionally delete any existing objects in the data warehouse by ticking Delete all existing objects before import.
> 
> 

## Step 7: Import the data
DPS confirms that you would like to import the data. Simply click the Start import button to begin the data import.

![][6]

DPS displays a visualization that shows the progress of extracting and uploading the data from the on-premise SQL Server and the progress of the import into SQL Data Warehouse.

![][7]

Once the import is complete, DPS displays a summary of the data import and a change report of the compatibility fixes that have been performed.

![][8]

## Next steps
To explore your data within SQL Data Warehouse, start by viewing:

* [Query Azure SQL Data Warehouse (Visual Studio)][Query Azure SQL Data Warehouse (Visual Studio)]
* [Visualize data with Power BI][Visualize data with Power BI]

To learn more about Redgate’s Data Platform Studio:

* [Visit the DPS homepage](http://www.dataplatformstudio.com/)
* [Watch a demo of DPS on Channel9](https://channel9.msdn.com/Blogs/cloud-with-a-silver-lining/Loading-data-into-Azure-SQL-Datawarehouse-with-Redgate-Data-Platform-Studio)

For an overview of other ways to migrate and load your data in SQL Data Warehouse see:

* [Migrate your solution to SQL Data Warehouse][Migrate your solution to SQL Data Warehouse]
* [Load data into Azure SQL Data Warehouse](sql-data-warehouse-overview-load.md)

For more development tips, see the [SQL Data Warehouse development overview](sql-data-warehouse-overview-develop.md).

<!--Image references-->
[1]: media/sql-data-warehouse-redgate/2016-10-05_15-59-56.png
[2]: media/sql-data-warehouse-redgate/2016-10-05_11-16-07.png
[3]: media/sql-data-warehouse-redgate/2016-10-05_11-17-46.png
[4]: media/sql-data-warehouse-redgate/2016-10-05_11-20-41.png
[5]: media/sql-data-warehouse-redgate/2016-10-05_11-31-24.png
[6]: media/sql-data-warehouse-redgate/2016-10-05_11-32-20.png
[7]: media/sql-data-warehouse-redgate/2016-10-05_11-49-53.png
[8]: media/sql-data-warehouse-redgate/2016-10-05_12-57-10.png

<!--Article references-->
[Query Azure SQL Data Warehouse (Visual Studio)]: ./sql-data-warehouse-query-visual-studio.md
[Visualize data with Power BI]: ./sql-data-warehouse-get-started-visualize-with-power-bi.md
[Migrate your solution to SQL Data Warehouse]: ./sql-data-warehouse-overview-migrate.md
[Load data into Azure SQL Data Warehouse]: ./sql-data-warehouse-overview-load.md
[SQL Data Warehouse development overview]: ./sql-data-warehouse-overview-develop.md
