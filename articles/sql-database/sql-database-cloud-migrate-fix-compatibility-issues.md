---
title: 'SAMW: Fix Azure SQL Database compatibility migration issues | Microsoft Docs'
description: In this article, you learn about options to detect and fix SQL Server database compatibility issues using the SQL Azure Migration Wizard before migration to Azure SQL Database.
keywords: Microsoft Azure SQL Database, database migration, compatibility, SQL Azure Migration Wizard
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: bba0893a-3247-406c-b155-acb4b3ef479c
ms.service: sql-database
ms.custom: migrate and move
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: sqldb-migrate
ms.date: 08/24/2016
ms.author: carlrab

---
# Use SQL Azure Migration Wizard to Fix SQL Server database compatibility issues before migration to Azure SQL Database
> [!div class="op_single_selector"]
> * Use [SAMW](sql-database-cloud-migrate-fix-compatibility-issues.md)
> * Use [SSDT](sql-database-cloud-migrate-fix-compatibility-issues-ssdt.md)
> * Use [SSMS](sql-database-cloud-migrate-fix-compatibility-issues-ssms.md)
>  

In this article, you learn to detect and fix SQL Server database compatibility issues using the SQL Azure Migration Wizard before migration to Azure SQL Database.

## Using SQL Azure Migration wizard
Use the [SQL Azure Migration wizard](http://sqlazuremw.codeplex.com/) CodePlex tool to generate a T-SQL script from an incompatible source database. This script is then transformed by the wizard to make it compatible with the SQL Database. You then connect to Azure SQL Database to execute the script. This tool also analyzes trace files to determine compatibility issues. The script can be generated with schema only or can include data in BCP format. Additional documentation, including step-by-step guidance is available on CodePlex at [SQL Azure Migration wizard](http://sqlazuremw.codeplex.com/).  

 ![SAMW migration diagram](./media/sql-database-cloud-migrate/02SAMWDiagram.png)

> [!NOTE]
> Not all incompatible schema that are detected by the wizard can be fixed by its built-in transformations. Incompatible script that cannot be addressed are reported as errors, with comments injected into the generated script. If many errors are detected, use either Visual Studio or SQL Server Management Studio to step through and fix each error that could not be fixed using the SQL Server Migration Wizard.
> 
> 

## Next steps
* [Newest version of SSDT](https://msdn.microsoft.com/library/mt204009.aspx)
* [Newest version of SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx)
* [Migrate a compatible SQL Server database to SQL Database](sql-database-cloud-migrate.md#migrate-a-compatible-sql-server-database-to-sql-database)

## Additional resources
* [SQL Database features](sql-database-features.md)
* [Transact-SQL partially or unsupported functions](sql-database-transact-sql-information.md)
* [Migrate non-SQL Server databases using SQL Server Migration Assistant](http://blogs.msdn.com/b/ssma/)

