<properties 
    pageTitle="Create and export a BACPAC of an Azure SQL database using PowerShell" 
    description="Create and export a BACPAC of an Azure SQL database using PowerShell" 
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="10/23/2015"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Create and export a BACPAC of an Azure SQL database using PowerShell

**Single database**

> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-export.md)
- [PowerShell](sql-database-export-powershell.md)


This article provides directions for exporting a BACPAC of your Azure SQL database with PowerShell.

A [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx) is a .bacpac file that contains a database schema and data. The primary use case for a BACPAC is to move a database from one server to another, to [migrate a local server to the cloud](sql-database-cloud-migrate.md), and for archiving an existing database in an open format.

> [AZURE.NOTE] BACPACs are not intended to be used for backup and restore operations. Azure SQL Database automatically creates backups for every user database. For details, see [Business Continuity Overview](sql-database-business-continuity.md).


The BACPAC is exported into an Azure storage blob container that you can download once the operation successfully completes.


To complete this article you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- An Azure SQL Database. If you do not have a SQL database, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).
- An [Azure Storage account](storage-create-storage-account.md) with a blob container to store the BACPAC. Currently the storage account must use the classic deployment model so choose **Classic** when creating a storage account.
- Azure PowerShell. You can download and install the Azure PowerShell modules by running the [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409). For detailed information, see [How to install and configure Azure PowerShell](powershell-install-configure.md).



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

In the [Azure Preview Portal](https://portal.azure.com) browse to your storage account to get these values. You can find the primary access key by clicking **All settings** and then **Keys** from your storage account's blade.

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
