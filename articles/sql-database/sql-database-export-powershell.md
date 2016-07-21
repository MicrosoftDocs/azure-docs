<properties 
    pageTitle="Archive an Azure SQL database to a BACPAC file using PowerShell" 
    description="Archive an Azure SQL database to a BACPAC file using PowerShell" 
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="07/19/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Archive an Azure SQL database to a BACPAC file using PowerShell

> [AZURE.SELECTOR]
- [Azure portal](sql-database-export.md)
- [PowerShell](sql-database-export-powershell.md)


This article provides directions for archiving your Azure SQL database to a BACPAC file stored in Azure blob storage using PowerShell.

When you need to create an archive of an Azure SQL database, you can export the database schema and data to a BACPAC file. A BACPAC file is simply a ZIP file with an extension of BACPAC. A BACPAC file can later be stored in Azure blob storage or in local storage in an on-premises location and later imported back into Azure SQL Database or into a SQL Server on-premises installation. 

***Considerations***

- For an archive to be transactionally consistent, you must either ensure that no write activity is occurring during the export or export from a [transactionally consistent copy](sql-database-copy.md) of your Azure SQL database
- The mazimum size of a BACPAC file archived to Azure blob storage is 200 GB. Use the [SqlPackage](https://msdn.microsoft.com/library/hh550080.aspx) command-prompt utility to archive a larger BACPAC file to local storage. This utility ships with both Visual Studio and SQL Server. You can also [download](https://msdn.microsoft.com/library/mt204009.aspx) the latest version of SQL Server Data Tools to get this utility.
- Archiving to Azure premium storage using a BACPAC file is not supported.
- If the export operation goes over 20 hours it may be canceled. To increase performance during export, you can:
 - Temporarily increase your service level 
 - Cease all read and write activity during the export
 - Use a clustered index on all large tables. Without clustered indexes, an export may fail if it takes longer than 6-12 hours. This is because the export service needs to complete a table scan to try to export the entire table.
 
> [AZURE.NOTE] BACPACs are not intended to be used for backup and restore operations. Azure SQL Database automatically creates backups for every user database. For details, see [SQL Database automated backups](sql-database-automated-backups.md).

To complete this article you need the following:

- An Azure subscription. 
- An Azure SQL database. 
- An [Azure Standard Storage account](../storage/storage-create-storage-account.md) with a blob container to store the BACPAC in standard storage.


[AZURE.INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]


## Setup the variables for for your specific environment

There are a few variables where you need to replace the example values with the specific values for your database and storage account.

Replace with your specific values.

    $ResourceGroupName = "resourceGroupName"
    $ServerName = "servername"
    $DatabaseName = "databasename"


In the [Azure portal](https://portal.azure.com) browse to your storage account to get these values. You can find the primary access key by clicking **All settings** and then **Keys** from your storage account's blade.

    $StorageName = "storageaccountname"
    $StorageKeyType = "storageKeyType"
    $StorageUri = "http://$StorageName.blob.core.windows.net/containerName/filename.bacpac"
    $StorageKey = "primaryaccesskey"


Running the **Get-Credential** cmdlet opens a window asking for your username and password. Enter the admin login and password for your SQL server (NOT the username and password for your Azure account).

    $credential = Get-Credential

## Export your database

This command submits an export database request to the service. Depending on the size of your database the export operation may take some time to complete.

> [AZURE.IMPORTANT] To guarantee a transactionally consistent BACPAC file you should first [create a copy of your database](sql-database-copy-powershell.md) and then export the database copy. 


    $exportRequest = New-AzureRmSqlDatabaseExport –ResourceGroupName  $ResourceGroupName –ServerName $ServerName –DatabaseName $DatabaseName –StorageKeytype $StorageKeyType –StorageKey $StorageKey -StorageUri $StorageUri –AdministratorLogin $credential.UserName –AdministratorLoginPassword $credential.Password
    

## Monitor the progress of the export operation

After running **New-AzureRmSqlDatabaseExport** you can check the status of the request. Running this immediately after the request will usually return **Status : Pending** or **Status : Running** so you can run this multiple times until you see **Status : Completed** in the output. 

Running this command will prompt you for a password. Enter the admin password for your SQL server.


    Get-AzureRmSqlDatabaseImportExportStatus -OperationStatusLink $exportRequest.OperationStatusLink
    


## Export SQL database PowerShell script


    $ServerName = "servername"
    $StorageName = "storageaccountname"
    $StorageKeyType = "storageKeyType"
    $StorageUri = "http://storageaccountname.blob.core.windows.net/containerName/filename.bacpac"
    $StorageKey = "primaryaccesskey"

    $credential = Get-Credential

    $exportRequest = New-AzureRmSqlDatabaseExport –ResourceGroupName  $ResourceGroupName –ServerName $ServerName –DatabaseName $DatabaseName –StorageKeytype $StorageKeyType –StorageKey $StorageKey -StorageUri $StorageUri –AdministratorLogin $credential.UserName  –AdministratorLoginPassword $credential.Password

    Get-AzureRmSqlDatabaseImportExportStatus -OperationStatusLink $exportRequest.OperationStatusLink

## Next steps

- [Import an Azure SQL database](sql-database-import-powershell.md)


## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [Disaster Recovery Drills](sql-database-disaster-recovery-drills.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)
