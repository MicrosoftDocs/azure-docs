---
title: 'PowerShell: Export an Azure SQL database to a BACPAC file | Microsoft Docs'
description: Export an Azure SQL database to a BACPAC file by using PowerShell
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: ''

ms.assetid: 9439dd83-812f-4688-97ea-2a89a864d1f3
ms.service: sql-database
ms.custom: migrate and move
ms.devlang: NA
ms.date: 02/07/2017
ms.author: sstein
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA

---
# Export an Azure SQL database or a SQL Server to a BACPAC file by using PowerShell

This article provides directions for exporting your Azure SQL database or a SQL Server database to a BACPAC file (stored in Azure Blob storage) using PowerShell. For an overview of exporting to a BACPAC file, see [Export to a BACPAC](sql-database-export.md).

> [!NOTE]
> You can also export your Azure SQL database file to a BACPAC file using the [Azure portal](sql-database-export-portal.md), [SQL Server Management Studio](sql-database-export-ssms.md), or [SQLPackage](sql-database-export-sqlpackage.md).
>

## Prerequisites

To complete this article, you need the following:

* An Azure subscription.
* An Azure SQL database.
* An [Azure Standard Storage account](../storage/storage-create-storage-account.md), with a blob container to store the BACPAC in standard storage.

[!INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]

## Export your database
The [New-AzureRmSqlDatabaseExport](https://msdn.microsoft.com/library/azure/mt707796\(v=azure.300\).aspx) cmdlet submits an export database request to the service. Depending on the size of your database, the export operation may take some time to complete.

> [!IMPORTANT]
> To guarantee a transactionally consistent BACPAC file, you should first [create a copy of your database](sql-database-copy-powershell.md), and then export the database copy.
> 
> 

     $exportRequest = New-AzureRmSqlDatabaseExport -ResourceGroupName $ResourceGroupName -ServerName $ServerName `
       -DatabaseName $DatabaseName -StorageKeytype $StorageKeytype -StorageKey $StorageKey -StorageUri $BacpacUri `
       -AdministratorLogin $creds.UserName -AdministratorLoginPassword $creds.Password


## Monitor the progress of the export operation
After running [New-AzureRmSqlDatabaseExport](https://msdn.microsoft.com/library/azure/mt603644\(v=azure.300\).aspx), you can check the status of the request by running [Get-AzureRmSqlDatabaseImportExportStatus](https://msdn.microsoft.com/library/azure/mt707794\(v=azure.300\).aspx). Running this immediately after the request usually returns **Status : InProgress**. When you see **Status: Succeeded** the export is complete.

    Get-AzureRmSqlDatabaseImportExportStatus -OperationStatusLink $exportRequest.OperationStatusLink



## Export SQL database example
The following example exports an existing SQL database to a BACPAC and then shows how to check the status of the export operation.

To run the example, there are a few variables you need to replace with the specific values for your database and storage account. In the [Azure portal](https://portal.azure.com), browse to your storage account to get the storage account name, blob container name, and key value. You can find the key by clicking **Access keys** on your storage account blade.

Replace the following `VARIABLE-VALUES` with values for your specific Azure resources. The database name is the existing database you want to export.

    $subscriptionId = "YOUR AZURE SUBSCRIPTION ID"

    Login-AzureRmAccount
    Set-AzureRmContext -SubscriptionId $subscriptionId

    # Database to export
    $DatabaseName = "DATABASE-NAME"
    $ResourceGroupName = "RESOURCE-GROUP-NAME"
    $ServerName = "SERVER-NAME"
    $serverAdmin = "ADMIN-NAME"
    $serverPassword = "ADMIN-PASSWORD" 
    $securePassword = ConvertTo-SecureString -String $serverPassword -AsPlainText -Force
    $creds = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $serverAdmin, $securePassword

    # Generate a unique filename for the BACPAC
    $bacpacFilename = $DatabaseName + (Get-Date).ToString("yyyyMMddHHmm") + ".bacpac"

    # Storage account info for the BACPAC
    $BaseStorageUri = "https://STORAGE-NAME.blob.core.windows.net/BLOB-CONTAINER-NAME/"
    $BacpacUri = $BaseStorageUri + $bacpacFilename
    $StorageKeytype = "StorageAccessKey"
    $StorageKey = "YOUR STORAGE KEY"

    $exportRequest = New-AzureRmSqlDatabaseExport -ResourceGroupName $ResourceGroupName -ServerName $ServerName `
       -DatabaseName $DatabaseName -StorageKeytype $StorageKeytype -StorageKey $StorageKey -StorageUri $BacpacUri `
       -AdministratorLogin $creds.UserName -AdministratorLoginPassword $creds.Password
    $exportRequest

    # Check status of the export
    Get-AzureRmSqlDatabaseImportExportStatus -OperationStatusLink $exportRequest.OperationStatusLink

## Automate export using Azure Automation

Azure SQL Database Automated Export is now in preview and will be retired on March 1, 2017. Starting December 1, 2016, you will no longer be able to configure automated export on any SQL database. All your existing automated export jobs will continue to work until March 1, 2017. After December 1, 2016, you can use [long-term backup retention](sql-database-long-term-retention.md) or [Azure Automation](../automation/automation-intro.md) to archive SQL databases periodically using PowerShell periodically according to a schedule of your choice. For a sample script, you can download the [sample script from Github](https://github.com/Microsoft/sql-server-samples/tree/master/samples/manage/azure-automation-automated-export). 


## Next steps
* To learn how to import an Azure SQL database by using Powershell, see [Import a BACPAC using PowerShell](sql-database-import-powershell.md).
* To learn about importing a BACPAC using SQLPackage, see [Import a BACPAC to Azure SQL Database using SqlPackage](sql-database-import-sqlpackage.md)
* To learn about importing a BACPAC using the Azure portal, see [Import a BACPAC to Azure SQL Database using the Azure portal](sql-database-import-portal.md)
* For a discussion of the entire SQL Server database migration process, including performance recommendations, see [Migrate a SQL Server database to Azure SQL Database](sql-database-cloud-migrate.md).
* To learn about long-term backup retention of an Azure SQL database backup as an alternative to exported a database for archive purposes, see [Long term backup retention](sql-database-long-term-retention.md)
* To learn about importing a BACPAC to a SQL Server database, see [Import a BACPCAC to a SQL Server database](https://msdn.microsoft.com/library/hh710052.aspx)



## Additional resources
* [New-AzureRmSqlDatabaseExport](https://msdn.microsoft.com/library/azure/mt707796\(v=azure.300\).aspx)
* [Get-AzureRmSqlDatabaseImportExportStatus](https://msdn.microsoft.com/library/azure/mt707794\(v=azure.300\).aspx)

