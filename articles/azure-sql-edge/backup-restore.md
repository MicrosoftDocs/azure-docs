---
title: Back up and restore databases - Azure SQL Edge (Preview)
description: Learn about backup and restore capabilities in Azure SQL Edge (Preview).
keywords: 
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# Back up and restore databases in Azure SQL Edge (Preview) 

Azure SQL Edge is built on the latest versions of the Microsoft SQL Server Database Engine on Linux. It provides similar backup and restore database capabilities as those available in SQL Server on Linux and SQL Server running in containers. The backup and restore component provides an essential safeguard for protecting data stored in your Azure SQL Edge databases. 

To minimize the risk of catastrophic data loss, you should back up your databases periodically to preserve modifications to your data on a regular basis. A well-planned backup and restore strategy helps protect databases against data loss caused by a variety of failures. Test your strategy by restoring a set of backups and then recovering your database, to prepare you to respond effectively to a disaster.

To read more about why backups are important, see [Backup and restore of SQL Server databases](/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases/).

Azure SQL Edge enables you to back up to and restore from both local storage and Azure blobs. For more information, see [SQL Server backup and restore with Azure Blob storage](/sql/relational-databases/backup-restore/sql-server-backup-and-restore-with-microsoft-azure-blob-storage-service/) and [SQL Server backup to URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url).

## Back up a database in Azure SQL Edge

Azure SQL Edge supports the same backup types as SQL Server. For a complete list, see [Backup overview](/sql/relational-databases/backup-restore/backup-overview-sql-server/).

> [!IMPORTANT] 
> Databases created in Azure SQL Edge use the simple recovery model by default. As such, you can't perform log backups on these databases. If you need to do this, you'll need an administrator to change the database recovery model to the full recovery model. For a complete list of recovery models supported by SQL Server, see [Recovery model overview](/sql/relational-databases/backup-restore/recovery-models-sql-server#RMov).

### Back up to local disk

In the following example, you use the `BACKUP DATABASE` Transact-SQL command to create a database backup in the container. For the purpose of this example, you create a new folder called *backup* to store the backup files.

1. Create a folder for the backups. Run this command on the host where your Azure SQL Edge container is running. In the following command, replace **<AzureSQLEdge_Container_Name>** with the name of the Azure SQL Edge container in your deployment.

    ```bash
    sudo docker exec -it <AzureSQLEdge_Container_Name> mkdir /var/opt/mssql/backup
    ```

2. Connect to the Azure SQL Edge instance by using SQL Server Management Studio (SSMS), or by using Azure Data Studio. Run the `BACKUP DATABASE` command to take the backup of your user database. In the following example, you're taking the backup of the *IronOreSilicaPrediction* database.

    ```sql
    BACKUP DATABASE [IronOreSilicaPrediction] 
    TO DISK = N'/var/opt/mssql/backup/IronOrePredictDB.bak' 
    WITH NOFORMAT, NOINIT,  NAME = N'IronOreSilicaPrediction-Full Database Backup', 
    SKIP, NOREWIND, NOUNLOAD, COMPRESSION,  STATS = 10
    GO
    ```

3. After you run the command, if the backup of the database is successful, you'll see messages similar to the following in the results section of SSMS or Azure Data Studio.

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

### Back up to URL

Azure SQL Edge supports backups to both page blobs and block blobs. For more information, see [Back up to block blob vs page blob](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url?view=sql-server-ver15#blockbloborpageblob). In the following example, the database *IronOreSilicaPrediction* is being backed up to a block blob. 

1. To configure backups to block blobs, first generate a shared access signature (SAS) token that you can use to create a SQL Server credential on Azure SQL Edge. The script creates a SAS that is associated with a stored access policy. For more information, see [Shared access signatures, part 1: Understanding the SAS model](https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/). The script also writes the T-SQL command required to create the credential on SQL Server. The following script assumes that you already have an Azure subscription with a storage account, and a storage container for the backups.

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

    After successfully running the script, copy the `CREATE CREDENTIAL` command to a query tool. Then connect to an instance of SQL Server, and run the command to create the credential with the SAS.

2. Connect to the Azure SQL Edge instance by using SSMS or Azure Data Studio, and create the credential by using the command from the previous step. Make sure to replace the `CREATE CREDENTIAL` command with the actual output from the previous step.

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

## Restore a database in Azure SQL Edge

In Azure SQL Edge, you can restore from a local disk, a network location, or an Azure Blob storage account. For more information about restore and recovery in SQL Server, see [Restore and recovery overview](https://docs.microsoft.com/sql/relational-databases/backup-restore/restore-and-recovery-overview-sql-server?view=sql-server-ver15). For an overview of the simple recovery model in SQL Server, see [Complete database restores (simple recovery model)](https://docs.microsoft.com/sql/relational-databases/backup-restore/complete-database-restores-simple-recovery-model?view=sql-server-ver15).

### Restore from a local disk

This example uses the *IronOreSilicaPrediction* backup that you made in the previous example. Now, you'll restore it as a new database with a different name.

1. If the database backup file isn't already present in the container, you can use the following command to copy the file into the container. The following example assumes that the backup file is present on the local host, and is being copied to the /var/opt/mssql/backup folder into an Azure SQL Edge container named *sql1*.

    ```bash
    sudo docker cp IronOrePredictDB.bak sql1:/var/opt/mssql/backup
    ```

2. Connect to the Azure SQL Edge instance by using SSMS or Azure Data Studio to run the restore command. In the following example, **IronOrePredictDB.bak** is restored to create a new database, **IronOreSilicaPrediction_2**.

    ```sql
    Restore FilelistOnly from disk = N'/var/opt/mssql/backup/IronOrePredictDB.bak'

    Restore Database IronOreSilicaPrediction_2
    From disk = N'/var/opt/mssql/backup/IronOrePredictDB.bak'
    WITH MOVE 'IronOreSilicaPrediction' TO '/var/opt/mssql/data/IronOreSilicaPrediction_Primary_2.mdf',
    MOVE 'IronOreSilicaPrediction_log' TO '/var/opt/mssql/data/IronOreSilicaPrediction_Primary_2.ldf'
    ```

3. After you run the restore command, if the restore operation was successful, you'll see messages similar to the following in the output window. 

    ```txt
    Processed 51648 pages for database 'IronOreSilicaPrediction_2', file 'IronOreSilicaPrediction' on file 1.
    Processed 2 pages for database 'IronOreSilicaPrediction_2', file 'IronOreSilicaPrediction_log' on file 1.
    RESTORE DATABASE successfully processed 51650 pages in 6.543 seconds (61.670 MB/sec).

    Completion time: 2020-04-13T23:49:21.1600986-07:00
    ```

### Restore from URL

Azure SQL Edge also supports restoring a database from an Azure Storage account. You can restore from either the block blobs or page blob backups. In the following example, the *IronOreSilicaPrediction_2020_04_16.bak* database backup file on a block blob is restored to create the database, *IronOreSilicaPrediction_3*.

```sql
RESTORE DATABASE IronOreSilicaPrediction_3
FROM URL = 'https://mystorageaccount.blob.core.windows.net/mysecondcontainer/IronOreSilicaPrediction_2020_04_16.bak'
WITH MOVE 'IronOreSilicaPrediction' TO '/var/opt/mssql/data/IronOreSilicaPrediction_Primary_3.mdf', 
MOVE 'IronOreSilicaPrediction_log' TO '/var/opt/mssql/data/IronOreSilicaPrediction_Primary_3.ldf',
STATS = 10;
```


