<properties
   pageTitle="Fix SQL Server database compatibility issues before migration to SQL Database"
   description="Microsoft Azure SQL Database, database migration, compatibility, SQL Azure Migration Wizard"
   services="sql-database"
   documentationCenter=""
   authors="carlrabeler"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management"
   ms.date="03/23/2016"
   ms.author="carlrab"/>

# Fix SQL Server database compatibility issues using SQL Azure Migration Wizard before migration to SQL Database

If you determine that your source SQL Server database is not compatible, you have a number of options to fix the  identified database compatibility issues.

> [AZURE.SELECTOR]
- Use [SQL Azure Migration Wizard](sql-database-cloud-migrate-fix-compatibility-issues.md)
- Use [SSDT](sql-database-cloud-migrate-fix-compatibility-issues-ssdt.md)
- Use [SSMS](sql-database-cloud-migrate-fix-compatibility-issues-ssms.md)

## Using SQL Azure Migration wizard

Use the [SQL Azure Migration wizard](http://sqlazuremw.codeplex.com/) CodePlex tool to generate a T-SQL script from an incompatible source database that is then transformed by the wizard to make it compatible with the SQL Database and then connect to Azure SQL Database to execute the script. This tool will also analyze trace files to determine compatiblity issues. The script can be generated with schema only or can include data in BCP format. Additional documentation, including step-by-step guidance is available on CodePlex at [SQL Azure Migration wizard](http://sqlazuremw.codeplex.com/).  

 ![SAMW migration diagram](./media/sql-database-cloud-migrate/02SAMWDiagram.png)

  > [AZURE.NOTE] Note that not all incompatible schema that can be detected by the wizard can be fixed by its built-in transformations. Incompatible script that cannot be addressed will be reported as errors, with comments injected into the generated script. If many errors are detected, use either Visual Studio or SQL Server Management Studio to step through and fix each error that could not be fixed using the SQL Server Migration Wizard.

## Next step: Select migration method and perform migration

[Select migration method](sql-database-cloud-migrate.md#migrate-a-compatible-sql-server-database-to-sql-database).
