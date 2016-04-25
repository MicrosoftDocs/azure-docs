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
	ms.date="04/06/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Archive an Azure SQL database to a BACPAC file using PowerShell

> [AZURE.SELECTOR]
- [Azure portal](sql-database-export.md)
- [PowerShell](sql-database-export-powershell.md)


This article provides directions for archiving your Azure SQL database to a BACPAC file stored in Azurte blob storage using PowerShell.

When you need to create an archive of an Azure SQL database, you can export the database schema and data to a BACPAC file. A BACPAC file is simply a ZIP file with an extension of BACPAC. A BACPAC file can later be stored in Azure blob storage or in local storage in an on-premises location and later inmported back into Azure SQL Database or into a SQL Server on-premises installation. 

***Considerations***

- For an archive to be transactionally consistent, you must either ensure that no write activity is occurring during the export or export from a [transactionally consistent copy](sql-database-copy.md) of your Azure SQL Database
- The mazimum size of a BACPAC file archived to Azure blob storage is 200 GB. Use the [SqlPackage](https://msdn.microsoft.com/library/hh550080.aspx) command-prompt utility to archive a larger BACPAC file to local storage. This utility ships with both Visual Studio and SQL Server. You can also [download](https://msdn.microsoft.com/library/mt204009.aspx) the latest version of SQL Server Data Tools to get this utility.
- Archiving to Azure premium storage using a BACPAC file is not supported.
- If the export operation goes over 20 hours it may be canceled. To increase performance during export, you can:
 - Temporarily increase your service level 
 - Cease all read and write activity during the export
 - Use a clustered index on all large tables. Without clustered indexes, an export may fail if it takes longer than 6-12 hours. This is because the export services needs to complete table scan to try to export entire table
 
> [AZURE.NOTE] BACPACs are not intended to be used for backup and restore operations. Azure SQL Database automatically creates backups for every user database. For details, see [Business Continuity Overview](sql-database-business-continuity.md).

To complete this article you need the following:

- An Azure subscription. 
- An Azure SQL Database. 
- An [Azure Standard Storage account](../storage/storage-create-storage-account.md) with a blob container to store the BACPAC in standard storage.
- Azure PowerShell. For detailed information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).


## Configure your credentials and select your subscription

First you must establish access to your Azure account so start PowerShell and then run the following cmdlet. In the login screen enter the same email and password that you use to sign in to the Azure portal.

	Add-AzureAccount

After successfully signing in you will see some information on screen that includes the Id you signed in with and the Azure subscriptions you have access to.


### Select your Azure subscription

To select the subscription you need your subscription Id or subscription name (**-SubscriptionName**). You can copy the subscription Id from the information displayed from previous step, or if you have multiple subscriptions and need more details you can run the **Get-AzureSubscription** cmdlet and copy the desired subscription information from the resultset. Once you have your subscription run the following cmdlet:

	Select-AzureSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000

After successfully running **Select-AzureSubscription** you are returned to the PowerShell prompt. If you have more than one subscription you can run **Get-AzureSubscription** and verify the subscription you want to use shows **IsCurrent: True**.


## Setup the variables for for your specific environment

There are a few variables where you need to replace the example values with the specific values for your database and storage account.

Replace the server and database names with the server and database that currently exists in your account. For the blob name enter the BACPAC filename that will be created. Enter whatever you want to name the BACPAC file but you must include the .bacpac extension.

    $ServerName = "servername"
    $DatabaseName = "nameofdatabasetoexport"
    $BlobName = "filename.bacpac"

In the [Azure portal](https://portal.azure.com) browse to your storage account to get these values. You can find the primary access key by clicking **All settings** and then **Keys** from your storage account's blade.

    $StorageName = "storageaccountname"
    $ContainerName = "blobcontainername"
    $StorageKey = "primaryaccesskey"

## Create pointer to your server and storage account

Running the **Get-Credential** cmdlet opens a window asking for your username and password. Enter the admin login and password for your SQL server (NOT the username and password for your Azure account).

    $credential = Get-Credential
    $SqlCtx = New-AzureSqlDatabaseServerContext -ServerName $ServerName -Credential $credential

    $StorageCtx = New-AzureStorageContext -StorageAccountName $StorageName -StorageAccountKey $StorageKey
    $Container = Get-AzureStorageContainer -Name $ContainerName -Context $StorageCtx


## Export your database

This command submits an export database request to the service. Depending on the size of your database the export operation may take some time to complete.

> [AZURE.IMPORTANT] To guarantee a transactionally consistent BACPAC file you should first [create a copy of your database](sql-database-copy-powershell.md) and then export the database copy. 


    $exportRequest = Start-AzureSqlDatabaseExport -SqlConnectionContext $SqlCtx -StorageContainer $Container -DatabaseName $DatabaseName -BlobName $BlobName
    

## Monitor the progress of the export operation

After running **Start-AzureSqlDatabaseExport** you can check the status of the request. Running this immediately after the request will usually return **Status : Pending** or **Status : Running** so you can run this multiple times until you see **Status : Completed** in the output. 

Running this command will prompt you for a password. Enter the admin password for your SQL server.


    Get-AzureSqlDatabaseImportExportStatus -RequestId $exportRequest.RequestGuid -ServerName $ServerName -Username $credential.UserName
    


## Export SQL database PowerShell script


    Add-AzureAccount
    Select-AzureSubscription -SubscriptionId "4cac86b0-1e56-bbbb-aaaa-000000000000"
    
    $ServerName = "servername"
    $DatabaseName = "databasename"
    $BlobName = "bacpacfilename"
    
    $StorageName = "storageaccountname"
    $ContainerName = "blobcontainername"
    $StorageKey = "primaryaccesskey"
    
    $credential = Get-Credential
    $SqlCtx = New-AzureSqlDatabaseServerContext -ServerName $ServerName -Credential $credential
    
    $StorageCtx = New-AzureStorageContext -StorageAccountName $StorageName -StorageAccountKey $StorageKey
    $Container = Get-AzureStorageContainer -Name $ContainerName -Context $StorageCtx
    
    $exportRequest = Start-AzureSqlDatabaseExport -SqlConnectionContext $SqlCtx -StorageContainer $Container -DatabaseName $DatabaseName -BlobName $BlobName
    
    Get-AzureSqlDatabaseImportExportStatus -RequestId $exportRequest.RequestGuid -ServerName $ServerName -Username $credential.UserName
    


## Next steps

- [Import an Azure SQL database](sql-database-import-powershell.md)


## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [Disaster Recovery Drills](sql-database-disaster-recovery-drills.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)
