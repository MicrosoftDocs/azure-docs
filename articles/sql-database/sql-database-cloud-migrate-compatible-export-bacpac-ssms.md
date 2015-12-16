<properties
   pageTitle="Export a SQL Server database to a BACPAC file using SSMS"
   description="Microsoft Azure SQL Database, database migration, export database, export BACPAC file, Export Data Tier Application wizard"
   services="sql-database"
   documentationCenter=""
   authors="carlrabeler"
   manager="jeffreyg"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management"
   ms.date="12/15/2015"
   ms.author="carlrab"/>

# Export a SQL Server database to a BACPAC file using SSMS

- [Export to BACPAC using SSMS](sql-database-cloud-migrate-compatible-export-bacpac-ssms.md)
- [Export to BACPAC using SqlPackage](sql-database-cloud-migrate-compatible-export-bacpac-sqlpackage.md)
- [Import from BACPAC using SSMS](sql-database-cloud-migrate-compatible-import-bacpac-ssms)
- [Import from BACPAC using SqlPackage](sql-database-cloud-migrate-compatible-import-bacpac-sqlpackage)
- [Import from BACPAC using Azure portal](sql-database-import.md)
- [Import from BACPAC using PowerShell](sql-database-import-powershell.md)
 
This article shows how to export a SQL Server database to a [BACPAC](https://msdn.microsoft.com/en-us/library/ee210546.aspx#Anchor_4) file using the Export Data Tier Application Wizard in SQL Server Management Studio. 

1. Verify that you have the latest version of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

	 > [AZURE.IMPORTANT] [Use newest version of version of SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx). It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database.

2. Open Management Studio and connect to your source database in Object Explorer.

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/MigrateUsingBACPAC01.png)

3. Right-click the source database in the Object Explorer, point to **Tasks**, and click **Export Data-Tier Application…**

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS01.png)

4. In the export wizard, configure the export to save the BACPAC file to either a local disk location or to an Azure blob. The exported BACPAC always includes the complete database schema and, by default, data from all the tables. Use the Advanced tab if you want to exclude data from some or all of the tables. You might, for example, choose to export only the data for reference tables rather than from all tables.

	![Export settings](./media/sql-database-cloud-migrate/MigrateUsingBACPAC02.png)
