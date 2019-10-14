---
title: Move data to an Azure SQL Database - Team Data Science Process
description: Move data from flat files (CSV or TSV formats) or from data stored in an on-premises SQL Server to an Azure SQL database.
services: machine-learning
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 05/04/2018
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---
# Move data to an Azure SQL Database for Azure Machine Learning

This article outlines the options for moving data either from flat files (CSV or TSV formats) or from data stored in an on-premises SQL Server to an Azure SQL database. These tasks for moving data to the cloud are part of the Team Data Science Process.

For a topic that outlines the options for moving data to an on-premises SQL Server for Machine Learning, see [Move data to SQL Server on an Azure virtual machine](move-sql-server-virtual-machine.md).

The following table summarizes the options for moving data to an Azure SQL Database.

| <b>SOURCE</b> | <b>DESTINATION: Azure SQL Database</b> |
| --- | --- |
| <b>Flat file (CSV or TSV formatted)</b> |[Bulk Insert SQL Query](#bulk-insert-sql-query) |
| <b>On-premises SQL Server</b> |1.[Export to Flat File](#export-flat-file)<br> 2. [SQL Database Migration Wizard](#insert-tables-bcp)<br> 3. [Database back up and restore](#db-migration)<br> 4. [Azure Data Factory](#adf) |

## <a name="prereqs"></a>Prerequisites
The procedures outlined here require that you have:

* An **Azure subscription**. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial/).
* An **Azure storage account**. You use an Azure storage account for storing the data in this tutorial. If you don't have an Azure storage account, see the [Create a storage account](../../storage/common/storage-quickstart-create-account.md) article. After you have created the storage account, you need to obtain the account key used to access the storage. See [Manage your storage access keys](../../storage/common/storage-account-manage.md#access-keys).
* Access to an **Azure SQL Database**. If you must set up an Azure SQL Database, [Getting Started with Microsoft Azure SQL Database](../../sql-database/sql-database-get-started.md) provides information on how to provision a new instance of an Azure SQL Database.
* Installed and configured **Azure PowerShell** locally. For instructions, see [How to install and configure Azure PowerShell](/powershell/azure/overview).

**Data**: The migration processes are demonstrated using the [NYC Taxi dataset](https://chriswhong.com/open-data/foil_nyc_taxi/). The NYC Taxi dataset contains information on trip data and fairs and is available on Azure blob storage: [NYC Taxi Data](https://www.andresmh.com/nyctaxitrips/). A sample and description of these files are provided in [NYC Taxi Trips Dataset Description](sql-walkthrough.md#dataset).

You can either adapt the procedures described here to a set of your own data or follow the steps as described by using the NYC Taxi dataset. To upload the NYC Taxi dataset into your on-premises SQL Server database, follow the procedure outlined in [Bulk Import Data into SQL Server Database](sql-walkthrough.md#dbload). These instructions are for a SQL Server on an Azure Virtual Machine, but the procedure for uploading to the on-premises SQL Server is the same.

## <a name="file-to-azure-sql-database"></a> Moving data from a flat file source to an Azure SQL database
Data in flat files (CSV or TSV formatted) can be moved to an Azure SQL database using a Bulk Insert SQL Query.

### <a name="bulk-insert-sql-query"></a> Bulk Insert SQL Query
The steps for the procedure using the Bulk Insert SQL Query are similar to those covered in the sections for moving data from a flat file source to SQL Server on an Azure VM. For details, see [Bulk Insert SQL Query](move-sql-server-virtual-machine.md#insert-tables-bulkquery).

## <a name="sql-on-prem-to-sazure-sql-database"></a> Moving Data from on-premises SQL Server to an Azure SQL database
If the source data is stored in an on-premises SQL Server, there are various possibilities for moving the data to an Azure SQL database:

1. [Export to Flat File](#export-flat-file)
2. [SQL Database Migration Wizard](#insert-tables-bcp)
3. [Database back up and restore](#db-migration)
4. [Azure Data Factory](#adf)

The steps for the first three are very similar to those sections in [Move data to SQL Server on an Azure virtual machine](move-sql-server-virtual-machine.md) that cover these same procedures. Links to the appropriate sections in that topic are provided in the following instructions.

### <a name="export-flat-file"></a>Export to Flat File
The steps for this exporting to a flat file are similar to those covered in [Export to Flat File](move-sql-server-virtual-machine.md#export-flat-file).

### <a name="insert-tables-bcp"></a>SQL Database Migration Wizard
The steps for using the SQL Database Migration Wizard are similar to those covered in [SQL Database Migration Wizard](move-sql-server-virtual-machine.md#sql-migration).

### <a name="db-migration"></a>Database back up and restore
The steps for using database back up and restore are similar to those covered in [Database back up and restore](move-sql-server-virtual-machine.md#sql-backup).

### <a name="adf"></a>Azure Data Factory
The procedure for moving data to an Azure SQL database with Azure Data Factory (ADF) is provided in the topic [Move data from an on-premises SQL server to SQL Azure with Azure Data Factory](move-sql-azure-adf.md). This topic shows how to move data from an on-premises SQL Server database to an Azure SQL database via Azure Blob Storage using ADF.

Consider using ADF when data needs to be continually migrated in a hybrid scenario that accesses both on-premises and cloud resources, and when the data is transacted or needs to be modified or have business logic added to it when being migrated. ADF allows for the scheduling and monitoring of jobs using simple JSON scripts that manage the movement of data on a periodic basis. ADF also has other capabilities such as support for complex operations.
