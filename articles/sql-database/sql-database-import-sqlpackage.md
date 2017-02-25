---
title: 'SqlPackage: Import to Azure SQL Database from a BACPAC file | Microsoft Docs'
description: This article shows how to import to SQL database from a BACPAC file using the SqlPackage command-line utility.
keywords: Microsoft Azure SQL Database, database migration, import database, import BACPAC file, sqlpackage
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 424afa27-5f13-4ec3-98f6-99a511a6a2df
ms.service: sql-database
ms.custom: migrate and move
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: sqldb-migrate
ms.date: 02/08/2017
ms.author: carlrab

---
# Import a database from a BACPAC file to Azure SQL Database using SqlPackage

This article shows how to import to SQL database from a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx#Anchor_4) file using the [SqlPackage](https://msdn.microsoft.com/library/hh550080.aspx) command-line utility. This utility ships with the latest versions of [SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx) and [SQL Server Data Tools for Visual Studio](https://msdn.microsoft.com/library/mt204009.aspx), or you can download the latest version of [SqlPackage](https://www.microsoft.com/download/details.aspx?id=53876) directly from the Microsoft download center.

> [!NOTE]
> The following steps assume that you have already provisioned a SQL Database server, have the connection information on hand, and have verified that your source database is compatible.
> 
> 

## Import the database
Use the [SqlPackage.exe](https://msdn.microsoft.com/library/hh550080.aspx) command-line utility to import a compatible SQL Server database (or Azure SQL database) from a BACPAC file.

> [!NOTE]
> The following steps assume that you have already provisioned an Azure SQL Database server and have the connection information on hand.
>  

At a command prompt in the directory containing the newest version of the sqlpackage.exe command-line utility, execute a command similar to the following sample command that imports a BACPAC file into an Azure SQL Database as a Premium P11.

```
SqlPackage.exe /a:import /tcs:"Data Source=SERVER;Initial Catalog=DBNAME;User Id=USER;Password=PASSWORD" /sf:C:\db.bacpac /p:DatabaseEdition=Premium /p:DatabaseServiceObjective=P11
```   

## Next steps

* For a discussion of the entire SQL Server database migration process, including performance recommendations, see [Migrate a SQL Server database to Azure SQL Database](sql-database-cloud-migrate.md).
* For reference content on SQLPackage, see [SqlPackage.exe](https://msdn.microsoft.com/library/hh550080.aspx).
* To download the latest version of SQLPackage, see [SqlPackage](https://www.microsoft.com/download/details.aspx?id=53876).
* For a SQL Server Customer Advisory Team blog about migrating using BACPAC files, see [Migrating from SQL Server to Azure SQL Database using BACPAC Files](https://blogs.msdn.microsoft.com/sqlcat/2016/10/20/migrating-from-sql-server-to-azure-sql-database-using-bacpac-files/).

