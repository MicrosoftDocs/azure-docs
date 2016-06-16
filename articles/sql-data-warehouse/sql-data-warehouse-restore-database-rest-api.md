<properties
   pageTitle="Restore an Azure SQL Data Warehouse (REST API) | Microsoft Azure"
   description="REST API tasks for restoring an Azure SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="elfisher"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/10/2016"
   ms.author="elfish;barbkess;sonyama"/>

# Restore an Azure SQL Data Warehouse (REST API)

> [AZURE.SELECTOR]
- [Overview][]
- [Portal][]
- [PowerShell][]
- [REST][]

In this article you will learn how to restore an Azure SQL Data Warehouse using the REST API.

## Before you begin

**Verify your DTU capacity.** Each SQL Data Warehouse is hosted by a SQL server logical server.  This logical server has a capacity limit measured in DTU.  Before you can restore a SQL Data Warehouse, it is important to make sure the SQL server logical server hosting your database has enough DTU capacity for the database being restored. See this blog post for more information on [how to view and increase DTU quota][].

## Restore an active or paused database

To restore a database:

1. Get the list of database restore points using the Get Database Restore Points operation.
2. Begin your restore by using the [Create database restore request][] operation.
3. Track the status of your restore by using the [Database operation status][] operation.

>[AZURE.NOTE] After the restore has completed, you can configure your recovered database by following the [Finalize a recovered database][] guide.

## Restore a deleted database

To restore a deleted database:

1.	List all of your restorable deleted databases by using the [List restorable dropped databases][] operation.
2.	Get the details for the deleted database you want to restore by using the [Get restorable dropped database][] operation.
3.	Begin your restore by using the [Create database restore request][] operation.
4.	Track the status of your restore by using the [Database operation status][] operation.

>[AZURE.NOTE] After the restore has completed, you can configure your recovered database by following the [Finalize a recovered database][] guide.


## Next steps
To learn about the business continuity features of Azure SQL Database editions, please read the [Azure SQL Database business continuity overview][].

<!--Image references-->

<!--Article references-->
[Azure SQL Database business continuity overview]: ./sql-database-business-continuity.md
[Finalize a recovered database]: ./sql-database-recovered-finalize.md
[How to install and configure Azure PowerShell]: ./powershell-install-configure.md
[Overview]: ./sql-data-warehouse-restore-database-overview.md
[Portal]: ./sql-data-warehouse-restore-database-portal.md
[PowerShell]: ./sql-data-warehouse-restore-database-powershell.md
[REST]: ./sql-data-warehouse-restore-database-rest-api.md

<!--MSDN references-->
[Create database restore request]: https://msdn.microsoft.com/library/azure/dn509571.aspx
[Database operation status]: https://msdn.microsoft.com/library/azure/dn720371.aspx
[Get restorable dropped database]: https://msdn.microsoft.com/library/azure/dn509574.aspx
[List restorable dropped databases]: https://msdn.microsoft.com/library/azure/dn509562.aspx
[Restore-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt693390.aspx


<!--Blog references-->
[how to view and increase DTU quota]: https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests/

<!--Other Web references-->
[Azure Portal]: https://portal.azure.com/
[Microsoft Web Platform Installer]: https://aka.ms/webpi-azps
