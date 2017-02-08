---
title: 'Azure portal: Export an Azure SQL database to a BACPAC file | Microsoft Docs'
description: Export an Azure SQL database to a BACPAC file  using the Azure Portal
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 41d63a97-37db-4e40-b652-77c2fd1c09b7
ms.service: sql-database
ms.custom: migrate and move
ms.devlang: NA
ms.date: 12/20/2016
ms.author: sstein;carlrab
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA

---
# Export an Azure SQL database to a BACPAC file

This article discusses exporting your Azure SQL database to a BACPAC file (stored in Azure blob storage). You can export your Azure SQL database using the [Azure portal](sql-database-export-portal.md), [PowerShell](sql-database-export-powershell.md), or [SQLPackage](sql-database-export-sqlpackage.md).

When you need to export an Azure SQL database for archiving or for moving to another platform, you can export the database schema and data to a BACPAC file. A BACPAC file is simply a ZIP file with an extension of BACPAC. A BACPAC file can later be stored in Azure blob storage or in local storage in an on-premises location and later imported back into Azure SQL Database or into a SQL Server on-premises installation. 

> [!IMPORTANT]
> Azure SQL Database Automated Export is now in preview and will be retired on March 1, 2017. Starting December 1, 2016, you will no longer be able to configure automated export on any SQL database. All your existing automated export jobs will continue to work until March 1, 2017. After December 1, 2016, you can use [long-term backup retention](sql-database-long-term-retention.md) or [Azure Automation](../automation/automation-intro.md) to archive SQL databases periodically using PowerShell periodically according to a schedule of your choice. For a sample script, you can download the [sample script from Github](https://github.com/Microsoft/sql-server-samples/tree/master/samples/manage/azure-automation-automated-export). 
>

## Considerations

* For an archive to be transactionally consistent, you must ensure either that no write activity is occurring during the export, or that you are exporting from a [transactionally consistent copy](sql-database-copy.md) of your Azure SQL database.
* The maximum size of a BACPAC file archived to Azure Blob storage is 200 GB. To archive a larger BACPAC file to local storage, use the [SqlPackage](https://msdn.microsoft.com/library/hh550080.aspx) command-prompt utility. This utility ships with both Visual Studio and SQL Server. You can also [download](https://msdn.microsoft.com/library/mt204009.aspx) the latest version of SQL Server Data Tools to get this utility.
* Archiving to Azure premium storage by using a BACPAC file is not supported.
* If the export operation exceeds 20 hours, it may be canceled. To increase performance during export, you can:
  * Temporarily increase your service level.
  * Cease all read and write activity during the export.
  * Use a [clustered index](https://msdn.microsoft.com/library/ms190457.aspx) with non-null values on all large tables. Without clustered indexes, an export may fail if it takes longer than 6-12 hours. This is because the export service needs to complete a table scan to try to export entire table. A good way to determine if your tables are optimized for export is to run **DBCC SHOW_STATISTICS** and make sure that the *RANGE_HI_KEY* is not null and its value has good distribution. For details, see [DBCC SHOW_STATISTICS](https://msdn.microsoft.com/library/ms174384.aspx).

> [!NOTE]
> BACPACs are not intended to be used for backup and restore operations. Azure SQL Database automatically creates backups for every user database. For details, see [Business Continuity Overview](sql-database-business-continuity.md).  
> 


## Next steps

* You can export your Azure SQL database using the [Azure portal](sql-database-export-portal.md), [PowerShell](sql-database-export-powershell.md), or [SQLPackage](sql-database-export-sqlpackage.md).
* You can copy your Azure SQL database within Azure using the [Azure portal](sql-database-copy-portal.md), [PowerShell](sql-database-copy-powershell.md), or [Transact-SQL](sql-database-copy-transact-sql.md). 
* For an overview of copying a database within Azure, see also [Copying an Azure SQL database](sql-database-copy.md).
