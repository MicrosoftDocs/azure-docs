<properties
    pageTitle="Archive an Azure SQL database to a BACPAC file by using PowerShell"
    description="Archive an Azure SQL database to a BACPAC file by using PowerShell"
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="08/01/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Archive an Azure SQL database to a BACPAC file by using PowerShell

> [AZURE.SELECTOR]
- [Azure portal](sql-database-export.md)
- [PowerShell](sql-database-export-powershell.md)


This article provides directions for archiving your Azure SQL database to a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx#Anchor_4) file stored in Azure Blob storage. This article shows how you can do this by using PowerShell.

When you need to create an archive of an Azure SQL database, you can export the database schema and data to a BACPAC file. A BACPAC file is simply a ZIP file with an extension of .bacpac. A BACPAC file can later be stored in Azure Blob storage or in local storage in an on-premises location. It can also be imported back into Azure SQL Database or into a SQL Server installation on-premises.

**Considerations**

- For an archive to be transactionally consistent, you must ensure either that no write activity is occurring during the export, or that you are exporting from a [transactionally consistent copy](sql-database-copy.md) of your Azure SQL database.
- The maximum size of a BACPAC file archived to Azure Blob storage is 200 GB. To archive a larger BACPAC file to local storage, use the [SqlPackage](https://msdn.microsoft.com/library/hh550080.aspx) command-prompt utility. This utility ships with both Visual Studio and SQL Server. You can also [download](https://msdn.microsoft.com/library/mt204009.aspx) the latest version of SQL Server Data Tools to get this utility.
- Archiving to Azure premium storage by using a BACPAC file is not supported.
- If the export operation exceeds 20 hours, it may be canceled. To increase performance during export, you can:
 - Temporarily increase your service level.
 - Cease all read and write activity during the export.
 - Use a clustered index on all large tables. Without clustered indexes, an export may fail if it takes longer than 6-12 hours. This is because the export service needs to complete a table scan to try to export the entire table.

> [AZURE.NOTE] BACPACs are not intended to be used for backup and restore operations. Azure SQL Database automatically creates backups for every user database. For details, see [SQL Database automated backups](sql-database-automated-backups.md).

To complete this article, you need the following:

- An Azure subscription.
- An Azure SQL database.
- An [Azure Standard Storage account](../storage/storage-create-storage-account.md), with a blob container to store the BACPAC in standard storage.


[AZURE.INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]




## Export your database

The [New-AzureRmSqlDatabaseExport](https://msdn.microsoft.com/library/mt707796.aspx) cmdlet submits an export database request to the service. Depending on the size of your database, the export operation may take some time to complete.

> [AZURE.IMPORTANT] To guarantee a transactionally consistent BACPAC file, you should first [create a copy of your database](sql-database-copy-powershell.md), and then export the database copy.


     $exportRequest = New-AzureRmSqlDatabaseExport –ResourceGroupName $ResourceGroupName –ServerName $ServerName `
       –DatabaseName $DatabaseName –StorageKeytype $StorageKeytype –StorageKey $StorageKey -StorageUri $BacpacUri `
       –AdministratorLogin $creds.UserName –AdministratorLoginPassword $creds.Password


## Monitor the progress of the export operation

After running **New-AzureRmSqlDatabaseExport**, you can check the status of the request by running [Get-AzureRmSqlDatabaseImportExportStatus](https://msdn.microsoft.com/library/mt707794.aspx). Running this immediately after the request usually returns **Status : InProgress**. When you see **Status : Succeeded** the export is complete.


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
    $securePassword = ConvertTo-SecureString –String $serverPassword –AsPlainText -Force
    $creds = New-Object –TypeName System.Management.Automation.PSCredential –ArgumentList $serverAdmin, $securePassword

    # Generate a unique filename for the BACPAC
    $bacpacFilename = $DatabaseName + (Get-Date).ToString("yyyyMMddHHmm") + ".bacpac"

    # Storage account info for the BACPAC
    $BaseStorageUri = "https://STORAGE-NAME.blob.core.windows.net/BLOB-CONTAINER-NAME/"
    $BacpacUri = $BaseStorageUri + $bacpacFilename
    $StorageKeytype = "StorageAccessKey"
    $StorageKey = "YOUR STORAGE KEY"

    $exportRequest = New-AzureRmSqlDatabaseExport –ResourceGroupName $ResourceGroupName –ServerName $ServerName `
       –DatabaseName $DatabaseName –StorageKeytype $StorageKeytype –StorageKey $StorageKey -StorageUri $BacpacUri `
       –AdministratorLogin $creds.UserName –AdministratorLoginPassword $creds.Password
    $exportRequest

    # Check status of the export
    Get-AzureRmSqlDatabaseImportExportStatus -OperationStatusLink $exportRequest.OperationStatusLink



## Next steps

- To learn how to import an Azure SQL database by using Powershell, see [Import a BACPAC using PowerShell](sql-database-import-powershell.md).


## Additional resources

- [New-AzureRmSqlDatabaseExport](https://msdn.microsoft.com/library/mt707796.aspx)
- [Get-AzureRmSqlDatabaseImportExportStatus](https://msdn.microsoft.com/library/mt707794.aspx)