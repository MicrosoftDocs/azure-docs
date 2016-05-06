<properties
   pageTitle="Determine SQL Database compatibility using SSMS"
   description="Microsoft Azure SQL Database, database migration, SQL Database compatibility, Export Data Tier Application Wizard"
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
   ms.date="03/14/2016"
   ms.author="carlrab"/>

# Determine SQL Database compatibility using SSMS

> [AZURE.SELECTOR]
- [SqlPackage](sql-database-cloud-migrate-determine-compatibility-sqlpackage.md)
- [SQL Server Management Studio](sql-database-cloud-migrate-determine-compatibility-ssms.md)
 
In this article you learn to determine if a SQL Server database is compatible to migrate to SQL Database using the Export Data Tier Application Wizard in SQL Server Management Studio.

## Using SQL Server Management Studio

1. Verify that you have the latest version of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

 	 > [AZURE.IMPORTANT] It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).

2. Open Management Studio and connect to your source database in Object Explorer.
3. Right-click the source database in the Object Explorer, point to **Tasks**, and click **Export Data-Tier Application…**

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS01.png)

4. In the export wizard, click **Next**, and then on the **Settings** tab, configure the export to save the BACPAC file to either a local disk location or to an Azure blob. A BACPAC file will only be saved if you have no database compatibility issues. If there are compatibility issues, they will be displayed on the console.

	![Export settings](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS02.png)

5. Click the **Advanced tab** and clear the **Select All** checkbox to skip exporting data. Our goal at this point is only to test for compatibility.

	![Export settings](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS03.png)

6. Click **Next** and then click **Finish**. Database compatibility issues, if any, will appear after the wizard validates the schema.

	![Export settings](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS04.png)

7. If no errors appear, your database is compatible and you are ready to migrate. If you have errors, you will need to fix them. To see the errors, click **Error** for **Validating schema**. 
	![Export settings](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS05.png)

8.	If the *.BACPAC file is successfully generated, then your database is compatible with SQL Database, and you are ready to migrate.

## Next step: Fix compatibility issues, if any

[Fix database compatibility issues](sql-database-cloud-migrate-fix-compatibility-issues.md), if any.