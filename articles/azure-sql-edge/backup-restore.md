---
title: Backup and restore databases - Azure SQL Edge (Preview)
description: Learn about backup and restore capabilities in Azure SQL Edge (Preview)
keywords: 
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# Backup and Restore databases in Azure SQL Edge (Preview) 

Azure SQL Edge is built on the latest versions of the Microsoft SQL Server Database Engine on Linux, providing similar backup and restore database capabilities as those available in SQL Server on Linux and SQL Server running in containers. Backup and restore component provides an essential safeguard for protecting data stored in your Azure SQL Edge databases. To minimize the risk of catastrophic data loss, it's recommended that you back up your databases periodically to preserve modifications to your data on a regular basis. A well-planned backup and restore strategy helps protect databases against data loss caused by a variety of failures. Test your strategy by restoring a set of backups and then recovering your database to prepare you to respond effectively to a disaster.

To read more about why backups are important, see [Back Up and Restore of SQL Server Databases](/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases/).

Azure SQL Edge supports backup to and restore from both local storage or from Azure blobs. For more information on backup to and restore from Azure Blob Storage, refer [SQL Server Backup and Restore with Microsoft Azure Blob Storage Service](/sql/relational-databases/backup-restore/sql-server-backup-and-restore-with-microsoft-azure-blob-storage-service/) and [SQL Server Backup to URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url).

## Backing up a database in Azure SQL Edge

Azure SQL Edge supports the same backup types as supported by SQL Server. For a complete list of the backup types supported in SQL Server, refer [Backup Overview](/sql/relational-databases/backup-restore/backup-overview-sql-server/).

