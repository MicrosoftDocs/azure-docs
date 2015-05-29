<properties 
   pageTitle="Restore an Azure SQL database using Point in Time Restore in the Azure portal" 
   description="Point in Time Restore, Microsoft Azure SQL Database, restore database, recover database, Azure Management Portal, Azure portal" 
   services="sql-database" 
   documentationCenter="" 
   authors="elfisher" 
   manager="jeffreyg" 
   editor="v-romcal"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="storage-backup-recovery" 
   ms.date="03/18/2015"
   ms.author="elfish; v-romcal"/>

# Restore an Azure SQL database using Point in Time Restore in the Azure portal

> [AZURE.SELECTOR]
- [Point in Time Restore - PowerShell](sql-database-point-in-time-restore-tutorial-powershell.md)
- [Point in Time Restore - REST API](sql-database-point-in-time-restore-tutorial-rest.md) 

## Overview

This tutorial shows you how to restore an Azure SQL database using Point in Time Restore in the [Azure portal](http://manage.windowsazure.com). Azure SQL Database has built-in backups to support self-service Point in Time Restore for Basic, Standard, and Premium service tiers.

Point in Time Restore creates a new database. The service automatically selects the service tier based on the backup used at the restore point. Make sure you have available quota on the logical server to create another database. If you'd like to request an increased quota, contact [Azure Support](http://azure.microsoft.com/support/options/).

## Restrictions and Security

* Point in Time Restore is enabled for all Basic, Standard, and Premium service tiers.

* Back-up retention periods are Basic, 7 days; Standard, 14 days; and Premium, 35 days.
 
* Only the administrator or co-administrator for the subscription can submit a restore request.

* The server level principal login will be the owner of the restored database.

* Web and Business Edition service tiers don't support Point in Time Restore.
 
	* If you have a Web or Business Edition database you can use database copy to get a transactional-consistent copy of your database, and then export the copied database to a Microsoft Azure storage account. For more information, see [How to: Use Database Copy (Azure SQL Database)](http://msdn.microsoft.com/library/azure/ff951631.aspx) and [How to: Use the Import and Export Service in Azure SQL Database](http://msdn.microsoft.com/library/azure/hh335292.aspx).

	* Web and Business Editions will be retired September 2015. For more information, see [Web and Business Edition Sunset FAQ](http://msdn.microsoft.com/library/azure/dn741330.aspx).

## How to: Restore an Azure SQL database using Point in Time Restore in the Azure portal

> [AZURE.VIDEO restore-a-sql-database-using-point-in-time-restore]

1. Sign in to the [Azure portal](http://manage.windowsazure.com) using your Microsoft account.

2. In the left navigation, click **SQL DATABASES**.
  
3. In the **DATABASES** list, click the database you want to restore. 

4. At the bottom of the page in the command bar, click **RESTORE**. This launches the **Specify restore settings** dialog box.

5. Choose a **DATABASE NAME**. By default, a database name is chosen for you, but you can change it if you want.

6. Choose the point in time to which your database should be restored. The point in time must be within the database's retention period.
	
7. Click the check mark to submit the restore request.

A restore may take some time to complete. To monitor the status of the restore, click the Status icon at the bottom right of the page in the command bar, and then click **DETAILS**.

## Next steps

For more information, see the following:

[Azure SQL Database Business Continuity](http://msdn.microsoft.com/library/azure/hh852669.aspx)

[Azure SQL Database Backup and Restore](http://msdn.microsoft.com/library/azure/jj650016.aspx)

[Azure SQL Database Point in Time Restore (blog)](http://azure.microsoft.com/blog/2014/10/01/azure-sql-database-point-in-time-restore/)