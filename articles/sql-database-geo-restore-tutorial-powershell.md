<properties 
   pageTitle="Recover an Azure SQL database using Geo-Restore in Azure PowerShell" 
   description="Geo-Restore, Microsoft Azure SQL Database, restore database, recover database, Azure PowerShell" 
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
   ms.author="elfish; v-romcal; v-stste"/>

# Recover an Azure SQL database using Geo-Restore in Azure PowerShell

> [AZURE.SELECTOR]
- [Geo-Restore - portal](sql-database-geo-restore-tutorial-management-portal.md)
- [Geo-Restore - REST API](sql-database-geo-restore-tutorial-rest.md)   

## Overview

This tutorial shows you how to recover an Azure SQL database using Geo-Restore in [Azure PowerShell](powershell-install-configure.md). Geo-Restore is the core disaster recovery protection included for all Basic, Standard, and Premium Azure SQL Databases service tiers.

## Restrictions and Security

See [Recover an Azure SQL database using Geo-Restore in the Azure portal](sql-database-geo-restore-tutorial-management-portal.md).

## How to: Recover an Azure SQL database with Geo-Restore in Azure PowerShell

> [AZURE.VIDEO restore-a-sql-database-using-geo-restore-with-microsoft-azure-powershell]

You must use certificate based authentication to run the following cmdlets. For more information, see the *Use the certificate method* section in [How to install and configure Azure PowerShell](powershell-install-configure.md#use-the-certificate-method).

1. Get the list of recoverable databases by using the [Get-AzureSqlRecoverableDatabase](http://msdn.microsoft.com/library/azure/dn720219.aspx) cmdlet. Specify the following parameter:
	* **ServerName** where the database is located.	

	`PS C:\>Get-AzureSqlRecoverableDatabase -ServerName "myserver"`

2. Choose the database you want to recover from by using the [Get-AzureSqlRecoverableDatabase](http://msdn.microsoft.com/library/azure/dn720219.aspx) cmdlet. Specify the following parameters:
	* **ServerName** where the database is located.
	* **DatabaseName** of the database you are recovering from.

	`PS C:\>$Database = Get-AzureSqlRecoverableDatabase -ServerName "myserver" –DatabaseName “mydb”`
	 
3. Begin the recover by using the [Start-AzureSqlDatabaseRecovery](http://msdn.microsoft.com/library/dn720224.aspx) cmdlet. Specify the following parameters:	
	* **SourceDatabase** you want to recover.
	* **TargetDatabaseName** of the database you are recovering to.
	* **TargetServerName** you want to recover the database to.

	Store what is returned to a variable called **$RestoreRequest**. This variable contains the restore request ID which is used for monitoring the status of a restore.

	`PS C:\>$RecoveryRequest = Start-AzureSqlDatabaseRecovery -SourceDatabase $Database –TargetDatabaseName “myrecoveredDB” –TargetServerName “mytargetserver”`
	
A database recovery may take some time to complete. To monitor the status of the recovery, use the [Get-AzureSqlDatabaseOperation](http://msdn.microsoft.com/library/azure/dn546738.aspx) cmdlet and specify the following parameters:

* **ServerName** of the database you are restoring to.
* **OperationGuid** which is the Restore Request ID that was stored in the **$RecoveryRequest** variable in Step 3.

	`PS C:\>Get-AzureSqlDatabaseOperation –ServerName “mytargetserver” –OperationGuid $RecoveryRequest.ID`

The **State** and **PercentComplete** fields show the status of the restore.

## Next steps

For more information, see the following:  

[Restore an Azure SQL database using Point in Time Restore in the Azure portal](sql-database-point-in-time-restore-tutorial-management-portal.md)

[Restore a deleted Azure SQL database in the Azure portal](sql-database-restore-deleted-database-tutorial-management-portal.md)

[Azure SQL Database Business Continuity](http://msdn.microsoft.com/library/azure/hh852669.aspx)

[Azure SQL Database Backup and Restore](http://msdn.microsoft.com/library/azure/jj650016.aspx)

[Azure SQL Database Geo-Restore (blog)](http://azure.microsoft.com/blog/2014/09/13/azure-sql-database-geo-restore/)

[Azure PowerShell](https://msdn.microsoft.com/library/azure/jj156055.aspx)
