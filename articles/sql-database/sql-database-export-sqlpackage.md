---
title: 'SqlPackage: Export a SQL Server database to a BACPAC file (Azure) | Microsoft Docs'
description: his article shows how to export a SQL Server database to a BACPAC file using the SqlPackage command-line utility.
keywords: Microsoft Azure SQL Database, database migration, export database, export BACPAC file, sqlpackage
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 7b9541c5-5590-4c70-ad36-73007389f6dc
ms.service: sql-database
ms.custom: migrate and move
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: sqldb-migrate
ms.date: 11/08/2016
ms.author: carlrab

---
# Export a SQL Server database to a BACPAC file using SqlPackage

This article shows how to export a SQL Server database to a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx#Anchor_4) file using the [SqlPackage](https://msdn.microsoft.com/library/hh550080.aspx) command-line utility. This utility ships with the latest versions of [SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx) and [SQL Server Data Tools for Visual Studio](https://msdn.microsoft.com/library/mt204009.aspx), or you can download the latest version of [SqlPackage](https://www.microsoft.com/download/details.aspx?id=53876) directly from the Microsoft download center.

1. Open a command prompt and change a directory containing the sqlpackage.exe command-line utility - this utility ships with both Visual Studio and SQL Server. Use search on your computer to find the path in your environment.
2. Execute the following sqlpackage.exe command with the following arguments for your environment:
   
```    sqlpackage.exe /Action:Export /ssn:< server_name > /sdn:< database_name > /tf:< target_file >
```
   
   | Argument | Description |
   | --- | --- |
   | < server_name > |source server name |
   | < database_name > |source database name |
   | < target_file > |file name and location for BACPAC file |
   
   ![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSQLPackage01b.png)

## Next steps

* To learn about importing a BACPAC using SQLPackage, see [Import a BACPAC to Azure SQL Database using SqlPackage](sql-database-import-sqlpackage.md)
* To learn about importing a BACPAC using the Azure portal, see [Import a BACPAC to Azure SQL Database using the Azure portal](sql-database-import-portal.md)
* To learn about importing a BACPAC using the Azure portal, see [Import a BACPAC to Azure SQL Database using PowerShell](sql-database-import-powershell.md)
