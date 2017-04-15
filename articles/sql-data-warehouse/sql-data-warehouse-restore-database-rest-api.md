---
title: Restore an Azure SQL Data Warehouse (REST API) | Microsoft Docs
description: REST API tasks for restoring an Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: Lakshmi1812
manager: jhubbard
editor: ''

ms.assetid: fca922c6-b675-49c7-907e-5dcf26d451dd
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: backup-restore
ms.date: 10/31/2016
ms.author: lakshmir;barbkess

---
# Restore an Azure SQL Data Warehouse (REST API)
> [!div class="op_single_selector"]
> * [Overview][Overview]
> * [Portal][Portal]
> * [PowerShell][PowerShell]
> * [REST][REST]
> 
> 

In this article you will learn how to restore an Azure SQL Data Warehouse using the REST API.

## Before you begin
**Verify your DTU capacity.** Each SQL Data Warehouse is hosted by a SQL server (e.g. myserver.database.windows.net) which has a default DTU quota.  Before you can restore a SQL Data Warehouse, verify that the your SQL server has enough remaining DTU quota for the database being restored. To learn how to calculate DTU needed or to request more DTU, see [Request a DTU quota change][Request a DTU quota change].

## Restore an active or paused database
To restore a database:

1. Get the list of database restore points using the Get Database Restore Points operation.
2. Begin your restore by using the [Create database restore request][Create database restore request] operation.
3. Track the status of your restore by using the [Database operation status][Database operation status] operation.

> [!NOTE]
> After the restore has completed, you can configure your recovered database by following [Configure your database after recovery][Configure your database after recovery].
> 
> 

## Restore a deleted database
To restore a deleted database:

1. List all of your restorable deleted databases by using the [List restorable dropped databases][List restorable dropped databases] operation.
2. Get the details for the deleted database you want to restore by using the [Get restorable dropped database][Get restorable dropped database] operation.
3. Begin your restore by using the [Create database restore request][Create database restore request] operation.
4. Track the status of your restore by using the [Database operation status][Database operation status] operation.

> [!NOTE]
> To configure your database after the restore has completed, see [Configure your database after recovery][Configure your database after recovery].
> 
> 

## Next steps
To learn about the business continuity features of Azure SQL Database editions, please read the [Azure SQL Database business continuity overview][Azure SQL Database business continuity overview].

<!--Image references-->

<!--Article references-->
[Azure SQL Database business continuity overview]: ../sql-database/sql-database-business-continuity.md
[Request a DTU quota change]: ./sql-data-warehouse-get-started-create-support-ticket.md#request-quota-change
[Configure your database after recovery]: ../sql-database/sql-database-disaster-recovery.md#configure-your-database-after-recovery
[How to install and configure Azure PowerShell]: /powershell/azureps-cmdlets-docs
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

<!--Other Web references-->
[Azure Portal]: https://portal.azure.com/
[Microsoft Web Platform Installer]: https://aka.ms/webpi-azps
