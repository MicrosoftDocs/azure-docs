
<properties
   pageTitle="Export a SQL Server database to a BACPAC file using SQL Server Management Studio | Microsoft Azure"
   description="Microsoft Azure SQL Database, database migration, export database, export BACPAC file, Export Data Tier Application wizard"
   services="sql-database"
   documentationCenter=""
   authors="CarlRabeler"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management"
   ms.date="05/31/2016"
   ms.author="carlrab"/>

# Export a SQL Server database to a BACPAC file using SQL Server Management Studio

> [AZURE.SELECTOR]
- [SSMS](sql-database-cloud-migrate-compatible-export-bacpac-ssms.md)
- [SqlPackage](sql-database-cloud-migrate-compatible-export-bacpac-sqlpackage.md)

 
This article shows how to export a SQL Server database to a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx#Anchor_4) file using the Export Data Tier Application Wizard in SQL Server Management Studio. 

1. Verify that you have the latest version of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

	 > [AZURE.IMPORTANT] It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).

2. Open Management Studio and connect to your source database in Object Explorer.

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/MigrateUsingBACPAC01.png)

3. Right-click the source database in the Object Explorer, point to **Tasks**, and click **Export Data-Tier Application…**

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS01.png)

4. In the export wizard, configure the export to save the BACPAC file to either a local disk location or to an Azure blob. The exported BACPAC always includes the complete database schema and, by default, data from all the tables. Use the Advanced tab if you want to exclude data from some or all of the tables. You might, for example, choose to export only the data for reference tables rather than from all tables.

***Important*** When exporting a BACPAC to Azure blob storage, use standard storage. Importing a BACPAC from premium storage is not supported.

	![Export settings](./media/sql-database-cloud-migrate/MigrateUsingBACPAC02.png)


## Next steps

- [Newest version of SSDT](https://msdn.microsoft.com/library/mt204009.aspx)
- [Newest version of SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx)
- [Import a BACPAC to Azure SQL Database using SSMS](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md)
- [Import a BACPAC to Azure SQL Database SqlPackage](sql-database-cloud-migrate-compatible-import-bacpac-sqlpackage.md)
- [Import a BACPAC to Azure SQL Database Azure Portal](sql-database-import.md)
- [Import a BACPAC to Azure SQL Database PowerShell](sql-database-import-powershell.md)

## Additional resources

- [SQL Database V12](sql-database-v12-whats-new.md)
- [Transact-SQL partially or unsupported functions](sql-database-transact-sql-information.md)
- [Migrate non-SQL Server databases using SQL Server Migration Assistant](http://blogs.msdn.com/b/ssma/)
