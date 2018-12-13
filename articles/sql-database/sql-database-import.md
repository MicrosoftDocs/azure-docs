---
title: Import a BACPAC file to create an Azure SQL database | Microsoft Docs
description: Create a newAzure SQL database by importing a BACPAC file.
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: CarlRabeler
ms.author: carlrab
ms.reviewer:
manager: craigg
ms.date: 12/05/2018
---
# Quickstart: Import a BACPAC file to a new Azure SQL Database

You can migrate a SQL Server database to an Azure SQL database using a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx#Anchor_4) file (a zip file with a `.bacpac` extension containing a database's metadata and data). You can import a BACPAC file from Azure blob storage (standard storage only) or from local storage in an on-premises location. To maximize the import speed, we recommend that you specify a higher service tier and compute size (such as P6) and then scale down after the import is successful. The imported database's compatibility level is based on the source database's compatibility level.

> [!IMPORTANT]
> After importing your database, you can choose to operate the database at its current compatibility level (level 100 for the AdventureWorks2008R2 database) or at a higher level. For more information on the implications and options for operating a database at a specific compatibility level, see [ALTER DATABASE Compatibility Level](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-compatibility-level). See also [ALTER DATABASE SCOPED CONFIGURATION](https://docs.microsoft.com/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) for information about additional database-level settings related to compatibility levels.

## Import from a BACPAC file in the Azure portal

This section shows how, in the [Azure portal](https://portal.azure.com), to create an Azure SQL database from a BACPAC file stored in Azure blob storage. The portal *only* supports importing a BACPAC file from Azure blob storage.

> [!NOTE]
> [Azure SQL Database Managed Instance](sql-database-managed-instance.md) supports importing from a BACPAC file using the other methods in this article but does not currently support migrating in the Azure portal.

To import a database in the Azure portal, open the page for the logical server that will host the import and, on the toolbar, select **Import database**.  

   ![Database import](./media/sql-database-import/import.png)

Select the storage account, container, and BACPAC file you want to import. Specify the new database size (usually the same as origin) and provide the destination SQL Server credentials. 

### Monitor import's progress

To monitor an import's progress, open the imported database's logical server page, scroll down to **Settings** and select **Import/Export history**. When successful, the import has a **Completed** status.

To verify the database is live on the server, select **SQL databases** and verify the new database is **Online**.

## Import from a BACPAC file using SqlPackage

To import a SQL database using the [SqlPackage](https://docs.microsoft.com/sql/tools/sqlpackage) command-line utility, see [Import parameters and properties](https://docs.microsoft.com/sql/tools/sqlpackage#import-parameters-and-properties). SqlPackage ships with the latest versions of [SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx) and [SQL Server Data Tools for Visual Studio](https://msdn.microsoft.com/library/mt204009.aspx). You can also download the latest [SqlPackage](https://www.microsoft.com/download/details.aspx?id=53876) from the Microsoft download center.

For scale and performance, we recommend using SqlPackage in most production environments. For a SQL Server Customer Advisory Team blog about migrating using BACPAC files, see [Migrating from SQL Server to Azure SQL Database using BACPAC Files](https://blogs.msdn.microsoft.com/sqlcat/2016/10/20/migrating-from-sql-server-to-azure-sql-database-using-bacpac-files/).

The following SqlPackage command imports the **AdventureWorks2008R2** database from local storage to an Azure SQL Database logical server called **mynewserver20170403**. It creates a new database called **myMigratedDatabase** with a **Premium** service tier and a **P6** Service Objective. Change these values as appropriate for your environment.

```cmd
SqlPackage.exe /a:import /tcs:"Data Source=mynewserver20170403.database.windows.net;Initial Catalog=myMigratedDatabase;User Id=<your_server_admin_account_user_id>;Password=<your_server_admin_account_password>" /sf:AdventureWorks2008R2.bacpac /p:DatabaseEdition=Premium /p:DatabaseServiceObjective=P6
```

> [!IMPORTANT]
> An Azure SQL Database logical server listens on port 1433. To connect to a logical server from behind a corporate firewall, the firewall must have this port open.
>

This example shows how to import a database using SqlPackage with Active Directory Universal Authentication.

```cmd
SqlPackage.exe /a:Import /sf:testExport.bacpac /tdn:NewDacFX /tsn:apptestserver.database.windows.net /ua:True /tid:"apptest.onmicrosoft.com"
```

## Import from a BACPAC file using PowerShell

Use the [New-AzureRmSqlDatabaseImport](/powershell/module/azurerm.sql/new-azurermsqldatabaseimport) cmdlet to submit an import database request to the Azure SQL Database service. Depending on database size, the import may take some time to complete.

 ```powershell
 $importRequest = New-AzureRmSqlDatabaseImport 
    -ResourceGroupName "myResourceGroup" `
    -ServerName "myLogicalServer" `
    -DatabaseName "MyImportSample" `
    -DatabaseMaxSizeBytes "262144000" `
    -StorageKeyType "StorageAccessKey" `
    -StorageKey $(Get-AzureRmStorageAccountKey -ResourceGroupName "myResourceGroup" -StorageAccountName "myStorageAccount").Value[0] `
    -StorageUri "https://myStorageAccount.blob.core.windows.net/importsample/sample.bacpac" `
    -Edition "Standard" `
    -ServiceObjectiveName "P6" `
    -AdministratorLogin "<your_server_admin_account_user_id>" `
    -AdministratorLoginPassword $(ConvertTo-SecureString -String "<your_server_admin_account_password>" -AsPlainText -Force)

 ```

 You can use the [Get-AzureRmSqlDatabaseImportExportStatus](/powershell/module/azurerm.sql/get-azurermsqldatabaseimportexportstatus) cmdlet to check the import's progress. Running the cmdlet immediately after the request usually returns **Status: InProgress**. The import is complete when you see **Status: Succeeded**.

```powershell
$importStatus = Get-AzureRmSqlDatabaseImportExportStatus -OperationStatusLink $importRequest.OperationStatusLink
[Console]::Write("Importing")
while ($importStatus.Status -eq "InProgress")
{
    $importStatus = Get-AzureRmSqlDatabaseImportExportStatus -OperationStatusLink $importRequest.OperationStatusLink
    [Console]::Write(".")
    Start-Sleep -s 10
}
[Console]::WriteLine("")
$importStatus
```

> [!TIP]
For another script example, see [Import a database from a BACPAC file](scripts/sql-database-import-from-bacpac-powershell.md).

## Limitations

Importing to a database in elastic pool isn't supported. You can import data into a single database and then move the database to a pool.

## Import using wizards

You can also use these wizards.

- [Import Data-tier Application Wizard in SQL Server Management Studio](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/import-a-bacpac-file-to-create-a-new-user-database#using-the-import-data-tier-application-wizard).
- [SQL Server Import and Export Wizard](https://docs.microsoft.com/sql/integration-services/import-export-data/start-the-sql-server-import-and-export-wizard).

## Next steps

- To learn how to connect to and query an imported SQL Database, see [Quickstart: Azure SQL Database: Use SQL Server Management Studio to connect and query data](sql-database-connect-query-ssms.md).
- For a SQL Server Customer Advisory Team blog about migrating using BACPAC files, see [Migrating from SQL Server to Azure SQL Database using BACPAC Files](https://blogs.msdn.microsoft.com/sqlcat/2016/10/20/migrating-from-sql-server-to-azure-sql-database-using-bacpac-files/).
- For a discussion of the entire SQL Server database migration process, including performance recommendations, see [SQL Server database migration to Azure SQL Database](sql-database-cloud-migrate.md).
- To learn how to manage and share storage keys and shared access signatures securely, see [Azure Storage Security Guide](https://docs.microsoft.com/azure/storage/common/storage-security-guide).
