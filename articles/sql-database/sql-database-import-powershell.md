---
title: Import a BACPAC file to create an Azure SQL database by using PowerShell | Microsoft Docs
description: Import a BACPAC file to create an Azure SQL database by using PowerShell
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: ''

ms.assetid: 8d78da13-43fe-4447-92e0-0a41d0321fd4
ms.service: sql-database
ms.custom: migrate and move
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: powershell
ms.workload: data-management
ms.date: 02/07/2017
ms.author: sstein

---
# Import a BACPAC file to create an Azure SQL database by using PowerShell

This article provides directions for creating an Azure SQL database by importing a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx#Anchor_4) file with PowerShell.

## Prequisites

To import a SQL database, you need the following:

* An Azure subscription. If you need an Azure subscription simply click **Free Trial** at the top of this page, and then come back to finish this article.
* A BACPAC file of the database you want to import. The BACPAC needs to be in an [Azure Storage account](../storage/storage-create-storage-account.md) blob container.

[!INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]

## Set up the variables for your environment
There are a few variables where you need to replace the example values with the specific values for your database and your storage account.

The server name should be a server that currently exists in the subscription selected in the previous step. It should be the server you want the database to be created in. Importing a database directly into an elastic pool is not supported. But you can first import as a single database, and then move the database into a pool.

The database name is the name you want for the new database.

    $ResourceGroupName = "resource group name"
    $ServerName = "server name"
    $DatabaseName = "database name"


The following variables are from the storage account where your BACPAC is located. In the [Azure portal](https://portal.azure.com), browse to your storage account to get these values. You can find the primary access key by clicking **All settings** and then **Keys** from your storage account's blade.

The blob name is the name of an existing BACPAC file that you want to create the database from. You need to include the .bacpac extension.

    $StorageName = "storageaccountname"
    $StorageKeyType = "StorageAccessKey"
    $StorageUri = "http://$StorageName.blob.core.windows.net/containerName/filename.bacpac"
    $StorageKey = "primaryaccesskey"


Running the [Get-Credential](https://msdn.microsoft.com/library/azure/hh849815\(v=azure.300\).aspx) cmdlet opens a window asking for your user name and password. Enter the admin login and password for the SQL Database server ($ServerName from above), and not the user name and password for your Azure account.

    $credential = Get-Credential


## Import the database
This command submits an import database request to the service. Depending on the size of your database, the import operation may take some time to complete.

    $importRequest = New-AzureRmSqlDatabaseImport -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName $DatabaseName -StorageKeytype $StorageKeyType -StorageKey $StorageKey -StorageUri $StorageUri -AdministratorLogin $credential.UserName -AdministratorLoginPassword $credential.Password -Edition Standard -ServiceObjectiveName S0 -DatabaseMaxSizeBytes 50000


## Monitor the progress of the operation
After running [New-AzureRmSqlDatabaseImport](https://msdn.microsoft.com/library/azure/mt707793\(v=azure.300\).aspx), you can check the status of the request by running the [Get-AzureRmSqlDatabaseImportExportStatus](https://msdn.microsoft.com/library/azure/mt707794\(v=azure.300\).aspx).

    Get-AzureRmSqlDatabaseImportExportStatus -OperationStatusLink $importRequest.OperationStatusLink



## SQL Database PowerShell import script
    $ResourceGroupName = "resourceGroupName"
    $ServerName = "servername"
    $DatabaseName = "databasename"

    $StorageName = "storageaccountname"
    $StorageKeyType = "StorageAccessKey"
    $StorageUri = "http://$StorageName.blob.core.windows.net/containerName/filename.bacpac"
    $StorageKey = "primaryaccesskey"

    $credential = Get-Credential

    $importRequest = New-AzureRmSqlDatabaseImport -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName $DatabaseName -StorageKeytype $StorageKeyType -StorageKey $StorageKey -StorageUri $StorageUri -AdministratorLogin $credential.UserName -AdministratorLoginPassword $credential.Password -Edition Standard -ServiceObjectiveName S0 -DatabaseMaxSizeBytes 50000

    Get-AzureRmSqlDatabaseImportExportStatus -OperationStatusLink $importRequest.OperationStatusLink



## Next steps
* To learn to connect to and query an imported SQL Database, see [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md).
* For a SQL Server Customer Advisory Team blog about migrating using BACPAC files, see [Migrating from SQL Server to Azure SQL Database using BACPAC Files](https://blogs.msdn.microsoft.com/sqlcat/2016/10/20/migrating-from-sql-server-to-azure-sql-database-using-bacpac-files/).
* For a discussion of the entire SQL Server database migration process, including performance recommendations, see [Migrate a SQL Server database to Azure SQL Database](sql-database-cloud-migrate.md).


