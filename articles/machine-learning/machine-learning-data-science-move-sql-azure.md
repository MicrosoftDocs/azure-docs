<properties 
	pageTitle="Move data to an Azure SQL Database for Azure Machine Learning | Azure" 
	description="Create SQL Table and load data to SQL Table" 
	services="machine-learning" 
	documentationCenter="" 
	authors="bradsev"
	manager="paulettm"
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/14/2016"
	ms.author="fashah;bradsev" /> 

# Move data to an Azure SQL Database for Azure Machine Learning

This topic outlines the options for moving data either from flat files (CSV or TSV formats) or from data stored in an on-premise SQL Server to an Azure SQL database. These tasks for moving data to the cloud are part of the Team Data Science Process.

For a topic that outlines the options for moving data to an on-premise SQL Server for Machine Learning, see [Move data to SQL Server on an Azure virtual machine](machine-learning-data-science-move-sql-server-virtual-machine.md).

The **menu** below links to topics that describe how to ingest data into other target environments where the data can be stored and processed during the Team Data Science Process (TDSP).

[AZURE.INCLUDE [cap-ingest-data-selector](../../includes/cap-ingest-data-selector.md)]

The following table summarizes the options for moving data to an Azure SQL Database.

<b>SOURCE</b> |<b>DESTINATION: Azure SQL Database</b> |
-------------- |--------------------------------|
<b>Flat file (CSV or TSV formatted)</b> |<a href="#bulk-insert-sql-query">Bulk Insert SQL Query |
<b>On-premise SQL Server</b> | 1. <a href="#export-flat-file">Export to Flat File<br> 2. <a href="#insert-tables-bcp">SQL Database Migration Wizard<br> 3. <a href="#db-migration">Database backup and restore<br> 4. <a href="#adf">Azure Data Factory |


## <a name="prereqs"></a>Prerequisites
This procedures outlined here require that you have:

* An **Azure subscription**. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial/).
* An **Azure storage account**. You will use an Azure storage account for storing the data in this tutorial. If you don't have an Azure storage account, see the [Create a storage account](storage-create-storage-account.md#create-a-storage-account) article. After you have created the storage account, you will need to obtain the account key used to access the storage. See [View, copy and regenerate storage access keys](storage-create-storage-account.md#view-copy-and-regenerate-storage-access-keys).
* Access to an **Azure SQL Database**. If you must setup an Azure SQL Database, [Getting Started with Microsoft Azure SQL Database ](../sql-database/sql-database-get-started.md) provides information on how to provision a new instance of a Azure SQL Database.
* Installed and configured **Azure PowerShell** locally. For instructions, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).

**Data**: The migration processes are demonstrated using the [NYC Taxi dataset](http://chriswhong.com/open-data/foil_nyc_taxi/). The NYC Taxi dataset contains information on trip data and fairs and is available, as noted that post, on Azure blob storage: [NYC Taxi Data](http://www.andresmh.com/nyctaxitrips/). A sample and description of these files are provided in [NYC Taxi Trips Dataset Description](machine-learning-data-science-process-sql-walkthrough.md#dataset).
 
You can either adapt the procedures described here to a set of your own data or follow the steps as described by using the NYC Taxi dataset. To upload the NYC Taxi dataset into your on-premise SQL Server database, follow the procedure outlined in [Bulk Import Data into SQL Server Database](machine-learning-data-science-process-sql-walkthrough.md#dbload). These instructions are for a SQL Server on an Azure Virtual Machine, but the procedure for uploading to the on-premise SQL Server is the same.


## <a name="file-to-azure-sql-database"></a> Moving data from a flat file source to an Azure SQL database

Data in flat files (CSV or TSV formatted) can be moved to an Azure SQL database using a Bulk Insert SQL Query.

### <a name="bulk-insert-sql-query"></a> Bulk Insert SQL Query

The steps for the procedure using the Bulk Insert SQL Query are similar to those covered in the sections for moving data from a flat file source to SQL Server on an Azure VM. For details, see [Bulk Insert SQL Query](machine-learning-data-science-move-sql-server-virtual-machine.md#insert-tables-bulkquery).


##<a name="sql-on-prem-to-sazure-sql-database"></a> Moving Data from on-premise SQL Server to an Azure SQL database

If the source data is stored in an on-premise SQL Server, there are various possibilities for moving the data to an Azure SQL database:

1. [Export to Flat File](#export-flat-file) 
2. [SQL Database Migration Wizard](#insert-tables-bcp)
3. [Database backup and restore](#db-migration)
4. [Azure Data Factory](#adf)

The steps for the first three are very similar to those sections in [Move data to SQL Server on an Azure virtual machine](machine-learning-data-science-move-sql-server-virtual-machine.md) that cover these same procedures. Links to the appropriate sections  in that topic are provided below.

###<a name="export-flat-file"></a>Export to Flat File

The steps for this exporting to a flat file are similar to those covered [Export to Flat File](machine-learning-data-science-move-sql-server-virtual-machine.md#export-flat-file).

###<a name="insert-tables-bcp"></a>SQL Database Migration Wizard

The steps for using the SQL Database Migration Wizard are similar to those covered [SQL Database Migration Wizard](machine-learning-data-science-move-sql-server-virtual-machine.md#sql-migration).

###<a name="db-migration"></a>Database backup and restore

The steps for using database backup and restore are similar to those covered [Database backup and restore](machine-learning-data-science-move-sql-server-virtual-machine.md#sql-backup).

###<a name="adf"></a>Azure Data Factory

The procedure for moving data to an Azure SQL database with Azure Data Factory (ADF) is provided in the topic [Move data from an on-premise SQL server to SQL Azure with Azure Data Factory](machine-learning-data-science-move-sql-azure-adf.md).This topic shows how to move data from an on-premise SQL Server database to a Azure SQL database via Azure Blob Storage using ADF. 

Consider using ADF when data needs to be continually migrated in a hybrid scenario that accesses both on-premise and cloud resources, and when the data is transacted or needs to be modified or have business logic added to it in the course of being migrated. ADF allows for the scheduling and monitoring of jobs using simple JSON scripts that manage the movement of data on a periodic basis. ADF also has other capabilities such as support for complex operations.