> [!IMPORTANT] 
> Databases created in Azure SQL Edge use simple recovery model by default. As such log backups cannot be performed on these databases. If there is a need to perform log backups on these databases, an administrator would need to change the database recovery model to full recovery model. For a complete list of recovery models supported by SQL Server, refer [Recovery Model Overview](/sql/relational-databases/backup-restore/recovery-models-sql-server#RMov).

### Backup to local disk

In the example provided below, BACKUP DATABASE Transact-SQL command is used to create a database backup in the container. For the purpose of this example, a new folder called "backup" is created to store the backup files.

1. Create a folder for the backups. This command needs to be executed on the host where your Azure SQL Edge container is running. In the command below replace **<AzureSQLEdge_Container_Name>** with the name of Azure SQL Edge container in your deployment.

    ```bash
    sudo docker exec -it <AzureSQLEdge_Container_Name> mkdir /var/opt/mssql/backup
    ```

2. Connect to the Azure SQL Edge instance using SQL Server Management Studio (SSMS) or using Azure Data Studio (ADS) and run the Backup database command to take the backup of your user database. In the example below, we are taking the backup of the *IronOreSilicaPrediction* database.

    ```sql
    BACKUP DATABASE [IronOreSilicaPrediction] 
    TO DISK = N'/var/opt/mssql/backup/IronOrePredictDB.bak' 
    WITH NOFORMAT, NOINIT,  NAME = N'IronOreSilicaPrediction-Full Database Backup', 
    SKIP, NOREWIND, NOUNLOAD, COMPRESSION,  STATS = 10
    GO
    ```

3. After you run the command and if the backup of the database is successful, you'll see messages similar to the following in the results section of SSMS or ADS.

    ```txt
    10 percent processed.
    20 percent processed.
    30 percent processed.
    40 percent processed.
    50 percent processed.
    60 percent processed.
    70 percent processed.
    80 percent processed.
    90 percent processed.
    100 percent processed.
    Processed 51648 pages for database 'IronOreSilicaPrediction', file 'IronOreSilicaPrediction' on file 1.
    Processed 2 pages for database 'IronOreSilicaPrediction', file 'IronOreSilicaPrediction_log' on file 1.
    BACKUP DATABASE successfully processed 51650 pages in 3.588 seconds (112.461 MB/sec).

    Completion time: 2020-04-09T23:54:48.4957691-07:00
    ```

### Backup to URL

Azure SQL Edge supports backups to both page blobs and block blobs. For more information on page blobs and block blobs, refer [Backup to Block blob vs Page blob](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url?view=sql-server-ver15#blockbloborpageblob). In the example below, database *IronOreSilicaPrediction* is being backed up to a block blob. 

1. The first step in configuring backups to block blobs is to generate a shared access signature (SAS) token that can be used to create a SQL Server Credential on Azure SQL Edge. The script creates a Shared Access Signature that is associated with a Stored Access Policy. For more information, see [Shared Access Signatures, Part 1: Understanding the SAS Model](https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/). The script also writes the T-SQL command required to create the credential on SQL Server. The script below assumes that you already have an Azure subscription with a storage account and a storage container for the backups.

    ```PowerShell
    # Define global variables for the script  
    $subscriptionName='<your subscription name>'   # the name of subscription name you will use
    $resourcegroupName = '<your resource group name>' # the name of resource group you will use
    $storageAccountName= '<your storage account name>' # the storage account name you will use for backups
    $containerName= '<your storage container name>'  # the storage container name to which you will attach the SAS policy with its SAS token  
    $policyName = 'SASPolicy' # the name of the SAS policy  

    # adds an authenticated Azure account for use in the session
    Login-AzAccount

    # set the tenant, subscription and environment for use in the rest of
    Select-AzSubscription -Subscription $subscriptionName

    # Generate the SAS token
    $sa = Get-AzStorageAccount -ResourceGroupName $resourcegroupName -Name $storageAccountName 
    $storagekey = Get-AzStorageAccountKey -ResourceGroupName $resourcegroupName -Name $storageAccountName 
    $storageContext = New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storagekey[0].Value
    $cbc = Get-AzStorageContainer -Name $containerName -Context $storageContext
    $policy = New-AzStorageContainerStoredAccessPolicy -Container $containerName -Policy $policyName -Context $storageContext -ExpiryTime $(Get-Date).ToUniversalTime().AddYears(10) -Permission "rwld"
    $sas = New-AzStorageContainerSASToken -Policy $policyName -Context $storageContext -Container $containerName
    Write-Host 'Shared Access Signature= '$($sas.Substring(1))''

    # Outputs the Transact SQL to the clipboard and to the screen to create the credential using the Shared Access Signature  
    Write-Host 'Credential T-SQL'  
    $tSql = "CREATE CREDENTIAL [{0}] WITH IDENTITY='Shared Access Signature', SECRET='{1}'" -f $cbc.CloudBlobContainer.Uri.AbsoluteUri,$sas.Substring(1)
    $tSql | clip  
    Write-Host $tSql
    ```

    After successfully running the script, copy the CREATE CREDENTIAL command to a query tool, connect to an instance of SQL Server and run the command to create the credential with the Shared Access Signature.

2. Connect to the Azure SQL Edge instance using SQL Server Management Studio (SSMS) or using Azure Data Studio (ADS) and create the credential using the command from the previous step. Make sure to replace the CREATE CREDENTIAL command with the actual output from the previous step.

    ```sql
    IF NOT EXISTS  
    (SELECT * FROM sys.credentials
    WHERE name = 'https://<mystorageaccountname>.blob.core.windows.net/<mystorageaccountcontainername>')  
    CREATE CREDENTIAL [https://<mystorageaccountname>.blob.core.windows.net/<mystorageaccountcontainername>]
       WITH IDENTITY = 'SHARED ACCESS SIGNATURE',  
       SECRET = '<SAS_TOKEN>';
    ```

3. The following command takes a backup of the *IronOreSilicaPrediction* to the Azure storage container.

    ```sql
    BACKUP DATABASE IronOreSilicaPrediction
    TO URL = 'https://<mystorageaccountname>.blob.core.windows.net/<mycontainername>/IronOreSilicaPrediction.bak'
    With MAXTRANSFERSIZE = 4194304,BLOCKSIZE=65536;  
    GO
    ```

## Restoring a database in Azure SQL Edge

Azure SQL Edge supports restoring from both a local disk, a network location or from an Azure Blob Storage account. For an overview of Restore and Recovery in SQL Server, refer [Restore and Recovery Overview](https://docs.microsoft.com/sql/relational-databases/backup-restore/restore-and-recovery-overview-sql-server?view=sql-server-ver15). For an overview of the simple recovery model in SQL Server, refer [Complete Database Restores (Simple Recovery Model)](https://docs.microsoft.com/sql/relational-databases/backup-restore/complete-database-restores-simple-recovery-model?view=sql-server-ver15).

### Restore from local disk

This example uses the *IronOreSilicaPrediction* backup performed in the previous example for restoration as a new database with a different name.

1. If the database backup file is not already present in the container, you can use the command below to copy the file into the container. The example below assumes that the backup file is present on the local host and is being copied to the /var/opt/mssql/backup folder into an Azure SQL Edge container named sql1.

    ```bash
    sudo docker cp IronOrePredictDB.bak sql1:/var/opt/mssql/backup
    ```

2. Connect to the Azure SQL Edge instance using SQL Server Management Studio (SSMS) or using Azure Data Studio (ADS) to execute the restore command. In the example below, the **IronOrePredictDB.bak** is restored to create a new database **IronOreSilicaPrediction_2**

    ```sql
    Restore FilelistOnly from disk = N'/var/opt/mssql/backup/IronOrePredictDB.bak'

    Restore Database IronOreSilicaPrediction_2
    From disk = N'/var/opt/mssql/backup/IronOrePredictDB.bak'
    WITH MOVE 'IronOreSilicaPrediction' TO '/var/opt/mssql/data/IronOreSilicaPrediction_Primary_2.mdf',
    MOVE 'IronOreSilicaPrediction_log' TO '/var/opt/mssql/data/IronOreSilicaPrediction_Primary_2.ldf'
    ```

3. After you run the restore command and if the restore operation was successful, you'll see the messages similar to the following in the output window. 

    ```txt
    Processed 51648 pages for database 'IronOreSilicaPrediction_2', file 'IronOreSilicaPrediction' on file 1.
    Processed 2 pages for database 'IronOreSilicaPrediction_2', file 'IronOreSilicaPrediction_log' on file 1.
    RESTORE DATABASE successfully processed 51650 pages in 6.543 seconds (61.670 MB/sec).

    Completion time: 2020-04-13T23:49:21.1600986-07:00
    ```

### Restore from URL

Azure SQL Edge also supports restoring a database from an Azure Storage account. Restores can be performed from either the block blobs or page blob backups. In the example provided below, the *IronOreSilicaPrediction_2020_04_16.bak* database backup file on a block blob is restored to create the database *IronOreSilicaPrediction_3*.

```sql
RESTORE DATABASE IronOreSilicaPrediction_3
FROM URL = 'https://mystorageaccount.blob.core.windows.net/mysecondcontainer/IronOreSilicaPrediction_2020_04_16.bak'
WITH MOVE 'IronOreSilicaPrediction' TO '/var/opt/mssql/data/IronOreSilicaPrediction_Primary_3.mdf', 
MOVE 'IronOreSilicaPrediction_log' TO '/var/opt/mssql/data/IronOreSilicaPrediction_Primary_3.ldf',
STATS = 10;
```


