<properties
   pageTitle="Migrating a SQL Server database to Azure SQL Database"
   description="Microsoft Azure SQL Database, database deploy, database migration, import database, export database, migration wizard"
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

# Determine if your database is compatible using Export Data Tier Application

1. Verify that you have version 13.0.600.65 or later of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

 	 > [AZURE.IMPORTANT] Download the [latest](https://msdn.microsoft.com/library/mt238290.aspx) version of SQL Server Management Studio. It is recommended that you always use the latest version of Management Studio to remain synchronized with Microsoft Azure and SQL Database.

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

> [AZURE NOTE] For guidance on how to fix database compatibility issues, go to [fix database compatibility issues](../sql-database-migrate-fix-compatibility-issues.md).

8.	If the *.BACPAC file is successfully generated, then your database is compatible with SQL Database, and you are ready to migrate.

