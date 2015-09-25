<properties 
   pageTitle="Restore a deleted Azure SQL database in the Azure portal" 
   description="Microsoft Azure SQL Database, restore deleted database, recover deleted database, Azure Management Portal, Azure portal" 
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
   ms.date="07/24/2015"
   ms.author="elfish; v-romcal"/>

# Restore a deleted Azure SQL database in the Azure portal

> [AZURE.SELECTOR]
- [Restore deleted database - PowerShell](sql-database-restore-deleted-database-tutorial-powershell.md)
- [Restore deleted database - REST API](sql-database-restore-deleted-database-tutorial-rest.md)

## Overview

This tutorial shows you how to restore a deleted Azure SQL database in the [Azure portal](http://manage.windowsazure.com). You can restore a database that was deleted during its retention period to the point it was deleted. The retention period is determined by the service tier of the database.

Restoring a deleted Azure SQL database creates a new database. The service automatically selects the service tier based on the backup used at the restore point. Make sure you have available quota on the logical server to create another database. If you'd like to request an increased quota, contact [Azure Support](http://azure.microsoft.com/support/options/).

## Restrictions and Security

* Restoring a deleted Azure SQL database is enabled for all Basic, Standard, and Premium service tiers. 

* Back-up retention periods are Basic, 7 days; Standard, 14 days; and Premium, 35 days.

* Only the administrator or co-administrator for the subscription can submit a restore request.

* The server level principal login will be the owner of the restored database.
 
* Web and Business Edition service tiers don't support restoring a deleted SQL database.
 
	* If you have a Web or Business Edition database you can use database copy to get a transactional-consistent copy of your database, and then export the copied database to a Microsoft Azure storage account. For more information, see [How to: Use Database Copy (Azure SQL Database)](http://msdn.microsoft.com/library/azure/ff951631.aspx) and [How to: Use the Import and Export Service in Azure SQL Database](http://msdn.microsoft.com/library/azure/hh335292.aspx).
	* Web and Business Editions will be retired September 2015. For more information, see [Web and Business Edition Sunset FAQ](http://msdn.microsoft.com/library/azure/dn741330.aspx).

## How to: Restore a deleted Azure SQL database in the Azure portal

> [AZURE.VIDEO restore-a-deleted-sql-database]

1. Sign in to the [Azure portal](http://manage.windowsazure.com) using your Microsoft account.

2. In the left navigation, click **SQL DATABASES**.

3. At the top of the page, click **DELETED DATABASES**. A list of **RESTORABLE DELETED DATABASES** is shown. 

4. Click the database you want to restore.

6. At the bottom of the page in the command bar, click **Restore**. This launches the **Specify restore settings** dialog box. 

7. Choose a **DATABASE NAME**. By default, a database name is chosen for you, but you can change it if you want.   

	* Note that a deleted database can only be restored to the server from which it was deleted, and to the point in time at which it was deleted.   

8. Click the check mark to submit the restore request.

A restore may take some time to complete. To monitor the status of the restore, click the Status icon at the bottom right of the page in the command bar, and then click **DETAILS**.

## Next steps

For more information, see the following: 

[Azure SQL Database Business Continuity](http://msdn.microsoft.com/library/azure/hh852669.aspx)

[Azure SQL Database Backup and Restore](http://msdn.microsoft.com/library/azure/jj650016.aspx) 